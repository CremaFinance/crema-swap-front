<template>
  <div class="price-range-hint">
    <img src="@/assets/images/tanhao-error.svg" alt="" />
    The range you specified is invalid. The max price must be higher than the min price.
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({})
</script>
<style lang="less" scoped>
.price-range-hint {
  margin-top: 10px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 14px;
  font-family: ArialMT;
  color: #fa3131;
  display: flex;
  img {
    margin-right: 10px;
  }
}
</style>