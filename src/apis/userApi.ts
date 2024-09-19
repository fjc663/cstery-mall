import http from '@/utils/http'
import {type form} from '@/composables/interfaceType'

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