import { addSpecApi, deleteSpecApi, editSpecApi, pageQuerySpecApi } from "@/apis/specificationApi"
import type { ipageQuerySpec, ispecificationDTO, result } from "./interfaceType"
import { ref } from "vue";
import { ElMessage } from "element-plus";


// 分页查询条件
const pageQuery = ref<ipageQuerySpec>({
    page: 1,
    pageSize: 10
})

// 展示规格数据列表
const specList = ref<ispecificationDTO[]>([]);
// 规格数据列表总条数
const totalSpec = ref<number>(0);

// 发送分页查询请求
const pageQuerySepc = async() => {
    const res: result = await pageQuerySpecApi(pageQuery.value);

    if (res.code === 1){
        specList.value = res.data.records;
        totalSpec.value = res.data.total;
    }else {
        ElMessage.error(res.msg);
    }
}

// 发送添加规格请求
const addSepc = async(spec: ispecificationDTO) => {
    const res: result = await addSpecApi(spec);

    if (res.code === 1){
        ElMessage.success("添加成功");
    }else {
        ElMessage.error(res.msg);
    }
}

// 发送修改规格请求
const editSepc = async(spec: ispecificationDTO) => {
    const res: result = await editSpecApi(spec);

    if (res.code === 1){
        ElMessage.success("修改成功");
    }else {
        ElMessage.error(res.msg);
    }
}

// 发送删除规格请求
const deleteSepc = async(id: number) => {
    const res: result = await deleteSpecApi(id);

    if (res.code === 1){
        ElMessage.success("删除成功");
    }else {
        ElMessage.error(res.msg);
    }
}


export default function(){
    return {
        pageQuery,
        specList,
        totalSpec,
        pageQuerySepc,
        addSepc,
        editSepc,
        deleteSepc
    }
}