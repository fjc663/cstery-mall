<script lang="ts" setup>
import AsideView from './components/AsideView.vue';
import MainView from './components/MainView.vue';
</script>

<template>
    <el-container class="ecommerce-admin">
        <!-- 左侧导航栏 -->
        <AsideView />

        <!-- 主内容区域 -->
        <MainView />


    </el-container>
</template>

<style lang="scss" scoped>
.ecommerce-admin {
    min-height: 100vh;
    display: flex;
}
</style>