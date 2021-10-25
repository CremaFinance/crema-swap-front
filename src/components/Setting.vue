<template>
  <Modal title="Settings" width="430px" :visible="true" :footer="null" @cancel="$emit('onClose')">
    <div class="pool-setting">
      <div class="slippage-tolerance">Slippage tolerance</div>
      <div class="input-content">
        <div
          class="slippage-item"
          :class="item === slippageNum ? 'slippage-item-active' : ''"
          v-for="(item, index) in slippageArr"
          :key="index"
          @click="slippageNum = item"
        >
          {{ item }}
        </div>
        <Input v-model="slippageNum" size="large" suffix="%" @input="slippageNum = slippageNum.replace(/[^\d]/g, '')" />
      </div>
    </div>
  </Modal>
</template>
<script lang="ts">
import Vue from 'vue'
import { Modal, Input } from 'ant-design-vue'

Vue.use(Modal)

export default Vue.extend({
  components: {
    Modal,
    Input
  },
  data() {
    return {
      slippageNum: '',
      slippageArr: ['0.1', '0.5', '1']
    }
  }
})
</script>
<style lang="less" scope>
.pool-setting {
  padding-bottom: 43px;
  .slippage-tolerance {
    margin-top: 20px;
  }
  .input-content {
    margin-top: 34px;
    display: flex;
    justify-content: space-between;
    .slippage-item {
      width: 72px;
      height: 48px;
      // background: rgb(#333);
      background: none;
      // border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      color: #fff;
      text-align: center;
      line-height: 48px;
      // border: 1px solid rgba(0, 0, 0, 0.05);
      border-radius: 10px;
      border: 1px solid #07ebad;
    }
    .slippage-item-active {
      background-color: #07ebad;
      outline: 0;
      color: #1a4e3f;
    }
    input {
      width: 72px;
      height: 48px;
      background: rgba(#fff, 1);
      color: #333;
      border-radius: 8px;
    }

    .ant-input-affix-wrapper {
      width: auto;
      .ant-input-suffix {
        color: #333;
      }
      input {
        background-color: #fff;
        text-align: center !important;
        font-size: 12px;
        line-height: 20px;
        font-weight: 600;
        border-radius: 10px;
      }
    }
  }
}
</style>

