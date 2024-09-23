<script lang="ts" setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useOrder } from '@/composables/useOrder';
import { ElMessage } from 'element-plus';
import { useCartItemsNumStore } from '@/stores/useCartItemsNumStore';
import router from '@/router';

// 购物车数量显示状态管理
const cartItemsNumStore = useCartItemsNumStore();

// 使用组合函数获取订单详情数据
const route = useRoute();
const { orderDetail, getOrderDetail, cancelOrder, buyagain, countdowns, formatTime } = useOrder();

// 获取订单详情
onMounted(() => {
  const orderId: number = Number(route.params.orderId); // 从路由中获取订单ID
  getOrderDetail(orderId); // 调用获取订单详情的函数
});

// 路由函数用来实现操作
const contactSeller = () => {
  console.log("联系卖家");
};

const reorder = async () => {
  await buyagain(orderDetail.value.id);
  cartItemsNumStore.getCartItemsNum();
  router.push("/cart");
};

const onCancelOrder = async () => {
  const code = await cancelOrder(orderDetail.value.id);
  if (code === 1) {
    ElMessage.success("取消成功");
  }
  getOrderDetail(orderDetail.value.id);
};

const payOrder = () => {
  console.log("支付订单");
};
</script>

<template>
  <el-container class="order-detail-page">
    <!-- 标题 -->
    <el-header>
      <h1 class="order-detail-title">订单详情</h1>
    </el-header>

    <el-main>
      <!-- 订单基础信息 -->
      <el-card class="order-info">
        <h2 class="section-title">订单信息</h2>
        <el-row>
          <el-col :span="8">
            <p><strong>订单编号:</strong> {{ orderDetail.orderNumber }}</p>
            <p><strong>下单时间:</strong> {{ orderDetail.createdAt }}</p>
            <p v-if="orderDetail.status === 2"><strong>支付时间:</strong> {{ orderDetail.paidAt }}</p>
            <p v-if="orderDetail.status === 3"><strong>发货时间:</strong> {{ orderDetail.shippingAt }}</p>
            <p v-if="orderDetail.status === 4"><strong>完成时间:</strong> {{ orderDetail.completedAt }}</p>
            <p v-if="orderDetail.status === 5"><strong>取消时间:</strong> {{ orderDetail.canceledAt }}</p>
          </el-col>
          <el-col :span="8">
            <p><strong>订单状态:</strong>
              <el-tag v-if="orderDetail.status === 1" type="warning">待支付</el-tag>
              <el-tag v-if="orderDetail.status === 1" type="danger" style="margin: 10px;">{{
                formatTime(countdowns[orderDetail.id]) }}</el-tag> <!-- 倒计时显示 -->
              <el-tag v-if="orderDetail.status === 2" type="success">已支付</el-tag>
              <el-tag v-if="orderDetail.status === 3" type="info">已发货</el-tag>
              <el-tag v-if="orderDetail.status === 4" type="primary">已完成</el-tag>
              <el-tag v-if="orderDetail.status === 5" type="danger">已取消</el-tag>
            </p>
            <p><strong>支付方式:</strong> {{ orderDetail.paymentMethod === 1 ? '支付宝' : orderDetail.paymentMethod === 2 ?
              '微信' : '信用卡' }}</p>
          </el-col>
          <el-col :span="8">
            <p><strong>总金额:</strong> ￥{{ orderDetail.totalAmount.toFixed(2) }}</p>
            <p><strong>运费:</strong> ￥{{ orderDetail.shippingCost.toFixed(2) }}</p>
          </el-col>
        </el-row>
      </el-card>

      <!-- 收货信息 -->
      <el-card class="shipping-info">
        <h2 class="section-title">收货信息</h2>
        <el-row>
          <el-col :span="8">
            <p><strong>收货人:</strong> {{ orderDetail.shippingAddress.replace('\n', ' ').split(' ').slice(0, 1).join('')
              }}</p>
            <p><strong>联系电话:</strong> {{ orderDetail.shippingAddress.replace('\n', ' ').split(' ').slice(1, 2).join('')
              }}</p>
          </el-col>
          <el-col :span="16">
            <p><strong>收货地址:</strong> {{ orderDetail.shippingAddress.replace('\n', ' ').split(' ').slice(2).join('') }}
            </p>
          </el-col>
        </el-row>
      </el-card>

      <!-- 商品信息 -->
      <el-card class="product-info">
        <h2 class="section-title">商品信息</h2>
        <el-table :data="orderDetail.orderItemVOList" border stripe>
          <el-table-column label="商品图片" width="120">
            <template #default="scope">
              <el-image :src="scope.row.productImageUrl" class="product-image" fit="cover" />
            </template>
          </el-table-column>
          <el-table-column prop="productName" label="商品名称" />
          <el-table-column prop="specifications" label="规格">
            <template #default="scope">
              <div v-for="(value, key) in JSON.parse(scope.row.specifications)" :key="key">
                <strong>{{ key }}:</strong> {{ value }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="quantity" label="数量" />
          <el-table-column prop="productPrice" label="单价">
            <template #default="scope">￥{{ scope.row.productPrice.toFixed(2) }}</template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- 操作按钮 -->
      <div class="order-actions">
        <el-button v-if="orderDetail.status === 1" type="danger" @click="onCancelOrder">取消订单</el-button>
        <el-button v-if="orderDetail.status === 1" type="primary" @click="payOrder">支付订单</el-button>
        <el-button v-if="orderDetail.status === 4" type="primary" @click="reorder">再次购买</el-button>
        <el-button type="info" @click="contactSeller">联系卖家</el-button>
      </div>
    </el-main>
  </el-container>
</template>

<style scoped>
.order-detail-page {
  padding: 20px;
}

.order-detail-title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
}

.section-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}

.order-info,
.shipping-info,
.product-info {
  margin-bottom: 30px;
}

.product-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
}

.order-actions {
  display: flex;
  justify-content: flex-end;
  gap: 20px;
  margin-top: 30px;
}
</style>
