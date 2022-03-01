<template>
  <div>
    <SwapTab></SwapTab>
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
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
// import { Tooltip } from 'ant-design-vue'
import { TokenInfo, getTokenBySymbol } from '@/utils/tokens'
import { getUnixTs, checkNullObj, decimalFormat } from '@/utils'
import { get, cloneDeep, clone } from 'lodash-es'
import { swap, getOutAmount } from '@/utils/swap'
import { inputRegex, escapeRegExp } from '@/utils/regex'
import { TokenAmount, gt } from '@/utils/safe-math'
import { Button } from 'ant-design-vue'
// import { Numberu64, Numberu128, TokenSwap } from '@/tokenSwap'

import { TokenSwap } from '@cremafinance/crema-sdk'
import { Connection, PublicKey, Keypair, Account } from '@solana/web3.js'
import Decimal from 'decimal.js'

const USDT = getTokenBySymbol('USDT')
const USDC = getTokenBySymbol('USDC')

export default Vue.extend({
  components: {
    Button
  },
  data() {
    return {
      showCoinSelect: false,
      fromCoin: USDT as TokenInfo | null,
      toCoin: USDC as TokenInfo | null,
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
      swapSdk: null as any
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
      async handler(value: any) {
        if (value && value.swapProgramId && value.tokenSwap) {
          // console.log('value.swapProgramId###', value.swapProgramId.toString())
          // console.log('value.tokenSwap###', value.tokenSwap.toString())
          const swap = await new TokenSwap(this.$web3, value.swapProgramId, value.tokenSwap, null)
          // let url = 'https://mercurial.rpcpool.com'
          // let conn = new Connection(url, 'recent')
          // const swap = await new TokenSwap(conn, value.swapProgramId, value.tokenSwap, null)
          this.swapSdk = swap
          this.updateAmounts()
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
    },
    toCoinAmount(newAmount: string, oldAmount: string) {
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
    }
  },
  mounted() {
    this.updateCoinInfo(this.wallet.tokenAccounts)
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
      const direct =
        this.fromCoin?.mintAddress === this.poolInfo.coin.mintAddress &&
        this.toCoin?.mintAddress === this.poolInfo.pc.mintAddress
          ? 0
          : 1
      if (this.fromCoin && this.toCoin && (this.fromCoinAmount || this.toCoinAmount)) {
        this.loading = true
        let swap: any = this.swapSdk
        if (this.swapSdk) {
          swap = await this.swapSdk.load()
        } else {
          const swapSdk: any = new TokenSwap(this.$web3, this.poolInfo.swapProgramId, this.poolInfo.tokenSwap, null)
          this.swapSdk = swapSdk
          swap = await swapSdk.load()
        }

        if (swap && swap.ticks && swap.ticks.length > 1) {
          this.insufficientLiquidity = false
        } else {
          this.insufficientLiquidity = true
          this.loading = false
          return
        }

        if (this.fixedFromCoin) {
          // const source_amount = new TokenAmount(this.fromCoinAmount, this.fromCoin?.decimals, false).wei.toString()
          // console.log('this.fromCoin?.decimals####', this.fromCoin?.decimals)
          const decimal = new Decimal(Math.pow(10, this.fromCoin?.decimals))
          const source_amount = new Decimal(this.fromCoinAmount).mul(decimal)
          // const { amountOut, amountOutWithSlippage, dst } = await getOutAmount(
          //   this.$web3,
          //   this.poolInfo,
          //   this.fromCoin?.mintAddress,
          //   this.toCoin?.mintAddress,
          //   source_amount,
          //   slippage
          // )
          // if (Number(amountOut.fixed())) {
          //   this.insufficientLiquidity = false
          //   this.toCoinAmount = amountOut.fixed()
          // } else {
          //   this.insufficientLiquidity = true
          //   this.toCoinAmount = '0'
          // }
          // this.loading = false
          // console.log('amountOut####', amountOut.fixed())
          // const amountOut: any = await swap.simulateSwap(new Decimal(source_amount), direct)
          const res: any =
            direct === 0 ? swap.preSwapA(new Decimal(source_amount)) : swap.preSwapB(new Decimal(source_amount))
          // console.log('1111source_amount####', source_amount)
          // const DECIMALS = new Decimal(1000000)
          // console.log('res.amountOut.div(DECIMALS).toString()####', res.amountOut.div(DECIMALS).toString())
          const amountOut = (res && res.amountOut.toNumber()) || 0
          // console.log('1111amountOut#####', amountOut, '####direct####', direct)

          if (amountOut) {
            this.insufficientLiquidity = false
            const toCoinAmount = Number(amountOut) / Math.pow(10, this.toCoin?.decimals)
            this.toCoinAmount = decimalFormat(String(toCoinAmount), this.toCoin?.decimals)
          } else {
            this.insufficientLiquidity = true
            this.toCoinAmount = '0'
          }
          this.loading = false

          // let url = 'https://mercurial.rpcpool.com'
          // let conn = new Connection(url, 'recent')
          // let programID = new PublicKey('6MLxLqiXaaSUpkgMnWDTuejNZEz3kE7k2woyHGVFw319')
          // let swapKey = new PublicKey('8J3avAjuRfL2CYFKKDwhhceiRoajhrHv9kN5nUiEnuBG') //CUSDT-CUSDC
          // const testswap = await new TokenSwap(conn, programID, swapKey, null).load()

          // let testres = testswap.preSwapB(new Decimal(1000000000000000000000000))
          // console.log('amountOut          :', testres.amountOut.toString())
        } else {
          // const source_amount = new TokenAmount(this.toCoinAmount, this.toCoin?.decimals, false).wei.toString()
          const decimal = new Decimal(Math.pow(10, this.toCoin?.decimals))
          const source_amount = new Decimal(this.toCoinAmount).mul(decimal)
          // const { amountOut, amountOutWithSlippage } = await getOutAmount(
          //   this.$web3,
          //   this.poolInfo,
          //   this.toCoin?.mintAddress,
          //   this.fromCoin?.mintAddress,
          //   source_amount,
          //   slippage
          // )
          // if (Number(amountOut.fixed())) {
          //   this.insufficientLiquidity = false
          //   this.fromCoinAmount = amountOut.fixed()
          // } else {
          //   this.insufficientLiquidity = true
          //   this.fromCoinAmount = '0'
          // }
          // this.loading = false
          // const amountOut: any = await swap.simulateSwap(new Decimal(source_amount), direct)
          // console.log('2222source_amount####', source_amount)
          const res: any =
            direct === 0 ? swap.preSwapA(new Decimal(source_amount)) : swap.preSwapB(new Decimal(source_amount))

          const amountOut = (res && res.amountOut.toNumber()) || 0
          // console.log('22222amountOut#####', amountOut, '###direct###', direct)

          if (amountOut) {
            this.insufficientLiquidity = false
            const fromCoinAmount = Number(amountOut) / Math.pow(10, this.fromCoin?.decimals)
            this.fromCoinAmount = decimalFormat(String(fromCoinAmount), this.fromCoin?.decimals)
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
      console.log(token);
      
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
