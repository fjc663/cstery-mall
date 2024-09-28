<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import useCategory from '@/composables/useCategory';
import type { icategoryDTO } from '@/composables/interfaceType';


// 处理分类数据的逻辑代码
const { allCategories, totalCategory, pageQueryCategoryDTO, pageQueryCategory, editCategory, addCategory, deleteCategory } = useCategory();

const page = ref<number>(1); // 当前页
const pageSize = ref<number>(10); // 每页条数

// 每页大小改变时触发
const handleSizeChange = (pageSize: number) => {
    pageQueryCategoryDTO.value.pageSize = pageSize;

    pageQueryCategory();
};

// 页码改变时触发
const handleCurrentChange = (page: number) => {
    pageQueryCategoryDTO.value.page = page;

    pageQueryCategory();
};

// 表单数据
const form = ref<icategoryDTO>({
    id: null,
    name: '',
    description: '',
    imageUrl: '',
    status: 1,
    sortOrder: 1,
});

// 控制添加和编辑弹窗的显示
const dialogVisible = ref<boolean>(false);
// 判断是添加还是修改
const isAdd = ref<boolean>(true);

// 添加分类
const onAddCategory = (parentId: number | null) => {
    form.value = {
        id: null,
        name: '',
        description: '',
        imageUrl: '',
        status: 0,
        sortOrder: 1,
        parentId: parentId,
    };

    isAdd.value = true;
    dialogVisible.value = true;
};

// 编辑分类
const onEditCategory = (category: icategoryDTO) => {
    Object.assign(form.value, category);
    isAdd.value = false;
    dialogVisible.value = true;
};

// 删除分类
const onDeleteCategory = (id: number) => {
    ElMessageBox.confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(async () => {
        await deleteCategory(id);
        pageQueryCategory();
    }).catch(() => {
        ElMessage({
            type: 'info',
            message: '已取消删除',
        });
    });
};

// 提交表单 (新增或编辑)
const submitForm = async () => {
    // 校验
    if (!form.value.name) {
        ElMessage.error('分类名称不能为空');
        return;
    }
    if (form.value.name.length < 1 || form.value.name.length > 20) {
        ElMessage.error('分类名称字符长度为1到20');
        return;
    }


    dialogVisible.value = false;
    if (isAdd.value) {
        await addCategory(form.value);
    } else {
        await editCategory(form.value);
    }
    pageQueryCategory();
};

// 启用或禁用
const enOrDisAble = async (id: number, status: number) => {
    form.value = {
        id: id,
        status: status,
    };

    await editCategory(form.value);
    pageQueryCategory();
}

// 搜索和过滤条件
const filters = ref({
    name: '',
    status: -1,
});

// 只查看启用或禁用
const searchCategory = () => {
    pageQueryCategoryDTO.value.name = filters.value.name;
    if (filters.value.status === 0 || filters.value.status === 1) {
        pageQueryCategoryDTO.value.status = filters.value.status;
    } else {
        pageQueryCategoryDTO.value.status = null;
    }
    pageQueryCategory();
}

// 页面加载时获取分类
onMounted(() => {
    pageQueryCategoryDTO.value.page = page.value;
    pageQueryCategoryDTO.value.pageSize = pageSize.value;

    pageQueryCategory()
});
</script>

<template>
    <div class="category-management">
        <!-- 搜索和过滤区域 -->
        <el-card class="search-card" shadow="hover">
            <div class="search-controls">
                <!-- 分类名称输入框 -->
                <el-input v-model="filters.name" placeholder="请输入分类名称" clearable class="search-input">
                    <template #append>
                        <el-button @click="searchCategory">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-find"></use>
                            </svg>
                        </el-button>
                    </template>
                </el-input>

                <!-- 分类状态选择框 -->
                <el-select v-model="filters.status" @change="searchCategory" placeholder="请选择分类状态" clearable
                    class="status-select">
                    <el-option label="全部" :value="-1"></el-option>
                    <el-option label="启用" :value="1"></el-option>
                    <el-option label="禁用" :value="0"></el-option>
                </el-select>

                <!-- 添加分类按钮 -->
                <el-button class="add-category-btn" type="primary" plain @click="onAddCategory(null)">
                    添加分类
                </el-button>
            </div>
        </el-card>

        <!-- 分类列表 -->
        <el-card class="category-card" shadow="hover" style="margin-top: 20px;">
            <el-table :data="allCategories" border stripe
                :header-cell-style="{ 'text-align': 'center', 'background-color': '#f7f8fa', 'font-weight': 'bold' }"
                :cell-style="{ 'text-align': 'center' }" style="width: 100%"
                :default-sort="{ prop: 'sortOrder', order: 'ascending' }">
                <el-table-column type="index" label="序号" width="60" />

                <!-- 可展开的子分类 -->
                <el-table-column label="子分类" type="expand" width="80">
                    <template #default="category">
                        <div class="sub-category" style="margin: 20px;">
                            <!-- 添加二级分类按钮 -->
                            <div class="add-subCategory-btn">
                                <el-button type="primary" plain @click="onAddCategory(category.row.id)">
                                    添加
                                </el-button>
                            </div>

                            <el-table :data="category.row.subCategories" border
                                :header-cell-style="{ 'text-align': 'center', background: '#fafafa', fontWeight: 'bold' }"
                                :cell-style="{ 'text-align': 'center' }"
                                :default-sort="{ prop: 'sortOrder', order: 'ascending' }">
                                <el-table-column type="index" label="序号" width="60" />
                                <el-table-column :label="category.row.name + '的二级分类'" prop="name" />
                                <el-table-column label="描述" prop="description" />
                                <el-table-column prop="imageUrl" label="图片" width="150">
                                    <template #default="scope">
                                        <el-image :src="scope.row.imageUrl" fit="cover" class="image-thumbnail" />
                                    </template>
                                </el-table-column>
                                <el-table-column prop="status" label="状态" width="100">
                                    <template #default="scope">
                                        <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
                                            {{ scope.row.status === 1 ? '启用' : '禁用' }}
                                        </el-tag>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="sortOrder" sortable label="排序" width="80" />
                                <el-table-column label="操作" width="200">
                                    <template #default="scope">
                                        <el-button :type="scope.row.status === 1 ? 'danger' : 'success'" size="small"
                                            link @click="enOrDisAble(scope.row.id, scope.row.status === 1 ? 0 : 1)">
                                            {{ scope.row.status === 1 ? '禁用' : '启用' }}
                                        </el-button>
                                        <el-button size="small" type="primary" @click="onEditCategory(scope.row)"
                                            link>编辑</el-button>
                                        <el-button size="small" type="danger" @click="onDeleteCategory(scope.row.id)"
                                            link>删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </template>
                </el-table-column>

                <!-- 父分类名称 -->
                <el-table-column prop="name" label="分类名称"></el-table-column>
                <el-table-column prop="description" label="描述"></el-table-column>

                <!-- 图片展示 -->
                <el-table-column prop="imageUrl" label="图片" width="150">
                    <template #default="scope">
                        <el-image :src="scope.row.imageUrl" fit="cover" class="image-thumbnail" />
                    </template>
                </el-table-column>

                <!-- 状态标签 -->
                <el-table-column prop="status" label="状态" width="100">
                    <template #default="scope">
                        <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
                            {{ scope.row.status === 1 ? '启用' : '禁用' }}
                        </el-tag>
                    </template>
                </el-table-column>

                <!-- 排序列 -->
                <el-table-column prop="sortOrder" sortable label="排序" width="80" />

                <!-- 操作列 -->
                <el-table-column label="操作" width="200">
                    <template #default="scope">
                        <el-button :type="scope.row.status === 1 ? 'danger' : 'success'" size="small" link
                            @click="enOrDisAble(scope.row.id, scope.row.status === 1 ? 0 : 1)">
                            {{ scope.row.status === 1 ? '禁用' : '启用' }}
                        </el-button>
                        <el-button size="small" type="primary" @click="onEditCategory(scope.row)" link>编辑</el-button>
                        <el-button size="small" type="danger" @click="onDeleteCategory(scope.row.id)"
                            link>删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 分页 -->
        <div class="product-pagination-block">
            <el-pagination v-model:current-page="page" v-model:page-size="pageSize" :page-sizes="[10, 20, 50, 100]"
                layout="total, sizes, prev, pager, next, jumper" :total="totalCategory" @size-change="handleSizeChange"
                @current-change="handleCurrentChange" />
        </div>

        <el-dialog v-model="dialogVisible">
            <img w-full :src="dialogImageUrl" alt="Preview Image" />
        </el-dialog>

        <!-- 分类编辑/添加弹窗 -->
        <el-dialog v-model="dialogVisible" draggable width="500px" :title="isAdd ? '添加分类' : '修改分类'">
            <el-form :model="form" label-width="80px" class="category-form">
                <el-form-item label="名称">
                    <el-input v-model="form.name" placeholder="请输入分类名称" class="form-input"></el-input>
                </el-form-item>

                <el-form-item label="描述">
                    <el-input v-model="form.description" type="textarea" placeholder="请输入分类描述"></el-input>
                </el-form-item>

                <el-form-item label="图片">
                    <el-input v-model="form.imageUrl" placeholder="请输入图片链接"></el-input>
                    <el-upload class="avatar-uploader" :http-request="onUploadAvatar" :show-file-list="false"
                :before-upload="beforeAvatarUpload">
                <img v-if="user.avatarUrl" v-lazy="user.avatarUrl" fit="cover" class="avatar" />
                <el-icon v-else class="avatar-uploader-icon">
                    <Plus />
                </el-icon>
            </el-upload>

                </el-form-item>

                <el-form-item label="状态">
                    <el-select v-model="form.status" placeholder="请选择状态" class="form-select">
                        <el-option label="启用" :value="1"></el-option>
                        <el-option label="禁用" :value="0"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="排序">
                    <el-input-number v-model="form.sortOrder" :min="0" label="排序"></el-input-number>
                </el-form-item>
            </el-form>

            <div class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitForm">{{ isAdd ? '添加' : '修改' }}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<style scoped>
.category-management {
    padding: 20px;
}

/* 设置顶部卡片样式 */
.search-card {
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 10px;
    background-color: #f9f9f9;
}

/* 控制内部搜索控件的布局 */
.search-controls {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 15px;
    /* 控制元素之间的间距 */
}

/* 设置输入框样式 */
.search-input {
    width: 250px;
    /* 控制输入框宽度 */
}

/* 设置下拉框样式 */
.status-select {
    width: 200px;
    /* 控制下拉框宽度 */
}

/* 设置按钮样式 */
.add-category-btn {
    margin-left: auto;
    /* 将按钮推到最右边 */
    padding: 10px 20px;
    border-radius: 5px;
}

.add-subCategory-btn {
    display: flex;
    justify-content: end;
    padding-bottom: 10px;
}

.category-card {
    border-radius: 10px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.image-thumbnail {
    border-radius: 8px;
    width: 80px;
    height: 80px;
    object-fit: cover;
}

.dialog-footer {
    text-align: right;
}

.pagination {
    text-align: center;
    margin: 20px 0;
}

/* 分页组件样式 */
.product-pagination-block {
    margin-top: 10px;
    display: flex;
    justify-content: end;
}

/* 弹窗整体样式优化 */
.el-dialog {
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

/* 表单样式 */
.category-form {
    padding: 20px 0;
    /* 内边距使内容更舒适 */
}

/* 表单项的间距和样式 */
.el-form-item {
    margin-bottom: 20px;
    /* 每个表单项之间增加间距 */
}

/* 输入框样式 */
.form-input,
.form-select,
.el-input-number {
    width: 100%;
    /* 保证所有输入框的宽度一致 */
}

/* 弹窗底部按钮样式 */
.dialog-footer {
    display: flex;
    justify-content: flex-end;
    /* 按钮右对齐 */
    margin-top: 20px;
    padding-top: 10px;
    border-top: 1px solid #eaeaea;
    /* 添加分隔线以增强视觉效果 */
}

.dialog-footer .el-button {
    margin-left: 10px;
    /* 按钮之间的间距 */
}
</style>