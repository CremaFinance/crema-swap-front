<template>
  <div class="position-block" @click="gotoDetail(pItem)">
    <div class="left">
      <div class="pos-info">
        <div class="icon-box">
          <img :src="importIcon(`/coins/${pItem.coin.symbol.toLowerCase()}.png`)" />
          <img :src="importIcon(`/coins/${pItem.pc.symbol.toLowerCase()}.png`)" />
        </div>
        <div class="name">{{ pItem.name }}</div>
        <!-- <div class="fee">0.3%</div> -->
      </div>
      <div class="min-and-max">
        <p>
          <span>Min:</span>
          {{ pItem.minPrice }}
        </p>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-icon-link"></use>
        </svg>
        <p>
          <span>Max:</span>
          {{ pItem.maxPrice }}
        </p>
      </div>
    </div>
    <div class="right">
      <!-- <button v-if="!pItem.liquity">Closed</button> -->
      <StatusBlock :current-status="getCurrentStatus(pItem)" />
      <!-- <button
        v-else-if="
          Number(pItem.currentPrice) >= Number(pItem.minPrice) && Number(pItem.currentPrice) <= Number(pItem.maxPrice)
        "
      >
        <i class="circle"></i>
        <span>Active</span>
        <div class="active-tooltip">The price of this pool is currently within your position price range.</div>
      </button>
      <button v-else>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-icon-tips"></use>
        </svg>
        <span>InActive</span>
        <div class="active-tooltip">The price of this pool is currently out of your position price range.</div>
      </button> -->
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
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
  watch: {
    pItem: {
      handler: 'pItemWatch',
      immediate: true
    }
  },
  methods: {
    importIcon,
    pItemWatch(value: any) {
      console.log('pItemWatch####value####', value)
    },
    gotoDetail(item: any) {
      console.log('到这里了吗####item###', item)
      this.$router.push(`/detail/${item.nftTokenId}`)
    },
    getCurrentStatus(pItem: any) {
      console.log('pItem.currentPrice####', pItem.currentPrice)
      console.log('pItem.minPrice####', pItem.minPrice)
      console.log('pItem.maxPrice####', pItem.maxPrice)
      console.log('pItem.minPrice####number###', Number(pItem.minPrice))
      console.log('pItem.maxPrice####number####', Number(pItem.maxPrice))
      if (!pItem.liquity) {
        return 'Closed'
      } else if (
        (Number(pItem.currentPrice) >= Number(pItem.minPrice) &&
          Number(pItem.currentPrice) <= Number(pItem.maxPrice)) ||
        (!Number(pItem.minPrice) && isNaN(Number(pItem.maxPrice)))
      ) {
        return 'Active'
      } else {
        return 'InActive'
      }
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
  // height: 104px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 30px;
  padding: 23px 20px;
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
      position: relative;
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
      .active-tooltip {
        width: 356px;
        box-sizing: content-box;
        padding: 10px 20px;
        background: #1a1e21;
        border-radius: 10px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        position: absolute;
        left: -370px;
        display: none;
      }
      &:hover {
        background: rgba(255, 255, 255, 0.2);
        .active-tooltip {
          display: block;
        }
      }
    }
  }
}
@media screen and (max-width: 750px) {
  .position-block {
    padding: 14px 14px 20px;
    > .left {
      .pos-info {
        .icon-box {
          img {
            width: 20px;
            height: 20px;
          }
          .name {
            font-size: 12px;
          }
        }
      }
      .min-and-max {
        display: block;
        text-align: center;
        svg {
          margin: 10px 0;
          transform: rotate(90deg);
        }
      }
    }
  }
}
</style>
