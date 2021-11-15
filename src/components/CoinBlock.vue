<template>
  <div class="coin-block">
    <div class="balance-block">
      <span>{{ swapDirection }}</span>
      <span>Balance: {{ (balance && !balance.wei.isNaN() && balance.fixed()) || 0 }}</span>
    </div>
    <div class="input-block-box">
      <div class="input-block">
        <div class="coin-select" @click="$emit('onSelect')">
          <img v-if="coinName" :src="importIcon(`/coins/${coinName.toLowerCase()}.png`)" />
          <img v-else src="../assets/images/icon_missing.svg" />
          <span>{{ coinName }}</span>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-icon-on"></use>
          </svg>
        </div>
        <input
          type="number"
          :value="value"
          autocomplete="off"
          autocorrect="off"
          placeholder="0.00"
          pattern="^[0-9]*[.,]?[0-9]*$"
          minlength="1"
          maxlength="79"
          spellcheck="false"
          :disabled="disabled"
          @input="$emit('onInput', $event.target.value)"
          @focus="$emit('onFocus')"
        />
        <button
          v-if="showMax && balance && (!value || lt(value, balance.toEther()))"
          class="max"
          @click="$emit('onMax')"
        >
          MAX
        </button>
      </div>
      <div v-if="showLock" class="lock-mask">
        <img src="../assets/img/icon-lock@2x.png" />
        <p>The market price is outside your specified price range. Single-asset deposit only.</p>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import importIcon from '@/utils/import-icon'
import { lt } from '@/utils/safe-math'

export default Vue.extend({
  model: {
    prop: 'value',
    event: 'onInput'
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    coinName: {
      type: String,
      default: ''
    },
    balance: {
      type: Object,
      default: null
    },
    showMax: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    showLock: {
      type: Boolean,
      default: false
    },
    swapDirection: {
      type: String,
      default: ''
    }
  },
  methods: {
    importIcon,
    lt
  }
})
</script>
<style lang="less" scoped>
.coin-block {
  .balance-block {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    color: #fff;
    padding-bottom: 10px;
  }
  .input-block-box {
    border-radius: 20px;
    padding: 2px;
    position: relative;
    background-color: #33383b;
    &:active,
    &:hover {
      background: linear-gradient(214deg, #59bdad 0%, #6676f5 61%, #9a89f9 76%, #eba7ff 100%);
    }
  }
  .lock-mask {
    position: absolute;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
    border-radius: 20px;
    display: flex;
    align-items: center;
    padding: 16px 20px;
    background: rgba(50, 50, 50, 0.88);
    img {
      width: 40px;
      height: 40px;
    }
    p {
      flex: 1;
      font-size: 14px;
      color: #fff;
      margin-left: 8px;
      text-align: center;
      margin-bottom: 0px;
    }
  }
  .input-block {
    display: flex;
    align-items: center;
    width: 100%;
    height: 72px;
    // background: rgba(255, 255, 255, 0.1);
    background: #33383b;
    border-radius: 20px;
    padding: 0px 16px;
    .coin-select {
      display: flex;
      align-items: center;
      width: 112px;
      img {
        width: 30px;
        height: 30px;
      }
      span {
        display: block;
        width: 55px;
        font-size: 16px;
        color: #fff;
        margin-left: 8px;
      }
      svg {
        width: 20px;
        height: 20px;
        fill: rgba(255, 255, 255, 0.5);
      }
    }
    input {
      flex: 1;
      padding-right: 20px;
      border: none;
      background: none;
      text-align: right;
      font-size: 20px;
      font-weight: 400;
    }
    .max {
      width: 48px;
      height: 20px;
      line-height: 20px;
      font-size: 12px;
      color: #fff;
      background: linear-gradient(214deg, #59bdad 0%, #6676f5 61%, #9a89f9 76%, #eba7ff 100%);
      border-radius: 8px;
      &:hover {
        background: linear-gradient(214deg, #a4fff0 0%, #8996ff 61%, #c9c0ff 76%, #f1c3ff 100%);
      }
      &:active {
        background: linear-gradient(214deg, #a4fff0 0%, #8996ff 61%, #c9c0ff 76%, #f1c3ff 100%);
      }
    }
  }
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
