<script lang="ts" setup>
import { ElButton } from 'element-plus';
import { useRouter } from 'vue-router';

const router = useRouter();

const goHome = () => {
  router.push('/');
};
</script>

<template>
  <el-container style="text-align: center; padding: 50px;">
    <h1>新品上架</h1>
    <p>该页面正在开发中，敬请期待！</p>
    <el-button type="primary" @click="goHome">返回首页</el-button>
  </el-container>
</template>

<style scoped>
h1 {
  font-size: 36px;
  margin-bottom: 20px;
}

p {
  font-size: 18px;
  color: #888;
  margin-bottom: 40px;
}
</style>
