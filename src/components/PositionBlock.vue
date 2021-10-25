<template>
  <div class="position-block">
    <div class="left">
      <div class="pos-info">
        <div class="icon-box">
          <img />
          <img />
        </div>
        <div class="name">CRM / USDT</div>
        <div class="fee">0.3%</div>
      </div>
      <div class="min-and-max">
        <p>
          <span>Min:</span>
          1504.2 CRM per USDT
        </p>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-icon-link"></use>
        </svg>
        <p>
          <span>Max:</span>
          3505.2 CRM per USDT
        </p>
      </div>
    </div>
    <div class="right">
      <button v-if="btnType === 'inrange'">
        <i class="circle"></i>
        <span>In range</span>
      </button>
      <button v-if="btnType === 'closed'">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-icon-tips"></use>
        </svg>
        <span>Closed</span>
      </button>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    btnType: {
      type: String,
      default: 'inrange'
    }
  }
})
</script>
<style lang="less" scoped>
.position-block {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
  height: 104px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 30px;
  padding: 0px 20px;
  // filter: blur(50px);
  > .left {
    .pos-info {
      display: flex;
      align-items: center;
      .icon-box {
        img {
          width: 30px;
          height: 30px;
          border-radius: 100%;
          &:last-child {
            margin-left: -14px;
          }
        }
      }
      .name {
        font-size: 16px;
        color: #fff;
        margin-left: 10px;
      }
      .fee {
        width: 60px;
        height: 28px;
        line-height: 28px;
        text-align: center;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        filter: blur(0px);
        font-size: 14px;
        color: #fff;
        margin-left: 10px;
      }
    }
    .min-and-max {
      display: flex;
      align-items: center;
      margin-top: 12px;
      p {
        font-size: 14px;
        color: #fff;
        margin: 0px;
        span {
          color: rgba(255, 255, 255, 0.5);
        }
      }
      svg {
        width: 20px;
        height: 20px;
        fill: rgba(255, 255, 255, 0.5);
        margin: 0px 10px;
      }
    }
  }
  > .right {
    button {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      color: #fff;
      height: 28px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 0px 10px;
      min-width: 100px;
      .circle {
        width: 6px;
        height: 6px;
        background: #00ff4d;
        margin-right: 10px;
        border-radius: 100%;
      }
      svg {
        width: 20px;
        height: 20px;
        fill: #fff;
        margin-right: 6px;
      }
    }
  }
}
</style>
