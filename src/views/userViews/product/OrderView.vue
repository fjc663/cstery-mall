<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import type { iorder, iaddress, icart } from '@/composables/interfaceType';
import useCart from '@/composables/useCart';
import useOrder from '@/composables/useOrder';
import { useCartItemsNumStore } from '@/stores/useCartItemsNumStore';
import router from '@/router';
import useAddress from '@/composables/useAddress';
import { type FormRules, type FormInstance } from 'element-plus'
import { pcaTextArr } from 'element-china-area-data'
import { useRoute } from 'vue-router';

// 购物车数量状态管理
const cartItemsNumStore = useCartItemsNumStore();

// 购物车无商品时跳回原页面
if (cartItemsNumStore.cartItemsNum === 0) {
    router.push('/');
}

// 用户选择的地址ID和支付方式
const selectedAddressId = ref<number>(1);

// 地址数据
const { addresses, getAddress, addNewAddress } = useAddress();
// 请求地址数据
const getAndSetDefault = async () => {
    await getAddress();

    addresses.value.forEach(a => {
        if (a.isDefault) {
            selectedAddressId.value = a.id || -1;
            return;
        }
    })
}
onMounted(() => getAndSetDefault())

// 用户修改的地址数据暂存处
const selectedOptions = ref<string[]>([]);

// 地址表单校验规则
const rules = ref<FormRules<iaddress>>({
    receiverName: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { max: 50, message: '收货人名字字符长度最大为50', trigger: 'blur' },
    ],
    receiverPhone: [
        { required: true, message: '请输入手机号码', trigger: 'blur' },
        { min: 11, max: 11, message: "请输入11位手机号码", trigger: "blur" },
        { pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/, message: "请输入正确的手机号码" }
    ],
    detailedAddress: [
        { required: true, message: '请输入详细地址', trigger: 'blur' },
    ]
});

// 预校验表单数据
const currentAddressRef = ref<FormInstance>();

// 弹窗控制
const addressDialogVisible = ref(false);
const currentAddress = ref<iaddress>({
    receiverName: '',
    receiverPhone: '',
    province: '',
    city: '',
    district: '',
    detailedAddress: '',
    isDefault: false
});

// 打开添加新地址弹窗
const onAddNewAddress = () => {
    currentAddress.value = {
        receiverName: '',
        receiverPhone: '',
        province: '',
        city: '',
        district: '',
        detailedAddress: '',
        isDefault: false
    };
    selectedOptions.value = [];
    addressDialogVisible.value = true;
};

// 提交地址（添加或编辑）
const submitAddress = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.validate(async (valid) => {
        if (valid) {
            [currentAddress.value.province, currentAddress.value.city, currentAddress.value.district] = selectedOptions.value;
            await addNewAddress(currentAddress.value); // 调用添加新地址 API
            getAndSetDefault(); // 更新地址显示
            addressDialogVisible.value = false; // 关闭弹窗
        }
    })
};

// 路由对象
const route = useRoute();

//选中商品的 ID 列表
const selectedItemIds = ref<number[]>([]);

// 选中的购物车数据
const selectedCartItems = ref<icart[]>([]);

// 订单商品和商品总价
const { cartItems, getCartItems } = useCart();

// 初始化购物车数据
onMounted(async () => {
    await getCartItems();

    const querySelectedItems = route.query.selectedItems;
    if (querySelectedItems) {
        selectedItemIds.value = JSON.parse(querySelectedItems as string);
        console.log('选中的商品 ID:', selectedItemIds.value);
    }

    // 从 cartItems 中筛选出 selectedItemIds 中的商品
    selectedCartItems.value = cartItems.value.filter(item => selectedItemIds.value.includes(item.id));

    
});

// 订单金额  ---TODO:暂未被使用
const shippingCost = ref(0); // 运费
const discountAmount = ref(0); // 优惠金额

// 计算总金额
const totalAmount = computed(() => {
    return selectedCartItems.value.reduce((total, item) => total + item.productPrice * item.quantity, 0);
});

// 订单数据
const orderData = ref<iorder>({
    totalAmount: totalAmount.value, // 应付总金额
    paymentMethod: 1,  // 用户选择的地址ID和支付方式
    addressId: 0,
    remark: '',  // 订单备注
    selectedCardId: []
});

const {submitOrder} = useOrder();

// 提交订单
const onSubmitOrder = async () => {
    // 设置订单信息
    orderData.value.addressId = selectedAddressId.value;
    orderData.value.totalAmount = totalAmount.value;
    orderData.value.selectedCardId = selectedItemIds.value;

    // 提交订单
    await submitOrder(orderData.value);

    cartItemsNumStore.getCartItemsNum();
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
                    <el-radio v-for="address in addresses" :value="address.id" :key="address.id" class="address-item">
                        <div class="address-content">
                            <p><strong>{{ address.receiverName }}</strong> {{ address.receiverPhone }}</p>
                            <p>{{ address.province }} {{ address.city }} {{ address.district }} {{
                                address.detailedAddress
                            }}</p>
                        </div>
                    </el-radio>
                </el-radio-group>
                <el-button type="primary" @click="onAddNewAddress" style="margin-left: 10px;" size="small"
                    plain>添加新地址</el-button>
            </section>

            <!-- 订单商品信息 -->
            <section class="order-items-section">
                <h2 class="section-title">订单商品</h2>
                <el-table :data="selectedCartItems" border stripe>
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
                    <span>￥{{ totalAmount.toFixed(2) }}</span>
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
                    <el-radio :value="1">支付宝</el-radio>
                    <el-radio :value="2">微信支付</el-radio>
                    <el-radio :value="3">信用卡支付</el-radio>
                </el-radio-group>
            </section>

            <!-- 提交订单按钮 -->
            <section class="submit-section">
                <el-button type="primary" size="large" @click="onSubmitOrder">去支付</el-button>
            </section>
        </el-main>

    </el-container>

    <!-- 地址表单弹窗 -->
    <el-dialog v-model="addressDialogVisible" title="地址信息" width="500px">
        <el-form :model="currentAddress" label-width="100px" :rules="rules" ref="currentAddressRef">
            <el-form-item label="收货人" prop="receiverName">
                <el-input v-model="currentAddress.receiverName" placeholder="请输入收货人姓名"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="receiverPhone">
                <el-input v-model="currentAddress.receiverPhone" placeholder="请输入联系电话"></el-input>
            </el-form-item>
            <el-form-item label="省/市/区">
                <el-cascader :options="pcaTextArr" v-model="selectedOptions">
                </el-cascader>
            </el-form-item>
            <el-form-item label="详细地址" prop="detailedAddress">
                <el-input v-model="currentAddress.detailedAddress" placeholder="请输入详细地址"></el-input>
            </el-form-item>
            <el-form-item>
                <el-checkbox v-model="currentAddress.isDefault">设为默认地址</el-checkbox>
            </el-form-item>
        </el-form>

        <div class="dialog-footer">
            <el-button @click="addressDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submitAddress(currentAddressRef)">{{ '添加地址' }}</el-button>
        </div>
    </el-dialog>
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