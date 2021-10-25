<template>
  <div class="swap-info">
    <div class="block">
      <span>Exchange Rate</span>
      <div class="right">
        <span>1 USDC = 0.9998 USDT</span>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-icon-change"></use>
        </svg>
      </div>
    </div>
    <div class="block">
      <span>Price Impact</span>
      <div class="right">&lt;0.01%</div>
    </div>
    <div class="block">
      <span>Protocol Fee</span>
      <div class="right">0.04%</div>
    </div>
  </div>
</template>
<script lang="ts"></script>
<style lang="less" scoped>
.swap-info {
  > .block {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 20px;
    font-size: 14px;
    > span {
      color: rgba(255, 255, 255, 0.8);
    }
    .right {
      display: flex;
      align-items: center;
      color: #fff;
      svg {
        width: 20px;
        height: 20px;
      }
    }
  }
}
</style>
