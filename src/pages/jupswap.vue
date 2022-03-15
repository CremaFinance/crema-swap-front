<template>
  <div class="swap-wrapper">
    <!-- <div class="powerd">
      <span>Powered by</span>
      <img src="../assets/images/jupiter-logo.png" />
      <span>Jupiter</span>
    </div> -->
    <SwapTab></SwapTab>

    <!-- <div class="error-note">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-error"></use>
      </svg>
      <p>High price impact.Price impact is more than 5%.Yor are likely to lose money with this trade.</p>
    </div> -->
    <div class="swap-container">
      <div class="swap-content">
        <div class="top c-title">
          <span>Swap</span>
          <div class="buttons">
            <div class="icon-box">
              <svg :class="['icon', isLoading ? 'is-loading' : '']" aria-hidden="true" @click="refresh">
                <use xlink:href="#icon-icon-refresh"></use>
              </svg>
            </div>
            <div style="width: 8px"></div>
            <SetIcon></SetIcon>
          </div>
        </div>

        <div class="form-box">
          <CoinBlockJup
            v-model="fromCoinAmount"
            :coin-name="fromCoin ? fromCoin.symbol : null"
            :balance="fromCoin ? fromCoin.balance : null"
            :swap-direction="'From'"
            :coin-item="fromCoin"
            @onInput="(amount) => (fromCoinAmount = amount)"
            @onFocus="
              () => {
                fixedFromCoin = true
              }
            "
            @onMax="maxBtnSelect('fromCoin')"
            @onSelect="openCoinSelect('fromCoin')"
          ></CoinBlockJup>

          <div v-if="currentRoute && currentRoute.priceImpactPct > 0.05" class="note-block">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-icon-tips"></use>
            </svg>
            <span>High price impact.</span>
          </div>

          <div v-else-if="currentRoute && currentRoute.priceImpactPct > 0.02" class="note-block">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-icon-tips"></use>
            </svg>
            <span>Your order is too big, try reducing your order.</span>
          </div>

          <div class="change-icon">
            <a @click="changeCoinPosition"></a>
          </div>
          <ToCoinBlock
            :coin-name="toCoin ? toCoin.symbol : null"
            :balance="toCoin ? toCoin.balance : null"
            :coin-item="toCoin"
            :swap-routes="swapRoutes"
            :from-coin="fromCoin"
            :deposit-and-fee="depositAndFee"
            :show-more="showMore"
            :routes-is-loading="routesIsLoading"
            :from-coin-amount="fromCoinAmount"
            @onSelect="openCoinSelect('toCoin')"
            @changeAmount="changeToCoinAmount"
            @changeRoute="changeRoute"
          ></ToCoinBlock>
        </div>
        <div v-if="Number(fromCoinAmount) && !routesIsLoading" class="price-rates-box">
          <div v-if="swapRoutes && swapRoutes.length > 4" class="price-rates" @click="showMore = !showMore">
            <!-- <span>From {{swapRoutes[3].outAmount / Math.pow(10, toCoin.decimals), toCoin.decimals}} to 100.009291</span> -->
            <span
              >From
              {{
                decimalFormat(
                  swapRoutes[swapRoutes.length - 1].outAmount / Math.pow(10, toCoin.decimals),
                  toCoin.decimals
                )
              }}
              to {{ decimalFormat(swapRoutes[3].outAmount / Math.pow(10, toCoin.decimals), toCoin.decimals) }}
            </span>
            <svg :class="['icon', showMore ? 'up' : '']" aria-hidden="true">
              <use xlink:href="#icon-icon-on"></use>
            </svg>
          </div>
        </div>
        <Button v-if="!wallet.connected" class="swap-btn" @click="$accessor.wallet.openModal"> Connect Wallet </Button>
        <Button
          v-else
          class="swap-btn"
          :disabled="
            swaping || !fromCoin || !toCoin || !Number(fromCoinAmount) || insufficient || checkNullObj(currentRoute)
          "
          :loading="swaping"
          @click="placeOrder"
        >
          {{ insufficient ? 'Insufficient Balance' : 'Swap' }}
        </Button>
        <CoinSelectJup
          v-if="showCoinSelect"
          :existing-coins="existingCoins"
          :last-select-coin="lastSelectCoin"
          :s-list="possiblePairsList"
          @onClose="() => (showCoinSelect = false)"
          @onSelect="onCoinSelect"
        ></CoinSelectJup>
      </div>
      <PriceInfo
        v-if="Number(fromCoinAmount)"
        :deposit-and-fee="depositAndFee"
        :swap-routes="swapRoutes"
        :current-route="currentRoute"
        :from-coin="fromCoin"
        :to-coin="toCoin"
        :routes-is-loading="routesIsLoading"
        :from-coin-amount="fromCoinAmount"
        @updateAmounts="updateAmounts"
      ></PriceInfo>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { TokenInfo, getTokenBySymbol } from '@/utils/tokens'
import bs58 from 'bs58'
// import fetch from 'node-fetch'
import { Connection, PublicKey, Keypair } from '@solana/web3.js'
import { Jupiter, TOKEN_LIST_URL } from '@jup-ag/core'
import { cloneDeep, debounce } from 'lodash'
import { inputRegex, escapeRegExp } from '@/utils/regex'
import { decimalFormat, getUnixTs, checkNullObj } from '@/utils'
import { TokenAmount, gt } from '@/utils/safe-math'
import { Button } from 'ant-design-vue'

// const CUSDT = getTokenBySymbol('CUSDT')
// const CUSDC = getTokenBySymbol('CUSDC')

const SOLANA_RPC_ENDPOINT = 'https://solana-api.projectserum.com'
// const SOLANA_RPC_ENDPOINT = 'https://connect.runnode.com/?apikey=PMkQIG6CxY0ybWmaHRHJ'
// const SOLANA_RPC_ENDPOINT = 'https://mercurial.rpcpool.com'
// const SOLANA_RPC_ENDPOINT = 'https://mainnet.rpcpool.com'
/* *******************
 ** Wallet/Keypair of Swapper
 * *******************/

export default Vue.extend({
  components: {
    Button
  },
  data() {
    return {
      // fromCoin: CUSDT as TokenInfo | null,
      // toCoin: CUSDC as TokenInfo | null,
      fromCoin: null as any,
      toCoin: null as any,
      fromCoinAmount: '',
      toCoinAmount: '',
      showCoinSelect: false,
      existingCoins: '',
      lastSelectCoin: '',
      currentCoinKey: 'fromCoin',
      fixedFromCoin: true,
      tokenIsLoading: true,
      tokens: [] as any,
      jupiter: null as any,
      possiblePairsList: [] as any,
      tokensObj: {} as any,
      swapRoutes: [] as any,
      depositAndFee: {} as any,
      currentRoute: {} as any,
      showMore: false, // show more routes
      routesIsLoading: false,
      isLoading: false,
      swaping: false
    }
  },
  computed: {
    ...mapState(['wallet', 'url', 'swap']),
    insufficient(): boolean {
      return gt(
        Number(this.fromCoinAmount),
        this.fromCoin && this.fromCoin.balance ? Number(this.fromCoin.balance.fixed()) : 0
      )
    }
  },
  watch: {
    'wallet.originPub': {
      handler: 'originPubWatch',
      immediate: true
    },
    'wallet.tokenAccounts': {
      handler: 'tokenAccountsWatch',
      immediate: true
    },
    'swap.tokensObj': {
      handler: 'swapTokensObjWatch',
      immediate: true
    },
    fromCoinAmount: debounce(function (newAmount: string, oldAmount: string) {
      this.$nextTick(() => {
        if (!inputRegex.test(escapeRegExp(newAmount))) {
          this.fromCoinAmount = oldAmount
        } else {
          if (this.fixedFromCoin) {
            this.updateAmounts()
          }
        }
      })
    }, 1000),
    async currentRoute(info: any) {
      if (info) {
        const route: any = cloneDeep(info)
        // console.log('route####', route)
        const depositAndFee = await route.getDepositAndFee()
        // console.log('depositAndFee####', depositAndFee)
        this.depositAndFee = cloneDeep(depositAndFee)
      }
    },
    fromCoin(newVal: any, oldVal: any) {
      this.updateAmounts()
    },
    toCoin(newVal: any, oldVal: any) {
      this.updateAmounts()
    }
  },
  created() {},
  mounted() {
    this.isLoading = true
    this.$accessor.swap.getTokens()
    this.updateAmounts()
  },
  methods: {
    checkNullObj,
    decimalFormat,
    refresh() {
      this.$accessor.wallet.getTokenAccounts()
      this.updateAmounts()
    },
    tokenAccountsWatch(tokenAccounts: any) {
      if (tokenAccounts) {
        this.setCoinBalance('fromCoin', tokenAccounts)
        this.setCoinBalance('toCoin', tokenAccounts)
      }
    },
    setCoinBalance(key: string, tokenAccounts?: any) {
      const account: any = tokenAccounts || this.wallet.tokenAccounts
      let balance: TokenAmount = new TokenAmount(0)
      if (this[key]) {
        if (account[this[key].address]) {
          balance = account[this[key].address].balance
        }
        if (
          this[key].address === 'So11111111111111111111111111111111111111112' &&
          account['11111111111111111111111111111111']
        ) {
          balance = account['11111111111111111111111111111111'].balance
        }
        this[key] = {
          ...this[key],
          balance
        }
      }
    },
    changeRoute(route: any) {
      this.currentRoute = route
    },
    swapTokensObjWatch(objs: any) {
      this.tokensObj = objs
      this.isLoading = false
      //
      if (objs && !this.fromCoin && !this.toCoin) {
        // this.fromCoin = objs['So11111111111111111111111111111111111111112']
        // usdt
        // eslint-disable-next-line dot-notation
        this.fromCoin = objs['Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB']

        //usdc
        // eslint-disable-next-line dot-notation
        this.toCoin = objs['EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v']
        setTimeout(() => {
          this.setCoinBalance('fromCoin')
          this.setCoinBalance('toCoin')
        }, 1000)
      }
    },
    setPossiblePairs(value: any) {
      if (!this.jupiter) {
        this.possiblePairsList = this.swap.tokens
        return
      }
      if (!value) {
        this.possiblePairsList = []
        return
      }
      const routeMap = this.jupiter.getRouteMap()
      const possiblePairs: any = routeMap.get(value.address) // return an array of token mints that can be swapped with SOL
      const possiblePairsTokenInfo: any = {}
      let possiblePairsList: any = []
      const tokenAccounts: any = this.wallet.tokenAccounts
      possiblePairs.forEach((address: string) => {
        const item = this.swap.tokens.find((t: any) => {
          return t.address == address
        })
        if (item) {
          const ad =
            item.address === 'So11111111111111111111111111111111111111112'
              ? '11111111111111111111111111111111'
              : item.address
          const balance = tokenAccounts[ad] ? tokenAccounts[ad].balance.fixed() : 0
          // eslint-disable-next-line dot-notation
          item['balance2'] = balance
          possiblePairsTokenInfo[address] = item
        }
      })

      function compare() {
        return function (a, b) {
          return b.balance2 - a.balance2
        }
      }
      possiblePairsList = Object.values(possiblePairsTokenInfo).sort(compare())
      this.possiblePairsList = possiblePairsList
    },
    async originPubWatch(originPub: any) {
      // if (originPub) {
      // this.jupMain(originPub)
      // }
      if (originPub) {
        const connection = new Connection(SOLANA_RPC_ENDPOINT)
        const jupiter = await Jupiter.load({
          connection,
          cluster: 'mainnet-beta',
          // user: USER_KEYPAIR // or public key
          user: originPub // or public key
        })
        this.jupiter = jupiter
        this.updateAmounts()
      }
    },
    async updateAmounts() {
      // eslint-disable-next-line no-useless-return
      if (!this.fromCoin || !this.toCoin || !Number(this.fromCoinAmount)) return

      const slippagePercentage = Number(this.$accessor.slippage)
      const inputAmount = parseInt(String(Number(this.fromCoinAmount) * 10 ** this.fromCoin.decimals))
      const defaultInputAmount = parseInt(String(1 * 10 ** this.fromCoin.decimals))
      if (inputAmount) {
        this.isLoading = true
        this.routesIsLoading = true
        try {
          let jupiter: any = null
          // if (!this.jupiter) {
          //   const connection = new Connection(SOLANA_RPC_ENDPOINT)
          //   jupiter = await Jupiter.load({
          //     connection,
          //     cluster: 'mainnet-beta'
          //     // user: USER_KEYPAIR // or public key
          //   })
          //   this.jupiter = jupiter
          // } else {
          //   jupiter = cloneDeep(this.jupiter)
          // }
          const connection = new Connection(SOLANA_RPC_ENDPOINT)
          if (!this.wallet.originPub) {
            jupiter = await Jupiter.load({
              connection,
              cluster: 'mainnet-beta'
            })
          } else {
            jupiter = await Jupiter.load({
              connection,
              cluster: 'mainnet-beta',
              user: this.wallet.originPub
            })
          }

          const routes: any = await jupiter.computeRoutes({
            inputMint: new PublicKey(this.fromCoin.address),
            outputMint: new PublicKey(this.toCoin.address),
            // inputAmount || defaultInputAmount,
            inputAmount,
            slippage: slippagePercentage,
            forceFetch: true
          })
          // const routesResult = routes.routesInfos || routes
          const droutes = cloneDeep(routes)
          const routesResult = Array.isArray(droutes) ? droutes : droutes.routesInfos
          const newRoutesResult = routesResult.filter((item) => {
            return item.outAmount
          })
          // console.log('routesResult####', routesResult)
          // console.log('newRoutesResult####', newRoutesResult)
          // this.swapRoutes = routesResult
          // this.currentRoute = (routesResult && routesResult[0]) || {}
          this.swapRoutes = newRoutesResult
          this.currentRoute = (newRoutesResult && newRoutesResult[0]) || {}
          this.routesIsLoading = false
          this.isLoading = false
        } catch (err) {
          console.log('computeRoutes##error###', err)
          this.isLoading = false
        }
      }
    },
    changeToCoinAmount() {},
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
    openCoinSelect(key: string) {
      this.currentCoinKey = key

      if (key === 'fromCoin') {
        this.setPossiblePairs(this.toCoin)
        this.existingCoins = this.toCoin?.symbol || ''
        this.lastSelectCoin = this.fromCoin?.symbol || ''
      } else {
        this.setPossiblePairs(this.fromCoin)
        this.existingCoins = this.fromCoin?.symbol || ''
        this.lastSelectCoin = this.toCoin?.symbol || ''
      }
      // existingCoins
      this.showCoinSelect = true
    },
    onCoinSelect(item: any) {
      const token = cloneDeep(item)
      // eslint-disable-next-line no-console
      token.balance = new TokenAmount(0)
      if (this.wallet.connected) {
        if (this.wallet.tokenAccounts && this.wallet.tokenAccounts[token.address]) {
          // eslint-disable-next-line dot-notation
          token['balance'] = this.wallet.tokenAccounts[token.address].balance
        } else if (this.wallet.tokenAccounts && token.address === 'So11111111111111111111111111111111111111112') {
          // eslint-disable-next-line dot-notation
          token['balance'] = this.wallet.tokenAccounts['11111111111111111111111111111111'].balance
        }
      }

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
    async placeOrder() {
      this.swaping = true
      const jupiter = cloneDeep(this.jupiter)
      const { execute } = await jupiter.exchange({
        // route: this.swapRoutes[0]
        routeInfo: this.currentRoute
      })
      const connection = new Connection(SOLANA_RPC_ENDPOINT)
      const wallet: any = this.$wallet

      const toCoinAmount = decimalFormat(
        String(this.currentRoute.outAmount / Math.pow(10, this.toCoin.decimals)),
        this.toCoin.decimals
      )

      this.$accessor.transaction.setTransactionDesc(
        `Swap ${this.fromCoinAmount} ${this.fromCoin?.symbol} to ${toCoinAmount} ${this.toCoin?.symbol}`
      )
      this.$accessor.transaction.setShowWaiting(true)

      const swapResult: any = await execute({
        // wallet: {
        //   sendTransaction: wallet.sendTransaction,
        //   // publicKey: wallet.publicKey,
        //   signAllTransactions: wallet.signAllTransactions,
        //   signTransaction: wallet.signTransaction
        // },
        wallet,
        confirmationWaiterFactory: async (txid) => {
          await connection.confirmTransaction(txid)

          return await connection.getTransaction(txid, {
            commitment: 'confirmed'
          })
        }
      })
      if (swapResult.error) {
        this.$accessor.transaction.setShowWaiting(false)
        const key = getUnixTs().toString()
        this.$notify.error({
          key,
          message: 'Swap failed',
          description: swapResult.error.message,
          class: 'error',
          icon: this.$createElement('img', { class: { 'notify-icon': true }, attrs: { src: '/icon_Error@2x.png' } })
        })
      } else {
        const description = `Swap ${this.fromCoinAmount} ${this.fromCoin?.symbol} to ${toCoinAmount} ${this.toCoin?.symbol}`
        this.$accessor.transaction.sub({ txid: swapResult.txid, description })
        this.$accessor.transaction.setShowSubmitted(true)
      }
      this.swaping = false
    }
  }
})
</script>
<style lang="less" scoped>
@import '../styles/base.less';
// .swap-container {
// }
.powerd {
  width: 170px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  margin-bottom: 20px;
  span {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.6);
  }
  img {
    width: 16px;
    height: 16px;
    margin: 0px 4px;
  }
}

// .error-note {
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   width: 492px;
//   height: 68px;
//   background: linear-gradient(270deg, #3e434e 0%, #292d33 100%);
//   border-radius: 16px;
//   border: 1px solid #3f434e;
//   margin: 0 auto;
//   padding: 12px;
//   margin-bottom: 12px;
//   p {
//     font-size: 14px;
//     color: #ff5073;
//     margin-bottom: 0px;
//     padding-left: 10px;
//   }
//   svg {
//     width: 24px;
//     height: 24px;
//     fill: #ff5073;
//   }
// }

.swap-content {
  width: 492px;
  // height: 682px;
  background: linear-gradient(270deg, #3e434e 0%, #292d33 100%);
  border-radius: 20px;
  border: 1px solid #3f434e;
  margin: 0 auto;
  padding: 20px 16px;
  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 20px;
    > span {
      font-size: 20px;
      color: #fff;
    }
    .buttons {
      display: flex;
      align-items: center;
      .is-loading {
        animation: spin 1s linear infinite;
      }
    }
  }
  .form-box {
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
    .note-block {
      display: flex;
      align-items: center;
      margin-top: 12px;
      span {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.5);
        margin-left: 4px;
      }
      svg {
        width: 20px;
        height: 20px;
        fill: rgba(255, 255, 255, 0.5);
      }
    }
  }
  .price-rates-box {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 16px;
    .price-rates {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 197px;
      padding: 0px 8px;
      height: 24px;
      background: linear-gradient(270deg, #3e434e 0%, #282a2f 100%);
      box-shadow: 0px 4px 12px 0px rgba(26, 28, 31, 0.5);
      border-radius: 7px;
      border: 1px solid #3f434e;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.5);
      margin: 0 auto;
      cursor: pointer;
      svg {
        width: 12px;
        height: 12px;
        fill: rgba(255, 255, 255, 0.5);
        &.up {
          transform: rotate(180deg);
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

@keyframes spin {
  to {
    transform: rotate(1turn);
  }
}

@media screen and (max-width: 750px) {
  // .container {
  //   margin-top: 20px;
  //   width: 100%;
  //   padding: 20px 10px;
  .swap-wrapper {
    padding-bottom: 20px;
  }
  .powerd {
    margin-top: 20px;
  }
  .swap-content {
    width: 100%;
    padding: 20px 10px;
  }
  // }
}
</style>
