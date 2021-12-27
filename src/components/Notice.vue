<template>
  <Modal
    class="notice-modal"
    title="Notice"
    width="400px"
    :visible="true"
    centered
    :footer="null"
    @cancel="$emit('onClose')"
  >
    <div class="notice-container">
      <p>
        Please note that this product is on beta version, which is mainly for testing purpose. The swap and pools
        sections are not connected yet. The liquidity you add might not be able to generate fees for you at the moment.
        This beta will be updated soon to bring you more functionality.
      </p>
      <Button class="confirm-btn" @click="$emit('onClose')">Got it</Button>
    </div>
  </Modal>
</template>
<script lang="ts">
import Vue from 'vue'
import { Button, Modal } from 'ant-design-vue'

export default Vue.extend({
  components: {
    Button,
    Modal
  }
})
</script>

<style lang="less" scoped>
@import '../styles/base.less';
.notice-container {
  > p {
    font-size: 14px;
    color: #fff;
    padding-top: 20px;
  }
}
.confirm-btn {
  .gradient-btn-large();
  margin-top: 20px;
}
</style>
