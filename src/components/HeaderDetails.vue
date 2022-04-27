<template>
  <div class="deta-block">
    <div class="deta-block-img">
      <!-- 52 30 -->
      <img
        v-if="currentData.coin"
        class="img-left"
        :src="currentData.coin.icon || importIcon(`/coins/${currentData.coin.symbol.toLowerCase()}.png`)"
        alt=""
      />
      <img
        v-if="currentData.pc"
        class="img-right"
        :src="currentData.pc.icon || importIcon(`/coins/${currentData.pc.symbol.toLowerCase()}.png`)"
        alt=""
      />
    </div>
    <div v-if="currentData.coin && currentData.pc" class="deta-block-either">
      <!-- 94 16 16 -->
      {{ currentData.coin.symbol }} / {{ currentData.pc.symbol }}
    </div>
    <!-- <div v-if="headersValue === 'yes'" class="deta-block-integer">
      0.3%
    </div> -->
    <StatusBlock :current-status="currentStatus" />
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import importIcon from '@/utils/import-icon'

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
    headersValue: {
      type: String,
      default: ''
    },
    currentData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    currentStatus: {
      type: String,
      default: 'Active'
    }
  },
  methods: {
    importIcon
  }
})
</script>
<style lang="less" scoped>
.deta-block {
  // height: 30px;
  // width: 336px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .deta-block-img {
    width: 52px;
    height: 30px;
    display: flex;
    img {
      width: 30px;
      height: 30px;
    }
    .img-left {
      position: relative;
      z-index: 1;
      // position: absolute;
      // left: 0;
      // z-index: 5;
    }
    .img-right {
      margin-left: -10px;
      // position: absolute;
      // left: 22px;
    }
  }
  .deta-block-either {
    // width: 94px;
    // height: 16px;
    // line-height: 16px;
    font-size: 15px;
    font-family: 'Arial Bold';
    font-weight: bold;
    padding: 0px 10px;
  }
  .deta-block-integer {
    width: 60px;
    height: 28px;
    background: rgba(#fff, 0.1);
    border-radius: 8px;
    text-align: center;
    line-height: 28px;
    font-family: 'Arial Bold';
    font-size: 14px;
    font-weight: bold;
    margin-right: 10px;
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
