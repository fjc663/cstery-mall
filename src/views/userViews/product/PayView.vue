<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import useOrder from '@/composables/useOrder';


const router = useRouter();
const route = useRoute();

// 获得要支付订单的id
const orderId: number = Number(route.params.orderId);
// 处理订单数据逻辑
const { orderDetail, getOrderDetail, initCountdowns, countdowns, formatTime, getOrdersByStatus, payOrder } = useOrder();

// 二维码支付弹窗
const showQrCode = () => {
    ElMessageBox({
        title: '扫码支付',
        message: `
          <div style="text-align: center; padding: 20px;">
            <img 
                style="width: 200px; height: 200px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);" 
                src="http://localhost:8080/pay.jpg" 
                alt="二维码"/>
            <p style="margin-top: 15px; font-size: 16px; font-weight: bold; color: #333;">请使用微信扫码支付</p>
            <p style="color: #999; font-size: 14px; margin-top: 5px;">支付完成后点击确认按钮</p>
          </div>
        `,
        dangerouslyUseHTMLString: true,
        confirmButtonText: '支付完成',
        cancelButtonText: '取消支付',
        showCancelButton: true,
        center: true,
    }).then(async () => {
        const code: number = await payOrder(orderId);
        if (code === 0) {
            return;
        }

        // 完成支付后选择跳转页面
        ElMessageBox({
            title: '支付成功',
            message: '您可以选择查看订单详情，或者等待5秒自动返回主页。',
            showCancelButton: true,
            confirmButtonText: '查看订单',
            cancelButtonText: '返回主页',
            type: 'success',
        }).then(() => {
            // 用户选择查看订单详情
            router.push(`/orderDetail/${orderId}`);
        }).catch(() => {
            // 用户选择返回主页
            router.push('/');
        });

        // 5秒后自动跳转到主页
        setTimeout(() => {
            router.push('/');
        }, 5000);
    }).catch(() => {
        // 用户取消支付
        ElMessage.info("取消支付");
    });
};


// 初始化页面
onMounted(async () => {
    await getOrdersByStatus(1);
    initCountdowns();

    await getOrderDetail(orderId);
    if (orderDetail.value.status === 1) {
        showQrCode(); // 页面加载时显示二维码
    }

});

onUnmounted(() => ElMessageBox.close())

</script>

<template>
    <el-container class="pay-page">
        <el-header>
            <!-- 标题和倒计时 -->
            <div class="pay-header">
                <h1 class="checkout-title">支付界面</h1>
                <el-tag type="danger" class="countdown">请在 {{ formatTime(countdowns[orderId]) }} 内完成支付</el-tag>
            </div>
        </el-header>

        <el-main>
            <div class="pay-main" v-if="orderDetail.status === 1">
                <!-- 支付二维码显示 -->
                <el-button type="primary" @click="showQrCode" plain>支付</el-button>
            </div>
        </el-main>
    </el-container>
</template>

<style scoped>
.pay-page {
    padding: 30px;
    background-color: #f5f5f5;
    min-height: 100vh;
}

.pay-header {
    display: flex;
    justify-content: center;
    align-items: center;
}

.countdown {
    font-size: 15px;
    margin-left: 10px;
}

.pay-main {
    display: flex;
    justify-content: center;
    margin-top: 50px;
}
</style>
