<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const activeMenu = ref('1');
const isCollapsed = ref(false);

// 页面跳转逻辑
const navigateTo = (routePath: string) => {
    router.push(`/admin/${routePath}`);
};

</script>

<template>
    <!-- 左侧导航栏 -->
    <el-aside class="sidebar" :width="isCollapsed ? '64px' : '280px'">
        <div class="sidebar-top">
            <!-- 用户信息 -->
            <div class="user-profile" v-if="!isCollapsed">
                <el-avatar size="large"
                    src="https://cstery-sky.oss-cn-beijing.aliyuncs.com/avatar/cfa9a669-2a89-4ea9-b577-1b28d6c3f6e3.png"></el-avatar>
                <div class="user-info">
                    <span class="user-name">管理员</span>
                    <span class="user-role">超级管理员</span>
                </div>
            </div>
            <!-- 折叠后的图标显示 -->
            <i v-else class="el-icon-user sidebar-icon"></i>
        </div>

        <!-- 菜单项 -->
        <el-menu :default-active="activeMenu" background-color="rgba(31, 45, 61, 0.8)" text-color="#bfcbd9"
            active-text-color="#ffd04b" class="el-menu-vertical-demo" :collapse="isCollapsed" unique-opened>
            <el-sub-menu index="1">
                <template #title>
                    <i class="el-icon-s-platform"></i>
                    <span v-if="!isCollapsed">仪表盘</span>
                </template>
                <el-menu-item index="1-1" @click="navigateTo('dashboard-overview')">
                    <i class="el-icon-data-analysis"></i> 总览
                </el-menu-item>
                <el-menu-item index="1-2" @click="navigateTo('dashboard-sales')">
                    <i class="el-icon-s-finance"></i> 销售分析
                    <el-badge class="badge" value="3" />
                </el-menu-item>
            </el-sub-menu>

            <el-sub-menu index="2">
                <template #title>
                    <i class="el-icon-s-goods"></i>
                    <span v-if="!isCollapsed">商品管理</span>
                </template>
                <el-menu-item index="2-1" @click="navigateTo('AdminCategory')">
                    <i class="el-icon-box"></i> 商品分类
                </el-menu-item>
                <el-menu-item index="2-2" @click="navigateTo('specifications')">
                    <i class="el-icon-box"></i> 商品规格
                </el-menu-item>
                <el-menu-item index="2-3" @click="navigateTo('products')">
                    <i class="el-icon-tickets"></i> 商品列表
                </el-menu-item>
            </el-sub-menu>

            <el-sub-menu index="3">
                <template #title>
                    <i class="el-icon-s-order"></i>
                    <span v-if="!isCollapsed">订单管理</span>
                </template>
                <el-menu-item index="3-1" @click="navigateTo('orders')">
                    <i class="el-icon-document"></i> 全部订单
                </el-menu-item>
                <el-menu-item index="3-2" @click="navigateTo('pending-orders')">
                    <i class="el-icon-time"></i> 待处理订单
                </el-menu-item>
            </el-sub-menu>

            <el-menu-item index="4" @click="navigateTo('settings')">
                <i class="el-icon-s-tools"></i>
                <span v-if="!isCollapsed">设置</span>
            </el-menu-item>
        </el-menu>

        <!-- 折叠按钮 -->
        <div class="collapse-btn" @click="isCollapsed = !isCollapsed">
            <i :class="isCollapsed ? 'el-icon-s-unfold' : 'el-icon-s-fold'"></i>
        </div>
    </el-aside>
</template>

<style lang="scss" scoped>

.sidebar {
    background: linear-gradient(135deg, #1f2d3d 0%, #32475b 100%);
    transition: width 0.3s ease;
    display: flex;
    flex-direction: column;
    box-shadow: 2px 0 15px rgba(0, 0, 0, 0.2);
    color: #fff;
    padding-right: 10px;

    .sidebar-top {
        padding: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;

        .user-profile {
            display: flex;
            align-items: center;
            gap: 10px;
            padding-bottom: 20px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);

            .user-info {
                display: flex;
                flex-direction: column;
                color: #fff;
                font-size: 14px;

                .user-name {
                    font-weight: bold;
                }

                .user-role {
                    color: rgba(255, 255, 255, 0.6);
                }
            }
        }

        .sidebar-icon {
            font-size: 28px;
            color: #fff;
        }
    }

    .el-menu {
        padding-top: 20px;

        .el-sub-menu__title {
            display: flex;
            align-items: center;

            i {
                margin-right: 10px;
            }
        }

        .badge {
            position: absolute;
            right: 10px;
            top: 10px;
        }

        .el-menu-item {
            i {
                margin-right: 10px;
            }

            &:hover {
                background-color: rgba(255, 255, 255, 0.1) !important;
            }
        }
    }

    .collapse-btn {
        padding: 10px;
        text-align: center;
        cursor: pointer;
        color: #fff;
        transition: all 0.3s;

        i {
            font-size: 20px;
        }
    }
}
</style>