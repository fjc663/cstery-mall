import type { icategoryDTO, ipageQueryCategory } from "@/composables/interfaceType";
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

// 增加分类
export function addCategoryAPI(categoryDTO: icategoryDTO): any {
    return http({
        url: 'admin/category',
        method: 'Post',
        data: categoryDTO
    })
}

// 分页查询分类数据
export function pageQueryCategoryAPI(pageQueryCategory: ipageQueryCategory): any {
    return http({
        url: 'admin/category/page',
        params: pageQueryCategory
    })
}

// 修改分类
export function editCategoryAPI(categoryDTO: icategoryDTO): any {
    return http({
        url: 'admin/category',
        method: 'Put',
        data: categoryDTO
    })
}

// 删除分类
export function deleteCategoryAPI(id: number): any {
    return http({
        url: 'admin/category',
        method: 'Delete',
        params: {id: id}
    })
}