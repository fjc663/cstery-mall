<script lang="ts" setup>
import { ElCarousel, ElCarouselItem, ElButton, ElCard, ElRow, ElCol } from 'element-plus';
import { onMounted } from 'vue';
import { useCategory } from '@/composables/useCategory';
import { useRouter } from 'vue-router';
import type { category } from '@/composables/interfaceType';

const router = useRouter();

const { categories, getCategoryList, subCategories, getSubCategoryList } = useCategory();

const slides = [
    { title: "时尚新品", description: "抢先体验最新时尚单品", image: "http://localhost:8080/product/default_product.png" },
    { title: "折扣优惠", description: "全场五折，活动仅限今日", image: "http://localhost:8080/product/default_product.png" },
];

const products = [
    { id: 1, name: "奢华手表", price: 1599, image: "http://localhost:8080/product/default_product.png" },
    { id: 2, name: "高端皮鞋", price: 1299, image: "http://localhost:8080/product/default_product.png" },
    { id: 3, name: "经典包包", price: 1999, image: "http://localhost:8080/product/default_product.png" },
    { id: 4, name: "时尚太阳镜", price: 699, image: "http://localhost:8080/product/default_product.png" },
];

const news = [
    { id: 1, title: "新品发布", description: "全新的时尚系列，快来抢购吧！", image: "http://localhost:8080/product/default_product.png" },
    { id: 2, title: "黑色星期五", description: "黑五大促即将开启，准备好疯狂购物吧！", image: "http://localhost:8080/product/default_product.png" },
];

onMounted(async () => {
    await getCategoryList();

    categories.value.forEach(async (category) => {
        await getSubCategoryList(category.id);

        category.subCategories = { ...subCategories.value };
    })
})

// 跳转一级分类
const handleCategoryClick = (category: category) => {
    router.push({ path: `/subCategory/${category.id}`, query: { name: category.name } })
};

// 跳转二级分类
const handleClick = (category: category, subCategory: category) => {
    router.push({
        path: `/subCategory/${category.id}`,
        query: { name: category.name, subCategoryId: subCategory.id, subCategoryName: subCategory.name }
    })
};

</script>

<template>
    <div class="home-layout">
        <el-container>
            <el-aside width="200px" class="left-aside-container">
                <div v-for="(category, index) in categories.slice(0, categories.length / 2)" :key="index">
                    <span @click="handleCategoryClick(category)" class="category-name" style="cursor: pointer;">
                        {{ category.name }}:
                    </span>
                    <span class="sub-categories">
                        <span v-for="(subCategory, subIndex) in category.subCategories" :key="subIndex"
                            @click="handleClick(category, subCategory)" class="sub-category" style="cursor: pointer;">
                            {{ subCategory.name }}
                        </span>
                    </span>
                </div>
            </el-aside>

            <el-main class="carousel-container">
                <el-carousel height="400px" :interval="5000" arrow="always">
                    <el-carousel-item v-for="(slide, index) in slides" :key="index">
                        <img :src="slide.image" :alt="slide.title"
                            style="width: 100%; height: 100%; object-fit: cover;" />
                        <div class="carousel-text">
                            <h2>{{ slide.title }}</h2>
                            <p>{{ slide.description }}</p>
                            <el-button type="primary" class="shop-now">立即购买</el-button>
                        </div>
                    </el-carousel-item>
                </el-carousel>
            </el-main>

            <el-aside width="200px" class="right-aside-container">
                <div v-for="(category, index) in categories.slice(categories.length / 2)" :key="index">
                    <span @click="handleCategoryClick(category)" class="category-name" style="cursor: pointer;">
                        {{ category.name }}:
                    </span>
                    <span class="sub-categories">
                        <span v-for="(subCategory, subIndex) in category.subCategories" :key="subIndex"
                            @click="handleClick(category, subCategory)" class="sub-category" style="cursor: pointer;">
                            {{ subCategory.name }}
                        </span>
                    </span>
                </div>
            </el-aside>
        </el-container>

        <section class="products">
            <div class="container">
                <h2 style="margin: 15px 0;">热门商品</h2>
                <el-row :gutter="20">
                    <el-col v-for="product in products" :key="product.id" :span="6">
                        <el-card class="product-card">
                            <img :src="product.image" :alt="product.name" class="product-image" />
                            <div class="product-info">
                                <h3>{{ product.name }}</h3>
                                <p class="price">￥{{ product.price }}</p>
                                <el-button type="primary" class="add-to-cart">加入购物车</el-button>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </div>
        </section>

        <section class="news">
            <div class="container">
                <h2 style="margin: 15px 0;">最新动态</h2>
                <el-row :gutter="20">
                    <el-col v-for="newsItem in news" :key="newsItem.id" :span="8">
                        <el-card class="news-card">
                            <img :src="newsItem.image" :alt="newsItem.title" class="news-image" />
                            <h3>{{ newsItem.title }}</h3>
                            <p>{{ newsItem.description }}</p>
                        </el-card>
                    </el-col>
                </el-row>
            </div>
        </section>
    </div>


</template>

<style scoped>
.home-layout {
    height: 100vh;
    background-color: #f7f7f7;
    /* 背景色 */
}

.el-container {
    display: flex;
    /* 使用 Flexbox 布局 */
}

.left-aside-container,
.right-aside-container {
    margin: auto 0;
    padding: 20px;
    /* 内边距 */
    background-color: #fff;
    /* 白色背景 */
    border-radius: 10px;
    /* 圆角 */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    /* 阴影 */
}

.carousel-container {
    flex: 1;
    /* 占据剩余空间 */
    display: flex;
    flex-direction: column;
    /* 纵向布局 */
    justify-content: center;
    /* 垂直居中 */
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
    /* 加入阴影过渡 */
    background-color: #fff;
    /* 背景色 */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    /* 阴影 */
}

.product-card:hover,
.news-card:hover {
    transform: translateY(-5px);
    /* 上移 */
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    /* 增强阴影 */
}

.product-image,
.news-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-top-left-radius: 10px;
    /* 圆角 */
    border-top-right-radius: 10px;
    /* 圆角 */
}

.shop-now,
.add-to-cart {
    margin-top: 10px;
    border-radius: 5px;
    background-color: #f56c6c;
    /* 主按钮颜色 */
    border: none;
    transition: background-color 0.3s;
    /* 颜色过渡 */
}

.shop-now:hover,
.add-to-cart:hover {
    background-color: #ff7875;
    /* 悬停颜色 */
}

blockquote {
    font-style: italic;
    color: #555;
    border-left: 5px solid #f56c6c;
    padding-left: 15px;
    margin: 20px 0;
}

.category-name {
    font-weight: bold;
    color: #333;
    transition: color 0.3s;
    cursor: pointer;
    /* 光标变手形 */
}

.category-name:hover {
    color: #007BFF;
    /* 鼠标悬停时变色 */
}

.sub-categories {
    font-size: 14px;
    color: #555;
}

.sub-category {
    margin-right: 5px;
    transition: color 0.3s;
    /* 颜色过渡 */
}

.sub-category:hover {
    color: #e61717;
    /* 鼠标悬停时变色 */
}
</style>
