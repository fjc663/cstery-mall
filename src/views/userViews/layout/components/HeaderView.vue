<script lang="ts" setup>
import router from '@/router';
import { useUserInfoStore } from '@/stores/userInfoStore';
import { useCartItemsNumStore } from '@/stores/useCartItemsNumStore';
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import useUser from '@/composables/useUser';
import useProduct from '@/composables/useProduct';

// 购物车商品数量
const cartItemsNumStore = useCartItemsNumStore();
const { cartItemsNum } = storeToRefs(cartItemsNumStore);

// 判断是否显示登录注册按钮
const useUserInfo = useUserInfoStore();
const isLogin = ref<boolean>(false);
if (useUserInfo.token.length != 0) {
    isLogin.value = true;
}

// 退出登录
const { logout } = useUser();

// 点击登录按钮触发
const toLogin = () => {
    router.push({ path: '/login', query: { isLogin: 1 } });
}

// 点击注册按钮触发
const toRegister = () => {
    router.push({ path: '/login', query: { isLogin: 0 } });
}

// 引入商品查询的相关逻辑
const { pageQuery, pageQueryByCategoryId } = useProduct();

// 搜索框内容
const searchQuery = ref<string>('')

// 跳到搜索结果页面
const search = () => {
    if (searchQuery.value.length <= 0) {
        return;
    }

    pageQuery.value.name = searchQuery.value;
    pageQuery.value.isALLData = true;

    pageQueryByCategoryId();
    router.push({ path: '/search', query: { searchQuery: searchQuery.value } });
}

const goToProfile = () => {
    router.push('/userInfo')
}

// 跳转购物车页面
const goToCart = () => {
    router.push('/cart');
}

</script>

<template>

    <el-container>
        <el-row class="nav-bar">
            <!-- 左边 Logo -->
            <el-col :span="4">
                <div class="logo">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-yuanzi"></use>
                    </svg>
                    ChengSteryMall
                </div>
            </el-col>

            <!-- 中间 菜单和搜索 -->
            <el-col :span="12" class="center-content">
                <!-- 菜单栏 -->
                <el-menu mode="vertical" class="main-menu" :default-active="router.currentRoute.value.path"
                    background-color="transparent" active-text-color="#f56c6c" router>
                    <el-menu-item index="/">首页</el-menu-item>
                    <el-menu-item index="/category">商品分类</el-menu-item>
                    <el-menu-item index="/price">特价专区</el-menu-item>
                    <el-menu-item index="/newItem">新品上架</el-menu-item>
                    <el-menu-item index="/about">关于我们</el-menu-item>
                </el-menu>

                <!-- 搜索框 -->
                <el-input v-model="searchQuery" placeholder="搜索商品..." clearable class="search-input">
                    <template #append>
                        <el-button @click="search">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-find"></use>
                            </svg>
                        </el-button>
                    </template>
                </el-input>

                <!-- 购物车图标 -->
                <el-badge v-if="cartItemsNum > 0" :value="cartItemsNum" class="cart-badge" type="danger">
                    <el-button @click="goToCart" class="cart-icon-button">
                        <el-icon>
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-gouwuche"></use>
                            </svg>
                        </el-icon>
                    </el-button>
                </el-badge>
                <el-button v-else @click="goToCart" class="cart-icon-button">
                    <el-icon>
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-gouwuche"></use>
                        </svg>
                    </el-icon>
                </el-button>
            </el-col>

            <!-- 右边 登录/用户信息 -->
            <el-col :span="4" class="nav-right">
                <div v-if="!isLogin" class="auth-buttons">
                    <el-button type="primary" @click="toLogin" link>登录</el-button>
                    <el-button type="success" @click="toRegister" link>注册</el-button>
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
                                <el-dropdown-item @click="logout" divided>退出登录</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
            </el-col>
        </el-row>
    </el-container>
</template>

<style scoped>
.nav-bar {
    position: fixed;
    /* 固定顶栏在页面顶部 */
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
    /* 确保顶栏在最前面 */
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #333;
    /* 适当设置背景颜色 */
    padding: 10px 20px;
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

.el-dropdown,
.el-dropdown * {
    outline: none;
}

.el-dropdown-menu {
    background-color: #f5f7fa;
    color: #333;
}

/* 购物车样式 */
.cart-badge {
    margin-left: 10px;
    position: relative;
    font-size: 18px;
    /* 调整购物车图标的大小 */
}

.cart-icon-button {
    border-radius: 50%;
    /* 让按钮变成圆形 */
    width: 40px;
    /* 按钮宽度 */
    height: 40px;
    /* 按钮高度 */
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    /* 调整购物车图标的大小 */
    transition: background-color 0.3s ease;
}

.cart-icon-button:hover {
    background-color: #a6c4e4;
    /* 鼠标悬停时，背景颜色变深 */
}

.el-badge .el-badge__content {
    font-size: 12px;
    /* 调整小红点上的数字字体大小 */
    height: 16px;
    /* 小红点的高度 */
    min-width: 16px;
    /* 小红点的最小宽度 */
    background-color: #ee0707;
    /* 突出小红点颜色 */
    border-radius: 50%;
    /* 小红点圆形 */
    top: -8px;
    /* 调整小红点的位置 */
    right: -8px;
    /* 调整小红点的位置 */
}
</style>