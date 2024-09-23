import http from "@/utils/http";
import type { iorder } from "@/composables/interfaceType";

// 提交订单数据
export function submitOrderAPI(data: iorder ): any {
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

// 根据订单id再次购买
export function buyAgainAPI(orderId: number): any {
    return http({
        url: `user/order/buyagain/${orderId}`,
        method: 'Post',
    })
}