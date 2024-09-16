<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import type { category, result } from '@/components/interfaceType';
import { getCategoryListAPI } from '@/apis/categoryApi';
import router from '@/router';

// 商品无父级分类数据
const categories = ref<category[]>([])

// 获取无父级分类
const getCategoryList = async () => {
    const res: result = await getCategoryListAPI();
    categories.value = res.data;
}

onMounted(() => getCategoryList())

// 跳转到具体的分类页面
const goToCategory = (id: number, categoryName: string) => {
    router.push({path: "/subCategory/" + id, query: {name: categoryName}})
}

</script>

<template>
    <!-- 分类列表 -->
    <el-row :gutter="30" class="category-grid">
        <!-- 单个分类卡片 -->
        <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="category in categories" :key="category.id"
            class="category-col">
            <el-card shadow="always" class="category-card">
                <img :src="category.imageUrl" alt="category image" class="category-image" />
                <div class="category-info">
                    <h3 class="category-title">{{ category.name }}</h3>
                    <p class="category-description">{{ category.description }}</p>
                    <el-button type="primary" @click="goToCategory(category.id, category.name)" size="small"
                        class="category-btn">查看商品</el-button>
                </div>
            </el-card>
        </el-col>
    </el-row>
</template>

<style scoped>
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
    height: 400px;
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