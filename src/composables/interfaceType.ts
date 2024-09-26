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
    imageUrl: string,
    subCategories?: category[]
}

// 后端返回商品信息接口
export interface iproduct {
    id: number,
    name: string,
    description: string,
    imageUrl: string,
    price: number
}

// 后端返回商品信息接口
export interface iproduct {
    id: number,
    name: string,
    description: string,
    imageUrl: string,
    price: number,
    isFavorites: boolean
}

// 后端返回特色商品信息接口
export interface ifeaturedproduct {
    id: number,
    type: number,
    product: iproduct
}

// 后端返回收藏商品信息接口
export interface ifavoritesproduct {
    createdAt: string,
    product: iproduct
}

// 后端返回商品规格信息接口
export interface ispecifications {
    name: string,
    specificationOptions: string
}

// 提交的购物车数据类型
export interface icartProduct {
    productId: number,
    quantity: number,
    specifications: string
}

// 后端返回的购物车数据类型
export interface icart {
    id: number,
    productId: number,
    productName: string,
    productImageUrl: string,
    productPrice: number,
    quantity: number,
    specifications: string
}

// 后端返回的地址数据类型
export interface iaddress {
    id?: number,
    receiverName: string,
    receiverPhone: string,
    province: string,
    city: string,
    district: string,
    detailedAddress: string,
    isDefault: boolean
}

// 提交给后端的订单数据类型
export interface iorder {
    totalAmount: number,
    paymentMethod: number,
    addressId: number,
    shippingCost?: number,
    discountAmount?: number,
    remark: string,
    selectedCardId: number[]
}

// 后端返回的用户信息类型
export interface iuserInfo {
    id: number,
    username: string,
    email: string,
    phone: string,
    avatarUrl: string,
    gender: number,
    birthdate: string,
    address: string,
    lastLogin: string,
}

// 后端返回的订单商品数据类型
export interface iorderItemVO {
    productName: string,
    quantity: number,
    productPrice: number,
    productImageUrl: string,
    specifications: string
}

// 后端返回的订单数据类型
export interface iorderVO {
    id: number,
    orderNumber: string,
    totalAmount: number,
    status: number,
    paymentStatus: number,
    paymentMethod: number,
    shippingAddress: string,
    shippingCost: number,
    itemCount: number,
    discountAmount: number,
    createdAt: string,
    paidAt: string,
    shippingAt: string,
    completedAt: string,
    canceledAt: string,
    remark: string,
    orderItemVOList: iorderItemVO[]
}

// 修改密码传输的数据类型
export interface ieditPasswordDTO {
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
}