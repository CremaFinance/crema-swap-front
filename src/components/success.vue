<template>
  <Modal title="" centered :visible="true" :footer="null" :dialog-style="{ top: '30%' }" @cancel="$emit('onClose')">
    <div class="waiting-container">
      <img src="@/assets/images/icon_Swap Submitted@2x.png" alt="" />
      <p class="waiting-title">Transaction Submitted</p>
      <!-- <p class="waiting-text">View on Explorer</p> -->
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
    width: 64px;
    height: 64px;
    margin-top: 59px;
    margin-bottom: 25px;
  }
  .waiting-title {
    font-size: 14px;
    color: #fff;
  }
  .waiting-text {
    font-size: 14px;
    color: #07ebad;
  }
}
</style>

