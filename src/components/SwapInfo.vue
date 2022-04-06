<template>
  <div class="swap-info">
    <div class="block">
      <span>Exchange Rate{{ countdown }}</span>

      <div class="right">
        <div v-if="fromCoin && toCoin && Number(fromCoinAmount) && Number(toCoinAmount) && defaultRates">
          <span v-if="Number(fromCoinAmount) && Number(toCoinAmount)">
            1 {{ fromCoin.symbol }} = {{ fixD(Number(toCoinAmount) / Number(fromCoinAmount), toCoin.decimals) }}
            {{ toCoin.symbol }}
          </span>
          <span v-else
            >1 {{ fromCoin.symbol }} = {{ fixD(Number(defaultRates), toCoin.decimals) }} {{ toCoin.symbol }}</span
          >
        </div>
        <div v-if="fromCoin && toCoin && (!Number(fromCoinAmount) || !Number(toCoinAmount))">
          <span>1 {{ fromCoin.symbol }} = {{ fixD(Number(defaultRates), toCoin.decimals) }} {{ toCoin.symbol }}</span>
        </div>
        <Progress
          type="circle"
          :width="14"
          :stroke-width="10"
          :percent="(100 / autoRefreshTime) * countdown"
          :show-info="false"
          :class="dataIsLoading ? 'disabled' : ''"
          @click="toRefreshData"
        />
      </div>
    </div>
    <template v-if="toCoinAmount && fromCoinAmount && Number(toCoinAmount) > 0">
      <div v-if="toCoinAmount && fromCoinAmount" class="block">
        <span>{{ fixedFromCoin ? 'Minimum Received' : 'Maximum Sold' }}</span>
        <div class="right">
          {{
            fixedFromCoin
              ? fixD(Number(toCoinAmount) / (1 + Number($accessor.slippage) / 100), toCoin.decimals)
              : fixD(fromCoinAmount * (1 + Number($accessor.slippage) / 100), toCoin.decimals)
          }}
        </div>
      </div>
      <!-- <div class="block">
        <span>Price Impact</span>
        <div class="right">&lt;0.01%</div>
      </div> -->
      <div class="block">
        <span>Fee</span>
        <div v-if="poolInfo" class="right">{{ poolInfo.feeView }}%</div>
      </div>
    </template>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { fixD, getUnixTs } from '@/utils/index'
import { Progress } from 'ant-design-vue'

export default Vue.extend({
  // eslint-disable-next-line vue/require-prop-types
  // props: ['poolInfo', 'fromCoin', 'toCoin', 'fromCoinAmount', 'toCoinAmount'],
  components: {
    Progress
  },
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
    },
    fixedFromCoin: {
      type: Boolean,
      default: true
    },
    dataIsLoading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      defaultRates: '',
      autoRefreshTime: 20,
      countdown: 0,
      refreshTimer: null
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
  mounted() {
    this.setRefreshTimer()
  },
  destroyed() {
    clearInterval(this.refreshTimer)
    this.refreshTimer = null
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
        // this.defaultRates = String(Math.pow(Number(poolInfo.currentPrice) / Math.pow(10, 12), 2))
        this.defaultRates = poolInfo.currentPriceView
      } else {
        // this.defaultRates = String(1 / Math.pow(Number(poolInfo.currentPrice) / Math.pow(10, 12), 2))
        this.defaultRates = poolInfo.currentPriceViewReverse
      }
    },
    toRefreshData() {
      this.countdown = 0
      this.$emit('refresh')
    },
    setRefreshTimer() {
      this.refreshTimer = setInterval(() => {
        if (!this.loading) {
          if (this.countdown < this.autoRefreshTime) {
            this.countdown += 1

            if (this.countdown === this.autoRefreshTime) {
              this.toRefreshData()
            }
          }
        }
      }, 1000)
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
      color: #b5b8c2;
    }
    .right {
      display: flex;
      align-items: center;
      color: #fff;
      .ant-progress {
        margin-left: 6px;
        margin-bottom: 3px;
      }
      svg {
        width: 20px;
        height: 20px;
      }
    }
  }
}
</style>
