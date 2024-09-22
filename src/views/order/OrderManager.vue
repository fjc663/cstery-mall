<script lang="ts" setup>
import OrderHeaderView from './components/OrderHeaderView.vue';

</script>

<template>
  <el-container class="order-history-page">
    <el-header class="filter-header">
      <order-header-view/>
    </el-header>

    <el-main>
      <router-view/>
    </el-main>

  </el-container>
</template>

<style lang="scss" scoped>

</style>
