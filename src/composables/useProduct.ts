import { ref } from 'vue'
import { getProductListByCategoryIdAPI, getProductDetailAPI } from '@/apis/productApi';
import type { iproduct, result, ispecifications } from '@/composables/interfaceType';
import { ElMessage } from 'element-plus';

// 当前选中的二级分类对应商品
const products = ref<iproduct[]>([]);

// 商品详细数据和对应的规格数据
const product = ref<iproduct>({
    id: 0,
    name: '',
    description: '',
    imageUrl: '',
    price: 0,
});
const specifications = ref<ispecifications[]>([]);

// 根据二级分类id获得商品数据
const getProductListByCategoryId = async (categoryId: number) => {
    const res: result = await getProductListByCategoryIdAPI(categoryId);
    if (res.code === 0) {
        ElMessage.error(res.msg);
        return;
    }

    products.value = res.data;

}

// 根据id请求商品详细信息
const getProductDetail = async (productId: number) => {
    const res: result = await getProductDetailAPI(productId);
    if (res.code === 0) {
        ElMessage.error(res.msg);
        return;
    }

    product.value = res.data;
    specifications.value = res.data.specifications;

};

export function useProduct() {
    return {
        products,
        product,
        specifications,
        getProductListByCategoryId,
        getProductDetail
    }
}