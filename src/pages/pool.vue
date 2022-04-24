<template>
  <div class="pool-container">
    <div class="link-block">
      <div class="go-back" @click="gotoPoolList">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-icon-return"></use>
        </svg>
      </div>
      <nuxt-link to="/position" v-if="wallet.connected">
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
          <RefreshIcon @refresh="refresh" :loading="liquidity.loading"></RefreshIcon>
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
              <Progress
                type="circle"
                :width="14"
                :stroke-width="10"
                :percent="(100 / autoRefreshTime) * countdown"
                :show-info="false"
                :class="liquidity.loading ? 'disabled' : ''"
                @click="refresh"
              />
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
            <FeeTier :currentFee="currentFeeTier"></FeeTier>
          </div>
        </div>
        <div class="right">
          <div class="set-price-range-chart-box">
            <D3Chart
              v-if="poolInfo"
              :pool-info="poolInfo"
              :min-price="minPrice"
              :max-price="maxPrice"
              :direction="direction"
              :tick-list="tickList"
              :current-tick="currentTick"
              :chart-loading="chartLoading"
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
              :tick-space="poolInfo.tickSpace"
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
      @supply="toAddLiquidity"
      @onClose="closeAddLiquiditySecondConfirm"
    ></AddLiquidityConfirm>
  </div>
</template>

<script lang="ts">
import { Vue } from 'nuxt-property-decorator'
import { mapState } from 'vuex'
import { Button, Progress } from 'ant-design-vue'
import { fixD, decimalFormat, checkNullObj } from '../utils/index'
import { cloneDeep, debounce } from 'lodash-es'
import { TokenInfo, getTokenBySymbol } from '@/utils/tokens'
import { inputRegex, escapeRegExp } from '@/utils/regex'
import { TokenAmount, gt } from '@/utils/safe-math'
import { LIQUIDITY_POOLS } from '@/utils/pools'
import {
  getNearestTickByPrice,
  tick2Price,
  price2Tick,
  calculateLiquityOnlyA,
  calculateLiquityOnlyB,
  calculateLiquity,
  uiPrice2LamportPrice,
  lamportPrice2uiPrice
} from 'test-crema-sdk'
import Decimal from 'decimal.js'
import { getATAAddress } from '@saberhq/token-utils'
import { BroadcastOptions } from '@saberhq/solana-contrib'
import { loadSwapPair } from '@/contract/pool'
import mixin from '@/mixin/pool'

const USDT = getTokenBySymbol('USDT')
const USDC = getTokenBySymbol('USDC')

export default Vue.extend({
  components: {
    Button,
    Progress
  },
  mixins: [mixin],
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
      ifFirstDirectionChange: false,
      tickList: [] as any,
      currentTick: 0,
      autoRefreshTime: 20,
      countdown: 0,
      refreshTimer: null,
      chartLoading: false,
      isUpdateAmount: true
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
      if (!this.fromCoin && !this.toCoin) {
        return 'Select a token'
      } else if (!this.poolInfo) {
        return 'Pool not found'
      } else if (this.noEnterAmount) {
        return 'Enter an amount'
      } else if (this.maxPrice !== '∞' && Number(this.minPrice) >= Number(this.maxPrice)) {
        return 'Invalid Range'
      } else if (this.insufficientBalance) {
        return 'Insufficient balance'
      }

      return 'Add Liquidity'
    },
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
    fromCoinAmount: debounce(function (newAmount: string, oldAmount: string) {
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
    }, 500),
    toCoinAmount: debounce(function (newAmount: string, oldAmount: string) {
      this.$nextTick(() => {
        if (!inputRegex.test(escapeRegExp(newAmount))) {
          this.toCoinAmount = oldAmount
        } else {
          if (!this.fixedFromCoin && this.poolInfo) {
            this.updateAmounts()
          }
        }
      })
    }, 500),
    minPrice(value: string) {
      if (value) {
        this.updateAmounts()
      }
    },
    maxPrice(value: string) {
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
  created() {
    // this.$accessor.liquidity.getPoolsDefaultPriceRange()
    this.setRefreshTimer()
  },
  mounted() {
    this.updateCoinInfo(this.wallet.tokenAccounts)
  },
  methods: {
    gt,
    fixD,
    decimalFormat,
    checkNullObj,
    setRefreshTimer() {
      this.refreshTimer = setInterval(() => {
        if (!this.liquidity.loading) {
          if (this.countdown < this.autoRefreshTime) {
            this.countdown += 1

            if (this.countdown === this.autoRefreshTime) {
              this.refresh(false)
            }
          }
        }
      }, 1000)
    },
    refresh(refreshChart: boolean = true) {
      this.countdown = 0
      this.$accessor.liquidity.getPoolList()
      if (refreshChart) this.getChartData()
    },
    poolInfoWatch(value: any, oldValue: any) {
      if (value) {
        // 第一次刷新或，替换交易对
        if (!oldValue || oldValue.name !== value.name) {
          this.chartLoading = true
          this.ifFirstDirectionChange = true
          let direction = true

          // 设置默认方向
          if (value.token_a.symbol === this.fromCoin?.symbol && value.token_b.symbol === this.toCoin?.symbol) {
            direction = true
          } else {
            direction = false
          }
          this.direction = direction

          // 设置价格区间默认值

          if (value.price_interval) {
            const priceInterval = value.price_interval

            const minTick = getNearestTickByPrice(new Decimal(priceInterval.lower_price), value.tickSpace)
            const maxTick = getNearestTickByPrice(new Decimal(priceInterval.upper_price), value.tickSpace)

            this.minPrice = tick2Price(minTick).toString()
            this.maxPrice = tick2Price(maxTick).toString()
            this.defaultMinPrice = tick2Price(minTick).toString()
            this.defaultMaxPrice = tick2Price(maxTick).toString()
          } else {
            const tick = getNearestTickByPrice(new Decimal(value.currentPriceView), value.tickSpace)
            const minTick = tick - value.tickSpace
            const maxTick = tick + value.tickSpace

            const minPrice = tick2Price(minTick).toString()
            const maxPrice = tick2Price(maxTick).toString()
            this.minPrice = minPrice
            this.maxPrice = maxPrice
            this.defaultMinPrice = minPrice
            this.defaultMaxPrice = maxPrice
          }

          // 设置当前fee tier
          // if (value.feeView === 0.01) {
          //   this.currentFeeTier = 0
          // } else if (value.feeView === 0.3) {
          //   this.currentFeeTier = 1
          // } else {
          //   this.currentFeeTier = 2
          // }
          this.currentFeeTier = value.feeView
          this.coinTabList = [value.token_a.symbol, value.token_b.symbol]
          this.currentCoinTab = direction ? value.token_a.symbol : value.token_b.symbol
        }
        this.getTokenSwap()
        this.updateAmounts()
        this.currentTick = 0
        this.tickList = []
        this.getChartData(value)
      } else {
        this.currentFeeTier = -1
        this.minPrice = ''
        this.maxPrice = ''
        this.showFromCoinLock = false
        this.showToCoinLock = false
        this.currentTick = 0
        this.tickList = []
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
      // const currentPriceP = Number(Math.pow(Number(this.poolInfo.current_price) / Math.pow(10, 12), 2))

      const dPrice = this.direction ? this.poolInfo.currentPriceView : this.poolInfo.currentPriceViewReverse
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
        currentPrice: dPrice,
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
      if (!this.isUpdateAmount || !this.poolInfo) return
      if (!this.fromCoinAmount && !this.toCoinAmount && !this.minPrice && !this.maxPrice) return

      // const swap = await loadSwapPair(this.poolInfo.tokenSwapKey, this.$wallet)
      let swap: any
      if (this.tokenSwap) {
        swap = this.tokenSwap
      } else {
        swap = await loadSwapPair(this.poolInfo.tokenSwapKey, this.$wallet)
        this.tokenSwap = swap
      }

      console.log('changeCoinPosition####updateAmount#####')
      // 处理过的current price , 与前端价格区间比较时用
      const currentPriceP = this.direction ? this.poolInfo.currentPriceView : this.poolInfo.currentPriceViewReverse
      let currentPriceTick = 0
      const min = this.minPrice
      const max = this.maxPrice
      let minPrice = 0
      let maxPrice = 0
      let tick_lower: number
      let tick_upper: number
      let direction: any
      if (this.fixedFromCoin) {
        direction =
          this.fromCoin?.symbol === this.poolInfo.token_a.symbol && this.toCoin?.symbol === this.poolInfo.token_b.symbol
            ? 0
            : 1
      } else {
        direction =
          this.toCoin?.symbol === this.poolInfo.token_a.symbol && this.fromCoin?.symbol === this.poolInfo.token_b.symbol
            ? 0
            : 1
      }

      if (min === '0' && max === '∞') {
        tick_lower = -443632
        tick_upper = 443632
      } else {
        if (this.direction) {
          minPrice = Number(min)
          maxPrice = Number(max)
        } else {
          minPrice = 1 / Number(max)
          maxPrice = 1 / Number(min)
        }

        if (this.fromCoin?.decimals === this.toCoin?.decimals) {
          currentPriceTick = price2Tick(new Decimal(currentPriceP))
          tick_lower = getNearestTickByPrice(new Decimal(minPrice), this.poolInfo.tickSpace)
          tick_upper = getNearestTickByPrice(new Decimal(maxPrice), this.poolInfo.tickSpace)
        } else {
          const { lowerTick, upperTick } = swap.calculateEffectivTick(new Decimal(minPrice), new Decimal(maxPrice))
          tick_lower = lowerTick
          tick_upper = upperTick
        }
      }
      if (max !== '∞' && tick_lower >= tick_upper) {
        console.log('changeCoinPosition###是走到这里了吗####123')
        this.showFromCoinLock = true
        this.fromCoinAmount = ''
        this.showToCoinLock = true
        this.toCoinAmount = ''
        return
      }

      console.log('changeCoinPosition###updateAmount###currentPriceP###', currentPriceP)
      console.log('changeCoinPosition###updateAmount###min###', min)
      console.log('changeCoinPosition###updateAmount###max###', max)

      // 区间中包含当前价格, 一种资产返回另外一种资产，并且返回liquity
      if (max === '∞' || (Number(currentPriceP) > Number(min) && Number(currentPriceP) < Number(max))) {
        console.log('changeCoinPosition####666666')
        let coinAmount: any

        console.log('changeCoinPosition###updateAmount###fixedFromCoin###', this.fixedFromCoin)

        console.log('changeCoinPosition###updateAmount###this.fromCoinAmount####', this.fromCoinAmount)
        console.log('changeCoinPosition###updateAmount###this.fromCoin?.decimals####', this.fromCoin?.decimals)

        if (this.fixedFromCoin) {
          coinAmount = new TokenAmount(this.fromCoinAmount, this.fromCoin?.decimals, false).wei.toNumber()
        } else {
          coinAmount = new TokenAmount(this.toCoinAmount, this.toCoin?.decimals, false).wei.toNumber()
        }

        console.log('changeCoinPosition###updateAmount###coinAmount###', coinAmount)

        const { desiredAmountDst, deltaLiquity } = calculateLiquity(
          tick_lower,
          tick_upper,
          new Decimal(coinAmount),
          swap.tokenSwapInfo.currentSqrtPrice,
          direction
        )
        const dst = desiredAmountDst.toNumber()
        const delta_liquity = deltaLiquity.toNumber()

        console.log('changeCoinPosition###updateAmount###dst###', dst)

        this.showFromCoinLock = false
        this.showToCoinLock = false

        if (this.fixedFromCoin) {
          const decimal = this.toCoin?.decimals || 6
          const toCoinAmount = fixD(Math.abs(dst) / Math.pow(10, decimal), decimal) || '0'
          this.toCoinAmount = toCoinAmount === '--' ? '' : toCoinAmount
        } else {
          const decimal = this.fromCoin?.decimals || 6
          const fromCoinAmount = fixD(Math.abs(dst) / Math.pow(10, decimal), decimal) || '0'
          this.fromCoinAmount = fromCoinAmount === '--' ? '' : fromCoinAmount
        }

        this.deltaLiquity = delta_liquity
      } else if (Number(currentPriceP) >= Number(max)) {
        console.log('changeCoinPosition####777777')
        // 区间在当前价格的左侧时，也就是只有token b这一种资产, 返回liquity
        const coinAmount = new TokenAmount(this.toCoinAmount, this.toCoin?.decimals, false).wei.toNumber()
        const delta_liquity = calculateLiquityOnlyB(tick_lower, tick_upper, new Decimal(coinAmount))
        this.showFromCoinLock = true
        this.fromCoinAmount = ''
        this.showToCoinLock = false
        this.deltaLiquity = delta_liquity.toString()
      } else if (Number(currentPriceP) <= Number(min)) {
        console.log('changeCoinPosition####888888')
        // 区间在当前价格的右侧时，也就是只有token a这一种资产, 返回liquity
        const coinAmount = new TokenAmount(this.fromCoinAmount, this.fromCoin?.decimals, false).wei.toNumber()
        const delta_liquity = calculateLiquityOnlyA(tick_lower, tick_upper, new Decimal(coinAmount))

        this.showFromCoinLock = false
        this.showToCoinLock = true
        this.toCoinAmount = ''
        this.deltaLiquity = delta_liquity.toString()
      } else {
        console.log('changeCoinPosition######333333')
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
      const poolsObj: any = this.liquidity.poolsObj
      for (let key in poolsObj) {
        const item = poolsObj[key]
        if (`${coinA}-${coinB}` === item.name || `${coinB}-${coinA}` === item.name) {
          return true
        }
      }
      return false
    },
    onCoinSelect(token: any) {
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
      this.isUpdateAmount = false
      this.direction = !this.direction
      const tempFromCoin = this.fromCoin
      const tempToCoin = this.toCoin
      this.fromCoin = tempToCoin
      this.toCoin = tempFromCoin

      const tempFromCoinAmount = this.fromCoinAmount
      const tempToCoinAmount = this.toCoinAmount

      console.log('changeCoinPosition###tempFromCoinAmount####', tempFromCoinAmount)
      console.log('changeCoinPosition###tempToCoinAmount####', tempToCoinAmount)

      this.fromCoinAmount = tempToCoinAmount
      this.toCoinAmount = tempFromCoinAmount

      this.fixedFromCoin = !this.fixedFromCoin

      this.currentCoinTab = this.direction ? this.poolInfo.token_a.symbol : this.poolInfo.token_b.symbol

      setTimeout(() => {
        this.isUpdateAmount = true
        this.updateAmounts()
      }, 1000)
    },

    async toAddLiquidity() {
      // mintPosition
      this.suppling = true
      const wallet = (this as any).$wallet

      const poolInfo: any = cloneDeep(this.poolInfo)

      let direction: any
      if (this.fixedFromCoin) {
        direction =
          this.fromCoin?.symbol === poolInfo.token_a.symbol && this.toCoin?.symbol === poolInfo.token_b.symbol ? 0 : 1
      } else {
        direction =
          this.toCoin?.symbol === poolInfo.token_a.symbol && this.fromCoin?.symbol === poolInfo.token_b.symbol ? 0 : 1
      }

      const swap = await loadSwapPair(poolInfo.tokenSwapKey, wallet)

      let tick_lower: number
      let tick_upper: number
      if (this.minPrice === '0' && this.maxPrice === '∞') {
        tick_lower = -443632
        tick_upper = 443632
      } else {
        // const { lowerTick, upperTick } = swap.calculateEffectivTick(minPrice, maxPrice)
        let minPrice: any
        let maxPrice: any
        if (this.direction) {
          minPrice = this.minPrice
          maxPrice = this.maxPrice
        } else {
          minPrice = 1 / Number(this.maxPrice)
          maxPrice = 1 / Number(this.minPrice)
        }
        const { lowerTick, upperTick } = swap.calculateEffectivTick(new Decimal(minPrice), new Decimal(maxPrice))
        tick_lower = lowerTick
        tick_upper = upperTick
      }

      const amountA = this.direction ? new Decimal(this.fromCoinAmount || 0) : new Decimal(this.toCoinAmount || 0)
      const amountB = this.direction ? new Decimal(this.toCoinAmount || 0) : new Decimal(this.fromCoinAmount || 0)
      const slid = new Decimal(Number(this.$accessor.slippage) / 100)

      let balanceA: any
      let balanceB: any
      if (this.direction) {
        balanceA = new Decimal(this.fromCoinBalance.fixed()).mul(Math.pow(10, this.fromCoin.decimals))
        balanceB = new Decimal(this.toCoinBalance.fixed()).mul(Math.pow(10, this.toCoin.decimals))
      } else {
        balanceA = new Decimal(this.toCoinBalance.fixed()).mul(Math.pow(10, this.toCoin.decimals))
        balanceB = new Decimal(this.fromCoinBalance.fixed()).mul(Math.pow(10, this.fromCoin.decimals))
      }

      let liquityResult: any

      if (direction === 0) {
        liquityResult = swap.calculateFixSideTokenAmount(
          tick_lower,
          tick_upper,
          amountA,
          null,
          balanceA,
          balanceB,
          slid
        )
      } else {
        liquityResult = swap.calculateFixSideTokenAmount(
          tick_lower,
          tick_upper,
          null,
          amountB,
          balanceA,
          balanceB,
          slid
        )
      }

      const userTokenA = await getATAAddress({
        mint: swap.tokenSwapInfo.tokenAMint,
        owner: swap.provider.wallet.publicKey
      })
      const userTokenB = await getATAAddress({
        mint: swap.tokenSwapInfo.tokenBMint,
        owner: swap.provider.wallet.publicKey
      })

      this.$accessor.transaction.setTransactionDesc(
        `Add liquidity  ${this.fromCoinAmount && this.fromCoinAmount} ${this.fromCoinAmount && this.fromCoin?.symbol} ${
          this.fromCoinAmount && this.toCoinAmount ? 'and' : ''
        } ${this.toCoinAmount && this.toCoinAmount} ${this.toCoinAmount && this.toCoin?.symbol}`
      )
      this.$accessor.transaction.setShowWaiting(true)
      const deltaLiquity = fixD(this.deltaLiquity, 0)
      let txid = ''
      try {
        const res = await swap.mintPositionFixToken(
          userTokenA,
          userTokenB,
          liquityResult.fixTokenType,
          tick_lower,
          tick_upper,
          liquityResult.maxAmountA,
          liquityResult.maxAmountB
        )

        const opt: BroadcastOptions = {
          skipPreflight: true,
          commitment: 'confirmed',
          preflightCommitment: 'confirmed',
          maxRetries: 30,
          printLogs: true
        }

        const receipt: any = await res.tx.send(opt)

        if (receipt && receipt.signature) {
          txid = receipt.signature
          const description = `Add liquidity  ${this.fromCoinAmount && this.fromCoinAmount} ${
            this.fromCoinAmount && this.fromCoin?.symbol
          }  ${this.fromCoinAmount && this.toCoinAmount ? 'and' : ''} ${this.toCoinAmount && this.toCoinAmount} ${
            this.toCoinAmount && this.toCoin?.symbol
          } to the pool`
          this.$accessor.transaction.setShowSubmitted(true)
          const _this = this
          this.$accessor.transaction.sub({
            txid,
            description,
            type: 'Add liquidity',
            successCallback: () => {
              // _this.$accessor.liquidity.requestInfos()
              this.refresh()
              _this.suppling = false
              this.$accessor.transaction.setShowSubmitted(false)
            },
            errorCallback: () => {
              _this.suppling = false
              this.$accessor.transaction.setShowSubmitted(false)
            }
          })

          this.fromCoinAmount = ''
          this.toCoinAmount = ''

          const whatWait = await receipt.wait({
            commitment: 'confirmed',
            useWebsocket: true,
            retries: 30
          })
        }
      } catch (error: any) {
        console.log('toAddLiquidity###error####', error)
        this.$accessor.transaction.setShowWaiting(false)
        this.$accessor.transaction.setShowSubmitted(false)
        this.$notify.close(txid + 'loading')
        this.$notify.error({
          key: 'AddLiquidityFailed',
          message: 'Add liquidity failed',
          description: error.message,
          class: 'error',
          icon: this.$createElement('img', { class: { 'notify-icon': true }, attrs: { src: '/icon_Error@2x.png' } })
        })
        this.suppling = false
      }
    },
    clearAll() {
      console.log('changeCoinPosition###clearAll###')
      this.fromCoin = null
      this.toCoin = null
      this.minPrice = '0'
      this.maxPrice = '0'
      this.currentCoinTab = ''
      this.currentFeeTier = -1
      this.fromCoinAmount = ''
      this.toCoinAmount = ''
    },
    async getChartData(pool: any) {
      const poolInfo: any = pool || this.poolInfo
      if (poolInfo && poolInfo.tokenSwapKey) {
        let swap: any
        if (this.tokenSwap && !pool) {
          swap = this.tokenSwap
        } else {
          swap = await loadSwapPair(poolInfo.tokenSwapKey, this.$wallet)
          this.tokenSwap = swap
        }

        this.currentTick = swap.currentTick
        console.log('D3Chart###bug###test###currentTick###', swap.currentTick)
        this.tickList = swap.ticks
        this.chartLoading = false
      }
    },
    gotoPoolList() {
      this.$router.push('/deposit')
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
          margin-right: 0px;
          &:hover {
            color: #fff;
          }
        }
        .coin-tab {
          font-size: 12px;
          margin-left: 10px;
          font-weight: bold;
        }
        .set-icon-container {
          margin-left: 10px;
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
          display: flex;
          align-items: center;
          .ant-progress {
            margin-left: 4px;
            margin-bottom: 3px;
          }
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
    width: 996px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
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
    .go-back {
      display: flex;
      align-items: center;
      .icon {
        width: 20px;
        height: 20px;
        fill: #fff;
        margin-right: 4px;
        &:hover {
          fill: #07ebad;
        }
      }
      font-size: 14px;
      color: rgba(255, 255, 255, 0.5);
    }
  }
}
@media screen and (max-width: 750px) {
  .pool-container {
    .link-block {
      width: 100%;
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
