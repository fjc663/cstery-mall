import { addSpecApi, deleteSpecApi, editSpecApi, getAllSpecApi, pageQuerySpecApi } from "@/apis/specificationApi"
import type { result } from "./interfaceType/commonInterface";
import type { ipageQuerySpec, ispecification } from "./interfaceType/adminInterface";
import { ref } from "vue";
import { ElMessage } from "element-plus";


// 分页查询条件
const pageQuery = ref<ipageQuerySpec>({
    page: 1,
    pageSize: 10
})

// 展示规格数据列表
const specList = ref<ispecification[]>([]);
// 规格数据列表总条数
const totalSpec = ref<number>(0);

// 所有规格数据列表
const allSpecList = ref<ispecification[]>([]);

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
const addSepc = async(spec: ispecification) => {
    const res: result = await addSpecApi(spec);

    if (res.code === 1){
        ElMessage.success("添加成功");
    }else {
        ElMessage.error(res.msg);
    }
}

// 发送修改规格请求
const editSepc = async(spec: ispecification) => {
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

// 发送获得所有启用的规格请求
const getAllSepc = async() => {
    const res: result = await getAllSpecApi();

    if (res.code === 0){
        ElMessage.error(res.msg);
        return;
    }

    allSpecList.value = res.data;
}


export default function(){
    return {
        pageQuery,
        specList,
        totalSpec,
        allSpecList,
        pageQuerySepc,
        addSepc,
        editSepc,
        deleteSepc,
        getAllSepc
    }
}