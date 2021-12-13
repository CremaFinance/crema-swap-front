<template>
  <Modal title="" :width="400" centered :visible="true" :footer="null" @cancel="$emit('onClose')">
    <div class="waiting-container">
      <img src="@/assets/images/img-Swap-Submitted@2x.png" alt="" />
      <p class="waiting-title">Transaction Submitted</p>
      <p class="waiting-text">
        <a :href="`${url.explorer}/tx/${transaction.currentTransactionTxid}`" target="_blank">
          <span>View on Explorer</span>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-icon-Jump"></use>
          </svg>
        </a>
      </p>
      <div class="btn-content">
        <Button class="btn" @click="$emit('onClose')">OK</Button>
      </div>
    </div>
  </Modal>
</template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { Modal } from 'ant-design-vue'

Vue.use(Modal)

export default Vue.extend({
  components: {
    Modal
  },
  computed: {
    ...mapState(['transaction', 'url'])
  }
})
</script>
<style lang="less" scoped>
@import '../styles/base.less';
.waiting-container {
  text-align: center;
  img {
    width: 100px;
    height: 100px;
    margin-top: 59px;
    margin-bottom: 25px;
  }
  .waiting-title {
    font-size: 16px;
    color: #fff;
    margin: 10px 0 0;
  }
  .waiting-text {
    font-size: 16px;
    color: #07ebad;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 47px;
    a {
      display: flex;
      align-items: center;
    }
    .icon {
      fill: #07ebad;
      width: 20px;
      height: 20px;
    }
  }
  .btn-content {
    .gradient-btn-large();
    .btn {
      border: none;
      width: 100%;
      height: 100%;
      font-size: 20px;
      background: linear-gradient(268deg, #5fe6d0 0%, #597bff 38%, #9380ff 72%, #e590ff 100%);
      border-radius: 15px;
      line-height: 54px;
      &:hover {
        background: linear-gradient(270deg, #93ffed 0%, #84caff 34%, #a291ff 68%, #efb9ff 100%);
      }
    }
  }
}
</style>

