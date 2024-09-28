<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import useProduct from '@/composables/useProduct';
import { useRouter, useRoute } from 'vue-router';


const route = useRoute();
const router = useRouter();

// 引入商品查询的相关逻辑
const { products, totalProduct, pageQuery, pageQueryByCategoryId } = useProduct();

// 价格排序
const priceOrder = ref<string>('none');
const handlePriceOrderChange = (value: string) => {
    // 如果选择价格升序或降序，更新查询条件
    pageQuery.value.isOrderBypriceASC = value === 'asc';
    pageQuery.value.isOrderBypriceDESC = value === 'desc';

    pageQueryByCategoryId(); // 重新查询商品
};

// 当前页码和当前页条数
const page = ref<number>(1);
const pageSize = ref<number>(20);

// 每页大小改变时触发
const handleSizeChange = (pageSize: number) => {
    pageQuery.value.pageSize = pageSize;
    
    pageQueryByCategoryId();
};

// 页码改变时触发
const handleCurrentChange = (page: number) => {
    pageQuery.value.page = page;

    pageQueryByCategoryId();
};

// 跳转到商品详细页面
const goToProductDetail = (productId: number) => {
    router.push({ path: `/productDetail/${productId}`, query: { isDisplayBreadcrumb: 0 } });
};

// 刷新时加载
onMounted(() => {
    pageQuery.value.page = page.value;
    pageQuery.value.pageSize = pageSize.value;
    pageQuery.value.name = route.query.searchQuery as string;
    pageQuery.value.isALLData = true;

    if (pageQuery.value.isOrderBypriceASC) {
        priceOrder.value = 'asc';
    } else if(pageQuery.value.isOrderBypriceDESC) {
        priceOrder.value = 'desc';
    } else {
        priceOrder.value = 'none';
    }

    pageQueryByCategoryId();
})

// 返回上级路由
const goBack = () => {
  router.back();
}
</script>

<template>
    <el-container class="product-list-page">
        <!-- 价格排序选择框 -->
        <el-header>
            <el-page-header @back="goBack" />
            <div class="sort-bar">
                <el-select v-model="priceOrder" placeholder="价格排序" @change="handlePriceOrderChange">
                    <el-option label="默认排序" value="none"></el-option>
                    <el-option label="价格升序" value="asc"></el-option>
                    <el-option label="价格降序" value="desc"></el-option>
                </el-select>
            </div>
        </el-header>

        <!-- 商品列表 -->
        <el-main>
            <el-row :gutter="20" class="products-grid">
                <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="product in products" :key="product.id">
                    <el-card shadow="hover" class="product-card" @click="goToProductDetail(product.id)">
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
                                <span v-else>{{ product.description }}</span>
                            </p>
                            <p class="product-price">￥{{ product.price }}</p>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
            <!-- 分页组件 -->
            <div class="product-pagination-block">
                <el-pagination v-model:current-page="page" v-model:page-size="pageSize"
                    :page-sizes="[20, 50, 100, 200]" layout="total, sizes, prev, pager, next, jumper"
                    :total="totalProduct" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </div>
        </el-main>

        <el-backtop :right="100" :bottom="100" />

    </el-container>
</template>

<style lang="scss" scoped>
.product-list-page {
    padding: 20px;
    background-color: #f7f7f7;
    min-height: 100vh;
}

/* 排序栏样式 */
.sort-bar {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 20px;
}

.el-select {
    width: 150px;
}

/* 商品展示区样式 */
.products-grid {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
}

.product-card {
    margin: 10px;
    border-radius: 10px;
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    cursor: pointer;
    min-height: 400px;
}

.product-card:hover {
    transform: scale(1.05);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.product-image {
    width: 100%;
    height: 230px;
    object-fit: cover;
}

.product-info {
    text-align: center;
    padding: 15px;
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

.product-price {
    font-size: 18px;
    color: #f56c6c;
    font-weight: bold;
}

/* 分页组件样式 */
.product-pagination-block {
    margin-top: 10px;
    display: flex;
    justify-content: end;
}
</style>
