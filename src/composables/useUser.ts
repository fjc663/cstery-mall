import { useUserInfoStore } from '@/stores/userInfoStore';
import { useCartItemsNumStore } from '@/stores/useCartItemsNumStore';
import { userLoginAPI, userRegisterAPI, editPasswordAPI, getUserInfoAPI, updateUserInfoAPI } from '@/apis/userApi';
import type { result, ieditPasswordDTO, iuserInfo, form } from './interfaceType';
import { ElMessage } from 'element-plus';
import router from '@/router';
import { ref } from 'vue';

const useUserInfo = useUserInfoStore();
const cartItemsNumStore = useCartItemsNumStore();

// 用户数据
const user = ref<iuserInfo>({
    id: -1,
    username: '',
    email: '',
    phone: '',
    avatarUrl: '',
    gender: -1,
    birthdate: '',
    address: '',
    lastLogin: '',
});

// 请求登录
const userLogin = async (loginRegisterForm: form): Promise<number> => {
    //删除用户名和密码左右两端的空格
    loginRegisterForm.username = loginRegisterForm.username.replace(/(^\s*)|(\s*$)/g, "");
    loginRegisterForm.password = loginRegisterForm.password.replace(/(^\s*)|(\s*$)/g, "");

    // 发送登录请求
    const res: result = await userLoginAPI(loginRegisterForm);

    if (res.code === 1) {
        ElMessage.success("登录成功");

        // 设置token和用户名
        useUserInfo.setToken(res.data.token);
        useUserInfo.setUsername(loginRegisterForm.username);
        useUserInfo.setAvatar(res.data.avatarUrl);

        // 获得购物车中商品数量
        cartItemsNumStore.getCartItemsNum();

    } else {
        ElMessage.error(res.msg);
    }
    return res.code;
};

// 用户注册
const userRegister = async (loginRegisterForm: form): Promise<number> => {
    // 发送注册请求和处理响应结果
    const res: result = await userRegisterAPI(loginRegisterForm);

    if (res.code === 1) {
        ElMessage.success("注册成功，请用该账号登录");
    } else {
        ElMessage.success(res.msg);
    }

    return res.code;
};

// 退出登录
const logout = () => {
    useUserInfo.removeTokenAndUsername()
    cartItemsNumStore.removeCartItemsNum();
    router.push({ path: '/login', query: { isLogin: 1 } });
}


// 修改密码
const editPassword = async (form: ieditPasswordDTO) => {
    const res: result = await editPasswordAPI(form);

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
const getUserInfo = async () => {
    const res: result = await getUserInfoAPI();

    if (res.code === 0) {
        ElMessage.error(res.msg);
        return;
    }
    user.value = res.data;
}

// 修改个人信息
const updateUserInfo = async () => {

    const res: result = await updateUserInfoAPI(user.value);

    if (res.code === 0) {
        ElMessage.error(res.msg);
    } else {
        ElMessage.success("修改成功");
    }
    getUserInfo();
};

export default function() {
    return {
        user,
        userLogin,
        userRegister,
        logout,
        editPassword,
        getUserInfo,
        updateUserInfo
    }
}