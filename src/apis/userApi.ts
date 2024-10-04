import http from '@/utils/http'
import httpAdmin from '@/utils/httpAdmin'
import type { iuser } from '@/composables/interfaceType/userInterface'
import type { iadmin, ipagequeryUser } from '@/composables/interfaceType/adminInterface'
import type { iuserInfo } from '@/composables/interfaceType/userInterface'
import type { iadminUserInfo } from '@/composables/interfaceType/adminInterface'
import type { ieditPassword } from '@/composables/interfaceType/commonInterface'


// 用户注册
export function userRegisterAPI(data: iuser): any {
    return http({
        url: '/user/user/register',
        method: 'Post',
        data: data
    })
}

// 用户登录
export function userLoginAPI(data: iuser): any {
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
export function editPasswordAPI(data: ieditPassword): any {
    return http({
        url: '/user/user/editPassword',
        method: 'Put',
        data: data
    })
}

// ======================================================================

// 管理员登录
export function adminLoginAPI(data: iadmin): any {
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
export function saveAdminInfoAPI(data: iadminUserInfo): any {
    return httpAdmin({
        url: 'admin/user',
        method: 'Put',
        data: data
    })
}

// 修改管理员密码
export function editAdminPasswordAPI(data: ieditPassword): any {
    return httpAdmin({
        url: 'admin/user/editPassword',
        method: 'Put',
        data: data
    })
}

// 分页查询用户数据
export function pageQueryUserApi(pageQuery: ipagequeryUser): any {
    return httpAdmin({
        url: 'admin/user/page',
        params: pageQuery
    })
}

// 设置职责
export function setRoleApi(id: number, role: string): any {
    return httpAdmin({
        url: `admin/user/role/${id}`,
        method: 'Put',
        params: { role: role }
    })
}

// 重置密码
export function resetPasswordApi(id: number, password: string): any {
    return httpAdmin({
        url: `admin/user/reset/${id}`,
        method: 'Put',
        params: { password: password }
    })
}