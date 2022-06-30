<template>
  <Modal
    class="caffeine-unstake-tips-modal"
    title="Migrate to new pool"
    :z-index="999"
    centered
    width="400px"
    :visible="true"
    :footer="null"
    @cancel="closeTips"
  >
    <div class="unstake-tips-content">
      <div class="info-block">
        <div class="left">
          <img
            v-if="currentPool && currentPool.tokenA"
            :src="currentPool.tokenA.icon || importIcon(`/coins/${currentPool.tokenA.symbol.toLowerCase()}.png`)"
          />
          <img
            v-if="currentPool && currentPool.tokenB"
            :src="currentPool.tokenB.icon || importIcon(`/coins/${currentPool.tokenB.symbol.toLowerCase()}.png`)"
            class="last"
          />
          <span>{{ currentPool && currentPool.name }}</span>
        </div>
        <div class="right">
          NFT <span>{{ currentPosition && processNftAddress(currentPosition.nftMintAddress) }}</span>
        </div>
      </div>
      <div class="tips">
        Stake to the new pool, enjoy <span>{{ newPoolApr }}</span> APR
      </div>
      <div class="schedule-box">
        <div class="schedule-block" :class="unStakeSuccess ? 'disabled' : ''">
          <i>1</i>
          <span>Unstake from Caffeine Farm</span>
        </div>
        <img class="arrow-icon" src="../assets/images/icon-arrow@2x.png" />
        <div class="schedule-block" :class="!unStakeSuccess ? 'disabled' : ''">
          <i>2</i>
          <span>Stake to Earn More</span>
        </div>
      </div>

      <div class="btn-box">
        <Button
          v-if="!unStakeSuccess"
          class="unstake-btn"
          :loading="isUnStaking"
          :disabled="isUnStaking"
          @click="unstake"
          >Unstake</Button
        >
        <Button v-else class="unstake-btn" :loading="isNewStaking" :disabled="isNewStaking" @click="$emit('onNewStake')"
          >Stake</Button
        >
      </div>
    </div>
  </Modal>
</template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { Modal, Button } from 'ant-design-vue'
import importIcon from '@/utils/import-icon'

Vue.use(Modal)

export default Vue.extend({
  components: {
    Modal,
    Button
  },
  props: {
    currentPool: {
      type: Object,
      default: () => {
        return {}
      }
    },
    currentPosition: {
      type: Object,
      default: () => {
        return {}
      }
    },
    newPoolInfo: {
      type: Object,
      default: () => {
        return {}
      }
    },
    isUnStaking: {
      type: Boolean,
      default: false
    },
    unStakeSuccess: {
      type: Boolean,
      default: false
    },
    unStakeFailed: {
      type: Boolean,
      default: false
    },
    newStakeSuccess: {
      type: Boolean,
      default: false
    },
    newStakeFailed: {
      type: Boolean,
      default: false
    },
    isNewStaking: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState(['wallet', 'farmingv2']),
    newPoolApr() {
      if (this.farmingv2.aprAndTvlObj && this.newPoolInfo && this.newPoolInfo.mpKey) {
        return this.farmingv2.aprAndTvlObj[this.newPoolInfo.mpKey]?.apr + '%'
      }
      return 0
    }
  },
  watch: {
    newStakeSuccess(newVal) {
      if (newVal) {
        this.closeTips()
      }
    }
  },
  methods: {
    importIcon,
    closeTips() {
      this.$emit('onClose')
    },
    unstake() {
      // this.closeTips()
      this.$emit('onUnstake')
    },
    processNftAddress(address: string) {
      if (address) {
        const result = `${address.substr(0, 4)}...${address.substr(address.length - 4, 4)}`
        return result
      }
      return ''
    }
  }
})
</script>
<style lang="less" scoped>
@import '../styles/base.less';
.unstake-tips-content {
  .info-block {
    width: 100%;
    height: 72px;
    background: #282c34;
    border-radius: 10px;
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left {
      display: flex;
      align-items: center;
      img {
        width: 32px;
        height: 32px;
        border-radius: 100%;
        &.last {
          margin-left: -10px;
        }
      }
      span {
        font-size: 14px;
        color: #fff;
        margin-left: 4px;
      }
    }
    .right {
      font-size: 14px;
      color: #b5b8c2;
      span {
        font-size: 14px;
        color: #fff;
        margin-left: 8px;
      }
    }
  }
  .tips {
    margin-top: 30px;
    color: #fff;
    font-size: 16px;
    span {
      font-family: Arial-BoldMT, Arial;
      font-weight: normal;
      color: #c88aff;
      line-height: 20px;
      background: linear-gradient(90deg, #ae85ff 0%, #94ffe4 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
  .schedule-box {
    position: relative;
    margin-top: 18px;
    .schedule-block {
      width: 100%;
      height: 48px;
      background: rgba(#282c34, 0.5);
      border-radius: 10px;
      padding: 0px 20px;
      display: flex;
      align-items: center;
      &:last-child {
        margin-top: 28px;
      }
      &.disabled {
        i {
          background: none;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.5);
        }
        span {
          color: rgba(255, 255, 255, 0.5);
        }
      }
      i {
        display: flex;
        width: 24px;
        height: 24px;
        background: linear-gradient(270deg, #5fe6d0 0%, #6145ff 100%);
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 14px;
        font-style: normal;
        border-radius: 100%;
        line-height: 24px;
        vertical-align: middle;
      }
      span {
        margin-left: 12px;
        font-size: 14px;
        color: #fff;
      }
    }
    .arrow-icon {
      position: absolute;
      height: 36px;
      left: 26px;
      top: 44px;
    }
  }
}
.btn-box {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 28px;
  .unstake-btn {
    .gradient-btn-large();
    width: 100%;
    height: 40px;
    line-height: 1;
    font-size: 14px;
    font-weight: 100;
    border-radius: 8px;
  }
}
</style>
