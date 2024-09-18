<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { getSubCategoryListAPI } from '@/apis/categoryApi';
import { getProductListByCategoryIdAPI } from '@/apis/productApis';
import type { category, iproduct, result } from '@/components/interfaceType';


const route = useRoute();

// 获得当前一级分类名字
const firstCategoryName = ref();
firstCategoryName.value = route.query.name;

// 二级分类数据
const subCategories = ref<category[]>([]);

// 当前选中的二级分类及其对应商品
const activeSubCategory = ref<number>(0);
const currentCategoryName = ref<string>('');
const currentProducts = ref<iproduct[]>([]);

// 根据二级分类id获得商品数据
const getProductListByCategoryId = async (categoryId: number) => {
  const res: result = await getProductListByCategoryIdAPI(categoryId);

  currentProducts.value = res.data;
}

// 根据一级分类id获得二级分类
const getSubCategoryList = async () => {
  const subCategoryId: string | string[] = route.params.subCategoryId;

  const res: result = await getSubCategoryListAPI(subCategoryId);

  subCategories.value = res.data;

  // 设置默认展示的二级分类和商品
  activeSubCategory.value = subCategories.value[0].id;
  currentCategoryName.value = subCategories.value[0].name;
  getProductListByCategoryId(activeSubCategory.value)

}
onMounted(() => getSubCategoryList());


// 处理选择分类时更新显示的商品
const handleCategorySelect = (subCategoryId: number) => {
  activeSubCategory.value = subCategoryId;
  currentCategoryName.value = subCategories.value.find((cat) => cat.id == subCategoryId)?.name || '';
  getProductListByCategoryId(subCategoryId);
}

const router = useRouter();
// 查看商品详情
const viewProduct = (id: Number, categoryName: string, subCategoryName: string) => {
  router.push({path: '/productDetail/' + id, query: {name: categoryName, subName: subCategoryName, redirect: route.fullPath}});
}
</script>

<template>
  <el-container class="category-page">
    <el-row>
      <!-- 左侧二级分类导航 -->
      <el-col :span="5">
        <el-menu class="category-menu" :default-active="activeSubCategory.toString()" @select="handleCategorySelect"
          background-color="#f5f5f5" text-color="#333" active-text-color="#f56c6c">
          <el-menu-item v-for="subCategory in subCategories" :key="subCategory.id" :index="subCategory.id.toString()">
            {{ subCategory.name }}
          </el-menu-item>
        </el-menu>
      </el-col>

      <!-- 右侧商品展示区 -->
      <el-col :span="19">
        <div class="products-section">
          <h2 class="products-title">{{ currentCategoryName }} - 商品列表</h2>
          <el-row :gutter="20" class="products-grid">
            <!-- 单个商品卡片 -->
            <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="product in currentProducts" :key="product.id">
              <el-card shadow="hover" class="product-card" @click="viewProduct(product.id, firstCategoryName, currentCategoryName)">
                <img v-lazy="product.imageUrl" alt="product image" class="product-image" />
                <div class="product-info">
                  <h3 class="product-title">{{ product.name }}</h3>
                  <p class="product-description">
                    <!-- Tooltip: 当描述长度超过 20 时使用 Tooltip 显示完整内容 -->
                    <el-tooltip placement="bottom" effect="light"
                      v-if="product.description.length > 20" popper-class="custom-tooltip">
                      <template #content>
                        <div style="min-width: 80px; max-width: 500px;text-align: center;">
                          {{product.description}}
                        </div>
                      </template>
                      {{ product.description.slice(0, 20) + '...' }}
                    </el-tooltip>

                    <!-- 否则显示完整描述 -->
                    <span v-else>
                      {{ product.description }}
                    </span>
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
  height: 230px;
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
