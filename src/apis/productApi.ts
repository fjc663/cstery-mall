import type { ipageQueryProduct } from "@/composables/interfaceType";
import http from "@/utils/http";

// 根据分类id请求商品数据
export function getProductListByCategoryIdAPI(id: number): any {
    return http({
        url: 'user/product/list',
        params: {id: id}
    })
}

// 根据商品id请求商品详细数据
export function getProductDetailAPI(id: number): any {
    return http({
        url: 'user/product',
        params: {id: id}
    })
}

// 请求特色商品数据
export function getFeaturedProductsAPI(): any {
    return http({
        url: 'user/product/featured'
    })
}

// 分页查询商品数据
export function pageQueryProductAPI(pageQuery: ipageQueryProduct): any {
    return http({
        url: 'user/product/page',
        params: pageQuery
    })
}
