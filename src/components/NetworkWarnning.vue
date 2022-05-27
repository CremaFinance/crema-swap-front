<template>
  <div class="network-warnning-tips">
    <svg class="icon warnning-icon" aria-hidden="true">
      <use xlink:href="#icon-tanhao"></use>
    </svg>
    <span>Solana network is experiencing degraded performance. Transactions may fail to send or to confirm.</span>
    <svg class="icon close-icon" aria-hidden="true" @click="toClose">
      <use xlink:href="#icon-icon-close"></use>
    </svg>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  methods: {
    toClose() {
      this.$emit('close')
    }
  }
})
</script>
<style lang="less">
.network-warnning-tips {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 36px;
  // background: rgba(#ff2a00, 0.1);
  background: #37282a;
  padding: 0px 20px;
  span {
    color: rgba(255, 255, 255, 0.5);
  }
  .warnning-icon {
    width: 12px;
    height: 12px;
    fill: #fb0;
    margin-right: 12px;
  }
  .close-icon {
    width: 14px;
    height: 14px;
    fill: rgba(255, 255, 255, 0.5);
    margin-left: 20px;
    cursor: pointer;
  }
}

@media screen and (max-width: 750px) {
  .network-warnning-tips {
    padding: 10px 20px;
    span {
      flex: 1;
    }
  }
}
</style>