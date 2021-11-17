<template>
  <div class="deta-price">
    <!-- 351 105  -->
    <div class="price-head">{{ type }} Price</div>
    <div class="price-amount">
      <!-- <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-a-icon-AddCustomMarket"></use>
      </svg> -->
      <p v-if="type === 'Max'">
        {{ currentData.maxPrice.indexOf('+') > 0 ? '∞' : decimalFormat(currentData.maxPrice, 6) }}
      </p>
      <p v-else>{{ decimalFormat(currentData.minPrice, 6) }}</p>
      <!-- <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-icon-Reduction"></use>
      </svg> -->
    </div>
    <div v-if="direction" class="price-per">
      {{ currentData.coin && currentData.coin.symbol }} per {{ currentData.pc && currentData.pc.symbol }}
    </div>
    <div v-else class="price-per">
      {{ currentData.pc && currentData.pc.symbol }} per {{ currentData.coin && currentData.coin.symbol }}
    </div>
    <div class="price-position">
      Your position will be 100%
      {{ type === 'Max' ? currentData.coin && currentData.coin.symbol : currentData.pc && currentData.pc.symbol }} at
      this price
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { decimalFormat } from '@/utils'
export default Vue.extend({
  // props: ['Reference', 'sized'],
  props: {
    type: {
      type: String,
      default: 'Max'
    },
    currentData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    direction: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    decimalFormat
  }
})
</script>
<style lang="less" scoped>
.deta-price {
  width: 50%;
  // width: 351px;
  // height: 105px;
  background: rgba(#fff, 0.04);
  // display: flex;
  // flex-wrap: wrap;
  text-align: center;
  border-radius: 10px;
  padding: 9px 0px;
  > div {
    width: 100%;
    // height: 12px;
    margin: auto;
    line-height: 1;
    font-size: 12px;
    text-align: center;
    // line-height: 12px;
    // font-family: 'arial';
    color: rgba(#fff, 0.5);
  }
  .price-amount {
    // width: 180px;
    display: flex;
    justify-content: center;
    text-align: center;
    .icon {
      display: block;
      width: 12px;
      height: 12px;
      cursor: pointer;
    }
    p {
      font-size: 14px;
      font-family: 'Arial Bold';
      font-weight: bold;
      color: rgba(#fff, 0.8);
      margin-top: 7px;
      margin-bottom: 0;
    }
  }
  .price-per {
    margin-top: 12px;
  }
  .price-position {
    margin-top: 10px;
  }
  // .price-per {
  // }
}
@media screen and (max-width: 750px) {
  .coin-block {
    .input-block {
      input {
        width: 100px;
      }
    }
  }
}
</style>
