import http from "@/utils/http";

// 请求无父级分类
export function getCategoryListAPI(): any {
    return http({
        url: 'user/category/list'
    })
}