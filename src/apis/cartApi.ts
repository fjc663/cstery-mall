import http from "@/utils/http";
import type { icartProduct } from "@/components/interfaceType";

// 添加商品到购物车
export function addPorductToCartAPI(data: icartProduct): any {
    return http({
        url: 'user/cart',
        method: 'Post',
        data: data
    })
}

// 获得当前用户的购物车商品数量（相同商品算一个）
export function getCartItemsNumAPI(): any {
    return http({
        url: 'user/cart/cartItemsNum',
    })
}

// 获得当前用户的所有购物车数据
export function getCartItemsAPI(): any {
    return http({
        url: 'user/cart/cartItems'
    })
}

// 更新购物车中商品数量
export function updateCartItemQuantityAPI(id: number, quantity: number): any {
    return http({
        url: 'user/cart',
        method: 'Put',
        params: {
            id: id,
            quantity: quantity
        }
    })
}

// 根据id删除购物车记录
export function deleteCartAPI(id: number): any {
    return http({
        url: 'user/cart',
        method: 'Delete',
        params: {
            id: id
        }
    })
}

// 清空购物车记录
export function deleteAllCartAPI(): any {
    return http({
        url: 'user/cart/all',
        method: 'Delete'
    })
}