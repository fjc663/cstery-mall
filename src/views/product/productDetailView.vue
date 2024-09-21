<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { getProductDetailAPI } from '@/apis/productApi';
import { addPorductToCartAPI } from '@/apis/cartApi';
import { useCartItemsNumStore } from '@/stores/useCartItemsNumStore';
import { useRoute } from 'vue-router';
import type { iproduct, result, ispecifications, icartProduct } from '@/composables/interfaceType';
import { ElMessage } from 'element-plus';

const route = useRoute();

// 商品详细数据和对应的规格数据
const product = ref<iproduct>({
    id: 0,
    name: '',
    description: '',
    imageUrl: '',
    price: 0,
});
const specifications = ref<ispecifications[]>([]);

// 创建一个对象用于存储用户选择的每个规格
const selectedSpecs = ref<{[key:string]:string}>({});

// 根据id请求商品详细信息
const getProductDetail = async () => {
    const productId: number = Number(route.params.productId);
    const res: result = await getProductDetailAPI(productId);
    if (res.code === 0){
        ElMessage.error(res.msg);
        return;
    }

    product.value = res.data;

    specifications.value = res.data.specifications;

    specifications.value.forEach(specification => {
        selectedSpecs.value[specification.name] = specification.specificationOptions.split(',')[0];
    });
} 
onMounted(() => getProductDetail());

// 提交的购物车数据格式
const cartProduct = ref<icartProduct>({
    productId: Number(route.params.productId),  // 商品ID
    quantity: 1,  // 商品数量
    specifications: JSON.stringify(selectedSpecs.value)  // 商品规格
})

// 添加到购物车
const addToCart = async () => {
    cartProduct.value.specifications = JSON.stringify(selectedSpecs.value);
    const res:result = await addPorductToCartAPI(cartProduct.value);

    if (res.code === 1) {
        ElMessage.success("加入购物车成功");

        const cartItemsNumStore = useCartItemsNumStore();
        cartItemsNumStore.getCartItemsNum();
    }else {
        ElMessage.error(res.msg);
    }
}
</script>

<template>
    <el-container class="product-detail-page">
        <!-- 商品详情区域 -->
        <el-row :gutter="30" class="product-detail" justify="center" align="middle">
            <!-- 左侧：商品图片 -->
            <el-col :span="10" class="centered">
                <el-image :src="product.imageUrl" lazy fit="cover" class="product-image" />
            </el-col>

            <!-- 右侧：商品信息 -->
            <el-col :span="14" class="centered">
                <div class="product-info">
                    <!-- 商品名称 -->
                    <h1 class="product-title">{{ product.name }}</h1>
                    <!-- 商品价格 -->
                    <p class="product-price">￥{{ product.price }}</p>

                    <!-- 商品简介 -->
                    <p class="product-description">{{ product.description }}</p>

                    <!-- 动态规格选择区域 -->
                    <div v-for="specification in specifications" :key="specification.name" class="product-options">
                        <h3>{{ specification.name }}</h3>
                        <el-radio-group v-model="selectedSpecs[specification.name]">
                            <el-radio v-for="option in specification.specificationOptions.split(',')" :key="option" :label="option" :value="option">{{ option }}</el-radio>
                        </el-radio-group>
                    </div>

                    <!-- 数量选择 -->
                    <div class="product-quantity">
                        <h3>数量</h3>
                        <el-input-number v-model="cartProduct.quantity" :min="1" />
                    </div>

                    <!-- 购买按钮和收藏 -->
                    <div class="actions">
                        <el-button type="primary" size="large" class="custom-add-to-cart" @click="addToCart">
                            <i class="el-icon-shopping-cart-full"></i> 加入购物车
                        </el-button>
                        <el-button type="success" size="large" class="custom-favorite">
                            <i class="el-icon-star-off"></i> 收藏
                        </el-button>
                    </div>

                    <!-- 其他信息，如配送时间、服务 -->
                    <div class="extra-info">
                        <p><strong>配送时间：</strong> 预计2-3天内送达</p>
                        <p><strong>服务：</strong> 支持7天无理由退货</p>
                    </div>
                </div>
            </el-col>
        </el-row>
    </el-container>
</template>

<style scoped>
/* 页面整体样式，设置最小高度以填充屏幕 */
.product-detail-page {
    padding: 20px;
    background-color: #f5f5f5;
    min-height: 100vh;
    /* 设置最小高度为视口高度 */
    display: flex;
    align-items: flex-start;
    /* 整体靠上对齐 */
    justify-content: center;
}

/* 商品详情部分样式 */
.product-detail {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    /* 确保商品内容靠上 */
}

/* 居中图片和商品信息，同时靠上一点 */
.centered {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    margin-top: 40px;
    /* 适当控制上边距 */
}

/* 商品图片样式 */
.product-image {
    width: 100%;
    height: 600px;
    object-fit: cover;
    border-radius: 10px;
}

/* 商品信息样式 */
.product-info {
    padding: 20px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    text-align: left;
}

/* 商品标题样式 */
.product-title {
    font-size: 28px;
    font-weight: bold;
    color: #333;
    margin-bottom: 20px;
}

/* 商品价格样式 */
.product-price {
    font-size: 24px;
    color: #f56c6c;
    font-weight: bold;
    margin-bottom: 20px;
}

/* 商品描述样式 */
.product-description {
    font-size: 16px;
    color: #777;
    margin-bottom: 30px;
}

/* 商品规格选择和数量选择样式 */
.product-options,
.product-quantity {
    margin-bottom: 20px;
}

/* 按钮样式修正，修改按钮颜色，确保文字和图标居中 */
.actions {
    margin-top: 30px;
}

/* 加入购物车按钮（偏蓝色） */
.custom-add-to-cart {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 20px;
    height: 48px;
    font-size: 16px;
    background-color: #409eff;
    /* Element Plus 蓝色 */
    color: white;
    border-radius: 8px;
    margin-right: 20px;
}

.custom-add-to-cart:hover {
    background-color: #337ecc;
}

/* 收藏按钮（偏绿色） */
.custom-favorite {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 20px;
    height: 48px;
    font-size: 16px;
    background-color: #67c23a;
    /* Element Plus 绿色 */
    color: white;
    border-radius: 8px;
}

.custom-favorite:hover {
    background-color: #57a22b;
}

.custom-button .el-icon {
    margin-right: 5px;
    font-size: 20px;
}

/* 额外信息样式 */
.extra-info {
    margin-top: 30px;
    font-size: 14px;
    color: #888;
}
</style>