import { buyAgainAPI, cancelOrderAPI, getOrderDetailAPI, getOrdersByStatusAPI, submitOrderAPI } from "@/apis/orderApi";
import { ref } from "vue";
import type { iorder, iorderVO, result } from "./interfaceType";
import { ElMessage } from "element-plus";
import router from "@/router";

// 订单数据
const orders = ref<iorderVO[]>([]);

// 订单详细数据
const orderDetail = ref<iorderVO>({
  id: 0,
  orderNumber: '',
  totalAmount: 0,
  status: 0,
  paymentStatus: 0,
  paymentMethod: 0,
  shippingAddress: '',
  shippingCost: 0,
  itemCount: 0,
  discountAmount: 0,
  createdAt: '',
  paidAt: '',
  shippingAt: '',
  completedAt: '',
  canceledAt: '',
  remark: '',
  orderItemVOList: []
});

// 请求订单数据
const getOrdersByStatus = async (status: number) => {
  const res: result = await getOrdersByStatusAPI(status);

  if (res.code === 0) {
    ElMessage.error(res.msg);
    return;
  }

  orders.value = res.data;
}

// 请求订单详细信息
const getOrderDetail = async (orderId: number) => {
  const res: result = await getOrderDetailAPI(orderId);

  if (res.code === 0) {
    ElMessage.error(res.msg);
    return;
  }

  orderDetail.value = res.data;
}

// 取消待支付订单
const cancelOrder = async (orderId: number): Promise<number> => {
  const res: result = await cancelOrderAPI(orderId);

  if (res.code === 0) {
    ElMessage.error(res.msg);
  }

  return res.code;
}

// 再次购买
const buyagain = async (orderId: number) => {
  const res: result = await buyAgainAPI(orderId);

  if (res.code === 0) {
    ElMessage.error(res.msg);
    return;
  }
}

// 提交订单
const submitOrder = async (orderData: iorder) => {

  const res: result = await submitOrderAPI(orderData);

  if (res.code === 0) {
    ElMessage.error(res.msg);
  } else {
    router.push("/pay");
  }

};

// 设置倒计时并自动取消订单
const countdowns = ref<{ [key: number]: number }>({}); // 保存每个订单的剩余时间

const calculateRemainingTime = (createdAt: string) => {
  const orderCreatedTime = new Date(createdAt).getTime();
  const currentTime = new Date().getTime();
  const timeDifference = Math.max(900000 - (currentTime - orderCreatedTime), 0); // 15分钟 (900秒)
  return timeDifference;
};

// 初始化倒计时
const initCountdowns = () => {
  orders.value.forEach(order => {

    if (order.status === 1) { // 仅针对待支付订单
      countdowns.value[order.id] = calculateRemainingTime(order.createdAt);
      // 每秒更新倒计时
      const timer = setInterval(() => {
        if (countdowns.value[order.id] > 0) {
          countdowns.value[order.id] -= 1000;
        } else {
          clearInterval(timer); // 清除计时器
          //   cancelOrder(order.id); // 倒计时为0，自动取消订单 === 后端实现定时取消
        }
      }, 1000);
    }
  });
};

// 格式化倒计时
const formatTime = (ms: number) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export function useOrder() {
  return {
    orders,
    orderDetail,
    getOrdersByStatus,
    getOrderDetail,
    cancelOrder,
    submitOrder,
    buyagain,
    initCountdowns,
    countdowns,
    formatTime
  }
}