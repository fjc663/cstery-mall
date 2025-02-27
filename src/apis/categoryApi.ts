import type { iadminCategory, ipageQueryCategory } from "@/composables/interfaceType/adminInterface";
import http from "@/utils/http";
import httpAdmin from "@/utils/httpAdmin";

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

// =====================================================================

// 增加分类
export function addCategoryAPI(category: iadminCategory): any {
    return httpAdmin({
        url: 'admin/category',
        method: 'Post',
        data: category
    })
}

// 分页查询分类数据
export function pageQueryCategoryAPI(pageQueryCategory: ipageQueryCategory): any {
    return httpAdmin({
        url: 'admin/category/page',
        params: pageQueryCategory
    })
}

// 修改分类
export function editCategoryAPI(category: iadminCategory): any {
    return httpAdmin({
        url: 'admin/category',
        method: 'Put',
        data: category
    })
}

// 删除分类
export function deleteCategoryAPI(id: number): any {
    return httpAdmin({
        url: 'admin/category',
        method: 'Delete',
        params: {id: id}
    })
}

// 获得所有启用的二级分类
export function getAllSubCategoryAPI(): any {
    return httpAdmin({
        url: 'admin/category/allSub',
    })
}