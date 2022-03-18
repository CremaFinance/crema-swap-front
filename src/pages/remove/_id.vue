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
          <img :src="importIcon(`/coins/${poolInfo.coin.symbol.toLowerCase()}.png`)" />
          <img class="last" :src="importIcon(`/coins/${poolInfo.pc.symbol.toLowerCase()}.png`)" />
          <span>{{ poolInfo.coin.symbol }} - {{ poolInfo.pc.symbol }}</span>
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
          <div v-if="poolInfo" class="coin-label">Pooled {{ poolInfo.coin.symbol }}:</div>
          <div class="coin-num">
            {{ decimalFormat(fromCoinAmount, poolInfo.coin.decimals) }}
          </div>
        </div>
        <div class="before-coin after-coin">
          <div v-if="poolInfo" class="coin-label">Pooled {{ poolInfo.pc.symbol }}:</div>
          <div class="coin-num">
            {{ decimalFormat(toCoinAmount, poolInfo.pc.decimals) }}
          </div>
        </div>
        <template v-if="Number(currentData.tokenaFee) !== 0 || Number(currentData.tokenbFee) !== 0">
          <div class="coin-line"></div>
          <div class="before-coin">
            <div v-if="poolInfo" class="coin-label">{{ poolInfo.coin.symbol }} Fees Earned:</div>
            <div class="coin-num">
              {{ currentData.tokenaFee }}
            </div>
          </div>
          <div class="before-coin after-coin">
            <div v-if="poolInfo" class="coin-label">{{ poolInfo.pc.symbol }} Fees Earned :</div>
            <div class="coin-num">
              {{ currentData.tokenbFee }}
            </div>
          </div>
        </template>
      </div>
      <Button class="remove-btn" :disabled="isLoading" :loading="isLoading" @click="toRemove">Remove</Button>
    </div>
    <Setting v-if="showSetting" @onClose="() => (showSetting = false)"></Setting>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { Modal, Slider, Button } from 'ant-design-vue'
import importIcon from '@/utils/import-icon'
import { mapState } from 'vuex'
import { checkNullObj, getUnixTs, decimalFormat, fixD } from '@/utils'
import { clone, cloneDeep, get } from 'lodash-es'
import { removeLiquidity } from '@/utils/liquidity'
import { calculateSlidTokenAmount, TokenSwap } from '@cremafinance/crema-sdk'
import { PublicKey } from '@solana/web3.js'
import { SWAPV3_PROGRAMID } from '@/utils/ids'
import Decimal from 'decimal.js'

Vue.use(Slider).use(Button)

export default Vue.extend({
  components: {
    Slider,
    Button
  },
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
      const id = this.$route.params.id
      // if (this.liquidity.currentPositon && this.liquidity.currentPositon.id !== id) {
      this.$accessor.liquidity.setCurrentPositon({
        myPosions,
        id: this.$route.params.id
      })
      // }
    },
    watchCurrentPositon(currentPositon: any) {
      const id = this.$route.params.id
      if (!checkNullObj(currentPositon) && currentPositon.id === id) {
        this.currentData = currentPositon
        if (currentPositon.fromCoinAmount) {
          this.fromCoinAmount = String(currentPositon.fromCoinAmount * Number(this.sliderValue / 100))
        }
        if (currentPositon.toCoinAmount) {
          this.toCoinAmount = String(currentPositon.toCoinAmount * Number(this.sliderValue / 100))
        }
        const poolInfo = currentPositon.poolInfo
        this.poolInfo = poolInfo
      } else {
        this.gotoPosition()
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
    async toRemove() {
      this.sliderChangeFlag = false
      // console.log('这里滑点是多少呢####', this.$accessor.slippage)
      // console.log('考虑滑点前####this.fromCoinAmount####', this.fromCoinAmount)
      // console.log('考虑滑点前####this.toCoinAmount####', this.toCoinAmount)
      // console.log('(1 + 100 / Number(this.$accessor.slippage))#####', 1 + Number(this.$accessor.slippage) / 100)
      let fromCoinAmount: any
      if (this.fromCoinAmount) {
        fromCoinAmount = Number(this.fromCoinAmount) / (1 + Number(this.$accessor.slippage) / 100)
      }
      let toCoinAmount: any
      if (this.toCoinAmount) {
        toCoinAmount = Number(this.toCoinAmount) / (1 + Number(this.$accessor.slippage) / 100)
      }
      this.$emit('remove', fromCoinAmount, toCoinAmount, this.sliderValue)

      this.isLoading = true
      // this.showRemoveLiquidityHint = false

      const conn = this.$web3
      const wallet = (this as any).$wallet

      const poolInfo = cloneDeep(this.poolInfo)
      const currentData = cloneDeep(this.currentData)

      // @ts-ignore
      const fromCoinAccount = get(this.wallet.tokenAccounts, `${poolInfo.coin.mintAddress}.tokenAccountAddress`)
      // @ts-ignore
      const toCoinAccount = get(this.wallet.tokenAccounts, `${poolInfo.pc.mintAddress}.tokenAccountAddress`)

      const nftAccount = get(this.wallet.tokenAccounts, `${currentData.nft_token_id}.tokenAccountAddress`)

      const key = getUnixTs().toString()
      this.$notify.info({
        key,
        message: 'Making transaction...',
        description: '',
        duration: 0,
        icon: this.$createElement('img', { class: { 'notify-icon': true }, attrs: { src: '/tanhao@2x.png' } })
      })

      const swap = await new TokenSwap(
        this.$web3,
        new PublicKey(SWAPV3_PROGRAMID),
        // new PublicKey(LPFARMS[i].swapKey),
        this.poolInfo.tokenSwap,
        null
      ).load()
      // console.log('currentData####123!!!!@@@', currentData)
      const slidTokenAmountObj = calculateSlidTokenAmount(
        currentData.lower_tick,
        currentData.upper_tick,
        // new Decimal(currentData.liquity.toString()),
        this.sliderValue === 100
          ? new Decimal(currentData.liquity.toString())
          : new Decimal(fixD(new Decimal(currentData.liquity.toString()).mul(this.sliderValue / 100).toString(), 0)),
        swap.tokenSwapInfo.currentSqrtPrice,
        new Decimal(Number(this.$accessor.slippage) / 100)
      )

      console.log('slidTokenAmountObj.minAmountA.toString()####', slidTokenAmountObj.minAmountA.toString())
      console.log('slidTokenAmountObj.minAmountB.toString()####', slidTokenAmountObj.minAmountB.toString())

      fromCoinAmount = fixD(slidTokenAmountObj.minAmountA.toString(), 0)
      toCoinAmount = fixD(slidTokenAmountObj.minAmountB.toString(), 0)
      console.log('currentData.liquity.toString()####', currentData.liquity.toString())
      console.log('this.sliderValue#####', this.sliderValue)
      removeLiquidity(
        conn,
        wallet,
        poolInfo,
        currentData.nft_token_id,
        nftAccount,
        fromCoinAccount,
        toCoinAccount,
        poolInfo.coin,
        poolInfo.pc,
        fromCoinAmount,
        toCoinAmount,
        // String(currentData.liquity),
        this.sliderValue === 100
          ? currentData.liquity.toString()
          : fixD(new Decimal(currentData.liquity.toString()).mul(this.sliderValue / 100).toString(), 0)
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

          this.isLoading = false
          const description = `Remove  ${this.fromCoinAmount} ${poolInfo.coin?.symbol} and ${this.toCoinAmount} ${poolInfo.pc?.symbol} from the pool`

          this.$accessor.transaction.sub({ txid, description })

          setTimeout(() => {
            this.$accessor.liquidity.requestInfos()
            if (this.sliderValue === 100) {
              this.gotoPosition()
            }
          }, 2000)
          this.$accessor.transaction.setShowSubmitted(true)
        })
        .catch((error) => {
          console.log('error#####', error)
          this.$notify.error({
            key,
            message: 'Remove liquidity failed',
            description: error.message,
            class: 'error',
            icon: this.$createElement('img', { class: { 'notify-icon': true }, attrs: { src: '/icon_Error@2x.png' } })
          })
        })
        .finally(() => {
          this.isLoading = false
          // this.fromCoinAmount = ''
          // this.toCoinAmount = ''
        })
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
