<script lang="ts" setup>
import { ElCarousel, ElCarouselItem, ElCard, ElRow, ElCol } from 'element-plus';
import { onMounted, ref } from 'vue';
import useCategory from '@/composables/useCategory';
import { useRouter } from 'vue-router';
import type { iuserCategory, ifeaturedproduct } from '@/composables/interfaceType/userInterface';
import useProduct from '@/composables/useProduct';

const router = useRouter();
const { categories, getCategoryList, subCategories, getSubCategoryList } = useCategory();
const { featuredProducts, getFeaturedProducts } = useProduct();

// 轮播图展示数据
const slides = ref<ifeaturedproduct[]>([]);

// 热门商品展示数据
const products = ref<ifeaturedproduct[]>([]);

// 新品展示数据
const news = ref<ifeaturedproduct[]>([]);

// 获得特色商品数据
onMounted(async () => {
    await getFeaturedProducts();
    slides.value = featuredProducts.value.filter((featuredProduct) => featuredProduct.type === 1);
    products.value = featuredProducts.value.filter((featuredProduct) => featuredProduct.type === 2);
    news.value = featuredProducts.value.filter((featuredProduct) => featuredProduct.type === 3);
});

// 获得轮播图两侧分类数据
onMounted(async () => {
    await getCategoryList();

    categories.value.forEach(async (category) => {
        await getSubCategoryList(category.id);
        category.subCategories = { ...subCategories.value };
    });
});

// 跳转到商品详细页面
const goToProductDetail = (productId: number) => {
    router.push({ path: `/productDetail/${productId}`, query: {isDisplayBreadcrumb: 0} });
};

// 跳转一级分类
const handleCategoryClick = (category: iuserCategory) => {
    router.push({ path: `/subCategory/${category.id}`, query: { name: category.name } });
};

// 跳转二级分类
const handleClick = (category: iuserCategory, subCategory: iuserCategory) => {
    router.push({
        path: `/subCategory/${category.id}`,
        query: { name: category.name, subCategoryId: subCategory.id, subCategoryName: subCategory.name },
    });
};
</script>

<template>
    <div class="home-layout">
        <el-container>
            <el-aside width="200px" class="left-aside-container">
                <div v-for="category in categories.slice(0, categories.length / 2)" :key="category.id">
                    <span @click="handleCategoryClick(category)" class="category-name" style="cursor: pointer;">
                        {{ category.name }}:
                    </span>
                    <span class="sub-categories">
                        <span v-for="subCategory in category.subCategories" :key="subCategory.id"
                            @click="handleClick(category, subCategory)" class="sub-category" style="cursor: pointer;">
                            {{ subCategory.name }}
                        </span>
                    </span>
                </div>
            </el-aside>

            <el-main class="carousel-container">
                <!-- 轮播图 -->
                <el-carousel height="400px" :interval="5000" arrow="always">
                    <el-carousel-item v-for="slide in slides" :key="slide.id">
                        <img :src="slide.product.imageUrl" :alt="slide.product.name"
                            style="width: 100%; height: 100%; object-fit: cover;cursor: pointer;"
                            @click="goToProductDetail(slide.product.id)" />
                        <div class="carousel-text">
                            <h2>{{ slide.product.name }}</h2>
                            <p>{{ slide.product.description }}</p>
                            <p class="product-price">￥{{ slide.product.price }}</p>
                        </div>
                    </el-carousel-item>
                </el-carousel>
            </el-main>

            <el-aside width="200px" class="right-aside-container">
                <div v-for="category in categories.slice(categories.length / 2)" :key="category.id">
                    <span @click="handleCategoryClick(category)" class="category-name" style="cursor: pointer;">
                        {{ category.name }}:
                    </span>
                    <span class="sub-categories">
                        <span v-for="subCategory in category.subCategories" :key="subCategory.id"
                            @click="handleClick(category, subCategory)" class="sub-category" style="cursor: pointer;">
                            {{ subCategory.name }}
                        </span>
                    </span>
                </div>
            </el-aside>
        </el-container>

        <!-- 热门商品 -->
        <section class="products">
            <div class="container">
                <h2 style="margin: 15px 0;">热门商品</h2>
                <el-row :gutter="20">
                    <el-col v-for="product in products" :key="product.id" :span="6">
                        <el-card class="product-card" @click="goToProductDetail(product.product.id)">
                            <img v-lazy="product.product.imageUrl" :alt="product.product.name" class="product-image" />
                            <div class="product-info">
                                <h3>{{ product.product.name }}</h3>
                                <p>{{ product.product.description }}</p>
                                <p class="product-price">￥{{ product.product.price }}</p>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </div>
        </section>

        <!-- 新品展示 -->
        <section class="news">
            <div class="container">
                <h2 style="margin: 15px 0;">最新动态</h2>
                <el-row :gutter="20">
                    <el-col v-for="newsItem in news" :key="newsItem.id" :span="8">
                        <el-card class="news-card" @click="goToProductDetail(newsItem.product.id)">
                            <img v-lazy="newsItem.product.imageUrl" :alt="newsItem.product.name" class="news-image" />
                            <h3>{{ newsItem.product.name }}</h3>
                            <p>{{ newsItem.product.description }}</p>
                            <p class="product-price">￥{{ newsItem.product.price }}</p>
                        </el-card>
                    </el-col>
                </el-row>
            </div>
        </section>
    </div>
</template>

<style scoped>
.home-layout {
    min-height: 100vh;
    background-color: #f7f7f7;
}

.el-container {
    display: flex;
}

.left-aside-container,
.right-aside-container {
    margin: auto 0;
    padding: 20px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    height: 400px;
}

.carousel-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.carousel-text {
    position: absolute;
    bottom: 40px;
    left: 50px;
    color: white;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
}

.product-card,
.news-card {
    border-radius: 10px;
    overflow: hidden;
    transition: transform 0.3s, box-shadow 0.3s;
    background-color: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    cursor: pointer;
}

.product-card:hover,
.news-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.product-image,
.news-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
}

/* 商品价格样式 */
.product-price {
    font-size: 24px;
    color: #f56c6c;
    font-weight: bold;
    margin-bottom: 20px;
}

.shop-now:hover,
.add-to-cart:hover {
    background-color: #ff7875;
}

.category-name {
    font-weight: bold;
    color: #333;
    transition: color 0.3s;
    cursor: pointer;
}

.category-name:hover {
    color: #007BFF;
}

.sub-categories {
    font-size: 14px;
    color: #555;
}

.sub-category {
    margin-right: 5px;
    transition: color 0.3s;
}

.sub-category:hover {
    color: #e61717;
}
</style>
