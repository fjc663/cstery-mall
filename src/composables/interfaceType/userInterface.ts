// 用户端登录和注册表单接口
export interface iuser {
    username: string,
    email?: string,
    password: string,
    comfirmPwd?: string
}

// 用户端后端返回的用户信息类型
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

// 用户端后端返回分类信息接口
export interface iuserCategory {
    id: number,
    name: string,
    description: string,
    imageUrl: string,
    status?: number,
    sortOrder?: number,
    parentId?: number,
    subCategories?: iuserCategory[]
}

// 用户端提交分页查询条件查询商品信息接口
export interface iuserPageQueryProduct {
    page: number,
    pageSize: number,
    categoryId?: number,
    name?: string,
    isOrderBypriceASC?: boolean,
    isOrderBypriceDESC?: boolean,
    isALLData?: boolean
}

// 用户端后端返回商品信息接口
export interface iuserProduct {
    id: number,
    name: string,
    description: string,
    imageUrl: string,
    price: number,
    isFavorites: boolean
    stock: number,
    sales: number,
}

// 用户端后端返回特色商品信息接口
export interface ifeaturedproduct {
    id: number,
    type: number,
    product: iuserProduct
}

// 用户端后端返回收藏商品信息接口
export interface ifavoritesproduct {
    createdAt: string,
    product: iuserProduct
}

// 用户端后端返回商品规格信息接口
export interface ispecification {
    name: string,
    specificationOptions: string
}

// 用户端提交的购物车商品数据类型
export interface icartProduct {
    productId: number,
    quantity: number,
    specifications: string
}

// 用户端后端返回的购物车数据类型
export interface icart {
    id: number,
    productId: number,
    productName: string,
    productImageUrl: string,
    productPrice: number,
    quantity: number,
    specifications: string
}

// 用户端后端返回的地址数据类型
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

// 用户端提交给后端的订单数据类型
export interface iorderDTO {
    totalAmount: number,
    paymentMethod: number,
    addressId: number,
    shippingCost?: number,
    discountAmount?: number,
    remark: string,
    selectedCardId: number[]
}