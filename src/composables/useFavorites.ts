import { ref } from 'vue'
import type { result, ifavoritesproduct } from '@/composables/interfaceType';
import { ElMessage } from 'element-plus';
import { addProductToFavoritesAPI, getFavoritesProductAPI, deleteFavoritesProductAPI } from '@/apis/favoritesApi';

// 收藏商品数据
const favoritesProducts = ref<ifavoritesproduct[]>([]);

// 添加收藏夹商品数据
const addProductToFavorites = async (productId: number) => {
    const res: result = await addProductToFavoritesAPI(productId);

    if (res.code === 1) {
        ElMessage.success('添加收藏成功');
    } else {
        ElMessage.error(res.msg);
    }
}

// 请求收藏夹数据
const getFavoritesProduct = async () => {
    const res: result = await getFavoritesProductAPI();

    if (res.code === 0) {
        ElMessage.error(res.msg);
        return;
    }

    favoritesProducts.value = res.data;

}

// 删除收藏商品
const deleteFavoritesProduct = async(productId: number) => {
    const res: result = await deleteFavoritesProductAPI(productId);

    if (res.code === 1) {
        ElMessage.success('移除收藏成功');
    } else {
        ElMessage.error(res.msg);
    }
}

export default function() {
    return {
        favoritesProducts,
        addProductToFavorites,
        getFavoritesProduct,
        deleteFavoritesProduct
    }
}