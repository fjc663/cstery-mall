<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormRules, FormInstance } from 'element-plus';
import useProduct from '@/composables/useProduct';
import useCategory from '@/composables/useCategory';
import type { iadminProduct } from '@/composables/interfaceType/adminInterface';
import type { result } from '@/composables/interfaceType/commonInterface';
import type { UploadProps } from 'element-plus'
import useUpload from '@/composables/useUpload';
import useSpecification from '@/composables/useSpecification';


// 管理端分类处理逻辑
const { subAllCategories, getAllSubCategory } = useCategory();

// 管理端规格处理逻辑
const { allSpecList, getAllSepc } = useSpecification();

// 管理端商品处理逻辑
const { adminPageQueryProduct, adminProducts, totalProductAdmin, pageQueryAdmin, addProduct, editProduct, deleteProduct } = useProduct();

// 分页信息
const page = ref<number>(1);
const pageSize = ref<number>(30);

// 搜索和过滤功能
const filters = ref({
    name: '',
    categoryId: null,
    status: null,
});

// 表单相关
const dialogVisible = ref<boolean>(false);
const isEdit = ref<boolean>(false);
const productForm = ref<iadminProduct>({
    id: null,
    name: '',
    description: '',
    imageUrl: '',
    price: 0,
    status: 0,
    stock: 0,
    categoryId: null,
    sales: 0,
    specIds: []
});

const productFormRef = ref<FormInstance>();

// 表单校验规则
const rules = ref<FormRules<iadminProduct>>({
    name: [
        { required: true, message: '商品名称不能为空', trigger: 'blur' },
        { min: 1, max: 20, message: '商品名称长度应为 1 到 20 个字符', trigger: 'blur' }
    ],
    price: [{ required: true, message: '商品价格不能为空', trigger: 'blur' }],
    stock: [{ required: true, message: '库存不能为空', trigger: 'blur' }],
    categoryId: [{ required: true, message: '请选择商品分类', trigger: 'change' }],
});

// 搜索商品
const searchProduct = () => {
    pageQueryAdmin.value.name = filters.value.name;
    pageQueryAdmin.value.categoryId = filters.value.categoryId;
    pageQueryAdmin.value.status = filters.value.status;

    adminPageQueryProduct();
};

// 编辑商品
const openEditProduct = (product: iadminProduct) => {
    isEdit.value = true;
    dialogVisible.value = true;
    Object.assign(productForm.value, product);

    productForm.value.specIds = product.specifications?.map(spec => spec.id).filter((id): id is number => id !== null && id !== undefined);
};
// 添加商品
const openAddProduct = () => {
    isEdit.value = false;
    dialogVisible.value = true;
    productForm.value = {
        id: null,
        name: '',
        description: '',
        price: 0,
        stock: 0,
        categoryId: null,
        status: 0,
        imageUrl: '',
        sales: 0,
        specIds: []
    };
};

// 保存商品
const saveProduct = (formEl: FormInstance | undefined) => {
    if (!formEl) return;

    formEl.validate(async (valid: boolean) => {
        if (valid) {
            if (isEdit.value) {
                await editProduct(productForm.value);
            } else {
                await addProduct(productForm.value);
            }
            adminPageQueryProduct();
            dialogVisible.value = false;
        }
    });
};

// 删除商品
const confirmDeleteProduct = (id: number) => {
    ElMessageBox.confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(async () => {
        await deleteProduct(id);
        adminPageQueryProduct();
    }).catch(() => {
        ElMessage({ type: 'info', message: '已取消删除' });
    });
};

// 每页大小改变时触发
const handleSizeChange = (pageSize: number) => {
    pageQueryAdmin.value.pageSize = pageSize;

    adminPageQueryProduct();
};

// 页码改变时触发
const handleCurrentChange = (page: number) => {
    pageQueryAdmin.value.page = page;

    adminPageQueryProduct();
};

// 映射 `categoryId` 为分类名称
const getCategoryName = (categoryId: number) => {
    const category = subAllCategories.value.find((category) => category.id === categoryId);
    return category ? category.name : '未知分类';
};

// 上架或下架
const enOrDisAble = async (id: number, status: number) => {
    productForm.value = {
        id: id,
        status: status,
    };

    await editProduct(productForm.value);
    adminPageQueryProduct();
}

const { uploadProduct } = useUpload();

// 上传商品图片
const onUploadProduct = async (avatar: any) => {
    const formData = new FormData();
    formData.append('productFile', avatar.file);

    const res: result = await uploadProduct(formData);

    if (res.code === 1) {
        productForm.value.imageUrl = res.data;
    }
}

// 上传商品图片前的钩子函数
const beforeProductUpload: UploadProps['beforeUpload'] = (rawFile) => {
    if (rawFile.size / 1024 / 1024 > 10) {
        ElMessage.error('头像大小必须小于10MB')
        return false;
    }
    return true;
}

// 初始化页面数据
onMounted(() => {
    pageQueryAdmin.value.page = page.value;
    pageQueryAdmin.value.pageSize = pageSize.value;

    adminPageQueryProduct();
    getAllSubCategory();
    getAllSepc();
});
</script>

<template>
    <el-card class="product-management" shadow="hover">
        <!-- 搜索和过滤区 -->
        <div class="search-filter-section">
            <el-form :inline="true" label-width="80px" class="search-form">
                <!-- 商品名称搜索 -->
                <el-form-item label="商品名称">
                    <el-input v-model="filters.name" placeholder="请输入商品名称" clearable class="search-input">
                        <template #append>
                            <el-button @click="searchProduct">搜索</el-button>
                        </template>
                    </el-input>
                </el-form-item>

                <!-- 分类过滤 -->
                <el-form-item label="商品分类" style="width: 250px;">
                    <el-select v-model="filters.categoryId" @change="searchProduct" placeholder="请选择分类" clearable>
                        <el-option v-for="category in subAllCategories" :key="category.id" :label="category.name"
                            :value="category.id" />
                    </el-select>
                </el-form-item>

                <!-- 状态过滤 -->
                <el-form-item label="商品状态" style="width: 200px;">
                    <el-select v-model="filters.status" @change="searchProduct" placeholder="请选择状态" clearable>
                        <el-option label="上架" :value="1" />
                        <el-option label="下架" :value="0" />
                    </el-select>
                </el-form-item>
            </el-form>

            <!-- 添加商品按钮 -->
            <div class="header-action-buttons">
                <el-button type="success" plain @click="openAddProduct">添加商品</el-button>
            </div>
        </div>

        <!-- 商品列表表格 -->
        <el-table :data="adminProducts" border stripe style="width: 100%"
            :header-cell-style="{ 'text-align': 'center', background: '#fafafa', fontWeight: 'bold' }"
            :cell-style="{ 'text-align': 'center' }">
            <el-table-column type="index" label="序号" width="60" />

            <!-- 商品图片展示 -->
            <el-table-column prop="imageUrl" label="商品图片" width="150">
                <template #default="scope">
                    <el-image :src="scope.row.imageUrl" fit="cover" class="image-thumbnail" />
                </template>
            </el-table-column>

            <el-table-column prop="name" label="商品名称" width="180" />
            <el-table-column prop="description" label="商品描述" />

            <el-table-column label="商品规格" width="180">
                <template #default="scope">
                    <div v-for="specification in scope.row.specifications" :key="specification.id">
                        {{ specification.name }}
                    </div>
                </template>
            </el-table-column>

            <el-table-column label="分类" width="180">
                <template #default="scope">
                    {{ getCategoryName(scope.row.categoryId) }}
                </template>
            </el-table-column>

            <el-table-column prop="price" label="价格" width="100" />
            <el-table-column prop="stock" label="库存" width="100" />
            <el-table-column prop="sales" label="销量" width="100" />
            <el-table-column prop="status" label="状态" width="80">
                <template #default="scope">
                    <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">{{ scope.row.status === 1 ? '上架' :
                        '下架' }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="220">
                <template #default="scope">
                    <el-button :type="scope.row.status === 1 ? 'danger' : 'success'" size="small" link
                        @click="enOrDisAble(scope.row.id, scope.row.status === 1 ? 0 : 1)">
                        {{ scope.row.status === 1 ? '下架' : '上架' }}
                    </el-button>
                    <el-button size="small" type="primary" @click="openEditProduct(scope.row)" link>编辑</el-button>
                    <el-button size="small" type="danger" @click="confirmDeleteProduct(scope.row.id)"
                        link>删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="product-pagination-block">
            <el-pagination v-model:current-page="page" v-model:page-size="pageSize" :page-sizes="[30, 50, 100, 200]"
                layout="total, sizes, prev, pager, next, jumper" :total="totalProductAdmin"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>

        <!-- 添加/编辑商品弹窗 -->
        <el-dialog v-model="dialogVisible" width="600px" :title="isEdit ? '编辑商品' : '添加商品'">
            <el-form :model="productForm" label-width="100px" :rules="rules" ref="productFormRef">
                <el-form-item label="商品名称" prop="name">
                    <el-input v-model="productForm.name" placeholder="请输入商品名称"></el-input>
                </el-form-item>

                <el-form-item label="商品图片">
                    <el-upload class="product-uploader" :http-request="onUploadProduct" :show-file-list="false"
                        :before-upload="beforeProductUpload">
                        <!-- 如果有图片显示图片，否则显示图标 -->
                        <img v-if="productForm.imageUrl" :src="productForm.imageUrl" class="uploaded-image" />
                        <el-icon v-else class="product-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>

                <el-form-item label="商品描述">
                    <el-input v-model="productForm.description" placeholder="请输入商品描述"></el-input>
                </el-form-item>
                <el-form-item label="商品价格" prop="price">
                    <el-input-number :min="0" v-model="productForm.price" placeholder="请输入商品价格"></el-input-number>
                </el-form-item>
                <el-form-item label="库存" prop="stock">
                    <el-input-number :min="1" v-model="productForm.stock" placeholder="请输入库存"></el-input-number>
                </el-form-item>

                <el-form-item label="商品分类" prop="categoryId">
                    <el-select v-model="productForm.categoryId" placeholder="请选择分类">
                        <el-option v-for="category in subAllCategories" :key="category.id" :label="category.name"
                            :value="category.id" />
                    </el-select>
                </el-form-item>

                <el-form-item label="商品规格">
                    <el-select v-model="productForm.specIds" placeholder="请选择规格" multiple clearable>
                        <el-option v-for="spec in allSpecList" :key="spec.id" :label="spec.name" :value="spec.id" />
                    </el-select>
                </el-form-item>

                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="productForm.status">
                        <el-radio :value="1">上架</el-radio>
                        <el-radio :value="0">下架</el-radio>
                    </el-radio-group>
                </el-form-item>

            </el-form>

            <div class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="saveProduct(productFormRef)">保存</el-button>
            </div>
        </el-dialog>
    </el-card>
</template>

<style scoped>
.product-management {
    padding: 30px;
    background-color: #fafafa;
    border-radius: 8px;
}

.search-filter-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

/* 设置输入框样式 */
.search-input {
    width: 250px;
}

.search-form {
    display: flex;
    gap: 20px;
}

.header-action-buttons {
    display: flex;
    align-items: center;
}

.header-action-buttons .el-button {
    margin-left: 10px;
}

.el-table {
    margin-top: 20px;
}

/* 分页组件样式 */
.product-pagination-block {
    margin-top: 10px;
    display: flex;
    justify-content: end;
}

.dialog-footer {
    text-align: right;
}

/* 上传区域样式优化 */
.product-uploader {
    width: 180px;
    height: 180px;
    border: 2px dashed #d9d9d9;
    border-radius: 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    background-color: #f9f9f9;
    transition: border-color 0.3s ease, background-color 0.3s ease;
}

/* 悬停时的效果 */
.product-uploader:hover {
    border-color: #409eff;
    background-color: #f0f9ff;
}

/* 上传图片的样式 */
.uploaded-image {
    width: 180px;
    height: 180px;
    object-fit: cover;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* 上传图标的样式 */
.product-uploader-icon {
    font-size: 36px;
    color: #8c939d;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    transition: color 0.3s ease;
}

/* 悬停时图标颜色变化 */
.product-uploader:hover .product-uploader-icon {
    color: #409eff;
}
</style>
