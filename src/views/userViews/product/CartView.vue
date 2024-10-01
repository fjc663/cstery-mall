<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import type { icart } from '@/composables/interfaceType/userInterface';
import { ElMessage } from 'element-plus';
import useCart from '@/composables/useCart';
import router from '@/router';
import { useRoute } from 'vue-router';
import type { TableInstance } from 'element-plus'


// 购物车数据、计算总价、请求当前用户购物车数据函数
const { cartItems, getCartItems, deleteAllCart, deleteCart, updateCartItemQuantity } = useCart();

// 选中的商品列表
const selectedItems = ref<icart[]>([]);

// 计算购物车总价
const cartSelectTotal = computed(() => {
    return selectedItems.value.reduce((total, item) => total + item.productPrice * item.quantity, 0);
});

// 更新商品数量
const updateQuantity = async (item: icart) => {
    updateCartItemQuantity(item);
};

// 删除商品
const removeItem = (item: icart) => {
    deleteCart(item);
};

// 清空购物车确认弹窗
const clearCartConfirmDialogVisible = ref<boolean>(false);

// 清空购物车
const clearCart = () => {
    deleteAllCart();
    clearCartConfirmDialogVisible.value = false;
};

// 创建订单
const createOrder = () => {
    if (selectedItems.value.length === 0) {
        ElMessage.warning('请至少选择一件商品进行结算');
        return;
    }

    // 获取选中的商品ID列表
    const selectedItemIds = selectedItems.value.map(item => item.id);

    // 通过路由传递选中的商品ID
    router.push({
        path: '/order',
        query: { selectedItems: JSON.stringify(selectedItemIds) },
    });
};

const cartTableRef = ref<TableInstance>()

// 从路由参数获取选中的商品ID列表
const route = useRoute();
const selectedItemIds: number[] = route.query.selectedCartIds ? JSON.parse(route.query.selectedCartIds as string) : [];

// 初始化购物车数据
onMounted(async () => {
    await getCartItems();

    // 找到被选中的商品并选中
    cartItems.value.forEach((item) => {
        if (selectedItemIds.includes(item.id)) {
            cartTableRef.value?.toggleRowSelection(item, true);  // 选中该行
        }
    });

});

// 返回上级路由
const goBack = () => {
  router.back();
}
</script>

<template>
    <!-- 清空购物车确认弹窗 -->
    <el-dialog v-model="clearCartConfirmDialogVisible" title="温馨提示" width="500">
        <span>您确定要清空购物车吗？</span>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="clearCartConfirmDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="clearCart">
                    确定
                </el-button>
            </div>
        </template>
    </el-dialog>

    <!-- 购物车页面 -->
    <el-container class="cart-page">
        <el-header>
            <el-page-header @back="goBack" />
            <h1 class="cart-title">购物车</h1>
        </el-header>

        <el-main>
            <el-table :data="cartItems" stripe border @selection-change="selectedItems = $event" ref="cartTableRef">
                <!-- 左侧选择框 -->
                <el-table-column type="selection" width="50" align="center" />

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
                <el-table-column label="商品规格">
                    <template #default="scope">
                        <div v-for="(value, key) in JSON.parse(scope.row.specifications)" :key="key">
                            <strong>{{ key }}:</strong> {{ value }}
                        </div>
                    </template>
                </el-table-column>

                <!-- 商品单价 -->
                <el-table-column prop="productPrice" label="单价">
                    <template #default="scope">
                        <span>￥{{ scope.row.productPrice }}</span>
                    </template>
                </el-table-column>

                <!-- 商品数量 -->
                <el-table-column label="数量">
                    <template #default="scope">
                        <el-input-number v-model="scope.row.quantity" :min="1" @change="updateQuantity(scope.row)" />
                    </template>
                </el-table-column>

                <!-- 小计 -->
                <el-table-column label="小计" width="100">
                    <template #default="scope">
                        <span>￥{{ (scope.row.productPrice * scope.row.quantity).toFixed(2) }}</span>
                    </template>
                </el-table-column>

                <!-- 操作（删除商品） -->
                <el-table-column label="操作" width="100">
                    <template #default="scope">
                        <el-button type="danger" @click="removeItem(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 总价和操作部分 -->
            <div class="cart-summary">
                <span class="cart-total">总计：￥{{ cartSelectTotal.toFixed(2) }}</span>
                <el-button type="primary" size="large" class="checkout-btn" @click="createOrder">去结算</el-button>
                <el-button type="danger" size="large" @click="clearCartConfirmDialogVisible = true"
                    class="clear-cart-btn">清空购物车</el-button>
            </div>
        </el-main>
    </el-container>
</template>

<style scoped>
.cart-page {
    padding: 30px;
    background-color: #f5f5f5;
    min-height: 100vh;
}

.cart-title {
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 20px;
    text-align: center;
}

.product-image {
    width: 80px;
    height: 80px;
    border-radius: 8px;
}

.el-table {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    max-width: 1800px;
    position: relative;
    margin: 0 auto;
}

.cart-summary {
    margin-top: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    font-size: 18px;
}

.cart-total {
    font-weight: bold;
    color: #f56c6c;
}

.checkout-btn {
    font-size: 18px;
    padding: 10px 30px;
}

.clear-cart-btn {
    font-size: 18px;
    padding: 10px 30px;
    margin-left: 20px;
}
</style>
