import { getOrderDetailAPI, getOrdersByStatusAPI } from "@/apis/orderApi";
import { ref } from "vue";
import type { iorderVO, result } from "./interfaceType";
import { ElMessage } from "element-plus";

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
    cancelAt: '',
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

export function useOrder() {
    return {
        orders,
        orderDetail,
        getOrdersByStatus,
        getOrderDetail
    }
}