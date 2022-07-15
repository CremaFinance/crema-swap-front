<template>
  <div
    class="deta-block-status-box"
    :class="currentStatus === 'Inactive' || pItem.isEnded ? 'deta-block-status-box-disable' : ''"
  >
    <div class="deta-block-status-bottom-box">
      <div class="deta-block-status-bottom"></div>
    </div>
    <div v-if="!pItem.isEnded" class="deta-block-status">
      <div v-if="currentStatus === 'Closed'">
        <span>Closed</span>
      </div>
      <div v-else-if="currentStatus === 'Active'">
        <i class="circle"></i>
        <span>{{ currentStatus }}</span>
      </div>
      <div v-else class="inactive">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-icon-tips"></use>
        </svg>
        <span>{{ currentStatus }}</span>
      </div>
    </div>
    <div v-else class="deta-block-status">
      <div class="ended-status">
        <i class="circle"></i>
        <span>Ended</span>
      </div>
    </div>
    <div class="active-tooltip" v-if="!pItem.isEnded">
      {{
        currentStatus === 'Active'
          ? 'The price of this pool is currently within your position price range.'
          : currentStatus === 'Inactive'
          ? 'The price of this pool is currently out of your position price range.'
          : ''
      }}
    </div>
    <div v-if="pItem.nftTokenMint" class="address">
      <a :href="`https://solscan.io/account/${pItem.nftTokenAccount}`" target="_blank">
        {{ pItem.nftTokenMint.substr(0, 4) }}
        ...
        {{ pItem.nftTokenMint.substr(pItem.nftTokenMint.length - 4, 4) }}
      </a>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { Tooltip } from 'ant-design-vue'
export default Vue.extend({
  // eslint-disable-next-line vue/require-prop-types
  components: {
    // Tooltip
  },
  props: ['currentStatus', 'pItem'],
  data() {
    return {
      isShowtips: false
    }
  }
})
</script>
<style lang="less" scoped>
@keyframes bgzou {
  to {
    background-position: 160px 0;
  }
}
.deta-block-status-box-disable {
  background: linear-gradient(180deg, #1b1f2a 0%, #191c31 81%, #1e323e 100%) !important;
  .deta-block-status-bottom {
    display: none;
  }
}
.deta-block-status-box {
  width: 160px;
  height: 80px;
  // background: linear-gradient(180deg, #101118 0%, #0f1034 82%, #004f80 100%);
  background: #181229;
  border-radius: 55px;
  position: relative;
  // overflow: hidden;
  padding: 12px 0;
  .deta-block-status-bottom-box {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    border-radius: 55px;
    overflow: hidden;
    .deta-block-status-bottom {
      position: absolute;
      bottom: 0px;
      width: 160px;
      height: 44px;
      background: url('../assets/images/color.png');
      background-size: 160px 44px;
      animation: bgzou 10s linear infinite;
    }
  }

  .active-tooltip {
    display: none;
    width: 420px;
    position: absolute;
    text-align: left;
    padding: 10px 15px;
    background: linear-gradient(214deg, #3e434e 0%, #23262b 100%);
    border-radius: 10px;
    top: -65px;
    right: -80%;
    color: #b5b8c2;
    // transform: translateX(-50%);
    z-index: 100;
  }
  .deta-block-status {
    position: relative;
    cursor: pointer;
    // width: 100px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    // background: rgba(#fff, 0.1);
    border-radius: 8px;
    text-align: center;
    padding: 0 12px;
    z-index: 999;
    &:hover {
      & + .active-tooltip {
        display: block;
      }
    }
    div {
      display: flex;
      align-items: center;
    }
    .circle {
      display: block;
      width: 6px;
      height: 6px;
      background: #00ff4d;
      border-radius: 50%;
    }
    .ended-status {
      .circle {
        background: #666;
      }
    }
    svg {
      width: 20px;
      height: 20px;
      fill: #fff;
    }
    span {
      // width: 63px;
      // height: 28px;
      // line-height: 28px;
      font-size: 14px;
      font-weight: bold;
      margin-left: 8px;
    }
    .inactive {
      span {
        margin-left: 0;
      }
    }
  }
  .address {
    width: 98px;
    margin: 0 auto;
    height: 28px;
    line-height: 28px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 14px;
    backdrop-filter: blur(0px);
    text-align: center;
    cursor: pointer;
    a {
      font-size: 12px;
      color: #fff;
      &:hover {
        text-decoration: underline;
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
  .deta-block-status-box {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0px 20px;
    .deta-block-status-bottom-box {
      left: 0px;
      .deta-block-status-bottom {
        width: 100%;
      }
    }
    .address {
      margin: 0px;
    }
  }
}
</style>
