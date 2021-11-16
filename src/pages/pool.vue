<template>
  <div class="pool-container-box">
    <!-- <div class="pool-container-hint">
      <img src="@/assets/images/tips.svg" alt="" />
      Please note that this section is only a preview version. No actual service will be executed.
    </div> -->
    <div class="container pool-container">
      <div class="c-title">
        <span>Concentrated Liquidity</span>

        <div class="buttons">
          <!-- <Tooltip placement="bottomRight">
          <template slot="title">
            <p>tooltip内容</p>
          </template> -->
          <svg class="icon" aria-hidden="true" @click="showSetting = true">
            <use xlink:href="#icon-a-bianzu81"></use>
          </svg>
          <!-- </Tooltip> -->
        </div>
      </div>
      <div class="coin-rate">
        <div v-if="fromCoin && toCoin" class="coin-text">
          <div v-if="direction">
            1 {{ fromCoin.symbol }} ≈ {{ fixD(displayCurrentprice, toCoin.decimals) }} {{ toCoin.symbol }}
          </div>
          <div v-else>
            1 {{ fromCoin.symbol }} ≈ {{ fixD(1 / displayCurrentprice, fromCoin.decimals) }} {{ toCoin.symbol }}
          </div>
        </div>
        <div v-if="fromCoin && toCoin" class="tab-coin">
          <div :class="direction ? 'active' : ''" @click="changeCoinPosition">
            {{ direction ? fromCoin.symbol : toCoin.symbol }}
          </div>
          <div :class="!direction ? 'active' : ''" @click="changeCoinPosition">
            {{ direction ? toCoin.symbol : fromCoin.symbol }}
          </div>
        </div>
      </div>
      <div class="form-block">
        <CoinBlock
          v-model="fromCoinAmount"
          :coin-name="fromCoin ? fromCoin.symbol : ''"
          :balance="fromCoin ? fromCoin.balance : null"
          :show-lock="showFromCoinLock"
          @onInput="(amount) => (fromCoinAmount = amount)"
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
          @onInput="(amount) => (toCoinAmount = amount)"
          @onFocus="
            () => {
              fixedFromCoin = false
            }
          "
          @onSelect="openCoinSelect('toCoin')"
          @onMax="maxBtnSelect('toCoin')"
        ></CoinBlock>
      </div>
      <SetPriceRange
        :from-coin="fromCoin"
        :to-coin="toCoin"
        :current-price="(poolInfo && poolInfo.currentPrice) || 0"
        :direction="direction"
        @onChangeMin="priceRangeChangeMin"
        @onChangeMax="priceRangeChangeMax"
      ></SetPriceRange>
      <PriceRangeHint v-if="invalidPriceRange"></PriceRangeHint>
      <!-- <button class="add-liquidity-btn" @click="showSuccessHint = true">Add Liquidity</button> -->
      <Button v-if="!wallet.connected" class="add-liquidity-btn" @click="$accessor.wallet.openModal"
        >Connect Wallet</Button
      >
      <Button
        v-else
        class="add-liquidity-btn"
        :disabled="suppling || isDisabled || invalidPriceRange"
        :loading="suppling"
        @click="openAddLiquiditySecondConfirm"
      >
        {{
          (fromCoinAmount && gt(fromCoinAmount, toCoin && fromCoin.balance && fromCoin.balance.fixed())) ||
          (showFromCoinLock && toCoinAmount && gt(toCoinAmount, toCoin && toCoin.balance && toCoin.balance.fixed())) ||
          (showToCoinLock &&
            fromCoinAmount &&
            gt(fromCoinAmount, toCoin && fromCoin.balance && fromCoin.balance.fixed()))
            ? 'Insufficient balance'
            : 'Add Liquidity'
        }}
      </Button>
      <div v-if="wallet.connected" class="link-block">
        <nuxt-link to="/position">
          <span>My Position</span>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-a-bianzu18"></use>
          </svg>
        </nuxt-link>
      </div>
      <Setting v-if="showSetting" @onClose="() => (showSetting = false)"></Setting>
      <WaitingHint v-if="showWaitingHint" @onClose="() => (showWaitingHint = false)"></WaitingHint>
      <SuccessHint v-if="showSuccessHint" @onClose="() => (showSuccessHint = false)"></SuccessHint>
      <CoinSelect v-if="showCoinSelect" @onClose="() => (showCoinSelect = false)" @onSelect="onCoinSelect"></CoinSelect>

      <AddLiquidityConfirm
        v-if="showAddLiquiditySecondConfirm"
        :min-price="minPrice"
        :max-price="maxPrice"
        :second-confirm-data="secondConfirmData"
        @supply="supply"
        @onClose="closeAddLiquiditySecondConfirm"
      ></AddLiquidityConfirm>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue } from 'nuxt-property-decorator'
import { mapState } from 'vuex'
import { Button } from 'ant-design-vue'
// import AddLiquidity from '../layouts/components/AddLiquidity.vue'
import WaitingHint from '../components/waiting.vue'
import SuccessHint from '../components/success.vue'
import { fixD, getUnixTs } from '../utils/index'
import { cloneDeep, get } from 'lodash-es'
import { TokenInfo, TOKENS, NATIVE_SOL, getTokenBySymbol } from '@/utils/tokens'
import { addLiquidity } from '@/utils/liquidity'
import { inputRegex, escapeRegExp } from '@/utils/regex'
import { AccountLayout, NATIVE_MINT, Token, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { publicKey, u64, u128 } from '@project-serum/borsh'
import { Account, Connection, PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js'
import { PAYER, SWAPV3_PROGRAMID, USER_POSITION_ACCOUNT } from '@/utils/ids'
import {
  tick2price,
  price2tick,
  deposit_src_calulate_dst,
  deposit_only_token_b,
  deposit_only_token_a
} from '@/tokenSwap/swapv3'
import { TokenAmount } from '@/utils/safe-math'
import { UserPosition, TokenSwapLayout, Numberu128 } from '@/tokenSwap'
import { loadAccount } from '@/tokenSwap/util/account'
import { gt } from '@/utils/safe-math'

const CUSDC = getTokenBySymbol('CUSDC')
const CUSDT = getTokenBySymbol('CUSDT')

export default Vue.extend({
  components: {
    WaitingHint,
    SuccessHint,
    Button
    // Tooltip
    // AddLiquidity
  },
  data() {
    return {
      showAddLiquidity: true,
      tokenList: [] as Array<TokenInfo>,
      fromCoin: CUSDC as TokenInfo | null,
      toCoin: CUSDT as TokenInfo | null,
      showSetting: false,
      showWaitingHint: false,
      showSuccessHint: false,
      currentCoinKey: 'fromCoin',
      toCoinRate: 0,
      showCoinSelect: false,
      fixedFromCoin: true,
      fromCoinAmount: '',
      toCoinAmount: '',
      direction: true, // true正向， false反向
      suppling: false,
      minPrice: '0',
      maxPrice: '∞',
      showFromCoinLock: false,
      showToCoinLock: false,
      deltaLiquity: 0,
      showAddLiquiditySecondConfirm: false,
      secondConfirmData: {},
      displayCurrentprice: 0 // 展示的价格
    }
  },
  computed: {
    ...mapState([
      'wallet',
      'farm',
      'url',
      // 'price',
      'liquidity'
    ]),
    // ...mapState({
    //   price: (state: any) => state.price,
    //   wallet: (state: any) => state.wallet
    // })
    poolInfo() {
      const info: any = Object.values(this.$accessor.liquidity.infos).find((p: any) => {
        return (
          (p.coin.symbol === this.fromCoin?.symbol && p.pc.symbol === this.toCoin?.symbol) ||
          (p.coin.symbol === this.toCoin?.symbol && p.pc.symbol === this.fromCoin?.symbol)
        )
      })
      return info
    },
    isDisabled(): boolean {
      const toCoin = gt(
        this.$data.toCoinAmount,
        this.$data.toCoin && this.$data.toCoin.balance && this.$data.toCoin.balance.fixed()
      )
      const fromCoin = gt(
        this.$data.fromCoinAmount,
        this.$data.fromCoin && this.$data.fromCoin.balance && this.$data.fromCoin.balance.fixed()
      )
      if (this.$data.showFromCoinLock && this.$data.toCoinAmount && this.$data.toCoin) {
        return toCoin || false
      } else if (this.$data.showToCoinLock && this.$data.fromCoinAmount && this.$data.fromCoin) {
        return fromCoin || false
      } else if (this.$data.toCoinAmount && this.$data.fromCoinAmount) {
        return fromCoin
      } else {
        return true
      }
    },
    invalidPriceRange() {
      if (Number(this.minPrice) > Number(this.maxPrice)) {
        return true
      }
      return false
    }
  },
  watch: {
    // 'price.prices'(prices: any) {
    //   this.setRate(prices)
    // },
    'wallet.tokenAccounts': {
      handler(_newTokenAccounts: any, _oldTokenAccounts: any) {
        this.updateCoinInfo(_newTokenAccounts)
      },
      deep: true
    },
    // 'liquidity.infos': {
    //   handler(_newInfos: any) {
    //     this.updateAmounts()
    //   },
    //   deep: true
    // },
    poolInfo: {
      handler(value: any) {
        if (value) {
          this.updateAmounts(value.currentPrice, this.minPrice, this.maxPrice)
          this.setDisplayCurrentprice(value.currentPrice)
        } else {
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
          if (this.fixedFromCoin && this.poolInfo) {
            this.updateAmounts(this.poolInfo.currentPrice, this.minPrice, this.maxPrice)
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
            this.updateAmounts(this.poolInfo.currentPrice, this.minPrice, this.maxPrice)
          }
        }
      })
    },
    minPrice(value: string) {
      if ((Number(value) || Number(this.maxPrice)) && this.poolInfo) {
        this.updateAmounts(this.poolInfo.currentPrice, value, this.maxPrice)
      }
    },
    maxPrice(value: string) {
      if ((Number(value) || Number(this.minPrice)) && this.poolInfo) {
        this.updateAmounts(this.poolInfo.currentPrice, this.minPrice, value)
      }
    }
  },
  mounted() {
    this.updateCoinInfo(this.wallet.tokenAccounts)
  },
  methods: {
    gt,
    fixD,
    setDisplayCurrentprice(value: any) {
      // 前端页面展示用
      const displayCurrentprice = Number(Math.pow(Number(value) / Math.pow(10, 12), 2))
      this.displayCurrentprice = displayCurrentprice
    },
    openAddLiquiditySecondConfirm() {
      const currentPriceP = Number(Math.pow(Number(this.poolInfo.currentPrice) / Math.pow(10, 12), 2))
      console.log('openAddLiquiditySecondConfirm###this.poolInfo###', this.poolInfo)

      let currentStatus = 'Active'
      if (!this.deltaLiquity) {
        currentStatus = 'Closed'
      } else if (currentPriceP >= Number(this.minPrice) && currentPriceP <= Number(this.maxPrice)) {
        currentStatus = 'Active'
      } else if (currentPriceP > Number(this.maxPrice)) {
        // 区间在当前价格的左侧时，也就是只有token b这一种资产, 返回liquity
        currentStatus = 'InActive'
      } else if (currentPriceP < Number(this.minPrice)) {
        // 区间在当前价格的右侧时，也就是只有token a这一种资产, 返回liquity
        currentStatus = 'InActive'
      }

      this.secondConfirmData = {
        fromCoin: this.fromCoin,
        toCoin: this.toCoin,
        fromCoinAmount: this.fromCoinAmount,
        toCoinAmount: this.toCoinAmount,
        currentPrice: currentPriceP,
        minPrice: this.minPrice,
        maxPrice: this.maxPrice,
        showFromCoinLock: this.showFromCoinLock,
        showToCoinLock: this.showToCoinLock,
        currentStatus,
        feeTier: this.poolInfo.fee + '%'
      }
      this.showAddLiquiditySecondConfirm = true
    },
    closeAddLiquiditySecondConfirm() {
      this.secondConfirmData = {}
      this.showAddLiquiditySecondConfirm = false
    },
    priceRangeChangeMin(value: string) {
      this.minPrice = value
    },
    priceRangeChangeMax(value: string) {
      this.maxPrice = value
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
    updateAmounts(price: string, min: string, max: string) {
      // 调用陈杨志demo是需要的 ()
      const currentPrice = Number(price) / Math.pow(10, 12)

      // 处理过的current price , 与前端价格区间比较时用
      const currentPriceP = Number(Math.pow(Number(price) / Math.pow(10, 12), 2))
      let minPrice = 0
      let maxPrice = 0
      let tick_lower: number
      let tick_upper: number

      if (min === '0' && max === '∞') {
        tick_lower = -552648
        tick_upper = 552648
      } else {
        minPrice = Number(min)
        maxPrice = Number(max)
        tick_lower = price2tick(Math.sqrt(minPrice))
        tick_upper = price2tick(Math.sqrt(maxPrice))
      }

      if (max !== '∞' && maxPrice <= minPrice) {
        this.showFromCoinLock = true
        this.fromCoinAmount = ''
        this.showToCoinLock = true
        this.toCoinAmount = ''
        return
      }

      // 区间中包含当前价格, 一种资产返回另外一种资产，并且返回liquity
      if ((currentPriceP >= minPrice && currentPriceP <= maxPrice) || max === '∞') {
        let coinAmount: any
        let direction: any
        if (this.fixedFromCoin) {
          coinAmount = new TokenAmount(this.fromCoinAmount, this.fromCoin?.decimals, false).wei.toNumber()
          direction =
            this.fromCoin?.symbol === this.poolInfo.coin.symbol && this.toCoin?.symbol === this.poolInfo.pc.symbol
              ? 0
              : 1
        } else {
          coinAmount = new TokenAmount(this.toCoinAmount, this.toCoin?.decimals, false).wei.toNumber()
          direction =
            this.toCoin?.symbol === this.poolInfo.coin.symbol && this.toCoin?.symbol === this.poolInfo.pc.symbol ? 0 : 1
        }
        // console.log('deposit_src_calulate_dst###tick_lower###', tick_lower)
        // console.log('deposit_src_calulate_dst###tick_upper###', tick_upper)
        // console.log('deposit_src_calulate_dst###coinAmount###', coinAmount)
        // console.log('deposit_src_calulate_dst###currentPrice###', currentPrice)
        // console.log('deposit_src_calulate_dst###direction###', direction)
        const { dst, delta_liquity } = deposit_src_calulate_dst(
          tick_lower,
          tick_upper,
          coinAmount,
          new Numberu128(price),
          direction
        )
        this.showFromCoinLock = false
        this.showToCoinLock = false
        const decimal = this.toCoin?.decimals || 6
        if (this.fixedFromCoin) {
          this.toCoinAmount = fixD(Math.abs(dst) / Math.pow(10, decimal), decimal) || '0'
        } else {
          this.fromCoinAmount = fixD(Math.abs(dst) / Math.pow(10, decimal), decimal) || '0'
        }

        this.deltaLiquity = delta_liquity
      } else if (currentPriceP > maxPrice) {
        // 区间在当前价格的左侧时，也就是只有token b这一种资产, 返回liquity
        const coinAmount = new TokenAmount(this.toCoinAmount, this.toCoin?.decimals, false).wei.toNumber()
        const delta_liquity = deposit_only_token_b(tick_lower, tick_upper, coinAmount)
        this.showFromCoinLock = true
        this.fromCoinAmount = ''
        this.showToCoinLock = false
        this.deltaLiquity = delta_liquity
      } else if (currentPriceP < minPrice) {
        // 区间在当前价格的右侧时，也就是只有token a这一种资产, 返回liquity
        const coinAmount = new TokenAmount(this.fromCoinAmount, this.fromCoin?.decimals, false).wei.toNumber()
        const delta_liquity = deposit_only_token_a(tick_lower, tick_upper, coinAmount)
        this.showFromCoinLock = false
        this.showToCoinLock = true
        this.toCoinAmount = ''
        this.deltaLiquity = delta_liquity
      }
    },
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
      this.direction = !this.direction
      const tempFromCoin = this.fromCoin
      const tempToCoin = this.toCoin
      this.fromCoin = tempToCoin
      this.toCoin = tempFromCoin

      const tempFromCoinAmount = this.fromCoinAmount
      const tempToCoinAmount = this.toCoinAmount

      this.fromCoinAmount = tempToCoinAmount
      this.toCoinAmount = tempFromCoinAmount
    },
    async findMyNfts(tokenAccounts: any) {
      const list: any = []
      const data = await loadAccount(
        this.$web3,
        // new PublicKey('DRYzQS2U4mGxCb3j7yHKmRK2eV2469V1APx9yZp5w6pH'),
        new PublicKey(this.poolInfo.tokenSwapAccount),
        SWAPV3_PROGRAMID
      )
      const tokenSwapData = TokenSwapLayout.decode(data)

      const length = tokenSwapData.user_position_index
      const priceDecimal = 8
      const currentPrice = Numberu128.fromBuffer(tokenSwapData.current_price).toNumber() / Math.pow(10, priceDecimal)

      let userPositions = await UserPosition.loadUserPosition(
        this.$web3,
        // USER_POSITION_ACCOUNT.publicKey,
        // new PublicKey('5Ebakc2jDciMUjnXyAEUCgq7sQbdzGJcApLKKfUvTj5U'),
        new PublicKey(this.poolInfo.userPositionKey),
        SWAPV3_PROGRAMID,
        length
      )

      const userPositionObj: any = {}
      for (let i = 0; i < length; i++) {
        let userPosition = userPositions[i]
        userPositionObj[userPosition.nft_token_id.toString()] = userPosition
      }
      for (const key in tokenAccounts) {
        const tokenAccountAddress = tokenAccounts[key].tokenAccountAddress
        if (userPositionObj[tokenAccountAddress]) {
          const item = userPositionObj[tokenAccountAddress]
          list.push({
            nftMint: new PublicKey(key),
            ...item
          })
        }
      }
      return list
    },
    async supply() {
      const myNfts = await this.findMyNfts(this.wallet.tokenAccounts)

      this.suppling = true

      const conn = this.$web3
      const wallet = (this as any).$wallet

      const poolInfo: any = Object.values(this.$accessor.liquidity.infos).find((p: any) => {
        return (
          (p.coin.symbol === this.fromCoin?.symbol && p.pc.symbol === this.toCoin?.symbol) ||
          (p.coin.symbol === this.toCoin?.symbol && p.pc.symbol === this.fromCoin?.symbol)
        )
      })

      // @ts-ignore
      const fromCoinAccount = get(this.wallet.tokenAccounts, `${this.fromCoin.mintAddress}.tokenAccountAddress`)
      // @ts-ignore
      const toCoinAccount = get(this.wallet.tokenAccounts, `${this.toCoin.mintAddress}.tokenAccountAddress`)

      const key = getUnixTs().toString()
      this.$notify.info({
        key,
        message: 'Making transaction...',
        description: '',
        duration: 0,
        icon: this.$createElement('img', { class: { 'notify-icon': true }, attrs: { src: '/tanhao@2x.png' } })
      })

      let tick_lower: number
      let tick_upper: number
      if (this.minPrice === '0' && this.maxPrice === '∞') {
        tick_lower = -552648
        tick_upper = 552648
      } else {
        tick_lower = price2tick(Math.sqrt(Number(this.minPrice)))
        tick_upper = price2tick(Math.sqrt(Number(this.maxPrice)))
      }

      let nftMintToken: any
      let userNftPubkey: any
      if (myNfts.length > 0) {
        for (let i = 0; i < myNfts.length; i++) {
          if (
            myNfts[i].lower_tick === tick_lower &&
            myNfts[i].upper_tick === tick_upper &&
            myNfts[i].liquity === Number(fixD(this.deltaLiquity, 0))
          ) {
            nftMintToken = myNfts[i].nftMint
            userNftPubkey = myNfts[i].nft_token_id
            break
          }
        }
      }

      if (!nftMintToken && !userNftPubkey) {
        const nftMintTokenAccount = await Token.createMint(
          conn,
          PAYER,
          // tokenSwap.authority,
          new PublicKey(poolInfo.authority),
          null,
          0,
          TOKEN_PROGRAM_ID
        )
        nftMintToken = nftMintTokenAccount.publicKey
        userNftPubkey = await nftMintTokenAccount.createAccount(wallet.publicKey)
      }

      // console.log('supply####this.fromCoinAmount#####', this.fromCoinAmount)
      // console.log('supply#####this.toCoinAmount#####', this.toCoinAmount)
      // console.log('supply#####this.$accessor.slippage#####', this.$accessor.slippage)

      let fromCoinAmount: any
      if (this.fromCoinAmount) {
        fromCoinAmount = Number(this.fromCoinAmount) * (1 + Number(this.$accessor.slippage) / 100)
      }

      let toCoinAmount: any
      if (this.toCoinAmount) {
        toCoinAmount = Number(this.toCoinAmount) * (1 + Number(this.$accessor.slippage) / 100)
      }

      console.log('supply考虑滑点后####fromCoinAmount####', fromCoinAmount)
      console.log('supply考虑滑点后####toCoinAmount####', toCoinAmount)
      console.log('tick_lower', tick_lower)
      console.log('tick_upper', tick_upper)

      console.log('pool.vue###this.deltaLiquity####', this.deltaLiquity)

      addLiquidity(
        conn,
        wallet,
        poolInfo,
        nftMintToken,
        userNftPubkey,
        fromCoinAccount,
        toCoinAccount,
        this.fromCoin,
        this.toCoin,
        // this.fromCoinAmount,
        // String(Number(this.toCoinAmount) * 1.01), // 先手动考虑1%划点
        fromCoinAmount,
        toCoinAmount,
        tick_lower,
        tick_upper,
        this.deltaLiquity
        // Number(fixD(this.deltaLiquity, 0))
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

          const description = `Add liquidity for ${this.fromCoinAmount} ${this.fromCoin?.symbol} and ${this.toCoinAmount} ${this.toCoin?.symbol}`
          this.$accessor.transaction.sub({ txid, description })
        })
        .catch((error) => {
          this.$notify.error({
            key,
            message: 'Add liquidity failed',
            description: error.message,
            class: 'error',
            icon: this.$createElement('img', { class: { 'notify-icon': true }, attrs: { src: '/icon_Error@2x.png' } })
          })
        })
        .finally(() => {
          this.suppling = false
          this.fromCoinAmount = ''
          this.toCoinAmount = ''
        })
    }
  }
})
</script>
<style lang="less" scoped>
@import '../styles/base.less';
.pool-container {
  width: 492px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 30px;
  .form-block {
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
        // &:hover {
        //   background-image: url('../assets/images/add_hover@2x.png');
        // }
      }
    }
  }
  .coin-rate {
    display: flex;
    justify-content: space-between;
    align-items: center;
    line-height: 1;
    margin-bottom: 20px;

    .coin-text {
      font-weight: 700;
      color: #fff;
      font-size: 16px;
      // background: angular-gradient(214deg, #59bdad 0%, #6676f5 61%, #9a89f9 76%, #eba7ff 100%);
      background: linear-gradient(to right, #59bdad, #6676f5, #9a89f9, #eba7ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .tab-coin {
      display: flex;
      align-items: center;
      padding: 3px;
      height: 26px;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.1);
      div {
        height: 20px;
        padding: 4px 10px;
        cursor: pointer;
        &.active {
          padding: 4px 12px;
          height: 20px;
          background: linear-gradient(214deg, #59bdad 0%, #6676f5 61%, #9a89f9 76%, #eba7ff 100%);
          border-radius: 4px;
          cursor: pointer;
        }
      }
    }
  }
  .add-liquidity-btn {
    font-weight: bold;
    color: #fff;
    font-size: 20px;
    .gradient-btn-large();
    margin-top: 20px;
  }
  .link-block {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
    > a {
      font-size: 14px;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      svg {
        width: 20px;
        height: 20px;
        fill: #fff;
      }
    }
  }
}
.pool-container-hint {
  width: 492px;
  padding: 20px;
  margin: auto;
  // height: 38px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 30px;
  margin-bottom: 10px;
  font-size: 12px;
  color: rgba(#fff, 0.6);
  display: flex;
  align-items: center;
  img {
    width: 20px;
    height: 20px;
    margin-right: 10px;
  }
}
@media screen and (max-width: 750px) {
  .pool-container {
    width: 343px;
  }
  .pool-container-hint {
    width: 343px;
    margin-top: 10px;
  }
}
</style>
