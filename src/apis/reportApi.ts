import httpAdmin from "@/utils/httpAdmin";

// 获得总览数据
export function getReportApi(startData: string, endData: string): any {
    return httpAdmin({
        url: 'admin/chart',
        params: {startData: startData, endData: endData}
    })
}

// 获得图表数据
export function getChartApi(startData: string, endData: string): any {
    return httpAdmin({
        url: 'admin/chart/data',
        params: {startData: startData, endData: endData}
    })
}