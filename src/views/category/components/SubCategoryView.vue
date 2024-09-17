<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router';
import { getSubCategoryListAPI } from '@/apis/categoryApi';
import type { category, result } from '@/components/interfaceType';

// 二级分类数据
const subCategories = ref<category[]>([])

// 根据一级分类id获得二级分类
const getSubCategoryList = async () => {
  const route = useRoute();
  const subCategoryId: string | string [] = route.params.subCategoryId;
  
  const res: result = await getSubCategoryListAPI(subCategoryId);

  subCategories.value = res.data;
}

onMounted(() => getSubCategoryList())


// 当前选中的分类及其对应商品
const activeSubCategory = ref('1')
const currentCategory = ref({ name: '手机配件' })

const products = {
  1: [
    { id: 101, name: '手机壳', description: '高质量手机壳，适用于多种型号，坚固耐用。', price: 59.99, image: 'https://via.placeholder.com/300x200?text=手机壳' },
    { id: 102, name: '手机充电器', description: '快速充电，安全稳定。兼容多种品牌手机。', price: 89.99, image: 'https://via.placeholder.com/300x200?text=手机充电器' },
    { id: 103, name: '手机充电器', description: '快速充电，安全稳定。兼容多种品牌手机。', price: 89.99, image: 'https://via.placeholder.com/300x200?text=手机充电器' },
    { id: 104, name: '手机充电器', description: '快速充电，安全稳定。兼容多种品牌手机。', price: 89.99, image: 'https://via.placeholder.com/300x200?text=手机充电器' },
    { id: 105, name: '手机充电器', description: '快速充电，安全稳定。兼容多种品牌手机。', price: 89.99, image: 'https://via.placeholder.com/300x200?text=手机充电器' },
    { id: 106, name: '手机充电器', description: '快速充电，安全稳定。兼容多种品牌手机。', price: 89.99, image: 'https://via.placeholder.com/300x200?text=手机充电器' },
  ],
  2: [
    { id: 201, name: '键盘', description: '人体工学设计，舒适打字体验。', price: 199.99, image: 'https://via.placeholder.com/300x200?text=键盘' },
    { id: 202, name: '鼠标', description: '灵敏精准，轻松应对办公和游戏需求。', price: 129.99, image: 'https://via.placeholder.com/300x200?text=鼠标' },
  ],
  3: [
    { id: 301, name: '冰箱滤水器', description: '过滤杂质，保持水质清新，适用于多品牌冰箱。', price: 49.99, image: 'https://via.placeholder.com/300x200?text=冰箱滤水器' },
    { id: 302, name: '空调遥控器', description: '兼容多种空调品牌，轻松控制。', price: 39.99, image: 'https://via.placeholder.com/300x200?text=空调遥控器' },
  ],
  4: [
    { id: 401, name: '智能手表表带', description: '多种颜色选择，舒适耐用，适配多品牌智能手表。', price: 69.99, image: 'https://via.placeholder.com/300x200?text=智能手表表带' },
    { id: 402, name: 'VR眼镜配件', description: '增强虚拟现实体验，适配多种VR设备。', price: 299.99, image: 'https://via.placeholder.com/300x200?text=VR眼镜配件' },
  ],
}

const currentProducts = ref(products[1])

// 处理选择分类时更新显示的商品
const handleCategorySelect = (subCategoryId: string) => {
  activeSubCategory.value = subCategoryId
  currentCategory.value = subCategories.value.find((cat) => cat.id.toString() === subCategoryId) || { name: '' }
  currentProducts.value = products[subCategoryId]
}

// 模拟查看商品详情
const viewProduct = (id: number) => {
  console.log('查看商品详情:', id)
}
</script>

<template>
  <el-container class="category-page">
    <el-row>
      <!-- 左侧二级分类导航 -->
      <el-col :span="5">
        <el-menu class="category-menu" :default-active="activeSubCategory" @select="handleCategorySelect"
          background-color="#f5f5f5" text-color="#333" active-text-color="#f56c6c">
          <el-menu-item v-for="subCategory in subCategories" :key="subCategory.id" :index="subCategory.id.toString()">
            {{ subCategory.name }}
          </el-menu-item>
        </el-menu>
      </el-col>

      <!-- 右侧商品展示区 -->
      <el-col :span="19">
        <div class="products-section">
          <h2 class="products-title">{{ currentCategory.name }} - 商品列表</h2>
          <el-row :gutter="20" class="products-grid">
            <!-- 单个商品卡片 -->
            <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="product in currentProducts" :key="product.id">
              <el-card shadow="hover" class="product-card" @click="viewProduct(product.id)">
                <img :src="product.image" alt="product image" class="product-image" />
                <div class="product-info">
                  <h3 class="product-title">{{ product.name }}</h3>
                  <p class="product-description">
                    {{ product.description.length > 20 ? product.description.slice(0, 20) + '...' : product.description
                    }}
                    <span v-if="product.description.length > 20" class="more-text">查看更多</span>
                  </p>
                  <p class="product-price">￥{{ product.price }}</p>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </el-container>
</template>

<style lang="scss" scoped>
/* 页面整体样式 */
.category-page {
  padding: 20px;
  background-color: #f0f3f5;
}

/* 左侧导航栏样式 */
.category-menu {
  height: 100%;
  border-right: 1px solid #ddd;
  background-color: #fff;
  padding-top: 20px;
}

.el-menu-item {
  padding: 10px 20px;
  font-size: 16px;
}

.el-menu-item:hover,
.el-menu-item.is-active {
  background-color: #f56c6c;
  color: #fff;
}

/* 右侧商品展示区样式 */
.products-section {
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 商品标题样式 */
.products-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
}

/* 商品卡片网格布局 */
.products-grid {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}

/* 商品卡片样式 */
.product-card {
  flex: 1 1 calc(25% - 20px);
  /* 控制宽度为 25%，自适应4列布局 */
  margin: 10px;
  border-radius: 10px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  min-height: 400px;
  /* 强制设置卡片的最小高度，确保高度一致 */
}

.product-card:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

/* 商品图片 */
.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

/* 商品信息 */
.product-info {
  text-align: center;
  padding: 15px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.product-description {
  font-size: 14px;
  color: #777;
  margin-bottom: 10px;
  position: relative;
}

.product-description .more-text {
  display: none;
  color: #f56c6c;
  font-weight: bold;
  cursor: pointer;
}

.product-description:hover .more-text {
  display: inline-block;
}

/* 商品价格样式 */
.product-price {
  font-size: 18px;
  color: #f56c6c;
  font-weight: bold;
}
</style>
