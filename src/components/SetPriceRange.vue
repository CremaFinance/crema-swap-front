<template>
  <div class="set-price-range">
    <h3>Set Price Range</h3>
    <div class="set-form-box">
      <div class="min-price">
        <p>Min Price</p>
        <div>
          <svg class="icon" aria-hidden="true" @click="minusMinPrice">
            <use xlink:href="#icon-icon-Reduction"></use>
          </svg>
          <input
            v-model="minPrice"
            type="number"
            :class="isFullRange ? 'focus-input' : ''"
            :placeholder="minPrice"
            autocomplete="off"
            autocorrect="off"
            pattern="^[0-9]*[.,∞]?[0-9]*$"
            minlength="1"
            maxlength="79"
            spellcheck="false"
            @blur="onChangeMin($event.target.value)"
          />
          <svg class="icon" aria-hidden="true" @click="addMinPrice">
            <use xlink:href="#icon-a-icon-AddCustomMarket"></use>
          </svg>
        </div>
        <p>{{ toCoin && toCoin.symbol }} per {{ fromCoin && fromCoin.symbol }}</p>
      </div>
      <div class="max-price">
        <p>Max Price</p>
        <div>
          <svg class="icon" aria-hidden="true" @click="minusMaxPrice">
            <use xlink:href="#icon-icon-Reduction"></use>
          </svg>
          <input
            v-model="maxPrice"
            type="number"
            :class="isFullRange ? 'focus-input' : ''"
            :placeholder="maxPrice"
            autocomplete="off"
            autocorrect="off"
            pattern="^[0-9]*[.,∞]?[0-9]*$"
            minlength="1"
            maxlength="79"
            spellcheck="false"
            @blur="onChangeMax($event.target.value)"
          />
          <svg class="icon" aria-hidden="true" @click="addMaxPrice">
            <use xlink:href="#icon-a-icon-AddCustomMarket"></use>
          </svg>
        </div>
        <p>{{ toCoin && toCoin.symbol }} per {{ fromCoin && fromCoin.symbol }}</p>
      </div>
    </div>
    <div v-if="isShowFullRangeHint" class="full-range-hint">
      <div class="full-range-hint-title">
        <img src="@/assets/images/tanhao.svg" alt="" />
        Lower Efficiency
      </div>
      <div class="full-range-hint-text">
        Please note that full range positions may earn less fees than concentrated liquidity.
      </div>
      <div class="full-range-hint-btn-box">
        <Button class="full-range-hint-btn" @click="isShowFullRangeHint = !isShowFullRangeHint">I understand</Button>
      </div>
    </div>
    <button class="full-range" @click="fullRange">Full Range</button>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { fixD } from '@/utils'
import { Button } from 'ant-design-vue'
import { eventBus } from '@/utils/eventBus'
import { price2tick, tick2price } from '@/tokenSwap/swapv3'
Vue.use(Button)
export default Vue.extend({
  components: {
    Button
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['fromCoin', 'toCoin', 'currentPrice', 'direction'],
  data() {
    return {
      minPrice: '0',
      maxPrice: '∞',
      isFullRange: false,
      isShowFullRangeHint: false,
      step: 0
    }
  },
  watch: {
    currentPrice: {
      handler: 'watchCurrentPrice',
      immediate: true
    },
    minPrice(value: string) {
      this.$emit('onChangeMin', value)
    },
    maxPrice(value: string) {
      this.$emit('onChangeMax', value)
    },
    direction(value: boolean) {
      this.onChangeMin(String(1 / Number(this.maxPrice)))
      this.onChangeMax(String(1 / Number(this.minPrice)))
      const price = 1 / this.currentPrice
      // console.log('难道进这里了###')
      this.step = price / 100
    }
  },
  methods: {
    addMinPrice() {
      // console.log('addMinPrice####this.step###', this.step)
      const min = Number(this.minPrice) + Number(this.minPrice) * this.step
      this.onChangeMin(String(min))
    },
    minusMinPrice() {
      // console.log('minusMinPrice####this.step###', this.step)
      const min = Number(this.minPrice) - Number(this.minPrice) * this.step
      this.onChangeMin(String(min))
    },
    addMaxPrice() {
      // console.log('addMaxPrice####this.step###', this.step)
      const max = Number(this.maxPrice) + Number(this.maxPrice) * this.step
      this.onChangeMax(String(max))
    },
    minusMaxPrice() {
      // console.log('minusMaxPrice####this.step###', this.step)
      const max = Number(this.maxPrice) - Number(this.maxPrice) * this.step
      this.onChangeMax(String(max))
    },
    watchCurrentPrice(value: number) {
      if (value) {
        // current price精度为12， 陈杨志demo中写
        const num = fixD(Math.pow(value / Math.pow(10, 12), 2), 12)
        this.step = Number(num) / 100
        // 默认min是0， max是num+1
        this.onChangeMin('2') // min不能等于0， 陈杨志要求写大于1的值
        this.onChangeMax(String(Number(num) + 1))
        this.minPrice = '2'
        this.maxPrice = String(Number(num) + 1)
        this.$emit('onChangeMin', '2')
        this.$emit('onChangeMax', String(Number(num) + 1))
      }
    },
    fullRange() {
      const num = fixD(Math.pow(this.currentPrice / Math.pow(10, 12), 2), 12)
      this.isFullRange = true
      this.isShowFullRangeHint = !this.isShowFullRangeHint
      this.minPrice = '0'
      this.maxPrice = '∞'
      this.$emit('onChangeMin', '0')
      this.$emit('onChangeMax', '∞')
    },
    onChangeMin(value: string) {
      const tick = price2tick(Number(value))
      const price = tick2price(tick)
      this.minPrice = String(price)
    },
    onChangeMax(value: string) {
      const tick = price2tick(Number(value))
      const price = tick2price(tick)
      this.maxPrice = String(price)
    }
  }
})
</script>
<style lang="less" scoped>
@import '../styles/base.less';
.set-price-range {
  margin-top: 20px;
  position: relative;
  > h3 {
    font-size: 14px;
    color: #fff;
  }
  .set-form-box {
    width: 100%;
    display: flex;
    justify-content: space-between;
    > .min-price,
    .max-price {
      // flex: 1;
      width: 50%;
      height: 84px;
      background: rgba(255, 255, 255, 0.04);
      border-radius: 10px;
      text-align: center;
      padding: 0px 20px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      &:first-child {
        margin-right: 10px;
      }
      > div {
        display: flex;
        align-items: center;
        justify-content: center;
        .icon {
          width: 16px;
          height: 16px;
        }
      }
      > p {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.8);
        margin: 0px;
      }
      input {
        // width: 100%;
        width: 150px;
        // display: block;
        color: #fff;
        font-size: 14px;
        border: none;
        outline: none;
        margin: 8px 0px;
        background: none;
        text-align: center;
        padding: 0px 10px;
      }
      .focus-input::-webkit-input-placeholder {
        color: #fff;
      }
    }
  }
  .full-range-hint {
    position: absolute;
    top: 0;
    left: 0;
    background: rgba(#323232, 0.88);
    border-radius: 10px;
    padding: 20px;
    .full-range-hint-title {
      font-weight: bold;
      color: #fb0;
      font-size: 14px;
      img {
        margin-right: 11px;
      }
    }
    .full-range-hint-text {
      margin-top: 14px;
      color: #fb0;
      font-size: 14px;
    }
    .full-range-hint-btn-box {
      text-align: center;
      .full-range-hint-btn {
        margin: 15px auto 0;
        .gradient-btn-large();
        width: 120px;
        height: 32px;
        color: #fff;
        font-size: 12px;
        border-radius: 8px;
      }
    }
  }
  .full-range {
    width: 452px;
    height: 40px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
    font-size: 14px;
    color: #fff;
    margin-top: 10px;
  }
}
@media screen and (max-width: 750px) {
  .set-price-range {
    .full-range {
      width: 100%;
    }
    .set-form-box {
      .max-price,
      .min-price {
        width: 50%;
        input {
          width: 100%;
        }
      }
    }
  }
}
</style>
