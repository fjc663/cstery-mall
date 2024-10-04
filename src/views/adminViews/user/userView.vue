<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import useAdmin from '@/composables/useAdmin';
import { useAdminInfoStore } from '@/stores/useAdminInfoStore';

// 用户管理逻辑
const { pageQuery, pageQueryUser, users, totalUser, resetPassword, setRole } = useAdmin();

// 当前管理员的角色
const adminStore = useAdminInfoStore();
const isSuperAdmin = ref<boolean>(adminStore.role == 'SUPER');

// 筛选条件
const filters = ref({
    username: '',
    role: 'ALL'
});

// 分页信息
const page = ref<number>(1);
const pageSize = ref<number>(10);

// 加载用户数据
const loadUsers = () => {
    pageQuery.value.page = page.value;
    pageQuery.value.pageSize = pageSize.value;

    // 调用获取用户列表的API
    pageQueryUser();
};

// 控制重置密码弹窗
const resetPasswdDialogVisible = ref(false)
// 存储输入的新密码
const password = ref<string>('');
// 要修改用户的id
const setPasswdUserId = ref<number>(-1);

// 弹出重置密码弹窗
const onResetPasswdDialog = (userId: number) => {
    setPasswdUserId.value = userId;
    resetPasswdDialogVisible.value = true;
}

// 重置密码函数
const resetUserPassword = async (userId: number) => {

    // 去除两边空格
    password.value = password.value.replace(/(^\s*)|(\s*$)/g, "");

    if (!password.value || password.value.length < 6) {
        ElMessage.error('密码长度应不少于 6 个字符');
        return;
    }

    // 提交修改密码的请求
    const code: number = await resetPassword(userId, password.value);

    if (code === 1) {
        resetPasswdDialogVisible.value = false;
    }
};


// 修改用户角色（仅限超级管理员）
const changeRole = (userId: number, newRole: string) => {
    ElMessageBox.confirm(`确定将该用户设置为${newRole === 'ADMIN' ? '管理员' : '普通用户'}吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(async () => {
        await setRole(userId, newRole);
        loadUsers();
    }).catch(() => {
        ElMessage.info('已取消');
    });
};

// 每页大小改变时触发
const handleSizeChange = (pageSize: number) => {
    pageQuery.value.pageSize = pageSize;

    pageQueryUser();
};

// 页码改变时触发
const handleCurrentChange = (page: number) => {
    pageQuery.value.page = page;

    pageQueryUser();
};

// 搜索用户
const searchUser = () => {
    pageQuery.value.username = filters.value.username;

    if (filters.value.role && (filters.value.role === 'ADMIN' || filters.value.role === 'USER')) {
        pageQuery.value.role = filters.value.role;
    } else {
        pageQuery.value.role = null;
    }

    pageQueryUser();
};

// 初始化页面数据
onMounted(() => {
    loadUsers();
});
</script>

<template>

    <!-- 重置密码弹窗 -->
    <el-dialog v-model="resetPasswdDialogVisible" title="重置密码" width="500" center class="reset-password-dialog">
        <el-form class="reset-password-form">
            <!-- 输入新密码 -->
            <el-form-item>
                <el-input v-model="password" class="password-input" type="password" placeholder="请输入新密码"
                    show-password />
            </el-form-item>
        </el-form>

        <!-- 底部操作按钮 -->
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="resetPasswdDialogVisible = false" class="cancel-btn">取消</el-button>
                <el-button type="primary" @click="resetUserPassword(setPasswdUserId)" class="submit-btn">重置</el-button>
            </div>
        </template>
    </el-dialog>

    <div class="user-management-page">
        <el-card class="search-filter-card" shadow="hover">
            <!-- 筛选条件 -->
            <el-form :inline="true" label-width="80px" class="filter-form">
                <!-- 用户名搜索 -->
                <el-form-item label="用户名" class="filter-item">
                    <el-input v-model="filters.username" placeholder="请输入用户名" clearable class="filter-input">
                        <template #append>
                            <el-button class="search-btn" @click="searchUser">
                                <svg class="icon" aria-hidden="true">
                                    <use xlink:href="#icon-find"></use>
                                </svg>
                            </el-button>
                        </template>
                    </el-input>
                </el-form-item>

                <!-- 用户角色选择 -->
                <el-form-item label="用户角色" class="filter-item">
                    <el-select v-model="filters.role" placeholder="请选择角色" @change="searchUser" class="role-select">
                        <el-option label="全部" value="ALL" />
                        <el-option label="普通用户" value="USER" />
                        <el-option label="管理员" value="ADMIN" />
                    </el-select>
                </el-form-item>
            </el-form>
        </el-card>

        <div class="user-management">
            <!-- 用户列表表格 -->
            <el-table :data="users" stripe border
                :header-cell-style="{ 'text-align': 'center', background: '#f0f0f5', fontWeight: 'bold', color: '#333' }"
                :cell-style="{ 'text-align': 'center' }" class="user-table">
                <el-table-column type="index" label="序号" width="60" />
                <el-table-column prop="username" label="用户名" />
                <el-table-column prop="role" label="角色">
                    <template #default="scope">
                        <el-tag :type="scope.row.role === 'ADMIN' ? 'success' : 'info'">
                            {{ scope.row.role === 'ADMIN' ? '管理员' : '用户' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="220">
                    <template #default="scope">
                        <el-button type="danger" size="small" @click="onResetPasswdDialog(scope.row.id)"
                            class="action-button">重置密码</el-button>
                        <el-button v-if="isSuperAdmin && scope.row.role === 'USER'" type="warning" size="small"
                            class="action-button" @click="changeRole(scope.row.id, 'ADMIN')">
                            设为管理员
                        </el-button>
                        <el-button v-if="isSuperAdmin && scope.row.role === 'ADMIN'" type="primary" size="small"
                            class="action-button" @click="changeRole(scope.row.id, 'USER')">
                            设为普通用户
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 分页 -->
        <div class="user-pagination-block">
            <el-pagination v-model:current-page="page" v-model:page-size="pageSize" :page-sizes="[10, 20, 40, 60, 100]"
                layout="total, sizes, prev, pager, next, jumper" :total="totalUser" @size-change="handleSizeChange"
                @current-change="handleCurrentChange" />
        </div>
    </div>
</template>

<style scoped>
.reset-password-dialog {

    /* 调整弹窗背景、圆角和阴影 */
    .el-dialog__body {
        padding: 20px 40px;
        background-color: #f9f9f9;
        border-radius: 12px;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    }
}

.reset-password-form {
    margin-top: 20px;
}

.password-input {
    width: 100%;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #dcdfe6;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
}

.dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 15px;
    padding: 15px 20px;
    border-top: 1px solid #ebeef5;
}

.cancel-btn {
    background-color: #f5f7fa;
    border-color: #dcdfe6;
    color: #606266;
    transition: all 0.3s ease;
}

.cancel-btn:hover {
    background-color: #e6ebf5;
    color: #333;
}

.submit-btn {
    background-color: #409eff;
    color: #fff;
    padding: 10px 20px;
    border-radius: 8px;
    transition: all 0.3s ease;
}

.submit-btn:hover {
    background-color: #66b1ff;
}

.user-management-page {
    padding: 20px;
    background-color: #f9fafc;
}

.search-filter-card {
    border-radius: 10px;
    background-color: #ffffff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    margin-bottom: 20px;
}

.filter-form {
    display: flex;
    gap: 20px;
    align-items: center;
}

.filter-item {
    margin-bottom: 0;
}

.filter-input {
    width: 200px;
    border-radius: 4px;
    overflow: hidden;
}

.search-btn {
    background-color: #409eff;
    color: white;
    padding: 8px;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
    transition: background-color 0.3s ease;
}

.search-btn:hover {
    background-color: #66b1ff;
}

.role-select {
    width: 100px;
    border-radius: 4px;
}

.icon {
    fill: currentColor;
    width: 18px;
    height: 18px;
}

.user-management {
    background-color: #f9fafc;
}

.user-table {
    width: 100%;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    background-color: #fff;
    overflow: hidden;
}

.el-table th {
    background-color: #f0f0f5 !important;
    color: #333 !important;
    font-weight: bold;
    font-size: 14px;
}

.el-table td {
    font-size: 14px;
    color: #555;
}

.el-tag {
    font-size: 12px;
    padding: 0 10px;
    line-height: 20px;
    border-radius: 5px;
}

.action-button {
    margin: 0 5px;
    padding: 8px 12px;
    border-radius: 4px;
    transition: background-color 0.3s ease;
}

.action-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.el-button--danger {
    background-color: #f07272;
    color: white;
}

.el-button--warning {
    background-color: rgb(91, 209, 130);
    color: white;
}

.el-button--primary {
    background-color: #409eff;
    color: white;
}

.el-button--danger:hover {
    background-color: #dd4b4b;
}

.el-button--warning:hover {
    background-color: #42bd98;
}

.el-button--primary:hover {
    background-color: #358ad9;
}

/* 分页组件样式 */
.user-pagination-block {
    margin-top: 10px;
    display: flex;
    justify-content: end;
}
</style>
