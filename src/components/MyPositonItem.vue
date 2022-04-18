<template>
  <div class="positon-item-container" @mouseover="mouseOver" @mouseleave="mouseLeave">
    <div
      :class="`positon-item-box positon-item-box-${random}`"
      :style="isShow ? { transform: 'translateY(-75px)' } : ''"
    >
      <div class="positon-item">
        <div class="positon-box"></div>
        <div class="circle">
          <div class="circle-center">
            <div class="circle-center-pic">
              <img class="coin-before" :src="importIcon(`/coins/${pItem.poolInfo.coin.symbol.toLowerCase()}.png`)" />
              <img class="coin-after" :src="importIcon(`/coins/${pItem.poolInfo.pc.symbol.toLowerCase()}.png`)" />

              <!-- <img class="coin-before" src="../assets/coins/sol.png" alt="" /> -->
              <!-- <img class="coin-after" src="../assets/coins/usdc.png" alt="" /> -->
              <div class="symbol-name">{{ pItem.poolInfo.name }}</div>
            </div>
          </div>
          <Button class="add-liquidity">
            <span>Add Liquidity</span>
          </Button>
        </div>
        <div class="total-deposits">
          <div class="leabl">Total Deposits</div>
          <div class="text">$840,110.78</div>
        </div>
        <div class="volume-24h">
          <div class="leabl">Volume (24H)</div>
          <div class="text">$2,270,269.82</div>
        </div>
      </div>
    </div>

    <transition name="slide-fade" appear>
      <div class="my-positon-box" :style="isShow ? { transform: 'translateY(75px)' } : ''">
        <div v-if="wallet.connected && pItem.nftTokenMint" class="my-positon">
          <div class="my-nft-title">My NFT</div>
          <div class="address">
            <span class="active"></span>
            <span>
              {{ pItem.nftTokenMint.substr(0, 4) }}
              ...
              {{ pItem.nftTokenMint.substr(pItem.nftTokenMint.length - 4, 4) }}
            </span>
          </div>
          <div class="address">
            <span class="active"></span>
            <span>
              {{ pItem.nftTokenMint.substr(0, 4) }}
              ...
              {{ pItem.nftTokenMint.substr(pItem.nftTokenMint.length - 4, 4) }}
            </span>
          </div>
          <svg class="icon" aria-hidden="true" @click="isShow = false">
            <use xlink:href="#icon-icon-on"></use>
          </svg>
        </div>
        <div v-if="!wallet.connected" class="my-positon">
          <div class="my-nft-text">Please connect a wallet</div>
          <!-- <svg class="icon" aria-hidden="true" @click="isShow = false">
            <use xlink:href="#icon-icon-on"></use>
          </svg> -->
        </div>
        <div v-if="wallet.connected && !pItem.nftTokenMint" class="my-positon">
          <div class="my-nft-text">No liquidity position</div>
          <!-- <svg class="icon" aria-hidden="true" @click="isShow = false">
            <use xlink:href="#icon-icon-on"></use>
          </svg> -->
        </div>
      </div>
    </transition>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import importIcon from '@/utils/import-icon'
export default Vue.extend({
  props: {
    btnType: {
      type: String,
      default: 'inrange'
    },
    pItem: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      isShow: false
    }
  },
  computed: {
    ...mapState(['wallet', 'liquidity']),
    random() {
      const result = ['first', 'second', 'third', 'fourth']
      return result[Math.floor(Math.random() * 4)]
    }
  },
  methods: {
    importIcon,
    mouseOver() {
      if (!this.isShow) {
        this.isShow = true
      }
    },
    mouseLeave() {
      if (this.isShow) {
        this.isShow = false
      }
    }
  }
})
</script>
<style lang="less" scoped>
.positon-item-container {
  position: relative;
  margin: 0 auto;
  // height: 600px;
  width: 250px;
  .positon-item-box {
    margin: 0 auto;
    width: 250px;
    border-radius: 180px;
    display: flex;
    justify-content: center;
    background: linear-gradient(180deg, rgba(36, 94, 95, 1), rgba(15, 113, 158, 1), rgba(37, 94, 93, 1));
    padding: 4px;
    position: relative;
    z-index: 5;
    transition: transform 1s;

    .positon-item {
      width: 250px;
      height: 100%;
      border-radius: 180px;
      // margin: 0 auto;
      position: relative;
      z-index: 5;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      background: linear-gradient(180deg, #101118 0%, #0f1116 82%, #004f80 100%);
      .circle {
        width: 212px;
        height: 212px;
        background: linear-gradient(180deg, #515866 0%, #34393f 100%);
        border-radius: 50%;
        margin: 15px;
        margin: 15px auto 0;
        display: flex;
        justify-content: center;
        padding: 15px;
        position: relative;
        z-index: 5;
        .circle-center {
          width: 100%;
          height: 100%;
          background: #22252b;
          border-radius: 50%;
          padding: 8px;
          .circle-center-pic {
            padding-top: 20px;
            width: 100%;
            height: 100%;
            background: url('../assets/images/border@2x.png');
            background-size: 100% 100%;
            border-radius: 50%;
            text-align: center;
            img {
              display: inline-block;
            }
            .coin-before,
            .coin-after {
              width: 40px;
              height: 40px;
            }
            .coin-after {
              margin-top: 38px;
              margin-left: -25px;
            }
            .symbol-name {
              font-size: 16px;
              font-family: Avenir-Heavy, Avenir;
              font-weight: 800;
              color: #fff;
              margin-top: 12px;
            }
          }
        }
        .add-liquidity {
          position: absolute;
          bottom: -18px;
          width: 120px;
          height: 32px;
          // background: #000000;
          box-shadow: 0px 4px 12px 0px rgba(26, 28, 31, 0.5);
          border-radius: 16px;
          background: linear-gradient(90deg, rgba(183, 98, 255, 1), rgba(93, 193, 221, 1));
          padding: 2px;
          &:hover {
            background: linear-gradient(233deg, #5fe6d0 0%, #596cff 38%, #9380ff 72%, #e590ff 100%);
            span {
              background: transparent;
            }
          }
          span {
            display: block;
            width: 100%;
            height: 28px;
            background: #000;
            border-radius: 14px;
            line-height: 28px;
            font-size: 14px;
            font-family: Arial-BoldMT, Arial;
            font-weight: normal;
            color: #fff;
          }
        }
      }
      .total-deposits,
      .volume-24h {
        width: 100%;
        text-align: center;
        .leabl {
          font-size: 14px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: rgba(#fff, 0.5);
        }
        .text {
          font-size: 16px;
          font-family: Avenir-Heavy, Avenir;
          font-weight: 800;
          color: #fff;
        }
      }
      .total-deposits {
        margin-top: 25px;
      }
      .volume-24h {
        margin-top: 20px;
        margin-bottom: 25px;
      }
    }
  }
  .my-positon-box {
    position: absolute;
    top: 0px;
    width: 250px;
    height: 394px;
    border-radius: 180px;
    padding: 2px;
    z-index: 1;
    transition: transform 1s;

    background: linear-gradient(180deg, rgba(51, 55, 63, 1), rgba(57, 57, 57, 1), rgba(151, 151, 151, 1));

    .my-positon {
      width: 100%;
      height: 100%;
      padding-top: 250px;
      border-radius: 180px;
      text-align: center;
      background: linear-gradient(180deg, #000 0%, #2d3036 100%);

      .my-nft-title {
        font-size: 14px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: rgba(#fff, 0.5);
      }
      .my-nft-text {
        margin-top: 45px;
        font-size: 18px;
        font-family: Avenir-Heavy, Avenir;
        font-weight: 800;
        color: #fff;
      }
      .address {
        max-width: 117px;
        height: 28px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 14px;
        backdrop-filter: blur(0px);
        margin: 10px auto;
        display: flex;
        align-items: center;
        padding: 0 8px;
        span {
          font-size: 14px;
          font-weight: 800;
          color: #fff;
        }
        .active {
          display: inline-block;
          width: 6px;
          height: 6px;
          background: rgba(#02ff4e, 0.6);
          border-radius: 50%;
          margin-right: 8px;
        }
      }
      .icon {
        width: 20px;
        height: 20px;
        fill: rgba(#02ff4e, 0.6);
      }
    }
  }
  .positon-item-box-first {
    background: linear-gradient(180deg, rgba(58, 122, 115, 1), rgba(0, 65, 58, 1), rgba(58, 122, 115, 1));
    .positon-item {
      background: linear-gradient(180deg, #101118 0%, #0f1116 82%, #00665f 100%);
    }
  }
  .positon-item-box-second {
    background: linear-gradient(180deg, rgba(72, 56, 177, 1), rgba(92, 22, 203, 1), rgba(102, 42, 134, 1));
    .positon-item {
      background: linear-gradient(180deg, #101118 0%, #191529 79%, #3f339f 100%);
    }
  }
  .positon-item-box-third {
    background: linear-gradient(180deg, rgba(36, 94, 95, 1), rgba(15, 113, 158, 1), rgba(37, 94, 93, 1));
    .positon-item {
      background: linear-gradient(180deg, #101118 0%, #0f1116 82%, #004f80 100%);
    }
  }
  .positon-item-box-fourth {
    background: linear-gradient(180deg, rgba(122, 103, 81, 1), rgba(158, 93, 15, 1), rgba(120, 103, 83, 1));
    .positon-item {
      background: linear-gradient(180deg, #101118 0%, #0f1116 82%, #662e00 100%);
    }
  }
  .slide-fade-enter-active,
  .slide-fade-leave-active {
    transition: opacity 1s;
  }
  .slide-fade-enter,
  .slide-fade-leave-to {
    opacity: 0;
  }
}
@media screen and (max-width: 750px) {
  .positon-item-container {
    height: 100%;
  }
}
</style>