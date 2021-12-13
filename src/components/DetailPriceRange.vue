<template>
  <div class="detail-price-range-container">
    <div class="top">
      <div class="left">
        <span class="title">Price range</span>
        <StatusBlock current-status="Active"></StatusBlock>
      </div>
      <div class="right">
        <div class="price">1 USDT ≈ 1.003 USDC</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({})
</script>
<style lang="less" scoped>
.detail-price-range-container {
  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>

