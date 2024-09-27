<script lang="ts" setup>
import useOrder from '@/composables/useOrder';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { useCartItemsNumStore } from '@/stores/useCartItemsNumStore';

// 购物车数量显示状态管理
const cartItemsNumStore = useCartItemsNumStore();

// 使用组合函数获取订单数据
const { orders, getOrdersByStatus, cancelOrder, buyagain, countdowns, formatTime } = useOrder();

// 路由对象，用于跳转订单详情页
const router = useRouter();

// 查看订单详情
const viewOrderDetail = (orderId: number) => {
  router.push(`/orderDetail/${orderId}`);
};

// 取消订单
const onCancelOrder = async (orderId: number) => {
  const code = await cancelOrder(orderId);
  if (code === 1) {
    ElMessage.success("取消成功");
  }
  router.push('/orderManager');
  getOrdersByStatus(-1);
}

// 再来一单
const onBuyAgain = async (orderId: number) => {
  const cartIds: number[] = await buyagain(orderId);
  cartItemsNumStore.getCartItemsNum();

  router.push({
    path: '/cart',
    query: { selectedCartIds: JSON.stringify(cartIds) }
  });
}

</script>

<template>
  <!-- 订单列表：使用 grid 布局，确保每张卡片大小一致 -->
  <div class="order-grid">
    <el-card class="order-card" v-for="order in orders" :key="order.id" @click="viewOrderDetail(order.id)"
      shadow="hover">
      <div class="order-header">
        <h3 class="order-number">订单编号: {{ order.orderNumber }}</h3>
        <el-tag v-if="order.status === 1" type="warning">待支付</el-tag>
        <el-tag v-if="order.status === 2" type="success">已支付</el-tag>
        <el-tag v-if="order.status === 3" type="info">已发货</el-tag>
        <el-tag v-if="order.status === 4" type="primary">已完成</el-tag>
        <el-tag v-if="order.status === 5" type="danger">已取消</el-tag>
      </div>

      <div class="order-info">
        <p><strong>总金额:</strong> ￥{{ order.totalAmount.toFixed(2) }}</p>
        <p><strong>商品数量:</strong> {{ order.itemCount }} 件</p>
        <p><strong>下单时间:</strong> {{ order.createdAt }}</p>

        <!-- 倒计时显示 -->
        <div v-if="order.status === 1">
          <p><strong>剩余支付时间:</strong> <el-tag type="danger">{{ formatTime(countdowns[order.id]) }}</el-tag></p>
        </div>
      </div>

      <!-- 商品列表 -->
      <div class="order-items">
        <el-row :gutter="10">
          <el-col :span="8" v-for="item in order.orderItemVOList" :key="item.productName">
            <el-image :src="item.productImageUrl" class="product-image" fit="cover" />
          </el-col>
        </el-row>
      </div>

      <!-- 订单操作按钮 -->
      <div class="order-actions">
        <el-button v-if="order.status === 4" type="primary" size="small" @click="onBuyAgain(order.id)">再次购买</el-button>
        <el-button v-if="order.status === 1" type="primary" size="small">支付订单</el-button>
        <el-button v-if="order.status === 1" type="danger" size="small"
          @click="onCancelOrder(order.id)">取消订单</el-button>
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.order-history-page {
  min-height: 100vh;
  padding: 20px;
  background-color: #f5f5f5;
}

.filter-header {
  margin-bottom: 20px;
}

/* 使用 grid 布局让卡片大小保持一致，设置固定列数 */
.order-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
}

/* 卡片样式：设置固定高度和滚动效果 */
.order-card {
  height: 400px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.3s ease;
  overflow-y: auto;
}

.order-card:hover {
  transform: translateY(-5px);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-number {
  font-size: 16px;
  font-weight: bold;
}

.order-info {
  margin-bottom: 10px;
  font-size: 14px;
  color: #666;
}

.order-items {
  margin-bottom: 10px;
  flex-grow: 1;
}

.product-image {
  width: 100%;
  height: 80px;
  border-radius: 4px;
}

.order-actions {
  text-align: right;
}

/* 响应式调整：较小屏幕时每行显示2个卡片 */
@media (max-width: 1024px) {
  .order-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 响应式调整：在手机或较小的设备上每行显示1个卡片 */
@media (max-width: 768px) {
  .order-grid {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>
