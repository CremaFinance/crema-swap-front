<template>
  <div class="nft-card-container">
    <svg
      id="textPathDemo"
      class="round-text"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      width="200"
      viewBox="0 0 200 200"
    >
      <path
        id="text-path1"
        d="M 100 100 m -96 0 a 96 96 0 1 0 192 0 a 96 96 0 1 0 -192 0"
        fill="none"
        stroke="rgba(0,0,0,0)"
        stroke-dasharray="5,2"
        stroke-width="1"
      />
      <text class="circle-text">
        <textPath xlink:href="#text-path1" class="text-content" textLength="500" startOffset="0">
          {{ poolInfo ? `${poolInfo.coin.mintAddress} ${poolInfo.coin.symbol}` : '' }}
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          {{ poolInfo ? `${poolInfo.pc.mintAddress} ${poolInfo.pc.symbol}` : '' }}
          <!-- <animate attributeName="startOffset" from="0" to="314" begin="0s" dur="10s" repeatCount="indefinite" /> -->
        </textPath>
      </text>
    </svg>
    <div v-if="poolInfo" class="nft-info">
      <div class="coin-name">{{ poolInfo.coin.symbol }} - {{ poolInfo.pc.symbol }}</div>
      <div class="fee-tier-tag">{{ poolInfo.feeView }}%</div>
      <ul>
        <!-- <li>
              <span>ID</span>
              <span>9296</span>
            </li> -->
        <li>
          <span>Min Tick</span>
          <span>{{ currentData.lower_tick }}</span>
        </li>
        <li>
          <span>Max Tick</span>
          <span>{{ currentData.upper_tick }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    poolInfo: {
      type: Object,
      default: () => {
        return {}
      }
    },
    currentData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  }
})
</script>
<style lang="less" scoped>
.nft-card-container {
  width: 340px;
  height: 340px;
  background-image: url('../assets/images/nft-img2.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center center;
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    width: 267px;
    position: relative;
    z-index: 100;
    &:hover {
      animation: circle 30s infinite linear;
    }
  }
  .text-content {
    fill: rgba(255, 255, 255, 0.5);
    font-size: 6px;
  }
  .nft-info {
    width: 140px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .coin-name {
      text-align: center;
      font-size: 18px;
      color: #fff;
      white-space: nowrap;
    }
    .fee-tier-tag {
      width: 80px;
      height: 24px;
      background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.1) 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      color: #fff;
      margin: 0 auto;
      margin-top: 10px;
    }
    > ul {
      margin-bottom: 0px;
      li {
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #fff;
        margin-top: 10px;
        font-size: 14px;
        span {
          &:first-child {
            color: rgba(255, 255, 255, 0.2);
          }
          &:last-child {
            text-align: right;
          }
        }
      }
    }
  }
}

@keyframes circle {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
@media screen and (max-width: 750px) {
  .nft-card-container {
    margin: auto;
  }
}
</style>
