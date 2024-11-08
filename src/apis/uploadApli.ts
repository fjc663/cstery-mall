import http from "@/utils/http";
import httpAdmin from "@/utils/httpAdmin";

// 上传头像图片
export function uploadAvatarAPI(data: FormData): any {
    return http({
        headers: {"Content-Type": "multipart/form-data"},
        url: '/user/user/upload/avatar',
        method: 'Post',
        data: data
    })
}

// ==============================================================

// 上传分类图片
export function uploadCategoryAPI(data: FormData): any {
    return httpAdmin({
        headers: {"Content-Type": "multipart/form-data"},
        url: '/admin/category/upload',
        method: 'Post',
        data: data
    })
}

// 上传管理员头像图片
export function uploadAdminAvatarAPI(data: FormData): any {
    return httpAdmin({
        headers: {"Content-Type": "multipart/form-data"},
        url: '/admin/user/upload/avatar',
        method: 'Post',
        data: data
    })
}

// 上传商品图片
export function uploadProductAPI(data: FormData): any {
    return httpAdmin({
        headers: {"Content-Type": "multipart/form-data"},
        url: '/admin/product/upload',
        method: 'Post',
        data: data
    })
}