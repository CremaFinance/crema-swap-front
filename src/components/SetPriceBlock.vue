<template>
  <div class="set-price-block">
    <div class="set-price-form">
      <SetPriceItem
        v-model="minPrice"
        p-type="Min"
        :default-max-price="defaultMaxPrice"
        :from-coin="fromCoin"
        :to-coin="toCoin"
        :dirction="dirction"
        :tickSpace="tickSpace"
      ></SetPriceItem>
      <SetPriceItem
        v-model="maxPrice"
        p-type="Max"
        :default-max-price="defaultMaxPrice"
        :from-coin="fromCoin"
        :to-coin="toCoin"
        :dirction="dirction"
        :tickSpace="tickSpace"
      ></SetPriceItem>
    </div>

    <div v-if="showUnderStand" class="full-range-note">
      <div class="title">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-a-icon-MarketAdress"></use>
        </svg>
        <span>Lower Efficiency</span>
      </div>
      <p>Please note that full range positions may earn less fees than concentrated liquidity.</p>
      <button @click="understand">I understand</button>
    </div>
    <button class="full-range" @click="showUnderStand = true">Full Range</button>
    <div class="price-hint" v-if="invalidPriceRange">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-a-icon-MarketAdress"></use>
      </svg>
      The max price should be higher than min price.
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import SetPriceItem from './SetPriceItem.vue'
export default Vue.extend({
  components: {
    SetPriceItem
  },
  props: {
    min: {
      type: String,
      default: ''
    },
    max: {
      type: String,
      default: ''
    },
    defaultMaxPrice: {
      type: String,
      default: ''
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
    invalidPriceRange: {
      type: Boolean,
      default: false
    },
    tickSpace: {
      type: Number,
      default: 10
    }
  },
  data() {
    return {
      showUnderStand: false,
      minPrice: '',
      maxPrice: ''
    }
  },
  watch: {
    min(newVal: string, oldVal: string) {
      if (newVal !== oldVal) {
        this.minPrice = newVal
      }
    },
    max(newVal: string, oldVal: string) {
      if (newVal !== oldVal) {
        this.maxPrice = newVal
      }
    },
    minPrice(newVal: string, oldVal: string) {
      if (newVal !== oldVal) {
        this.$emit('onChangeMinPrice', newVal)
      }
    },
    maxPrice(newVal: string, oldVal: string) {
      if (newVal !== oldVal) {
        this.$emit('onChangeMaxPrice', newVal)
      }
    }
  },
  mounted() {
    this.minPrice = this.min
    this.maxPrice = this.max
  },
  methods: {
    understand() {
      this.minPrice = '0'
      this.maxPrice = '∞'
      this.showUnderStand = false
    }
  }
})
</script>

<style lang="less" scoped>
.set-price-block {
  width: 460px;
  position: relative;
  margin-top: 18px;
  .set-price-form {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .price-hint {
    margin-top: 12px;
    color: #fb0;
    display: flex;
    align-items: center;
    line-height: 1;
    .icon {
      width: 20px;
      height: 20px;
      margin-right: 8px;
      fill: #fb0;
    }
  }
  .full-range-note {
    position: absolute;
    left: 0px;
    right: 0px;
    top: 0px;
    bottom: 0px;
    background: rgba(#333740, 0.9);
    border-radius: 10px;
    padding: 14px;
    .title {
      display: flex;
      align-items: center;
      .icon {
        width: 20px;
        height: 20px;
        fill: #fb0;
      }
      span {
        font-size: 14px;
        color: #fb0;
      }
    }
    p {
      font-size: 14px;
      color: rgba(#fb0, 0.9);
      padding-top: 10px;
    }
    > button {
      display: block;
      width: 98px;
      height: 26px;
      background: linear-gradient(270deg, #5fe6d0 0%, #60b2f1 33%, #9380ff 68%, #e590ff 100%);
      border-radius: 7px;
      margin: 0 auto;
      margin-top: 15px;
    }
  }

  .full-range {
    width: 460px;
    height: 46px;
    background: linear-gradient(270deg, #3e434e 0%, #2b2f36 100%);
    box-shadow: 0px 4px 12px 0px rgba(26, 28, 31, 0.5);
    border-radius: 10px;
    border: 1px solid #3f434e;
    font-size: 14px;
    color: #fff;
    margin-top: 9px;
  }
}
@media screen and (max-width: 750px) {
  .set-price-block {
    width: 100%;
    .full-range {
      width: 100%;
    }
  }
}
</style>
