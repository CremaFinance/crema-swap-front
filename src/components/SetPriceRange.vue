<template>
  <div class="set-price-range">
    <h3>Set Price Range</h3>
    <div class="set-form-box">
      <div class="min-price">
        <p>Min Price</p>
        <div>
          <input type="number" :class="isFullRange ? 'focus-input' : ''" :placeholder="minPrice" />
        </div>
        <p>{{ _props.coinA }} per {{ _props.coinB }}</p>
      </div>
      <div class="max-price">
        <p>Max Price</p>
        <div>
          <input type="number" :class="isFullRange ? 'focus-input' : ''" :placeholder="maxPrice" />
        </div>
        <p>{{ _props.coinA }} per {{ _props.coinB }}</p>
      </div>
    </div>
    <button class="full-range" @click="fullRange">Full Range</button>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: ['coinA', 'coinB'],

  data() {
    return {
      minPrice: '0',
      maxPrice: '0',
      isFullRange: false
    }
  },
  methods: {
    fullRange() {
      this.isFullRange = true
      this.minPrice = '0'
      this.maxPrice = '∞'
    }
  }
})
</script>
<style lang="less" scoped>
.set-price-range {
  margin-top: 20px;
  > h3 {
    font-size: 14px;
    color: #fff;
  }
  .set-form-box {
    width: 100%;
    display: flex;
    justify-content: space-between;
    > div {
      flex: 1;
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
      > p {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.8);
        margin: 0px;
      }
      input {
        width: 100%;
        display: block;
        color: #fff;
        font-size: 14px;
        border: none;
        outline: none;
        margin: 8px 0px;
        background: none;
        text-align: center;
      }
      .focus-input::-webkit-input-placeholder {
        color: #fff;
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
  }
}
</style>
