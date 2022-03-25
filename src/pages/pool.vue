<template>
  <div class="pool-container">
    <div v-if="wallet.connected" class="link-block">
      <nuxt-link to="/position">
        <img src="../assets/images/icon-position@2x.png" />
        <span>My Position</span>
        <!-- <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-a-bianzu18"></use>
        </svg> -->
      </nuxt-link>
    </div>
    <div class="pool-body">
      <div class="top">
        <div class="c-title"><span>Concentrated Liquidity</span></div>
        <!-- <h3 class="title"></h3> -->
        <div class="right">
          <a class="clear-all" @click="clearAll">Clear All</a>
          <CoinTab
            v-if="fromCoin && toCoin"
            :list="coinTabList"
            :current="currentCoinTab"
            @onChange="changeDirection"
          ></CoinTab>
          <SetIcon></SetIcon>
        </div>
      </div>
      <div class="pool-content">
        <div class="left">
          <div v-if="poolInfo" class="price-box">
            <span>Current Price</span>
            <div v-if="fromCoin && toCoin" class="right">
              <div v-if="direction">
                1 {{ fromCoin.symbol }} ≈ {{ decimalFormat(poolInfo.currentPriceView, toCoin.decimals) }}
                {{ toCoin.symbol }}
              </div>
              <div v-else>
                1 {{ fromCoin.symbol }} ≈ {{ decimalFormat(poolInfo.currentPriceViewReverse, toCoin.decimals) }}
                {{ toCoin.symbol }}
              </div>
            </div>
          </div>
          <div class="form-box">
            <CoinBlock
              v-model="fromCoinAmount"
              :coin-name="fromCoin ? fromCoin.symbol : null"
              :balance="fromCoinBalance || null"
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
              <!-- <svg class="icon" aria-hidden="true" @click="changeCoinPosition">
                <use xlink:href="#icon-a-icon-AddCustomMarket"></use>
              </svg> -->
              <a @click="changeCoinPosition"></a>
            </div>
            <CoinBlock
              v-model="toCoinAmount"
              :coin-name="toCoin ? toCoin.symbol : null"
              :balance="toCoinBalance || null"
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
          <div class="fee-tier-box">
            <FeeTier :current="currentFeeTier"></FeeTier>
          </div>
        </div>
        <div class="right">
          <div class="set-price-range-chart-box">
            <!-- <SetPriceRangeChart
              v-if="poolInfo && !checkNullObj(poolInfo.userPositionAccountObj)"
              :pool-info="poolInfo"
              :min-price="minPrice"
              :max-price="maxPrice"
              :direction="direction"
              @onChangeMinPrice="priceRangeChangeMin"
              @onChangeMaxPrice="priceRangeChangeMax"
            ></SetPriceRangeChart> -->

            <D3Chart
              v-if="poolInfo && !checkNullObj(poolInfo.userPositionAccountObj)"
              :pool-info="poolInfo"
              :min-price="minPrice"
              :max-price="maxPrice"
              :direction="direction"
              @onChangeMinPrice="priceRangeChangeMin"
              @onChangeMaxPrice="priceRangeChangeMax"
            ></D3Chart>

            <img v-else src="../assets/images/chart-nodata.png" />
          </div>
          <div v-if="poolInfo" class="set-price-block-box">
            <SetPriceBlock
              :min="minPrice"
              :max="maxPrice"
              :from-coin="fromCoin"
              :to-coin="toCoin"
              :direction="direction"
              :invalid-price-range="invalidPriceRange"
              :default-max-price="defaultMaxPrice"
              :tick-space="poolInfo.tick_space"
              @onChangeMinPrice="priceRangeChangeMin"
              @onChangeMaxPrice="priceRangeChangeMax"
            ></SetPriceBlock>
          </div>
          <Button v-if="!wallet.connected" class="add-liquidity-btn" @click="$accessor.wallet.openModal"
            >Connect Wallet</Button
          >
          <Button
            v-else
            class="add-liquidity-btn"
            :disabled="!poolInfo || suppling || isDisabled || noEnterAmount || invalidPriceRange || insufficientBalance"
            :loading="suppling"
            @click="openAddLiquiditySecondConfirm"
          >
            <!-- {{ insufficientBalance ? 'Insufficient balance' : 'Add Liquidity' }} -->
            <!-- {{ noEnterAmount ? 'Enter an amount' : insufficientBalance ? 'Insufficient balance' : 'Add Liquidity' }} -->
            {{ addLiquidityBtnText }}
          </Button>
        </div>
      </div>
    </div>

    <CoinSelect
      v-if="showCoinSelect"
      :existing-coins="existingCoins"
      :last-select-coin="lastSelectCoin"
      @onClose="() => (showCoinSelect = false)"
      @onSelect="onCoinSelect"
    ></CoinSelect>

    <AddLiquidityConfirm
      v-if="showAddLiquiditySecondConfirm"
      :min-price="minPrice"
      :max-price="maxPrice"
      :second-confirm-data="secondConfirmData"
      @supply="supply"
      @onClose="closeAddLiquiditySecondConfirm"
    ></AddLiquidityConfirm>
  </div>
</template>

<script lang="ts">
import { Vue } from 'nuxt-property-decorator'
import { mapState } from 'vuex'
import { Button, Icon } from 'ant-design-vue'
// import AddLiquidity from '../layouts/components/AddLiquidity.vue'
// import WaitingHint from '@/components/waiting.vue'
// import SuccessHint from '@/components/success.vue'
import { fixD, getUnixTs, decimalFormat, checkNullObj } from '../utils/index'
import { cloneDeep, get } from 'lodash-es'
import { TokenInfo, TOKENS, NATIVE_SOL, getTokenBySymbol } from '@/utils/tokens'
import { addLiquidityNew } from '@/utils/liquidity'
import { inputRegex, escapeRegExp } from '@/utils/regex'
import {
  tick2price,
  price2tick,
  getNearestTick,
  deposit_src_calulate_dst,
  deposit_only_token_b,
  deposit_only_token_a
} from '@/tokenSwap/swapv3'
import { TokenAmount, gt } from '@/utils/safe-math'
import { LIQUIDITY_POOLS } from '@/utils/pools'
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
import Decimal from 'decimal.js'
import { PublicKey } from '@solana/web3.js'
import { SWAPV3_PROGRAMID } from '@/utils/ids'

const USDT = getTokenBySymbol('USDT')
const USDC = getTokenBySymbol('USDC')

export default Vue.extend({
  components: {
    Button
  },
  data() {
    return {
      showAddLiquidity: true,
      tokenList: [] as Array<TokenInfo>,
      fromCoin: USDT as TokenInfo | null,
      toCoin: USDC as TokenInfo | null,
      defaultFromCoin: USDT as TokenInfo | null,
      defaultToCoin: USDC as TokenInfo | null,
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
      minPrice: '',
      maxPrice: '',
      defaultMinPrice: '',
      defaultMaxPrice: '',
      showFromCoinLock: false,
      showToCoinLock: false,
      deltaLiquity: 0,
      showAddLiquiditySecondConfirm: false,
      secondConfirmData: {},
      existingCoins: '',
      lastSelectCoin: '',
      currentPriceIsLoading: true,
      coinTabList: [] as any,
      currentCoinTab: '',
      currentFeeTier: 0,
      ifFirstDirectionChange: false
      // poolInfo: null as any
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
    addLiquidityBtnText() {
      // {{ noEnterAmount ? 'Enter an amount' : insufficientBalance ? 'Insufficient balance' : 'Add Liquidity' }}
      console.log('this.minPrice#####', this.minPrice)
      console.log('this.maxPrice#####', this.maxPrice)
      if (!this.fromCoin && !this.toCoin) {
        return 'Select a token'
      } else if (!this.poolInfo) {
        return 'Pool not found'
      } else if (this.noEnterAmount) {
        return 'Enter an amount'
      } else if (this.maxPrice !== '∞' && Number(fixD(this.minPrice, 4)) >= Number(fixD(this.maxPrice, 4))) {
        return 'Invalid Range'
      } else if (this.insufficientBalance) {
        return 'Insufficient balance'
      }

      return 'Add Liquidity'
    },
    poolInfo() {
      const info: any = Object.values(this.$accessor.liquidity.infos).find((p: any) => {
        return (
          (p.coin.symbol === this.fromCoin?.symbol && p.pc.symbol === this.toCoin?.symbol) ||
          (p.coin.symbol === this.toCoin?.symbol && p.pc.symbol === this.fromCoin?.symbol)
        )
      })
      return info
    },
    fromCoinBalance(): any {
      if (this.fromCoin && this.fromCoin.mintAddress && this.wallet.tokenAccounts) {
        return this.wallet.tokenAccounts[this.fromCoin.mintAddress]?.balance || 0
      }
      return 0
    },
    toCoinBalance(): any {
      if (this.toCoin && this.toCoin.mintAddress && this.wallet.tokenAccounts) {
        return this.wallet.tokenAccounts[this.toCoin.mintAddress]?.balance || 0
      }
      return 0
    },
    insufficientBalance(): boolean {
      const fromCoinBalance = (this.fromCoinBalance && this.fromCoinBalance.fixed()) || '0'
      const toCoinBalance = (this.toCoinBalance && this.toCoinBalance.fixed()) || '0'

      const fromCoinInsufficient = gt(Number(this.$data.fromCoinAmount), Number(fromCoinBalance))
      const toCoinInsufficient = gt(Number(this.$data.toCoinAmount), Number(toCoinBalance))

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
    'wallet.tokenAccounts': {
      handler(_newTokenAccounts: any, _oldTokenAccounts: any) {
        this.updateCoinInfo(_newTokenAccounts)
      },
      deep: true
    },
    poolInfo: {
      handler: 'poolInfoWatch',
      immediate: true
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
    },
    minPrice(value: string) {
      // if ((Number(value) || Number(this.maxPrice)) && this.poolInfo) {
      if (value) {
        this.updateAmounts()
      }
    },
    maxPrice(value: string) {
      // if ((Number(value) || Number(this.minPrice)) && this.poolInfo) {
      if (value) {
        this.updateAmounts()
      }
    },
    direction(value: boolean) {
      if (this.minPrice !== '' && this.maxPrice !== '') {
        if (this.minPrice !== '0' && this.maxPrice !== '∞') {
          const minPriceOld = this.minPrice
          const maxPriceOld = this.maxPrice
          if (!this.ifFirstDirectionChange || !value) {
            // this.minPrice = String(1 / Number(maxPriceOld))
            // this.maxPrice = String(1 / Number(minPriceOld))
            // } else {
            this.minPrice = String(1 / Number(maxPriceOld))
            this.maxPrice = String(1 / Number(minPriceOld))
          }

          const defaultMinPriceOld = this.defaultMinPrice
          const defaultMaxPriceOld = this.defaultMaxPrice
          this.defaultMinPrice = String(1 / Number(defaultMaxPriceOld))
          this.defaultMaxPrice = String(1 / Number(defaultMinPriceOld))
          this.ifFirstDirectionChange = false
        }
      }
    },
    $route: {
      handler: 'routeWatch',
      immediate: true
    }
  },
  mounted() {
    this.updateCoinInfo(this.wallet.tokenAccounts)
  },
  methods: {
    gt,
    fixD,
    decimalFormat,
    checkNullObj,
    poolInfoWatch(value: any, oldValue: any) {
      console.log('111111')
      if (value) {
        // 第一次刷新或，替换交易对
        if (!oldValue || oldValue.name !== value.name) {
          this.ifFirstDirectionChange = true
          // console.log('poolInfoWatch####22222')
          let direction = true
          // 设置默认方向
          if (value.coin.symbol === this.fromCoin?.symbol && value.pc.symbol === this.toCoin?.symbol) {
            direction = true
          } else {
            direction = false
          }
          this.direction = direction

          // 设置价格区间默认值
          const tick = getNearestTickByPrice(new Decimal(value.currentPriceView), value.tick_space)
          console.log('value.tick_space#####', value.tick_space)
          const minTick = tick - value.tick_space
          const maxTick = tick + value.tick_space

          // let minPrice = ''
          // let maxPrice = ''

          const minPrice = tick2Price(minTick).toString()
          const maxPrice = tick2Price(maxTick).toString()

          // if (direction) {
          //   minPrice = tick2Price(minTick).toString()
          //   maxPrice = tick2Price(maxTick).toString()
          // } else {
          //   minPrice = String(1 / tick2Price(maxTick).toNumber())
          //   maxPrice = String(1 / tick2Price(minTick).toNumber())
          // }
          this.minPrice = minPrice
          this.maxPrice = maxPrice
          this.defaultMinPrice = minPrice
          this.defaultMaxPrice = maxPrice

          // 设置当前fee tier
          if (value.feeView === 0.01) {
            this.currentFeeTier = 0
          } else if (value.feeView === 0.3) {
            this.currentFeeTier = 1
          } else {
            this.currentFeeTier = 2
          }
          this.coinTabList = [value.coin.symbol, value.pc.symbol]
          this.currentCoinTab = direction ? value.coin.symbol : value.pc.symbol
        }

        this.updateAmounts()
      } else {
        this.currentFeeTier = 100
        this.minPrice = ''
        this.maxPrice = ''
        this.showFromCoinLock = false
        this.showToCoinLock = false
      }
    },
    routeWatch(newVal, oldVal) {
      if (newVal && newVal.query) {
        if (newVal.query.from) {
          this.fromCoin = getTokenBySymbol(newVal.query.from)
        }
        if (newVal.query.to) {
          this.toCoin = getTokenBySymbol(newVal.query.to)
        }
      }
    },
    changeDirection(value: string) {
      // this.direction = !this.direction
      this.changeCoinPosition()
      this.currentCoinTab = value
    },
    openAddLiquiditySecondConfirm() {
      const currentPriceP = Number(Math.pow(Number(this.poolInfo.current_price) / Math.pow(10, 12), 2))

      const dPrice = this.direction ? currentPriceP : 1 / currentPriceP

      let currentStatus = 'Active'
      if (!this.deltaLiquity) {
        currentStatus = 'Closed'
      } else if (dPrice >= Number(this.minPrice) && dPrice <= Number(this.maxPrice)) {
        currentStatus = 'Active'
      } else if (dPrice > Number(this.maxPrice)) {
        // 区间在当前价格的左侧时，也就是只有token b这一种资产, 返回liquity
        currentStatus = 'Inactive'
      } else if (dPrice < Number(this.minPrice)) {
        // 区间在当前价格的右侧时，也就是只有token a这一种资产, 返回liquity
        currentStatus = 'Inactive'
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
        feeTier: this.poolInfo.feeView + '%'
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
    // updateAmounts(price: string, min: string, max: string) {
    async updateAmounts() {
      if (!this.poolInfo) return
      if (!this.fromCoinAmount && !this.toCoinAmount && !this.minPrice && !this.maxPrice) return

      const swap = await new TokenSwap(
        this.$web3,
        new PublicKey(SWAPV3_PROGRAMID),
        // new PublicKey(LPFARMS[i].swapKey),
        this.poolInfo.tokenSwap,
        null
      ).load()

      // 处理过的current price , 与前端价格区间比较时用
      const currentPriceP = this.direction ? this.poolInfo.currentPriceView : this.poolInfo.currentPriceViewReverse
      // const currentPriceP = this.poolInfo.currentPriceView
      let currentPriceTick = 0
      const min = this.minPrice
      const max = this.maxPrice
      let minPrice = 0
      let maxPrice = 0
      let tick_lower: number
      let tick_upper: number
      let direction: any
      if (this.fixedFromCoin) {
        // coinAmount = new TokenAmount(this.fromCoinAmount, this.fromCoin?.decimals, false).wei.toNumber()
        direction =
          this.fromCoin?.symbol === this.poolInfo.coin.symbol && this.toCoin?.symbol === this.poolInfo.pc.symbol ? 0 : 1
      } else {
        // coinAmount = new TokenAmount(this.toCoinAmount, this.toCoin?.decimals, false).wei.toNumber()
        direction =
          this.toCoin?.symbol === this.poolInfo.coin.symbol && this.fromCoin?.symbol === this.poolInfo.pc.symbol ? 0 : 1
      }

      if (min === '0' && max === '∞') {
        tick_lower = -443632
        tick_upper = 443632
      } else {
        // minPrice = Number(min)
        // maxPrice = Number(max)
        if (this.direction) {
          minPrice = Number(min)
          maxPrice = Number(max)
        } else {
          minPrice = 1 / Number(max)
          maxPrice = 1 / Number(min)
        }

        // tick_lower = getNearestTick(Math.sqrt(minPrice), this.poolInfo.tick_space, true)
        // tick_upper = getNearestTick(Math.sqrt(maxPrice), this.poolInfo.tick_space, false)
        if (this.fromCoin?.decimals === this.toCoin?.decimals) {
          console.log('走到这里了吗####currentPriceP#####', currentPriceP)
          console.log('走到这里了吗####minPrice#####', minPrice)
          console.log('走到这里了吗####maxPrice#####', maxPrice)
          currentPriceTick = price2Tick(new Decimal(currentPriceP))
          tick_lower = getNearestTickByPrice(new Decimal(minPrice), this.poolInfo.tick_space)
          tick_upper = getNearestTickByPrice(new Decimal(maxPrice), this.poolInfo.tick_space)
        } else {
          const f_t = this.poolInfo.coin?.decimals - this.poolInfo.pc?.decimals
          const t_f = this.poolInfo.pc?.decimals - this.poolInfo.coin?.decimals

          console.log('f_t#####', f_t)
          console.log('t_f#####', t_f)

          // if (direction === 0) {
          // 正向
          currentPriceTick = price2Tick(new Decimal(currentPriceP * Math.pow(10, t_f)))
          tick_lower = getNearestTickByPrice(new Decimal(minPrice * Math.pow(10, t_f)), this.poolInfo.tick_space)
          tick_upper = getNearestTickByPrice(new Decimal(maxPrice * Math.pow(10, t_f)), this.poolInfo.tick_space)
          // } else {
          //   // 反向
          //   currentPriceTick = price2Tick(new Decimal(currentPriceP * Math.pow(10, f_t)))
          //   tick_lower = getNearestTickByPrice(new Decimal(minPrice * Math.pow(10, t_f)), this.poolInfo.tick_space)
          //   tick_upper = getNearestTickByPrice(new Decimal(maxPrice * Math.pow(10, t_f)), this.poolInfo.tick_space)
          // }
        }
      }
      if (max !== '∞' && tick_lower >= tick_upper) {
        this.showFromCoinLock = true
        this.fromCoinAmount = ''
        this.showToCoinLock = true
        this.toCoinAmount = ''
        return
      }

      // console.log('this.fromCoinAmount######', this.fromCoinAmount)
      // console.log('this.toCoinAmount######', this.toCoinAmount)
      console.log('currentPriceTick######', currentPriceTick)
      console.log('tick_lower#####', tick_lower)
      console.log('tick_upper#####', tick_upper)

      console.log('min#####', min)
      console.log('max#####', max)
      // console.log('min#####', min)
      // 区间中包含当前价格, 一种资产返回另外一种资产，并且返回liquity
      if (max === '∞' || (Number(currentPriceP) > Number(min) && Number(currentPriceP) < Number(max))) {
        let coinAmount: any

        if (this.fixedFromCoin) {
          coinAmount = new TokenAmount(fixD(this.fromCoinAmount, 2), this.fromCoin?.decimals, false).wei.toNumber()
          // direction =
          //   this.fromCoin?.symbol === this.poolInfo.coin.symbol && this.toCoin?.symbol === this.poolInfo.pc.symbol
          //     ? 0
          //     : 1
        } else {
          coinAmount = new TokenAmount(fixD(this.toCoinAmount, 2), this.toCoin?.decimals, false).wei.toNumber()
          // direction =
          //   this.toCoin?.symbol === this.poolInfo.coin.symbol && this.fromCoin?.symbol === this.poolInfo.pc.symbol
          //     ? 0
          //     : 1
        }

        console.log('tick_lower####', tick_lower)
        console.log('tick_upper####', tick_upper)
        console.log('coinAmount#####', coinAmount)
        console.log('swap.tokenSwapInfo.currentSqrtPrice####', swap.tokenSwapInfo.currentSqrtPrice.toNumber())
        console.log('direction####', direction)
        const { desiredAmountDst, deltaLiquity } = calculateLiquity(
          tick_lower,
          tick_upper,
          new Decimal(coinAmount),
          swap.tokenSwapInfo.currentSqrtPrice,
          direction
        )
        const dst = desiredAmountDst.toNumber()
        const delta_liquity = deltaLiquity.toNumber()
        console.log('delta_liquity#####', delta_liquity)

        this.showFromCoinLock = false
        this.showToCoinLock = false
        const decimal = this.toCoin?.decimals || 6

        if (this.fixedFromCoin) {
          const toCoinAmount = fixD(Math.abs(dst) / Math.pow(10, decimal), decimal) || '0'
          this.toCoinAmount = toCoinAmount === '--' ? '' : toCoinAmount
        } else {
          const fromCoinAmount = fixD(Math.abs(dst) / Math.pow(10, decimal), decimal) || '0'
          this.fromCoinAmount = fromCoinAmount === '--' ? '' : fromCoinAmount
        }

        this.deltaLiquity = delta_liquity
      } else if (Number(currentPriceP) >= Number(max)) {
        // 区间在当前价格的左侧时，也就是只有token b这一种资产, 返回liquity
        const coinAmount = new TokenAmount(fixD(this.toCoinAmount, 2), this.toCoin?.decimals, false).wei.toNumber()
        // const delta_liquity = deposit_only_token_b(tick_lower, tick_upper, coinAmount)
        const delta_liquity = calculateLiquityOnlyB(tick_lower, tick_upper, new Decimal(coinAmount))
        this.showFromCoinLock = true
        this.fromCoinAmount = ''
        this.showToCoinLock = false
        this.deltaLiquity = delta_liquity.toString()
      } else if (Number(currentPriceP) <= Number(min)) {
        // 区间在当前价格的右侧时，也就是只有token a这一种资产, 返回liquity
        const coinAmount = new TokenAmount(fixD(this.fromCoinAmount, 2), this.fromCoin?.decimals, false).wei.toNumber()
        // const delta_liquity = deposit_only_token_a(tick_lower, tick_upper, coinAmount)
        const delta_liquity = calculateLiquityOnlyA(tick_lower, tick_upper, new Decimal(coinAmount))

        // const coinAmount = 1000000000
        // const delta_liquity = deposit_only_token_a(50112, 50752, coinAmount)
        this.showFromCoinLock = false
        this.showToCoinLock = true
        this.toCoinAmount = ''
        this.deltaLiquity = delta_liquity.toString()
      } else {
        // 重叠的情况
        this.showFromCoinLock = true
        this.fromCoinAmount = ''
        this.showToCoinLock = true
        this.toCoinAmount = ''
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
      this.showCoinSelect = true
    },
    checkIsHaveCoinPair(coinA: any, coinB: any) {
      for (let i = 0; i < LIQUIDITY_POOLS.length; i++) {
        const coinPair = LIQUIDITY_POOLS[i].coinPair
        if (`${coinA}-${coinB}` === coinPair || `${coinB}-${coinA}` === coinPair) {
          return true
        }
      }
      return false
    },
    onCoinSelect(token: any) {
      // if (token.unusable) return
      if (this.currentCoinKey === 'fromCoin') {
        if (token.symbol === this.toCoin?.symbol || !this.checkIsHaveCoinPair(token.symbol, this.toCoin?.symbol)) {
          this.toCoin = null
        }
        this.fromCoin = token
      } else {
        if (token.symbol === this.fromCoin?.symbol || !this.checkIsHaveCoinPair(token.symbol, this.fromCoin?.symbol)) {
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
      this.direction = !this.direction
      const tempFromCoin = this.fromCoin
      const tempToCoin = this.toCoin
      this.fromCoin = tempToCoin
      this.toCoin = tempFromCoin

      const tempFromCoinAmount = this.fromCoinAmount
      const tempToCoinAmount = this.toCoinAmount

      this.fromCoinAmount = tempToCoinAmount
      this.toCoinAmount = tempFromCoinAmount
      this.currentCoinTab = this.direction ? this.poolInfo.coin.symbol : this.poolInfo.pc.symbol
    },
    async supply() {
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

      const processedFromCoinAccount =
        typeof fromCoinAccount === 'string' ? new PublicKey(fromCoinAccount) : fromCoinAccount
      const processedToCoinAccount = typeof fromCoinAccount === 'string' ? new PublicKey(toCoinAccount) : toCoinAccount

      const key = getUnixTs().toString()
      // this.$notify.info({
      //   key,
      //   message: 'Making transaction...',
      //   description: '',
      //   duration: 0,
      //   icon: this.$createElement('img', { class: { 'notify-icon': true }, attrs: { src: '/tanhao@2x.png' } })
      // })

      let tick_lower: number
      let tick_upper: number
      if (this.minPrice === '0' && this.maxPrice === '∞') {
        tick_lower = -443632
        tick_upper = 443632
      } else {
        const f_t = this.fromCoin?.decimals - this.toCoin?.decimals
        const t_f = this.toCoin?.decimals - this.fromCoin?.decimals
        console.log('supply####f_t####', f_t)
        console.log('supply####t_f####', t_f)
        if (this.direction) {
          tick_lower = getNearestTickByPrice(new Decimal(this.minPrice * Math.pow(10, t_f)), poolInfo.tick_space)
          tick_upper = getNearestTickByPrice(new Decimal(this.maxPrice * Math.pow(10, t_f)), poolInfo.tick_space)
        } else {
          tick_lower = getNearestTickByPrice(
            new Decimal((1 / Number(this.maxPrice)) * Math.pow(10, f_t)),
            poolInfo.tick_space
          )
          tick_upper = getNearestTickByPrice(
            new Decimal((1 / Number(this.minPrice)) * Math.pow(10, f_t)),
            poolInfo.tick_space
          )
        }
      }

      let fromCoinAmount: any
      if (this.fromCoinAmount) {
        // fromCoinAmount = !this.fixedFromCoin
        //   ? Number(this.fromCoinAmount) * (1 + Number(this.$accessor.slippage) / 100)
        //   : Number(this.fromCoinAmount)
        fromCoinAmount = Number(this.fromCoinAmount) * (1 + Number(this.$accessor.slippage) / 100)
      }

      let toCoinAmount: any
      if (this.toCoinAmount) {
        // toCoinAmount = this.fixedFromCoin
        //   ? Number(this.toCoinAmount) * (1 + Number(this.$accessor.slippage) / 100)
        //   : Number(this.toCoinAmount)

        // if (!fromCoinAmount) {
        //   toCoinAmount = Number(this.toCoinAmount) * (1 + Number(this.$accessor.slippage) / 100)
        // }
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
        tick_lower,
        tick_upper,
        new Decimal(this.deltaLiquity),
        swap.tokenSwapInfo.currentSqrtPrice,
        new Decimal(Number(this.$accessor.slippage) / 100)
      )

      fromCoinAmount = fixD(slidTokenAmountObj.maxAmountA.toString(), 0)
      toCoinAmount = fixD(slidTokenAmountObj.maxAmountB.toString(), 0)
      console.log('fromCoinAmount####', fromCoinAmount)
      console.log('fromCoinAmount####', toCoinAmount)
      console.log('this.$accessor.slippage####', this.$accessor.slippage)
      console.log('test123####', slidTokenAmountObj)

      this.$accessor.transaction.setTransactionDesc(
        `Add liquidity  ${this.fromCoinAmount && this.fromCoinAmount} ${this.fromCoinAmount && this.fromCoin?.symbol} ${
          this.fromCoinAmount && this.toCoinAmount ? 'and' : ''
        } ${this.toCoinAmount && this.toCoinAmount} ${this.toCoinAmount && this.toCoin?.symbol}`
      )
      this.$accessor.transaction.setShowWaiting(true)
      const deltaLiquity = fixD(this.deltaLiquity, 0)

      addLiquidityNew(
        conn,
        wallet,
        poolInfo,
        this.direction ? this.fromCoin : this.toCoin,
        this.direction ? this.toCoin : this.fromCoin,
        this.direction ? processedFromCoinAccount : processedToCoinAccount,
        this.direction ? processedToCoinAccount : processedFromCoinAccount,
        null,
        null,
        tick_lower,
        tick_upper,
        fixD(deltaLiquity, 0),
        // this.direction ? fromCoinAmount : toCoinAmount,
        // this.direction ? toCoinAmount : fromCoinAmount,
        fromCoinAmount,
        toCoinAmount,
        0
      )
        .then((txid) => {
          const description = `Add liquidity  ${this.fromCoinAmount && this.fromCoinAmount} ${
            this.fromCoinAmount && this.fromCoin?.symbol
          }  ${this.fromCoinAmount && this.toCoinAmount ? 'and' : ''} ${this.toCoinAmount && this.toCoinAmount} ${
            this.toCoinAmount && this.toCoin?.symbol
          } to the pool`
          this.$accessor.transaction.sub({ txid, description, type: 'Add liquidity' })
          this.$accessor.transaction.setShowSubmitted(true)
          setTimeout(() => {
            this.$accessor.liquidity.requestInfos()
          }, 2000)
        })
        .catch((err) => {
          console.log('err###', err)
          this.$accessor.transaction.setShowSubmitted(false)
        })
        .finally(() => {
          this.suppling = false
          this.fromCoinAmount = ''

          this.toCoinAmount = ''
        })
    },
    clearAll() {
      this.fromCoin = null
      this.toCoin = null
      this.minPrice = '0'
      this.maxPrice = '0'
      this.currentCoinTab = ''
      this.currentFeeTier = -1
      this.fromCoinAmount = ''
      this.toCoinAmount = ''
    }
  }
})
</script>

<style lang="less" scoped>
@import '../styles/base.less';
.pool-container {
  width: 100%;
  padding-bottom: 100px;
  // min-height: 100vh;
  .pool-body {
    width: 996px;
    // height: 545px;
    background: linear-gradient(214deg, #3e434e 0%, #23262b 100%);
    box-shadow: 0px 4px 12px 0px rgba(26, 28, 31, 0.5);
    border-radius: 30px;
    border: 1px solid #3f434e;
    margin: 0 auto;
    padding: 22px 20px;
    > .top {
      display: flex;
      justify-content: space-between;
      > .title {
        font-size: 20px;
        color: #fff;
      }
      > .right {
        display: flex;
        align-items: center;
        .clear-all {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.5);
          margin-right: 16px;
          &:hover {
            color: #fff;
          }
        }
        .coin-tab {
          font-size: 12px;
          margin-right: 16px;
          font-weight: bold;
        }
      }
    }
    .pool-content {
      display: flex;
      justify-content: space-between;
      margin-top: 24px;
      > div {
        width: 460px;
      }
      .price-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .right {
          font-weight: bold;
        }
      }
      .form-box {
        margin-top: 12px;
        .add-icon {
          // width: 48px;
          // height: 48px;
          // background: linear-gradient(214deg, #3e434e 0%, #373b42 100%);
          // box-shadow: 0px 4px 12px 0px rgba(26, 28, 31, 0.5);
          // border-radius: 10px;
          // border: 1px solid #3f434e;
          // display: flex;
          // align-items: center;
          // justify-content: center;
          // margin: 10px auto;
          // svg {
          //   width: 38px;
          //   height: 38px;
          //   fill: rgba(#fff, 1);
          // }
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
            background-image: url('../assets/images/add@2x.png');
            box-shadow: 0px 4px 12px 0px rgba(26, 28, 31, 0.5);

            &:hover {
              background-image: url('../assets/images/add_hover@2x.png');
            }
          }
        }
      }
      .fee-tier-box {
        margin-top: 10px;
      }
      .add-liquidity-btn {
        font-weight: bold;
        color: #fff;
        font-size: 20px;
        .gradient-btn-large();
        margin-top: 16px;
      }
    }
  }

  .set-price-range-chart-box {
    width: 100%;
    display: flex;
    justify-content: center;
    > img {
      height: 200px;
    }
  }
  .link-block {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    > a {
      width: 150px;
      height: 32px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      img {
        width: 32px;
        height: 32px;
      }
      &:hover {
        color: #fff;
        svg {
          fill: #fff;
        }
      }
    }
  }
}
@media screen and (max-width: 750px) {
  .pool-container {
    .link-block {
      margin-top: 20px;
    }
    .pool-body {
      width: 100%;
      margin-top: 20px;
      padding: 20px 10px;
      .top {
        display: block;
        .right {
          justify-content: flex-end;
        }
      }
      .pool-content {
        display: block;
        & > div {
          width: 100%;
        }
      }
    }
    .set-price-range-chart-box {
      display: block;
      overflow: hidden;
      margin-top: 20px;
    }
  }
}
</style>
