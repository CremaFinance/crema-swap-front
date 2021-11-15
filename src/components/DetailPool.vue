<template>
  <div class="pond-block">
    <div class="pond-title">
      <p>
        {{ title }}
      </p>
      <!-- <div v-if="title !== 'Liquidity'" class="claim-pond" @click="toClaim">Claim</div> -->
      <Button
        v-if="title !== 'Liquidity'"
        class="claim-pond"
        :disabled="isLoading || !wallet.connected || (Number(token_a_fee) <= 0 && Number(token_b_fee) <= 0)"
        :loading="isLoading"
        @click="toClaim"
        >Claim</Button
      >
    </div>
    <div class="pond-currency">$ {{ currentData && currentData.coin && getConvertedPrice() }}</div>
    <div :class="['pond-means', direction ? '' : 'reverse']">
      <div class="pond-means-block">
        <div class="left">
          <img
            v-if="currentData.coin"
            :src="importIcon(`/coins/${currentData.coin.symbol.toLowerCase()}.png`)"
            alt=""
          />
          <span v-if="currentData.coin">{{ currentData.coin.symbol }}</span>
          <a
            v-if="currentData && currentData.coin"
            :href="`${url.explorer}/token/${currentData.coin.mintAddress}`"
            target="_blank"
          >
            <svg v-if="title === 'Liquidity'" class="icon" aria-hidden="true">
              <use xlink:href="#icon-icon-Jump"></use>
            </svg>
          </a>
        </div>
        <div class="right">
          <p v-if="title === 'Liquidity'">{{ currentData.fromCoinAmount }}</p>
          <p v-else>{{ token_a_fee }}</p>
          <span v-if="title === 'Liquidity'">{{ getPercent('from') }}</span>
        </div>
      </div>
      <div class="pond-means-block">
        <div class="left">
          <img v-if="currentData.pc" :src="importIcon(`/coins/${currentData.pc.symbol.toLowerCase()}.png`)" />
          <span v-if="currentData.pc">{{ currentData.pc.symbol }}</span>
        </div>
        <div class="right">
          <p v-if="title === 'Liquidity'">{{ currentData.toCoinAmount }}</p>
          <p v-else>{{ token_b_fee }}</p>
          <span v-if="title === 'Liquidity'">{{ getPercent('to') }}</span>
        </div>
      </div>
    </div>
    <Setting v-if="showSetting" :default-value="slippage" @onClose="() => (showSetting = false)"></Setting>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import importIcon from '@/utils/import-icon'
import { RATES } from '@/utils/tokens'
import { mapState } from 'vuex'
import { preclaim, TickWord } from '@/tokenSwap/swapv3'
import { loadAccount } from '@/tokenSwap/util/account'
import { Account, Connection, PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js'
import { SWAPV3_PROGRAMID, SWAP_PAYER, PAYER } from '@/utils/ids'
import { TokenSwap, TokenSwapLayout, Numberu128, TickInfoLayout, Number128, TickInfo } from '@/tokenSwap'
import { fixD, getUnixTs } from '../utils/index'
import { Button } from 'ant-design-vue'
import BigNumber from 'bignumber.js'

Vue.use(Button)
export default Vue.extend({
  components: {
    Button
  },
  model: {
    prop: 'value',
    event: 'onInput'
  },
  props: {
    currentData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    title: {
      type: String,
      default: ''
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    direction: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      token_a_fee: '',
      token_b_fee: '',
      showSetting: false,
      currentPrice: 0
    }
  },
  computed: {
    ...mapState(['wallet', 'url'])
  },
  watch: {
    currentData: {
      handler: 'watchCurrentData',
      immediate: true
    }
  },
  methods: {
    importIcon,
    async watchCurrentData(poolData: any) {
      if (poolData && poolData.tokenSwapAccount) {
        const conn = this.$web3
        const data = await loadAccount(conn, new PublicKey(poolData.tokenSwapAccount), SWAPV3_PROGRAMID)
        const tokenSwapData = TokenSwapLayout.decode(data)
        // console.log('tokenSwapData#####', tokenSwapData)
        const fee_growth_global0 = Numberu128.fromBuffer(tokenSwapData.fee_growth_global0)
        const fee_growth_global1 = Numberu128.fromBuffer(tokenSwapData.fee_growth_global1)
        const account = { ...tokenSwapData, fee_growth_global0, fee_growth_global1 }

        const current_price = Numberu128.fromBuffer(tokenSwapData.current_price).toNumber()
        account.current_price = current_price
        // console.log('current_price#####', current_price)
        this.currentPrice = Math.pow(current_price / Math.pow(10, 12), 2)
        const tick_detail_key = new PublicKey(tokenSwapData.tick_detail_key) // tick_info
        const tick_append_index = tokenSwapData.tick_append_index
        const tickInfos = await TickInfo.loadTickInfo(conn, tick_detail_key, SWAPV3_PROGRAMID, tick_append_index)
        let tick_word = new TickWord(tickInfos, tick_append_index)
        const { token_a_fee, token_b_fee } = preclaim(tick_word, poolData, account)

        console.log('watchCurrentData####token_a_fee####', token_a_fee.toString())
        console.log('watchCurrentData####token_b_fee####', token_b_fee.toString())
        // const a = token_a_fee.div(new Numberu128(Math.pow(10, poolData.coin.decimals)))
        // const b = token_b_fee.div(new Numberu128(Math.pow(10, poolData.pc.decimals)))
        const a = token_a_fee.toNumber() / Math.pow(10, poolData.coin.decimals)
        const b = token_b_fee.toNumber() / Math.pow(10, poolData.pc.decimals)

        const tokenaFee = fixD(a, poolData.coin.decimals) || ''
        const tokenbFee = fixD(b, poolData.pc.decimals) || ''
        this.token_a_fee = tokenaFee
        this.token_b_fee = tokenbFee
        this.$emit('onChange', tokenaFee, tokenbFee)
      }
    },
    toClaim() {
      this.$emit('claim')
    },
    getPercent(direct: any) {
      const fromCoinAmount = Number(this.currentData.fromCoinAmount)
      const toCoinAmount = Number(this.currentData.toCoinAmount)
      if (fromCoinAmount && toCoinAmount) {
        return '50%'
      }
      if (direct === 'from') {
        return fromCoinAmount ? '100%' : '0%'
      } else {
        return toCoinAmount ? '100%' : '0%'
      }
    },
    // 换算为美元的价格
    getConvertedPrice() {
      console.log('detailPool###this.currentPrice######', this.currentPrice)
      if (this.title === 'Liquidity') {
        console.log('getConvertedPrice11111111')
        // console.log('换算之前的this.currentPrice######', this.currentPrice)
        const fromCoinAmount = new BigNumber(this.currentData.fromCoinAmount)
        const toCoinAmount = new BigNumber(this.currentData.toCoinAmount)

        const fromNum = fromCoinAmount.multipliedBy(this.currentPrice)
        const toNum = toCoinAmount.plus(fromNum)
        const result = toNum.multipliedBy(RATES[this.currentData.pc.symbol])

        // const fromCoinRates = fromCoinAmount.multipliedBy(RATES[this.currentData.coin.symbol])
        // const toCoinRates = toCoinAmount.multipliedBy(RATES[this.currentData.pc.symbol])
        // return fromCoinRates.plus(toCoinRates).toFixed()
        return result.toFixed()
      } else {
        console.log('getConvertedPrice111111')
        console.log('getConvertedPrice###token_a_fee#####', this.token_a_fee)
        console.log('getConvertedPrice###token_b_fee#####', this.token_b_fee)
        const token_a_fee = new BigNumber(this.token_a_fee)
        const token_b_fee = new BigNumber(this.token_b_fee)

        // const tokenfeeA = token_a_fee.multipliedBy(RATES[this.currentData.coin.symbol])
        const tokenfeeA = token_a_fee.multipliedBy(this.currentPrice)
        // const tokenfeeB = token_b_fee.multipliedBy(RATES[this.currentData.pc.symbol])
        const tokenfeeB = token_b_fee.plus(tokenfeeA)
        const result = tokenfeeB.multipliedBy(RATES[this.currentData.pc.symbol])
        // return tokenfeeA.plus(tokenfeeB).toFixed()
        return result.toFixed()
      }
    }
  }
})
</script>
<style lang="less" scoped>
@import '../styles/base.less';

.pond-block {
  width: 50%;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 30px;
  padding: 20px 10px 18px;
  display: flex;
  flex-wrap: wrap;
  align-content: space-between;
  & + .pond-block {
    margin-left: 10px;
  }
  .pond-title {
    padding-left: 10px;
    width: 100%;
    height: 32px;
    display: flex;
    justify-content: space-between;
    p {
      font-size: 16px;
      font-family: 'Arial Bold';
      line-height: 16px;
      margin-bottom: 0;
    }
    .claim-pond {
      background: linear-gradient(214deg, #59bdad 0%, #6676f5 61%, #9a89f9 76%, #eba7ff 100%);
      text-align: center;
      cursor: pointer;
      .gradient-btn-large();
      display: inline-block;
      width: auto;
      max-height: 32px;
      font-size: 14px;
      border-radius: 4px;
      font-family: 'PingFang';
    }
  }
  .pond-currency {
    max-width: 100%;
    padding-left: 10px;
    font-size: 30px;
    line-height: 1;
    font-family: 'Arial';
    margin-bottom: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .pond-means {
    width: 100%;
    background: rgba(#fff, 0.04);
    border-radius: 10px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    &.reverse {
      flex-direction: column-reverse;
      .pond-means-block {
        &:last-child {
          margin-top: 0px;
        }
        &:first-child {
          margin-top: 10px;
        }
      }
    }
    // align-content: space-between;
    p {
      font-family: 'Arial Bold';
    }
    span {
      font-family: 'Arial Bold';
    }
    .pond-means-block {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      &:last-child {
        margin-top: 10px;
      }
      &:first-child {
        margin-top: 0px;
      }
      > .left {
        display: flex;
        align-items: center;
        justify-content: space-between;
        img {
          width: 30px;
          height: 30px;
        }
        span {
          font-size: 16px;
          margin-left: 10px;
        }
        .icon {
          width: 20px;
          height: 20px;
          cursor: pointer;
        }
        a {
          line-height: 1;
          padding-top: 3px;
        }
      }
      > .right {
        display: flex;
        align-items: center;
        p {
          margin-bottom: 0px;
        }
        > span {
          margin-left: 8px;
          width: 60px;
          height: 28px;
          line-height: 28px;
          text-align: center;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          font-size: 14px;
        }
      }
      // .pond-means-crm-leftA {
      //   display: flex;
      //   align-items: center;
      //   justify-content: space-between;
      //   img {
      //     width: 30px;
      //     height: 30px;
      //   }
      //   span {
      //     font-size: 16px;
      //     margin-left: 10px;
      //   }
      //   .icon {
      //     width: 20px;
      //     height: 20px;
      //   }
      // }
      // .pond-means-crm-right {
      //   display: flex;
      //   justify-content: flex-end;
      //   align-items: center;
      //   p {
      //     margin-bottom: 0;
      //     font-size: 14px;
      //     font-weight: bold;
      //     text-align: right;
      //     overflow: hidden;
      //     text-overflow: ellipsis;
      //     white-space: nowrap;
      //   }
      //   span {
      //     margin-left: 8px;
      //     padding: 7px 15px;
      //     text-align: center;
      //     line-height: 1;
      //     background: rgba(#fff, 0.1);
      //     border-radius: 8px;
      //     font-family: Arial-BoldMT, Arial;
      //     font-weight: normal;
      //     font-size: 14px;
      //   }
      // }
    }
    // .pond-means-usdt {
    //   width: 100%;
    //   display: flex;
    //   margin-top: 11px;
    //   justify-content: space-between;
    //   .pond-means-usdt-left {
    //     display: flex;
    //     align-items: center;
    //     justify-content: space-between;
    //     img {
    //       width: 30px;
    //       height: 30px;
    //     }
    //     span {
    //       margin-left: 10px;
    //       font-size: 16px;
    //     }
    //   }
    //   .pond-means-usdt-right {
    //     display: flex;
    //     justify-content: flex-end;
    //     align-items: center;
    //     p {
    //       margin-bottom: 0;
    //       font-size: 14px;
    //       font-weight: bold;
    //       text-align: right;
    //       overflow: hidden;
    //       text-overflow: ellipsis;
    //       white-space: nowrap;
    //     }
    //     span {
    //       margin-left: 8px;
    //       padding: 7px 15px;
    //       text-align: center;
    //       line-height: 1;
    //       background: rgba(#fff, 0.1);
    //       border-radius: 8px;
    //       font-family: Arial-BoldMT, Arial;
    //       font-weight: normal;
    //       font-size: 14px;
    //     }
    //   }
    // }
  }
}

@media screen and (max-width: 750px) {
  .pond-block {
    display: block;
    width: 100%;
  }
  .coin-block {
    .input-block {
      input {
        width: 100px;
      }
    }
  }
}
</style>
