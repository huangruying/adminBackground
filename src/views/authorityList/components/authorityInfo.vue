<template>
  <div class="authorityInfo">
        <div v-for="(item,index) in dataList" :key="index">
            <el-checkbox-group v-model="item.arr">
                <div style="margin: 15px 0;">
                    <el-checkbox :label="item.id" border @change="changeList2(dataList)">{{item.name}}</el-checkbox>
                </div>
                <el-checkbox border size="mini" :indeterminate="item.isIndeterminate" v-model="item.bl" @change="handleCheckAllChange(item)" v-if="item.children && item.children.length>1" style="margin-left: 10px;">全选</el-checkbox>
                <checkList :checkBoxList="item" v-if="item.children" :checkBoxListCopy="item"></checkList>
            </el-checkbox-group>
        </div>
    <!-- <div style="display: none;">{{dataList}}</div> -->
  </div>
</template>

<script>
import checkList from './list'
import bus from '@/utils/bus'
export default {
    components: {
        checkList
    },
    props: {
        list: {
            type: Array,
            default() {
                return []
            }
        },
    },
    watch: {
    },
    data(){
        return{
            checkAll: false,
            isIndeterminate: true,
            infoList: []
        }
    },
    mounted(){
        bus.$on('checklist', (val) => {
            this.dataList.map(v=>{
                if(v.id == val.id){
                    v.arr = val.arr
                }
            })
            this.$emit('dataList', { dataList: this.dataList })
        });
    },
    computed: {
        dataList: {
            get() {
                return this.list
            },
            set(val) {
                this.$emit('update:list', val)
            }
        }
    },
    methods: {
        changeList2(val){
             this.$emit('dataList', { dataList: val })
        },
         handleCheckAllChange(val) {
             val.arr.map((v,index)=>{
                 if(!v){
                     val.arr.splice(index,1)
                 }
             })
            var arr = []
            this.dataList.map(v=>{
                if(v.id === val.id){
                   v.bl = !v.bl
                //  v.isIndeterminate = false
                   arr.push(val.id)
                   val.children.forEach(i=>{
                       arr.push(i.id)
                       if(i.children){
                         var arr2 = this.recursion(i.children)
                         if(val.bl){
                             v.arr = arr.concat(arr2)
                         }else{
                             v.arr = []
                             this.infoList = []
                         }
                       }
                   })
                }
             })
             this.$emit('dataList', { dataList: this.dataList })
             this.dataList = this.dataList
        },
        recursion (data){
            var arr = this.infoList
            data.forEach(v=>{
                arr.push(v.id)
                if(v.children){
                    this.recursion(v.children)
                }
            })
            return arr
        },
        handleCheckedCitiesChange(value) {
            // let checkedCount = value.length;
            // this.checkAll = checkedCount === this.cities.length;
            // this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
        }
    }
}
</script>

<style lang="less" scoped>
    .btnbox{
        background: #304156;
        display: block;
        color: #fff;
        height: 30px;
        padding: 0 10px;
        line-height: 30px;
        border-radius: 5px;
        text-align: center;
    }
    // .item_box{
    //     margin-left: 20px;
    // }
    // .flex{
    //     display: flex;
    //     align-items: center;
    // }
    // .item{
    //     color: #000;
    //     background: #000;
    //     height: 30px;
    //     width: 30px;
    // }
    // .item_list{
    //     margin: 15px 0;
    // }
    // .list{
    //     margin-left: 20px;
    // }
</style>