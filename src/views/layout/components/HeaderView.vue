<script lang="ts" setup>
import router from '@/router';
import { ref } from 'vue';
import { useUserInfoStore } from '@/stores/userInfoStore';
import { Search } from '@element-plus/icons-vue'

// 判断是否显示登录注册按钮
const useUserInfo = useUserInfoStore();
const isLogin = ref<boolean>(false);
if (useUserInfo.token.length != 0) {
    isLogin.value = true;
}

// 点击登录按钮触发
const onLogin = () => {
    router.push({ path: '/login', query: { isLogin: 1 } });
}

// 点击注册按钮触发
const onRegister = () => {
    router.push({ path: '/login', query: { isLogin: 0 } });
}

// 点击退出登录按钮触发
const onLogout = () => {
    useUserInfo.removeTokenAndUsername()
    router.push({ path: '/login', query: { isLogin: 1 } });
}


const searchQuery = ref<string>('')
console.log(useUserInfo.avatarUrl);


const search = () => {
    console.log('搜索:', searchQuery.value)
}

const goToProfile = () => {
    console.log('进入个人中心')
}


</script>

<template>
    <!-- 顶部导航栏 -->
    <el-header height="80px" class="nav-container">
        <el-container>
            <el-row class="nav-bar">
                <!-- 左边 Logo -->
                <el-col :span="4">
                    <div class="logo">ChengSteryMall</div>
                </el-col>

                <!-- 中间 菜单和搜索 -->
                <el-col :span="12" class="center-content">
                    <!-- 菜单栏 -->
                    <el-menu mode="vertical" class="main-menu" :default-active="router.currentRoute.value.path"
                        background-color="transparent" active-text-color="#f56c6c" router>
                        <el-menu-item index="/">首页</el-menu-item>
                        <el-menu-item index="/shop">商品分类</el-menu-item>
                        <el-menu-item index="/price">特价专区</el-menu-item>
                        <el-menu-item index="/newItem">新品上架</el-menu-item>
                        <el-menu-item index="/aboutUs">关于我们</el-menu-item>
                    </el-menu>

                    <!-- 搜索框 -->
                    <el-input v-model="searchQuery" placeholder="搜索商品..." class="search-input">
                        <template #append>
                            <el-button :icon="Search" @click="search"></el-button>
                        </template>
                    </el-input>
                </el-col>

                <!-- 右边 登录/用户信息 -->
                <el-col :span="4" class="nav-right">
                    <div v-if="!isLogin" class="auth-buttons">
                        <el-button type="primary" @click="onLogin" link>登录</el-button>
                        <el-button type="success" @click="onRegister" link>注册</el-button>
                    </div>

                    <div v-else class="user-info">
                        <el-dropdown>
                            <span class="el-dropdown-link">
                                <el-avatar :src="useUserInfo.avatarUrl" />
                                <span>{{ useUserInfo.username }}</span>
                            </span>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item @click="goToProfile">个人中心</el-dropdown-item>
                                    <el-dropdown-item @click="onLogout">退出登录</el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </div>
                </el-col>
            </el-row>
        </el-container>
    </el-header>
</template>

<style scoped>
/* 导航容器整体样式 */
.nav-container {
    background-color: #1f2d3d;
    padding: 0 20px;
    color: #fff;
}

.nav-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-top: 10px;
}

.logo {
    font-size: 26px;
    font-weight: bold;
    color: #fff;
}

.center-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 30px;
    /* 菜单和搜索框之间的间距 */
}

.main-menu {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: 500;
}

.search-input {
    width: 250px;
    /* 搜索框宽度 */
}

.nav-right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
}

.auth-buttons>.el-button {
    margin-left: 10px;
}

.user-info {
    display: flex;
    align-items: center;
}

.user-info .el-avatar {
    margin-right: 10px;
}

.el-menu-item {
    color: #fff;
}

.el-menu-item:hover,
.el-menu-item.is-active {
    background-color: transparent;
    border-bottom: 2px solid #f56c6c;
    /* 高亮选中的菜单项 */
    color: #f56c6c;
    /* 高亮文字颜色 */
}

.el-dropdown-link {
    cursor: pointer;
    display: flex;
    align-items: center;
    color: #fff;
}

.el-dropdown-menu {
    background-color: #f5f7fa;
    color: #333;
}
</style>