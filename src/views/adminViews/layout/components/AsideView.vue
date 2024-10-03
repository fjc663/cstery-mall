<script lang="ts" setup>
import router from '@/router';

</script>

<template>
    <el-menu :default-active="router.currentRoute.value.path" class="menu" router>
        <el-menu-item index="/admin">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-shoucang1"></use>
            </svg>
            <span>概览</span>
        </el-menu-item>
        <el-menu-item index="/admin/adminCategory">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-dizhi"></use>
            </svg>
            <span>分类管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/adminSpecification">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-dizhi"></use>
            </svg>
            <span>规格管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/adminProduct">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-dizhi"></use>
            </svg>
            <span>商品管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/adminOrder">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-dingdan"></use>
            </svg>
            <span>订单管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/adminInfo">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-yonghu"></use>
            </svg>
            <span>个人信息</span>
        </el-menu-item>
        <el-menu-item index="/admin/adminEditPassword">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-xiugaimima"></use>
            </svg>
            <span>修改密码</span>
        </el-menu-item>
    </el-menu>
</template>

<style scoped>
.menu {
    padding-top: 20px;
}
</style>