<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import useCategory from '@/composables/useCategory';
import useProduct from '@/composables/useProduct';

const route = useRoute();
const router = useRouter();

// 二级分类数据、请求二级分类数据方法
const { subCategories, getSubCategoryList } = useCategory();

// 商品数据、根据二级分类id请求商品数据方法
const { products, totalProduct, pageQuery, pageQueryByCategoryId } = useProduct();

// 获得当前一级分类名字和id
const firstCategoryName: string = route.query.name as string;
const categoryId: number = Number(route.params.categoryId);

// 当前选中的二级分类及其对应商品
const activeSubCategory = ref<number>(0);
const currentCategoryName = ref<string>('');

// 处理选择分类时更新显示的商品
const handleCategorySelect = (subCategoryId: number) => {
  activeSubCategory.value = subCategoryId;
  currentCategoryName.value = subCategories.value.find((cat) => cat.id == subCategoryId)?.name || '';

  pageQuery.value.categoryId = subCategoryId;
  pageQueryByCategoryId();
}

// 搜索商品
const searchQuery = ref<string>('');
const handleSearch = () => {
  pageQuery.value.name = searchQuery.value;
  pageQueryByCategoryId();
};

// 价格排序
const priceOrder = ref<string>('none');
const handlePriceOrderChange = (value: string) => {
  pageQuery.value.isOrderBypriceASC = value === 'asc';
  pageQuery.value.isOrderBypriceDESC = value === 'desc';
  pageQueryByCategoryId();
};

// 查看商品详情
const viewProduct = (id: Number, categoryName: string, subCategoryName: string) => {
  router.push({ path: '/productDetail/' + id, query: { name: categoryName, subName: subCategoryName, redirect: route.fullPath } });
}

// 当前页码和当前页条数
const page = ref<number>(1);
const pageSize = ref<number>(20);

// 每页大小改变时触发
const handleSizeChange = (page: number) => {
  pageQuery.value.page = page;

  pageQueryByCategoryId();
};

// 页码改变时触发
const handleCurrentChange = (pageSize: number) => {
  pageQuery.value.pageSize = pageSize;

  pageQueryByCategoryId();
};

onMounted(async () => {
  // 根据一级分类id获得二级分类
  await getSubCategoryList(categoryId);

  if (route.query.subCategoryId && route.query.subCategoryName) {
    // 从首页跳转过来
    const subCategoryId: number = route.query.subCategoryId as unknown as number;
    pageQuery.value.categoryId = subCategoryId;
    activeSubCategory.value = subCategoryId;
    currentCategoryName.value = route.query.subCategoryName as string;
  } else {
    if (subCategories.value.length > 0) {
      // 设置默认展示的二级分类和商品
      pageQuery.value.categoryId = subCategories.value[0].id;
      activeSubCategory.value = subCategories.value[0].id;
      currentCategoryName.value = subCategories.value[0].name;
    } else {
      // 没有二级分类情况
      pageQuery.value.categoryId = -1;
    }
  }

  pageQuery.value.page = page.value;
  pageQuery.value.pageSize = pageSize.value;
  pageQuery.value.isALLData = false;

  if (pageQuery.value.isOrderBypriceASC) {
    priceOrder.value = 'asc';
  } else if (pageQuery.value.isOrderBypriceDESC) {
    priceOrder.value = 'desc';
  } else {
    priceOrder.value = 'none';
  }

  // 去除全局搜索的影响
  handleSearch();

});

console.log(route.fullPath);

</script>

<template>
  <el-container class="category-page">
    <!-- 左侧二级分类导航 -->
    <el-aside width="240px" class="sidebar">
      <el-menu :default-active="activeSubCategory.toString()" class="menu" @select="handleCategorySelect">
        <el-menu-item v-for="subCategory in subCategories" :key="subCategory.id" :index="subCategory.id.toString()">
          {{ subCategory.name }}
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 右侧商品展示区 -->
    <el-main class="products-section">
      <!-- 搜索框和价格排序 -->
      <div class="search-bar">
        <div>
          <el-input v-model="searchQuery" placeholder="搜索商品..." @keyup.enter="handleSearch" style="margin-right: 10px;"
            clearable>
            <template #append>
              <el-button @click="handleSearch">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-find"></use>
                </svg>
              </el-button>
            </template>
          </el-input>
        </div>

        <el-select v-model="priceOrder" placeholder="价格排序" @change="handlePriceOrderChange" class="select-prict-order">
          <el-option label="默认" value="none"></el-option>
          <el-option label="价格升序" value="asc"></el-option>
          <el-option label="价格降序" value="desc"></el-option>
        </el-select>
      </div>

      <!-- 商品网格 -->
      <el-row :gutter="20" class="products-grid">
        <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="product in products" :key="product.id">
          <el-card shadow="hover" class="product-card"
            @click="viewProduct(product.id, firstCategoryName, currentCategoryName)">
            <img v-lazy="product.imageUrl" alt="product image" class="product-image" />
            <div class="product-info">
              <h3 class="product-title">{{ product.name }}</h3>
              <p class="product-description">
                <el-tooltip placement="bottom" effect="light" v-if="product.description.length > 20"
                  popper-class="custom-tooltip">
                  <template #content>
                    <div style="min-width: 80px; max-width: 500px;text-align: center;">
                      {{ product.description }}
                    </div>
                  </template>
                  {{ product.description.slice(0, 20) + '...' }}
                </el-tooltip>
                <span v-else>
                  {{ product.description }}
                </span>
              </p>
              <p class="product-price">￥{{ product.price }}</p>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 分页 -->
      <div class="product-pagination-block">
        <el-pagination v-model:current-page="page" v-model:page-size="pageSize" :page-sizes="[20, 50, 100, 200]"
          layout="total, sizes, prev, pager, next, jumper" :total="totalProduct" @size-change="handleSizeChange"
          @current-change="handleCurrentChange" />
      </div>
    </el-main>

    <el-backtop :right="100" :bottom="100" />
  </el-container>
</template>

<style lang="scss" scoped>
/* 页面整体样式 */
.category-page {
  min-height: 100vh;
  width: 100%;
  display: flex;
}

.sidebar {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.menu {
  padding-top: 20px;
}

.el-menu-item {
  padding: 12px 20px;
  font-size: 16px;
  transition: background-color 0.3s;
}

/* 搜索框和排序 */
.search-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.search-bar .el-input {
  width: 250px;
}

.select-prict-order {
  width: 100px;
}

/* 右侧商品展示区样式 */
.products-section {
  flex: 1;
  padding: 20px;
  background-color: #f0f3f5;
}

/* 商品卡片网格布局 */
.products-grid {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}

/* 商品卡片样式 */
.product-card {
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
  height: 330px;
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
  color: #333;
}

.product-description {
  font-size: 14px;
  color: #777;
  margin-bottom: 10px;
  position: relative;
}

/* 商品价格样式 */
.product-price {
  font-size: 18px;
  color: #f56c6c;
  font-weight: bold;
}

/* 分页 */
.product-pagination-block {
  margin-top: 10px;
  display: flex;
  justify-content: end;
}
</style>
