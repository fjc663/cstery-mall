<template>
    <el-card class="address-manager">
        <el-table :data="addresses" stripe>
            <el-table-column prop="receiverName" label="收货人" />
            <el-table-column prop="receiverPhone" label="联系电话" />
            <el-table-column prop="address" label="收货地址" />
            <el-table-column label="操作" width="200">
                <template #default="scope">
                    <el-button @click="editAddress(scope.row)" type="primary" size="small">编辑</el-button>
                    <el-button @click="deleteAddress(scope.row)" type="danger" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="address-actions">
            <el-button type="primary" @click="addNewAddress">添加新地址</el-button>
        </div>
    </el-card>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

// 模拟数据
const addresses = ref([
    {
        id: 1,
        receiverName: '张三',
        receiverPhone: '13800000000',
        address: '北京市朝阳区XX路XX号',
    },
    {
        id: 2,
        receiverName: '李四',
        receiverPhone: '13900000000',
        address: '上海市浦东新区YY路YY号',
    },
]);

// 添加新地址
const addNewAddress = () => {
    console.log('跳转到添加新地址页面');
};

// 编辑地址
const editAddress = (address: any) => {
    console.log('编辑地址：', address);
};

// 删除地址
const deleteAddress = (address: any) => {
    console.log('删除地址：', address);
};
</script>

<style scoped>
.address-manager {
    padding: 20px;
}

.address-actions {
    margin-top: 20px;
    text-align: right;
}
</style>