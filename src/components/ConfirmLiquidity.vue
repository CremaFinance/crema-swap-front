<template>
  <div class="liquidity-block">
    <div class="liquidity-block-head">
      <p>{{ liquidityTitle }}</p>
      <p>Balance : 139.51</p>
    </div>
    <div class="liquidity-block-frame">
      <div class="liquidity-block-imgs">
        <img v-if="liquidityName === 'CRM'" src="../assets/images/icon_coins.png" alt="" />
        <img v-else src="../assets/images/usdt@2x.png" alt="" />
        <span>{{ liquidityName }}</span>
      </div>
      <div class="liquidity-block-number">
        <span>100</span>
        <p v-if="liquidityName === 'CRM'">MAX</p>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    liquidityTitle: {
      type: String,
      default: ''
    },
    liquidityName: {
      type: String,
      default: ''
    }
  }
})
</script>
<style lang="less" scoped>
.liquidity-block {
  width: 390px;
  height: 96px;
  display: flex;
  flex-wrap: wrap;
  align-content: space-between;
  .liquidity-block-head {
    display: flex;
    justify-content: space-between;
    width: 390px;
    height: 14px;
    p {
      font-size: 14px;
      font-family: 'Arial Bold';
      font-weight: bold;
    }
  }
  .liquidity-block-frame {
    width: 390px;
    height: 72px;
    background: rgba(#fff, 0.1);
    border-radius: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px 0 16px;
    .liquidity-block-imgs {
      width: 80px;
      height: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      img {
        width: 30px;
        height: 30px;
      }
      span {
        font-size: 16px;
        width: 41px;
        font-weight: bold;
      }
    }
    .liquidity-block-number {
      width: 117px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      span {
        font-size: 30px;
      }
      p {
        margin-left: 18px;
        font-size: 12px;
        font-weight: bold;
        margin-bottom: 0;
        width: 48px;
        height: 20px;
        background: linear-gradient(214deg, #59bdad 0%, #6676f5 61%, #9a89f9 76%, #eba7ff 100%);
        border-radius: 8px;
        text-align: center;
        cursor: pointer;
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
