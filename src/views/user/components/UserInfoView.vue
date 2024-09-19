<script lang="ts" setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';

// 用户数据
const user = ref({
    id: 1,
    username: 'johndoe',
    email: 'johndoe@example.com',
    phone: '+1234567890',
    avatarUrl: 'http://example.com/avatar.jpg',
    gender: 1,
    birthdate: new Date('1990-01-01T00:00:00'),
    address: '北京市朝阳区',
    lastLogin: new Date(),
});

// 修改个人信息
const editPersonalInfo = () => {
    ElMessage.success('修改个人信息功能尚未开发');
};
</script>

<template>

    <!-- 用户信息卡片 -->
    <el-card class="info-card" shadow="hover">
        <div class="card-header">
            <el-image :src="user.avatarUrl" fit="cover" class="avatar" />
        </div>
        <div class="card-body">
            <h2 class="username">{{ user.username }}</h2>
            <p class="email">{{ user.email }}</p>
            <p class="phone">{{ user.phone }}</p>
            <p class="gender">{{ user.gender === 1 ? '男' : '女' }}</p>
            <p class="birthdate">生日：{{ user.birthdate }}</p>
            <el-button type="primary" class="edit-personali-nfo-button" plain @click="editPersonalInfo">修改个人信息</el-button>
        </div>
    </el-card>

</template>

<style scoped>

.info-card {
    background-color: #fff;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
    text-align: center;
    margin-bottom: 20px;
}

.avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
}

.username {
    font-size: 24px;
    font-weight: bold;
    text-align: center;
}

.email,
.phone,
.gender,
.birthdate {
    color: #666;
    margin: 10px 0;
    text-align: center;
}

.edit-personali-nfo-button {
    float: right;
}
</style>