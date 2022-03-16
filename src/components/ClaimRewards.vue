<template>
  <Modal title="Claim Rewards" :width="400" centered :visible="true" :footer="null" @cancel="$emit('onClose')">
    <div class="mint-NFT-popup">
      <div class="mint-NFT-key">
        <img src="../assets/images/img-Treasure-case-closed.png" />
      </div>
      <div class="mint-NFT-Total">
        <div class="Total-left">
            <img src="../assets/images/Brass_Key@2x.png" alt="">
        </div>
        <span>Open mystery box to get up to 10x bonus</span>
      </div>
      <div class="mint-NFT-btn-box">
        <Button class="mint-NFT-btn"> Open </Button>
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
    height: 270px;
    display: flex;
    justify-content: center;
    position: relative;
    > img{
      width: 270px;
      height: 270px;
    }
  }
  .mint-NFT-Total {
    background: rgba(#000, 0.2);
    border-radius: 10px;
    padding: 20px;
    display: flex;
    // justify-content: space-between;
    align-items: center;
    span {
      padding-left: 14px;
    }
  }
  .mint-NFT-Total .Total-left{
      width: 50px;
      height: 50px;
      background: url('@/assets/images/img-bgD.png');
      background-size: 100% 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      img{
          width: 36px;
          height: 36px;
      }
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
