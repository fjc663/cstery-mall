<script lang="ts" setup>
import { onBeforeRouteUpdate, useRoute } from "vue-router";
import { ref } from 'vue';
import { ArrowRight } from '@element-plus/icons-vue';


// 设置面包屑导航在路由跳转时更新
const categoryNmame = ref();
const isSub = ref<boolean>(false);
const route = useRoute();
if (route.query.name != null) {
    isSub.value = true;
    categoryNmame.value = route.query.name;
}

onBeforeRouteUpdate(to => {
    const query = to.query;
    
    if (query.name != null) {
        isSub.value = true;
        categoryNmame.value = query.name;
    }else{
        isSub.value = false;
        categoryNmame.value = '';
    }

});


</script>

<template>
    <!-- 面包屑导航 -->
    <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/category' }">商品分类</el-breadcrumb-item>
        <el-breadcrumb-item v-if="isSub">{{ categoryNmame }}</el-breadcrumb-item>
    </el-breadcrumb>

</template>

<style scoped></style>