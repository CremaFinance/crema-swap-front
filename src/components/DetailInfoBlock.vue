<template>
  <div :class="['detail-info-block', title !== 'Liquidity' ? 'unclaimed-fees' : '']">
    <div class="title">
      <h3>{{ title }}</h3>
      <button
        v-if="title !== 'Liquidity'"
        :disabled="isLoading || !wallet.connected || !(Number(currentData.tokenaFee) || Number(currentData.tokenbFee))"
        :loading="isLoading"
        @click="toClaim"
      >
        Claim
      </button>
    </div>
    <div class="rates">
      $
      {{ title !== 'Liquidity' ? processShowUSD(currentData.feeUSD) : processShowUSD(currentData.amountUSD) }}
    </div>
    <div :class="['info-box', !direction ? 'reverse' : '']">
      <div v-if="poolInfo" class="info-block">
        <div class="left">
          <img :src="importIcon(`/coins/${poolInfo.coin.symbol.toLowerCase()}.png`)" />
          <span>{{ poolInfo.coin.symbol }}</span>
          <a
            v-if="title === 'Liquidity'"
            :href="`${url.explorer}/address/${poolInfo.coin.mintAddress}`"
            target="_blank"
          >
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-icon-Jump"></use>
            </svg>
          </a>
        </div>
        <div class="right">
          <span class="num">{{ tokenaNum }}</span>
          <span v-if="title === 'Liquidity'" class="percent">{{ currentData.fromPercent }}%</span>
        </div>
      </div>
      <div v-if="poolInfo" class="info-block">
        <div class="left">
          <img :src="importIcon(`/coins/${poolInfo.pc.symbol.toLowerCase()}.png`)" />
          <span>{{ poolInfo.pc.symbol }}</span>
        </div>
        <div class="right">
          <span class="num">{{ tokenbNum }}</span>
          <span v-if="title === 'Liquidity'" class="percent">{{ currentData.toPercent }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import importIcon from '@/utils/import-icon'
// import { RATES } from '@/utils/tokens'
import { mapState } from 'vuex'
// import { preclaim, TickWord } from '@/tokenSwap/swapv3'
// import { loadAccount } from '@/tokenSwap/util/account'
// import { Account, Connection, PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js'
// import { SWAPV3_PROGRAMID, SWAP_PAYER, PAYER } from '@/utils/ids'
// import { TokenSwap, TokenSwapLayout, Numberu128, TickInfoLayout, Number128, TickInfo } from '@/tokenSwap'
import { decimalFormat } from '@/utils/index'
// import { Button } from 'ant-design-vue'
// import BigNumber from 'bignumber.js'

export default Vue.extend({
  props: {
    currentData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    poolInfo: {
      type: Object,
      default: () => {
        return null
      }
    },
    title: {
      type: String,
      default: ''
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    direction: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapState(['wallet', 'url']),
    tokenaNum() {
      if (this.currentData && this.poolInfo) {
        if (this.title !== 'Liquidity') {
          if (Number(this.currentData.tokenaFee) > 0.000001) {
            return decimalFormat(this.currentData.tokenaFee, this.poolInfo.coin.decimals)
          } else if (Number(this.currentData.tokenaFee) === 0) {
            return '0'
          } else {
            return '<0.00001'
          }
        } else {
          return decimalFormat(this.currentData.fromCoinAmount, this.poolInfo.coin.decimals)
        }
      }
      return '--'
    },
    tokenbNum() {
      if (this.currentData && this.poolInfo) {
        if (this.title !== 'Liquidity') {
          if (Number(this.currentData.tokenbFee) > 0.000001) {
            return decimalFormat(this.currentData.tokenbFee, this.poolInfo.pc.decimals)
          } else if (Number(this.currentData.tokenbFee) === 0) {
            return '0'
          } else {
            return '<0.0001'
          }
        } else {
          return decimalFormat(this.currentData.toCoinAmount, this.poolInfo.pc.decimals)
        }
      }
      return '--'
    }
  },
  watch: {
    currentData: {
      handler: 'currentDataWatch',
      immediate: true
    }
  },
  methods: {
    decimalFormat,
    importIcon,
    currentDataWatch(newVal: any) {
      console.log('DetailInfoBlock###currentDataWatch####', newVal)
    },
    toClaim() {
      this.$emit('claim')
    },
    getPercent(direct: any) {
      const fromCoinAmount = Number(this.currentData.fromCoinAmount)
      const toCoinAmount = Number(this.currentData.toCoinAmount)
      if (fromCoinAmount && toCoinAmount) {
        return '50%'
      }
      if (direct === 'from') {
        return fromCoinAmount ? '100%' : '0%'
      } else {
        return toCoinAmount ? '100%' : '0%'
      }
    },
    processShowUSD(value: string) {
      if (Number(value) < 0.0001 && Number(value) > 0) {
        return '<0.0001'
      } else {
        return value
      }
    }
  }
})
</script>

<style lang="less" scoped>
.detail-info-block {
  width: 460px;
  height: 188px;
  // background: linear-gradient(214deg, #3e434e 0%, #23262b 100%);
  background-image: url('../assets/images/pool-detail-info-back1.png');
  background-repeat: no-repeat;
  background-position: left top;
  background-size: 100% 100%;
  padding-left: 145px;
  padding-right: 10px;
  padding-top: 15px;
  padding-bottom: 10px;
  &.unclaimed-fees {
    background-image: url('../assets/images/pool-detail-info-back2.png');
    background-size: 100% 100%;
  }
  > .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    h3 {
      font-size: 14px;
      color: #fff;
    }
    button {
      width: 100px;
      height: 26px;
      background: linear-gradient(270deg, #5fe6d0 0%, #60b2f1 33%, #9380ff 68%, #e590ff 100%);
      border-radius: 7px;
      &:disabled {
        background: rgba(255, 255, 255, 0.1);
        cursor: not-allowed;
        &:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      }
      &:hover {
        background: linear-gradient(268deg, #74ffe8 0%, #7592ff 39%, #a08fff 74%, #e89aff 100%);
      }
    }
  }
  .rates {
    font-size: 20px;
    color: #fff;
  }
  .info-box {
    width: 304px;
    // height: 92px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    padding: 4px 10px;
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    &.reverse {
      flex-direction: column-reverse;
    }
    .info-block {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 6px 0px;
      // & + .info-block {
      //   margin-top: 12px;
      // }
      .left,
      .right {
        display: flex;
        align-items: center;
      }
      .left {
        img {
          width: 30px;
          height: 30px;
        }
        span {
          font-size: 14px;
          color: #fff;
          margin-left: 8px;
        }
        a {
          display: block;
          width: 20px;
          height: 20px;
        }
        svg {
          width: 20px;
          height: 20px;
          fill: rgba(255, 255, 255, 0.5);
          &:hover {
            fill: #07ebad;
          }
        }
      }
      .right {
        .percent {
          width: 60px;
          height: 28px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: 10px;
        }
      }
    }
  }
}
@media screen and (max-width: 750px) {
  .unclaimed-fees {
    background: none !important;
  }
  .detail-info-block {
    width: 100%;
    background: none;
    padding: 10px;

    .info-box {
      width: 100%;
    }
  }
}
</style>
