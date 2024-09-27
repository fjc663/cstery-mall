<script lang="ts" setup>
import { ElMessage } from 'element-plus';
import { onMounted, ref } from 'vue'
import type { ComponentSize, FormRules, FormInstance, UploadProps } from 'element-plus'
import type { iuserInfo, result } from '@/composables/interfaceType';
import { pcaTextArr } from 'element-china-area-data'
import { useUserInfoStore } from '@/stores/userInfoStore';
import useUser from '@/composables/useUser';
import useUpload from '@/composables/useUpload';

// 用户信息展示页面设置
const size = ref<ComponentSize>('default')

// 用户数据
const { user, getUserInfo, updateUserInfo } = useUser();

// 用户修改的地址数据暂存处
const selectedOptions = ref<string[]>([]);
const detailAddress = ref<string>('');

// 请求用户数据
onMounted(async () => {
    await getUserInfo();

    selectedOptions.value = user.value.address.split(' ').slice(0, 3);
    detailAddress.value = user.value.address.split(' ')[3];
})

// 控制修改个人信息抽屉弹出
const editUserInfoDrawer = ref<boolean>(false)

// 表单实例的引用
const userRef = ref<FormInstance>();

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

// 点击取消修改按钮触发
const cancelEdit = () => {
    editUserInfoDrawer.value = false;
    getUserInfo();
}

// 修改个人信息
const editPersonalInfo = (formEl: FormInstance | undefined) => {
    if (!formEl) return;

    formEl.validate(async (valid: boolean) => {
        if (valid) {
            user.value.address = selectedOptions.value.join(' ') + ' ' + detailAddress.value;

            // 请求更新信息
            updateUserInfo();

            editUserInfoDrawer.value = false;
        }
    })
};

// 根据出生日期计算年龄
const calculateAge = (birthday: string) => {
    const ageDifMs: number = Date.now() - new Date(birthday).getTime();
    const ageDate: Date = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
};

const { uploadAvatar } = useUpload();

// 上传头像
const onUploadAvatar = async (avatar: any) => {
    const formData = new FormData();
    formData.append('avatarFile', avatar.file);

    const res: result = await uploadAvatar(formData);

    if (res.code === 1) {
        user.value.avatarUrl = res.data;

        const userInfoStore = useUserInfoStore();
        userInfoStore.setAvatar(res.data);
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

</script>

<template>

    <!-- 用户信息卡片 -->
    <el-card class="info-card" shadow="hover">
        <div class="card-header">
            <el-upload class="avatar-uploader" :http-request="onUploadAvatar" :show-file-list="false"
                :before-upload="beforeAvatarUpload">
                <img v-if="user.avatarUrl" v-lazy="user.avatarUrl" fit="cover" class="avatar" />
                <el-icon v-else class="avatar-uploader-icon">
                    <Plus />
                </el-icon>
            </el-upload>
        </div>
        <div class="card-body">
            <h2 class="username">{{ user.username }}</h2>

            <el-descriptions class="margin-top" :column="1" :size="size" border>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-xingbie"></use>
                            </svg>
                            性别
                        </div>
                    </template>
                    {{ user.gender === 1 ? '男' : user.gender === 0 ? '女' : '' }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-nianling"></use>
                            </svg>
                            年龄
                        </div>
                    </template>
                    {{ calculateAge(user.birthdate) }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-shengritixing"></use>
                            </svg>
                            生日
                        </div>
                    </template>
                    {{ user.birthdate }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-phone"></use>
                            </svg>
                            电话
                        </div>
                    </template>
                    {{ user.phone }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-youxiang"></use>
                            </svg>
                            邮箱
                        </div>
                    </template>
                    {{ user.email }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-dizhi"></use>
                            </svg>
                            地址
                        </div>
                    </template>
                    {{ user.address }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-shangcidenglushijian"></use>
                            </svg>
                            最后登录时间
                        </div>
                    </template>
                    {{ user.lastLogin }}
                </el-descriptions-item>
            </el-descriptions>
        </div>
        <el-button type="primary" class="edit-personali-nfo-button" plain
            @click="editUserInfoDrawer = true">修改个人信息</el-button>
    </el-card>

    <!-- 修改用户信息的抽屉 -->
    <el-drawer v-model="editUserInfoDrawer" title="修改基本信息" :before-close="cancelEdit">
        <el-form :model="user" label-width="auto" style="max-width: 600px" :rules="rules" ref="userRef">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="user.username" />
            </el-form-item>
            <el-form-item label="性别">
                <el-select v-model="user.gender" placeholder="请选择你的性别">
                    <el-option label="男" :value=1 />
                    <el-option label="女" :value=0 />
                    <el-option label="保密" :value=-1 />
                </el-select>
            </el-form-item>
            <el-form-item label="出生日期">
                <el-date-picker format="YYYY-MM-DD" value-format="YYYY-MM-DD" v-model="user.birthdate"
                    placeholder="请选择出生日期" style="width: 100%" />
            </el-form-item>
            <el-form-item label="电话" prop="phone">
                <el-input v-model="user.phone" />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="user.email" />
            </el-form-item>
            <el-form-item label="省/市/区">
                <el-cascader :options="pcaTextArr" v-model="selectedOptions">
                </el-cascader>
            </el-form-item>
            <el-form-item label="详细地址">
                <el-input v-model="detailAddress" />
            </el-form-item>
            <div class="edit-button">
                <el-button @click="cancelEdit">取消</el-button>
                <el-button type="primary" @click="editPersonalInfo(userRef)">确定</el-button>
            </div>
        </el-form>
    </el-drawer>

</template>

<style scoped>
.el-descriptions {
    margin-top: 20px;
}

.cell-item {
    display: flex;
    align-items: center;
}

.margin-top {
    margin-top: 20px;
}

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

.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
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
    margin: 10px;
    float: right;
}

.edit-button {
    display: flex;
    justify-content: center;
}
</style>