<template>
  <div class="coin-block">
    <div class="coin-box">
      <div class="coin-name" @click="selectCoin">
        <img v-if="coinName" :src="importIcon(`/coins/${coinName.toLowerCase()}.png`)" />
        <img v-else src="../assets/images/icon_missing.png" />
        <span>{{ coinName || 'Select' }}</span>
        <svg class="icon" v-if="!notSelect" aria-hidden="true">
          <use xlink:href="#icon-icon-on"></use>
        </svg>
      </div>
      <div class="right">
        <div class="balance-box">
          <span>Balance: {{ (balance && !balance.wei.isNaN() && balance.fixed()) || 0 }}</span>
          <!-- <span>Balance: {{ (coinBalance && !coinBalance.wei.isNaN() && coinBalance.fixed()) || 0 }}</span> -->
          <button
            v-if="showMax && balance && (!value || lt(value, balance.toEther()))"
            class="max"
            @click="$emit('onMax')"
          >
            <!-- <button
            v-if="showMax && coinBalance && (!value || lt(value, coinBalance.toEther()))"
            class="max"
            @click="$emit('onMax')"
          > -->
            MAX
          </button>
        </div>
        <input
          type="text"
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
      </div>
    </div>
    <div v-if="showLock" class="lock-mask">
      <img src="../assets/img/icon-lock@2x.png" />
      <p>The market price is outside your specified price range. Single-asset deposit only.</p>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import importIcon from '@/utils/import-icon'
import { lt } from '@/utils/safe-math'
import { mapState } from 'vuex'

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
    notSelect: {
      type: Boolean,
      default: false
    },
    coinObj: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  computed: {
    ...mapState(['wallet']),
    coinBalance() {
      if (this.coinObj && this.coinObj.mintAddress && this.wallet.tokenAccounts) {
        const tokenInfo = this.wallet.tokenAccounts[this.coinObj.mintAddress]
        if (tokenInfo && tokenInfo.balance) return tokenInfo.balance
      }
      return 0
    }
  },
  methods: {
    importIcon,
    lt,
    selectCoin() {
      if (!this.notSelect) this.$emit('onSelect')
    }
  }
})
</script>

<style lang="less" scoped>
.coin-block {
  position: relative;
  width: 460px;
  height: 100px;
  background: #23262b;
  box-shadow: 0px 0px 2px 0px #535966, 0px 2px 3px 1px #1a1c1f;
  border-radius: 20px;

  .coin-box {
    display: flex;
    align-items: center;
    padding: 10px;
    padding-right: 20px;
    .coin-name {
      width: 148px;
      height: 80px;
      border-radius: 12px;
      border: 1px solid #3f434e;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(270deg, #3e434e 0%, #2f333b 100%);
      box-shadow: 0px 4px 12px 0px rgba(26, 28, 31, 0.5);
      img {
        width: 30px;
        height: 30px;
        border-radius: 100%;
        margin-right: 6px;
      }
      span {
        font-size: 16px;
        color: #fff;
        font-weight: bold;
      }
      svg {
        width: 20px;
        height: 20px;
        fill: rgba(255, 255, 255, 0.5);
      }
      &:hover {
        // background: rgba(255, 255, 255, 0.1);
        svg {
          fill: #fff;
        }
      }
    }
    .right {
      height: 80px;
      flex: 1;
      .balance-box {
        display: flex;
        justify-content: flex-end;
        span {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.5);
        }
        button {
          width: 48px;
          height: 24px;
          background: linear-gradient(233deg, #4bb5ff 0%, #ce90ff 100%);
          box-shadow: 0px 2px 9px 0px rgba(0, 0, 0, 0.59), -3px -3px 5px 0px rgba(255, 255, 255, 0.1);
          border-radius: 7px;
          // border: 1px solid;
          // border-image: linear-gradient(180deg, rgba(232, 228, 255, 1), rgba(0, 143, 232, 0.58)) 1 1;
          color: #fff;
          margin-left: 10px;
          font-size: 12px;
        }
      }
      > input {
        font-size: 24px;
        color: #fff;
        border: none;
        background: none;
        padding-left: 10px;
        text-align: right;
        width: 100%;
        margin-top: 10px;
      }
    }
  }

  .lock-mask {
    position: absolute;
    left: 0px;
    right: 0px;
    top: 0px;
    bottom: 0px;
    background: rgba(#333740, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    padding: 20px;
    img {
      width: 40px;
      height: 40px;
    }
    p {
      height: 40px;
      margin-left: 10px;
      font-size: 14px;
      color: #fff;
      text-align: center;
    }
  }
}
@media screen and (max-width: 750px) {
  .coin-block {
    width: 100%;
    .coin-box {
      .coin-name {
        width: 120px;
      }
      .balance-box {
        text-align: right;
      }
    }
  }
}
</style>
