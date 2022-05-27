<template>
  <Modal title="Upgrade" :width="400" centered :visible="true" :footer="null" @cancel="$emit('onClose')">
    <div class="mint-NFT-popup">
      <div class="mint-NFT-key">
        <div>
          <img :src="importIcon(`/images/${currentKeyItem.img}@2x.png`)" alt="" />
        </div>
        <div></div>
        <div>
          <!-- <img :src="importIcon(`/images/${canUpgradeHeighKeyItem.img}@2x.png`)" alt="" /> -->
          <img :src="importIcon(`/images/${upgradeObject.img}@2x.png`)" alt="" />
        </div>
      </div>
      <h3 style="font-weight: bold; padding: 0 10px; margin-top: 30px">
        Congratulations, you can upgrade from {{ currentKeyItem.key }} to {{ upgradeObject.key }}.
      </h3>
      <!-- <div class="mint-NFT-detail">
        Congratulations, you can upgrade from Bronze Key to Silver Key.
      </div> -->
      <!-- that can unlock unlock rewards up to
        {{ canUpgradeHeighKeyItem.minRequireAmount - currentKeyItem.minRequireAmount }} -->

      <div class="mint-NFT-Total">
        <div class="mint-NFT-Total-Top">
          <div>
            <!-- <span>Total Consume</span> -->
            <span>Spend</span>
          </div>
          <div>
            <span class="mint-NFT-Total-val" style="font-size: 24px">
              {{ upgradeObject.minRequireAmount - currentKeyItem.minRequireAmount }}
            </span>
            <span>Caffeine</span>
          </div>
        </div>
      </div>

      <div class="mint-NFT-btn-box">
        <!-- <Button class="mint-NFT-btn btn-cancel" @click="$emit('onClose')"> <div>Cancel</div> </Button>
        <Button class="mint-NFT-btn"> <div>Confirm</div> </Button> -->
        <Button class="mint-NFT-btn btn-cancel" @click="$emit('onClose')">Cancel</Button>
        <Button class="mint-NFT-btn" :loading="isUpgrading" @click="$emit('toUpgrade')">Confirm</Button>
      </div>
    </div>
  </Modal>
</template>
<script lang="ts">
import Vue from 'vue'
import { Modal } from 'ant-design-vue'
import importIcon from '@/utils/import-icon'
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
    },
    isUpgrading: {
      type: Boolean,
      default: false
    },
    currentKeyItem: {
      type: Object,
      default: () => {
        return {}
      }
    },
    canUpgradeHeighKeyItem: {
      type: Object,
      default: () => {
        return {}
      }
    },
    upgradeObject: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {
    importIcon
  }
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
    // background: rgba(#000, 0.2);
    border-radius: 10px;
  }
  .mint-NFT-Total {
    height: 60px;
    background: rgba(#000, 0.2);
    border-radius: 10px;
    margin-top: 20px;
    padding: 12px 20px;
    .mint-NFT-Total-Top {
      height: 36px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      > div:nth-child(1) {
        height: 36px;
        padding-top: 11px;
      }
    }
  }
  .mint-NFT-btn-box {
    height: 48px;
    margin-top: 40px;
    display: flex;
    justify-content: space-between;
    .mint-NFT-btn {
      height: 100% !important;
      // .farm-btn-small();
      .gradient-btn-large();
      height: 48px;
      font-size: 14px;
      font-weight: 100;
      width: 170px;
      > div {
        line-height: 48px;
      }
    }
    .btn-cancel {
      background: #282c33 !important;
      &:hover {
        background: #34383e !important;
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
