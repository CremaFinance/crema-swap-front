<template>
  <div class="set-price-container">
    <div class="set-price-top">
      <div class="left">Set Price Range</div>
      <div class="right">
        <a @click="resetPrice">Reset</a>
        <div class="full-range-btn" @click="changeShowUnderStand">
          <div class="radio"><i v-if="isRadio"></i></div>
          <span>Full range</span>
        </div>
      </div>
    </div>
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
        <div class="left">
          <div class="title">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-error"></use>
            </svg>
            <span>Lower Efficiency</span>
          </div>
          <p>Please note that full range positions may earn less fees than concentrated liquidity.</p>
        </div>

        <button @click="understand">I understand</button>
      </div>
      <!-- <button class="full-range" @click="showUnderStand = true">Full Range</button> -->
    </div>
    <div v-if="invalidPriceRange" class="price-hint">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-error"></use>
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
    defaultMinPrice: {
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
      isRadio: false,
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
    },
    resetPrice() {
      this.minPrice = this.defaultMinPrice
      this.maxPrice = this.defaultMaxPrice
      this.showUnderStand = false
      this.isRadio = false
    },
    changeShowUnderStand() {
      // this.showUnderStand = !this.showUnderStand
      this.isRadio = !this.isRadio
      if (this.isRadio) {
        this.showUnderStand = true
      } else {
        this.resetPrice()
      }
      if (!this.showUnderStand) {
        this.minPrice = this.defaultMinPrice
        this.maxPrice = this.defaultMaxPrice
      }
    }
  }
})
</script>

<style lang="less" scoped>
.set-price-container {
  width: 460px;
  .set-price-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    > .left {
      font-size: 14px;
      font-weight: 800;
      color: #fff;
    }
    > .right {
      display: flex;
      align-items: center;
      a {
        color: rgba(255, 255, 255, 0.5);
        font-size: 14px;
        cursor: pointer;
        &:hover {
          color: #fff;
        }
      }
      .full-range-btn {
        display: flex;
        align-items: center;
        margin-left: 12px;
        cursor: pointer;
        span {
          color: rgba(255, 255, 255, 0.5);
          font-size: 14px;
        }
        .radio {
          width: 12px;
          height: 12px;
          border-radius: 100%;
          background: none;
          border: 1px solid #fff;
          margin-right: 4px;
          padding: 0px;
          position: relative;
          i {
            display: inline-block;
            width: 6px;
            height: 6px;
            background: linear-gradient(270deg, #1a89d5 0%, #1c00ff 100%);
            border-radius: 100%;
            margin: 0px;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
          }
        }
      }
    }
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
}
.set-price-block {
  width: 100%;
  position: relative;
  margin-top: 12px;
  background: #23262b;
  box-shadow: 0px 0px 2px 0px #535966, inset 0px 2px 3px 1px #1a1c1f;
  border-radius: 16px;
  .set-price-form {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    > :first-child {
      border-right: 1px solid rgba(#fff, 0.1);
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
    height: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left {
      flex: 1;
    }
    .title {
      display: flex;
      align-items: center;
      margin-top: 12px;
      .icon {
        width: 16px;
        height: 16px;
        fill: #fb0;
      }
      span {
        font-size: 14px;
        color: #fb0;
        margin-left: 4px;
      }
    }
    p {
      font-size: 14px;
      color: rgba(#fb0, 0.9);
      padding-top: 6px;
    }
    > button {
      // flex: 1;
      display: block;
      width: 98px;
      height: 28px;
      background: linear-gradient(270deg, #5fe6d0 0%, #60b2f1 33%, #9380ff 68%, #e590ff 100%);
      border-radius: 7px;
      margin: 0 auto;
      margin-left: 20px;
      white-space: nowrap;
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
  .set-price-container {
    width: 100%;
  }
  .set-price-block {
    width: 100%;
    .full-range {
      width: 100%;
    }
    .full-range-note p {
      font-size: 12px;
    }
  }
}
</style>
