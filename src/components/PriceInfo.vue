<template>
  <div class="price-info">
    <h3 class="title">
      <span>Price Info</span>
      <Progress
        type="circle"
        :width="14"
        :stroke-width="10"
        :percent="(100 / autoRefreshTime) * countdown"
        :show-info="false"
        :class="routesIsLoading ? 'disabled' : ''"
        @click="
          () => {
            getOrderBooks()
            $accessor.wallet.getTokenAccounts()
          }
        "
      />
    </h3>
    <ul class="info-list">
      <li v-if="fromCoin && toCoin">
        <span>Exchange Rate</span>
        <div>
          <span v-if="!direction && from2toRate"
            >1 {{ fromCoin.symbol }} ≈ {{ decimalFormat(from2toRate, 6) }} {{ toCoin.symbol }}</span
          >
          <span v-else-if="direction && to2fromRate"
            >1 {{ toCoin.symbol }} ≈ {{ decimalFormat(to2fromRate, 6) }} {{ fromCoin.symbol }}</span
          >
          <svg class="icon" aria-hidden="true" @click="direction = !direction">
            <use xlink:href="#icon-icon-swap"></use>
          </svg>
        </div>
      </li>
      <!-- <li>
        <span></span>
        <div class="coingecko-tips">
          <span class="green">Within 1% from &nbsp;</span>
          <span>CoinGecko(Rates from API)</span>
        </div>
      </li> -->
      <li>
        <span>Price Impact{{ priceImpact }}</span>
        <div v-if="priceImpact < 0.1">&lt; 0.1%</div>
        <div v-else>~ {{ decimalFormat(priceImpact, 2) }} %</div>
      </li>
      <li v-if="toCoin">
        <span>Minimum Received</span>
        <div v-if="fromCoinAmount">{{ minimumReceived }} {{ toCoin.symbol }}</div>
        <div v-else>-</div>
      </li>
      <li v-if="fromCoinAmount && lpFee1">
        <span>Fees paid to {{ lpFee1.platform }} LP</span>
        <div>
          {{ lpFee1.amount }}
          {{ lpFee1.symbol }}
          ({{ decimalFormat(lpFee1.pct, 2) }}%)
        </div>
      </li>
      <li v-if="fromCoinAmount && lpFee2">
        <span>Fees paid to {{ lpFee2.platform }} LP</span>
        <div>
          {{ lpFee2.amount }}
          {{ lpFee2.symbol }}
          ({{ lpFee2.pct }}%)
        </div>
      </li>
      <li>
        <span>Transaction Fee</span>
        <div v-if="transactionFee">{{ transactionFee }} SOL</div>
        <div v-else>- SOL</div>
      </li>
      <li v-if="fromCoinAmount && (ataDeposit || openOrdersAccountDeposits)">
        <span>Deposit</span>
        <div class="deposit-right">
          <p v-if="ataDeposit">{{ ataDeposit }} SOL for {{ ataAccountLength }} ATA account</p>
          <p v-if="openOrdersAccountDeposits">
            {{ openOrdersAccountDeposits }} SOL for {{ openOrdersAccountLength }}
            {{ openOrdersAccountsNames }} OpenOrders account
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { decimalFormat } from '@/utils'
import { Progress, Result } from 'ant-design-vue'

export default Vue.extend({
  components: {
    Progress
  },
  props: {
    depositAndFee: {
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
    currentRoute: {
      type: Object,
      default: () => {
        return {}
      }
    },
    fromCoin: {
      type: Object,
      default: () => {
        return {}
      }
    },
    toCoin: {
      type: Object,
      default: () => {
        return {}
      }
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
      direction: true,
      autoRefreshTime: 60,
      countdown: 0,
      loading: false,
      marketTimer: null as any
    }
  },
  computed: {
    ...mapState(['wallet', 'url', 'swap']),
    from2toRate(): number {
      if (this.fromCoin && this.toCoin && this.currentRoute) {
        const from = this.currentRoute.inAmount / Math.pow(10, this.fromCoin.decimals)
        const to = this.currentRoute.outAmount / Math.pow(10, this.toCoin.decimals)
        const rates = to && from ? to / from : 0
        return rates
      }
      return 0
    },
    to2fromRate(): number {
      if (this.fromCoin && this.toCoin && this.currentRoute) {
        const from = this.currentRoute.inAmount / Math.pow(10, this.fromCoin.decimals)
        const to = this.currentRoute.outAmount / Math.pow(10, this.toCoin.decimals)
        const rates = to && from ? from / to : 0
        return rates
      }
      return 0
    },
    priceImpact(): number {
      if (this.currentRoute && this.currentRoute.priceImpactPct) {
        // return this.currentRoute.priceImpactPct * 100
        return this.currentRoute.priceImpactPct > 1 ? 100 : this.currentRoute.priceImpactPct * 100
      }
      return 0
    },
    minimumReceived(): number {
      if (this.currentRoute && this.toCoin) {
        return Number(
          decimalFormat(
            String(this.currentRoute.outAmountWithSlippage / Math.pow(10, this.toCoin.decimals)),
            this.toCoin.decimals
          )
        )
      }
      return 0
    },
    lpFee1(): any {
      if (
        this.currentRoute &&
        this.currentRoute.marketInfos &&
        this.currentRoute.marketInfos[0] &&
        this.currentRoute.marketInfos[0].lpFee &&
        this.swap.tokensObj
      ) {
        const tokensObj = this.swap.tokensObj
        const lpFee = this.currentRoute.marketInfos[0].lpFee
        const token = tokensObj[lpFee.mint] && tokensObj[lpFee.mint]
        const amount = Math.abs(lpFee.amount) / Math.pow(10, token.decimals)
        const pct = lpFee.pct * 100
        const symbol = token.symbol
        const platform = this.currentRoute.marketInfos[0].marketMeta.amm.label
        return {
          amount,
          pct,
          symbol,
          platform
        }
      }
      return null
    },
    lpFee2(): any {
      if (
        this.currentRoute &&
        this.currentRoute.marketInfos &&
        this.currentRoute.marketInfos[1] &&
        this.currentRoute.marketInfos[1].lpFee &&
        this.swap.tokensObj
      ) {
        const tokensObj = this.swap.tokensObj
        const lpFee = this.currentRoute.marketInfos[1].lpFee
        const token = tokensObj[lpFee.mint] && tokensObj[lpFee.mint]
        const amount = Math.abs(lpFee.amount) / Math.pow(10, token.decimals)
        const pct = lpFee.pct * 100
        const symbol = token.symbol
        const platform = this.currentRoute.marketInfos[1].marketMeta.amm.label
        return {
          amount,
          pct,
          symbol,
          platform
        }
      }
      return null
    },
    ataDeposit(): number {
      if (this.depositAndFee) {
        return this.depositAndFee.ataDeposit / Math.pow(10, 9)
      }
      return 0
    },
    transactionFee(): number {
      if (this.depositAndFee) {
        return this.depositAndFee.signatureFee / Math.pow(10, 9)
      }
      return 0
    },
    ataAccountLength(): number {
      if (this.depositAndFee) {
        return this.depositAndFee.ataDepositLength
      }
      return 0
    },
    openOrdersAccountsNames(): string {
      if (this.currentRoute && this.currentRoute.marketInfos) {
        const length: number = this.currentRoute.marketInfos.length
        const info: any = this.currentRoute.marketInfos
        return (info[length] && info[length].marketMeta.amm.label) || ''
      }
      return ''
    },
    openOrdersAccountDeposits(): number {
      if (this.depositAndFee) {
        const depositsArr = this.depositAndFee.openOrdersDeposits || []
        let result = 0
        depositsArr.forEach((item) => {
          result += item
        })
        if (result) {
          result = result / Math.pow(10, 9)
        }
        return result
      }
      return 0
    },
    openOrdersAccountLength(): number {
      if (this.depositAndFee) {
        const depositsArr = this.depositAndFee.openOrdersDeposits || []
        return depositsArr.length
      }
      return 0
    }
    // 'wallet.'
  },
  mounted() {
    this.setMarketTimer()
  },
  methods: {
    decimalFormat,
    getOrderBooks() {
      this.countdown = 0
      this.$emit('updateAmounts')
    },
    setMarketTimer() {
      this.marketTimer = setInterval(() => {
        if (!this.loading) {
          if (this.countdown < this.autoRefreshTime) {
            this.countdown += 1

            if (this.countdown === this.autoRefreshTime) {
              this.getOrderBooks()
            }
          }
        }
      }, 1000)
    }
  }
})
</script>
<style lang="less" scoped>
.price-info {
  width: 492px;
  background: linear-gradient(270deg, #3e434e 0%, #292d33 100%);
  border-radius: 30px;
  border: 1px solid #3f434e;
  padding: 20px;
  margin: 0 auto;
  margin-top: 12px;
  .title {
    font-size: 14px;
    color: #fff;
  }
  .info-list {
    margin-bottom: 0px;
    li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 12px;
      font-size: 12px;
      svg {
        width: 20px;
        height: 20px;
        fill: rgba(255, 255, 255, 0.5);
        &:hover {
          fill: #fff;
        }
      }
      > span {
        color: #b5b8c2;
      }
      > div {
        display: flex;
        align-items: center;
        color: #fff;
        .green {
          color: #07ebad;
        }
        a {
          font-size: 12px;
          color: #fff;
          text-decoration: underline;
        }
      }
      .deposit-right {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        p {
          margin-bottom: 0px;
        }
      }
    }
  }
}

@media screen and (max-width: 750px) {
  .price-info {
    width: 100%;
  }
}
</style>
