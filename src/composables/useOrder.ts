import { buyAgainAPI, cancelOrderAPI, completeOrderAPI, getOrderDetailAPI, getOrdersByStatusAPI, pageQueryOrderApi, payOrderAPI, setOrderStatusApi, submitOrderAPI } from "@/apis/orderApi";
import { ref } from "vue";
import type { result, iorderVO } from "./interfaceType/commonInterface";
import type { iorderDTO } from "./interfaceType/userInterface";
import { ElMessage } from "element-plus";
import type { ipageQueryOrder } from "./interfaceType/adminInterface";

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
  shippedAt: '',
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

// 支付订单
const payOrder = async (orderId: number): Promise<number> => {
  const res: result = await payOrderAPI(orderId);

  if (res.code === 0) {
    ElMessage.error(res.msg);
  }

  return res.code;
}

// 完成订单
const completeOrder = async (orderId: number) => {
  const res: result = await completeOrderAPI(orderId);

  if (res.code === 1) {
    ElMessage.success("订单完成");
  } else {
    ElMessage.error(res.msg);
  }
}

// 再次购买
const buyagain = async (orderId: number): Promise<number[]> => {
  const res: result = await buyAgainAPI(orderId);

  if (res.code === 0) {
    ElMessage.error(res.msg);
    return [];
  }

  return res.data;
}

// 提交订单
const submitOrder = async (orderData: iorderDTO): Promise<result> => {

  const res: result = await submitOrderAPI(orderData);

  if (res.code === 0) {
    ElMessage.error(res.msg);
  }

  return res;

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

    if (order.status === 1 && countdowns.value[order.id] === undefined) { // 仅针对待支付订单
      countdowns.value[order.id] = calculateRemainingTime(order.createdAt);
      // 每秒更新倒计时
      const timer = setInterval(() => {
        if (countdowns.value[order.id] > 0) {
          countdowns.value[order.id] -= 1000;
        } else {
          clearInterval(timer); // 清除计时器
          //   cancelOrder(order.id); // 倒计时为0，自动取消订单 ==> 后端实现定时取消
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

// =======================================================================================

// 管理端返回的商品数据
const adminOrders = ref<iorderVO[]>([]);
// 管理端查询到的商品总条数
const totalOrderAdmin = ref<number>(0);

// 管理端分页查询条件
const pageQueryAdmin = ref<ipageQueryOrder>({
    page: 1, // 当前页码
    pageSize: 20, // 当前页大小
});

// 管理端分页请求订单数据
const pageQueryOrder = async () => {
  const res: result = await pageQueryOrderApi(pageQueryAdmin.value);

  if (res.code === 0) {
    ElMessage.error(res.msg);
    return;
  }

  totalOrderAdmin.value = res.data.total;
  adminOrders.value = res.data.records;
}

// 修改订单状态
const setOrderStatus = async (id: number, status: number): Promise<number> => {
  const res: result = await setOrderStatusApi(id, status);

  if (res.code === 0) {
    ElMessage.error(res.msg);
  }

  return res.code;
}

export default function() {
  return {
    orders,
    orderDetail,
    getOrdersByStatus,
    getOrderDetail,
    cancelOrder,
    payOrder,
    completeOrder,
    submitOrder,
    buyagain,
    initCountdowns,
    countdowns,
    formatTime,

    adminOrders,
    pageQueryAdmin,
    totalOrderAdmin,
    pageQueryOrder,
    setOrderStatus
  }
}