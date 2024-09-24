import http from "@/utils/http";

// 请求无父级分类的分类
export function getCategoryListAPI(): any {
    return http({
        url: 'user/category/list'
    })
}

// 根据父级分类id获得分类
export function getSubCategoryListAPI(id: number): any {
    return http({
        url: `user/category/list/${id}`,
    })
}