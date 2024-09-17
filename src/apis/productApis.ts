import http from "@/utils/http";

// 根据分类id请求商品数据
export function getProductListByCategoryIdAPI(id: number): any {
    return http({
        url: 'user/product',
        params: {id: id}
    })
}