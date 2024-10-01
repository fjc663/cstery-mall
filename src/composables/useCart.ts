// src/composables/useCart.ts
import { ref } from 'vue';
import { getCartItemsAPI, deleteAllCartAPI, deleteCartAPI, updateCartItemQuantityAPI, addPorductToCartAPI } from '@/apis/cartApi'; // 引入获取购物车数据的 API
import { ElMessage } from 'element-plus';
import type { result } from './interfaceType/commonInterface';
import type { icart, icartProduct } from './interfaceType/userInterface';
import { useCartItemsNumStore } from '@/stores/useCartItemsNumStore';

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


// 清空购物车
const deleteAllCart = async() => {
  const res: result = await deleteAllCartAPI();

  if (res.code === 0) {
    ElMessage.error(res.msg);
  } else {
    ElMessage.success('购物车已清空');
    cartItems.value = [];

    const cartItemsNumStore = useCartItemsNumStore();
    cartItemsNumStore.getCartItemsNum();
  }
}

// 删除商品
const deleteCart = async (item: icart) => {
  const res: result = await deleteCartAPI(item.id);

  if (res.code === 0) {
      ElMessage.error(res.msg);
  } else {
      const cartItemsNumStore = useCartItemsNumStore();
      cartItemsNumStore.getCartItemsNum();
      getCartItems();
  }
};

// 更新商品数量
const updateCartItemQuantity = async (item: icart) => {
  const res: result = await updateCartItemQuantityAPI(item.id, item.quantity);
  if (res.code === 0) {
      ElMessage.error(res.msg);
  }
};

// 添加到购物车
const addPorductToCart = async (cartProduct: icartProduct) => {
  const res: result = await addPorductToCartAPI(cartProduct);

  if (res.code === 1) {
      ElMessage.success('加入购物车成功');

      const cartItemsNumStore = useCartItemsNumStore();
      cartItemsNumStore.getCartItemsNum();
  } else {
      ElMessage.error(res.msg);
  }
};

export default function() {
  return {
    cartItems,
    getCartItems,
    deleteAllCart,
    deleteCart,
    updateCartItemQuantity,
    addPorductToCart
  };
}
