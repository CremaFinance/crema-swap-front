<template>
  <div class="swap-info">
    <div class="block">
      <span>Exchange Rate</span>
      <div v-if="fromCoin && toCoin" class="right">
        <span v-if="fromCoinAmount && toCoinAmount">
          1 {{ fromCoin.symbol }} = {{ fixD(Number(toCoinAmount) / Number(fromCoinAmount), toCoin.decimals) }}
          {{ toCoin.symbol }}
        </span>
        <span v-else
          >1 {{ fromCoin.symbol }} = {{ fixD(Number(defaultRates), toCoin.decimals) }} {{ toCoin.symbol }}</span
        >
      </div>
    </div>
    <div class="block">
      <span>Price Impact</span>
      <div class="right">&lt;0.01%</div>
    </div>
    <div class="block">
      <span>Fee</span>
      <div class="right">{{ poolInfo.fee }}%</div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { fixD, getUnixTs } from '../utils/index'
export default Vue.extend({
  // eslint-disable-next-line vue/require-prop-types
  // props: ['poolInfo', 'fromCoin', 'toCoin', 'fromCoinAmount', 'toCoinAmount'],
  props: {
    poolInfo: {
      type: Object,
      default: () => {
        return {}
      }
    },
    fromCoin: {
      type: Object,
      default: () => {
        return {}
      }
    },
    toCoin: {
      type: Object,
      default: () => {
        return {}
      }
    },
    fromCoinAmount: {
      type: String,
      default: ''
    },
    toCoinAmount: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      defaultRates: ''
    }
  },
  // computed: {
  //   price() {
  //     if (this.fromCoinAmount && this.toCoinAmount) {
  //       return 0
  //     } else {
  //       if (this.poolInfo && this.poolInfo.currentPrice) {
  //         return this.getDefaultExchangeRate()
  //       }
  //     }
  //     return 0
  //   }
  // },
  watch: {
    poolInfo: {
      handler: 'poolInfoWatch',
      immediate: true
    },
    fromCoin() {
      if (this.poolInfo && this.poolInfo.coin && this.fromCoin && this.toCoin) {
        this.setDefaultExchangeRate(this.poolInfo)
      }
    }
  },
  methods: {
    fixD,
    poolInfoWatch(poolInfo: any) {
      if (poolInfo && poolInfo.coin && this.fromCoin && this.toCoin) {
        this.setDefaultExchangeRate(poolInfo)
      }
    },
    setDefaultExchangeRate(poolInfo: any) {
      if (this.fromCoin?.symbol === poolInfo.coin.symbol && this.toCoin?.symbol === poolInfo.pc.symbol) {
        this.defaultRates = String(Math.pow(Number(poolInfo.currentPrice) / Math.pow(10, 12), 2))
      } else {
        this.defaultRates = String(1 / Math.pow(Number(poolInfo.currentPrice) / Math.pow(10, 12), 2))
      }
    }
  }
})
</script>
<style lang="less" scoped>
.swap-info {
  > .block {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 20px;
    font-size: 14px;
    > span {
      color: rgba(255, 255, 255, 0.8);
    }
    .right {
      display: flex;
      align-items: center;
      color: #fff;
      svg {
        width: 20px;
        height: 20px;
      }
    }
  }
}
</style>
