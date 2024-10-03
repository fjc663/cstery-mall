import { getChartApi, getReportApi } from "@/apis/reportApi";
import type { ichart, ireport } from "./interfaceType/adminInterface";
import { ref } from "vue";
import type { result } from "./interfaceType/commonInterface";
import { ElMessage } from "element-plus";


// 总览数据
const report = ref<ireport>({
    totalSale: 0,
    totalOrder: 0,
    totalUser: 0,
    hotProduct: ''
})

// 图表数据
const chartData = ref<ichart>({
    saleList: [],
    statusList: [],
    userList: [],
    productNameList: [],
    productList: [],
    dataList: [],
    cumulativeSaleList: [],
    cumulativeUserList: []
})


// 获得总览数据
const getReport = async (startData: string, endData: string) => {
    const res: result = await getReportApi(startData, endData);

    if (res.code === 0){
        ElMessage.error(res.msg);
        return;
    }

    report.value = res.data;
}

// 请求图表数据
const getChart = async (startData: string, endData: string) => {
    const res: result = await getChartApi(startData, endData);

    if (res.code === 0){
        ElMessage.error(res.msg);
        return;
    }

    chartData.value = res.data;
}


export default function() {
    return {
        report,
        getReport,
        chartData,
        getChart
    }
}