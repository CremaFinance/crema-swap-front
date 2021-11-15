<template>
  <div class="add-liquidity-form">
    <CoinBlock
      v-model="fromCoinAmount"
      :coin-name="fromCoin ? fromCoin.symbol : ''"
      :balance="fromCoin ? fromCoin.balance : null"
      :show-lock="showFromCoinLock"
      @onInput="inputChange"
      @onFocus="
        () => {
          fixedFromCoin = true
        }
      "
      @onSelect="openCoinSelect('fromCoin')"
      @onMax="maxBtnSelect('fromCoin')"
    ></CoinBlock>
    <div class="add-icon">
      <a></a>
    </div>
    <CoinBlock
      v-model="toCoinAmount"
      :coin-name="toCoin ? toCoin.symbol : ''"
      :balance="toCoin ? toCoin.balance : null"
      :show-lock="showToCoinLock"
      @onInput="inputChange"
      @onFocus="
        () => {
          fixedFromCoin = false
        }
      "
      @onSelect="openCoinSelect('toCoin')"
      @onMax="maxBtnSelect('toCoin')"
    ></CoinBlock>

    <CoinSelect v-if="showCoinSelect" @onClose="() => (showCoinSelect = false)" @onSelect="onCoinSelect"></CoinSelect>
  </div>
</template>
<script lang="ts">
import { Vue } from 'nuxt-property-decorator'
import { mapState } from 'vuex'
import { TokenInfo, TOKENS, NATIVE_SOL, getTokenBySymbol } from '@/utils/tokens'
import {
  tick2price,
  price2tick,
  deposit_src_calulate_dst,
  deposit_only_token_b,
  deposit_only_token_a
} from '@/tokenSwap/swapv3'
import { TokenAmount } from '@/utils/safe-math'
import { fixD, getUnixTs } from '../utils/index'
import { Numberu128 } from '@/tokenSwap'

export default Vue.extend({
  props: {
    type: {
      type: String,
      default: 'add'
    },
    defaultFromCoin: {
      type: Object,
      default: () => {
        return {}
      }
    },
    defaultToCoin: {
      type: Object,
      default: () => {
        return {}
      }
    },
    showFromCoinLock: {
      type: Boolean,
      default: false
    },
    showToCoinLock: {
      type: Boolean,
      default: false
    },
    currentData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      fromCoin: {} as TokenInfo | null,
      toCoin: {} as TokenInfo | null,
      fromCoinAmount: '',
      toCoinAmount: '',
      fixedFromCoin: true,
      currentCoinKey: 'fromCoin',
      showCoinSelect: false,
      deltaLiquity: 0
    }
  },
  computed: {
    ...mapState(['wallet'])
  },
  watch: {
    defaultFromCoin: {
      handler: 'watchDefaultFromCoin',
      immediate: true
    },
    defaultToCoin: {
      handler: 'watchDefaultToCoin',
      immediate: true
    },
    currentData: {
      handler: 'currentDataWatch',
      immediate: true
    }
  },
  mounted() {
    this.updateCoinInfo(this.wallet.tokenAccounts)
  },
  methods: {
    currentDataWatch(data: any) {
      if (data.currentPriceOrigin && data.lower_tick && data.upper_tick) {
        this.updateAmounts(data.currentPriceOrigin, data.lower_tick, data.upper_tick)
      }
    },
    watchDefaultFromCoin(value: any) {
      this.fromCoin = value
    },
    watchDefaultToCoin(value: any) {
      this.toCoin = value
    },
    openCoinSelect(key: string) {
      this.currentCoinKey = key
      this.showCoinSelect = true
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
    onCoinSelect(token: TokenInfo) {
      if (this.type === 'add') {
        // 只有新增时候可选币种
        if (this.currentCoinKey === 'fromCoin') {
          this.fromCoin = token
        } else {
          this.toCoin = token
        }
        this.showCoinSelect = false
      }
    },
    inputChange(amount: any) {
      if (this.fixedFromCoin) {
        this.fromCoinAmount = amount
        this.$emit('onChange', amount, this.toCoinAmount)
        this.updateAmounts(
          this.currentData.currentPriceOrigin,
          this.currentData.lower_tick,
          this.currentData.upper_tick
        )
      } else {
        this.toCoinAmount = amount
        this.$emit('onChange', this.fromCoinAmount, amount)
        this.updateAmounts(
          this.currentData.currentPriceOrigin,
          this.currentData.lower_tick,
          this.currentData.upper_tick
        )
      }
    },
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
    updateAmounts(price: string, tick_lower: number, tick_upper: number) {
      // 调用陈杨志demo是需要的 ()
      const currentPrice = Number(price) / Math.pow(10, 12)

      // const fromCoinAmount = new TokenAmount(this.fromCoinAmount, this.fromCoin?.decimals, false).wei.toNumber()

      let coinAmount: any
      let direction: any
      if (this.fixedFromCoin) {
        coinAmount = new TokenAmount(this.fromCoinAmount, this.fromCoin?.decimals, false).wei.toNumber()
        direction =
          this.fromCoin?.symbol === this.currentData.coin.symbol && this.toCoin?.symbol === this.currentData.pc.symbol
            ? 0
            : 1
      } else {
        coinAmount = new TokenAmount(this.toCoinAmount, this.toCoin?.decimals, false).wei.toNumber()
        direction =
          this.toCoin?.symbol === this.currentData.coin.symbol && this.toCoin?.symbol === this.currentData.pc.symbol
            ? 0
            : 1
      }

      if (!this.showFromCoinLock && !this.showToCoinLock) {
        const { dst, delta_liquity } = deposit_src_calulate_dst(
          tick_lower,
          tick_upper,
          coinAmount,
          new Numberu128(price),
          direction
        )
        const decimal = this.toCoin?.decimals || 6
        this.deltaLiquity = delta_liquity

        if (this.fixedFromCoin) {
          const toCoinAmount = fixD(Math.abs(dst) / Math.pow(10, decimal), decimal) || '0'
          this.toCoinAmount = toCoinAmount
          this.$emit('onChange', this.fromCoinAmount, toCoinAmount, delta_liquity)
        } else {
          const fromCoinAmount = fixD(Math.abs(dst) / Math.pow(10, decimal), decimal) || '0'
          this.fromCoinAmount = fromCoinAmount
          this.$emit('onChange', fromCoinAmount, this.toCoinAmount, delta_liquity)
        }
      } else if (!this.showToCoinLock) {
        // 区间在当前价格的左侧时，也就是只有token b这一种资产, 返回liquity
        const coinAmount = new TokenAmount(this.toCoinAmount, this.toCoin?.decimals, false).wei.toNumber()
        const delta_liquity = deposit_only_token_b(tick_lower, tick_upper, coinAmount)
        this.deltaLiquity = delta_liquity
        this.$emit('onChange', this.fromCoinAmount, this.toCoinAmount, delta_liquity)
      } else if (!this.showFromCoinLock) {
        // 区间在当前价格的右侧时，也就是只有token a这一种资产, 返回liquity
        const coinAmount = new TokenAmount(this.fromCoinAmount, this.fromCoin?.decimals, false).wei.toNumber()
        const delta_liquity = deposit_only_token_a(tick_lower, tick_upper, coinAmount)
        this.deltaLiquity = delta_liquity
        this.$emit('onChange', this.fromCoinAmount, this.toCoinAmount, delta_liquity)
      }
    }
  }
})
</script>
<style lang="less" scope>
.add-liquidity-form {
  .add-icon {
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
      background-image: url('../assets/images/add@2x.png');
    }
  }
}
</style>
