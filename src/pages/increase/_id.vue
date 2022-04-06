<template>
  <div class="increase-container">
    <div class="go-back-box">
      <svg class="icon" aria-hidden="true" @click="goBackDetail">
        <use xlink:href="#icon-icon-return"></use>
      </svg>
    </div>
    <h3 class="title">Increase Liquidity</h3>
    <div class="increase-body">
      <div class="top">
        <div class="coin-pair">
          <img v-if="poolInfo" :src="importIcon(`/coins/${poolInfo.coin.symbol.toLowerCase()}.png`)" alt="" />
          <img
            v-if="poolInfo"
            class="last"
            :src="importIcon(`/coins/${poolInfo.pc.symbol.toLowerCase()}.png`)"
            alt=""
          />
          <span v-if="poolInfo">{{ poolInfo.coin.symbol }} - {{ poolInfo.pc.symbol }}</span>
          <StatusBlock :current-status="currentData.currentStatus" />
        </div>
        <div class="right">
          <SetIcon></SetIcon>
        </div>
      </div>
      <div class="increase-content">
        <div class="left">
          <ul class="liquidity-info">
            <li v-if="poolInfo">
              <span>{{ poolInfo.coin.symbol }}</span>
              <span>{{ currentData.fromCoinAmount }}</span>
            </li>
            <li v-if="poolInfo">
              <span>{{ poolInfo.pc.symbol }}</span>
              <span>{{ currentData.toCoinAmount }}</span>
            </li>
            <li v-if="poolInfo">
              <span>Fee Tier</span>
              <span>{{ poolInfo.feeView }} %</span>
            </li>
          </ul>
          <div class="selected-range-title">
            <span>Selected Range</span>
            <CoinTab :list="coinTabList" :current="currentCoin" @onChange="changeDirection"></CoinTab>
          </div>
          <!-- <div class="price-rate">1 CRM ≈ 1.003 USDT</div> -->
          <div v-if="direction && poolInfo" class="price-rate">
            1 {{ poolInfo.coin.symbol }} ≈ {{ fixD(poolInfo.currentPriceView, poolInfo.pc.decimals) }}
            {{ poolInfo.pc.symbol }}
          </div>
          <div v-else-if="!direction && poolInfo" class="price-rate">
            1 {{ poolInfo.pc.symbol }} ≈ {{ fixD(poolInfo.currentPriceViewReverse, poolInfo.coin.decimals) }}
            {{ poolInfo.coin.symbol }}
          </div>
          <div v-if="currentData && poolInfo" class="price-range-box">
            <div class="price-box">
              <div class="price-item">
                <h3>Min Price</h3>
                <div v-if="direction">{{ decimalFormat(currentData.minPrice, 6) }}</div>
                <div v-else>{{ decimalFormat(1 / currentData.maxPrice, 6) }}</div>
                <p>
                  {{ direction ? poolInfo.pc.symbol : poolInfo.coin.symbol }} per
                  {{ direction ? poolInfo.coin.symbol : poolInfo.pc.symbol }}
                </p>
              </div>
              <div class="price-item">
                <h3>Max Price</h3>
                <div v-if="direction">
                  {{ currentData.maxPrice.indexOf('+') > 0 ? '∞' : decimalFormat(currentData.maxPrice, 6) }}
                </div>
                <div v-else>
                  {{ currentData.maxPrice.indexOf('+') > 0 ? '∞' : decimalFormat(1 / currentData.minPrice, 6) }}
                </div>
                <p>
                  {{ direction ? poolInfo.pc.symbol : poolInfo.coin.symbol }} per
                  {{ direction ? poolInfo.coin.symbol : poolInfo.pc.symbol }}
                </p>
              </div>
            </div>
            <div class="note-box">
              <p class="note-item">
                Your position will be 100% {{ direction ? poolInfo.coin.symbol : poolInfo.pc.symbol }} at this price
              </p>
              <p class="note-item">
                Your position will be 100% {{ direction ? poolInfo.pc.symbol : poolInfo.coin.symbol }} at this price
              </p>
            </div>
          </div>
        </div>
        <div class="right">
          <CoinBlock
            v-model="fromCoinAmount"
            :coin-name="fromCoin ? fromCoin.symbol : ''"
            :balance="fromCoin ? fromCoin.balance : null"
            :show-lock="showFromCoinLock"
            not-select
            @onInput="(amount) => (fromCoinAmount = amount)"
            @onFocus="
              () => {
                fixedFromCoin = true
              }
            "
            @onMax="maxBtnSelect('fromCoin')"
          ></CoinBlock>
          <div class="coin-block-gap"></div>
          <CoinBlock
            v-model="toCoinAmount"
            :coin-name="toCoin ? toCoin.symbol : ''"
            :balance="toCoin ? toCoin.balance : null"
            :show-lock="showToCoinLock"
            not-select
            @onInput="(amount) => (toCoinAmount = amount)"
            @onFocus="
              () => {
                fixedFromCoin = false
              }
            "
            @onMax="maxBtnSelect('toCoin')"
          ></CoinBlock>
          <Button
            class="add-more-liquidity"
            :disabled="isLoading || isDisabled || insufficientBalance"
            :loading="isLoading"
            @click="supply"
          >
            {{
              noEnterAmount ? 'Enter an amount' : insufficientBalance ? 'Insufficient balance' : 'Add More Liquidity'
            }}
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue } from 'nuxt-property-decorator'
import { mapState } from 'vuex'
import { Button, Icon } from 'ant-design-vue'
import importIcon from '@/utils/import-icon'
import { fixD, getUnixTs, decimalFormat, checkNullObj } from '@/utils'
import { TokenInfo, TOKENS, NATIVE_SOL, getTokenBySymbol } from '@/utils/tokens'
import { TokenAmount, gt } from '@/utils/safe-math'
import {
  tick2price,
  price2tick,
  deposit_src_calulate_dst,
  deposit_only_token_b,
  deposit_only_token_a
} from '@/tokenSwap/swapv3'
import { addLiquidityNew } from '@/utils/liquidity'
import { cloneDeep, get } from 'lodash-es'
import {
  getNearestTickByPrice,
  tick2Price,
  price2Tick,
  calculateLiquityOnlyA,
  calculateLiquityOnlyB,
  calculateLiquity,
  TokenSwap,
  calculateSlidTokenAmount
} from '@cremafinance/crema-sdk'
import { PublicKey } from '@solana/web3.js'
import Decimal from 'decimal.js'
import { inputRegex, escapeRegExp } from '@/utils/regex'
import { SWAPV3_PROGRAMID } from '@/utils/ids'

export default Vue.extend({
  components: {
    Button
  },
  data() {
    return {
      currentData: {} as any,
      direction: true,
      coinTabList: [] as any,
      currentCoin: '',
      fromCoin: {} as TokenInfo | null,
      toCoin: {} as TokenInfo | null,
      fromCoinAmount: '',
      toCoinAmount: '',
      fixedFromCoin: true,
      showFromCoinLock: false,
      showToCoinLock: false,
      deltaLiquity: 0,
      poolInfo: null as any,
      isLoading: false
    }
  },
  computed: {
    ...mapState({
      wallet: (state: any) => state.wallet,
      // position: (state: any) => state.position,
      liquidity: (state: any) => state.liquidity,
      url: (state: any) => state.url
    }),
    isDisabled(): boolean {
      const showFromCoinLock = this.showFromCoinLock
      const showToCoinLock = this.showToCoinLock

      const fromCoinAmount = this.$data.fromCoinAmount
      const toCoinAmount = this.$data.toCoinAmount

      if (showFromCoinLock && !showToCoinLock && toCoinAmount) {
        return false
      } else if (showToCoinLock && !showFromCoinLock && fromCoinAmount) {
        return false
      } else if (!showToCoinLock && !showFromCoinLock && toCoinAmount && fromCoinAmount) {
        return false
      }
      return true
    },
    insufficientBalance(): boolean {
      const fromCoinBalance =
        (this.$data.fromCoin && this.$data.fromCoin.balance && this.$data.fromCoin.balance.fixed()) || ''
      const toCoinBalance = (this.$data.toCoin && this.$data.toCoin.balance && this.$data.toCoin.balance.fixed()) || ''

      const fromCoinInsufficient = gt(this.$data.fromCoinAmount, fromCoinBalance)
      const toCoinInsufficient = gt(this.$data.toCoinAmount, toCoinBalance)

      const showFromCoinLock = this.showFromCoinLock
      const showToCoinLock = this.showToCoinLock

      if (showFromCoinLock && !showToCoinLock && !toCoinInsufficient) {
        return false
      } else if (showToCoinLock && !showFromCoinLock && !fromCoinInsufficient) {
        return false
      } else if (!showFromCoinLock && !showToCoinLock && !fromCoinInsufficient && !toCoinInsufficient) {
        return false
      }
      return true
    },
    noEnterAmount(): boolean {
      const fromCoinAmount = Number(this.fromCoinAmount)
      const toCoinAmount = Number(this.toCoinAmount)
      const showFromCoinLock = this.showFromCoinLock
      const showToCoinLock = this.showToCoinLock
      if (showFromCoinLock && !showToCoinLock && !toCoinAmount) {
        return true
      } else if (showToCoinLock && !showFromCoinLock && !fromCoinAmount) {
        return true
      } else if (!showFromCoinLock && !showToCoinLock && (!fromCoinAmount || !toCoinAmount)) {
        return true
      }

      return false
    }
  },
  watch: {
    'liquidity.myPositions': {
      handler: 'watchMyPosions',
      immediate: true
    },
    'liquidity.currentPositon': {
      handler: 'watchCurrentPositon',
      immediate: true
    },
    direction(newVal: boolean) {
      if (newVal) {
        this.currentCoin = this.coinTabList[0]
      } else {
        this.currentCoin = this.coinTabList[1]
      }
    },
    fromCoinAmount(newAmount: string, oldAmount: string) {
      this.$nextTick(() => {
        if (!inputRegex.test(escapeRegExp(newAmount))) {
          this.fromCoinAmount = oldAmount
        } else {
          if (!newAmount) {
            this.toCoinAmount = ''
          } else if (this.fixedFromCoin && this.poolInfo) {
            this.updateAmounts()
          }
        }
      })
    },

    toCoinAmount(newAmount: string, oldAmount: string) {
      this.$nextTick(() => {
        if (!inputRegex.test(escapeRegExp(newAmount))) {
          this.toCoinAmount = oldAmount
        } else {
          if (!this.fixedFromCoin && this.poolInfo) {
            this.updateAmounts()
          }
        }
      })
    }
  },
  methods: {
    fixD,
    decimalFormat,
    importIcon,
    // updateAmounts(price: string, tick_lower: number, tick_upper: number) {
    updateAmounts() {
      if (!this.fromCoinAmount && !this.toCoinAmount) return
      const tick_lower = this.currentData.lower_tick
      const tick_upper = this.currentData.upper_tick
      let coinAmount: any
      let direction: any
      if (this.fixedFromCoin) {
        coinAmount = new TokenAmount(fixD(this.fromCoinAmount, 2), this.fromCoin?.decimals, false).wei.toNumber()
        direction =
          this.fromCoin?.symbol === this.poolInfo.coin.symbol && this.toCoin?.symbol === this.poolInfo.pc.symbol ? 0 : 1
      } else {
        coinAmount = new TokenAmount(fixD(this.toCoinAmount, 2), this.toCoin?.decimals, false).wei.toNumber()
        direction =
          this.toCoin?.symbol === this.poolInfo.coin.symbol && this.toCoin?.symbol === this.poolInfo.pc.symbol ? 0 : 1
      }

      if (!this.showFromCoinLock && !this.showToCoinLock) {
        // const { dst, delta_liquity } = deposit_src_calulate_dst(
        //   tick_lower,
        //   tick_upper,
        //   coinAmount,
        //   this.poolInfo.current_price,
        //   direction
        // )
        const { desiredAmountDst, deltaLiquity } = calculateLiquity(
          tick_lower,
          tick_upper,
          new Decimal(coinAmount),
          new Decimal(Math.sqrt(this.poolInfo.currentPriceView)),
          direction
        )
        const dst = desiredAmountDst.toNumber()
        const delta_liquity = deltaLiquity.toNumber()

        const decimal = this.toCoin?.decimals || 6
        this.deltaLiquity = delta_liquity

        if (this.fixedFromCoin) {
          const toCoinAmount = fixD(Math.abs(dst) / Math.pow(10, decimal), decimal) || '0'
          this.toCoinAmount = toCoinAmount === '--' ? '' : toCoinAmount
        } else {
          const fromCoinAmount = fixD(Math.abs(dst) / Math.pow(10, decimal), decimal) || '0'
          this.fromCoinAmount = fromCoinAmount === '--' ? '' : fromCoinAmount
        }
      } else if (!this.showToCoinLock) {
        // 区间在当前价格的左侧时，也就是只有token b这一种资产, 返回liquity
        const coinAmount = new TokenAmount(fixD(this.toCoinAmount, 2), this.toCoin?.decimals, false).wei.toNumber()
        // const delta_liquity = deposit_only_token_b(tick_lower, tick_upper, coinAmount)
        const delta_liquity = calculateLiquityOnlyA(tick_lower, tick_upper, new Decimal(coinAmount))
        this.deltaLiquity = delta_liquity
      } else if (!this.showFromCoinLock) {
        // 区间在当前价格的右侧时，也就是只有token a这一种资产, 返回liquity
        const coinAmount = new TokenAmount(fixD(this.fromCoinAmount, 2), this.fromCoin?.decimals, false).wei.toNumber()
        // const delta_liquity = deposit_only_token_a(tick_lower, tick_upper, coinAmount)
        const delta_liquity = calculateLiquityOnlyB(tick_lower, tick_upper, new Decimal(coinAmount))
        this.deltaLiquity = delta_liquity
      }
    },
    inputChange(amount: any) {
      if (this.fixedFromCoin) {
        this.fromCoinAmount = amount
        this.updateAmounts()
      } else {
        this.toCoinAmount = amount
        this.updateAmounts()
      }
    },
    goBackDetail() {
      const id = this.$route.params.id
      this.$router.push(`/detail/${id}`)
    },
    watchMyPosions(myPosions: any) {
      const id = this.$route.params.id
      // if (this.liquidity.currentPositon && this.liquidity.currentPositon.id !== id) {
      this.$accessor.liquidity.setCurrentPositon({
        myPosions,
        id: this.$route.params.id
      })
      // }
    },
    watchCurrentPositon(currentPositon: any) {
      const id = this.$route.params.id
      if (currentPositon && currentPositon.id === id) {
        this.currentData = currentPositon
        if (!checkNullObj(currentPositon)) {
          const poolInfo = currentPositon.poolInfo
          this.poolInfo = poolInfo
          if (poolInfo.coin && poolInfo.pc) {
            this.coinTabList = [poolInfo.coin.symbol, poolInfo.pc.symbol]
            this.currentCoin = poolInfo.coin.symbol

            this.fromCoin = poolInfo.coin
            this.toCoin = poolInfo.pc

            this.updateCoinInfo(this.wallet.tokenAccounts)
            if (Number(currentPositon.fromCoinAmount)) {
              this.showFromCoinLock = false
            } else {
              this.showFromCoinLock = true
            }

            if (Number(currentPositon.toCoinAmount)) {
              this.showToCoinLock = false
            } else {
              this.showToCoinLock = true
            }
          }
        }
      }
    },
    changeDirection() {
      this.direction = !this.direction
    },
    maxBtnSelect(key: string) {
      if (key === 'fromCoin') {
        this.fixedFromCoin = true
        this.fromCoinAmount =
          this.fromCoin && this.fromCoin.balance
            ? this.fromCoin.symbol !== 'SOL'
              ? this.fromCoin.balance.fixed()
              : String(Number(this.fromCoin.balance.fixed()) - 0.05)
            : '0'
      } else {
        this.fixedFromCoin = false
        this.toCoinAmount = this.toCoin?.balance?.fixed() || ''
      }
    },
    // 增加balance
    updateCoinInfo(tokenAccounts: any) {
      if (this.fromCoin) {
        const fromCoin = tokenAccounts[this.fromCoin.mintAddress]

        if (fromCoin) {
          this.fromCoin = { ...this.fromCoin, ...fromCoin }
        }
      }

      if (this.toCoin) {
        const toCoin = tokenAccounts[this.toCoin.mintAddress]

        if (toCoin) {
          this.toCoin = { ...this.toCoin, ...toCoin }
        }
      }
    },
    async supply() {
      this.isLoading = true
      const conn = this.$web3
      const wallet = (this as any).$wallet

      const poolInfo = cloneDeep(this.poolInfo)
      const currentData = cloneDeep(this.currentData)

      // @ts-ignore
      const fromCoinAccount = get(this.wallet.tokenAccounts, `${poolInfo.coin.mintAddress}.tokenAccountAddress`)
      // @ts-ignore
      const toCoinAccount = get(this.wallet.tokenAccounts, `${poolInfo.pc.mintAddress}.tokenAccountAddress`)

      const processedFromCoinAccount =
        typeof fromCoinAccount === 'string' ? new PublicKey(fromCoinAccount) : fromCoinAccount
      const processedToCoinAccount = typeof fromCoinAccount === 'string' ? new PublicKey(toCoinAccount) : toCoinAccount

      const nftAccount = get(this.wallet.tokenAccounts, `${currentData.nft_token_id}.tokenAccountAddress`)

      const key = getUnixTs().toString()
      this.$notify.info({
        key,
        message: 'Making transaction...',
        description: '',
        duration: 0,
        icon: this.$createElement('img', { class: { 'notify-icon': true }, attrs: { src: '/tanhao@2x.png' } })
      })

      let fromCoinAmount: any
      if (this.fromCoinAmount) {
        fromCoinAmount = Number(this.fromCoinAmount) * (1 + Number(this.$accessor.slippage) / 100)
      }
      let toCoinAmount: any
      if (this.toCoinAmount) {
        toCoinAmount = Number(this.toCoinAmount) * (1 + Number(this.$accessor.slippage) / 100)
      }

      const swap = await new TokenSwap(
        this.$web3,
        new PublicKey(SWAPV3_PROGRAMID),
        // new PublicKey(LPFARMS[i].swapKey),
        this.poolInfo.tokenSwap,
        null
      ).load()

      const slidTokenAmountObj = calculateSlidTokenAmount(
        currentData.lower_tick,
        currentData.upper_tick,
        new Decimal(this.deltaLiquity),
        swap.tokenSwapInfo.currentSqrtPrice,
        new Decimal(Number(this.$accessor.slippage) / 100)
      )
      fromCoinAmount = fixD(slidTokenAmountObj.maxAmountA.toString(), 0)
      toCoinAmount = fixD(slidTokenAmountObj.maxAmountB.toString(), 0)

      addLiquidityNew(
        conn,
        wallet,
        poolInfo,
        poolInfo.coin,
        poolInfo.pc,
        processedFromCoinAccount,
        processedToCoinAccount,
        currentData.nft_token_id,
        nftAccount,
        currentData.lower_tick,
        currentData.upper_tick,
        fixD(String(this.deltaLiquity), 0),
        fromCoinAmount,
        toCoinAmount,
        1,
        this.fromCoin.balance.wei.toNumber(),
        this.toCoin.balance.wei.toNumber()
      )
        .then((txid) => {
          this.$notify.info({
            key,
            message: 'Transaction has been sent',
            icon: this.$createElement('img', { class: { 'notify-icon': true }, attrs: { src: '/tanhao@2x.png' } }),
            description: (h: any) =>
              h('div', [
                'Confirmation is in progress.  Check your transaction on ',
                h('a', { attrs: { href: `${this.url.explorer}/tx/${txid}`, target: '_blank' } }, 'here')
              ])
          })

          const description = `Add liquidity  ${this.fromCoinAmount} ${poolInfo.coin?.symbol} and ${this.toCoinAmount} ${poolInfo.pc?.symbol} to the pool`

          this.$accessor.transaction.sub({ txid, description, type: 'Add liquidity' })
          // this.$accessor.transaction.sub({ txid: 'txid问题？', description: '难道是这个问题吗' })
          this.$accessor.transaction.setShowSubmitted(true)
          setTimeout(() => {
            this.$accessor.liquidity.requestInfos()
          }, 2000)
        })
        .catch((error) => {
          console.log('error#####', error)
          this.$notify.error({
            key,
            message: 'Add liquidity failed',
            description: error.message,
            class: 'error',
            icon: this.$createElement('img', { class: { 'notify-icon': true }, attrs: { src: '/icon_Error@2x.png' } })
          })
        })
        .finally(() => {
          this.fromCoinAmount = ''
          this.toCoinAmount = ''
          this.isLoading = false
        })
    }
  }
})
</script>
<style lang="less" scoped>
@import '../../styles/base.less';
.increase-container {
  width: 996px;
  margin: 0 auto;
  .go-back-box {
    .icon {
      width: 20px;
      height: 20px;
      fill: #fff;
      &:hover {
        fill: #07ebad;
      }
    }
  }
  > .title {
    font-size: 20px;
    font-weight: 600;
    color: #fff;
  }
  .increase-body {
    width: 100%;
    min-height: 449px;
    background: linear-gradient(214deg, #3e434e 0%, #23262b 100%);
    border-radius: 20px;
    border: 1px solid #565c6a;
    padding: 20px;
    .top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .coin-pair {
        display: flex;
        align-items: center;
        img {
          width: 36px;
          height: 36px;
          border-radius: 100%;
          &.last {
            margin-left: -10px;
          }
        }
        span {
          font-size: 16px;
          color: #fff;
          margin-left: 8px;
          margin-right: 8px;
        }
      }
    }
    .increase-content {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
      .left,
      .right {
        width: 458px;
      }
      .left {
        .liquidity-info {
          width: 456px;
          height: 100px;
          box-shadow: 0px 4px 12px 0px #25282c;
          border-radius: 10px;
          border: 1px solid #3f434e;
          padding: 12px 20px;
          margin-bottom: 0px;
          li {
            display: flex;
            align-items: center;
            justify-content: space-between;
            color: #fff;
            font-size: 14px;
            margin-top: 6px;
            &:first-child {
              margin-top: 0px;
            }
          }
        }
        .selected-range-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 24px;
          > span {
            font-size: 16px;
          }
        }
        .price-rate {
          text-align: right;
          font-size: 16px;
          font-family: Arial-BoldMT, Arial;
          font-weight: normal;
          color: #fff;
          line-height: 16px;
          background: linear-gradient(233deg, #4bb5ff 0%, #ce90ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-top: 14px;
        }
        .price-range-box {
          width: 456px;
          height: 144px;
          box-shadow: 0px 4px 12px 0px #25282c;
          border-radius: 10px;
          border: 1px solid #3f434e;
          padding: 0px 20px;
          margin-top: 12px;
          .price-box {
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            align-items: center;
            padding-top: 14px;
            padding-bottom: 8px;
            justify-content: space-between;
            .price-item {
              width: 180px;
              text-align: center;
              h3 {
                font-size: 12px;
                color: rgba(#fff, 0.5);
                margin-bottom: 0px;
              }
              div {
                font-size: 14px;
                color: #fff;
                padding: 6px 0px;
              }
              p {
                font-size: 12px;
                color: rgba(#fff, 0.5);
                margin-bottom: 0px;
              }
            }
          }
          .note-box {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-top: 8px;
            .note-item {
              width: 180px;
              font-size: 12px;
              color: #b5b8c2;
              margin-bottom: 0px;
            }
          }
        }
      }
      .right {
        .coin-block-gap {
          width: 100%;
          height: 36px;
        }
        .add-more-liquidity {
          font-weight: bold;
          color: #fff;
          font-size: 20px;
          .gradient-btn-large();
          margin-top: 40px;
        }
      }
    }
  }
}
@media screen and (max-width: 750px) {
  .increase-container {
    width: 100%;
    .increase-body {
      padding: 20px 10px;
      .increase-content {
        display: block;
        .left {
          width: 100%;
          .liquidity-info {
            width: 100%;
          }
          .price-range-box {
            width: 100%;
            height: auto;
            .note-item {
              text-align: center;
            }
          }
        }
        .right {
          width: 100%;
          margin-top: 30px;
        }
      }
    }
  }
}
</style>
