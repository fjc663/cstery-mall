<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import * as echarts from 'echarts';
import useReport from '@/composables/useReport';

// 主页报告逻辑代码
const { report, getReport, chartData, getChart } = useReport();

// 获取当前日期
const today = new Date();
// 计算七天前的日期
const sevenDaysAgo = new Date(today);
sevenDaysAgo.setDate(today.getDate() - 7);
// 将最近七天设为默认日期区间
const selectedDateRange = ref<[Date, Date]>([sevenDaysAgo, today]);

// 获得日期区间的字符串格式 (YYYY-MM-DD)
const formatDate = (date: Date): string => new Date(+date + 8 * 3600 * 1000).toISOString().split('T')[0];

const startTime = computed(() => formatDate(selectedDateRange.value[0]));
const endTime = computed(() => formatDate(selectedDateRange.value[1]));

// 图表初始化逻辑
onMounted(() => fetchData());

// 获取数据的函数，更新图表
const fetchData = async () => {
    await getReport(startTime.value, endTime.value);
    await getChart(startTime.value, endTime.value);

    // 更新销售趋势图表
    const salesChart = echarts.init(document.getElementById('salesChart') as HTMLElement);
    const salesChartOption = {
        title: { text: '', left: 'center' },
        tooltip: {
            trigger: 'axis', // 鼠标悬浮时显示数据
            formatter: (params: any) => {
                // params 是一个数组，包含了两个系列的值
                const date = params[0].name; // x轴的日期
                const sales = params[0].data; // 销售额
                const cumulativeSales = params[1].data; // 累计销售额
                return `${date}<br/>销售额: ${sales}<br/>累计销售额: ${cumulativeSales}`;
            }
        },
        legend: {
            data: ['销售额', '累计销售额'], // 图例中展示两条线
            top: '10px',
        },
        xAxis: {
            type: 'category',
            data: chartData.value.dataList, // 日期数据
        },
        yAxis: { type: 'value' },
        series: [
            {
                name: '销售额', // 第一条线
                data: chartData.value.saleList, // 每日销售额
                type: 'line',
                smooth: true,
                color: '#5470C6', // 设置线条颜色
            },
            {
                name: '累计销售额', // 第二条线
                data: chartData.value.cumulativeSaleList, // 累计销售额
                type: 'line',
                smooth: true,
                color: '#91CC75', // 设置累计线的颜色
            }
        ]
    };
    salesChart.setOption(salesChartOption);

    // 更新订单状态分布图表
    const orderStatusChart = echarts.init(document.getElementById('orderStatusChart') as HTMLElement);
    const orderStatusOption = {
        title: { text: '', left: 'center' },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)', // 显示百分比和数值
        },
        series: [
            {
                name: '订单状态',
                type: 'pie',
                radius: ['50%', '70%'],
                data: [
                    { value: chartData.value.statusList[0], name: '待支付' },
                    { value: chartData.value.statusList[1], name: '已支付' },
                    { value: chartData.value.statusList[2], name: '已发货' },
                    { value: chartData.value.statusList[3], name: '已完成' },
                    { value: chartData.value.statusList[4], name: '已取消' },
                ],
            },
        ],
    };
    orderStatusChart.setOption(orderStatusOption);

    // 更新用户增长趋势图表
    const userGrowthChart = echarts.init(document.getElementById('userGrowthChart') as HTMLElement);
    const userGrowthOption = {
        title: { text: '', left: 'center' },
        tooltip: {
            trigger: 'axis', // 鼠标悬浮时显示数据
            formatter: (params: any) => {
                const date = params[0].name; // x轴的日期
                const userGrowth = params[0].data; // 每日用户增长
                const cumulativeUser = params[1].data; // 累计用户
                return `${date}<br/>用户增长: ${userGrowth}<br/>累计用户: ${cumulativeUser}`;
            }
        },
        legend: {
            data: ['用户增长', '累计用户'], // 图例中展示两条线
            top: '10px',
        },
        xAxis: {
            type: 'category',
            data: chartData.value.dataList, // 日期数据
        },
        yAxis: { type: 'value' },
        series: [
            {
                name: '用户增长', // 第一条线
                data: chartData.value.userList, // 每日用户增长数据
                type: 'line',
                smooth: true,
                color: '#5470C6', // 设置颜色
            },
            {
                name: '累计用户', // 第二条线
                data: chartData.value.cumulativeUserList, // 累计用户数据
                type: 'line',
                smooth: true,
                color: '#91CC75', // 设置累计线的颜色
            }
        ]
    };

    userGrowthChart.setOption(userGrowthOption);

    // 更新 Top 10 热门商品图表
    const topProductChart = echarts.init(document.getElementById('topProductChart') as HTMLElement);
    const topProductOption = {
        title: { text: 'Top 10 热门商品', left: 'center' },
        tooltip: {
            trigger: 'axis',
            formatter: '{b0}: {c0}', // 鼠标悬浮时显示数值
        },
        xAxis: {
            type: 'category',
            data: chartData.value.productNameList,
            axisLabel: {
                rotate: 30,  // 将标签旋转30度，避免重叠
                interval: 0, // 强制显示所有标签
            },
        },
        yAxis: { type: 'value' },
        series: [
            {
                name: '销量',
                data: chartData.value.productList,
                type: 'bar',
                barWidth: '50%', // 设置柱状图宽度
            },
        ],
    };
    topProductChart.setOption(topProductOption);
};
</script>

<template>
    <div class="dashboard-page">
        <!-- 顶部欢迎栏 -->
        <div class="dashboard-header">
            <h1>欢迎，管理员</h1>
            <div class="dashboard-date">
                <el-date-picker v-model="selectedDateRange" type="daterange" range-separator="至"
                    start-placeholder="开始日期" end-placeholder="结束日期" @change="fetchData" />
            </div>
        </div>

        <!-- 关键指标卡片展示 -->
        <el-row :gutter="20" class="dashboard-stats">
            <el-col :span="6">
                <el-card>
                    <div class="stat-card">
                        <div class="stat-title">总销售额</div>
                        <div class="stat-value">{{ report.totalSale }}</div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card>
                    <div class="stat-card">
                        <div class="stat-title">订单总数</div>
                        <div class="stat-value">{{ report.totalOrder }}</div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card>
                    <div class="stat-card">
                        <div class="stat-title">用户数量</div>
                        <div class="stat-value">{{ report.totalUser }}</div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card>
                    <div class="stat-card">
                        <div class="stat-title">热门商品</div>
                        <div class="stat-value">{{ report.hotProduct || '暂无'  }}</div>
                    </div>
                </el-card>
            </el-col>
        </el-row>

        <!-- 数据可视化图表展示 -->
        <el-row :gutter="20" class="dashboard-charts">
            <!-- 销售趋势折线图 -->
            <el-col :span="12">
                <el-card>
                    <h3>销售趋势</h3>
                    <div id="salesChart" class="chart"></div>
                </el-card>
            </el-col>

            <!-- 订单状态分布环形图 -->
            <el-col :span="12">
                <el-card>
                    <h3>订单状态分布</h3>
                    <div id="orderStatusChart" class="chart"></div>
                </el-card>
            </el-col>
        </el-row>

        <!-- 新增用户数折线图和 Top 10 热门商品柱状图 -->
        <el-row :gutter="20" class="dashboard-charts">
            <!-- 用户数量折线图 -->
            <el-col :span="12">
                <el-card>
                    <h3>用户增长趋势</h3>
                    <div id="userGrowthChart" class="chart"></div>
                </el-card>
            </el-col>

            <!-- Top 10 热门商品柱状图 -->
            <el-col :span="12">
                <el-card>
                    <h3>Top 10 热门商品</h3>
                    <div id="topProductChart" class="chart"></div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<style scoped>
.dashboard-page {
    padding: 20px;
    background-color: #f5f7fa;
}

.dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.dashboard-date {
    font-size: 16px;
    color: #666;
}

.dashboard-stats {
    margin-bottom: 40px;
}

.stat-card {
    text-align: center;
}

.stat-title {
    font-size: 14px;
    color: #999;
}

.stat-value {
    font-size: 28px;
    font-weight: bold;
    margin-top: 10px;
}

.dashboard-charts {
    margin-top: 30px;
    display: flex;
    flex-wrap: wrap;
}

.chart {
    height: 300px;
    margin-top: 20px;
}
</style>
