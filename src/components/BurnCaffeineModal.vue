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
            <span>1234.1234</span>
            <button>MAX</button>
          </div>
          <input v-model="amount" class="amount-input" type="text" />
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
      <Button class="burn-btn-block">Burn</Button>
    </div>
  </Modal>
</template>
<script lang="ts">
import Vue from 'vue'
import { Modal, Select, Button } from 'ant-design-vue'

Vue.use(Modal)

export default Vue.extend({
  components: {
    Modal,
    Button
  },
  data() {
    return {
      amount: '0'
    }
  },
  computed: {
    crmAmount() {
      return 1 * Number(this.amount)
    }
  },
  methods: {
    claimCaffeine() {
      console.log('claim caffeine')
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
    height: 100px;
    background: #23262b;
    box-shadow: 0px 0px 2px 0px #535966, inset 0px 2px 3px 1px #1a1c1f;
    border-radius: 20px;
    align-items: center;
    justify-content: space-between;
    padding: 10px 20px;
    .left {
      font-size: 20px;
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
        font-size: 30px;
        color: #fff;
        background: none;
        border: none;
        text-align: right;
        width: 100%;
      }
      .amount {
        font-size: 30px;
        color: #fff;
        text-align: right;
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
</style>