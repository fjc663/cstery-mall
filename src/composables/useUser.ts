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

export function useUser() {
    return {
        logout
    }
}