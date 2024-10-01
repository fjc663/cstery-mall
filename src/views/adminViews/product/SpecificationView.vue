<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormRules, FormInstance } from 'element-plus'
import useSpecification from '@/composables/useSpecification';
import type { ispecification } from '@/composables/interfaceType/adminInterface';


// 规格操作相关逻辑
const { specList, totalSpec, pageQuery, pageQuerySepc, addSepc, editSepc, deleteSepc } = useSpecification();

// 规格数据和分页
const page = ref<number>(1);
const pageSize = ref<number>(10);

// 添加/编辑对话框
const dialogVisible = ref<boolean>(false);
const isEdit = ref<boolean>(false);

// 表单数据
const specificationForm = ref<ispecification>({
    id: null,
    name: '',
    description: '',
    status: 0,
    specificationOptions: '',
});

const specificationFormRef = ref<FormInstance>();

// 表单校验规则
const rules = ref<FormRules<ispecification>>({
    name: [
        { required: true, message: '规格名称不能为空', trigger: 'blur' },
        { min: 1, max: 20, message: '规格名称长度应为 1 到 20 个字符', trigger: 'blur' }
    ],
    description: [
        { required: true, message: '规格描述不能为空', trigger: 'blur' },
        { max: 30, message: '规格描述最多为30个字符', trigger: 'blur' }
    ],
    specificationOptions: [
        { required: true, message: '规格选项不能为空', trigger: 'blur' }
    ],
});

// 打开添加规格对话框
const addSpecification = () => {
    isEdit.value = false;
    dialogVisible.value = true;
    specificationForm.value = {
        id: null,
        name: '',
        description: '',
        status: 0,
        specificationOptions: '',
    };

};

// 编辑规格
const editSpecification = (specification: ispecification) => {
    isEdit.value = true;
    dialogVisible.value = true;
    Object.assign(specificationForm.value, specification);

    // 在初始化时，如果 `specificationForm.specificationOptions` 中有值，拆分成数组并显示标签
    if (specificationForm.value.specificationOptions) {
        specificationOptions.value = specificationForm.value.specificationOptions.split(',');
    }
};

// 存储已拆分的规格选项
const specificationOptions = ref<string[]>([]);

// 新输入的规格选项
const newOption = ref<string>('');

// 添加规格选项
const addOption = () => {
    const option = newOption.value.trim();
    if (option && !specificationOptions.value.includes(option)) {
        specificationOptions.value.push(option);
    }
    newOption.value = ''; // 清空输入框
};

// 移除规格选项
const removeOption = (index: number) => {
    specificationOptions.value.splice(index, 1);
};

// 保存规格信息
const saveSpecification = (formEl: FormInstance | undefined) => {
    if (!formEl) return;

    formEl.validate(async (valid: boolean) => {
        if (valid) {
            specificationForm.value.specificationOptions = specificationOptions.value.join(',');
            if (isEdit.value) {
                // 更新规格信息
                await editSepc(specificationForm.value);
            } else {
                // 新增规格信息
                await addSepc(specificationForm.value);
            }
            pageQuerySepc();
            dialogVisible.value = false;
        }
    });
};

// 删除规格
const deleteSpecification = (id: number) => {
    ElMessageBox.confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(async () => {
        await deleteSepc(id);
        pageQuerySepc();
    }).catch(() => {
        ElMessage({
            type: 'info',
            message: '已取消删除',
        });
    });
};

// 搜索和过滤条件
const filters = ref({
    name: '',
    status: -1,
});

// 只查看启用或禁用
const searchCategory = () => {
    pageQuery.value.name = filters.value.name;
    if (filters.value.status === 0 || filters.value.status === 1) {
        pageQuery.value.status = filters.value.status;
    } else {
        pageQuery.value.status = null;
    }
    pageQuerySepc();
}

// 启用或禁用
const enOrDisAble = async (id: number, status: number) => {
    specificationForm.value = {
        id: id,
        status: status,
    };

    await editSepc(specificationForm.value);
    pageQuerySepc();
}

// 每页大小改变时触发
const handleSizeChange = (pageSize: number) => {
    pageQuery.value.pageSize = pageSize;

    pageQuerySepc();
};

// 页码改变时触发
const handleCurrentChange = (page: number) => {
    pageQuery.value.page = page;

    pageQuerySepc();
};

// 初始化页面规格数据
onMounted(() => {
    pageQuery.value.page = page.value;
    pageQuery.value.pageSize = pageSize.value;

    pageQuerySepc()
});

</script>

<template>
    <el-card class="specification-management" shadow="hover">
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

                <!-- 规格状态选择框 -->
                <el-select v-model="filters.status" @change="searchCategory" placeholder="请选择分类状态" clearable
                    class="status-select">
                    <el-option label="全部" :value="-1"></el-option>
                    <el-option label="启用" :value="1"></el-option>
                    <el-option label="禁用" :value="0"></el-option>
                </el-select>

                <!-- 添加规格按钮 -->
                <el-button class="add-category-btn" type="primary" plain @click="addSpecification">
                    添加规格
                </el-button>
            </div>
        </el-card>

        <!-- 规格表格 -->
        <el-table :data="specList" border stripe style="width: 100%"
            :header-cell-style="{ 'text-align': 'center', background: '#fafafa', fontWeight: 'bold' }"
            :cell-style="{ 'text-align': 'center' }">
            <el-table-column type="index" label="序号" width="60"></el-table-column>
            <el-table-column prop="name" label="规格名称"></el-table-column>
            <el-table-column prop="description" label="规格描述"></el-table-column>
            <el-table-column prop="status" label="状态" width="100">
                <template #default="scope">
                    <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
                        {{ scope.row.status === 1 ? '启用' : '禁用' }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="specificationOptions" label="规格选项">
                <template #default="scope">
                    <el-tag v-for="(option, index) in scope.row.specificationOptions.split(',')" :key="index">
                        {{ option }}
                    </el-tag>
                </template>

            </el-table-column>
            <el-table-column label="操作" width="220">
                <template #default="scope">
                    <el-button :type="scope.row.status === 1 ? 'danger' : 'success'" size="small" link
                        @click="enOrDisAble(scope.row.id, scope.row.status === 1 ? 0 : 1)">
                        {{ scope.row.status === 1 ? '禁用' : '启用' }}
                    </el-button>
                    <el-button size="mini" @click="editSpecification(scope.row)" type="primary" link>编辑</el-button>
                    <el-button size="mini" @click="deleteSpecification(scope.row.id)" type="danger" link>删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="spec-pagination-block">
            <el-pagination v-model:current-page="page" v-model:page-size="pageSize" :page-sizes="[10, 20, 50, 100]"
                layout="total, sizes, prev, pager, next, jumper" :total="totalSpec" @size-change="handleSizeChange"
                @current-change="handleCurrentChange" />
        </div>

        <!-- 添加/编辑规格弹窗 -->
        <el-dialog v-model="dialogVisible" width="500px" :title="isEdit ? '编辑规格' : '添加规格'">
            <el-form :model="specificationForm" label-width="100px" :rules="rules" ref="specificationFormRef">
                <el-form-item label="规格名称" prop="name">
                    <el-input v-model="specificationForm.name" placeholder="请输入规格名称"></el-input>
                </el-form-item>
                <el-form-item label="规格描述" prop="description">
                    <el-input v-model="specificationForm.description" placeholder="请输入规格描述"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="specificationForm.status">
                        <el-radio :label="1">启用</el-radio>
                        <el-radio :label="0">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="规格选项">
                    <div>
                        <!-- 标签展示已添加的规格 -->
                        <el-tag v-for="(option, index) in specificationOptions"
                            :key="index" closable @close="removeOption(Number(index))">
                            {{ option }}
                        </el-tag>

                        <!-- 输入框用于添加新规格 -->
                        <el-input v-model="newOption" placeholder="按 Enter 添加" @keyup.enter="addOption"
                            @blur="addOption" class="input-new-option" />
                    </div>
                </el-form-item>
            </el-form>

            <div class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="saveSpecification(specificationFormRef)">保存</el-button>
            </div>
        </el-dialog>
    </el-card>
</template>

<style scoped>
.specification-management {
    padding: 20px;
}

/* 设置顶部卡片样式 */
.search-card {
    padding: 5px;
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

/* 分页组件样式 */
.spec-pagination-block {
    margin-top: 10px;
    display: flex;
    justify-content: end;
}

.input-new-option {
    width: 300px;
    margin-top: 10px;
    display: block;
}

.el-tag {
    margin-right: 5px;
    margin-bottom: 5px;
}

.dialog-footer {
    text-align: right;
}
</style>