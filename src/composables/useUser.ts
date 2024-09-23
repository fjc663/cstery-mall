import { useUserInfoStore } from '@/stores/userInfoStore';
import { useCartItemsNumStore } from '@/stores/useCartItemsNumStore';
import router from '@/router';

const useUserInfo = useUserInfoStore();
const cartItemsNumStore = useCartItemsNumStore();

// 点击退出登录按钮触发
const logout = () => {
    useUserInfo.removeTokenAndUsername()
    cartItemsNumStore.removeCartItemsNum();
    router.push({ path: '/login', query: { isLogin: 1 } });
}

// 点击登录按钮触发
const login = () => {
    router.push({ path: '/login', query: { isLogin: 1 } });
}

// 点击注册按钮触发
const register = () => {
    router.push({ path: '/login', query: { isLogin: 0 } });
}

export function useUser() {
    return {
        login,
        register,
        logout
    }
}