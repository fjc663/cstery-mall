import http from "@/utils/http";

// 添加商品到收藏夹
export function addProductToFavoritesAPI(id: number): any {
    return http({
        url: `user/favorites/${id}`,
        method: 'Post'
    })
}

// 请求收藏夹商品数据
export function getFavoritesProductAPI(): any {
    return http({
        url: 'user/favorites'
    })
}

// 删除收藏夹商品数据
export function deleteFavoritesProductAPI(id: number): any {
    return http({
        url: `user/favorites/${id}`,
        method: 'Delete'
    })
}
