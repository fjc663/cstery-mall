import { ref } from 'vue'
import { getProductListByCategoryIdAPI, getProductDetailAPI, getFeaturedProductsAPI, pageQueryProductAPI, adminPageQueryProductAPI, addProductAPI, editProductAPI, deleteProductAPI } from '@/apis/productApi';
import type { result } from "./interfaceType/commonInterface";
import type { iuserProduct, ispecification, ifeaturedproduct, iuserPageQueryProduct } from './interfaceType/userInterface';
import { ElMessage } from 'element-plus';
import type { iadminPageQueryProduct, iadminProduct } from './interfaceType/adminInterface';

// 当前选中的二级分类对应商品
const products = ref<iuserProduct[]>([]);

// 查询到的商品总条数
const totalProduct = ref<number>(0);

// 分页查询条件
const pageQuery = ref<iuserPageQueryProduct>({
    categoryId: -1,
    page: 1, // 当前页码
    pageSize: 20, // 当前页大小
    name: '', 
    isOrderBypriceASC: false,
    isOrderBypriceDESC: false,
    isALLData: false
});

// 商品详细数据和对应的规格数据
const product = ref<iuserProduct>({
    id: 0,
    name: '',
    description: '',
    imageUrl: '',
    price: 0,
    isFavorites: false,
    sales: 0,
    stock: 0
});
const specifications = ref<ispecification[]>([]);

// 特色商品数据
const featuredProducts = ref<ifeaturedproduct[]>([]);

// 根据二级分类id获得商品数据
const getProductListByCategoryId = async (categoryId: number) => {
    const res: result = await getProductListByCategoryIdAPI(categoryId);
    if (res.code === 0) {
        ElMessage.error(res.msg);
        return;
    }

    products.value = res.data;

}

// 根据二级分类id分页查询商品数据
const pageQueryByCategoryId = async () => {
    const res: result = await pageQueryProductAPI(pageQuery.value);
    if (res.code === 0) {
        ElMessage.error(res.msg);
        return;
    }

    products.value = res.data.records;
    totalProduct.value = res.data.total;

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

// 请求特色商品数据
const getFeaturedProducts = async () => {
    const res: result = await getFeaturedProductsAPI();

    if (res.code === 0) {
        ElMessage.error(res.msg);
        return;
    }

    featuredProducts.value = res.data;
}

// ===============================================================

// 管理端返回的商品数据
const adminProducts = ref<iadminProduct[]>([]);
// 管理端查询到的商品总条数
const totalProductAdmin = ref<number>(0);

// 管理端分页查询条件
const pageQueryAdmin = ref<iadminPageQueryProduct>({
    page: 1, // 当前页码
    pageSize: 30, // 当前页大小
});


// 管理端分页查询商品数据
const adminPageQueryProduct = async () => {
    const res: result = await adminPageQueryProductAPI(pageQueryAdmin.value);

    if (res.code === 0) {
        ElMessage.error(res.msg);
        return;
    }

    adminProducts.value = res.data.records;
    totalProductAdmin.value = res.data.total;
}

// 管理端添加商品数据
const addProduct = async (product: iadminProduct) => {
    const res: result = await addProductAPI(product);

    if (res.code === 1) {
        ElMessage.success("添加成功");
    } else {
        ElMessage.error(res.msg);
    }
}

// 管理端更新商品数据
const editProduct = async (product: iadminProduct) => {
    const res: result = await editProductAPI(product);

    if (res.code === 1) {
        ElMessage.success("修改成功");
    } else {
        ElMessage.error(res.msg);
    }
}

// 管理端删除商品数据
const deleteProduct = async (id: number) => {
    const res: result = await deleteProductAPI(id);

    if (res.code === 1) {
        ElMessage.success("删除成功");
    } else {
        ElMessage.error(res.msg);
    }
}


export default function() {
    return {
        products,
        pageQuery,
        totalProduct,
        product,
        featuredProducts,
        specifications,
        getProductListByCategoryId,
        pageQueryByCategoryId,
        getProductDetail,
        getFeaturedProducts,

        adminProducts,
        totalProductAdmin,
        pageQueryAdmin,
        adminPageQueryProduct,
        addProduct,
        editProduct,
        deleteProduct
    }
}