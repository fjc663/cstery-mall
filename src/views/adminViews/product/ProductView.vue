<template>
    <el-card class="product-management" shadow="hover">
        <!-- 搜索和过滤区 -->
        <div class="search-filter-section">
            <el-form :inline="true" label-width="80px" class="search-form">
                <!-- 商品名称搜索 -->
                <el-form-item label="商品名称">
                    <el-input v-model="filters.name" placeholder="请输入商品名称" clearable />
                </el-form-item>

                <!-- 分类过滤 -->
                <el-form-item label="商品分类">
                    <el-select v-model="filters.categoryId" placeholder="请选择分类" clearable>
                        <el-option v-for="category in categories" :key="category.id" :label="category.name"
                            :value="category.id" />
                    </el-select>
                </el-form-item>

                <!-- 状态过滤 -->
                <el-form-item label="商品状态">
                    <el-select v-model="filters.status" placeholder="请选择状态" clearable>
                        <el-option label="上架" :value="1" />
                        <el-option label="下架" :value="0" />
                    </el-select>
                </el-form-item>

                <!-- 搜索按钮 -->
                <el-form-item>
                    <el-button type="primary" @click="handleSearch">搜索</el-button>
                    <el-button @click="handleReset">重置</el-button>
                </el-form-item>
            </el-form>
        </div>

        <!-- 商品列表表格 -->
        <el-table :data="products" border stripe style="width: 100%">
            <el-table-column type="index" label="序号" width="60" />
            <el-table-column prop="name" label="商品名称" />
            <el-table-column prop="categoryName" label="分类" />
            <el-table-column prop="price" label="价格" />
            <el-table-column prop="stock" label="库存" />
            <el-table-column prop="status" label="状态">
                <template #default="scope">
                    <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
                        {{ scope.row.status === 1 ? '上架' : '下架' }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="220">
                <template #default="scope">
                    <el-button size="mini" type="primary" @click="editProduct(scope.row)">编辑</el-button>
                    <el-button size="mini" type="danger" @click="deleteProduct(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-pagination layout="prev, pager, next, total" :total="total" :page-size="pageSize"
            @current-change="handlePageChange" class="pagination" />
    </el-card>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

// 商品列表和分页信息
const products = ref([]);
const total = ref(0);
const pageSize = ref(10);
const currentPage = ref(1);

// 商品分类和筛选条件
const categories = ref([
    { id: 1, name: '电子产品' },
    { id: 2, name: '服装' },
    { id: 3, name: '家居用品' },
]);

const filters = ref({
    name: '',
    categoryId: null,
    status: null,
});

// 搜索和过滤功能
const handleSearch = () => {
    console.log('搜索商品：', filters.value);
    // 这里可以调用API获取筛选后的商品列表
};

const handleReset = () => {
    filters.value.name = '';
    filters.value.categoryId = null;
    filters.value.status = null;
    handleSearch(); // 重置后重新加载数据
};

// 编辑商品
const editProduct = (product) => {
    console.log('编辑商品：', product);
    // 这里可以打开编辑商品的对话框
};

// 删除商品
const deleteProduct = (id) => {
    console.log('删除商品ID：', id);
    // 这里可以调用删除接口
};

// 分页切换
const handlePageChange = (page) => {
    currentPage.value = page;
    console.log('当前页码：', page);
    // 这里可以重新获取当前页的商品列表
};
</script>

<style scoped>
.product-management {
    padding: 20px;
}

.search-filter-section {
    margin-bottom: 20px;
}

.pagination {
    text-align: right;
    margin-top: 20px;
}
</style>