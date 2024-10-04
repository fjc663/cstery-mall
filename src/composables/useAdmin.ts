import { adminLoginAPI, editAdminPasswordAPI, getAdminUserInfoAPI, pageQueryUserApi, resetPasswordApi, saveAdminInfoAPI, setRoleApi } from '@/apis/userApi';
import type { result } from './interfaceType/commonInterface';
import type { iadmin, ipagequeryUser } from '@/composables/interfaceType/adminInterface';
import type { iadminUserInfo } from '@/composables/interfaceType/adminInterface';
import type { ieditPassword } from '@/composables/interfaceType/commonInterface';

import { ElMessage } from 'element-plus';
import router from '@/router';
import { ref } from 'vue';
import { useAdminInfoStore } from '@/stores/useAdminInfoStore';

const useAdminInfo = useAdminInfoStore();

// 用户数据
const admin = ref<iadminUserInfo>({
    id: -1,
    username: '',
    email: '',
    phone: '',
    role: '',
    avatarUrl: '',
    gender: -1,
    lastLogin: '',
});

// 请求登录
const adminLogin = async (loginRegisterForm: iadmin): Promise<number> => {
    //删除用户名和密码左右两端的空格
    loginRegisterForm.username = loginRegisterForm.username.replace(/(^\s*)|(\s*$)/g, "");
    loginRegisterForm.password = loginRegisterForm.password.replace(/(^\s*)|(\s*$)/g, "");

    // 发送登录请求
    const res: result = await adminLoginAPI(loginRegisterForm);

    if (res.code === 1) {
        ElMessage.success("登录成功");

        // 设置token和用户名
        useAdminInfo.setToken(res.data.token);
        useAdminInfo.setUsername(loginRegisterForm.username);
        useAdminInfo.setAvatar(res.data.avatarUrl);
        useAdminInfo.setRole(res.data.role);

    } else {
        ElMessage.error(res.msg);
    }
    return res.code;
};

// 退出登录
const logout = () => {
    useAdminInfo.remove()
    router.push('/adminLogin');
}


// 修改密码
const editAdminPassword = async (form: ieditPassword) => {
    const res: result = await editAdminPasswordAPI(form);

    if (res.code === 1) {
        ElMessage.success('密码修改成功');

        form = {
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
        };

        logout();
        ElMessage.success('请用新密码登录');
    } else {
        ElMessage.error(res.msg);
    }
};

// 请求用户数据
const getAdminUserInfo = async () => {
    const res: result = await getAdminUserInfoAPI();

    if (res.code === 0) {
        ElMessage.error(res.msg);
        return;
    }
    admin.value = res.data;
}

// 保存个人信息
const saveAdminInfo = async () => {

    const res: result = await saveAdminInfoAPI(admin.value);

    if (res.code === 0) {
        ElMessage.error(res.msg);
    } else {
        ElMessage.success("保存成功");
    }
    getAdminUserInfo();
};

// 分页条件
const pageQuery = ref<ipagequeryUser>({
    page: 1,
    pageSize: 10
})

// 用户总数
const totalUser = ref<number>(0);

// 分页查询的用户数据
const users = ref<iadminUserInfo[]>([]);

// 分页查询用户信息
const pageQueryUser = async () => {
    const res: result = await pageQueryUserApi(pageQuery.value);

    if (res.code === 0) {
        ElMessage.error(res.msg);
        return;
    }

    totalUser.value = res.data.total;
    users.value = res.data.records;
}

// 设置用户角色
const setRole = async (id: number, role: string) => {
    const res: result = await setRoleApi(id, role);

    if (res.code === 1) {
        ElMessage.success("设置成功");
    } else {
        ElMessage.error(res.msg);
    }
}

// 重置密码
const resetPassword = async (id: number, password: string): Promise<number> => {
    const res: result = await resetPasswordApi(id, password);

    if (res.code === 1) {
        ElMessage.success("设置成功");
    } else {
        ElMessage.error(res.msg);
    }

    return res.code;
}

export default function () {
    return {
        admin,
        adminLogin,
        logout,
        editAdminPassword,
        getAdminUserInfo,
        saveAdminInfo,
        pageQuery,
        totalUser,
        users,
        pageQueryUser,
        setRole,
        resetPassword
    }
}