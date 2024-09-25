<script lang="ts" setup>
import HeaderView from './components/HeaderView.vue';


</script>

<template>
    <div class="category-page">
        <el-container>
            <el-header>
                <header-view />
            </el-header>

            <el-main>
                <router-view/>
            </el-main>
        </el-container>
    </div>
</template>

<style scoped>
/* 页面整体布局 */
.category-page {
    padding: 20px;
    background: linear-gradient(135deg, #e9f8ff, #f5f5f5);
}
</style>