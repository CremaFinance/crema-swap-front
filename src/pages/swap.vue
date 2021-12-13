<template>
  <div class="container swap-container">
    <div class="c-title">
      <span>Swap</span>
      <div class="buttons">
        <!-- <Tooltip placement="bottomRight">
          <template slot="title">
            <span>
              {{ fromCoin && fromCoin.mintAddress }}
            </span>
            <span>
              {{ toCoin && toCoin.mintAddress }}
            </span>
          </template> -->
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
        @click="placeOrder"
      >
        <!-- Swap -->
        <!-- {{
          Number(fromCoinAmount) == 0
            ? 'Enter an amount'
            : insufficientLiquidity
            ? 'Insufficient Liquidity'
            : gt(fromCoinAmount, fromCoin && fromCoin.balance ? fromCoin.balance.fixed() : '0')
            ? 'Insufficient balance'
            : 'Swap'
        }} -->
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
      :fixed-from-coin="fixedFromCoin"
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
</template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
// import { Tooltip } from 'ant-design-vue'
import { TokenInfo, getTokenBySymbol } from '@/utils/tokens'
import { getUnixTs, checkNullObj } from '@/utils'
import { get, cloneDeep, clone } from 'lodash-es'
import { swap, getOutAmount } from '@/utils/swap'
import { inputRegex, escapeRegExp } from '@/utils/regex'
import { TokenAmount, gt } from '@/utils/safe-math'
import { Button } from 'ant-design-vue'
import { Numberu64, Numberu128, TokenSwap } from '@/tokenSwap'

const CUSDT = getTokenBySymbol('CUSDT')
const CUSDC = getTokenBySymbol('CUSDC')

export default Vue.extend({
  components: {
    Button
  },
  data() {
    return {
      showCoinSelect: false,
      fromCoin: CUSDT as TokenInfo | null,
      toCoin: CUSDC as TokenInfo | null,
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
      insufficientLiquidity: false
    }
  },
  head: {
    title: 'Crema Finance | A Powerful Concentrated Liquidity Protocol'
  },
  computed: {
    ...mapState(['wallet', 'url']),
    poolInfo() {
      const info: any = Object.values(this.$accessor.liquidity.infos).find((p: any) => {
        return (
          (p.coin.symbol === this.fromCoin?.symbol && p.pc.symbol === this.toCoin?.symbol) ||
          (p.coin.symbol === this.toCoin?.symbol && p.pc.symbol === this.fromCoin?.symbol)
        )
      })
      // console.log(info, 'info##')
      if (info && !checkNullObj(info)) {
        return info
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
    'liquidity.infos': {
      handler(_newInfos: any) {
        this.updateAmounts()
      },
      deep: true
    },
    poolInfo: {
      handler(value: any) {
        if (value) {
          this.updateAmounts()
        } else {
          // if (this.fixedFromCoin) {
          //   this.toCoin = null
          // } else {
          //   this.fromCoin = null
          // }
          this.fromCoinAmount = ''
          this.toCoinAmount = ''
        }
      },
      deep: true
    },
    fromCoinAmount(newAmount: string, oldAmount: string) {
      this.$nextTick(() => {
        if (!inputRegex.test(escapeRegExp(newAmount))) {
          this.fromCoinAmount = oldAmount
        } else {
          if (this.fixedFromCoin) {
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
          if (!this.fixedFromCoin) {
            this.updateAmounts()
          }
        }
      })
    }
  },
  mounted() {
    this.updateCoinInfo(this.wallet.tokenAccounts)

    const test1 = new Numberu128(10)
    const test2 = new Numberu128(-10)

    console.log('test1#####', test1.toBuffer())
    console.log('test2#####', test2.toBuffer())
  },
  methods: {
    gt,
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
    async updateAmounts() {
      if (!this.poolInfo) return
      const slippage = Number(this.$accessor.slippage) // 滑点
      if (this.fromCoin && this.toCoin && (this.fromCoinAmount || this.toCoinAmount)) {
        this.loading = true
        if (this.fixedFromCoin) {
          const source_amount = new TokenAmount(this.fromCoinAmount, this.fromCoin?.decimals, false).wei.toNumber()
          const { amountOut, amountOutWithSlippage } = await getOutAmount(
            this.$web3,
            this.poolInfo,
            this.fromCoin?.mintAddress,
            this.toCoin?.mintAddress,
            source_amount,
            slippage
          )

          if (Number(amountOut.fixed())) {
            this.insufficientLiquidity = false
            this.toCoinAmount = amountOut.fixed()
          } else {
            this.insufficientLiquidity = true
            this.toCoinAmount = '0'
          }
          this.loading = false
        } else {
          const source_amount = new TokenAmount(this.toCoinAmount, this.toCoin?.decimals, false).wei.toNumber()

          const { amountOut, amountOutWithSlippage } = await getOutAmount(
            this.$web3,
            this.poolInfo,
            this.toCoin?.mintAddress,
            this.fromCoin?.mintAddress,
            source_amount,
            slippage
          )
          if (Number(amountOut.fixed())) {
            this.insufficientLiquidity = false
            this.fromCoinAmount = amountOut.fixed()
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
      // if (token.unusable) return
      // if (this.currentCoinKey === 'fromCoin') {
      //   this.fromCoin = token
      // } else {
      //   this.toCoin = token
      // }
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
              : String(Number(this.fromCoin.balance.fixed()) - 0.05)
            : '0'
      } else {
        this.fixedFromCoin = false
        this.toCoinAmount = this.toCoin?.balance?.fixed() || ''
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
    placeOrder() {
      this.swaping = true

      const key = getUnixTs().toString()
      // this.$notify.info({
      //   key,
      //   message: 'Making transaction...',
      //   description: '',
      //   duration: 0,
      //   icon: this.$createElement('img', { class: { 'notify-icon': true }, attrs: { src: '/tanhao@2x.png' } })
      // })
      this.$accessor.transaction.setTransactionDesc(
        `Swap ${this.fromCoinAmount} ${this.fromCoin?.symbol} to ${this.toCoinAmount} ${this.toCoin?.symbol}`
      )
      this.$accessor.transaction.setShowWaiting(true)

      console.log('this.$accessor.liquidity.infos####', this.$accessor.liquidity.infos)

      const poolInfo: any = Object.values(this.$accessor.liquidity.infos).find((p: any) => {
        return (
          (p.coin.symbol === this.fromCoin?.symbol && p.pc.symbol === this.toCoin?.symbol) ||
          (p.coin.symbol === this.toCoin?.symbol && p.pc.symbol === this.fromCoin?.symbol)
        )
      })

      console.log('poolInfo#####', poolInfo)

      console.log('this.fromCoinAmount####', this.fromCoinAmount)
      console.log('this.toCoinAmount####', this.toCoinAmount)

      swap(
        this.$web3,
        this.$wallet,
        poolInfo,
        this.fromCoin?.mintAddress || '',
        this.toCoin?.mintAddress || '',
        // @ts-ignore
        get(this.wallet.tokenAccounts, `${this.fromCoin.mintAddress}.tokenAccountAddress`),
        // @ts-ignore
        get(this.wallet.tokenAccounts, `${this.toCoin.mintAddress}.tokenAccountAddress`),
        // this.fixedFromCoin ? this.fromCoinAmount : String(Number(this.fromCoinAmount) * 1.01),
        // this.fixedFromCoin ? this.fromCoinAmount : this.fromCoinWithSlippage,
        // this.fixedFromCoin ? this.toCoinWithSlippage : this.toCoinAmount
        this.fromCoinAmount,
        // this.toCoinAmount
        // !this.fixedFromCoin
        //   ? this.toCoinAmount
        //   : String(Number(this.toCoinAmount) / (1 + Number(this.$accessor.slippage) / 100))
        String(Number(this.toCoinAmount) / (1 + Number(this.$accessor.slippage) / 100))
      )
        .then((txid: any) => {
          // this.$accessor.transaction.setShowWaiting(false)

          // this.$notify.info({
          //   key,
          //   message: 'Transaction has been sent',
          //   icon: this.$createElement('img', { class: { 'notify-icon': true }, attrs: { src: '/tanhao@2x.png' } }),
          //   description: (h: any) =>
          //     h('div', [
          //       'Confirmation is in progress.  Check your transaction on ',
          //       h('a', { attrs: { href: `${this.url.explorer}/tx/${txid}`, target: '_blank' } }, 'here')
          //     ])
          // })

          const description = `Swap ${this.fromCoinAmount} ${this.fromCoin?.symbol} to ${this.toCoinAmount} ${this.toCoin?.symbol}`
          this.$accessor.transaction.sub({ txid, description })
          this.$accessor.transaction.setShowSubmitted(true)
          this.fromCoinAmount = ''
          this.toCoinAmount = ''
        })
        .catch((error: any) => {
          this.$accessor.transaction.setShowWaiting(false)
          this.$notify.error({
            key,
            message: 'Swap failed',
            description: error.message,
            class: 'error',
            icon: this.$createElement('img', { class: { 'notify-icon': true }, attrs: { src: '/icon_Error@2x.png' } })
          })
        })
        .finally(() => {
          this.swaping = false
        })
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
  border-radius: 30px;
  border: 1px solid #3f434e;
  padding: 20px 16px;
  .form-block {
    .change-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 11px 0px;
      a {
        display: block;
        width: 48px;
        height: 48px;
        background-position: center center;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-image: url('../assets/images/btn-change-new.png');
        box-shadow: 0px 4px 12px 0px rgba(26, 28, 31, 0.5);

        &:hover {
          background-image: url('../assets/images/brn-change-Hover-new.png');
        }
      }
    }
  }
  .swap-btn {
    font-weight: bold;
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
