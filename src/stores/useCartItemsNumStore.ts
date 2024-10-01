import { getCartItemsNumAPI } from "@/apis/cartApi";
import type { result } from "@/composables/interfaceType/commonInterface";
import { defineStore } from "pinia";
import { ref } from "vue";

// 获得当前用户的购物车商品数量（相同商品算一个）
export const useCartItemsNumStore = defineStore('cartItemsNum', () => {

    const cartItemsNum = ref<number>(0);

    // 请求数据
    const getCartItemsNum = async () => {
        const res: result = await getCartItemsNumAPI();
        cartItemsNum.value = res.data;
    }

    // 移除数据
    const removeCartItemsNum = () => {
        cartItemsNum.value = 0;
    }

    return {cartItemsNum, getCartItemsNum, removeCartItemsNum}
},
    {
        persist: true
    }
)