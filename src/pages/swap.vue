<template>
  <div>
    <SwapTab></SwapTab>
    <div class="container swap-container">
      <div class="c-title">
        <span>Swap</span>
        <div class="buttons">
          <RefreshIcon :loading="loading" @refresh="refresh"></RefreshIcon>
          <div class="icon-box">
            <svg class="icon" aria-hidden="true" @click="showAddress = true">
              <use xlink:href="#icon-a-bianzu181"></use>
            </svg>
          </div>
          <!-- </Tooltip> -->
          <div style="width: 8px"></div>
          <SetIcon></SetIcon>
        </div>
      </div>
      <div class="form-block">
        <CoinBlock
          v-model="fromCoinAmount"
          :coin-name="fromCoin ? fromCoin.symbol : null"
          :balance="fromCoin ? fromCoin.balance : null"
          :coin-icon="fromCoin ? fromCoin.icon : ''"
          :swap-direction="'From'"
          @onInput="(amount) => (fromCoinAmount = amount)"
          @onFocus="
            () => {
              fixedFromCoin = true
            }
          "
          @onMax="maxBtnSelect('fromCoin')"
          @onSelect="openCoinSelect('fromCoin')"
        ></CoinBlock>
        <div class="change-icon">
          <a @click="changeCoinPosition"></a>
        </div>
        <CoinBlock
          v-model="toCoinAmount"
          :coin-name="toCoin ? toCoin.symbol : ''"
          :balance="toCoin ? toCoin.balance : null"
          :swap-direction="'To'"
          :disabled="false"
          :coin-icon="toCoin ? toCoin.icon : ''"
          :show-max="false"
          @onInput="(amount) => (toCoinAmount = amount)"
          @onFocus="
            () => {
              fixedFromCoin = false
            }
          "
          @onMax="maxBtnSelect('toCoin')"
          @onSelect="openCoinSelect('toCoin')"
        ></CoinBlock>
      </div>
      <div v-if="!wallet.connected" class="swap-btn-content">
        <Button class="swap-btn" @click="$accessor.wallet.openModal"> Connect Wallet </Button>
      </div>
      <div v-else class="swap-btn-content">
        <Button
          class="swap-btn"
          :loading="loading"
          :disabled="
            !poolInfo ||
            insufficientLiquidity ||
            loading ||
            !fromCoin ||
            !toCoin ||
            !Number(fromCoinAmount) ||
            swaping ||
            gt(fromCoinAmount, fromCoin && fromCoin.balance ? fromCoin.balance.fixed() : '0')
          "
          @click="toSwap"
        >
          {{ swapBtnText }}
        </Button>
      </div>
      <SwapInfo
        v-show="fromCoin && toCoin && poolInfo"
        :from-coin="fromCoin"
        :to-coin="toCoin"
        :from-coin-amount="fromCoinAmount"
        :to-coin-amount="toCoinAmount"
        :pool-info="poolInfo"
        :currentPriceViewReverse="currentPriceViewReverse"
        :currentPriceView="currentPriceView"
        :fixed-from-coin="fixedFromCoin"
        @refresh="refresh"
      ></SwapInfo>
      <CoinSelect
        v-if="showCoinSelect"
        :existing-coins="existingCoins"
        :last-select-coin="lastSelectCoin"
        @onClose="() => (showCoinSelect = false)"
        @onSelect="onCoinSelect"
      ></CoinSelect>
      <MintAddress
        v-if="showAddress"
        :from-coin="fromCoin"
        :to-coin="toCoin"
        @onClose="() => (showAddress = false)"
      ></MintAddress>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { TokenInfo } from '@/utils/tokens'
import { checkNullObj, decimalFormat, fixD, getTokenBySymbol } from '@/utils'
import { cloneDeep, debounce } from 'lodash-es'
import { inputRegex, escapeRegExp } from '@/utils/regex'
import { gt } from '@/utils/safe-math'
import { Button } from 'ant-design-vue'

import { BroadcastOptions } from '@saberhq/solana-contrib'
import Decimal from 'decimal.js'

import { TokenSwap, lamportPrice2uiPrice } from 'test-crema-sdk'
import { getATAAddress } from '@saberhq/token-utils'
import { loadSwapPair } from '@/contract/pool'

export default Vue.extend({
  components: {
    Button
  },
  data() {
    return {
      showCoinSelect: false,
      fromCoin: null as any,
      toCoin: null as any,
      fromCoinAmount: '',
      toCoinAmount: '',
      currentCoinKey: 'fromCoin',
      fixedFromCoin: true,
      swaping: false,
      showSetting: false,
      showFeeTier: false,
      showAddress: false,
      loading: false,
      existingCoins: '', // 已选择的一边币种
      lastSelectCoin: '', // 当前位置上次选择的币种
      // Insufficient liquidity
      insufficientLiquidity: false,
      // 新sdk测试部分
      swapSdk: null as any,
      isLoading: false,
      tokenSwap: null as any,
      currentPriceView: '',
      currentPriceViewReverse: ''
    }
  },
  head: {
    title: 'Crema Finance | A Powerful Concentrated Liquidity Protocol'
  },
  computed: {
    ...mapState(['wallet', 'url', 'liquidity']),
    poolInfo() {
      if (this.liquidity.poolsObj) {
        const info: any = Object.values(this.liquidity.poolsObj).find((p: any) => {
          return (
            (p.token_a.symbol === this.fromCoin?.symbol && p.token_b.symbol === this.toCoin?.symbol) ||
            (p.token_b.symbol === this.fromCoin?.symbol && p.token_a.symbol === this.toCoin?.symbol)
          )
        })

        if (info && !checkNullObj(info)) {
          return info
        }
        return null
      }
      return null
    },
    swapBtnText() {
      if (!this.poolInfo) {
        return 'Pool not found'
      }
      if (!Number(this.fromCoinAmount)) {
        return 'Enter an amount'
      }
      if (this.insufficientLiquidity) {
        return 'Insufficient Liquidity'
      }
      if (
        gt(
          Number(this.fromCoinAmount),
          this.fromCoin && this.fromCoin.balance ? Number(this.fromCoin.balance.fixed()) : 0
        )
      ) {
        return 'Insufficient balance'
      }
      return 'Swap'
    }
  },
  watch: {
    'wallet.tokenAccounts': {
      handler(newTokenAccounts: any) {
        this.updateCoinInfo(newTokenAccounts)
      },
      deep: true
    },
    poolInfo: {
      handler(value: any) {
        console.log('这里第一次没进来吗####value####', value)
        if (value && value.tokenSwapKey) {
          this.getTokenSwap()
          this.updateAmounts()
        } else {
          this.fromCoinAmount = ''
          this.toCoinAmount = ''
          this.tokenSwap = ''
        }
      },
      deep: true
    },
    fromCoinAmount: debounce(function (newAmount: string, oldAmount: string) {
      if (!newAmount || !Number(newAmount)) {
        this.toCoinAmount = ''
        return
      }
      this.$nextTick(() => {
        if (!inputRegex.test(escapeRegExp(newAmount))) {
          this.fromCoinAmount = oldAmount
        } else {
          if (this.fixedFromCoin) {
            this.updateAmounts()
          }
        }
      })
    }, 500),
    toCoinAmount: debounce(function (newAmount: string, oldAmount: string) {
      if (!newAmount || !Number(newAmount)) {
        this.fromCoinAmount = ''
        return
      }
      this.$nextTick(() => {
        if (!inputRegex.test(escapeRegExp(newAmount))) {
          this.toCoinAmount = oldAmount
        } else {
          if (!this.fixedFromCoin) {
            this.updateAmounts()
          }
        }
      })
    }, 500),
    'liquidity.tokensObj': {
      handler: 'tokensObjWatch',
      immediate: true
    }
  },
  mounted() {
    this.updateCoinInfo(this.wallet.tokenAccounts)
  },
  methods: {
    gt,
    tokensObjWatch(newVal) {
      if (newVal && !checkNullObj(newVal)) {
        if (this.$route && this.$route.query) {
          if (this.$route.query.from) {
            this.fromCoin = getTokenBySymbol(newVal, this.$route.query.from)
          } else {
            this.fromCoin = getTokenBySymbol(newVal, 'usdt')
          }
          if (this.$route.query.to) {
            this.toCoin = getTokenBySymbol(newVal, this.$route.query.to)
          } else {
            this.toCoin = getTokenBySymbol(newVal, 'usdc')
          }
        }
      }
    },
    async getTokenSwap() {
      if (this.poolInfo && this.poolInfo.tokenSwapKey) {
        const swap: any = await loadSwapPair(this.poolInfo.tokenSwapKey, this.$wallet)
        this.tokenSwap = swap
        console.log('getTokenSwap###this.poolInfo####', this.poolInfo)
        const currentPriceView = lamportPrice2uiPrice(
          swap.tokenSwapInfo.currentSqrtPrice.pow(2),
          this.poolInfo.token_a.decimal,
          this.poolInfo.token_b.decimal
        ).toNumber()
        const currentPriceViewReverse = String(1 / Number(currentPriceView))
        this.currentPriceView = String(currentPriceView)
        this.currentPriceViewReverse = currentPriceViewReverse
      }
    },
    refresh() {
      this.$accessor.wallet.getTokenAccounts()
      this.getTokenSwap()
      this.updateAmounts()
    },
    updateCoinInfo(tokenAccounts: any) {
      if (this.fromCoin) {
        const fromCoin = tokenAccounts[this.fromCoin.token_mint]

        if (fromCoin) {
          this.fromCoin = { ...this.fromCoin, ...fromCoin }
        }
      }

      if (this.toCoin) {
        const toCoin = tokenAccounts[this.toCoin.token_mint]

        if (toCoin) {
          this.toCoin = { ...this.toCoin, ...toCoin }
        }
      }
    },
    async updateAmounts() {
      if (!this.poolInfo) return
      const fromCoinMint =
        this.fromCoin?.token_mint === '11111111111111111111111111111111'
          ? 'So11111111111111111111111111111111111111112'
          : this.fromCoin?.token_mint
      const toCoinMint =
        this.toCoin?.token_mint === '11111111111111111111111111111111'
          ? 'So11111111111111111111111111111111111111112'
          : this.toCoin?.token_mint
      const direct =
        fromCoinMint === this.poolInfo.token_a.token_mint && toCoinMint === this.poolInfo.token_b.token_mint ? 0 : 1

      let swap: any
      if (this.tokenSwap) {
        swap = this.tokenSwap
      } else {
        swap = await loadSwapPair(this.poolInfo.tokenSwapKey, this.$wallet)
        this.tokenSwap = swap
      }

      if (this.fromCoin && this.toCoin && (this.fromCoinAmount || this.toCoinAmount)) {
        this.loading = true

        if (swap && swap.ticks && swap.ticks.length > 1) {
          this.insufficientLiquidity = false
        } else {
          this.insufficientLiquidity = true
          this.loading = false
          return
        }
        if (this.fixedFromCoin) {
          if (!Number(this.fromCoinAmount)) return
          const decimal = new Decimal(Math.pow(10, this.fromCoin?.decimal))
          const source_amount = new Decimal(this.fromCoinAmount).mul(decimal)
          const res: any =
            direct === 0 ? swap.preSwapA(new Decimal(source_amount)) : swap.preSwapB(new Decimal(source_amount))

          const test1 = new Decimal(2000)
          const test2 = new Decimal(20000)

          const amountOut = (res && res.amountOut.toNumber()) || 0

          if (res.amountUsed.lt(source_amount)) {
            this.insufficientLiquidity = true
            this.toCoinAmount = '0'
            this.loading = false
            return
          }

          if (amountOut) {
            this.insufficientLiquidity = false
            const toCoinAmount = Number(amountOut) / Math.pow(10, this.toCoin?.decimal)
            this.toCoinAmount = decimalFormat(String(toCoinAmount), this.toCoin?.decimal)
          } else {
            this.insufficientLiquidity = true
            this.toCoinAmount = '0'
          }

          this.loading = false
        } else {
          if (!Number(this.toCoinAmount)) return
          const decimal = new Decimal(Math.pow(10, this.toCoin?.decimal))
          const source_amount = new Decimal(this.toCoinAmount).mul(decimal)
          const res: any =
            direct === 0 ? swap.preSwapB(new Decimal(source_amount)) : swap.preSwapA(new Decimal(source_amount))

          const amountOut = (res && res.amountOut.toNumber()) || 0

          if (res.amountUsed.lt(source_amount)) {
            this.insufficientLiquidity = true
            this.fromCoinAmount = '0'
            this.loading = false
            return
          }

          if (amountOut) {
            this.insufficientLiquidity = false
            const fromCoinAmount = Number(amountOut) / Math.pow(10, this.fromCoin?.decimal)
            this.fromCoinAmount = decimalFormat(String(fromCoinAmount), this.fromCoin?.decimal)
          } else {
            this.insufficientLiquidity = true
            this.fromCoinAmount = '0'
          }
          this.loading = false
        }
      }
    },
    openCoinSelect(key: string) {
      this.currentCoinKey = key
      if (key === 'fromCoin') {
        this.existingCoins = this.toCoin?.symbol || ''
        this.lastSelectCoin = this.fromCoin?.symbol || ''
      } else {
        this.existingCoins = this.fromCoin?.symbol || ''
        this.lastSelectCoin = this.toCoin?.symbol || ''
      }
      // existingCoins
      this.showCoinSelect = true
    },
    onCoinSelect(token: any) {
      if (this.currentCoinKey === 'fromCoin') {
        if (token.symbol === this.toCoin?.symbol) {
          this.toCoin = null
        }
        this.fromCoin = token
      } else {
        if (token.symbol === this.fromCoin?.symbol) {
          this.fromCoin = null
        }
        this.toCoin = token
      }
      this.showCoinSelect = false
    },
    maxBtnSelect(key: string) {
      if (key === 'fromCoin') {
        this.fixedFromCoin = true
        this.fromCoinAmount =
          this.fromCoin && this.fromCoin.balance
            ? this.fromCoin.symbol !== 'SOL'
              ? this.fromCoin.balance.fixed()
              : String(
                  Number(this.fromCoin.balance.fixed()) - 0.01 < 0
                    ? 0
                    : fixD(Number(this.fromCoin.balance.fixed()) - 0.01, 9)
                )
            : '0'
      } else {
        this.fixedFromCoin = false
        // this.toCoinAmount = this.toCoin?.balance?.fixed() || ''
        this.toCoinAmount =
          this.toCoin && this.toCoin.balance
            ? this.toCoin.symbol !== 'SOL'
              ? this.toCoin.balance.fixed()
              : String(
                  Number(this.toCoin.balance.fixed()) - 0.01 < 0
                    ? 0
                    : fixD(Number(this.toCoin.balance.fixed()) - 0.01, 9)
                )
            : '0'
      }
    },
    changeCoinPosition() {
      const tempFromCoin = this.fromCoin
      const tempToCoin = this.toCoin
      this.fromCoin = tempToCoin
      this.toCoin = tempFromCoin

      const tempFromCoinAmount = this.fromCoinAmount
      const tempToCoinAmount = this.toCoinAmount

      this.fromCoinAmount = tempToCoinAmount
      this.toCoinAmount = tempFromCoinAmount
    },
    async toSwap() {
      this.swaping = true
      const poolInfo: any = cloneDeep(this.poolInfo)

      const fromCoinMint =
        this.fromCoin?.token_mint === '11111111111111111111111111111111'
          ? 'So11111111111111111111111111111111111111112'
          : this.fromCoin?.token_mint
      const toCoinMint =
        this.toCoin?.token_mint === '11111111111111111111111111111111'
          ? 'So11111111111111111111111111111111111111112'
          : this.toCoin?.token_mint
      const direct = fromCoinMint === poolInfo.token_a.token_mint && toCoinMint === poolInfo.token_b.token_mint ? 0 : 1

      this.$accessor.transaction.setTransactionDesc(
        `Swap ${this.fromCoinAmount} ${this.fromCoin?.symbol} to ${this.toCoinAmount} ${this.toCoin?.symbol}`
      )
      this.$accessor.transaction.setShowWaiting(true)

      const swap = await loadSwapPair(poolInfo.tokenSwapKey, this.$wallet)
      const amount = new Decimal(this.fromCoinAmount)
      let lamports: any
      if (!direct) {
        lamports = swap.tokenALamports(amount)
      } else {
        lamports = swap.tokenBLamports(amount)
      }

      // const outATA = await getATAAddress({
      //   mint: !direct ? swap.tokenSwapInfo.tokenAMint : swap.tokenSwapInfo.tokenBMint,
      //   owner: swap.provider.wallet.publicKey
      // })
      // const inATA = await getATAAddress({
      //   mint: !direct ? swap.tokenSwapInfo.tokenBMint : swap.tokenSwapInfo.tokenAMint,
      //   owner: swap.provider.wallet.publicKey
      // })
      const estimateResult = !direct ? swap.preSwapA(lamports) : swap.preSwapB(lamports)
      const minIncome = estimateResult.amountOut.div(
        new Decimal(1).add(new Decimal(Number(this.$accessor.slippage) / 100)).toString()
      )

      let txid = ''

      try {
        // const tx = await swap.swap(outATA, inATA, direct, lamports, new Decimal(fixD(minIncome, 0)))
        const tx = await swap.swapAtomic(direct, lamports, new Decimal(fixD(minIncome.toString(), 0)))
        // const receipt = await res.confirm()
        const opt: BroadcastOptions = {
          skipPreflight: true,
          commitment: 'confirmed',
          preflightCommitment: 'confirmed',
          maxRetries: 30,
          printLogs: true
        }
        const receipt: any = await tx.send(opt)

        if (receipt && receipt.signature) {
          txid = receipt.signature
          const description = `Swap ${this.fromCoinAmount} ${this.fromCoin?.symbol} to ${this.toCoinAmount} ${this.toCoin?.symbol}`
          this.$accessor.transaction.setShowSubmitted(true)

          const _this = this
          this.$accessor.transaction.sub({
            txid,
            description,
            type: 'Swap',
            successCallback: () => {
              _this.swaping = false
              _this.refresh()
              this.$accessor.transaction.setShowSubmitted(false)
            },
            errorCallback: () => {
              _this.swaping = false
              this.$accessor.transaction.setShowSubmitted(false)
            }
          })
        }

        const whatWait = await receipt.wait({
          commitment: 'confirmed',
          useWebsocket: true,
          retries: 30
        })

        this.fromCoinAmount = ''
        this.toCoinAmount = ''
      } catch (error: any) {
        console.log('toSwap###error####', error)
        this.$accessor.transaction.setShowWaiting(false)
        this.$accessor.transaction.setShowSubmitted(false)
        this.$notify.close(txid + 'loading')
        this.$notify.error({
          key: 'swap failed',
          message: 'Swap failed',
          description: error.message,
          class: 'error',
          icon: this.$createElement('img', { class: { 'notify-icon': true }, attrs: { src: '/icon_Error@2x.png' } })
        })
        this.swaping = false
      }
    }
  }
})
</script>
<style lang="less" scoped>
@import '../styles/base.less';
.icon {
  width: 20px;
  height: 20px;
}
.container {
  width: 492px;
  // background: rgba(255, 255, 255, 0.06);
  // border-radius: 30px;
  background: linear-gradient(270deg, #3e434e 0%, #292d33 100%);
  border-radius: 20px;
  border: 1px solid #3f434e;
  padding: 20px 16px;
  .form-block {
    .change-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 12px 0px;
      a {
        display: block;
        width: 40px;
        height: 40px;
        background-position: center center;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-image: url('../assets/images/btn-change-new.png');
        // box-shadow: 0px 4px 12px 0px rgba(26, 28, 31, 0.5);

        &:hover {
          background-image: url('../assets/images/brn-change-Hover-new.png');
        }
      }
    }
  }
  .swap-btn {
    // font-weight: bold;
    color: #fff;
    font-size: 20px;
    .gradient-btn-large();
    margin-top: 20px;
  }
}
@media screen and (max-width: 750px) {
  .container {
    margin-top: 20px;
    width: 100%;
    padding: 20px 10px;
  }
}
</style>
