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
        :show-max="false"
        :disabled="false"
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
    <button
      class="swap-btn"
      :disabled="
        !fromCoin ||
        !toCoin ||
        !Number(fromCoinAmount) ||
        swaping ||
        gt(fromCoinAmount, fromCoin && fromCoin.balance ? fromCoin.balance.fixed() : '0')
      "
      @click="placeOrder"
    >
      Swap
    </button>
    <SwapInfo></SwapInfo>
    <Setting v-if="showSetting" @onClose="() => (showSetting = false)"></Setting>
    <CoinSelect v-if="showCoinSelect" @onClose="() => (showCoinSelect = false)" @onSelect="onCoinSelect"></CoinSelect>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
// import { Tooltip } from 'ant-design-vue'
import { TokenInfo } from '@/utils/tokens'
import { gt } from '@/utils/safe-math'
import { getUnixTs } from '@/utils'
import { get } from 'lodash-es'
import { swap } from '@/utils/swap'

export default Vue.extend({
  components: {
    // Tooltip
  },
  data() {
    return {
      showCoinSelect: false,
      fromCoin: null as TokenInfo | null,
      toCoin: null as TokenInfo | null,
      fromCoinAmount: '',
      toCoinAmount: '',
      currentCoinKey: 'fromCoin',
      fixedFromCoin: true,
      swaping: false,
      showSetting: false
    }
  },
  head: {
    title: 'Crema Finance | A Powerful Concentrated Liquidity Protocol'
  },
  computed: {
    ...mapState(['wallet', 'url'])
  },
  watch: {
    'wallet.tokenAccounts': {
      handler(newTokenAccounts: any) {
        this.updateCoinInfo(newTokenAccounts)
      },
      deep: true
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
    async updateAmounts() {},
    openCoinSelect(key: string) {
      this.currentCoinKey = key
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
        this.toCoinAmount
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
