<template>
    <el-container class="category-page">
        <!-- 页面标题 -->
        <el-header class="page-header">
            <h1>商品分类</h1>
        </el-header>

        <!-- 分类列表 -->
        <el-main>
            <el-row :gutter="30" class="category-grid">
                <!-- 单个分类卡片 -->
                <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="category in categories" :key="category.id"
                    class="category-col">
                    <el-card shadow="always" class="category-card">
                        <img :src="category.image" alt="category image" class="category-image" />
                        <div class="category-info">
                            <h3 class="category-title">{{ category.name }}</h3>
                            <p class="category-description">{{ category.description }}</p>
                            <el-button type="primary" @click="goToCategory(category.id)" size="mini"
                                class="category-btn">查看商品</el-button>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </el-main>
    </el-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

// 模拟的商品分类数据，数量为 20 个
const categories = ref([
    { id: 1, name: '智能手机', description: '最新款智能手机，涵盖各大品牌。', image: 'https://via.placeholder.com/300x200?text=智能手机' },
    { id: 2, name: '家用电器', description: '高效节能的家用电器，为您的生活增添便利。', image: 'https://via.placeholder.com/300x200?text=家用电器' },
    { id: 3, name: '电脑及配件', description: '各种高性能电脑及其配件，一应俱全。', image: 'https://via.placeholder.com/300x200?text=电脑及配件' },
    { id: 4, name: '时尚服饰', description: '潮流服饰，引领时尚风潮。', image: 'https://via.placeholder.com/300x200?text=时尚服饰' },
    { id: 5, name: '美妆护肤', description: '优质美妆护肤品，让你焕发光彩。', image: 'https://via.placeholder.com/300x200?text=美妆护肤' },
    { id: 6, name: '运动装备', description: '高品质运动装备，助你超越自我。', image: 'https://via.placeholder.com/300x200?text=运动装备' },
    { id: 7, name: '图书音像', description: '海量图书和音像制品，让你享受精神大餐。', image: 'https://via.placeholder.com/300x200?text=图书音像' },
    { id: 8, name: '母婴用品', description: '优质母婴用品，为宝宝提供贴心呵护。', image: 'https://via.placeholder.com/300x200?text=母婴用品' },
    { id: 9, name: '食品饮料', description: '美味食品和优质饮料，满足您的味蕾。', image: 'http://localhost:8080/category_jiu.png' },
    { id: 10, name: '家居生活', description: '精美家居用品，让生活更有品味。', image: 'https://via.placeholder.com/300x200?text=家居生活' },
    { id: 11, name: '宠物用品', description: '宠物用品大全，满足宠物的所有需求。', image: 'https://via.placeholder.com/300x200?text=宠物用品' },
    { id: 12, name: '汽车配件', description: '汽车配件与用品，一站式解决您的汽车问题。', image: 'https://via.placeholder.com/300x200?text=汽车配件' },
    { id: 13, name: '办公用品', description: '各类办公用品，提高工作效率。', image: 'https://via.placeholder.com/300x200?text=办公用品' },
    { id: 14, name: '健康保健', description: '优质保健品，守护您的健康。', image: 'https://via.placeholder.com/300x200?text=健康保健' },
    { id: 15, name: '数码配件', description: '数码产品及配件，提升您的电子设备体验。', image: 'https://via.placeholder.com/300x200?text=数码配件' },
    { id: 16, name: '珠宝饰品', description: '精美珠宝与饰品，彰显您的品味与气质。', image: 'https://via.placeholder.com/300x200?text=珠宝饰品' },
    { id: 17, name: '厨房用品', description: '现代厨房必备工具，提升烹饪体验。', image: 'https://via.placeholder.com/300x200?text=厨房用品' },
    { id: 18, name: '户外用品', description: '户外旅行装备，让探险更加轻松。', image: 'https://via.placeholder.com/300x200?text=户外用品' },
    { id: 19, name: '玩具模型', description: '高质量玩具与模型，带给孩子们快乐。', image: 'https://via.placeholder.com/300x200?text=玩具模型' },
    { id: 20, name: '文具用品', description: '优质文具用品，激发孩子们的学习兴趣。', image: 'https://via.placeholder.com/300x200?text=文具用品' },
])

// 跳转到具体的分类页面
const goToCategory = (id: number) => {
    console.log('跳转到分类:', id)
    // 可以使用 vue-router 进行页面跳转
}
</script>

<style scoped>
/* 页面整体布局 */
.category-page {
    padding: 20px;
    background: linear-gradient(135deg, #e9f8ff, #f5f5f5);
}

/* 标题样式 */
.page-header h1 {
    font-size: 36px;
    font-weight: bold;
    color: #333;
    text-align: center;
    margin-bottom: 50px;
}

/* 商品分类网格布局 */
.category-grid {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
}

/* 每个分类卡片的列样式：设置卡片间的上下间距 */
.category-col {
    margin-bottom: 30px;
    /* 增加卡片之间的垂直间距 */
}

/* 分类卡片样式 */
.category-card {
    border-radius: 12px;
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    background-color: #fff;
}

.category-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.category-image {
    width: 100%;
    height: 160px;
    object-fit: cover;
    border-bottom: 2px solid #f0f0f0;
}

.category-info {
    padding: 15px;
    text-align: center;
}

.category-title {
    font-size: 18px;
    font-weight: bold;
    color: #333;
    margin: 10px 0;
}

.category-description {
    font-size: 14px;
    color: #777;
    margin-bottom: 20px;
}

.category-btn {
    font-size: 14px;
}
</style>