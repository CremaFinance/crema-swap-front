<template>
  <div class="positon-list-box">
    <div class="positon-list-content">
      <div
        v-if="list && list.length > 0"
        class="positon-list"
        :class="list && list.length < 3 ? 'positon-list-flex' : ''"
      >
        <!-- @mouseover="mouseOver(index)"
          @mouseleave="mouseLeave(index)" -->
        <div v-for="(pItem, index) in list" :key="index" class="positon-item-container">
          <div class="positon-item-box">
            <div class="positon-item">
              <div class="positon-box"></div>
              <div class="circle">
                <div class="circle-center">
                  <div class="circle-center-pic"></div>
                  <!-- <svg class="circle-center-pic" aria-hidden="true">
                    <use xlink:href="#icon-pop"></use>
                  </svg> -->
                  <div class="coin-box">
                    <div class="coin-before-box">
                      <img class="coin-before" :src="importIcon(`/coins/${pItem.tokenA.toLowerCase()}.png`)" />
                    </div>
                    <div class="coin-after-box">
                      <img class="coin-after" :src="importIcon(`/coins/${pItem.tokenB.toLowerCase()}.png`)" />
                    </div>
                  </div>
                  <div class="symbol-name">{{ pItem.tokenA }} - {{ pItem.tokenB }}</div>
                </div>
                <Button class="add-liquidity" @click="gotoPool(pItem)">
                  <span>Add Liquidity</span>
                </Button>
              </div>
              <div class="total-deposits">
                <div class="leabl">Total Deposits</div>
                <div class="text">${{ pItem && pItem.tvl_in_usd && thousands(pItem.tvl_in_usd) }}</div>
              </div>
              <div class="volume-24h">
                <div class="leabl">Volume (24H)</div>
                <div class="text">${{ pItem && pItem.vol_in_usd_24h && thousands(pItem.vol_in_usd_24h) }}</div>
              </div>
            </div>
          </div>

          <transition name="slide-fade" appear>
            <div class="my-positon-box">
              <div v-if="wallet.connected && pItem.nftTokenMint" class="my-positon">
                <!-- <div class="my-nft-title">My NFT</div> -->
                <!-- <div class="address">
                  <span class="active"></span>
                  <span>
                    {{ myPosition[pItem.name].nftTokenMint.substr(0, 4) }}
                    ...
                    {{ myPosition[pItem.name].nftTokenMint.substr(myPosition[pItem.name].nftTokenMint.length - 4, 4) }}
                  </span>
                </div> -->
                <div class="address" @click="gotoDetail(pItem)">
                  <span class="active"></span>
                  <span class="active-text">Position</span>
                  <span>
                    {{ pItem.nftTokenMint.substr(0, 4) }}
                    ...
                    {{ pItem.nftTokenMint.substr(pItem.nftTokenMint.length - 4, 4) }}
                  </span>
                </div>
                <svg class="icon" aria-hidden="true" @click="toPosition">
                  <use xlink:href="#icon-icon-on"></use>
                </svg>
              </div>
              <div v-if="!wallet.connected" class="my-positon">
                <div class="my-nft-text">Please connect a wallet</div>
                <svg class="icon" aria-hidden="true" @click="toPosition">
                  <use xlink:href="#icon-icon-on"></use>
                </svg>
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
      </div>
      <div v-else class="no-data">
        <img src="../assets/images/icon_NoDate@2x.png" />
        <p>No liquidity pools</p>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import importIcon from '@/utils/import-icon'
import { checkNullObj, fixD, decimalFormat } from '@/utils'
import mixin from '@/mixin/position'
import BigNumber from 'bignumber.js'
import { RATES } from '@/utils/tokens'
import { getprice } from '@/utils/stake'

import { lamportPrice2uiPrice, tick2Price, calculateTokenAmount, tick2UiPrice } from 'test-crema-sdk'
export default Vue.extend({
  mixins: [mixin],
  props: {
    selectCoin: {
      type: String,
      default: 'All'
    },
    inputValue: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isShow: false,
      openIndex: null,
      list: [],
      myPosition: {},
      statisticsInfo: {}
    }
  },
  computed: {
    ...mapState(['wallet', 'liquidity']),
    walletConnectedAndHavePoolsObj(): boolean {
      if (this.liquidity.poolsObj && this.wallet.connected && !checkNullObj(this.wallet.tokenAccounts)) {
        return true
      }
      return false
    }
  },
  watch: {
    'liquidity.myPositions': {
      handler: 'watchMyPositions',
      immediate: true
    },
    'wallet.connected'(newVal) {
      // if (!newVal) {
      //   this.list = []
      // }
    },
    walletConnectedAndHavePoolsObj: {
      handler: 'walletConnectedAndHavePoolsObjWatch',
      immediate: true
    },
    'liquidity.myPositionObj': {
      handler: 'watchMyPositionObj',
      immediate: true
    },
    'liquidity.statisticsInfo': {
      handler: 'watchStatisticsInfo',
      immediate: true
    },
    selectCoin: {
      handler: 'watchSelectCoin',
      immediate: true
    },
    inputValue: {
      handler: 'watchInputValue',
      immediate: true
    }
  },
  methods: {
    importIcon,
    gotoPool(pItem) {
      if (this.wallet.connected) {
        this.$router.push(`/deposit?from=${pItem.tokenA}&to=${pItem.tokenB}`)
      } else {
        this.$accessor.wallet.openModal()
      }
    },
    watchMyPositionObj(myPositionObj: any) {
      this.myPosition = myPositionObj
      this.watchSelectCoin(this.selectCoin)
    },
    walletConnectedAndHavePoolsObjWatch(newVal) {
      if (newVal) {
        this.$accessor.liquidity.getMyPositionsNew(this.wallet.tokenAccounts)
      }
    },
    gotoDetail(item: any) {
      this.$accessor.liquidity.setCurrentPositon(null)
      this.$router.push(`/detail/${item.nftTokenId}`)
    },
    watchStatisticsInfo(info) {
      this.statisticsInfo = info
      this.watchSelectCoin(this.selectCoin)
    },
    watchSelectCoin(coin) {
      if (this.statisticsInfo && this.statisticsInfo.pools && this.statisticsInfo.pools.length > 0) {
        let result = this.statisticsInfo.pools || []
        console.log(result, 'result##')
        if (coin !== 'All') {
          result = result.filter((ele) => ele && ele.name.includes(coin))
        }
        let tepList: any = []
        result.forEach((ele) => {
          console.log(ele, 'ele##')
          // const amount_usd = this.myPosition[ele.name] ? this.calculate(this.myPosition[ele.name]) : ''
          tepList.push({
            tokenA: ele.name.split('-')[0],
            tokenB: ele.name.split('-')[1],
            name: ele.name,
            tvl_in_usd: fixD(ele.tvl_in_usd, 2),
            vol_in_usd_24h: fixD(ele.vol_in_usd_24h, 2),
            ...this.myPosition[ele.name]
            // amount_usd,
          })
        })
        // console.log(JSON.stringify(tepList), 'tepList##')
        // this.list = tepList.sort((a, b) => {
        //   return a.tvl_in_usd - b.tvl_in_usd
        // })
        console.log(tepList, 'tepList##')
        this.list = tepList
      }
    },
    watchInputValue(value) {
      if (value) {
        const result = this.list.filter((ele) => ele && ele.name.toLowerCase().includes(value.toLowerCase()))
        this.list = result
      } else {
        this.watchSelectCoin(this.selectCoin)
      }
    },
    toPosition() {
      if (this.wallet.connected) {
        this.$router.push('/position')
      } else {
        this.$accessor.wallet.openModal()
      }
    },
    calculate(currentData) {
      const { amountA, amountB } = calculateTokenAmount(
        currentData.lowerTick,
        currentData.upperTick,
        currentData.liquity,
        // swap.tokenSwapInfo.currentSqrtPrice
        currentData.currentSqrtPrice
      )
      const fromCoinAmount = fixD(amountA.div(Math.pow(10, currentData.token_a.decimal)), currentData.token_a.decimal)
      const toCoinAmount = fixD(amountB.div(Math.pow(10, currentData.token_b.decimal)), currentData.token_b.decimal)

      // amountUSD计算
      const fromCoinAmountBig = new BigNumber(fromCoinAmount)
      const toCoinAmountBig = new BigNumber(toCoinAmount)
      const currentPrice = currentData.currentPriceView

      const fromNum = fromCoinAmountBig.multipliedBy(currentPrice)
      const toNum = toCoinAmountBig.plus(fromNum)

      let pcSymbolRate = RATES[currentData.token_b.symbol] || 1

      const price = getprice(currentData.token_b.symbol.toLowerCase()).then((data) => {})
      pcSymbolRate = price

      if (currentData.token_b.symbol.toUpperCase() === 'CUSDC') {
        pcSymbolRate = RATES[currentData.token_b.symbol]
      }

      const amountUSDBig = toNum.multipliedBy(pcSymbolRate)

      const amountUSD = decimalFormat(amountUSDBig.toFixed(), 4)

      let fromPercent: any = fromNum.toNumber()
        ? fromNum.dividedBy(amountUSDBig.multipliedBy(pcSymbolRate)).multipliedBy(100)
        : new BigNumber(0)
      let toPercent: any = toCoinAmountBig.toNumber()
        ? toCoinAmountBig.dividedBy(amountUSDBig.multipliedBy(pcSymbolRate)).multipliedBy(100)
        : new BigNumber(0)

      fromPercent = Math.round(fromPercent.toNumber())
      toPercent = Math.round(toPercent.toNumber())
      return amountUSD
    },
    cardsSortRule(pre, next) {
      if (pre.nftTokenMint && next.nftTokenMint) {
        return pre.amount_usd - next.amount_usd
      } else if (!pre.nftTokenMint && !next.nftTokenMint) {
        return pre.tvl_in_usd - next.tvl_in_usd
      }
    },
    // 添加计位符
    thousands(num: any) {
      if (Math.floor(num) === num) {
        const numStr = (num || 0).toString()
        return numStr.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
      } else {
        const str = num.toString()
        const reg = str.includes('.') > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g
        return str.replace(reg, '$1,')
      }
    }
    // mouseOver(index) {
    //   if (this.openIndex !== index) {
    //     this.openIndex = index
    //   } else {
    //     this.openIndex = null
    //   }
    // },
    // mouseLeave() {
    //   if (this.openIndex) {
    //     this.openIndex = null
    //   }
    // }
  }
})
</script>
<style lang="less" scoped>
.positon-list-box {
  width: 1110px;
  position: relative;
  margin: 0 auto;
  .positon-list-content {
    width: 100%;
    height: 100%;
    margin: 30px 0 auto;
    position: relative;

    .no-data {
      width: 100%;
      min-height: 260px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      img {
        width: 100px;
        height: 100px;
      }
      p {
        color: rgba(255, 255, 255, 0.8);
        padding-top: 10px;
      }
    }
    .positon-list {
      width: 1100px;
      margin: 0px auto 0;
      transition: transform 1s;
      display: flex;
      flex-flow: row wrap;
      .positon-item-container {
        position: relative;
        width: 260px;
        margin: 0px 0 20px 20px;
        // display: inline-block;
        // & + .positon-item-container {
        //   margin: 20px 0px 0 20px;
        // }
        &:hover {
          .positon-item-box {
            transform: translateY(-80px);
          }
        }
        .positon-item-box {
          margin: 0 auto;
          width: 260px;
          border-radius: 180px;
          display: flex;
          justify-content: center;
          background: linear-gradient(180deg, rgba(36, 94, 95, 1), rgba(15, 113, 158, 1), rgba(37, 94, 93, 1));
          padding: 4px;
          position: relative;
          z-index: 5;
          transition: transform 1s;
          .positon-item {
            width: 260px;
            height: 100%;
            border-radius: 180px;
            position: relative;
            z-index: 5;
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            background: linear-gradient(180deg, #101118 0%, #0f1116 82%, #004f80 100%);
            .circle {
              width: 222px;
              height: 222px;
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
                position: relative;
                text-align: center;
                padding-top: 20px;
                .circle-center-pic {
                  width: calc(100% - 8px);
                  height: calc(100% - 8px);
                  background: url('../assets/images/pop.png');
                  background-size: 100% 100%;
                  border-radius: 50%;
                  text-align: center;
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                }
                .coin-box {
                  display: flex;
                  justify-content: center;
                  margin-top: 25px;
                  .coin-after-box {
                    width: 42px;
                    height: 42px;
                    margin-top: 20px;
                    margin-left: -25px;
                    background: #1e2126;
                    border-radius: 50%;
                    padding: 2px;
                  }
                }
                img {
                  display: inline-block;
                }
                .coin-before,
                .coin-after {
                  width: 40px;
                  height: 40px;
                }
                // .coin-after {
                //   margin-top: 38px;
                //   margin-left: -25px;
                // }
                .symbol-name {
                  font-size: 16px;
                  font-family: Avenir-Heavy, Avenir;
                  font-weight: 800;
                  color: #fff;
                  margin-top: 12px;
                }
              }
              .add-liquidity {
                position: absolute;
                bottom: -16px;
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
                font-size: 12px;
                // font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 400;
                color: rgba(#fff, 0.5);
              }
              .text {
                font-size: 14px;
                font-weight: 600;
                color: #fff;
              }
            }
            .total-deposits {
              margin-top: 30px;
            }
            .volume-24h {
              margin-top: 15px;
              margin-bottom: 25px;
            }
          }
        }
        .my-positon-box {
          position: absolute;
          top: 0px;
          width: 260px;
          height: 390px;
          border-radius: 180px;
          padding: 2px;
          // z-index: 20;
          z-index: 1;
          transition: transform 1s;
          background: linear-gradient(180deg, rgba(51, 55, 63, 1), rgba(57, 57, 57, 1), #515765);

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
              margin-top: 40px;
              color: rgba(#fff, 0.5);
            }
            .my-nft-text {
              margin-top: 70px;
              font-size: 14px;
              font-family: Avenir-Heavy, Avenir;
              font-weight: 800;
              color: #fff;
            }
            .address {
              max-width: 175px;
              width: 100%;
              height: 28px;
              background: rgba(255, 255, 255, 0.1);
              border-radius: 14px;
              backdrop-filter: blur(0px);
              margin: 75px auto 0;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 0 8px;
              cursor: pointer;
              span {
                font-size: 12px;
                font-weight: 800;
                color: #fff;
                white-space: nowrap;
              }
              .active {
                display: inline-block;
                width: 6px;
                height: 6px;
                background: rgba(#02ff4e, 0.6);
                border-radius: 50%;
                margin-right: 8px;
              }
              .active-text {
                margin-right: 4px;
                font-size: 14px;
                font-weight: 800;
                color: rgba(#fff, 0.5);
              }
            }
            .icon {
              width: 20px;
              height: 20px;
              fill: rgba(#02ff4e, 0.6);
              cursor: pointer;
            }
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
      .positon-item-container:nth-child(6n + 1) {
        .positon-item-box {
          background: linear-gradient(180deg, rgba(58, 122, 115, 1), rgba(0, 65, 58, 1), rgba(58, 122, 115, 1));
          .positon-item {
            background: linear-gradient(180deg, #101118 0%, #0f1116 82%, #00665f 100%);
          }
        }
      }
      .positon-item-container:nth-child(6n + 3) {
        .positon-item-box {
          background: linear-gradient(180deg, rgba(72, 56, 177, 1), rgba(92, 22, 203, 1), #494891);
          .positon-item {
            background: linear-gradient(180deg, #101118 0%, #191529 79%, #3f339f 100%);
          }
        }
      }
      .positon-item-container:nth-child(6n + 2) {
        .positon-item-box {
          background: linear-gradient(180deg, rgba(36, 94, 95, 1), rgba(15, 113, 158, 1), rgba(37, 94, 93, 1));
          .positon-item {
            background: linear-gradient(180deg, #101118 0%, #0f1116 82%, #004f80 100%);
          }
        }
      }
      .positon-item-container:nth-child(6n + 5) {
        .positon-item-box {
          background: linear-gradient(180deg, rgba(122, 103, 81, 1), rgba(158, 93, 15, 1), rgba(120, 103, 83, 1));
          .positon-item {
            background: linear-gradient(180deg, #101118 0%, #0f1116 82%, #662e00 100%);
          }
        }
      }
      .positon-item-container:nth-child(6n + 6) {
        .positon-item-box {
          background: linear-gradient(180deg, #7d7540, #59521e, #796e36);
          .positon-item {
            background: linear-gradient(180deg, #101118 0%, #14160f 82%, #665900 100%);
          }
        }
      }
      .positon-item-container:nth-child(6n + 4) {
        .positon-item-box {
          background: linear-gradient(180deg, rgba(128, 31, 118, 1), rgba(121, 17, 164, 1), rgba(104, 17, 100, 1));
          .positon-item {
            background: linear-gradient(180deg, #101118 0%, #271529 79%, #540d3f 100%);
          }
        }
      }
      .positon-item-container:nth-child(4n + 1) {
        margin-left: 0;
      }
    }
    .positon-list-flex {
      display: flex;
      justify-content: center;
    }
  }
}

@media screen and (max-width: 750px) {
  .positon-list-box {
    width: 100%;
    .left-btn,
    .right-btn {
      display: none;
    }
    .positon-list-content {
      width: 100%;
    }
  }
  .positon-list {
    display: flex !important;
    width: 100% !important;
    height: 100%;
    justify-content: center;
    margin: auto;
    padding: 0;
    padding-bottom: 94px;
    .positon-item-container {
      margin: 20px auto;
    }
  }
  .positon-item-container {
    height: 100%;
    display: block;
    margin: 30px auto;
  }
}
</style>