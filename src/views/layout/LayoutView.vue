<script lang="ts" setup>
import FooterView from '@/views/layout/components/FooterView.vue'
import HeaderView from '@/views/layout/components/HeaderView.vue'

</script>

<template>
  <div class="ecommerce-homepage">
    <el-container>

      <!-- 顶部导航栏 -->
      <el-header class="nav-container">
        <HeaderView />
      </el-header>

      <el-main>
        <RouterView />
      </el-main>

      <!-- 页脚 -->
      <el-footer class="footer">
        <FooterView />
      </el-footer>

    </el-container>
  </div>
</template>

<style scoped>
/* 导航容器整体样式 */
.nav-container {
  background-color: #1f2d3d;
  padding: 0 20px;
  color: #fff;
  height: 80px;
}

/* Footer整体布局和样式 */
.footer {
  background-color: #1f2d3d;
  color: #fff;
  padding: 40px 20px;
  height: auto;
}
</style>