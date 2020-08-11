<template>
  <div class="authorityList">
      <el-divider content-position="left"><span class="title">查询</span></el-divider>
      <div class="btn_box">
          <div>
              <el-button type="primary" icon="el-icon-refresh" @click="resetGetData"></el-button>
          </div>
          <div>
              <el-button type="primary" @click="newlyAuthority">新增</el-button>
          </div>
      </div>
      <el-table
      v-loading="loading"
      :data="data.data"
      border
      stripe
      fit
      style="width: 100%;">
      <!-- fit highlight-current-row -->
      <el-table-column label="角色编码" prop="roleName" align="center">
        <template slot-scope="scope">
            <span>{{  scope.row.roleName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色描述" prop="roleDesc" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.roleDesc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="权限集合" prop="rolePermissions" align="center">
            <!-- <div v-for="(value,index) in scope.row.userRoles" :key="index">{{ value.roleDesc }}</div> -->
            <template slot-scope="scope">
                <div v-for="(value,index) in scope.row.rolePermissions" :key="index" class="item_pop">
                    <el-popover trigger="hover" placement="top" :disabled="value.children? false: true">
                        <div v-for="item in value.children" :key="item.id" v-show="value.children" class="flex_item">{{ item.name }} >  <spanText v-if="item.children && item.children.length>0" :listData.sync="item.children"></spanText></div>
                        <div slot="reference" class="name-wrapper">
                            <el-tag size="medium">{{ value.name }}</el-tag>
                        </div>
                    </el-popover>
                </div>
            </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right" prop="audit_status" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="compile(scope.row)">编辑</el-button>
          <el-tooltip class="item" effect="dark" content="仅删除所有权限集合" placement="top" v-if="scope.row.rolePermissions && scope.row.rolePermissions.length>0">
              <el-button size="mini" type="danger" @click="remove(scope.row)">删除</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- <pagination
      v-show="data.total>0"
      :total="data.total"
      :page.sync="data.current_page"
      :limit.sync="data.per_page"
      @pagination="getPageData"
    /> -->
    <!-- 编辑 -->
    <el-dialog
      :title="dialogTitle"
      :close-on-click-modal="false"
      :visible.sync="authorityDialog"
      width="50%"
      @close="close"
      center>
        <el-input placeholder="请输入角色描述" v-model="roleDescribe">
            <template slot="prepend">角色描述</template>
        </el-input>
      <authorityInfo :list.sync="authorityList" @dataList="checkboxList"></authorityInfo>
      <span slot="footer" class="dialog-footer">
         <el-button @click="authorityDialog = false">取 消</el-button>
         <el-button type="primary" @click="confirmAuthority">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 新增,原本只新增角色编码和描述，后来改一起新增 -->
    <el-dialog 
      :title="dialogTitle"
      :close-on-click-modal="false"
      :visible.sync="authorityDialogNew"
      width="40%"
      @close="closeNew"
      center>
      <el-input placeholder="请输入角色编码" v-model="authority.roleName">
          <template slot="prepend">角色编码</template>
      </el-input>
      <el-input placeholder="请输入角色描述" v-model="authority.roleDesc" class="input_auth">
          <template slot="prepend">角色描述</template>
      </el-input>
      <authorityInfo :list.sync="authorityList" @dataList="checkboxList"></authorityInfo>
      <span slot="footer" class="dialog-footer">
         <el-button @click="authorityDialogNew = false">取 消</el-button>
         <el-button type="primary" @click="confirmAuthorityNew">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { findTreeMenus , findUserRolePermission , findRoleList , saveBmRolePermission , saveBmRole } from '@/api/authorityList'
import Pagination from "@/components/Pagination"
import authorityInfo from "./components/authorityInfo"
import spanText from './components/spanText'
export default {
    components: {
        Pagination,
        authorityInfo,
        spanText
    },
    data(){
        return{
            loading: false,
            roleDescribe: "",
            id: "",
            data: {
                current_page: 1,
                data: [],
                last_page: 1,
                per_page: 15,
                total: 0,
                link: ""
            },
            authority: {
                roleName: "",
                roleDesc: ""
            },
            authorityDialog: false,
            authorityDialogNew: false,
            dialogTitle: "",
            authorityList: [],
            infoArr: [],
            AuthList: []
        }
    },
    mounted(){
        this.getData()
    },
    methods: {
        confirmAuthorityNew(){
            var authority = this.authority
            if(!authority.roleName){
                this.$message("请输入角色编码！")
            }else if(!authority.roleDesc){
                this.$message("请输入角色描述!")
            }else{
                var arr = []
                this.AuthList.forEach(v=>{
                    if(v.arr){
                        arr = arr.concat(v.arr)
                    }
                })
                authority.permsIds = arr
                saveBmRole(authority).then(res=>{
                    if(res.code == 200){
                        this.authorityDialogNew = false
                        this.$message({
                            type: 'success',
                            message: "操作成功！"
                        })
                    }else{
                        this.$message(res.msg)
                    }
                })
            }
        },
        confirmAuthority(){
            var arr = []
            this.AuthList.forEach(v=>{
                if(v.arr){
                    arr = arr.concat(v.arr)
                }
            })
            var arr2 = []
            arr.forEach(i=>{
                var obj = {}
                obj.roleId = this.id
                obj.permsId = i
                arr2.push(obj)
            })
            let data = {}
            data.userRoleList = arr2
            data.roleDesc = this.roleDescribe
            data.id = this.id
            if(!data.roleDesc){
                this.$message("请输入角色描述!")
                return false
            }
            saveBmRolePermission(data).then(res=>{
                if(res.code == 200){
                    this.authorityDialog = false
                    this.$message({
                        type: 'success',
                        message: "操作成功！"
                    })
                }else{
                    this.$message(res.msg)
                }
            })
        },
        remove(item){
            this.open({roleDesc: item.roleDesc, id: item.id})
        },
        open(itemObj) {
            this.$confirm('此操作将删除所有权限集合, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                itemObj.userRoleList = []
                saveBmRolePermission(itemObj).then(res=>{
                    if(res.code == 200){
                        this.$message({
                            type: 'success',
                            message: "操作成功！"
                        })
                        this.getData()
                    }else{
                        this.$message(res.msg)
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });          
            });
        },
        checkboxList(e){
            this.AuthList = e.dataList
        },
        newlyAuthority(){
            this.authorityDialogNew = true
            this.dialogTitle = "新增角色"
            this.apiList()
        },
        compile(item){
            this.roleDescribe = item.roleDesc
            this.authorityDialog = true
            this.dialogTitle = "编辑权限"
            this.id = item.id
            if(item.rolePermissions){   // 初始化数据
               this.apiDataList(item.rolePermissions)
               this.AuthList = this.foreachItem(item.rolePermissions)
               //  console.log(this.AuthList);
            }else{
               this.apiList()
            }
        },
        apiList(){
            findTreeMenus().then(res=>{
               res.data.map(v=>{
                    v.bl = false
                    v.isIndeterminate = true
                    v.arr = []
               })
              this.authorityList = res.data
            })
        },
        close(){
            this.id = ""
            this.dialogTitle = ""
            this.infoArr = []
            this.AuthList = []
            this.roleDescribe = ""
            this.getData()
        },
        closeNew(){
            this.authority = {
                roleName: "",
                roleDesc: ""
            }
            this.infoArr = []
            this.getData()
        },
        foreachItem(item){
            item.forEach(v=>{
                this.AuthList.push(v.id)
                if(v.children){
                    this.foreachItem(v.children)
                }
            })
            return this.AuthList
        },
        apiDataList(rolePermissions){
            // console.log(rolePermissions);
            findTreeMenus().then(res=>{
               res.data.map(v=>{
                    v.bl = false
                    v.isIndeterminate = true
                    v.arr = []
                    rolePermissions.forEach(i=>{
                        if(i.id == v.id){
                            v.arr.push(i.id)
                            if(i.children){
                               var arr2 = this.recursion(i.children)
                               v.arr = v.arr.concat(arr2)
                            }
                        }
                    })
               })
              this.authorityList = res.data
            })
        },
        recursion (data){
            var arr = this.infoArr
            data.forEach(v=>{
                arr.push(v.id)
                if(v.children){
                    this.recursion(v.children)
                }
            })
            return arr
        },
        getData(filter){
            this.loading = true
            findRoleList().then(res=>{
                this.loading = false
                if(res.data && res.code == 200 && res.data.length>0){
                    this.data.data = res.data
                }else{
                    this.$message(res.msg)
                }
            })
        },
        resetGetData(){
            this.getData()
        },
        getPageData(e) {
            this.getData("page");
        },
    }
}
</script>

<style lang="less" scoped>
.flex_item{
    display: flex;
}
.btn_box{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px 0;
  >div{
      padding: 0 40px;
      margin-bottom: 20px;
  }
}
.item_pop{
    margin-top: 10px;
    cursor: pointer;
}
.srcPic{
    width: 100px;
    height: 80px;
    border-radius: 6px;
}
.input_auth{
    margin-top: 30px;
}
</style>