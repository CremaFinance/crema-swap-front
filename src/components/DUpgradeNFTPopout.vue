<template>
  <Modal title="Upgrade" :width="400" centered :visible="true" :footer="null" @cancel="$emit('onClose')">
    <div class="mint-NFT-popup">
      <div class="mint-NFT-key">
        <div>
          <img src="@/assets/images/Brass_Key@2x.png" alt="" />
        </div>
        <div></div>
        <div>
          <img src="@/assets/images/Silver_Key@2x.png" alt="" />
        </div>
      </div>
      <div class="mint-NFT-detail">
        Congratulations, you can upgrade from Bronze Key to Silver Key that can unlock unlock rewards up to 700。
      </div>

      <div class="mint-NFT-btn-box">
        <Button class="mint-NFT-btn btn-cancel" @click="$emit('onClose')"> <div>Cancel</div> </Button>
        <Button class="mint-NFT-btn"> <div>Confirm</div> </Button>
      </div>
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
  },
  props: {
    existingCoins: {
      type: String,
      default: ''
    },
    lastSelectCoin: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {}
})
</script>
<style lang="less" scoped>
@import '../styles/base.less';
.mint-NFT-popup {
  padding-bottom: 20px;
  .mint-NFT-key {
    height: 120px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    margin-top: 20px;
    img {
      width: 80px;
      height: 80px;
    }
    > div:nth-child(1),
    > div:nth-child(3) {
      width: 120px;
      height: 120px;
      background: url('@/assets/images/img-bgD.png');
      background-size: 100% 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    > div:nth-child(2) {
      width: 60px;
      height: 60px;
      background: url('@/assets/images/icon-arrow.png');
      background-size: 100% 100%;
    }
  }
  .mint-NFT-detail {
    font-weight: bold;
    height: 100px;
    padding: 20px;
    margin-top: 20px;
    background: rgba(#000, 0.2);
    border-radius: 10px;
  }
  .mint-NFT-btn-box {
    height: 48px;
    margin-top: 40px;
    display: flex;
    justify-content: space-between;
    .mint-NFT-btn {
      height: 100% !important;
      .farm-btn-small();
      width: 170px;
      > div {
        line-height: 48px;
      }
    }
    .btn-cancel {
      background: rgba(#fff, 0.1) !important;
      > div {
        background: rgba(#000, 0.5);
        height: 46px;
        &:hover {
          background: rgba(#000, 0.2);
        }
      }
    }
  }
}
@media screen and (max-width: 750px) {
  .mint-NFT-popup .mint-NFT-btn-box .mint-NFT-btn {
    width: 140px;
  }
  .mint-NFT-popup .mint-NFT-key > div:nth-child(1),
  .mint-NFT-popup .mint-NFT-key > div:nth-child(3) {
    width: 100px !important;
    height: 100px !important;
  }
  .mint-NFT-popup .mint-NFT-key img {
    width: 50px;
    height: 50px;
  }
}
</style>
