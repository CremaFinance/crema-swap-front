<template>
  <Modal
    class="burn-caffeine-modal"
    title="Burn"
    :zindex="1070"
    centered
    width="492px"
    :visible="true"
    :footer="null"
    @cancel="$emit('onClose')"
  >
    <div class="burn-caffeine-content">
      <div class="block">
        <div class="left">Burn Caffeine</div>
        <div class="right">
          <div class="max-box">
            <img src="@/assets/images/icon-caffeine.png" />
            <span>{{ caffeineAmount }}</span>
            <button @click="burnMax">MAX</button>
          </div>
          <input
            v-model="amount"
            oninput="value=this.value.replace(/[^\d-]*(\d*(?:\.\d{0,10})?).*$/g,'$1')"
            class="amount-input"
            type="text"
            placeholder="0"
          />
        </div>
      </div>
      <div class="arrow-block">
        <div class="arrow-box"><img src="@/assets/images/color-arrow.png" /></div>
      </div>
      <div class="block">
        <div class="left">Receive CRM</div>
        <div class="right">
          <div class="amount">{{ crmAmount }}</div>
        </div>
      </div>
      <Button v-if="insufficientBalance" class="burn-btn-block" disabled>Insufficient balance</Button>
      <Button v-else class="burn-btn-block" :loading="isBurnLoading" :disabled="!Number(amount)" @click="claimCaffeine"
        >Burn</Button
      >
    </div>
  </Modal>
</template>
<script lang="ts">
import Vue from 'vue'
import { Modal, Select, Button } from 'ant-design-vue'
import { decimalFormat } from '@/utils'

Vue.use(Modal)

export default Vue.extend({
  components: {
    Modal,
    Button
  },
  props: {
    isBurnLoading: {
      type: Boolean,
      default: false
    },
    caffeineAmount: {
      type: String,
      default: '0'
    },
    caffeineToCrmRate: {
      type: Number,
      default: 2
    }
  },
  data() {
    return {
      amount: ''
    }
  },
  computed: {
    crmAmount() {
      return decimalFormat(String(this.caffeineToCrmRate * Number(this.amount)), 6)
    },
    insufficientBalance() {
      if (Number(this.amount) > Number(this.caffeineAmount)) {
        return true
      }
      return false
    }
  },
  methods: {
    claimCaffeine() {
      console.log('claim caffeine')
      this.$emit('toBurn', this.amount)
      this.$emit('onClose')
    },
    burnMax() {
      this.amount = this.caffeineAmount
    }
  }
})
</script>
<style lang="less" scoped>
@import '../styles/base.less';
.burn-caffeine-content {
  .block {
    display: flex;
    width: 100%;
    height: 80px;
    background: #23262b;
    box-shadow: 0px 0px 2px 0px #535966, inset 0px 2px 3px 1px #1a1c1f;
    border-radius: 20px;
    align-items: center;
    justify-content: space-between;
    padding: 10px 20px;
    .left {
      font-size: 16px;
      font-family: Arial-BoldMT, Arial;
      font-weight: normal;
      color: rgba(255, 255, 255, 0.5);
      white-space: nowrap;
    }
    .right {
      flex: 1;
      .max-box {
        display: flex;
        align-items: center;
        margin-bottom: 6px;
        justify-content: flex-end;
        img {
          width: 24px;
          height: 24px;
        }
        span {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.5);
          margin: 0px 8px;
        }
        button {
          .gradient-btn-large();
          width: 48px;
          height: 24px;
          font-size: 12px;
          border-radius: 7px;
        }
      }
      .amount-input {
        font-size: 24px;
        color: #fff;
        background: none;
        border: none;
        text-align: right;
        width: 100%;
        &::placeholder {
          color: rgba(#fff, 0.5);
        }
      }
      .amount {
        font-size: 24px;
        color: rgba(255, 255, 255, 0.5);
        text-align: right;
        cursor: not-allowed;
      }
    }
  }
  .arrow-block {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 22px;
    .arrow-box {
      width: 48px;
      height: 48px;
      background: linear-gradient(270deg, #383c46 0%, #373b42 100%);
      box-shadow: 0px 4px 12px 0px rgba(26, 28, 31, 0.5);
      border-radius: 10px;
      border: 1px solid #3f434e;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 28px;
        height: 28px;
      }
    }
  }
  .burn-btn-block {
    .gradient-btn-large();
    width: 100%;
    height: 56px;
    margin-top: 40px;
  }
}
@media screen and (max-width: 750px) {
  .burn-caffeine-content {
    .block {
      .left {
        font-size: 12px;
      }
    }
  }
}
</style>