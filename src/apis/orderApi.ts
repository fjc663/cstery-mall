import http from "@/utils/http";
import httpAdmin from "@/utils/httpAdmin";
import type { iorderDTO } from "@/composables/interfaceType/userInterface";
import type { ipageQueryOrder } from "@/composables/interfaceType/adminInterface";

// 提交订单数据
export function submitOrderAPI(data: iorderDTO): any {
    return http({
        url: 'user/order',
        method: 'Post',
        data: data
    })
}

// 根据订单状态请求订单数据
export function getOrdersByStatusAPI(status: number): any {
    return http({
        url: 'user/order/status/' + status
    })
}

// 根据订单id请求订单详细信息
export function getOrderDetailAPI(orderId: number): any {
    return http({
        url: 'user/order',
        params: {
            id: orderId
        }
    })
}

// 根据订单id取消订单
export function cancelOrderAPI(orderId: number): any {
    return http({
        url: `user/order/cancel/${orderId}`,
        method: 'Put'
    })
}

// 根据订单id支付订单
export function payOrderAPI(orderId: number): any {
    return http({
        url: `user/order/pay/${orderId}`,
        method: 'Put'
    })
}

// 根据订单id完成订单
export function completeOrderAPI(orderId: number): any {
    return http({
        url: `user/order/complete/${orderId}`,
        method: 'Put'
    })
}

// 根据订单id再次购买
export function buyAgainAPI(orderId: number): any {
    return http({
        url: `user/order/buyagain/${orderId}`,
        method: 'Post',
    })
}

// ============================================================

// 分页查询订单数据
export function pageQueryOrderApi(pageQueryuery: ipageQueryOrder): any {
    return httpAdmin({
        url: 'admin/order/page',
        params: pageQueryuery
    })
}

// 修改订单状态
export function setOrderStatusApi(id: number, status: number): any {
    return httpAdmin({
        url: `admin/order/status/${status}`,
        method: 'Put',
        params: { id: id }
    })
}