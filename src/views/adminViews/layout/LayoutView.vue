<script lang="ts" setup>
import useAdmin from '@/composables/useAdmin';
import AsideView from './components/AsideView.vue';
import { onMounted } from 'vue';


const { logout, admin, getAdminUserInfo } = useAdmin();

// 初始化管理员用户信息
onMounted(() => getAdminUserInfo())

</script>

<template>
    <el-container class="mall-manager">
        <!-- 头部 -->
        <el-header class="header">
            <div class="header-left">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-yuanzi"></use>
                </svg>
                <span class="header-title">ChengSteryMall</span>
            </div>
            <div class="header-right">
                <el-avatar :src="admin.avatarUrl" />
                <span class="user-name">{{ admin.username }} {{ admin.role === 'SUPER' ? '超级管理员' : '管理员' }}</span>
                <el-button type="text" @click="logout">退出</el-button>
            </div>
        </el-header>

        <el-container style="padding-left: 30px;">
            <!-- 左侧：侧边栏导航 -->
            <el-aside width="240px" class="sidebar">
                <AsideView />
            </el-aside>

            <!-- 右侧：个人信息和功能操作 -->
            <el-main class="main-content">
                <RouterView />
            </el-main>
        </el-container>

        <!-- 底部 -->
        <el-footer class="footer">
            <span>© 2024 ChengSteryMall电商管理平台 | 版权所有</span>
        </el-footer>
    </el-container>
</template>

<style scoped>
/* 整体布局样式 */
.mall-manager {
    min-height: 120vh;
    display: flex;
    flex-direction: column;
    background-color: #f5f5f5;
    padding: 30px;
}

/* 头部样式 */
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
}

.icon {
    font-size: 26px;
    font-weight: bold;
    color: #fff;
}

.header-left .header-title {
    font-size: 1.5rem;
    font-weight: bold;
}

.header-right {
    display: flex;
    align-items: center;
}

.header-right .user-name {
    margin-left: 10px;
    margin-right: 10px;
}

/* 侧边栏样式 */
.sidebar {
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

/* 主内容样式 */
.main-content {
    flex: 1;
    padding: 0 30px;
}

/* 底部样式 */
.footer {
    text-align: center;
    padding: 10px 0;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    margin-top: 20px;
}
</style>
