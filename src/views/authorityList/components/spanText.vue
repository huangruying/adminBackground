<template>
  <span class="flex">
    <div v-for="(item,index) in listData" :key="index">
        <span style="margin-right: 9px;">{{ item.name }}  </span>
        <span-span v-if="item.children && item.children.length>0" :listData="item.children"></span-span>
    </div>
  </span>
</template>

<script>
export default {
    name: 'span-span',
    props: {
        listData: {
            type: Array,
            default() {
                return []
            }
        },
    }
}
</script>

<style scoped>
.flex{
    display: flex;
}
</style>