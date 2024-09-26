<script lang="ts" setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import useFavorites from '@/composables/useFavorites';


// 收藏商品列表
const {favoritesProducts, getFavoritesProduct, deleteFavoritesProduct} = useFavorites();

// 路由
const router = useRouter();

// 获取收藏商品数据
const getFavoriteProducts = () => {
    getFavoritesProduct();
};

// 移除收藏商品
const removeFavoriteProduct = async (productId: number) => {
    await deleteFavoritesProduct(productId);
    getFavoriteProducts();
};

// 查看商品详情
const viewProductDetail = (productId: number) => {
    router.push({ path: `/productDetail/${productId}`, query: {isDisplayBreadcrumb: 0} });
};

// 页面加载时获取收藏数据
onMounted(() => {
    getFavoriteProducts();
});
</script>

<template>
    <el-container class="favorite-products-page">
        <el-header>
            <h1>我的收藏</h1>
        </el-header>

        <el-main v-if="favoritesProducts.length > 0">
            <el-row :gutter="20">
                <!-- 遍历收藏商品 -->
                <el-col v-for="item in favoritesProducts" :key="item.product.id" :span="6">
                    <el-card class="product-card" shadow="hover">
                        <img :src="item.product.imageUrl" alt="商品图片" class="product-image"
                            @click="viewProductDetail(item.product.id)" />

                        <div class="product-info">
                            <h3 class="product-name" @click="viewProductDetail(item.product.id)">
                                {{ item.product.name }}
                            </h3>
                            <p class="price">￥{{ item.product.price.toFixed(2) }}</p>
                            <p class="created-at">收藏时间: {{ new Date(item.createdAt).toLocaleString() }}</p>
                        </div>

                        <!-- 移除收藏按钮 -->
                        <div class="action-buttons">
                            <el-button type="danger" size="small"
                                @click="removeFavoriteProduct(item.product.id)">移除收藏</el-button>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </el-main>

        <!-- 如果没有收藏商品 -->
        <el-main v-else>
            <p class="empty-message">您还没有收藏任何商品！</p>
        </el-main>
    </el-container>
</template>

<style scoped>
.favorite-products-page {
    padding: 20px;
}

h1 {
    font-size: 24px;
    text-align: center;
    margin-bottom: 20px;
}

.product-card {
    border-radius: 10px;
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    margin-bottom: 10px;
}

.product-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.product-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
    cursor: pointer;
}

.product-info {
    margin: 10px 0;
    text-align: center;
}

.product-name {
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
}

.price {
    color: #f56c6c;
    font-size: 16px;
    font-weight: bold;
}

.created-at {
    font-size: 12px;
    color: #888;
}

.action-buttons {
    text-align: center;
}

.empty-message {
    text-align: center;
    font-size: 16px;
    color: #888;
    margin-top: 50px;
}
</style>
