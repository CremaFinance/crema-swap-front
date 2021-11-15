<template>
  <Modal title="" centered :visible="true" :footer="null" :dialog-style="{ top: '30%' }" @cancel="$emit('onClose')">
    <div class="waiting-container">
      <img src="@/assets/images/loading.png" alt="" />
      <p class="waiting-title">Waiting For Confirmation</p>
      <p class="waiting-title">Supplying 0.0240357 CSV and 26.4235 USDT</p>
      <p class="waiting-text">Confirm this transaction in your wallet</p>
    </div>
  </Modal>
</template>
<script lang="ts">
import Vue from 'vue'
import { Modal } from 'ant-design-vue'

Vue.use(Modal)

export default Vue.extend({
  components: {
    Modal
  }
})
</script>
<style lang="less" scoped>
.waiting-container {
  text-align: center;
  img {
    width: 56px;
    height: 56px;
    margin-top: 60px;
    margin-bottom: 47px;
  }
  .waiting-title {
    font-size: 14px;
    color: #fff;
    margin-bottom: 20px;
  }
  .waiting-text {
    font-size: 14px;
    color: rgba(#fff, 0.75);
  }
}
</style>

