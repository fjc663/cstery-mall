import type { iaddress } from "@/composables/interfaceType/userInterface";

import http from "@/utils/http";

// 请求当前用户的地址数据
export function geTAddressAPI(): any {
    return http({
        url: 'user/address'
    })
}

// 修改默认地址
export function setDefaultAddressAPI(id: number): any {
    return http({
        url: 'user/address/' + id,
        method: 'Put'
    })
}

// 添加新地址
export function addNewAddressAPI(newAddress: iaddress): any {
    return http({
        url: 'user/address',
        method: 'Post',
        data: newAddress
    })
}

// 修改地址
export function updateAddressAPI(address: iaddress): any {
    return http({
        url: 'user/address',
        method: 'Put',
        data: address
    })
}

// 删除地址
export function deleteAddressAPI(id: number): any {
    return http({
        url: 'user/address',
        method: 'Delete',
        params: {id: id}
    })
}