<template>
  <div class="container remove-container">
    <div class="back-btn" @click="gotoPosition">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-icon-return"></use>
      </svg>
    </div>
    <div class="title">Remove Liquidity</div>

    <div class="pool-settings">
      <div class="top-box">
        <div v-if="poolInfo" class="left">
          <img :src="importIcon(`/coins/${poolInfo.token_a.symbol.toLowerCase()}.png`)" />
          <img class="last" :src="importIcon(`/coins/${poolInfo.token_b.symbol.toLowerCase()}.png`)" />
          <span>{{ poolInfo.token_a.symbol }} - {{ poolInfo.token_b.symbol }}</span>
          <StatusBlock :current-status="currentData.currentStatus" />
        </div>
        <div class="right">
          <SetIcon></SetIcon>
        </div>
      </div>
      <div class="amount">
        <div class="amount-title">Amount</div>
        <div class="amount-tab">
          <div class="amount-left">{{ sliderValue }}%</div>
          <div class="amount-right">
            <div
              v-for="(item, index) in amountPercentage"
              :key="item.name"
              class="amount-tab-btn"
              :class="amountPercentageIndex == index || sliderValue / 100 == item.value ? 'amount-tab-btn-active' : ''"
              @click="setPercent(item, index)"
            >
              {{ item.name }}
            </div>
          </div>
        </div>
        <Slider
          v-model="sliderValue"
          :tooltip-visible="sliderChangeFlag"
          :tooltip-placement="'bottom'"
          @change="sliderChange"
        ></Slider>
      </div>
      <div class="liquidity-coins">
        <div class="before-coin">
          <div v-if="poolInfo" class="coin-label">Pooled {{ poolInfo.token_a.symbol }}:</div>
          <div v-if="poolInfo" class="coin-num">
            {{ decimalFormat(fromCoinAmount, poolInfo.token_a.decimal) }}
          </div>
        </div>
        <div class="before-coin after-coin">
          <div v-if="poolInfo" class="coin-label">Pooled {{ poolInfo.token_b.symbol }}:</div>
          <div v-if="poolInfo" class="coin-num">
            {{ decimalFormat(toCoinAmount, poolInfo.token_b.decimal) }}
          </div>
        </div>
        <template v-if="Number(currentData.tokenaFee) !== 0 || Number(currentData.tokenbFee) !== 0">
          <div class="coin-line"></div>
          <div class="before-coin">
            <div v-if="poolInfo" class="coin-label">{{ poolInfo.token_a.symbol }} Fees Earned:</div>
            <div class="coin-num">
              {{ currentData.tokenaFee }}
            </div>
          </div>
          <div class="before-coin after-coin">
            <div v-if="poolInfo" class="coin-label">{{ poolInfo.token_b.symbol }} Fees Earned :</div>
            <div class="coin-num">
              {{ currentData.tokenbFee }}
            </div>
          </div>
        </template>
      </div>
      <Button class="remove-btn" :disabled="isLoading" :loading="isLoading" @click="toRemoveNew">Remove</Button>
    </div>
    <Setting v-if="showSetting" @onClose="() => (showSetting = false)"></Setting>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { Slider, Button } from 'ant-design-vue'
import importIcon from '@/utils/import-icon'
import { mapState } from 'vuex'
import { checkNullObj, decimalFormat, fixD } from '@/utils'
import { cloneDeep } from 'lodash-es'
import { PublicKey } from '@solana/web3.js'
import Decimal from 'decimal.js'
import { getATAAddress } from '@saberhq/token-utils'
import { BroadcastOptions } from '@saberhq/solana-contrib'
import { loadSwapPair } from '@/contract/pool'
import mixin from '@/mixin/position'

Vue.use(Slider).use(Button)

export default Vue.extend({
  components: {
    Slider,
    Button
  },
  mixins: [mixin],
  data() {
    return {
      title: 'CRM',
      isRemove: false,
      showSetting: false,
      untitle: 'USDT',
      nowtitle: 'CRM',
      sliderValue: 50,
      currentData: {} as any,
      poolInfo: null as any,
      amountPercentageIndex: 1,
      amountPercentage: [
        {
          name: '25%',
          value: 0.25
        },
        {
          name: '50%',
          value: 0.5
        },
        {
          name: '75%',
          value: 0.75
        },
        {
          name: 'Max',
          value: 1
        }
      ],
      sliderChangeFlag: false,
      fromCoinAmount: '0',
      toCoinAmount: '0',
      currentStatus: '',
      isLoading: false
    }
  },
  computed: {
    ...mapState({
      wallet: (state: any) => state.wallet,
      liquidity: (state: any) => state.liquidity,
      url: (state: any) => state.url
    })
  },
  watch: {
    sliderValue(val: any) {
      this.sliderValue = Math.ceil(val)
    },
    'liquidity.myPositions': {
      handler: 'watchMyPosions',
      immediate: true
    },
    'liquidity.currentPositon': {
      handler: 'watchCurrentPositon',
      immediate: true
    }
  },
  methods: {
    decimalFormat,
    importIcon,
    gotoPosition() {
      this.$router.push('/position')
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
      console.log('remove##watchCurrentPositon###currentPositon###', currentPositon)
      const id = this.$route.params.id

      if (currentPositon && currentPositon.nftTokenMint === id) {
        this.currentData = currentPositon
        if (currentPositon.fromCoinAmount) {
          this.fromCoinAmount = String(currentPositon.fromCoinAmount * Number(this.sliderValue / 100))
        }
        if (currentPositon.toCoinAmount) {
          this.toCoinAmount = String(currentPositon.toCoinAmount * Number(this.sliderValue / 100))
        }
        const poolInfo = currentPositon
        this.poolInfo = poolInfo
        console.log('remove####watchCurrentPositon###poolInfo######', poolInfo)
      } else {
        // this.gotoPosition()
      }
    },
    setPercent(item: any, index: any) {
      this.amountPercentageIndex = index
      // this.sliderChangeFlag = false
      this.sliderValue = item.value * 100
      const { fromCoinAmount, toCoinAmount } = this.currentData
      if (fromCoinAmount && toCoinAmount) {
        this.fromCoinAmount = String(fromCoinAmount * Number(item.value))
        this.toCoinAmount = String(toCoinAmount * Number(item.value))
      }
    },
    sliderChange(value: string) {
      this.sliderChangeFlag = true
      this.amountPercentageIndex = -1
      this.setPercent({ value: this.sliderValue / 100 }, -1)
    },
    async toRemoveNew() {
      this.sliderChangeFlag = false
      this.isLoading = true
      const conn = this.$web3
      const wallet = (this as any).$wallet
      const poolInfo = cloneDeep(this.poolInfo)
      const currentData = cloneDeep(this.currentData)
      // const nftAccount = get(this.wallet.tokenAccounts, `${currentData.nft_token_id}.tokenAccountAddress`)

      const swap = await loadSwapPair(poolInfo.tokenSwapKey, wallet)
      // const userTokenA = await getATAAddress({
      //   mint: swap.tokenSwapInfo.tokenAMint,
      //   owner: swap.provider.wallet.publicKey
      // })
      // const userTokenB = await getATAAddress({
      //   mint: swap.tokenSwapInfo.tokenBMint,
      //   owner: swap.provider.wallet.publicKey
      // })

      console.log('toRemoveNew####this.sliderValue / 100###', this.sliderValue / 100)
      console.log('toRemoveNew####Number(this.$accessor.slippage) / 100###', Number(this.$accessor.slippage) / 100)
      const positionValue = swap.calculatePositionValueWithSlid(
        currentData.nftTokenId,
        new Decimal(this.sliderValue / 100),
        new Decimal(Number(this.$accessor.slippage) / 100)
      )

      this.$accessor.transaction.setTransactionDesc('Remove liquidity')

      this.$accessor.transaction.setShowWaiting(true)

      let txid = ''

      let positionMinAmountA: any
      let positionMinAmountB: any
      if (positionValue.minAmountA.toString() && positionValue.minAmountA.toString() !== '0') {
        positionMinAmountA = positionValue.minAmountA.sub(
          Math.pow(10, Math.floor(Number(currentData.token_a.decimal / 2)))
        )
      } else {
        positionMinAmountA = positionValue.minAmountA
      }

      if (positionValue.minAmountB.toString() && positionValue.minAmountB.toString() !== '0') {
        positionMinAmountB = positionValue.minAmountB.sub(
          Math.pow(10, Math.floor(Number(currentData.token_b.decimal / 2)))
        )
      } else {
        positionMinAmountB = positionValue.minAmountB
      }

      try {
        console.log('toRemoveNew####currentData.nftTokenId###', currentData.nftTokenId)
        // console.log('toRemoveNew####userTokenA###', userTokenA)
        // console.log('toRemoveNew####userTokenB###', userTokenB)
        console.log('toRemoveNew####positionValue.liquity###', positionValue.liquity.toString())
        console.log('toRemoveNew####positionValue.minAmountA###', positionValue.minAmountA.toString())
        console.log('toRemoveNew####positionValue.minAmountB###', positionValue.minAmountB.toString())
        console.log('toRemoveNew####currentData.nftTokenAccount###', currentData.nftTokenAccount)
        const tx = await swap.decreaseLiquityAtomic(
          currentData.nftTokenId,
          // userTokenA,
          // userTokenB,
          positionValue.liquity,
          positionMinAmountA,
          positionMinAmountB,
          // positionValue.minAmountA,
          // positionValue.minAmountB,
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
          const description = `Remove  ${this.fromCoinAmount} ${poolInfo.token_a?.symbol} and ${this.toCoinAmount} ${poolInfo.token_b?.symbol} from the pool`
          this.$accessor.transaction.setShowSubmitted(true)
          const _this = this
          this.$accessor.transaction.sub({
            txid,
            description,
            type: 'Remove liquidity',
            successCallback: () => {
              _this.isLoading = false
              // _this.$accessor.liquidity.requestInfos()

              if (_this.sliderValue === 100) {
                _this.gotoPosition()
              } else {
                _this.$accessor.liquidity.getMyPositionsNew(this.wallet.tokenAccounts)
                _this.$accessor.transaction.setShowSubmitted(false)
              }
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
        this.isLoading = false
        this.$accessor.transaction.setShowWaiting(false)
        this.$accessor.transaction.setShowSubmitted(false)
        this.$notify.close(txid + 'loading')
        this.$notify.error({
          key: 'RemoveLiquidityFailed',
          message: 'Remove liquidity failed',
          description: error.message,
          class: 'error',
          icon: this.$createElement('img', { class: { 'notify-icon': true }, attrs: { src: '/icon_Error@2x.png' } })
        })
      }
    }
  }
})
</script>
<style lang="less" scoped>
@import '../../styles/base.less';
.remove-container {
  padding: 20px;
}
.container {
  width: 492px;
  .back-btn {
    display: flex;
    align-items: center;
    .icon {
      width: 20px;
      height: 20px;
      fill: #fff;
      &:hover {
        fill: #07ebad;
      }
    }
  }
  .title {
    font-size: 20px;
    margin-top: 10px;
    font-weight: 600;
  }
  .pool-settings {
    margin-top: 20px;
    background: linear-gradient(214deg, #3e434e 0%, #23262b 100%);
    border-radius: 20px;
    border: 1px solid #565c6a;
    padding: 20px;
    .top-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .left {
        display: flex;
        align-items: center;
        img {
          width: 36px;
          height: 36px;
          &.last {
            margin-left: -10px;
          }
        }
        > span {
          font-size: 16px;
          color: #fff;
          margin-left: 8px;
          margin-right: 8px;
          white-space: nowrap;
        }
      }
    }
    .amount {
      margin-top: 20px;
      padding: 20px;
      // background: rgba(255, 255, 255, 0.03);
      box-shadow: 0px 4px 12px 0px #25282c;
      border-radius: 10px;
      border: 1px solid #3f434e;
      .amount-title {
        font-size: 14px;
        color: #fff;
      }
      .amount-tab {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 16px;
        .amount-left {
          font-size: 24px;
          font-weight: normal;
          color: #fff;
        }
        .amount-right {
          display: flex;
          align-items: center;
          justify-content: space-between;
          .amount-tab-btn {
            width: 60px;
            height: 32px;
            // background: rgba(7, 235, 173, 0.05);
            // border: 1px solid #07ebad;
            font-size: 12px;
            color: rgba(#fff, 0.75);
            line-height: 32px;
            text-align: center;
            cursor: pointer;
            box-shadow: 0px 4px 12px 0px #25282c;
            border-radius: 6px;
            border: 1px solid #3f434e;
            & + .amount-tab-btn {
              margin-left: 20px;
            }
            &:hover,
            &:active {
              background: #42454b;
              box-shadow: 0px 2px 6px 0px rgba(26, 28, 31, 0.5);
              border-radius: 6px;
              border: 1px solid #07ebad;
              color: #07ebad;
            }
          }
          .amount-tab-btn-active {
            // background: rgba(7, 235, 173, 0.3);
            border-radius: 6px;
            border: 1px solid #07ebad;
            color: #07ebad;
          }
        }
      }
      .ant-slider {
        margin: 28px 0px 0px;
        /deep/ .ant-slider-track {
          // height: 2px;
          background: #07ebad;
        }
        /deep/ .ant-slider-rail {
          // height: 2px;
          background: rgba(255, 255, 255, 0.1);
        }
        /deep/ .ant-slider-handle.ant-tooltip-open {
          // width: 10px;
          // height: 10px;
          background: #07ebad;
        }
        /deep/.ant-slider-handle {
          // margin-top: -3px;
        }
      }
    }
    .liquidity-coins {
      margin-top: 20px;
      padding: 25px 20px;
      box-shadow: 0px 4px 12px 0px #25282c;
      border-radius: 10px;
      border: 1px solid #3f434e;
      .before-coin {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .coin-label {
          font-size: 14px;
          color: #b5b8c2;
        }
        .coin-num {
          font-size: 16px;
          font-weight: normal;
          color: #fff;
          img {
            width: 20px;
            height: 20px;
            margin-left: 7px;
          }
        }
      }
      .after-coin {
        margin-top: 21px;
      }
      .coin-line {
        width: 100%;
        margin: 30px 0;
        height: 1px;
        box-shadow: 0px 4px 12px 0px #25282c;
        background-color: #3f434e;
      }
    }
  }
  .remove-btn {
    font-weight: bold;
    color: #fff;
    font-size: 20px;
    .gradient-btn-large();
    margin-top: 40px;
  }
}
@media screen and (max-width: 750px) {
  .remove-container {
    padding: 20px 0px 0;
  }
  .container {
    width: 100%;
    .pool-settings {
      padding: 20px 10px;
      .top-box {
        .left {
          img {
            width: 20px;
            height: 20px;
          }
          span {
            font-size: 14px;
          }
        }
      }
      .amount .amount-tab .amount-right .amount-tab-btn {
        width: 40px;
        & + .amount-tab-btn {
          margin-left: 10px;
        }
      }
    }
  }
}
</style>
