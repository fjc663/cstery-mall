// 管理端登录表单接口
export interface iadmin {
    username: string,
    password: string,
}

// 管理端后端返回的用户信息类型
export interface iadminUserInfo {
    id: number,
    username: string,
    email: string,
    phone: string,
    role: string,
    avatarUrl: string,
    gender: number,
    lastLogin: string,
}

// 管理端提交给后端分类信息接口
export interface iadminCategory {
    id?: number | null,
    name?: string,
    description?: string,
    imageUrl?: string,
    status?: number,
    sortOrder?: number,
    parentId?: number | null
}

// 管理端分页查询分类信息接口
export interface ipageQueryCategory {
    page: number,
    pageSize: number,
    name?: string,
    status?: number | null,
}

// 管理端提交分页查询条件查询商品信息接口
export interface iadminPageQueryProduct {
    page: number,
    pageSize: number,
    name?: string,
    status?: number | null,
    categoryId?: number | null,
}

// 管理端规格分页查询传输对象
export interface ipageQuerySpec {
    page: number,
    pageSize: number,
    name?: string,
    status?: number | null
}

// 管理端规格传给后端传输对象
export interface ispecification {
    id?: number | null,
    name?: string,
    description?: string,
    status?: number,
    specificationOptions?: string
}

// 管理端后端返回商品信息接口
export interface iadminProduct {
    id?: number | null,
    name?: string,
    description?: string,
    imageUrl?: string,
    price?: number,
    status?: number,
    stock?: number,
    categoryId?: number | null,
    sales?: number,
    specifications?: ispecification[]
    specIds?: number[]
}

// 管理端订单分页查询传输对象
export interface ipageQueryOrder {
    page: number,
    pageSize: number,
    status?: number | null
}

// 管理端总览页面数据
export interface ireport {
    totalSale: number,
    totalOrder: number,
    totalUser:number,
    hotProduct: string
}

// 管理端图表数据
export interface ichart {
    saleList: number[],
    statusList: number[],
    userList: number[],
    productNameList: string [],
    productList: number[],
    dataList: number[],
    cumulativeSaleList: number[],
    cumulativeUserList: number[]
}

// 分页查询条件
export interface ipagequeryUser {
    page: number,
    pageSize: number,
    username?: string,
    role?: string | null
}