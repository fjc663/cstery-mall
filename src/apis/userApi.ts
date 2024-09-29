import http from '@/utils/http'
import httpAdmin from '@/utils/httpAdmin'
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

// ======================================================================

// 管理员登录
export function adminLoginAPI(data: form): any {
    return httpAdmin({
        url: '/admin/user/login',
        method: 'Post',
        data: data
    })
}

// 获得管理员用户信息
export function getAdminUserInfoAPI(): any {
    return httpAdmin({
        url: '/admin/user'
    })
}

// 保存管理员用户信息
export function saveAdminInfoAPI(data: iuserInfo): any {
    return httpAdmin({
        url: 'admin/user',
        method: 'Put',
        data: data
    })
}

// 修改管理员密码
export function editAdminPasswordAPI(data: ieditPasswordDTO): any {
    return httpAdmin({
        url: 'admin/user/editPassword',
        method: 'Put',
        data: data
    })
}