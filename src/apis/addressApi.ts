import http from "@/utils/http";

// 请求当前用户的地址数据
export function geTAddressAPI(): any {
    return http({
        url: 'user/address'
    })
}