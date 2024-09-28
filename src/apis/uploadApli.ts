import http from "@/utils/http";

// 上传头像图片
export function uploadAvatarAPI(data: FormData): any {
    return http({
        headers: {"Content-Type": "multipart/form-data"},
        url: '/upload/user/avatar',
        method: 'Post',
        data: data
    })
}

// 上传分类图片
export function uploadCategoryAPI(data: FormData): any {
    return http({
        headers: {"Content-Type": "multipart/form-data"},
        url: '/upload/admin/category',
        method: 'Post',
        data: data
    })
}