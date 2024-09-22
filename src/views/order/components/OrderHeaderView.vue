<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useOrder } from '@/composables/useOrder';
import { useRouter } from 'vue-router';

// 路由对象，用于路由跳转
const router = useRouter();

// 使用组合函数获取订单数据
const { getOrdersByStatus } = useOrder();

// 当前选中的订单状态
const selectedStatus = ref<number>(-1);

// 获取订单数据
onMounted(() => {
    router.push('/orderManager');
    getOrdersByStatus(selectedStatus.value);
});

// 筛选订单
const handleStatusChange = () => {
    router.push('/orderManager');
    getOrdersByStatus(selectedStatus.value);
};
</script>

<template>
    <!-- 订单状态筛选 -->
    <el-tabs v-model="selectedStatus" @tab-change="handleStatusChange" type="card">
        <el-tab-pane label="全部订单" :name="-1"></el-tab-pane>
        <el-tab-pane label="待支付" :name="1"></el-tab-pane>
        <el-tab-pane label="已支付" :name="2"></el-tab-pane>
        <el-tab-pane label="已发货" :name="3"></el-tab-pane>
        <el-tab-pane label="已完成" :name="4"></el-tab-pane>
        <el-tab-pane label="已取消" :name="5"></el-tab-pane>
    </el-tabs>
</template>

<style lang="scss" scoped></style>
