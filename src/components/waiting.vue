<template>
  <Modal
    title="Waiting for Confirmation"
    centered
    :visible="true"
    :footer="null"
    width="400px"
    @cancel="$emit('onClose')"
  >
    <div class="waiting-container">
      <!-- <div class="loading-pic">
        <img src="@/assets/images/loading.png" alt="" />
      </div> -->
      <div class="loading-pic">
        <img src="@/assets/images/animation_500_kwucizzh.gif" alt="" />
      </div>
      <!-- <p class="waiting-title"></p> -->
      <!-- <p class="waiting-title">Supplying 0.0240357 CSV and 26.4235 USDT</p> -->
      <p class="waiting-title">{{ transaction.currentTransactionDesc }}</p>
      <p class="waiting-text">Confirm this transaction in your wallet</p>
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
.waiting-container {
  text-align: center;
  .loading-pic {
    width: 130px;
    height: 130px;
    // background: url('@/assets/images/loading-bg.png');
    // background-size: 100% 100%;
    margin: 34px auto 45px;
    text-align: center;
    line-height: 130px;
  }
  img {
    width: 130px;
    height: 130px;
    // -webkit-animation: myrotate 3s linear infinite;
    // animation: myrotate 3s linear infinite;
  }
  @-webkit-keyframes myrotate {
    0% {
      -webkit-transform: rotate(0deg);
    }
    50% {
      -webkit-transform: rotate(180deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
    }
  }
  @keyframes myrotate {
    0% {
      -webkit-transform: rotate(0deg);
    }
    50% {
      -webkit-transform: rotate(180deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
    }
  }

  .waiting-title {
    font-size: 16px;
    font-weight: 800;
    color: #fff;
    text-align: center;
  }
  .waiting-text {
    margin-top: 12px;
    font-size: 14px;
    color: rgba(#fff, 0.75);
  }
}
</style>

