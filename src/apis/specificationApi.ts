import type { ipageQuerySpec, ispecificationDTO } from "@/composables/interfaceType";
import httpAdmin from "@/utils/httpAdmin";

// 分页查询规格
export function pageQuerySpecApi(pageQuerySpec: ipageQuerySpec): any{
    return httpAdmin({
        url: 'admin/spec/page',
        params: pageQuerySpec
    })
}

// 添加规格
export function addSpecApi (spec: ispecificationDTO): any {
    return httpAdmin({
        url: 'admin/spec',
        method: 'Post',
        data: spec
    })
}

// 修改规格
export function editSpecApi (spec: ispecificationDTO): any {
    return httpAdmin({
        url: 'admin/spec',
        method: 'Put',
        data: spec
    })
}

// 删除规格
export function deleteSpecApi (id: number): any {
    return httpAdmin({
        url: 'admin/spec',
        method: 'Delete',
        params: {id: id}
    })
}

