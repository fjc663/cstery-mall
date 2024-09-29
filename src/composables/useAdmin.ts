import { adminLoginAPI, editAdminPasswordAPI, getAdminUserInfoAPI, saveAdminInfoAPI } from '@/apis/userApi';
import type { result, iuserInfo, form, ieditPasswordDTO } from './interfaceType';
import { ElMessage } from 'element-plus';
import router from '@/router';
import { ref } from 'vue';
import { useAdminInfoStore } from '@/stores/adminInfoStore';

const useAdminInfo = useAdminInfoStore();

// 用户数据
const admin = ref<iuserInfo>({
    id: -1,
    username: '',
    email: '',
    phone: '',
    role: '',
    avatarUrl: '',
    gender: -1,
    birthdate: '',
    address: '',
    lastLogin: '',
});

// 请求登录
const adminLogin = async (loginRegisterForm: form): Promise<number> => {
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

    } else {
        ElMessage.error(res.msg);
    }
    return res.code;
};

// 退出登录
const logout = () => {
    useAdminInfo.removeTokenAndUsername()
    router.push('/adminLogin');
}


// 修改密码
const editAdminPassword = async (form: ieditPasswordDTO) => {
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

export default function() {
    return {
        admin,
        adminLogin,
        logout,
        editAdminPassword,
        getAdminUserInfo,
        saveAdminInfo
    }
}