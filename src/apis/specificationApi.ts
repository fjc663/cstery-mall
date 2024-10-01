import type { ipageQuerySpec, ispecification } from "@/composables/interfaceType/adminInterface";
import httpAdmin from "@/utils/httpAdmin";

// 分页查询规格
export function pageQuerySpecApi(pageQuerySpec: ipageQuerySpec): any{
    return httpAdmin({
        url: 'admin/spec/page',
        params: pageQuerySpec
    })
}

// 添加规格
export function addSpecApi (spec: ispecification): any {
    return httpAdmin({
        url: 'admin/spec',
        method: 'Post',
        data: spec
    })
}

// 修改规格
export function editSpecApi (spec: ispecification): any {
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

