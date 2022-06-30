<template>
  <div class="set-price-item">
    <h3 class="title">{{ pType }} Price</h3>
    <div class="input-box">
      <a class="plus-btn" :disabled="!fromCoin && !toCoin" @click="minusPrice">
        <span>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-icon-Reduction"></use>
          </svg>
        </span>
      </a>
      <input id="pValu" v-model="pValue" autocomplete="off" @blur="onBlur" />
      <a class="minus-btn" :disabled="!fromCoin && !toCoin" @click="addPrice">
        <span>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-a-icon-AddCustomMarket"></use>
          </svg>
        </span>
      </a>
    </div>
    <p class="per-text" :class="!toCoin && !fromCoin ? 'per-text-disabled' : ''">
      {{ toCoin && toCoin.symbol }} per {{ fromCoin && fromCoin.symbol }}
    </p>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { getNearestTickByPrice, tick2Price } from 'test-crema-sdk'
import { decimalFormat } from '@/utils'
import Decimal from 'decimal.js'

export default Vue.extend({
  props: {
    value: {
      type: String,
      required: true
    },
    pType: {
      type: String,
      default: 'Max'
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
    dirction: {
      type: Boolean,
      default: true
    },
    defaultMaxPrice: {
      type: String,
      default: ''
    },
    tickSpace: {
      type: Number,
      default: 10
    }
  },
  data() {
    return {
      pValue: '',
      oValue: 0,
      blockStyle: {} as any
    }
  },
  watch: {
    value(newVal: string, oldVal: string) {
      console.log('&&&&&&SetPriceItem###value####', newVal)
      const arr = newVal.split('.')
      if (arr && arr[1] && arr[1].length > 6) {
        this.pValue = String(decimalFormat(newVal, 6))
        this.oValue = Number(newVal)
      } else {
        this.pValue = newVal
        this.oValue = Number(newVal)
      }
    },
    dirction(newVal: boolean) {
      this.oValue = Number(this.value)
    },
    pValue(newVal: string, oldVal: string) {
      if (oldVal === '∞' && newVal !== oldVal && newVal.includes('∞')) {
        this.pValue = '∞'
      }
    }
  },
  mounted() {
    this.pValue = this.value
    if (this.value !== '∞') this.oValue = Number(this.value)
  },
  methods: {
    addPrice() {
      console.log('this.oValue###', this.oValue)
      if (Number.isNaN(this.oValue) || !this.oValue) {
        return
      }

      console.log('this.tickSpace###', this.tickSpace)
      const tick = getNearestTickByPrice(new Decimal(this.oValue), this.tickSpace)
      console.log('addPrice####tick####', tick)
      const price = tick2Price(tick + this.tickSpace)
      console.log('addPrice####price####', price)
      this.oValue = price
      const value = String(decimalFormat(String(price), 6))
      this.pValue = value
      this.$emit('input', value)
    },
    minusPrice() {
      console.log('this.oValue###', this.oValue)
      if (Number.isNaN(this.oValue) || !this.oValue) {
        return
      }
      const tick = getNearestTickByPrice(new Decimal(this.oValue), this.tickSpace)
      console.log('minusPrice####tick####', tick)
      const price = tick2Price(tick - this.tickSpace)
      console.log('minusPrice####price####', price)
      this.oValue = price
      const value = String(decimalFormat(String(price), 6))
      this.pValue = value
      this.$emit('input', value)
    },
    onBlur() {
      if (this.pValue !== '∞' && this.pValue !== '0') {
        console.log('onBlur###this.pValue####', this.pValue)
        console.log('this.tickSpace######', this.tickSpace)
        const tick = getNearestTickByPrice(new Decimal(this.pValue), this.tickSpace)
        console.log('onBlur###tick####', tick)
        const price = tick2Price(tick)
        console.log('onBlur###price####', price.toString())
        this.oValue = price // 存储没有处理精度的数据，以避免增加消耗精度导致增减每次数据展示不一致
        const value = String(decimalFormat(String(price), 6))
        this.pValue = value
        this.$emit('input', value)
      } else {
        if (this.pValue === '∞') {
          this.pValue = this.defaultMaxPrice
        }
        this.$emit('input', this.pValue)
      }
    }
  }
})
</script>

<style lang="less" scoped>
.set-price-item {
  width: 50%;
  height: 84px;
  // border-radius: 10px;
  // background: linear-gradient(270deg, #3e434e 0%, #2f333b 100%);
  // box-shadow: 0px 4px 12px 0px rgba(26, 28, 31, 0.5);
  // border: 1px solid #3f434e;
  text-align: center;
  color: #b5b8c2;
  padding: 10px;
  .title {
    font-size: 12px;
    margin-bottom: 0px;
    color: rgba(255, 255, 255, 0.5);
  }
  .input-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    a {
      display: block;
      width: 30px;
      height: 30px;
      background: linear-gradient(137deg, rgba(35, 38, 43, 1), rgba(62, 67, 78, 1));
      padding: 1px;
      border-radius: 15px;
      cursor: pointer;
      &[disabled] {
        background: rgba(255, 255, 255, 0.1);
        svg {
          fill: rgba(255, 255, 255, 0.1);
        }
      }
      span {
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(141deg, #383e49 0%, #1a1c1f 100%);
        // box-shadow: 2px 4px 12px 0px #23262b, -3px -2px 10px 0px rgba(138, 147, 160, 0.16);
        border-radius: 14px;
        &:hover {
          background: linear-gradient(141deg, #424953 0%, #2a2e33 100%);
        }
        svg {
          width: 24px;
          height: 24px;
          fill: #fff;
        }
      }
    }
    input {
      width: 139px;
      font-size: 14px;
      color: #fff;
      text-align: center;
      border: none;
      background: none;
      padding: 0px 10px;
      font-weight: bold;
    }
  }
  .per-text {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.5);
  }
  .per-text-disabled {
    color: #b5b8c2;
  }
}
@media screen and (max-width: 750px) {
  .set-price-item {
    width: 48%;
    .input-box input {
      width: 100%;
    }
  }
}
</style>
