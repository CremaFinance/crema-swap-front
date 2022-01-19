<template>
  <div class="swap-tab-box">
    <div class="swap-tab">
      <nuxt-link class="tab-item active" to="/jupswap">
        <span>Aggregated</span>
        <div class="tips">Powered by Jupiter</div>
      </nuxt-link>
      <nuxt-link
        :class="
          $route.path === '/swap' || $route.path === '/'
            ? 'nuxt-link-exact-active nuxt-link-active tab-item'
            : 'tab-item'
        "
        to="/swap"
      >
        <span>Lite</span>
        <div class="tips">Crema CLMM pools only</div>
      </nuxt-link>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({})
</script>
<style lang="less" scoped>
.swap-tab-box {
  width: 234px;
  height: 40px;
  background: #23262b;
  box-shadow: 0px 0px 2px 0px #535966, inset 0px 2px 3px 1px #1a1c1f;
  border-radius: 12px;
  padding: 4px;
  margin: 0 auto;
  margin-bottom: 20px;
  .swap-tab {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    .tab-item {
      width: 113px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      cursor: pointer;
      span {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.5);
      }
      svg {
        width: 10px;
        height: 10px;
      }
      &.nuxt-link-exact-active {
        background: linear-gradient(270deg, #3e434e 0%, #282a2f 100%);
        box-shadow: 0px 4px 12px 0px rgba(26, 28, 31, 0.5);
        border-radius: 6px;
        border: 1px solid #3f434e;
        span {
          font-size: 14px;
          color: #fff;
        }
      }
      .tips {
        position: absolute;
        bottom: -38px;
        left: 50%;
        transform: translate(-50%, 0%);
        // width: 136px;
        height: 28px;
        line-height: 28px;
        background: #2e3138;
        box-shadow: 0px 4px 12px 0px rgba(26, 28, 31, 0.5);
        border-radius: 4px;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.5);
        white-space: nowrap;
        // display: inline-block;
        padding: 0px 16px;
        display: none;
      }
      &:hover {
        .tips {
          display: inline-block;
        }
      }
    }
  }
}

@media screen and (max-width: 750px) {
  .swap-tab-box {
    margin-top: 20px;
  }
}
</style>
