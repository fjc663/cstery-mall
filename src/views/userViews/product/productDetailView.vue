<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import type { icartProduct } from '@/composables/interfaceType';
import useProduct from '@/composables/useProduct';
import useCart from '@/composables/useCart';
import useFavorites from '@/composables/useFavorites'

const route = useRoute();
const productId: number = route.params.productId as unknown as number;

// 商品详细数据和对应的规格数据
const { product, specifications, getProductDetail } = useProduct();

// 创建一个对象用于存储用户选择的每个规格
const selectedSpecs = ref<{ [key: string]: string }>({});

// 根据id请求商品详细信息
onMounted(async () => {
    await getProductDetail(productId);

    if (specifications.value != null) {
        specifications.value.forEach((specification) => {
            selectedSpecs.value[specification.name] = specification.specificationOptions.split(',')[0];
        });
    }
});

// 提交的购物车数据格式
const cartProduct = ref<icartProduct>({
    productId: Number(route.params.productId), // 商品ID
    quantity: 1, // 商品数量
    specifications: JSON.stringify(selectedSpecs.value), // 商品规格
});

const { addPorductToCart } = useCart();

// 添加到购物车
const addToCart = () => {
    cartProduct.value.specifications = JSON.stringify(selectedSpecs.value);
    addPorductToCart(cartProduct.value);
};

const { addProductToFavorites, deleteFavoritesProduct } = useFavorites();

// 收藏商品
const addToFavorites = async (productId: number) => {
    await addProductToFavorites(productId);
    getProductDetail(productId);
}

// 移除收藏商品
const removeFavorites = async (productId: number) => {
    await deleteFavoritesProduct(productId);
    getProductDetail(productId);
}
</script>

<template>
    <el-container class="product-detail-page">
        <el-card class="product-card" shadow="hover">
            <!-- 商品详情区域 -->
            <el-row :gutter="20" class="product-detail">
                <!-- 左侧：商品图片 -->
                <el-col :span="10" class="product-image-container">
                    <el-image :src="product.imageUrl" lazy fit="cover" class="product-image" />
                </el-col>

                <!-- 右侧：商品信息和规格选择 -->
                <el-col :span="14" class="product-info-container">
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
                            <el-radio v-for="option in specification.specificationOptions.split(',')" :key="option"
                                :label="option" :value="option">{{ option }}</el-radio>
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
                        <el-button v-if="product.isFavorites" type="info" size="large" class="remove-custom-favorite"
                            @click="removeFavorites(product.id)">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-shoucang"></use>
                            </svg> 移除收藏
                        </el-button>
                        <el-button v-else type="success" size="large" class="custom-favorite"
                            @click="addToFavorites(product.id)">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-shoucang"></use>
                            </svg> 收藏
                        </el-button>
                    </div>
                </el-col>
            </el-row>

            <!-- 额外信息，如配送时间、服务 -->
            <div class="extra-info">
                <p><strong>配送时间：</strong> 预计2-3天内送达</p>
                <p><strong>服务：</strong> 支持7天无理由退货</p>
            </div>
        </el-card>
    </el-container>
</template>

<style scoped>
/* 页面整体样式 */
.product-detail-page {
    display: flex;
    justify-content: center;
    min-height: 100vh;
}

.product-card {
    padding: 30px;
    min-width: 1200px;
    max-width: 1200px;
    border-radius: 12px;
    background-color: #fff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 商品详情布局 */
.product-detail {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

/* 左侧商品图片容器 */
.product-image-container {
    display: flex;
    justify-content: center;
    align-items: center;
}

.product-image {
    width: 100%;
    height: 500px;
    object-fit: cover;
    border-radius: 10px;
}

/* 右侧商品信息 */
.product-info-container {
    padding-left: 20px;
}

/* 商品名称样式 */
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

/* 商品简介 */
.product-description {
    font-size: 16px;
    color: #666;
    margin-bottom: 30px;
}

/* 规格选择区域 */
.product-options {
    margin-bottom: 20px;
}

/* 数量选择 */
.product-quantity {
    margin-bottom: 20px;
}

/* 操作按钮样式 */
.actions {
    margin-top: 30px;
    display: flex;
    gap: 20px;
}

.custom-add-to-cart,
.remove-custom-favorite,
.custom-favorite {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 20px;
    height: 48px;
    font-size: 16px;
    border-radius: 8px;
    color: white;
}

.custom-add-to-cart {
    background-color: #409eff;
}

.custom-add-to-cart:hover {
    background-color: #337ecc;
}

.custom-favorite {
    background-color: #67c23a;
}

.custom-favorite:hover {
    background-color: #57a22b;
}

/* 额外信息 */
.extra-info {
    margin-top: 20px;
    font-size: 14px;
    color: #888;
}
</style>