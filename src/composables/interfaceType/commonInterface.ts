// 后端返回结果的统一数据接口
export interface result {
    code: number,
    msg: string,
    data: any
}

// 后端返回的订单商品数据类型
export interface iorderItem {
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
    orderItemVOList: iorderItem[]
}

// 修改密码传输的数据类型
export interface ieditPassword {
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
}