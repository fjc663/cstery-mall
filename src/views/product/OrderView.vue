<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { submitOrderAPI } from '@/apis/orderApi';
import type { iorder, result } from '@/composables/interfaceType';
import { ElMessage } from 'element-plus';
import { useCart } from '@/composables/useCart';
import { useCartItemsNumStore } from '@/stores/useCartItemsNumStore';
import router from '@/router';
import { useAddress } from '@/composables/useAddress';

// 购物车数量状态管理
const cartItemsNumStore = useCartItemsNumStore();

// 购物车无商品时跳回原页面
if (cartItemsNumStore.cartItemsNum === 0) {
    router.push('/');
}

// 用户选择的地址ID和支付方式
const selectedAddressId = ref<number>(1);

// 地址数据
const { addresses, getAddress } = useAddress();
// 请求地址数据
onMounted(async () => {
    await getAddress();
 
    addresses.value.forEach(a => {
        if (a.isDefault) {
            selectedAddressId.value = a.id || -1;
            console.log(a.id);
            return;
        }
    })
})

// 添加新地址
const addNewAddress = () => {
    console.log('跳转到添加新地址页面');
};

// 订单商品和商品总价
const { cartItems, cartTotal } = useCart();

// 订单金额  ---TODO:暂未被使用
const shippingCost = ref(0); // 运费
const discountAmount = ref(0); // 优惠金额

// 订单数据
const orderData = ref<iorder>({
    totalAmount: cartTotal.value, // 应付总金额
    paymentMethod: 1,  // 用户选择的地址ID和支付方式
    addressId: 0,
    remark: ''  // 订单备注
});

const totalAmount = computed(() => cartTotal.value + shippingCost.value - discountAmount.value);



// 提交订单
const submitOrder = async () => {
    orderData.value.addressId = selectedAddressId.value;
    orderData.value.totalAmount = totalAmount.value;

    const res: result = await submitOrderAPI(orderData.value);

    if (res.code === 0) {
        ElMessage.error(res.msg);
    }

    cartItemsNumStore.removeCartItemsNum();
    router.push("/pay");
};
</script>

<template>
    <el-container class="checkout-page">
        <el-header>
            <!-- 标题 -->
            <div class="checkout-header">
                <h1 class="checkout-title">确认订单</h1>
            </div>
        </el-header>

        <el-main>
            <!-- 收货地址部分 -->
            <section class="address-section">
                <h2 class="section-title">收货地址</h2>
                <el-radio-group v-model="selectedAddressId" class="address-list">
                    <el-radio v-for="address in addresses" :label="address.id" :key="address.id" class="address-item">
                        <div class="address-content">
                            <p><strong>{{ address.receiverName }}</strong> {{ address.receiverPhone }}</p>
                            <p>{{ address.province }} {{ address.city }} {{ address.district }} {{
                                address.detailedAddress
                                }}</p>
                        </div>
                    </el-radio>
                </el-radio-group>
                <el-button type="primary" @click="addNewAddress" style="margin-left: 10px;">添加新地址</el-button>
            </section>

            <!-- 订单商品信息 -->
            <section class="order-items-section">
                <h2 class="section-title">订单商品</h2>
                <el-table :data="cartItems" border stripe>
                    <!-- 商品图片 -->
                    <el-table-column label="商品图片" width="120">
                        <template #default="scope">
                            <el-image :src="scope.row.productImageUrl" class="product-image" fit="cover" />
                        </template>
                    </el-table-column>

                    <!-- 商品名称 -->
                    <el-table-column prop="productName" label="商品名称">
                        <template #default="scope">
                            <span>{{ scope.row.productName }}</span>
                        </template>
                    </el-table-column>

                    <!-- 商品规格 -->
                    <el-table-column label="规格">
                        <template #default="scope">
                            <div v-for="(value, key) in JSON.parse(scope.row.specifications)" :key="key">
                                <strong>{{ key }}:</strong> {{ value }}
                            </div>
                        </template>
                    </el-table-column>

                    <!-- 商品数量 -->
                    <el-table-column prop="quantity" label="数量">
                        <template #default="scope">
                            <span>{{ scope.row.quantity }}</span>
                        </template>
                    </el-table-column>

                    <!-- 商品单价 -->
                    <el-table-column prop="unitPrice" label="单价">
                        <template #default="scope">
                            <span>￥{{ scope.row.productPrice }}</span>
                        </template>
                    </el-table-column>

                    <!-- 商品总价 -->
                    <el-table-column label="小计">
                        <template #default="scope">
                            <span>￥{{ (scope.row.productPrice * scope.row.quantity).toFixed(2) }}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </section>

            <!-- 订单备注 -->
            <section class="remark-section">
                <h2 class="section-title">订单备注</h2>
                <el-input v-model="orderData.remark" type="textarea" placeholder="例如：尽量发顺丰快递..." />
            </section>

            <!-- 订单金额明细 -->
            <section class="order-summary-section">
                <h2 class="section-title">订单金额明细</h2>
                <div class="summary-item">
                    <span>商品总金额：</span>
                    <span>￥{{ cartTotal.toFixed(2) }}</span>
                </div>
                <div class="summary-item">
                    <span>运费：</span>
                    <span>￥{{ shippingCost.toFixed(2) }}</span>
                </div>
                <div class="summary-item">
                    <span>优惠金额：</span>
                    <span>-￥{{ discountAmount.toFixed(2) }}</span>
                </div>
                <div class="summary-item total-amount">
                    <strong>应付总额：</strong>
                    <strong>￥{{ totalAmount.toFixed(2) }}</strong>
                </div>
            </section>

            <!-- 支付方式选择 -->
            <section class="payment-section">
                <h2 class="section-title">选择支付方式</h2>
                <el-radio-group v-model="orderData.paymentMethod">
                    <el-radio :label="1">支付宝</el-radio>
                    <el-radio :label="2">微信支付</el-radio>
                    <el-radio :label="3">信用卡支付</el-radio>
                </el-radio-group>
            </section>

            <!-- 提交订单按钮 -->
            <section class="submit-section">
                <el-button type="primary" size="large" @click="submitOrder">去支付</el-button>
            </section>
        </el-main>

    </el-container>
</template>

<style scoped>
.checkout-page {
    padding: 30px;
    background-color: #f5f5f5;
    min-height: 100vh;
}

.checkout-header {
    display: flex;
    justify-content: center;
    align-items: center;
}

.checkout-title {
    font-size: 28px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 20px;
}

.section-title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
}

.address-section,
.order-items-section,
.remark-section,
.order-summary-section,
.payment-section,
.submit-section {
    margin-bottom: 30px;
    margin-left: 30vh;
    margin-right: 30vh;
}

.address-item {
    margin-bottom: 15px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #fff;
}

.product-image {
    width: 80px;
    height: 80px;
    border-radius: 8px;
}

.summary-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
}

.total-amount {
    font-size: 20px;
    font-weight: bold;
    color: #f56c6c;
}

.submit-section {
    text-align: center;
}
</style>