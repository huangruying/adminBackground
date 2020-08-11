<template>
  <div class="list">
        <div v-for="(item,index) in checkBoxList.children" :key="index" class="item_box">
            <div class="item_list" >
              <el-checkbox :label="item.id" @change="changeList">{{item.name}}</el-checkbox>
            </div>
            <template>
              <custom-list v-if="item.children && item.children.length>0" :checkBoxList="item" :checkBoxListCopy="checkedCities"></custom-list> 
            </template>
            <!-- <custom-list v-else :checkBoxList="item" :checkBoxListCopy="checkedCities"></custom-list>  -->
        </div>
  </div>
</template>

<script>
import MenuItem from './liSlot'
import bus from '@/utils/bus'
export default {
    name: 'custom-list',
    components: {
        MenuItem
    },
    props: {
        checkBoxList: {
            type: Object,
            default() {
                return {}
            }
        },
        checkBoxListCopy: {
            type: Object,
            default() {
                return {}
            }
        },
    },
    computed: {
        
    },
    mounted(){
        // console.log(this.checkBoxList);
    },
    watch: {
        
    },
    data(){
        return{
            checkAll: false,
            checkedCities: this.checkBoxListCopy,
            isIndeterminate: true
        }
    },
    methods: {
        changeList(val){
            var obj = this.checkedCities
            // console.log(obj);
            bus.$emit('checklist', { arr: obj.arr , id: obj.id})
        }
    }
}
</script>

<style lang="less" scoped>
.item_box{
    margin-left: 20px;
}
.flex{
    display: flex;
    align-items: center;
}
.item{
    color: #000;
    background: #000;
    height: 30px;
    width: 30px;
}
.item_list{
    margin: 15px 0;
}
.list{
    margin-left: 20px;
}
</style>