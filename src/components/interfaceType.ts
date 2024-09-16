// 登录和注册表单接口
export interface form {
    username: string,
    email: string,
    password: string,
    comfirmPwd: string
}

// 后端返回结果数据接口
export interface result {
    code: number,
    msg: string,
    data: any
}

// 后端返回分类信息接口
export interface category {
    id: number,
    name: string,
    description: string,
    imageUrl: string
}