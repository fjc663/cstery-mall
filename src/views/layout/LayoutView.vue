<script lang="ts" setup>
import FooterView from '@/views/layout/components/FooterView.vue'
import HeaderView from '@/views/layout/components/HeaderView.vue'

</script>

<template>
  <div class="ecommerce-homepage">
    <el-container>
      
      <HeaderView/>


      <el-main>
        <RouterView/>
      </el-main>

      <!-- 页脚 -->
      <el-footer class="footer">
        <FooterView/>
      </el-footer>

    </el-container>
  </div>
</template>

<style scoped>



/* 页脚 */
.footer {
  background-color: #222;
  color: white;
  padding: 40px 0;
}
</style>