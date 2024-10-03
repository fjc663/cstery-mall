<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import useOrder from '@/composables/useOrder';

// 路由对象
const route = useRoute();
const router = useRouter();

// 使用组合函数获取订单数据
const { getOrdersByStatus, initCountdowns } = useOrder();

// 当前选中的订单状态
const selectedStatus = ref<number>(-1);

// 获取路由中的订单状态并初始化数据
const initOrderStatus = async () => {
    const status = route.query.status ? Number(route.query.status) : -1;  // 从路由参数获取订单状态
    selectedStatus.value = status;
    await getOrdersByStatus(status);
    initCountdowns();  // 初始化支付倒计时
};

// 监听路由变化，自动更新订单数据
watch(() => route.query.status, async (newStatus) => {
    const status = newStatus ? Number(newStatus) : -1;
    selectedStatus.value = status;
    await getOrdersByStatus(status);
});

// 处理标签切换时的状态变化
const handleStatusChange = (newStatus: number) => {
    // 当选项卡发生变化时，将状态同步到路由参数中
    router.push({path: "/orderManager" , query: { status: newStatus } });
};

// 页面加载时获取订单数据
onMounted(initOrderStatus);
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
