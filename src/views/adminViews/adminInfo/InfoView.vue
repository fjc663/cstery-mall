<script lang="ts" setup>
import useAdmin from '@/composables/useAdmin';
import { ref } from 'vue';
import { onMounted } from 'vue';
import { type FormRules, type FormInstance, type UploadProps, ElMessage } from 'element-plus'
import type { result } from '@/composables/interfaceType/commonInterface';
import type { iuserInfo } from '@/composables/interfaceType/userInterface';
import { useAdminInfoStore } from '@/stores/useAdminInfoStore';
import useUpload from '@/composables/useUpload';

const {admin, getAdminUserInfo, saveAdminInfo} = useAdmin();

// 表单实例的引用
const adminUserRef = ref<FormInstance>();

// 校验要修改的用户数据
const rules = ref<FormRules<iuserInfo>>({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 1, max: 20, message: '用户名字符长度为1到20', trigger: 'blur' },
    ],
    email: [
        {
            required: true, message: '请输入邮箱地址', trigger: 'blur',
        },
        {
            type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'],
        },
    ],
    phone: [
        { min: 11, max: 11, message: "请输入11位手机号码", trigger: "blur" },
        { pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/, message: "请输入正确的手机号码", },
    ]

})

const { uploadAdminAvatar } = useUpload();

// 上传头像的逻辑
const onUploadAvatar = async (avatar: any) => {
    const formData = new FormData();
    formData.append('avatarFile', avatar.file);

    const res: result = await uploadAdminAvatar(formData);

    if (res.code === 1) {
        admin.value.avatarUrl = res.data;

        const useAdminInfo = useAdminInfoStore();
        useAdminInfo.setAvatar(res.data);
    }
}

// 上传头像前的钩子函数
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
    if (rawFile.size / 1024 / 1024 > 2) {
        ElMessage.error('头像大小必须小于2MB')
        return false
    }
    return true
}

// 修改个人信息
const savePersonalInfo = (formEl: FormInstance | undefined) => {
    if (!formEl) return;

    formEl.validate(async (valid: boolean) => {
        if (valid) {
            // 请求保存信息
            saveAdminInfo();
        }
    })
};

// 初始化管理员用户信息
onMounted(() => getAdminUserInfo())
</script>

<template>
    <el-card class="user-info-card" shadow="hover">
        <!-- 头像区域 -->
        <div class="avatar-section">
            <el-upload class="avatar-uploader" :http-request="onUploadAvatar" :show-file-list="false"
                :before-upload="beforeAvatarUpload">
                <img v-if="admin.avatarUrl" :src="admin.avatarUrl" class="user-avatar" />
                <el-icon v-else class="avatar-upload-icon">
                    <Plus />
                </el-icon>
            </el-upload>
        </div>

         <!-- 最近登录时间 -->
         <div class="last-login">
            最近登录时间：{{ admin.lastLogin || '暂无记录' }}
        </div>

        <!-- 用户信息表单 -->
        <el-form :model="admin" label-width="100px" class="user-info-form" :rules="rules" ref="adminUserRef">
            <el-form-item label="姓名" prop="username">
                <el-input v-model="admin.username" placeholder="请输入姓名"></el-input>
            </el-form-item>

            <el-form-item label="邮箱" prop="email">
                <el-input v-model="admin.email" placeholder="请输入邮箱"></el-input>
            </el-form-item>

            <el-form-item label="电话" prop="phone">
                <el-input v-model="admin.phone" placeholder="请输入电话" maxlength="11"></el-input>
            </el-form-item>

            <el-form-item label="性别">
                <el-radio-group v-model="admin.gender">
                    <el-radio :value="1">男</el-radio>
                    <el-radio :value="0">女</el-radio>
                    <el-radio :value="-1">保密</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>

        <!-- 保存按钮 -->
        <div class="form-footer">
            <el-button type="primary" @click="savePersonalInfo(adminUserRef)">保存</el-button>
        </div>
    </el-card>
</template>

<style scoped>
/* 卡片样式 */
.user-info-card {
    width: 500px;
    margin: 50px auto;
    padding: 30px;
    border-radius: 12px;
}

/* 头像区域样式 */
.avatar-section {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
}

.avatar-uploader {
    width: 120px;
    height: 120px;
    border: 2px dashed #d9d9d9;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f9f9f9;
    transition: border-color 0.3s ease, background-color 0.3s ease;
}

.avatar-uploader:hover {
    border-color: #409eff;
    background-color: #f0f9ff;
}

.user-avatar {
    width: 120px;
    height: 120px;
    object-fit: cover;
    border-radius: 50%;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.avatar-upload-icon {
    font-size: 40px;
    color: #8c939d;
}

/* 最近登录时间样式 */
.last-login {
    text-align: center;
    margin-top: 10px;
    font-size: 14px;
    color: #909399;
}

/* 表单样式 */
.user-info-form {
    margin-top: 20px;
}

.el-form-item {
    margin-bottom: 20px;
}

.el-input {
    width: 100%;
}

/* 表单底部按钮 */
.form-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
}
</style>