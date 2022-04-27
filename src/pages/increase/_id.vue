<template>
  <div class="increase-container">
    <div class="go-back-box">
      <svg class="icon" aria-hidden="true" @click="goBackDetail">
        <use xlink:href="#icon-icon-return"></use>
      </svg>
    </div>
    <h3 class="title">Increase Liquidity</h3>
    <div class="increase-body">
      <div class="top">
        <div class="coin-pair">
          <img
            v-if="poolInfo"
            :src="poolInfo.token_a.icon || importIcon(`/coins/${poolInfo.token_a.symbol.toLowerCase()}.png`)"
            alt=""
          />
          <img
            v-if="poolInfo"
            class="last"
            :src="poolInfo.token_b.icon || importIcon(`/coins/${poolInfo.token_b.symbol.toLowerCase()}.png`)"
            alt=""
          />
          <span v-if="poolInfo">{{ poolInfo.token_a.symbol }} - {{ poolInfo.token_b.symbol }}</span>
          <StatusBlock :current-status="currentData.currentStatus" />
        </div>
        <div class="right">
          <RefreshIcon :loading="liquidity.currentPositonLoading" @refresh="refresh"></RefreshIcon>
          <SetIcon></SetIcon>
        </div>
      </div>
      <div class="increase-content">
        <div class="left">
          <ul class="liquidity-info">
            <li v-if="poolInfo">
              <span>{{ poolInfo.token_a.symbol }}</span>
              <span>{{ currentData.fromCoinAmount }}</span>
            </li>
            <li v-if="poolInfo">
              <span>{{ poolInfo.token_b.symbol }}</span>
              <span>{{ currentData.toCoinAmount }}</span>
            </li>
            <li v-if="poolInfo">
              <span>Fee Tier</span>
              <span>{{ poolInfo.feeView }} %</span>
            </li>
          </ul>
          <div class="selected-range-title">
            <span>Selected Range</span>
            <CoinTab :list="coinTabList" :current="currentCoin" @onChange="changeDirection"></CoinTab>
          </div>
          <!-- <div class="price-rate">1 CRM ≈ 1.003 USDT</div> -->
          <div v-if="direction && poolInfo" class="price-rate">
            1 {{ poolInfo.token_a.symbol }} ≈ {{ fixD(poolInfo.currentPriceView, poolInfo.token_b.decimal) }}
            {{ poolInfo.token_b.symbol }}
          </div>
          <div v-else-if="!direction && poolInfo" class="price-rate">
            1 {{ poolInfo.token_b.symbol }} ≈ {{ fixD(poolInfo.currentPriceViewReverse, poolInfo.token_a.decimal) }}
            {{ poolInfo.token_a.symbol }}
          </div>
          <div v-if="currentData && poolInfo" class="price-range-box">
            <div class="price-box">
              <div class="price-item">
                <h3>Min Price</h3>
                <div v-if="direction">{{ decimalFormat(currentData.minPrice, 6) }}</div>
                <div v-else>{{ decimalFormat(1 / currentData.maxPrice, 6) }}</div>
                <p>
                  {{ direction ? poolInfo.token_b.symbol : poolInfo.token_a.symbol }} per
                  {{ direction ? poolInfo.token_a.symbol : poolInfo.token_b.symbol }}
                </p>
              </div>
              <div class="price-item">
                <h3>Max Price</h3>
                <div v-if="direction">
                  {{ currentData.maxPrice.indexOf('+') > 0 ? '∞' : decimalFormat(currentData.maxPrice, 6) }}
                </div>
                <div v-else>
                  {{ currentData.maxPrice.indexOf('+') > 0 ? '∞' : decimalFormat(1 / currentData.minPrice, 6) }}
                </div>
                <p>
                  {{ direction ? poolInfo.token_b.symbol : poolInfo.token_a.symbol }} per
                  {{ direction ? poolInfo.token_a.symbol : poolInfo.token_b.symbol }}
                </p>
              </div>
            </div>
            <div class="note-box">
              <p class="note-item">
                Your position will be 100% {{ direction ? poolInfo.token_a.symbol : poolInfo.token_b.symbol }} at this
                price
              </p>
              <p class="note-item">
                Your position will be 100% {{ direction ? poolInfo.token_b.symbol : poolInfo.token_a.symbol }} at this
                price
              </p>
            </div>
          </div>
        </div>
        <div class="right">
          <CoinBlock
            v-model="fromCoinAmount"
            :coin-name="fromCoin ? fromCoin.symbol : ''"
            :balance="fromCoinBalance || null"
            :coin-icon="fromCoin.icon"
            :show-lock="showFromCoinLock"
            not-select
            @onInput="
              (amount) => {
                fixedFromCoin = true
                fromCoinAmount = amount
              }
            "
            @onMax="maxBtnSelect('fromCoin')"
          ></CoinBlock>
          <div class="coin-block-gap"></div>
          <CoinBlock
            v-model="toCoinAmount"
            :coin-name="toCoin ? toCoin.symbol : ''"
            :balance="toCoinBalance || null"
            :coin-icon="toCoin.icon"
            :show-lock="showToCoinLock"
            not-select
            @onInput="
              (amount) => {
                fixedFromCoin = false
                toCoinAmount = amount
              }
            "
            @onMax="maxBtnSelect('toCoin')"
          ></CoinBlock>
          <Button
            class="add-more-liquidity"
            :disabled="isLoading || isDisabled || insufficientBalance || noEnterAmount"
            :loading="isLoading"
            @click="toIncrease"
          >
            {{
              noEnterAmount ? 'Enter an amount' : insufficientBalance ? 'Insufficient balance' : 'Add More Liquidity'
            }}
          </Button>
        </div>
      </div>
    </div>
    <div v-show="liquidity.currentPositonLoading" class="loading-global"><Spin /></div>
  </div>
</template>
<script lang="ts">
import { Vue } from 'nuxt-property-decorator'
import { mapState } from 'vuex'
import { Button, Spin } from 'ant-design-vue'
import importIcon from '@/utils/import-icon'
import { fixD, decimalFormat, checkNullObj } from '@/utils'
import { TokenInfo } from '@/utils/tokens'
import { TokenAmount, gt } from '@/utils/safe-math'
import { cloneDeep } from 'lodash-es'
import { calculateLiquityOnlyA, calculateLiquityOnlyB, calculateLiquity } from 'test-crema-sdk'
import { PublicKey } from '@solana/web3.js'
import Decimal from 'decimal.js'
import { inputRegex, escapeRegExp } from '@/utils/regex'
import { getATAAddress } from '@saberhq/token-utils'
import { BroadcastOptions } from '@saberhq/solana-contrib'
import mixin from '@/mixin/position'
import { loadSwapPair } from '@/contract/pool'

export default Vue.extend({
  components: {
    Button,
    Spin
  },
  mixins: [mixin],
  data() {
    return {
      currentData: {} as any,
      direction: true,
      coinTabList: [] as any,
      currentCoin: '',
      fromCoin: {} as TokenInfo | null,
      toCoin: {} as TokenInfo | null,
      fromCoinAmount: '',
      toCoinAmount: '',
      fixedFromCoin: true,
      showFromCoinLock: false,
      showToCoinLock: false,
      deltaLiquity: 0,
      poolInfo: null as any,
      isLoading: false
    }
  },
  computed: {
    ...mapState({
      wallet: (state: any) => state.wallet,
      // position: (state: any) => state.position,
      liquidity: (state: any) => state.liquidity,
      url: (state: any) => state.url
    }),
    isDisabled(): boolean {
      const showFromCoinLock = this.showFromCoinLock
      const showToCoinLock = this.showToCoinLock

      const fromCoinAmount = this.$data.fromCoinAmount
      const toCoinAmount = this.$data.toCoinAmount

      if (showFromCoinLock && !showToCoinLock && toCoinAmount) {
        return false
      } else if (showToCoinLock && !showFromCoinLock && fromCoinAmount) {
        return false
      } else if (!showToCoinLock && !showFromCoinLock && toCoinAmount && fromCoinAmount) {
        return false
      }
      return true
    },
    insufficientBalance(): boolean {
      const fromCoinBalance = (this.fromCoinBalance && this.fromCoinBalance.fixed()) || ''
      const toCoinBalance = (this.$data.toCoin && this.toCoinBalance.fixed()) || ''

      const fromCoinInsufficient = gt(this.$data.fromCoinAmount, fromCoinBalance)
      const toCoinInsufficient = gt(this.$data.toCoinAmount, toCoinBalance)

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
    // if (poolInfo.token_a.token_mint === 'So11111111111111111111111111111111111111112') {
    //   this.fromCoin = {
    //     ...poolInfo.token_a,
    //     balance: this.wallet.tokenAccounts['11111111111111111111111111111111']?.balance || 0
    //   }
    // } else {
    //   this.fromCoin = {
    //     ...poolInfo.token_a,
    //     balance: this.wallet.tokenAccounts[poolInfo.token_a.token_mint]?.balance || 0
    //   }
    // }

    // if (poolInfo.token_b.token_mint === 'So11111111111111111111111111111111111111112') {
    //   this.toCoin = {
    //     ...poolInfo.token_b,
    //     balance: this.wallet.tokenAccounts['11111111111111111111111111111111']?.balance || 0
    //   }
    // } else {
    //   this.toCoin = {
    //     ...poolInfo.token_b,
    //     balance: this.wallet.tokenAccounts[poolInfo.token_b.token_mint]?.balance || 0
    //   }
    // }
    fromCoinBalance(): any {
      if (this.fromCoin && this.fromCoin.token_mint && this.wallet.tokenAccounts) {
        if (this.fromCoin.token_mint === 'So11111111111111111111111111111111111111112') {
          return this.wallet.tokenAccounts['11111111111111111111111111111111']?.balance || 0
        } else {
          return this.wallet.tokenAccounts[this.fromCoin.token_mint]?.balance || 0
        }
      }
      return 0
    },
    toCoinBalance(): any {
      if (this.toCoin && this.toCoin.token_mint && this.wallet.tokenAccounts) {
        if (this.toCoin.token_mint === 'So11111111111111111111111111111111111111112') {
          return this.wallet.tokenAccounts['11111111111111111111111111111111']?.balance || 0
        } else {
          return this.wallet.tokenAccounts[this.toCoin.token_mint]?.balance || 0
        }
      }
      return 0
    }
  },
  watch: {
    'liquidity.myPositions': {
      handler: 'watchMyPosions',
      immediate: true
    },
    'liquidity.currentPositon': {
      handler: 'watchCurrentPositon',
      immediate: true
    },
    direction(newVal: boolean) {
      if (newVal) {
        this.currentCoin = this.coinTabList[0]
      } else {
        this.currentCoin = this.coinTabList[1]
      }
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
    }
  },
  methods: {
    fixD,
    decimalFormat,
    importIcon,
    // updateAmounts(price: string, tick_lower: number, tick_upper: number) {
    updateAmounts() {
      if (!this.fromCoinAmount && !this.toCoinAmount) return
      let tick_lower = this.currentData.lowerTick
      let tick_upper = this.currentData.upperTick
      let coinAmount: any
      let direction: any
      if (this.fixedFromCoin) {
        coinAmount = new TokenAmount(this.fromCoinAmount, this.fromCoin?.decimal, false).wei.toNumber()
        direction =
          this.fromCoin?.symbol === this.poolInfo.token_a.symbol && this.toCoin?.symbol === this.poolInfo.token_b.symbol
            ? 0
            : 1
      } else {
        coinAmount = new TokenAmount(this.toCoinAmount, this.toCoin?.decimal, false).wei.toNumber()
        direction =
          this.toCoin?.symbol === this.poolInfo.token_a.symbol && this.toCoin?.symbol === this.poolInfo.token_b.symbol
            ? 0
            : 1
      }

      if (!this.showFromCoinLock && !this.showToCoinLock) {
        const { desiredAmountDst, deltaLiquity } = calculateLiquity(
          tick_lower,
          tick_upper,
          new Decimal(coinAmount),
          this.poolInfo.currentSqrtPrice,
          direction
        )
        const dst = desiredAmountDst.toNumber()
        const delta_liquity = deltaLiquity.toNumber()

        const decimal = this.toCoin?.decimal || 6
        this.deltaLiquity = delta_liquity

        if (this.fixedFromCoin) {
          const toCoinAmount = fixD(Math.abs(dst) / Math.pow(10, decimal), decimal) || '0'
          this.toCoinAmount = toCoinAmount === '--' ? '' : toCoinAmount
        } else {
          const fromCoinAmount = fixD(Math.abs(dst) / Math.pow(10, decimal), decimal) || '0'
          this.fromCoinAmount = fromCoinAmount === '--' ? '' : fromCoinAmount
        }
      } else if (!this.showToCoinLock) {
        // 区间在当前价格的左侧时，也就是只有token b这一种资产, 返回liquity
        const coinAmount = new TokenAmount(this.toCoinAmount, this.toCoin?.decimal, false).wei.toNumber()
        // const delta_liquity = deposit_only_token_b(tick_lower, tick_upper, coinAmount)
        const delta_liquity = calculateLiquityOnlyA(tick_lower, tick_upper, new Decimal(coinAmount))
        this.deltaLiquity = delta_liquity
      } else if (!this.showFromCoinLock) {
        // 区间在当前价格的右侧时，也就是只有token a这一种资产, 返回liquity
        const coinAmount = new TokenAmount(this.fromCoinAmount, this.fromCoin?.decimal, false).wei.toNumber()
        // const delta_liquity = deposit_only_token_a(tick_lower, tick_upper, coinAmount)
        const delta_liquity = calculateLiquityOnlyB(tick_lower, tick_upper, new Decimal(coinAmount))
        this.deltaLiquity = delta_liquity
      }
    },
    inputChange(amount: any) {
      if (this.fixedFromCoin) {
        this.fromCoinAmount = amount
        this.updateAmounts()
      } else {
        this.toCoinAmount = amount
        this.updateAmounts()
      }
    },
    goBackDetail() {
      const id = this.$route.params.id
      this.$router.push(`/detail/${id}`)
    },
    watchMyPosions(myPosions: any) {
      // const id = this.$route.params.id
      // if (this.liquidity.currentPositon && this.liquidity.currentPositon.id !== id) {
      // this.$accessor.liquidity.setCurrentPositon({
      //   myPosions,
      //   id: this.$route.params.id
      // })
      // }
    },
    watchCurrentPositon(currentPositon: any) {
      const id = this.$route.params.id
      if (currentPositon && currentPositon.nftTokenMint === id) {
        this.currentData = currentPositon
        if (!checkNullObj(currentPositon)) {
          const poolInfo = currentPositon
          this.poolInfo = poolInfo
          if (poolInfo.token_a && poolInfo.token_b) {
            this.coinTabList = [poolInfo.token_a.symbol, poolInfo.token_b.symbol]
            this.currentCoin = poolInfo.token_a.symbol
            this.fromCoin = poolInfo.token_a
            this.toCoin = poolInfo.token_b

            // if (poolInfo.token_a.token_mint === 'So11111111111111111111111111111111111111112') {
            //   this.fromCoin = {
            //     ...poolInfo.token_a,
            //     balance: this.wallet.tokenAccounts['11111111111111111111111111111111']?.balance || 0
            //   }
            // } else {
            //   this.fromCoin = {
            //     ...poolInfo.token_a,
            //     balance: this.wallet.tokenAccounts[poolInfo.token_a.token_mint]?.balance || 0
            //   }
            // }

            // if (poolInfo.token_b.token_mint === 'So11111111111111111111111111111111111111112') {
            //   this.toCoin = {
            //     ...poolInfo.token_b,
            //     balance: this.wallet.tokenAccounts['11111111111111111111111111111111']?.balance || 0
            //   }
            // } else {
            //   this.toCoin = {
            //     ...poolInfo.token_b,
            //     balance: this.wallet.tokenAccounts[poolInfo.token_b.token_mint]?.balance || 0
            //   }
            // }

            this.updateCoinInfo(this.wallet.tokenAccounts)
            if (Number(currentPositon.fromCoinAmount)) {
              this.showFromCoinLock = false
            } else {
              this.showFromCoinLock = true
            }

            if (Number(currentPositon.toCoinAmount)) {
              this.showToCoinLock = false
            } else {
              this.showToCoinLock = true
            }
          }
        }
      }
    },
    changeDirection() {
      this.direction = !this.direction
    },
    maxBtnSelect(key: string) {
      if (key === 'fromCoin') {
        this.fixedFromCoin = true
        this.fromCoinAmount =
          this.fromCoin && this.fromCoinBalance
            ? this.fromCoin.symbol !== 'SOL'
              ? this.fromCoinBalance.fixed()
              : fixD(Number(this.fromCoinBalance.fixed()) - 0.01, 9)
            : '0'
      } else {
        this.fixedFromCoin = false
        this.toCoinAmount =
          this.toCoin && this.toCoinBalance
            ? this.toCoin.symbol !== 'SOL'
              ? this.toCoinBalance.fixed()
              : fixD(Number(this.toCoinBalance.fixed()) - 0.01, 9)
            : '0'
      }
    },
    // 增加balance
    updateCoinInfo(tokenAccounts: any) {
      if (this.fromCoin) {
        const fromCoin = tokenAccounts[this.fromCoin.token_mint]

        if (fromCoin) {
          this.fromCoin = { ...this.fromCoin, ...fromCoin }
        }
      }

      if (this.toCoin) {
        const toCoin = tokenAccounts[this.toCoin.token_mint]

        if (toCoin) {
          this.toCoin = { ...this.toCoin, ...toCoin }
        }
      }
    },
    // async toIncrease() {
    //   this.isLoading = true
    //   const conn = this.$web3
    //   const wallet = (this as any).$wallet

    //   const poolInfo = cloneDeep(this.poolInfo)
    //   const currentData = cloneDeep(this.currentData)

    //   const swap = await loadSwapPair(this.poolInfo.tokenSwapKey, wallet)

    //   const userTokenA = await getATAAddress({
    //     mint: swap.tokenSwapInfo.tokenAMint,
    //     owner: swap.provider.wallet.publicKey
    //   })
    //   const userTokenB = await getATAAddress({
    //     mint: swap.tokenSwapInfo.tokenBMint,
    //     owner: swap.provider.wallet.publicKey
    //   })

    //   const liquityResult = swap.calculateLiquityWithSlid({
    //     lowerTick: currentData.lowerTick,
    //     upperTick: currentData.upperTick,
    //     amountA: new Decimal(this.fromCoinAmount),
    //     amountB: new Decimal(this.toCoinAmount),
    //     slid: new Decimal(Number(this.$accessor.slippage) / 100)
    //   })

    //   this.$accessor.transaction.setTransactionDesc(
    //     `Add liquidity  ${this.fromCoinAmount && this.fromCoinAmount} ${this.fromCoinAmount && this.fromCoin?.symbol} ${
    //       this.fromCoinAmount && this.toCoinAmount ? 'and' : ''
    //     } ${this.toCoinAmount && this.toCoinAmount} ${this.toCoinAmount && this.toCoin?.symbol}`
    //   )
    //   this.$accessor.transaction.setShowWaiting(true)

    //   let txid = ''
    //   try {
    //     console.log('Add liquidity####currentData.nft_token_id##', currentData.nftTokenId)
    //     console.log('Add liquidity####userTokenA##', userTokenA)
    //     console.log('Add liquidity####userTokenB##', userTokenB)
    //     console.log('Add liquidity####liquityResult.liquity##', liquityResult.liquity)
    //     console.log('Add liquidity####liquityResult.maximumAmountA##', liquityResult.maximumAmountA)
    //     console.log('Add liquidity####liquityResult.maximumAmountB##', liquityResult.maximumAmountB)
    //     console.log('Add liquidity####currentData.nftTokenAccount##', currentData.nftTokenAccount)
    //     const tx = await swap.increaseLiquity(
    //       currentData.nftTokenId,
    //       userTokenA,
    //       userTokenB,
    //       liquityResult.liquity,
    //       liquityResult.maximumAmountA,
    //       liquityResult.maximumAmountB,
    //       new PublicKey(currentData.nftTokenAccount)
    //     )

    //     const opt: BroadcastOptions = {
    //       skipPreflight: true,
    //       commitment: 'confirmed',
    //       preflightCommitment: 'confirmed',
    //       maxRetries: 30,
    //       printLogs: true
    //     }

    //     const receipt: any = await tx.send(opt)
    //     if (receipt && receipt.signature) {
    //       txid = receipt.signature
    //       const description = `Add liquidity  ${this.fromCoinAmount && this.fromCoinAmount} ${
    //         this.fromCoinAmount && this.fromCoin?.symbol
    //       }  ${this.fromCoinAmount && this.toCoinAmount ? 'and' : ''} ${this.toCoinAmount && this.toCoinAmount} ${
    //         this.toCoinAmount && this.toCoin?.symbol
    //       } to the pool`
    //       this.$accessor.transaction.setShowSubmitted(true)
    //       const _this = this
    //       this.$accessor.transaction.sub({
    //         txid,
    //         description,
    //         type: 'Add liquidity',
    //         successCallback: () => {
    //           // _this.$accessor.liquidity.requestInfos()
    //           _this.$accessor.liquidity.getMyPositionsNew(this.wallet.tokenAccounts)
    //           _this.isLoading = false
    //           _this.$accessor.transaction.setShowSubmitted(false)
    //         },
    //         errorCallback: () => {
    //           _this.isLoading = false
    //         }
    //       })
    //       this.fromCoinAmount = ''
    //       this.toCoinAmount = ''

    //       const whatWait = await receipt.wait({
    //         commitment: 'confirmed',
    //         useWebsocket: true,
    //         retries: 30
    //       })
    //     }
    //   } catch (error: any) {
    //     console.log('toAddLiquidity###error####', error)
    //     this.$accessor.transaction.setShowWaiting(false)
    //     this.$accessor.transaction.setShowSubmitted(false)
    //     this.$notify.close(txid + 'loading')
    //     this.$notify.error({
    //       key: 'AddLiquidityFailed',
    //       message: 'Add liquidity failed',
    //       description: error.message,
    //       class: 'error',
    //       icon: this.$createElement('img', { class: { 'notify-icon': true }, attrs: { src: '/icon_Error@2x.png' } })
    //     })
    //     this.isLoading = false
    //   }
    // }
    async toIncrease() {
      this.isLoading = true
      const conn = this.$web3
      const wallet = (this as any).$wallet

      const poolInfo = cloneDeep(this.poolInfo)
      const currentData = cloneDeep(this.currentData)

      const swap = await loadSwapPair(this.poolInfo.tokenSwapKey, wallet)

      const userTokenA = await getATAAddress({
        mint: swap.tokenSwapInfo.tokenAMint,
        owner: swap.provider.wallet.publicKey
      })
      const userTokenB = await getATAAddress({
        mint: swap.tokenSwapInfo.tokenBMint,
        owner: swap.provider.wallet.publicKey
      })

      // const liquityResult = swap.calculateLiquityWithSlid({
      //   lowerTick: currentData.lowerTick,
      //   upperTick: currentData.upperTick,
      //   amountA: new Decimal(this.fromCoinAmount),
      //   amountB: new Decimal(this.toCoinAmount),
      //   slid: new Decimal(Number(this.$accessor.slippage) / 100)
      // })

      let amountA = this.fromCoinAmount ? new Decimal(this.fromCoinAmount) : null
      let amountB = this.toCoinAmount ? new Decimal(this.toCoinAmount) : null
      const slid = new Decimal(Number(this.$accessor.slippage) / 100)

      let balanceA = new Decimal(this.fromCoinBalance.fixed()).mul(Math.pow(10, this.fromCoin.decimal))
      let balanceB = new Decimal(this.toCoinBalance.fixed()).mul(Math.pow(10, this.toCoin.decimal))

      console.log('increase###this.fromCoin####', this.fromCoin)
      console.log('increase###this.toCoin####', this.toCoin)

      console.log('increase###Math.pow(10, this.fromCoin.decimal)###', Math.pow(10, this.fromCoin.decimal))
      console.log('increase###Math.pow(10, this.toCoin.decimal)###', Math.pow(10, this.toCoin.decimal))

      console.log('increase###fromCoin.balance###', this.fromCoinBalance.fixed())
      console.log('increase###toCoin.balance###', this.toCoinBalance.fixed())

      console.log('increase###amountA####', amountA?.toString())
      console.log('increase###amountB####', amountB?.toString())

      console.log('increase###balanceA####', balanceA.toString())
      console.log('increase###balanceB####', balanceB.toString())

      // const {
      //   desiredAmountA,
      //   desiredAmountB,
      //   maxAmountA,
      //   maxAmountB,
      //   desiredDeltaLiquity,
      //   maxDeltaLiquity,
      //   fixTokenType,
      //   slidPrice
      // } = swap.calculateFixSideTokenAmount(
      //   currentData.lowerTick,
      //   currentData.upperTick,
      //   amountA,
      //   amountB,
      //   balanceA,
      //   balanceB,
      //   slid
      // )

      let liquityResult: any
      if (this.fixedFromCoin) {
        liquityResult = swap.calculateFixSideTokenAmount(
          currentData.lowerTick,
          currentData.upperTick,
          amountA,
          null,
          balanceA,
          balanceB,
          slid
        )
      } else {
        liquityResult = swap.calculateFixSideTokenAmount(
          currentData.lowerTick,
          currentData.upperTick,
          null,
          amountB,
          balanceA,
          balanceB,
          slid
        )
      }

      this.$accessor.transaction.setTransactionDesc(
        `Add liquidity  ${this.fromCoinAmount && this.fromCoinAmount} ${this.fromCoinAmount && this.fromCoin?.symbol} ${
          this.fromCoinAmount && this.toCoinAmount ? 'and' : ''
        } ${this.toCoinAmount && this.toCoinAmount} ${this.toCoinAmount && this.toCoin?.symbol}`
      )
      this.$accessor.transaction.setShowWaiting(true)

      let txid = ''
      try {
        console.log('Add liquidity####currentData.nft_token_id##', currentData.nftTokenId)
        console.log('Add liquidity####userTokenA##', userTokenA)
        console.log('Add liquidity####userTokenB##', userTokenB)
        // console.log('Add liquidity####liquityResult.liquity##', liquityResult.liquity)
        // console.log('Add liquidity####liquityResult.maximumAmountA##', liquityResult.maximumAmountA)
        // console.log('Add liquidity####liquityResult.maximumAmountB##', liquityResult.maximumAmountB)
        console.log('Add liquidity####currentData.nftTokenAccount##', currentData.nftTokenAccount)
        const tx = await swap.increaseLiquityFixToken(
          currentData.nftTokenId,
          userTokenA,
          userTokenB,
          liquityResult.fixTokenType,
          liquityResult.maxAmountA,
          liquityResult.maxAmountB,
          new PublicKey(currentData.nftTokenAccount)
        )

        const opt: BroadcastOptions = {
          skipPreflight: true,
          commitment: 'confirmed',
          preflightCommitment: 'confirmed',
          maxRetries: 30,
          printLogs: true
        }

        const receipt: any = await tx.send(opt)
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
              _this.$accessor.liquidity.getMyPositionsNew(this.wallet.tokenAccounts)
              _this.isLoading = false
              _this.$accessor.transaction.setShowSubmitted(false)
            },
            errorCallback: () => {
              _this.isLoading = false
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
        this.isLoading = false
      }
    }
  }
})
</script>
<style lang="less" scoped>
@import '../../styles/base.less';
.increase-container {
  width: 996px;
  margin: 0 auto;
  .go-back-box {
    .icon {
      width: 20px;
      height: 20px;
      fill: #fff;
      &:hover {
        fill: #07ebad;
      }
    }
  }
  > .title {
    font-size: 20px;
    font-weight: 600;
    color: #fff;
  }
  .increase-body {
    width: 100%;
    min-height: 449px;
    background: linear-gradient(214deg, #3e434e 0%, #23262b 100%);
    border-radius: 20px;
    border: 1px solid #565c6a;
    padding: 20px;
    .top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .coin-pair {
        display: flex;
        align-items: center;
        img {
          width: 36px;
          height: 36px;
          border-radius: 100%;
          &.last {
            margin-left: -10px;
          }
        }
        span {
          font-size: 16px;
          color: #fff;
          margin-left: 8px;
          margin-right: 8px;
        }
      }
      .right {
        display: flex;
        align-items: center;
        .set-icon-container {
          margin-left: 10px;
        }
      }
    }
    .increase-content {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
      .left,
      .right {
        width: 458px;
      }
      .left {
        .liquidity-info {
          width: 456px;
          height: 100px;
          box-shadow: 0px 4px 12px 0px #25282c;
          border-radius: 10px;
          border: 1px solid #3f434e;
          padding: 12px 20px;
          margin-bottom: 0px;
          li {
            display: flex;
            align-items: center;
            justify-content: space-between;
            color: #fff;
            font-size: 14px;
            margin-top: 6px;
            &:first-child {
              margin-top: 0px;
            }
          }
        }
        .selected-range-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 24px;
          > span {
            font-size: 16px;
          }
        }
        .price-rate {
          text-align: right;
          font-size: 16px;
          font-family: Arial-BoldMT, Arial;
          font-weight: normal;
          color: #fff;
          line-height: 16px;
          background: linear-gradient(233deg, #4bb5ff 0%, #ce90ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-top: 14px;
        }
        .price-range-box {
          width: 456px;
          height: 144px;
          box-shadow: 0px 4px 12px 0px #25282c;
          border-radius: 10px;
          border: 1px solid #3f434e;
          padding: 0px 20px;
          margin-top: 12px;
          .price-box {
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            align-items: center;
            padding-top: 14px;
            padding-bottom: 8px;
            justify-content: space-between;
            .price-item {
              width: 180px;
              text-align: center;
              h3 {
                font-size: 12px;
                color: rgba(#fff, 0.5);
                margin-bottom: 0px;
              }
              div {
                font-size: 14px;
                color: #fff;
                padding: 6px 0px;
              }
              p {
                font-size: 12px;
                color: rgba(#fff, 0.5);
                margin-bottom: 0px;
              }
            }
          }
          .note-box {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-top: 8px;
            .note-item {
              width: 180px;
              font-size: 12px;
              color: #b5b8c2;
              margin-bottom: 0px;
            }
          }
        }
      }
      .right {
        .coin-block-gap {
          width: 100%;
          height: 36px;
        }
        .add-more-liquidity {
          font-weight: bold;
          color: #fff;
          font-size: 20px;
          .gradient-btn-large();
          margin-top: 40px;
        }
      }
    }
  }
}
@media screen and (max-width: 750px) {
  .increase-container {
    width: 100%;
    .increase-body {
      padding: 20px 10px;
      .increase-content {
        display: block;
        .left {
          width: 100%;
          .liquidity-info {
            width: 100%;
          }
          .price-range-box {
            width: 100%;
            height: auto;
            .note-item {
              text-align: center;
            }
          }
        }
        .right {
          width: 100%;
          margin-top: 30px;
        }
      }
    }
  }
}
</style>
