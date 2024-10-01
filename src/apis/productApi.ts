import type { iuserPageQueryProduct } from "@/composables/interfaceType/userInterface";
import type { iadminProduct, iadminPageQueryProduct } from "@/composables/interfaceType/adminInterface";
import http from "@/utils/http";
import httpAdmin from "@/utils/httpAdmin";

// 根据分类id请求商品数据
export function getProductListByCategoryIdAPI(id: number): any {
    return http({
        url: 'user/product/list',
        params: { id: id }
    })
}

// 根据商品id请求商品详细数据
export function getProductDetailAPI(id: number): any {
    return http({
        url: 'user/product',
        params: { id: id }
    })
}

// 请求特色商品数据
export function getFeaturedProductsAPI(): any {
    return http({
        url: 'user/product/featured'
    })
}

// 分页查询商品数据
export function pageQueryProductAPI(pageQuery: iuserPageQueryProduct): any {
    return http({
        url: 'user/product/page',
        params: pageQuery
    })
}

// ==============================================================================

// 分页查询商品数据
export function adminPageQueryProductAPI(pageQuery: iadminPageQueryProduct): any {
    return httpAdmin({
        url: 'admin/product/page',
        params: pageQuery
    })
}

// 添加商品数据
export function addProductAPI(product: iadminProduct): any {
    return httpAdmin({
        url: 'admin/product',
        method: 'Post',
        data: product
    })
}

// 修改商品数据
export function editProductAPI(product: iadminProduct): any {
    return httpAdmin({
        url: 'admin/product',
        method: 'Put',
        data: product
    })
}

// 删除商品数据
export function deleteProductAPI(id: number): any {
    return httpAdmin({
        url: 'admin/product',
        method: 'Delete',
        params: { id: id }
    })
}