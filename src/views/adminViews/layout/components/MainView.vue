<template>
    <!-- 主内容区域 -->
    <el-container>
        <el-header class="header">
            <div class="header-right">
                <el-dropdown>
                    <span class="el-dropdown-link">
                        管理员<el-icon class="el-icon--right"><arrow-down /></el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item>个人信息</el-dropdown-item>
                            <el-dropdown-item>退出</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </el-header>

        <el-main class="main-content">
           <RouterView/>
        </el-main>
    </el-container>
</template>

<style lang="scss" scoped>
.header-right {
    cursor: pointer;
}

.el-dropdown,
.el-dropdown * {
    outline: none;
}

.header {
    background-color: #fff;
    padding: 0 20px;
    display: flex;
    justify-content: end;
    align-items: center;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.main-content {
    padding: 20px;
    background-color: #f5f5f5;
    min-height: 100%;

    .dashboard-cards {
        margin-top: 20px;

        .dashboard-card {
            .card-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 16px;
                margin-bottom: 10px;
            }

            .card-content {
                font-size: 2rem;
            }
        }
    }
}
</style>