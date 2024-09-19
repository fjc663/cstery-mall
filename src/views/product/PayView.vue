<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

// 倒计时
const countdown = ref(15 * 60); // 15分钟倒计时，单位为秒
let timer: ReturnType<typeof setInterval> | null = null;

// 格式化倒计时为 mm:ss
const formattedCountdown = computed(() => {
    const minutes = Math.floor(countdown.value / 60);
    const seconds = countdown.value % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
});

// 开始倒计时
onMounted(() => {
    timer = setInterval(() => {
        if (countdown.value > 0) {
            countdown.value--;
        } else {
            clearInterval(timer!);
            cancelOrder(); // 倒计时结束，自动取消订单
        }
    }, 1000);
});

// 在组件卸载时清除定时器
onUnmounted(() => {
    if (timer) {
        clearInterval(timer);
    }
});

// 取消订单的函数
const cancelOrder = () => {
    console.log('倒计时结束，订单已取消');
    // 调用 API 取消订单的逻辑可以在这里实现
    // cancelOrderAPI(orderId)
};
</script>

<template>
    <el-container class="pay-page">
        <el-header>
            <!-- 标题和倒计时 -->
            <div class="pay-header">
                <h1 class="checkout-title">支付界面</h1>
                <el-tag type="danger" class="countdown">请在 {{ formattedCountdown }} 内完成支付</el-tag>
            </div>
        </el-header>
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
    margin-bottom: 10px;
    margin-left: 10px;
}
</style>