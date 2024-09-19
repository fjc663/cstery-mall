// src/composables/useCart.ts
import { ref, computed, onMounted } from 'vue';
import { getCartItemsAPI } from '@/apis/cartApi'; // 引入获取购物车数据的 API
import { ElMessage } from 'element-plus';
import type { icart, result } from '@/composables/interfaceType';

export function useCart() {
  // 购物车数据
  const cartItems = ref<icart[]>([]);

  // 请求当前用户购物车数据
  const getCartItems = async () => {
    const res: result = await getCartItemsAPI();

    if (res.code === 0) {
      cartItems.value = [];
      ElMessage.warning(res.msg);
      return;
    }

    cartItems.value = res.data;
  };

  // 计算购物车总价
  const cartTotal = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.productPrice * item.quantity, 0);
  });

  // 初始化购物车数据
  onMounted(() => getCartItems());

  return {
    cartItems,
    cartTotal,
    getCartItems
  };
}
