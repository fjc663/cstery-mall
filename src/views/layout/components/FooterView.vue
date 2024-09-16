<template>
    <el-container class="footer-content">
        <!-- 公司信息 -->
        <el-row :gutter="20">
            <el-col :xs="24" :sm="12" :lg="6">
                <div class="footer-section">
                    <h3 class="footer-title">关于我们</h3>
                    <p class="footer-text">
                        我们是一家专注于高质量电商的公司，提供多样化的商品，致力于为顾客提供优质的购物体验。
                    </p>
                </div>
            </el-col>

            <!-- 帮助中心 -->
            <el-col :xs="24" :sm="12" :lg="6">
                <div class="footer-section">
                    <h3 class="footer-title">帮助中心</h3>
                    <ul class="footer-links">
                        <li><a href="#">常见问题</a></li>
                        <li><a href="#">订单跟踪</a></li>
                        <li><a href="#">退换货政策</a></li>
                        <li><a href="#">联系客服</a></li>
                    </ul>
                </div>
            </el-col>

            <!-- 友情链接 -->
            <el-col :xs="24" :sm="12" :lg="6">
                <div class="footer-section">
                    <h3 class="footer-title">友情链接</h3>
                    <ul class="footer-links">
                        <li><a href="#">合作伙伴1</a></li>
                        <li><a href="#">合作伙伴2</a></li>
                        <li><a href="#">合作伙伴3</a></li>
                        <li><a href="#">合作伙伴4</a></li>
                    </ul>
                </div>
            </el-col>

            <!-- 社交媒体 -->
            <el-col :xs="24" :sm="12" :lg="6">
                <div class="footer-section">
                    <h3 class="footer-title">关注我们</h3>
                    <div class="social-icons">
                        <a href="#"><i class="el-icon-s-platform"></i></a>
                        <a href="#"><i class="el-icon-s-opportunity"></i></a>
                        <a href="#"><i class="el-icon-s-goods"></i></a>
                        <a href="#"><i class="el-icon-s-cooperation"></i></a>
                    </div>
                </div>
            </el-col>
        </el-row>

        <!-- 底部版权信息 -->
        <div class="footer-bottom">
            <p>© 2024 ChengSteryMall. 保留所有权利。</p>
        </div>
    </el-container>

</template>

<style scoped>
.footer-content {
    max-width: 1200px;
    margin: 0 auto;
}

/* Footer每个部分的样式 */
.footer-section {
    margin-bottom: 20px;
}

.footer-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 15px;
    color: #f5f5f5;
}

.footer-text {
    font-size: 14px;
    color: #d3d3d3;
    line-height: 1.8;
}

.footer-links {
    list-style: none;
    padding: 0;
}

.footer-links li {
    margin-bottom: 10px;
}

.footer-links a {
    color: #d3d3d3;
    text-decoration: none;
}

.footer-links a:hover {
    color: #f56c6c;
}

.social-icons {
    display: flex;
    gap: 10px;
}

.social-icons a {
    font-size: 24px;
    color: #d3d3d3;
}

.social-icons a:hover {
    color: #f56c6c;
}

/* 底部版权信息 */
.footer-bottom {
    text-align: center;
    margin-top: 30px;
    font-size: 14px;
    color: #d3d3d3;
}
</style>