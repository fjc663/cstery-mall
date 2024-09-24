import { ref } from "vue";
import type { category, result } from "./interfaceType";
import { getCategoryListAPI, getSubCategoryListAPI } from "@/apis/categoryApi";
import { ElMessage } from "element-plus";

// 一级分类数据
const categories = ref<category[]>([])

// 二级分类数据
const subCategories = ref<category[]>([]);

// 获取一级分类
const getCategoryList = async () => {
    const res: result = await getCategoryListAPI();
    if (res.code === 0) {
        ElMessage.error(res.msg);
        return;
    }

    if (res.data) {
        categories.value = res.data;
    }
}

// 根据一级分类id获得二级分类
const getSubCategoryList = async (subCategoryId: number) => {

    const res: result = await getSubCategoryListAPI(subCategoryId);
    if (res.code === 0) {
        ElMessage.error(res.msg);
        return;
    }

    if (res.data) {
        subCategories.value = res.data;
    }

}

export function useCategory() {
    return {
        categories,
        subCategories,
        getCategoryList,
        getSubCategoryList
    }
}