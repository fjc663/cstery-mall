import http from "@/utils/http";

// 上传头像图片
export function uploadAvatarAPI(data: FormData): any {
    return http({
        headers: {"Content-Type": "multipart/form-data"},
        url: '/upload/avatar',
        method: 'Post',
        data: data
    })
}