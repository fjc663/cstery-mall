import http from '@/utils/http'
import type { form, ieditPasswordDTO, iuserInfo } from '@/composables/interfaceType'

// 用户注册
export function userRegisterAPI(data: form): any {
    return http({
        url: '/user/user/register',
        method: 'Post',
        data: data
    })
}

// 用户登录
export function userLoginAPI(data: form): any {
    return http({
        url: '/user/user/login',
        method: 'Post',
        data: data
    })
}

// 获得用户信息
export function getUserInfoAPI(): any {
    return http({
        url: '/user/user'
    })
}

// 修改用户信息
export function updateUserInfoAPI(data: iuserInfo): any {
    return http({
        url: 'user/user',
        method: 'Put',
        data: data
    })
}

// 修改密码
export function editPasswordAPI(data: ieditPasswordDTO): any {
    return http({
        url: '/user/user/editPassword',
        method: 'Put',
        data: data
    })
}