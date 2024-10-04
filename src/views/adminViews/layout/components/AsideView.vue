<script lang="ts" setup>
import router from '@/router';

</script>

<template>
    <el-menu :default-active="router.currentRoute.value.path" class="menu" router>
        <el-menu-item index="/admin">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-zonglan"></use>
            </svg>
            <span>总览</span>
        </el-menu-item>
        <el-menu-item index="/admin/adminCategory">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-fenleiguanli"></use>
            </svg>
            <span>分类管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/adminSpecification">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-guigeguanli"></use>
            </svg>
            <span>规格管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/adminProduct">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-shangpinguanli"></use>
            </svg>
            <span>商品管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/adminOrder">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-dingdanguanli"></use>
            </svg>
            <span>订单管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/user">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-yonghuguanli"></use>
            </svg>
            <span>用户管理</span>
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