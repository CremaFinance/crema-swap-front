<template>
  <div class="container swap-container">
    <div class="c-title">
      <span>Swap</span>
      <div class="buttons">
        <!-- <Tooltip placement="bottomRight">
          <template slot="title">
            <span> tooltip内容 </span>
          </template>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-a-bianzu181"></use>
          </svg>
        </Tooltip> -->
        <!-- <Tooltip placement="bottomRight">
          <template slot="title">
            <p>tooltip内容</p>
          </template>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-a-bianzu81"></use>
          </svg>
        </Tooltip> -->
        <svg class="icon" aria-hidden="true" @click="showSetting = true">
          <use xlink:href="#icon-a-bianzu81"></use>
        </svg>
      </div>
    </div>
    <div class="form-block">
      <CoinBlock
        v-model="fromCoinAmount"
        :coin-name="fromCoin ? fromCoin.symbol : null"
        :balance="fromCoin ? fromCoin.balance : null"
        :swapDirection="'From'"
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
        :swapDirection="'To'"
        :disabled="false"
        :showMax="false"
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
    <Button v-if="!wallet.connected" class="swap-btn" @click="$accessor.wallet.openModal">Connect Wallet</Button>
    <Button
      v-else
      class="swap-btn"
      :loading="loading"
      :disabled="
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
      {{
        insufficientLiquidity
          ? 'Insufficient Liquidity'
          : gt(fromCoinAmount, fromCoin && fromCoin.balance ? fromCoin.balance.fixed() : '0')
          ? 'Insufficient balance'
          : 'Swap'
      }}
    </Button>
    <SwapInfo
      :from-coin="fromCoin"
      :to-coin="toCoin"
      :from-coin-amount="fromCoinAmount"
      :to-coin-amount="toCoinAmount"
      :pool-info="poolInfo"
    ></SwapInfo>
    <Setting v-if="showSetting" @onClose="() => (showSetting = false)"></Setting>
    <CoinSelect
      v-if="showCoinSelect"
      :existing-coins="existingCoins"
      @onClose="() => (showCoinSelect = false)"
      @onSelect="onCoinSelect"
    ></CoinSelect>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
// import { Tooltip } from 'ant-design-vue'
import { TokenInfo, getTokenBySymbol } from '@/utils/tokens'
import { gt } from '@/utils/safe-math'
import { getUnixTs } from '@/utils'
import { get, cloneDeep } from 'lodash-es'
import { swap, getOutAmount } from '@/utils/swap'
import { inputRegex, escapeRegExp } from '@/utils/regex'
import { TokenAmount } from '@/utils/safe-math'
import { Button } from 'ant-design-vue'
import { LIQUIDITY_POOLS } from '@/utils/pools'

const CSOL = getTokenBySymbol('CSOL')
const CUSDC = getTokenBySymbol('CUSDC')

export default Vue.extend({
  components: {
    // Tooltip
    Button
  },
  data() {
    return {
      showCoinSelect: false,
      fromCoin: CSOL as TokenInfo | null,
      toCoin: CUSDC as TokenInfo | null,
      fromCoinAmount: '',
      toCoinAmount: '',
      currentCoinKey: 'fromCoin',
      fixedFromCoin: true,
      swaping: false,
      showSetting: false,
      loading: false,
      existingCoins: '', // 已选择的一边币种
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
      return info
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
        this.updateAmounts(this.poolInfo.currentPrice)
      },
      deep: true
    },
    poolInfo: {
      handler(value: any) {
        if (value) {
          this.updateAmounts(value.currentPrice)
        } else {
          // for (const coinPair in LIQUIDITY_POOLS) {
          //   const poolInfo = cloneDeep(LIQUIDITY_POOLS[coinPair])
          //   if (
          //     this.fixedFromCoin &&
          //     (poolInfo.coin.symbol === this.fromCoin?.symbol || poolInfo.pc.symbol === this.fromCoin?.symbol)
          //   ) {
          //     this.toCoin = poolInfo.coin.symbol === this.fromCoin?.symbol ? poolInfo.pc : poolInfo.coin
          //     break
          //   }

          //   if (
          //     !this.fixedFromCoin &&
          //     (poolInfo.pc.symbol === this.toCoin?.symbol || poolInfo.coin.symbol === this.toCoin?.symbol)
          //   ) {
          //     this.fromCoin = poolInfo.coin.symbol === this.fromCoin?.symbol ? poolInfo.pc : poolInfo.coin
          //     break
          //   }
          // }
          if (this.fixedFromCoin) {
            this.toCoin = null
          } else {
            this.fromCoin = null
          }
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
            this.updateAmounts(this.poolInfo.currentPrice)
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
            this.updateAmounts(this.poolInfo.currentPrice)
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
    async updateAmounts(price: string) {
      console.log('进来了啊')
      // const slippage = 2 // 滑点暂写2%, 合约计算时候算了fee， 收了1%,  sdk没有，所以滑点暂时写为2%
      const slippage = Number(this.$accessor.slippage) // 滑点暂写2%, 合约计算时候算了fee， 收了1%,  sdk没有，所以滑点暂时写为2%
      if (this.fromCoin && this.toCoin && (this.fromCoinAmount || this.toCoinAmount)) {
        this.loading = true
        if (this.fixedFromCoin) {
          const source_amount = new TokenAmount(this.fromCoinAmount, this.fromCoin?.decimals, false).wei.toNumber()
          console.log('到这里了吗')
          const { amountOut, amountOutWithSlippage } = await getOutAmount(
            this.$web3,
            this.poolInfo,
            this.fromCoin?.mintAddress,
            this.toCoin?.mintAddress,
            source_amount,
            slippage
          )
          console.log('fixedFromCoin###if####amountOut###', amountOut.fixed())
          console.log('fixedFromCoin###if####amountOutWithSlippage###', amountOutWithSlippage.fixed())

          if (Number(amountOutWithSlippage.fixed())) {
            this.insufficientLiquidity = false
            this.toCoinAmount = amountOutWithSlippage.fixed()
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
          console.log('fixedFromCoin###else####amountOut###', amountOut.fixed())
          console.log('fixedFromCoin###else####amountOutWithSlippage###', amountOutWithSlippage.fixed())
        }
      }
    },
    openCoinSelect(key: string) {
      this.currentCoinKey = key
      if (key === 'fromCoin') {
        this.existingCoins = this.toCoin?.symbol || ''
      } else {
        this.existingCoins = this.fromCoin?.symbol || ''
      }
      // existingCoins
      this.showCoinSelect = true
    },
    onCoinSelect(token: TokenInfo) {
      if (this.currentCoinKey === 'fromCoin') {
        this.fromCoin = token
      } else {
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
      this.$notify.info({
        key,
        message: 'Making transaction...',
        description: '',
        duration: 0,
        icon: this.$createElement('img', { class: { 'notify-icon': true }, attrs: { src: '/tanhao@2x.png' } })
      })

      console.log('this.$accessor.liquidity.infos####', this.$accessor.liquidity.infos)

      const poolInfo: any = Object.values(this.$accessor.liquidity.infos).find((p: any) => {
        return (
          (p.coin.symbol === this.fromCoin?.symbol && p.pc.symbol === this.toCoin?.symbol) ||
          (p.coin.symbol === this.toCoin?.symbol && p.pc.symbol === this.fromCoin?.symbol)
        )
      })

      console.log('poolInfo#####', poolInfo)

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
        this.fixedFromCoin
          ? this.toCoinAmount
          : String(Number(this.toCoinAmount) / (1 + Number(this.$accessor.slippage) / 100))
      )
        .then((txid: any) => {
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

          const description = `Swap ${this.fromCoinAmount} ${this.fromCoin?.symbol} to ${this.toCoinAmount} ${this.toCoin?.symbol}`
          this.$accessor.transaction.sub({ txid, description })
        })
        .catch((error: any) => {
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
.container {
  width: 492px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 30px;
  .form-block {
    .change-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      padding-top: 20px;
      a {
        display: block;
        width: 40px;
        height: 40px;
        background-position: center center;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-image: url('../assets/images/btn-change.png');
        &:hover {
          background-image: url('../assets/images/brn-change-Hover.png');
        }
      }
    }
  }
  .swap-btn {
    .gradient-btn-large();
    margin-top: 20px;
  }
}
@media screen and (max-width: 750px) {
  .container {
    width: 100%;
  }
}
</style>
