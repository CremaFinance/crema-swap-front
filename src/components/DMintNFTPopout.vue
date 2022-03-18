<template>
  <Modal title="Mint  NFT" :width="400" centered :visible="true" :footer="null" @cancel="$emit('onClose')">
    <div class="mint-NFT-popup">
      <div class="mint-NFT-key">
        <img src="../assets/images/img-bgD.png" />
        <div>
          <img src="../assets/images/Platinum_Key@2x.png" alt="" />
        </div>
      </div>
      <h3 style="font-weight: bold; padding: 0 20px; margin-top: 20px">
        Congratulations, you can mint a diamond key that can unlock rewards up to 3100.
      </h3>
      <div class="mint-NFT-Total">
        <div class="mint-NFT-Total-Top">
          <div>
            <span>Total Consume</span>
          </div>
          <div>
            <span class="mint-NFT-Total-val" style="font-size: 24px">27,000</span>
            <span>Caffeine</span>
          </div>
        </div>
        <p></p>
        <div class="mint-NFT-Total-Bot">
          <div>Fee</div>
          <!-- <div>Mint Fee</div> -->
          <div>
            <span class="mint-NFT-Total-val">1,000</span>
            <span>SOL</span>
          </div>
        </div>
      </div>
      <div class="mint-NFT-btn-box">
        <Button class="mint-NFT-btn"> Mint </Button>
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
  computed: {

  },
  watch: {},
  mounted() {},
  methods: {}
})
</script>
<style lang="less" scoped>
@import '../styles/base.less';
.mint-NFT-popup {
  padding-bottom: 60px;
  .mint-NFT-key {
    width: 100%;
    height: 210px;
    display: flex;
    justify-content: center;
    position: relative;
    > img{
      width: 210px;
      height: 210px;
    }
    > div {
      height: 160px;
      position: absolute;
      top: 25px;
      display: flex;
      justify-content: center;
      > img{
        width: 160px !important;
        height: 160px !important;
      }
    }
  }
  .mint-NFT-Total {
    height: 100px;
    background: rgba(#000, 0.2);
    border-radius: 10px;
    margin-top: 20px;
    padding: 12px 20px 20px;
    > div {
      display: flex;
      justify-content: space-between;
    }
    .mint-NFT-Total-Top {
      height: 36px;
      // border-bottom: 1px solid rgba(#fff, 0.2);
      align-items: center;
      > div:nth-child(1) {
        height: 36px;
        padding-top: 11px;
      }
    }
    .mint-NFT-Total-Bot {
      align-items: center;
      height: 36px;
    }
    > p{
      width:100%;
      height:1px;
      border-bottom: 1px solid rgba(#fff, 0.2);
      margin: 4px 0 0 0 !important;
    }
  }
  .mint-NFT-Total > div > div .mint-NFT-Total-val{
      margin-right: 8px;
  }
  .mint-NFT-btn-box {
    height: 48px;
    .mint-NFT-btn {
      .gradient-btn-large();
      margin-top: 40px;
      height: 100%;
      font-size: 16px;
    }
  }
}
</style>
