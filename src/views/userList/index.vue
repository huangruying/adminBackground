<template>
  <div class="app-container">
    <div class="btn_box">
      <div></div>
      <div>
        <el-button type="primary" @click="newly">新增</el-button>
        <el-button type="primary" icon="el-icon-refresh" @click="resetGetData"></el-button>
      </div>
    </div>
    <el-table v-loading="loading" :data="data.data" border stripe fit style="width: 100%;">
      <el-table-column label="头像" prop="pic" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.pic" alt style="height:75px;" />
        </template>
      </el-table-column>
      <el-table-column label="用户名" prop="username" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" prop="mobile" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.mobile }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户角色" prop="userRole" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.userRole && scope.row.userRole.roleDesc">{{ scope.row.userRole.roleDesc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" prop="audit_status" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="compile(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="remove(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="data.total>0"
      :total="data.total"
      :page.sync="data.current_page"
      :limit.sync="data.per_page"
      @pagination="getPageData"
    />

    <!-- 新增编辑 -->
    <el-dialog
        width="70%"
        :title="textInner"
        :close-on-click-modal="false"
        :visible.sync="innerVisible"
         @close="close"
        center>
        <el-divider content-position="left"><span class="title">基本信息</span></el-divider>
        <div class="query clearFix" style="padding-top:30px;margin-bottom:30px;">
            <el-form label-position="right" ref="lobby" :rules="rules" label-width="150px" :model="lobbyObj" class="clearFix">
                <el-form-item label="用户名：" prop="username" style="width: 100%">
                    <el-input v-model="lobbyObj.username" style="width:50%" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="密码：" prop="password" style="width: 100%">
                    <el-input v-model="lobbyObj.password" style="width:50%" placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item label="手机号：" prop="mobile" style="width: 100%">
                    <el-input v-model="lobbyObj.mobile" style="width:50%" placeholder="请输入手机号"></el-input>
                </el-form-item>
                <el-form-item label="头像：" style="width: 100%">
                  <el-upload
                    action=""
                    :auto-upload="false"
                    :show-file-list="false"
                    list-type="picture-card"
                    :on-change="handleChange">
                    <img v-if="imageUrl" :src="imageUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                  <el-button size="mini" type="danger" @click="imageUrl = ''" style="margin-left: 45px;">删除</el-button>
              </el-form-item>
            </el-form>
        </div>
        <el-divider content-position="left"><span class="title">权限管理</span></el-divider>
        <div class="query clearFix" style="padding-top:30px;margin-bottom:30px;">
          <div class="roles_list">
              <div class="qin">请选择用户角色</div>
              <el-radio-group v-model="rolesList">
                <el-radio :label="item.id" v-for="(item,index) in rolesListCon" :key="index">{{item.roleDesc}}</el-radio>
              </el-radio-group>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="innerVisible = false">取 消</el-button>
          <el-button type="primary" :loading="loadingBtn" @click="lobbyDialog">确 定</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
import { findUserRolePermission , findBmRoleList , saveBmUserRole , saveYuyueUser , delYuyueByuId } from '@/api/guest/userList'
import { dotOssUpload } from '@/api/nodeList'
import Pagination from "@/components/Pagination"
export default {
    components: {
        Pagination
    },
    data(){
        return{
            loading: false,
            loadingBtn: false,
            innerVisible: false,
            lobbyObj: {},
            data: {
                current_page: 1,
                data: [],
                last_page: 1,
                per_page: 15,
                total: 0,
                link: ""
            },
            rules: {
                username: [
                    { required: true, message: '用户名不能为空', trigger: 'blur' }
                ],
                mobile: [
                    { required: true, message: '手机号码不能为空', trigger: 'blur' }
                ]
            },
            imageUrl: "",
            textInner: "",
            rolesListCon: [],
            rolesList: "",
            itemId: null
        }
    },
    created(){
        this.getData()
    },
    methods: {
        lobbyDialog(){
            var data = this.lobbyObj
            if(!data.password){
                delete data.password
            }
            if(!this.rolesList){
                this.$message("请选择用户角色！")
                return
            }
            data.pic = this.imageUrl
            data.roleId = this.rolesList
            if(this.itemId){
                data.id = this.itemId
                saveBmUserRole(data).then(res=>{
                    if(res.code == 200){
                        this.innerVisible = false
                        this.$message({
                            type: "success",
                            message: "操作成功！"
                        })
                    }else{
                        this.$message(res.msg)
                    }
                })
            }else{
                saveYuyueUser(data).then(res=>{
                    if(res.code == 200){
                        this.innerVisible = false
                        this.$message({
                            type: "success",
                            message: "操作成功！"
                        })
                    }else{
                        this.$message(res.msg)
                    }
                })
            }
        },
        newly(){
            this.textInner = "新增用户"
            this.innerVisible = true
            this.apilist()
        },
        remove(item){
            this.open('确定删除该用户？' , item.id)
        },
        open(text,id) {
            this.$confirm( text , '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
            this.loading = true
            delYuyueByuId({id: id}).then(res=>{
                if(res.code == 200){
                    this.$message({
                        type: 'success',
                        message: '操作成功!'
                    });
                    this.getData()
                }else{
                    this.$message({
                        type: 'info',
                        message: res.msg
                    })
                }
            })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });          
            });
        },
        compile(item){
            this.itemId = item.id
            this.textInner = "编辑信息"
            this.innerVisible = true
            this.lobbyObj.username = item.username
            this.lobbyObj.mobile = item.mobile
            this.imageUrl = item.pic
            if(item.userRole && item.userRole.roleId){
                this.rolesList = Number(item.userRole.roleId)
            }
            this.apilist()
        },
        close(){
            this.imageUrl = ""
            this.lobbyObj = {}
            this.rolesList = ""
            this.itemId = null
            this.getData()
        },
        resetGetData(){
            this.getData()
        },
        getPageData(e) {
          this.getData("page");
        },
        apiUploadImg(formData){
            dotOssUpload(formData).then(res => {
                if(res.code == 200){
                this.imageUrl = res.data
                this.$message({
                    type: 'success',
                    message: '上传成功！'
                })
                }else{
                this.$message.error('上传失败！');
                }
            })
        },
        handleChange(file, fileList){
            if (fileList) {
                    var formData = new FormData()
                    formData.append('file', file.raw)
                this.apiUploadImg(formData)
                } else {
                this.$message({ message: '请上传图片!' })
            }
        },
        apilist(){
            findBmRoleList().then(res=>{
                this.rolesListCon = res.data
            })
        },
        getData(filter){
            this.loading = true
            let data = {}
            if (filter && this.data.current_page > 1) {
                data.page = this.data.current_page;
            } else {
                this.data.current_page = 1;
            }
            data.pageNum = this.data.current_page
            data.pageSize = this.data.per_page
            findUserRolePermission(data).then(res=>{
                this.loading = false;
                // console.log(res);
                if (!res.data || res.data.length <= 0) {
                this.$message("暂无数据~")
                this.data = {
                    current_page: 1,
                    data: [],
                    last_page: 1,
                    per_page: 15,
                    total: 0,
                    link: ""
                }
                }
                if( res.data && res.data.length > 0){
                    this.data = res;
                    this.data.current_page = res.pageNum
                    this.data.per_page = res.pageSize
                    this.data.total = res.total
                    this.data.data.forEach(v=>{
                        
                    })
                }
            })
        }
    }
};
</script>

<style lang="less" scoped>
.roles_list{
  margin: 20px;
  .qin{
    margin: 20px;
    color: #ff0000;
  }
}
.title{
  font-size: 18px;
  font-weight: 600;
}
/deep/.el-dialog__header{
  background: #f8f8f8;
}
/deep/.el-divider--horizontal{
  margin: 0;
}
.query{
  width: 100%;
  border: 1px solid #DCDFE6;
  border-top: none;
  padding-top: 10px;
  padding-bottom: 20px;
}
.input{
  width: 200px;
  margin-left:20px;
  margin-top: 10px;
}
.picker{
  width: 250px;
  margin-left:20px;
  margin-top: 10px;
}
.btn_box{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px 0;
}
/deep/.el-table .warning-row {
    background: oldlace;
  }

/deep/.el-table .success-row {
    background: #f0f9eb;
}
.center{
  display: block;
  align-items: center;
  display: flex;
  justify-content: center;
}
// .fl{
//   float: left;
//   }
// .fr{
//   float: right;
//   }
/deep/.el-form-item{
  float: left;
}
.clearFix::before,
.clearFix::after{
      content: "";
      display: block;
      visibility: hidden;
      height: 0;
      line-height: 0;
      clear: both;
}
.boxUpload{   
    .textUp{
      position: relative;
      float: left;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-right: 4.5%;
      margin-top: 3%;
      margin-left: 3%;
      .uploadTransparency{
          display: block;
          width: 150px;
          height: 100px;
          opacity: 0;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 999;
        }
      .text{
        margin-top: 5px;
      }
      .btn{
        margin-top: 3px;
      }
    }
}
.avatar-uploader .el-upload:hover {
   border-color: #409EFF;
 }
.avatar {
   width: 148px;
   height: 148px;
   border-radius: 4px;
   cursor: pointer;
 }
</style>