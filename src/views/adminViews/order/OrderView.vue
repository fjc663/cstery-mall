<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import useOrder from '@/composables/useOrder';


const { pageQueryAdmin, totalOrderAdmin, adminOrders, pageQueryOrder, setOrderStatus } = useOrder();

// 分页信息
const page = ref<number>(1);
const pageSize = ref<number>(20);

// 状态筛选
const statusOptions = ref([
    { label: '全部订单', value: -1 },
    { label: '待付款', value: 1 },
    { label: '已付款', value: 2 },
    { label: '已发货', value: 3 },
    { label: '已完成', value: 4 },
    { label: '已取消', value: 5 }
]);

// 当前选择的状态
const selectedStatus = ref<number>(-1);

// 筛选订单
const filterOrders = () => {
    if (selectedStatus.value !== -1) {
        pageQueryAdmin.value.status = selectedStatus.value;
    } else {
        pageQueryAdmin.value.status = null;
    }
    pageQueryOrder();
};

// 发货操作
const shipOrder = (orderId: number) => {
    ElMessageBox.confirm('确认发货吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(async () => {
        // 修改订单为发货状态
        const code: number = await setOrderStatus(orderId, 3);
        if (code === 1) {
            ElMessage.success('发货成功！');
        }
        pageQueryOrder();
    }).catch(() => {
        ElMessage.info('已取消发货');
    });
};

// 每页大小改变时触发
const handleSizeChange = (pageSize: number) => {
    pageQueryAdmin.value.pageSize = pageSize;

    pageQueryOrder();
};

// 页码改变时触发
const handleCurrentChange = (page: number) => {
    pageQueryAdmin.value.page = page;

    pageQueryOrder();
};

// 初始化订单列表
onMounted(() => {
    pageQueryAdmin.value.page = page.value;
    pageQueryAdmin.value.pageSize = pageSize.value;

    pageQueryOrder();
});

</script>

<template>
    <el-card class="order-management" shadow="hover">
        <!-- 头部状态筛选 -->
        <div class="filter-section">
            <el-select v-model="selectedStatus" placeholder="选择订单状态" @change="filterOrders" class="filter-select">
                <el-option v-for="status in statusOptions" :key="status.value" :label="status.label"
                    :value="status.value" />
            </el-select>
        </div>

        <!-- 订单列表 -->
        <el-table :data="adminOrders" style="width: 100%" stripe
            :header-cell-style="{ 'text-align': 'center', 'background-color': '#f7f8fa', 'font-weight': 'bold' }"
            :cell-style="{ 'text-align': 'center' }">
            <el-table-column prop="orderNumber" label="订单编号" />
            <el-table-column prop="totalAmount" label="金额" />
            <el-table-column prop="status" label="订单状态">
                <template #default="scope">
                    <el-tag :type="scope.row.status === 1 ? 'warning' : scope.row.status === 2 ? 'success' : 'info'">
                        {{ scope.row.status === 1 ? '待付款' : scope.row.status === 2 ? '已付款' : scope.row.status === 3 ?
                            '已发货' : scope.row.status === 4 ? '已完成' : '已取消' }}
                    </el-tag>
                </template>
            </el-table-column>

            <el-table-column prop="createdAt" label="创建时间" />

            <el-table-column label="订单时间">
                <template #default="scope">
                    <!-- 动态时间标题 -->
                    <div v-if="scope.row.status === 2">
                        <strong>付款时间：</strong> {{ scope.row.paidAt }}
                    </div>
                    <div v-else-if="scope.row.status === 3">
                        <strong>发货时间：</strong> {{ scope.row.shippedAt }}
                    </div>
                    <div v-else-if="scope.row.status === 4">
                        <strong>完成时间：</strong> {{ scope.row.completedAt }}
                    </div>
                    <div v-else-if="scope.row.status === 5">
                        <strong>取消时间：</strong> {{ scope.row.canceledAt }}
                    </div>
                </template>
            </el-table-column>


            <!-- 操作 -->
            <el-table-column label="操作">
                <template #default="scope">
                    <el-button v-if="scope.row.status === 2" type="success" link
                        @click="shipOrder(scope.row.id)">发货</el-button>
                    <el-button v-if="scope.row.status === 3" type="warning" link disabled>等待完成</el-button>
                </template>
            </el-table-column>

            <!-- 展开订单详情 -->
            <el-table-column type="expand" label="订单商品" width="200">
                <template #default="scope">
                    <div style="margin: 20px 100px;">
                        <el-table :data="scope.row.orderItemVOList" style="width: 100%" border
                            :header-cell-style="{ 'text-align': 'center', 'background-color': '#f7f8fa', 'font-weight': 'bold' }"
                            :cell-style="{ 'text-align': 'center' }">
                            <el-table-column prop="productName" label="商品名称" />
                            <el-table-column prop="quantity" label="数量" />
                            <el-table-column prop="productPrice" label="单价" />

                            <el-table-column label="规格">
                                <template #default="item">
                                    <div class="specification-container">
                                        <!-- 解析并遍历规格 JSON -->
                                        <el-tag v-for="(value, key) in JSON.parse(item.row.specifications)" :key="key"
                                            size="small" effect="dark" class="specification-tag">
                                            {{ key }}: {{ value }}
                                        </el-tag>
                                    </div>
                                </template>
                            </el-table-column>

                            <el-table-column label="图片">
                                <template #default="item">
                                    <el-image :src="item.row.productImageUrl" fit="cover"
                                        style="width: 50px; height: 50px;" />
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="order-pagination-block">
            <el-pagination v-model:current-page="page" v-model:page-size="pageSize" :page-sizes="[20, 40, 60, 80, 100]"
                layout="total, sizes, prev, pager, next, jumper" :total="totalOrderAdmin"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
    </el-card>
</template>

<style scoped>
.order-management {
    padding: 20px;
}

.specification-container {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.specification-tag {
    margin-bottom: 5px;
}

.filter-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.filter-select {
    width: 200px;
}

/* 分页组件样式 */
.order-pagination-block {
    margin-top: 10px;
    display: flex;
    justify-content: end;
}
</style>
