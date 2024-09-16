<script lang="ts" setup>
const slides = [
    { title: "时尚新品", description: "潮流不止，抢先体验最新时尚单品", image: "https://via.placeholder.com/1920x800" },
    { title: "折扣优惠", description: "全场五折，活动仅限今日", image: "https://via.placeholder.com/1920x800" },
];

const products = [
    { id: 1, name: "奢华手表", price: 1599, image: "https://via.placeholder.com/300" },
    { id: 2, name: "高端皮鞋", price: 1299, image: "https://via.placeholder.com/300" },
    { id: 3, name: "经典包包", price: 1999, image: "https://via.placeholder.com/300" },
    { id: 4, name: "时尚太阳镜", price: 699, image: "https://via.placeholder.com/300" },
];

const promotions = [
    { id: 1, title: "限量折扣", description: "只限今日，精选商品享受超值优惠", image: "https://via.placeholder.com/500" },
    { id: 2, title: "全场半价", description: "抢购不止，全场商品低至五折", image: "https://via.placeholder.com/500" },
];

const testimonials = [
    { id: 1, content: "这家店的商品质量非常好，客服服务也很贴心。", author: "李女士" },
    { id: 2, content: "购物体验非常棒，商品包装精美，值得推荐！", author: "张先生" },
];

const news = [
    { id: 1, title: "新品发布", description: "我们推出了全新的时尚系列，快来抢购吧！", image: "https://via.placeholder.com/300" },
    { id: 2, title: "黑色星期五", description: "一年一度的黑五大促即将开启，准备好疯狂购物吧！", image: "https://via.placeholder.com/300" },
];

</script>

<template>
    <!-- 全屏轮播图 -->
    <section class="hero-slider">
        <div class="slider">
            <div class="slide" v-for="(slide, index) in slides" :key="index">
                <img :src="slide.image" :alt="slide.title" />
                <div class="slide-text">
                    <h2>{{ slide.title }}</h2>
                    <p>{{ slide.description }}</p>
                    <button class="shop-now">立即购买</button>
                </div>
            </div>
        </div>
    </section>

    <!-- 精选商品展示 -->
    <section class="products">
        <div class="container">
            <h2>热门商品</h2>
            <div class="product-grid">
                <div class="product-card" v-for="product in products" :key="product.id">
                    <img :src="product.image" :alt="product.name" />
                    <div class="product-info">
                        <h3>{{ product.name }}</h3>
                        <p class="price">￥{{ product.price }}</p>
                        <button class="add-to-cart">加入购物车</button>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- 优惠活动区 -->
    <section class="promotions">
        <div class="container">
            <h2>限时优惠</h2>
            <div class="promotion-grid">
                <div class="promotion-card" v-for="promotion in promotions" :key="promotion.id">
                    <img :src="promotion.image" :alt="promotion.title" />
                    <div class="promotion-info">
                        <h3>{{ promotion.title }}</h3>
                        <p>{{ promotion.description }}</p>
                        <button class="shop-now">了解更多</button>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- 用户评价 -->
    <section class="testimonials">
        <div class="container">
            <h2>用户评价</h2>
            <div class="testimonial-slider">
                <div class="testimonial" v-for="testimonial in testimonials" :key="testimonial.id">
                    <p>{{ testimonial.content }}</p>
                    <h4>{{ testimonial.author }}</h4>
                </div>
            </div>
        </div>
    </section>

    <!-- 最新新闻区 -->
    <section class="news">
        <div class="container">
            <h2>最新动态</h2>
            <div class="news-grid">
                <div class="news-card" v-for="newsItem in news" :key="newsItem.id">
                    <img :src="newsItem.image" :alt="newsItem.title" />
                    <h3>{{ newsItem.title }}</h3>
                    <p>{{ newsItem.description }}</p>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.hero-slider {
    position: relative;
    overflow: hidden;
}

.slider {
    display: flex;
    animation: slide 10s infinite;
}

.slide {
    min-width: 100%;
    position: relative;
}

.slide img {
    width: 100%;
}

.slide-text {
    position: absolute;
    bottom: 50px;
    left: 50px;
    color: white;
}

.shop-now {
    background-color: #ff6600;
    color: white;
    padding: 10px 20px;
    border: none;
    cursor: pointer;
}

@keyframes slide {
    0% {
        transform: translateX(0);
    }

    50% {
        transform: translateX(-100%);
    }

    100% {
        transform: translateX(-200%);
    }
}

/* 产品展示 */
.products {
    padding: 50px 0;
}

.product-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
}

.product-card {
    background-color: #f9f9f9;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
}

.product-info {
    margin-top: 20px;
}

.add-to-cart {
    background-color: #ff6600;
    color: white;
    padding: 10px;
    border: none;
    cursor: pointer;
}

/* 优惠区样式 */
.promotions {
    background-color: #f0f0f0;
    padding: 50px 0;
}

.promotion-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
}

.promotion-card {
    text-align: center;
}

/* 用户评价 */
.testimonials {
    padding: 50px 0;
    background-color: #fff5e6;
    text-align: center;
}

/* 新闻区 */
.news {
    padding: 50px 0;
}

.news-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 30px;
}
</style>