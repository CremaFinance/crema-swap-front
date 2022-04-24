<template>
  <div class="position-block" @click="gotoDetail(pItem)">
    <div class="left">
      <div class="pos-info">
        <div class="icon-box">
          <img :src="importIcon(`/coins/${pItem.token_a.symbol.toLowerCase()}.png`)" />
          <img :src="importIcon(`/coins/${pItem.token_b.symbol.toLowerCase()}.png`)" />
          <div class="name">{{ pItem.name }}</div>
        </div>
        <div class="fee">{{ pItem.feeView }}%</div>
        <div v-if="pItem.nftTokenMint" class="nft-address" @click.stop="">
          <a :href="`https://solscan.io/account/${pItem.nftTokenAccount}`" target="_blank">
            {{ pItem.nftTokenMint.substr(0, 4) }}
            ...
            {{ pItem.nftTokenMint.substr(pItem.nftTokenMint.length - 4, 4) }}
          </a>
          <svg class="icon" aria-hidden="true" @click.stop="$accessor.copy(pItem.nftTokenMint)">
            <use xlink:href="#icon-icon_copy"></use>
          </svg>
        </div>
        <div class="h5-right right">
          <StatusBlock :current-status="getCurrentStatus(pItem)" />
        </div>
      </div>

      <div class="min-and-max">
        <p>
          <span>Min:</span>
          {{ decimalFormat(pItem.minPrice, 6) }}
        </p>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-icon-link"></use>
        </svg>
        <p>
          <span>Max:</span>
          {{ pItem.maxPrice.indexOf('+') > 0 ? '∞' : decimalFormat(pItem.maxPrice, 6) }}
        </p>
      </div>
    </div>
    <div class="pc-right right">
      <StatusBlock :current-status="getCurrentStatus(pItem)" @click.stop="" />
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import importIcon from '@/utils/import-icon'
import { decimalFormat } from '@/utils'

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
  computed: {
    ...mapState({
      liquidity: (state: any) => state.liquidity
    })
  },
  watch: {
    pItem: {
      handler: 'pItemWatch',
      immediate: true
    }
  },
  methods: {
    importIcon,
    decimalFormat,
    pItemWatch(value: any) {
      console.log('positionBlock###pItemWatch####value####', value)
    },
    gotoDetail(item: any) {
      this.$accessor.liquidity.setCurrentPositon(null)
      this.$router.push(`/detail/${item.nftTokenId}`)
    },
    getCurrentStatus(pItem: any) {
      if (!pItem.liquity || pItem.liquity.toString() == '0') {
        return 'Closed'
      } else if (
        (Number(pItem.currentPriceView) >= Number(pItem.minPrice) &&
          Number(pItem.currentPriceView) <= Number(pItem.maxPrice)) ||
        (!Number(pItem.minPrice) && isNaN(Number(pItem.maxPrice)))
      ) {
        return 'Active'
      } else {
        return 'Inactive'
      }
    }
  }
})
</script>
<style lang="less" scoped>
.pc-right {
  display: block;
}
.h5-right {
  display: none;
}
.position-block {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 110px;
  background: linear-gradient(214deg, #3e434e 0%, #23262b 100%);
  border-radius: 20px;
  border: 1px solid #565c6a;
  padding: 20px;
  padding-right: 40px;
  cursor: pointer;
  margin-top: 20px;
  &:hover {
    background: #393e48;
  }
  // filter: blur(50px);
  > .left {
    .pos-info {
      display: flex;
      align-items: center;
      .icon-box {
        display: flex;
        align-items: center;
        img {
          width: 30px;
          height: 30px;
          border-radius: 100%;
          & + img {
            margin-left: -4px;
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
      .nft-address {
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0px 12px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        margin-left: 10px;
        cursor: pointer;
        // backdrop-filter: blur(0px);
        svg {
          width: 14px;
          height: 14px;
          fill: rgba(255, 255, 255, 0.5);
          margin-left: 8px;
        }
        a {
          font-size: 14px;
          color: #fff;
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
    .min-and-max {
      display: flex;
      align-items: center;
      margin-top: 12px;
      p {
        font-size: 12px;
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
  .pc-right {
    display: none;
  }
  .h5-right {
    display: flex;
    margin-top: 10px;
    // margin-top: 20px;
    // justify-content: flex-end;
  }
  .position-block {
    padding: 14px;
    height: 100%;
    > .left {
      width: 100%;
      .pos-info {
        width: 100%;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        .icon-box {
          img {
            width: 20px;
            height: 20px;
          }
          .name {
            font-size: 12px;
          }
        }
        .nft-address {
          margin-top: 10px;
        }
      }
      .min-and-max {
        display: block;
        text-align: center;
        p {
          font-size: 14px;
        }
        svg {
          transform: rotate(90deg);
          margin: 20px 0;
        }
      }
    }
  }
}
</style>
