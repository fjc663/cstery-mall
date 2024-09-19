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