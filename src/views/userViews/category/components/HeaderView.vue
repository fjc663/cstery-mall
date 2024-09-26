<script lang="ts" setup>
import { onBeforeRouteUpdate, useRoute, useRouter } from "vue-router";
import { ref } from 'vue';
import { ArrowRight } from '@element-plus/icons-vue';


const route = useRoute();
const router = useRouter();

// 一级分类时刷新
const categoryNmame = ref();
const isCate = ref<boolean>(false);
if (route.query.name != null) {
    isCate.value = true;
    categoryNmame.value = route.query.name;
}

// 二级分类时刷新
const subCategoryNmame = ref();
const redirect = ref();
const isSub = ref<boolean>(false);
if (route.query.subName != null) {
    isSub.value = true;
    subCategoryNmame.value = route.query.subName;
    redirect.value = route.query.redirect;
}

// 是否显示面包屑导航
const isDisplayBreadcrumb = ref<boolean>(true);
if (route.query.isDisplayBreadcrumb as unknown as number == 0) {
    isDisplayBreadcrumb.value = false;
}


// 设置面包屑导航在路由跳转时更新
onBeforeRouteUpdate(to => {
    const query = to.query;

    // 一级分类
    if (query.name != null) {
        isCate.value = true;
        categoryNmame.value = query.name;
    } else {
        isCate.value = false;
        categoryNmame.value = '';
    }


    // 二级分类
    if (query.subName != null) {
        isSub.value = true;
        subCategoryNmame.value = query.subName;
        redirect.value = query.redirect;
    } else {
        isSub.value = false;
        subCategoryNmame.value = '';
        redirect.value = '';
    }

});

// 返回上级路由
const goBack = () => {
  router.back();
}
</script>

<template>

    <el-page-header @back="goBack" v-if="!isDisplayBreadcrumb" />

    <!-- 面包屑导航 -->
    <el-breadcrumb :separator-icon="ArrowRight" v-if="isDisplayBreadcrumb">
        <el-breadcrumb-item :to="{ path: '/category' }">商品分类</el-breadcrumb-item>
        <el-breadcrumb-item v-if="isCate" :to="{ path: redirect, query: { name: categoryNmame } }">{{ categoryNmame
            }}</el-breadcrumb-item>
        <el-breadcrumb-item v-if="isSub">{{ subCategoryNmame }}</el-breadcrumb-item>
    </el-breadcrumb>

</template>

<style scoped></style>