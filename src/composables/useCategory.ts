import { ref } from "vue";
import type { result } from "./interfaceType/commonInterface";
import type { iuserCategory } from "./interfaceType/userInterface";
import type { iadminCategory, ipageQueryCategory } from "./interfaceType/adminInterface";
import { addCategoryAPI, deleteCategoryAPI, editCategoryAPI, getCategoryListAPI, getSubCategoryListAPI, pageQueryCategoryAPI } from "@/apis/categoryApi";
import { ElMessage } from "element-plus";

// 一级分类数据
const categories = ref<iuserCategory[]>([])

// 二级分类数据
const subCategories = ref<iuserCategory[]>([]);

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

// ================================================================

// 全部分类数据
const allCategories = ref<iadminCategory[]>([]);

// 分页查询条件
const pageQueryCategoryDTO = ref<ipageQueryCategory>({
    page: 1,
    pageSize: 10
});

// 分页查询得到总条数
const totalCategory = ref<number>(0);

// 添加分类
const addCategory = async (category: iadminCategory) => {
    const res: result = await addCategoryAPI(category);

    if (res.code === 1) {
        ElMessage.success("添加成功")
    } else {
        ElMessage.error(res.msg);
    }
}

// 分页查询分类
const pageQueryCategory = async () => {
    const res: result = await pageQueryCategoryAPI(pageQueryCategoryDTO.value);

    if (res.code === 0) {
        ElMessage.error(res.msg);
        return;
    }

    if (res.data) {
        allCategories.value = res.data.records;
        totalCategory.value = res.data.total;
    }

}

// 修改分类
const editCategory = async (category: iadminCategory) => {
    const res: result = await editCategoryAPI(category);

    if (res.code === 1) {
        ElMessage.success("修改成功")
    } else {
        ElMessage.error(res.msg);
    }

}

// 删除分类
const deleteCategory = async (categoryId: number) => {
    const res: result = await deleteCategoryAPI(categoryId);

    if (res.code === 1) {
        ElMessage.success("删除成功")
    } else {
        ElMessage.error(res.msg);
    }

}

export default function () {
    return {
        categories,
        subCategories,
        allCategories,
        totalCategory,
        pageQueryCategoryDTO,
        getCategoryList,
        getSubCategoryList,
        addCategory,
        pageQueryCategory,
        editCategory,
        deleteCategory
    }
}