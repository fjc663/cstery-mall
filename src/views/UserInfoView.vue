<script lang="ts" setup>
const user = {
    name: "张三",
    email: "zhangsan@example.com",
    avatar: "https://via.placeholder.com/150",
    registrationDate: "2023-03-15",
};

const orders = [
    { id: "20230315001", date: "2024-09-10", total: 299.99, status: "已发货" },
    { id: "20230315002", date: "2024-08-22", total: 159.99, status: "已完成" },
    { id: "20230315003", date: "2024-07-11", total: 89.99, status: "待付款" },
];

const wishlist = [
    { id: 1, name: "时尚包包", price: 399, image: "https://via.placeholder.com/150" },
    { id: 2, name: "高端手表", price: 999, image: "https://via.placeholder.com/150" },
    { id: 3, name: "运动鞋", price: 299, image: "https://via.placeholder.com/150" },
];
</script>

<template>
    <div class="user-dashboard">
        <!-- 用户个人信息 -->
        <section class="user-info">
            <div class="container">
                <h2>个人信息</h2>
                <div class="profile">
                    <img class="avatar" :src="user.avatar" alt="User Avatar" />
                    <div class="details">
                        <h3>{{ user.name }}</h3>
                        <p>Email: {{ user.email }}</p>
                        <p>注册日期: {{ user.registrationDate }}</p>
                        <button class="edit-profile">编辑个人信息</button>
                    </div>
                </div>
            </div>
        </section>

        <!-- 订单历史 -->
        <section class="order-history">
            <div class="container">
                <h2>订单历史</h2>
                <table class="order-table">
                    <thead>
                        <tr>
                            <th>订单号</th>
                            <th>日期</th>
                            <th>总金额</th>
                            <th>状态</th>
                            <th>详情</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="order in orders" :key="order.id">
                            <td>{{ order.id }}</td>
                            <td>{{ order.date }}</td>
                            <td>￥{{ order.total }}</td>
                            <td>{{ order.status }}</td>
                            <td><button class="view-details">查看详情</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <!-- 收藏商品 -->
        <section class="wishlist">
            <div class="container">
                <h2>收藏的商品</h2>
                <div class="product-grid">
                    <div class="product-card" v-for="item in wishlist" :key="item.id">
                        <img :src="item.image" :alt="item.name" />
                        <h4>{{ item.name }}</h4>
                        <p>￥{{ item.price }}</p>
                        <button class="remove-wishlist">移除收藏</button>
                    </div>
                </div>
            </div>
        </section>

        <!-- 账号设置 -->
        <section class="account-settings">
            <div class="container">
                <h2>账号设置</h2>
                <button class="change-password">修改密码</button>
                <button class="logout">退出登录</button>
            </div>
        </section>
    </div>
</template>

<style scoped>
.user-dashboard {
    font-family: 'Arial', sans-serif;
    color: #333;
}

.container {
    width: 80%;
    margin: 0 auto;
    padding: 20px 0;
}

h2 {
    margin-bottom: 20px;
}

.profile {
    display: flex;
    align-items: center;
    margin-bottom: 40px;
}

.avatar {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    margin-right: 30px;
}

.details {
    display: flex;
    flex-direction: column;
}

.edit-profile {
    padding: 10px 15px;
    background-color: #ff6600;
    color: white;
    border: none;
    cursor: pointer;
    margin-top: 10px;
}

.order-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 40px;
}

.order-table th,
.order-table td {
    border: 1px solid #ddd;
    padding: 10px;
    text-align: center;
}

.order-table th {
    background-color: #f4f4f4;
}

.view-details,
.remove-wishlist,
.change-password,
.logout {
    padding: 8px 12px;
    background-color: #ff6600;
    color: white;
    border: none;
    cursor: pointer;
}

.product-grid {
    display: flex;
    gap: 20px;
}

.product-card {
    width: 150px;
    text-align: center;
    background-color: #f9f9f9;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.product-card img {
    width: 100%;
    height: auto;
}

.account-settings {
    margin-top: 40px;
}
</style>