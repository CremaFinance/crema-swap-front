<template>
  <div class="position-detail-container">
    <div class="go-back">
      <div class="left">
        <svg class="icon" aria-hidden="true" @click="gotoMyPosition">
          <use xlink:href="#icon-icon-return"></use>
        </svg>
        Back to Pools Overview
      </div>

      <RefreshIcon :loading="liquidity.currentPositonLoading" @refresh="refresh"></RefreshIcon>
    </div>
    <Skeleton :loading="!poolInfo" active :paragraph="false">
      <div class="top">
        <div class="left" style="display: flex">
          <div class="coin-name">
            <template v-if="direction">
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
            </template>
            <template v-else>
              <img
                v-if="poolInfo"
                :src="poolInfo.token_b.icon || importIcon(`/coins/${poolInfo.token_b.symbol.toLowerCase()}.png`)"
                alt=""
              />
              <img
                v-if="poolInfo"
                class="last"
                :src="poolInfo.token_a.icon || importIcon(`/coins/${poolInfo.token_a.symbol.toLowerCase()}.png`)"
                alt=""
              />
            </template>
            <span v-if="poolInfo && direction">{{ poolInfo.token_a.symbol }} - {{ poolInfo.token_b.symbol }}</span>
            <span v-else-if="poolInfo && !direction"
              >{{ poolInfo.token_b.symbol }} - {{ poolInfo.token_a.symbol }}</span
            >
          </div>
          <span class="fee">{{ poolInfo && poolInfo.feeView }} %</span>
          <StatusBlock :current-status="currentData.currentStatus" />
        </div>
        <div class="right">
          <button v-if="poolInfo" class="remove-btn" :disabled="!wallet.connected" @click="gotoRemove">Remove</button>
          <button v-if="poolInfo" class="increase-btn" :disabled="!wallet.connected" @click="gotoIncrease">
            Increase
          </button>
        </div>
      </div>
    </Skeleton>
    <div class="pool-info-box">
      <DetailInfoBlock
        title="Liquidity"
        :current-data="currentData"
        :pool-info="poolInfo"
        :direction="direction"
      ></DetailInfoBlock>
      <div class="detail-info-block-gap"></div>
      <DetailInfoBlock
        title="Unclaimed fees"
        :current-data="currentData"
        :pool-info="poolInfo"
        :direction="direction"
        @claim="showClaimHint = true"
      />
      <div class="nft-card-box">
        <NftCard :pool-info="poolInfo" :current-data="currentData"></NftCard>

        <div v-if="currentData.nftTokenMint" class="nft-address">
          <a :href="`https://solscan.io/account/${currentData.nftTokenAccount}`" target="_blank">
            {{ currentData.nftTokenMint.substr(0, 4) }}
            ...
            {{ currentData.nftTokenMint.substr(currentData.nftTokenMint.length - 4, 4) }}
          </a>
          <svg class="icon" aria-hidden="true" @click.stop="$accessor.copy(currentData.nftTokenMint)">
            <use xlink:href="#icon-icon_copy"></use>
          </svg>
        </div>
        <!-- <div v-if="poolInfo" class="nft-info">
          <div class="coin-name">{{ poolInfo.coin.symbol }} - {{ poolInfo.pc.symbol }}</div>
          <div class="fee-tier-tag">{{ poolInfo.feeView }}%</div>
          <ul>
            <li>
              <span>Min Tick</span>
              <span>{{ currentData.lower_tick }}</span>
            </li>
            <li>
              <span>Max Tick</span>
              <span>{{ currentData.upper_tick }}</span>
            </li>
          </ul>
        </div> -->
      </div>
    </div>
    <div class="price-range-box">
      <div class="price-range-title">
        <div class="left">
          <span>Price range</span>
          <StatusBlock :current-status="currentData.currentStatus" />
        </div>
        <div v-if="poolInfo" class="right">
          <div v-if="direction" class="price-box">
            1 {{ poolInfo.token_a.symbol }} ≈ {{ fixD(poolInfo.currentPriceView, poolInfo.token_b.decimal) }}
            {{ poolInfo.token_b.symbol }}
          </div>
          <div v-else class="price-box">
            1 {{ poolInfo.token_b.symbol }} ≈ {{ fixD(poolInfo.currentPriceViewReverse, poolInfo.token_a.decimal) }}
            {{ poolInfo.token_a.symbol }}
          </div>
          <div class="coin-tab-box">
            <CoinTab :list="coinTabList" :current="currentCoin" @onChange="changeDirection"></CoinTab>
          </div>
        </div>
      </div>
      <!-- <Skeleton :loading="!poolInfo" active> -->
      <div class="range-info-box">
        <Skeleton :loading="!poolInfo" active>
          <div v-if="poolInfo" class="range-item">
            <div class="title">Min Price</div>
            <div v-if="direction" class="price">{{ decimalFormat(currentData.minPrice, 6) }}</div>
            <div v-else class="price">{{ decimalFormat(1 / currentData.maxPrice, 6) }}</div>
            <div class="per">
              {{ direction ? poolInfo.token_b.symbol : poolInfo.token_a.symbol }} per
              {{ direction ? poolInfo.token_a.symbol : poolInfo.token_b.symbol }}
            </div>

            <div class="note">
              Your position will be 100% {{ direction ? poolInfo.token_a.symbol : poolInfo.token_b.symbol }} at this
              price
            </div>
          </div>
        </Skeleton>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-icon-link"></use>
        </svg>
        <Skeleton :loading="!poolInfo" active>
          <div v-if="poolInfo" class="range-item">
            <div class="title">Max Price</div>
            <div v-if="direction" class="price">
              {{ currentData.maxPrice.indexOf('+') > 0 ? '∞' : decimalFormat(currentData.maxPrice, 6) }}
            </div>
            <div v-else class="price">
              {{ currentData.maxPrice.indexOf('+') > 0 ? '∞' : decimalFormat(1 / currentData.minPrice, 6) }}
            </div>
            <div class="per">
              {{ direction ? poolInfo.token_b.symbol : poolInfo.token_a.symbol }} per
              {{ direction ? poolInfo.token_a.symbol : poolInfo.token_b.symbol }}
            </div>
            <div class="note">
              Your position will be 100% {{ direction ? poolInfo.token_b.symbol : poolInfo.token_a.symbol }} at this
              price
            </div>
          </div>
        </Skeleton>
      </div>
      <!-- </Skeleton> -->
      <div v-show="liquidity.currentPositonLoading" class="loading-global"><Spin /></div>
    </div>
    <Claim
      v-if="showClaimHint"
      :current-data="currentData"
      :pool-info="poolInfo"
      :tokena-fee="String(currentData.tokenaFee)"
      :tokenb-fee="String(currentData.tokenbFee)"
      :is-loading="isLoading"
      @onClose="() => (showClaimHint = false)"
      @toClaim="toClaimNew"
    ></Claim>
  </div>
</template>
<script lang="ts">
import { Vue } from 'nuxt-property-decorator'
import { mapState } from 'vuex'
import { fixD, getUnixTs, decimalFormat, checkNullObj } from '@/utils'
import { cloneDeep, get } from 'lodash-es'
import { claim, removeLiquidity } from '@/utils/liquidity'
import importIcon from '@/utils/import-icon'
import { PublicKey, Connection } from '@solana/web3.js'
import Decimal from 'decimal.js'
import { TokenSwap as TokenSwapNew } from 'test-crema-sdk'
import { getATAAddress } from '@saberhq/token-utils'
import { BroadcastOptions, SolanaProvider } from '@saberhq/solana-contrib'
import type { Provider } from '@saberhq/solana-contrib'
import mixin from '@/mixin/position'
import { loadSwapPair } from '@/contract/pool'
import { Skeleton, Spin } from 'ant-design-vue'

export default Vue.extend({
  components: {
    Skeleton,
    Spin
  },
  mixins: [mixin],
  data() {
    return {
      isShowTitleOne: true,
      isShowTitleTwo: false,
      currentData: {} as any,
      direction: true,
      showAddLiquiditySecondConfirm: false,
      secondConfirmData: {},
      showRemoveLiquidityHint: false,
      showClaimHint: false,
      isLoading: false,
      coinTabList: [] as any,
      currentCoin: '',
      poolInfo: null as any
    }
  },
  computed: {
    // ...mapState(['wallet', 'farm', 'url', 'price', 'liquidity'])
    ...mapState({
      // price: (state: any) => state.price,
      wallet: (state: any) => state.wallet,
      // position: (state: any) => state.position,
      url: (state: any) => state.url,
      liquidity: (state: any) => state.liquidity
    })
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
    'wallet.connected'(newVal: boolean) {
      if (!newVal) {
        this.$router.push('/position')
      }
    },
    direction(newVal: boolean) {
      if (newVal) {
        this.currentCoin = this.coinTabList[0]
      } else {
        this.currentCoin = this.coinTabList[1]
      }
    }
  },
  mounted() {},
  methods: {
    importIcon,
    fixD,
    decimalFormat,
    watchCurrentPositon(currentPositon: any) {
      console.log('currentPositon#####', currentPositon)
      this.currentData = currentPositon
      if (!checkNullObj(currentPositon)) {
        const poolInfo = currentPositon
        this.poolInfo = poolInfo
        if (poolInfo.token_a && poolInfo.token_b) {
          this.coinTabList = [poolInfo.token_a.symbol, poolInfo.token_b.symbol]
          this.currentCoin = poolInfo.token_a.symbol
        }
      }
    },
    changeDirection() {
      this.direction = !this.direction
    },
    gotoMyPosition() {
      this.$router.push('/position')
    },
    gotoIncrease() {
      const id = this.$route.params.id
      this.$router.push(`/increase/${id}`)
    },
    gotoRemove() {
      const id = this.$route.params.id
      this.$router.push(`/remove/${id}`)
    },
    openRemoveLiquidityHint() {
      const id = this.$route.params.id
      this.$router.push(`/remove-liquidity/${id}`)
      this.showRemoveLiquidityHint = true
    },
    watchMyPosions(myPosions: any) {
      // console.log('123myPosions###', myPosions)
      // this.$accessor.liquidity.setCurrentPositon({
      //   myPosions,
      //   id: this.$route.params.id
      // })
    },
    openAddLiquiditySecondConfirm() {
      const currentPriceP = Number(Math.pow(Number(this.currentData.currentPrice) / Math.pow(10, 12), 2))
      this.secondConfirmData = {
        fromCoin: this.currentData.coin,
        toCoin: this.currentData.pc,
        fromCoinAmount: this.currentData.fromCoinAmount,
        toCoinAmount: this.currentData.toCoinAmount,
        currentPrice: currentPriceP,
        minPrice: this.currentData.minPrice,
        maxPrice: this.currentData.maxPrice,
        showFromCoinLock: !Number(this.currentData.fromCoinAmount),
        showToCoinLock: !Number(this.currentData.toCoinAmount),
        // feeTier: '0.01%',
        currentStatus: this.currentData.currentStatus,
        ...this.currentData
      }
      this.showAddLiquiditySecondConfirm = true
    },
    closeAddLiquiditySecondConfirm() {
      this.secondConfirmData = {}
      this.showAddLiquiditySecondConfirm = false
    },
    async toClaimNew() {
      this.isLoading = true
      const conn = this.$web3
      const wallet = (this as any).$wallet

      const poolInfo = cloneDeep(this.poolInfo)
      const currentData = cloneDeep(this.currentData)
      // const nftAccount = get(this.wallet.tokenAccounts, `${currentData.nftTokenMint}.tokenAccountAddress`)
      const swap = await loadSwapPair(poolInfo.tokenSwapKey, wallet)

      // const userTokenA = await getATAAddress({
      //   mint: swap.tokenSwapInfo.tokenAMint,
      //   owner: swap.provider.wallet.publicKey
      // })
      // const userTokenB = await getATAAddress({
      //   mint: swap.tokenSwapInfo.tokenBMint,
      //   owner: swap.provider.wallet.publicKey
      // })

      // const feeAmount = swap.preClaim(currentData.nftTokenMint)
      this.showClaimHint = false
      this.$accessor.transaction.setTransactionDesc('Claim')

      this.$accessor.transaction.setShowWaiting(true)

      let txid = ''

      try {
        const tx = await swap.claimAtomic(
          currentData.nftTokenId,
          // userTokenA,
          // userTokenB,
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
          let description = ''
          if (currentData.tokenaFee && currentData.tokenbFee) {
            description = `Claimed ${currentData.tokenaFee} ${poolInfo.token_a.symbol} and ${currentData.tokenbFee} ${poolInfo.token_b.symbol}`
          } else if (currentData.tokenaFee) {
            description = `Claimed ${currentData.tokenaFee} ${poolInfo.token_a.symbol}`
          } else if (currentData.tokenbFee) {
            description = `Claimed ${currentData.tokenbFee} ${poolInfo.token_b.symbol}`
          }
          this.$accessor.transaction.setShowSubmitted(true)
          const _this = this
          this.$accessor.transaction.sub({
            txid,
            description,
            type: 'Claim',
            successCallback: () => {
              _this.isLoading = false
              _this.$accessor.liquidity.getMyPositionsNew(this.wallet.tokenAccounts)
              _this.$accessor.transaction.setShowSubmitted(false)
              // _this.$accessor.liquidity.requestInfos()
            },
            errorCallback: () => {
              _this.isLoading = false
            }
          })

          const whatWait = await receipt.wait({
            commitment: 'confirmed',
            useWebsocket: true,
            retries: 30
          })
        }
      } catch (error: any) {
        console.log('toRemoveLiquidity###error####', error)
        this.$accessor.transaction.setShowWaiting(false)
        this.$accessor.transaction.setShowSubmitted(false)
        this.$notify.close(txid + 'loading')
        this.$notify.error({
          key: 'ClaimFailed',
          message: 'Claim failed',
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
.position-detail-container {
  width: 700px;
  margin: 0 auto;
  .go-back {
    display: flex;
    align-items: center;
    justify-content: space-between;
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
    > .left {
      display: flex;
      align-items: center;
    }
  }
  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 20px;
    .left,
    .right {
      display: flex;
      align-items: center;
      .remove-btn {
        &:hover {
          background: rgba(255, 255, 255, 0.05);
        }
      }
    }
    .coin-name {
      display: flex;
      align-items: center;
      font-size: 20px;
      img {
        width: 30px;
        height: 30px;
        border-radius: 100%;
        &.last {
          margin-left: -10px;
          margin-right: 8px;
        }
      }
    }
    .fee {
      min-width: 60px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      filter: blur(0px);
      margin-left: 10px;
      margin-right: 10px;
      font-size: 14px;
      padding: 0px 6px;
    }
    > .right {
      button {
        width: 120px;
        height: 28px;
        box-shadow: 0px 4px 12px 0px #25282c;
        border-radius: 8px;
        border: 1px solid #3f434e;
        background: none;
        margin-left: 12px;
        &.increase-btn {
          background: linear-gradient(270deg, #5fe6d0 0%, #60b2f1 33%, #9380ff 68%, #e590ff 100%);
          &:hover {
            background: linear-gradient(268deg, #74ffe8 0%, #7592ff 39%, #a08fff 74%, #e89aff 100%);
          }
        }
      }
    }
  }
  .pool-info-box {
    position: relative;
    padding-left: 240px;
    margin-top: 20px;

    .detail-info-block-gap {
      width: 100%;
      height: 18px;
    }
    .nft-card-box {
      position: absolute;
      left: 0px;
      top: 18px;
      .nft-info {
        width: 140px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        .coin-name {
          text-align: center;
          font-size: 20px;
          color: #fff;
        }
        .fee-tier-tag {
          width: 80px;
          height: 24px;
          background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.1) 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          color: #fff;
          margin: 0 auto;
          margin-top: 10px;
        }
        > ul {
          margin-bottom: 0px;
          li {
            display: flex;
            align-items: center;
            justify-content: space-between;
            color: #fff;
            margin-top: 10px;
            font-size: 14px;
            span {
              &:first-child {
                color: rgba(255, 255, 255, 0.2);
              }
              &:last-child {
                text-align: right;
              }
            }
          }
        }
      }
      .nft-address {
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        svg {
          fill: rgba(255, 255, 255, 0.5);
          width: 14px;
          height: 14px;
          margin-left: 6px;
        }
        a {
          font-size: 14px;
          color: #fff;
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }
  .price-range-box {
    width: 700px;
    height: 208px;
    background: linear-gradient(214deg, #3e434e 0%, #23262b 100%);
    box-shadow: 0px 4px 12px 0px rgba(26, 28, 31, 0.5);
    border-radius: 10px;
    border: 1px solid #3f434e;
    padding: 20px;
    margin-top: 20px;
    .price-range-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      > div {
        display: flex;
        align-items: center;
      }
      .left {
        > span {
          font-size: 14px;
          margin-right: 8px;
        }
      }
      .right {
        .price-box {
          // width: 165px;
          height: 16px;
          font-size: 16px;
          font-family: Arial-BoldMT, Arial;
          font-weight: normal;
          color: #fff;
          line-height: 16px;
          background: linear-gradient(233deg, #4bb5ff 0%, #ce90ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-right: 16px;
        }
      }
    }
    .range-info-box {
      display: flex;
      align-items: center;
      // margin-top: 20px;
      .range-item {
        width: 308px;
        height: 119px;
        background: linear-gradient(214deg, #3e434e 0%, #23262b 100%);
        box-shadow: 0px 4px 12px 0px rgba(26, 28, 31, 0.5);
        border-radius: 10px;
        border: 1px solid #3f434e;
        text-align: center;
        flex: 1;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.5);
        padding: 10px 0px;
        margin-top: 20px;
        .price {
          font-size: 16px;
          color: #fff;
          font-weight: 600;
        }
        .note {
          font-size: 12px;
          color: #b5b8c2;
          margin-top: 8px;
        }
      }
      > svg {
        margin: 12px;
        width: 20px;
        height: 20px;
        fill: rgba(255, 255, 255, 0.5);
        margin-top: 32px;
      }
    }
  }
}
@media screen and (max-width: 750px) {
  .position-detail-container {
    width: 100%;
    .go-back {
      margin-top: 10px;
    }
    .top {
      display: block;
      .left {
        span {
          font-size: 16px;
        }
      }
      .right {
        margin-top: 10px;
        padding: 0 10px;
        justify-content: flex-end;
      }
    }
    .pool-info-box {
      padding-left: 0;
      .nft-card-box {
        position: relative;
        margin: 0 auto;
        top: 0;
        display: flex;
        flex-direction: column-reverse;
        flex-wrap: wrap;
      }
    }
    .price-range-box {
      width: 100%;
      height: auto;
      margin-bottom: 10px;
      .price-range-title {
        display: block;
        .right {
          margin-top: 10px;
          display: block;
          .coin-tab-box {
            display: flex;
            margin-top: 10px;
            justify-content: flex-end;
          }
        }
      }
      .range-info-box .range-item {
        height: auto;
      }
    }
  }
}
</style>
