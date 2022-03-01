<template>
  <div class="to-coin-box">
    <div class="to-coin" @click="selectCoin">
      <div
        v-lazy-container="{
          selector: 'img',
          error: '/images/icon_missing.png',
          loading: '/images/icon_missing.png'
        }"
        class="coin"
      >
        <img v-if="coinItem" :data-src="coinItem.logoURI" />
        <img v-else src="../assets/images/icon_missing.png" />
        <span>{{ (coinItem && coinItem.symbol) || 'Select' }}</span>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-icon-on"></use>
        </svg>
      </div>
      <div class="balance">Balance: {{ (balance && !balance.wei.isNaN() && balance.fixed()) || 0 }}</div>
    </div>
    <div v-if="Number(fromCoinAmount)" class="routes-box">
      <Skeleton :loading="routesIsLoading" active>
        <h3 class="title">{{ swapRoutes.length }} routes found</h3>
        <ul :class="['routes-list', showMore ? 'show-more' : '']">
          <li
            v-for="(item, index) in swapRoutes"
            :key="index"
            :class="['routes-item', index === currentIndex ? 'active' : '']"
            @click="toChangeRoute(item, index)"
          >
            <div class="routes-border">
              <div class="routes">
                <div v-if="index === 0" class="tag-box">
                  <div><span>Best price</span></div>
                </div>
                <h3>
                  {{ item.marketInfos[0].marketMeta.amm && item.marketInfos[0].marketMeta.amm.label }}
                  {{
                    item.marketInfos[1]
                      ? `x ${item.marketInfos[1].marketMeta.amm && item.marketInfos[1].marketMeta.amm.label}`
                      : ''
                  }}
                </h3>
                <p>
                  <span>{{ fromCoin.symbol }}</span>
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-arrow"></use>
                  </svg>
                  <span>{{
                    swap.tokensObj[item.marketInfos[0].outputMint.toString()] &&
                    swap.tokensObj[item.marketInfos[0].outputMint.toString()].symbol
                  }}</span>
                  <svg v-if="item.marketInfos[1]" class="icon" aria-hidden="true">
                    <use xlink:href="#icon-arrow"></use>
                  </svg>
                  <span v-if="item.marketInfos[1]">{{
                    swap.tokensObj[item.marketInfos[1].outputMint.toString()] &&
                    swap.tokensObj[item.marketInfos[1].outputMint.toString()].symbol
                  }}</span>
                </p>
              </div>
              <div class="price">
                {{ decimalFormat(item.outAmount / Math.pow(10, coinItem.decimals), coinItem.decimals) }}
                <!-- {{ item.outAmount }} -->
              </div>
            </div>
          </li>
        </ul>
      </Skeleton>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import importIcon from '@/utils/import-icon'
import { decimalFormat } from '@/utils'
import { Skeleton } from 'ant-design-vue'

export default Vue.extend({
  components: {
    Skeleton
  },
  props: {
    coinName: {
      type: String,
      default: ''
    },
    balance: {
      type: Object,
      default: null
    },
    coinItem: {
      type: Object,
      default: () => {
        return {}
      }
    },
    swapRoutes: {
      type: Array,
      default: () => {
        return []
      }
    },
    fromCoin: {
      type: Object,
      default: () => {
        return {}
      }
    },
    showMore: {
      type: Boolean,
      default: false
    },
    routesIsLoading: {
      type: Boolean,
      default: false
    },
    fromCoinAmount: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      currentIndex: 0
    }
  },
  computed: {
    ...mapState(['wallet', 'swap'])
  },
  methods: {
    decimalFormat,
    importIcon,
    selectCoin() {
      this.$emit('onSelect')
    },
    toChangeRoute(item: any, index: number) {
      this.currentIndex = index
      this.$emit('changeRoute', item)
    }
  }
})
</script>
<style lang="less" scoped>
.to-coin-box {
  width: 100%;
  background: #23262b;
  box-shadow: 0px 0px 2px 0px #535966, 0px 2px 3px 1px #1a1c1f;
  border-radius: 20px;
  padding: 8px;
  .to-coin {
    width: 100%;
    // height: 76px;
    height: 64px;
    background: linear-gradient(270deg, #3e434e 0%, #282a2f 100%);
    box-shadow: 0px 4px 12px 0px rgba(26, 28, 31, 0.5);
    border-radius: 12px;
    border: 1px solid #3f434e;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0px 12px;
    .coin {
      display: flex;
      align-items: center;
      img {
        width: 36px;
        height: 36px;
      }
      span {
        margin-left: 8px;
        font-size: 16px;
        color: #fff;
      }
      svg {
        width: 20px;
        height: 20px;
        fill: rgba(255, 255, 255, 0.5);
        margin-left: 4px;
      }
    }
    .balance {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.5);
    }
  }
  .routes-box {
    .title {
      width: 97px;
      height: 12px;
      font-size: 12px;
      font-family: Arial-BoldMT, Arial;
      font-weight: normal;
      color: #c88aff;
      line-height: 12px;
      background: linear-gradient(90deg, #ae85ff 0%, #94ffe4 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-top: 12px;
    }
    .routes-list {
      margin-bottom: 0px;
      max-height: 154px;
      // overflow-y: auto;
      overflow: hidden;
      .routes-item {
        width: 100%;
        height: 64px;
        padding: 1px;
        background: #3f434e;
        border-radius: 12px;
        margin-top: 12px;
        position: relative;
        &.active {
          padding: 2px;
          background: linear-gradient(233deg, rgba(135, 255, 243, 1), rgba(117, 125, 255, 1), rgba(214, 160, 254, 1));
        }
        > div {
          width: 100%;
          height: 100%;
          background: #23262b;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0px 8px;
          border-radius: 12px;
          .routes {
            .tag-box {
              // width: 80px;
              // height: 24px;
              padding: 2px;
              position: absolute;
              right: 12px;
              top: -12px;
              background: linear-gradient(
                233deg,
                rgba(135, 255, 243, 1),
                rgba(117, 125, 255, 1),
                rgba(214, 160, 254, 1)
              );
              border-radius: 7px;
              div {
                width: 76px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #23262b;
                border-radius: 7px;
                span {
                  font-size: 12px;
                  font-weight: normal;
                  color: #c88aff;
                  background: linear-gradient(90deg, #ae85ff 0%, #94ffe4 100%);
                  line-height: 12px;
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;
                }
              }
            }
            h3 {
              font-size: 16px;
              color: #fff;
              margin-bottom: 0px;
            }
            p {
              display: flex;
              align-items: center;
              padding-top: 4px;
              color: rgba(255, 255, 255, 0.5);
              margin-bottom: 0px;
              font-size: 12px;
              svg {
                width: 12px;
                height: 12px;
                fill: rgba(255, 255, 255, 0.5);
                margin: 0px 4px;
              }
            }
          }
          .price {
            font-size: 24px;
            color: #fff;
          }
        }
      }
      &.show-more {
        max-height: 268px;
        overflow-y: auto;
      }
    }
  }
}
</style>
