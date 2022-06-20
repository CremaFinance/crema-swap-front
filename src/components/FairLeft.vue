<template>
  <div class="fair-detail-all">
    <div class="fair-detail-pc">
      <div class="fair-title">
        <img
          v-if="poolStatus == 'isStart' || poolStatus == 'isNotStart' || poolStatus == 'isEndDeposit'"
          src="@/assets/images/fair-title.png"
          alt=""
        />
        <img v-if="poolStatus == 'isEnd'" src="@/assets/images/fair-token-title.png" alt="" />
        <div>
          Learn more
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-icon-right"></use>
          </svg>
        </div>
      </div>
      <template v-if="poolStatus == 'isStart' || poolStatus == 'isNotStart' || poolStatus == 'isEndDeposit'">
        <p>
          {{
            poolStatus == 'isStart'
              ? 'Deposit ends in'
              : poolStatus == 'isNotStart'
              ? 'Deposit starts in'
              : 'Claim starts in'
          }}
        </p>
        <div class="fair-count-down">
          <span>{{ day }}</span> : <span>{{ hour }}</span> : <span>{{ min }}</span> :
          <span>{{ sec }}</span>
        </div>
        <div class="fair-date">
          <span>Day</span>
          <span>Hour</span>
          <span>Min</span>
          <span>Sec</span>
        </div>
      </template>
      <div class="fair-crm" v-if="poolStatus !== 'isEnd'">
        <p>CRM for Sale</p>
        <div v-if="poolWater">{{ thousands(poolWater) }}</div>
        <div v-else><Spin /></div>
      </div>
      <div
        class="fair-crm"
        v-if="(poolStatus == 'isStart' || poolStatus == 'isEndDeposit' || poolStatus == 'isEnd') && poolUsdcall > 0"
        :style="poolStatus == 'isEnd' ? { marginTop: '89px' } : ''"
      >
        <p>Total USDC Depoit</p>
        <div v-if="poolUsdcall || poolUsdcall == 0">{{ thousands(fixD(poolUsdcall, 4)) }}</div>
        <div v-else><Spin /></div>
      </div>
      <div class="fair-crm" v-if="poolStatus == 'isEnd' && tokenPrice > 0">
        <p>USDC per CRM <span>≈</span></p>
        <div v-if="tokenPrice">{{ thousands(fixD(tokenPrice, 6)) }}</div>
        <div v-else><Spin /></div>
      </div>
    </div>
    <div class="fair-hint-pc">
      <div class="hint-dim" v-if="poolStatus == 'isEnd' || poolStatus == 'isStart' || poolStatus == 'isEndDeposit'">
        <template v-if="poolStatus == 'isEnd' && userWatermelonBalance > 0 && wallet.connected">
          <h3 style="width: auto; margin: 0">You have claimed your CRM.</h3>
          <div style="margin-bottom: -3px">
            <img src="@/assets/coins/crm.png" alt="" />
            <div class="text-wrap">{{ thousands(fomatFloat(userWatermelonBalance, 6)) }}</div>
            <!-- <span>CRM</span> -->
          </div>
          <h3 style="margin-bottom: 10px">Thanks for your contribution.</h3>
        </template>
        <template v-if="poolStatus == 'isEnd' && currentToken > 0">
          <p style="width: auto; margin: 0">Claim your CRM</p>
          <div>
            <img src="@/assets/coins/crm.png" alt="" />
            <div class="text-wrap">{{ thousands(fomatFloat(tokenNum, 6)) }}</div>
            <!-- <span>CRM</span> -->
          </div>

          <Button class="action-btn" :disabled="tokenNum == 0" @click="claim"> Claim </Button>
        </template>
        <template v-if="wallet.connected && poolStatus == 'isEnd' && tokenNum == 0 && userWatermelonBalance == 0">
          <img src="@/assets/coins/crm.png" alt="" />
          <h3 style="margin: 10px 0 0 0">You did not contribute to the token sale</h3>
        </template>

        <template v-if="poolStatus == 'isStart' || poolStatus == 'isEndDeposit'">
          <div class="journey-fair">
            <img src="@/assets/images/fair-sjzan.png" alt="" />
            <span>The journey starts here</span>
          </div>
          <p class="fair-title-s">When you're ready, deposit your USDC</p>
          <div class="Half-Max-fair">
            <span class="token-box"
              ><img src="@/assets/images/fair-icon-wallet.png" alt="" />
              <span v-if="usdcLoading"><Spin size="small" /></span>
              {{ currentBidn > 0 ? thousands(currentBidn) : '0.0' }}
              USDC
            </span>
            <div class="quantity-list">
              <div
                v-for="(item, index) in numArr"
                :key="index"
                :class="index == isActive ? 'active' : ''"
                @click="getQuantity(item.value, index)"
              >
                {{ item.label }}
              </div>
            </div>
          </div>
          <div v-if="underwayWith || underway" class="value-fair">
            <img src="@/assets/images/icon_USDC.png" alt="" />
            <input
              type="text"
              v-model="fairvalue"
              autocomplete="off"
              autocorrect="off"
              placeholder="0.00"
              minlength="1"
              oninput="value=this.value.replace(/[^\d-]*(\d*(?:\.\d{0,6})?).*$/g,'$1')"
              maxlength="79"
              spellcheck="false"
              :disabled="disabled || poolStatus == 'isEndDeposit'"
              @input="changeInput($event.target.value)"
              @focus="changeS"
            />
          </div>
          <div class="deposit-tips" v-if="wallet.connected && fairvalue && fairvalue < 10">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-error"></use>
            </svg>
            <span>Minimum deposit 10 USDC</span>
          </div>
          <!-- @click="change('Deposit')" -->
          <Button
            v-if="wallet.connected"
            :disabled="
              !fairvalue ||
              depositLoading ||
              currentBidn <= 0 ||
              fairvalue > currentBidn ||
              poolStatus == 'isEndDeposit' ||
              fairvalue < 10
            "
            class="action-btn"
            :loading="depositLoading"
            @click="deposit"
          >
            {{ fairvalue > currentBidn ? 'Insufficient balance' : 'Set Contribution' }}
          </Button>
        </template>
        <div class="not-wallet-connected" v-if="!wallet.connected">
          <img v-if="poolStatus == 'isEnd'" src="@/assets/images/img-link-Wallet.png" alt="" />
        </div>
        <Button v-if="!wallet.connected" class="action-btn" @click="$accessor.wallet.openModal">Connect Wallet</Button>
      </div>

      <div class="fair-Deposit" v-if="(poolStatus == 'isStart' || poolStatus == 'isEndDeposit') && currentToken > 0">
        <div class="fair-Deposit-left">
          <p>Deposit</p>
          <p>
            <span v-if="currentTokenLoding"><Spin size="small" /></span>
            <template v-else>{{ thousands(currentToken) }} USDC</template>
          </p>
        </div>
        <Button :disabled="currentToken <= 0" class="action-btn with-fair" @click="change('Withdraw')">
          Withdraw
        </Button>
      </div>
    </div>
    <!-- <div class="fair-hint-pc" v-if="!wallet.connected">
      <div class="hint-dim">
        <div class="not-wallet-connected">
          <img src="@/assets/images/img-link-Wallet.png" alt="" />
          <Button class="action-btn" @click="$accessor.wallet.openModal">Connect Wallet</Button>
        </div>
      </div>
    </div> -->
    <!-- <Spin size="small" /> -->
    <FairModal
      v-show="closeIc"
      class="fair-modal"
      :popout="popout"
      :withdraw-val="WithdrawVal"
      :currentToken="currentToken"
      :deposit-val="depositVal"
      @update="updateUserAccount"
      @onClose="() => (closeIc = false)"
      @changeInput="changeInput"
      @handleCancel="handleCancel"
      @submitToken="submitToken"
    />
  </div>
</template>
<script lang="ts">
import { Spin, Button } from 'ant-design-vue'
import Vue from 'vue'
import {
  programGen,
  getPoolAccount,
  // initializePool,
  exchangeUsdcForRedeemable,
  WithdrawRedeemableTokens,
  exchangeRedeemableForWatermelon
} from '@/contract/fair'
import IdoIdl from '@/idl/ido_pool.json'
import * as anchor from '@project-serum/anchor'
import { Connection, PublicKey, Keypair, SignatureResult, Context } from '@solana/web3.js'
import { getATAAddress, getOrCreateATA } from '@saberhq/token-utils'
import { mapState } from 'vuex'
import * as serum from '@project-serum/common'
import { checkNullObj, decimalFormat, fixD } from '@/utils'
import { POOL_ACCOUNT, USDC_MINT, REDEEM_MINT, MELON_MINT, USDC_DECIMAL, MELON_DECIMAL } from '@/utils/fair'
import { get } from 'lodash-es'
import { loadProvider } from '@/contract/pool'
import BigNumber from 'bignumber.js'
// import { Button, Modal, Icon } from 'ant-design-vue'
export default Vue.extend({
  components: {
    Spin,
    Button
  },
  props: {
    poolUsdcall: {
      type: Number,
      default: null
    },
    poolWater: {
      type: Number,
      default: null
    },
    poolAccountInfo: {
      type: Object,
      default: null
    },
    tokenPrice: {
      type: Number,
      default: null
    }
  },

  data() {
    return {
      isActive: -1,
      numArr: [
        {
          label: '1/4',
          value: 4
        },
        {
          label: 'Half',
          value: 2
        },
        {
          label: 'Max',
          value: 1
        }
      ],
      day: '',
      hour: '',
      min: '',
      sec: '',
      currentBidn: 0,
      depositLoading: false,
      currentToken: null,
      usdcLoading: false,
      currentTokenLoding: false,
      closeIc: false, // 弹框控制
      fairvalue: '',
      WithdrawVal: '',
      depositVal: '',
      disabled: false,
      popout: '',
      changefair: true,
      claimLater: false, // claim后
      claimLaterNot: false, // claim后-未参加活动
      theEnd: false, // 已结束
      notBegun: false, // 未开始
      underwayWith: true, //进行中  deposit
      underway: false, //进行中  未deposit
      poolStatus: '',
      tokenNum: 0,
      userWatermelonBalance: 0,
      claimLoading: false
    }
  },
  computed: {
    ...mapState(['wallet'])
  },

  watch: {
    'wallet.connected': {
      handler: 'walletWatch',
      immediate: true
    },
    // 'wallet.tokenAccounts': {
    //   handler: 'walletWatch',
    //   immediate: true
    // },
    poolAccountInfo: {
      handler: 'poolAccountInfoWatch',
      immediate: true
    },
    poolStatus: {
      handler: 'poolStatusWatch',
      immediate: true
    },
    tokenPrice: {
      handler: 'tokenPriceWatch',
      immediate: true
    },
    closeIc() {
      const document: any = window.document
      if (this.closeIc == true) {
        document.querySelector('body').setAttribute('style', ' overflow:hidden !important')
      } else {
        document.querySelector('body').setAttribute('style', ' overflow:auto !important')
      }
    },
    currentToken: {
      handler: 'currentTokenWatch',
      immediate: true
    }
  },
  methods: {
    fixD,
    updateUserAccount() {
      this.getUserAccount()
      this.$emit('getPoolAcount')
    },
    poolAccountInfoWatch(newVal) {
      if (newVal) {
        const { endDepositsTs, startIdoTs, endIdoTs } = newVal
        const date = new Date().getTime()
        if (date > startIdoTs * 1000 && date < endDepositsTs * 1000) {
          this.poolStatus = 'isStart'
        } else if (date > endDepositsTs * 1000 && date < endIdoTs * 1000) {
          this.poolStatus = 'isEndDeposit'
        } else if (date > endIdoTs * 1000) {
          this.poolStatus = 'isEnd'
        } else if (date < startIdoTs * 1000) {
          this.poolStatus = 'isNotStart'
        }
      }
    },
    poolStatusWatch(newVal) {
      const _this = this
      if (newVal) {
        switch (newVal) {
          case 'isStart':
            return _this.countDown(new Date(this.poolAccountInfo.endDepositsTs * 1000))
          case 'isNotStart':
            return _this.countDown(new Date(this.poolAccountInfo.startIdoTs * 1000))
          case 'isEndDeposit':
            return _this.countDown(new Date(this.poolAccountInfo.endIdoTs * 1000))
        }
      }
    },
    walletWatch(newVal) {
      if (newVal) {
        this.currentTokenLoding = true
        this.usdcLoading = true
        this.getUserAccount()
      } else {
        this.currentToken = null
        this.currentBidn = null
      }
    },
    // 充值
    async deposit() {
      this.depositLoading = true
      const wallet = (this as any).$wallet
      const connection = this.$web3
      const program = await programGen(wallet, connection, IdoIdl)
      const depositAmount = new anchor.BN(this.fairvalue * Math.pow(10, USDC_DECIMAL))
      // 用户钱包
      const userUsdc = await getATAAddress({
        mint: USDC_MINT,
        owner: new PublicKey(this.wallet.address)
      })
      const provider: any = loadProvider(wallet)

      let txid = ''
      try {
        const poolAccountInfo = await getPoolAccount(program, POOL_ACCOUNT)
        const _this = this
        this.$accessor.transaction.setTransactionDesc(`Deposit ${this.thousands(this.fairvalue)} USDC`)
        this.$accessor.transaction.setShowWaiting(true)
        txid = await exchangeUsdcForRedeemable(program, poolAccountInfo, depositAmount, userUsdc, REDEEM_MINT, provider)

        const description = `Deposit ${this.thousands(this.fairvalue)} USDC`
        this.$accessor.transaction.setShowSubmitted(true)

        this.$accessor.transaction.sub({
          txid,
          description,
          type: 'Deposit',
          successCallback: () => {
            _this.getUserAccount()
            _this.$emit('getPoolAcount')
            _this.fairvalue = ''
            _this.isActive = -1
            _this.depositLoading = false
            // this.$accessor.transaction.setShowSubmitted(false)
          },
          errorCallback: () => {
            _this.depositLoading = false
            _this.$accessor.transaction.setShowSubmitted(false)
          }
        })
      } catch (error: any) {
        this.$accessor.transaction.setShowWaiting(false)
        this.$accessor.transaction.setShowSubmitted(false)
        this.$notify.close(txid + 'loading')
        this.$notify.error({
          key: 'fair failed',
          message: 'Fair failed',
          description: error.message,
          class: 'error',
          icon: this.$createElement('img', { class: { 'notify-icon': true }, attrs: { src: '/icon_Error@2x.png' } })
        })
        this.depositLoading = false
      }
    },
    tokenPriceWatch(newVal) {
      if (newVal && this.currentToken) {
        this.tokenNum = this.currentToken / this.tokenPrice
      }
    },
    currentTokenWatch(newVal) {
      if (newVal && this.tokenPrice) {
        this.tokenNum = this.currentToken / this.tokenPrice
        console.log(this.fomatFloat(this.tokenNum, 6), 'this.tokenNum ##')
      }
    },
    // 获取用户的信息
    async getUserAccount() {
      this.usdcLoading = true
      this.currentBidn = 0
      this.currentToken = 0
      this.userWatermelonBalance = 0
      const wallet = (this as any).$wallet
      const connection = this.$web3
      const program = await programGen(wallet, connection, IdoIdl)
      try {
        // 用户钱包
        const userWallet = await getATAAddress({
          mint: USDC_MINT,
          owner: new PublicKey(this.wallet.address)
        })
        // 用户钱包USDC的数量
        this.currentBidn = null
        const currentBid = await serum.getTokenAccount(program.provider, userWallet)
        const toCoinAmount = currentBid.amount.toNumber() / Math.pow(10, USDC_DECIMAL)
        this.currentBidn = toCoinAmount
        this.usdcLoading = false
      } catch {
        this.usdcLoading = false
      }
      this.currentTokenLoding = true
      // 用户令牌
      try {
        const userToken = await getATAAddress({
          mint: REDEEM_MINT,
          owner: new PublicKey(this.wallet.address)
        })
        // 获取令牌的数量
        const poolToken = await serum.getTokenAccount(program.provider, userToken)
        const toPoolToken = poolToken.amount.toNumber() / Math.pow(10, USDC_DECIMAL)
        this.currentToken = toPoolToken
        console.log(this.currentToken, 'this.currentToken##')
        // const currentTokenBig = new BigNumber(toPoolToken * Math.pow(10, 18))
        // const tokenPriceBig = new BigNumber(this.tokenPrice * Math.pow(10, 18))
        // this.tokenNum = currentTokenBig && tokenPriceBig ? String(currentTokenBig.dividedBy(tokenPriceBig)) : 0
        // console.log(this.tokenNum, 'tokenNum##439')
        this.currentTokenLoding = false
      } catch {
        this.currentTokenLoding = false
      }
      // 用户西瓜
      try {
        const watermelonAccount = await getATAAddress({
          mint: MELON_MINT,
          owner: new PublicKey(this.wallet.address)
        })
        const userWatermelon = await serum.getTokenAccount(program.provider, watermelonAccount)
        const result = userWatermelon.amount.toNumber() / Math.pow(10, MELON_DECIMAL)
        this.userWatermelonBalance = result
        console.log(this.userWatermelonBalance, 'this.userWatermelonBalance##')
      } catch {}
    },
    getQuantity(val, index) {
      if (this.isActive == index) {
        this.isActive = -1
        this.fairvalue = ''
      } else {
        this.isActive = index
        const Bidn = Number(this.currentBidn)
        const finallyBidn = Bidn / val
        this.fairvalue = fixD(finallyBidn, USDC_DECIMAL)
      }

      // console.log(val, Number(this.currentBidn))
    },
    changeinputs(val) {
      console.log(val)
    },
    changeInput(val) {
      if (this.popout == 'Withdraw') {
        this.WithdrawVal = val
      } else if (this.popout == 'Deposit') {
        this.depositVal = val
        // this.fairvalue = val
        this.isActive = -1
        // console.log(this.depositVal)
      } else {
        // this.fairvalue = val
        this.isActive = -1
        // const reg = /[^\d-]*(\d*(?:\.\d{0,6})?).*$/g
        // console.log(reg.test(val), 'val##')
      }
      // console.log(this.popout, val, this.WithdrawVal, this.depositVal, this.fairvalue)
    },
    changeS() {
      console.log('Focusing on the trigger')
    },
    change(key) {
      this.closeIc = true
      this.popout = key
    },
    // 提现
    submitToken() {
      this.$emit('withdraw', this.WithdrawVal)
      this.closeIc = false
    },
    handleOk(e) {
      this.closeIc = false
    },
    handleCancel(e) {
      this.closeIc = false
      this.popout = ''
      this.fairvalue = ''
      this.WithdrawVal = ''
      this.depositVal = ''
    },
    countDown(time) {
      let nowTime = +new Date()
      let times: any = (time - nowTime) / 1000
      let timer: any = null
      timer = setInterval(() => {
        if (times <= 0) {
          clearInterval(timer)
          window.clearInterval(timer)
          timer = null
          this.$emit('getPoolAcount')
          return
        }
        times--
        let d: string | number = parseInt(String(times / 60 / 60 / 24))
        d = d < 10 ? '0' + d : d
        let h: string | number = parseInt(String((times / 60 / 60) % 24))
        h = h < 10 ? '0' + h : h
        let m: string | number = parseInt(String((times / 60) % 60))
        m = m < 10 ? '0' + m : m
        let s: string | number = parseInt(String(times % 60))
        s = s < 10 ? '0' + s : s
        // return d + '天' + h + '时' + m + '分' + s + '秒';
        this.day = d
        this.hour = h
        this.min = m
        this.sec = s
      }, 1000)
    },
    async claim() {
      const wallet = (this as any).$wallet
      const connection = this.$web3
      const program = await programGen(wallet, connection, IdoIdl)
      const provider: any = loadProvider(wallet)
      console.log(this.currentToken, 'this.poolUsdcall##')
      const firstWithdrawal = new anchor.BN(this.currentToken * Math.pow(10, USDC_DECIMAL))
      let txid = ''
      try {
        const _this = this
        this.$accessor.transaction.setTransactionDesc(`Claim ${this.thousands(this.fomatFloat(this.tokenNum, 6))} CRM`)
        this.$accessor.transaction.setShowWaiting(true)
        txid = await exchangeRedeemableForWatermelon(program, this.poolAccountInfo, firstWithdrawal, provider)
        console.log(txid, 'txid################################')
        const description = `Claim ${this.thousands(this.fomatFloat(this.tokenNum, 6))} CRM`
        this.$accessor.transaction.setShowSubmitted(true)
        this.$accessor.transaction.sub({
          txid,
          description,
          type: 'Claim',
          successCallback: () => {
            _this.getUserAccount()
            _this.$emit('getPoolAcount')
            _this.claimLoading = false
            // this.$accessor.transaction.setShowSubmitted(false)
          },
          errorCallback: () => {
            _this.claimLoading = false
            _this.$accessor.transaction.setShowSubmitted(false)
          }
        })
      } catch (error: any) {
        console.log(error, 'error##')
        this.$accessor.transaction.setShowWaiting(false)
        this.$accessor.transaction.setShowSubmitted(false)
        this.$notify.close(txid + 'loading')
        this.$notify.error({
          key: 'fair failed',
          message: 'Fair failed',
          description: error.message,
          class: 'error',
          icon: this.$createElement('img', { class: { 'notify-icon': true }, attrs: { src: '/icon_Error@2x.png' } })
        })
        this.claimLoading = false
      }
    },
    // 添加计位符
    thousands(num) {
      if (num) {
        const res = String(num).replace(/\d+/, function (n) {
          // 先提取整数部分
          return n.replace(/(\d)(?=(\d{3})+$)/g, function ($1) {
            return $1 + ','
          })
        })
        return res
      }
    },
    fomatFloat(value, decimal) {
      let num = value.toString()
      const index = num.indexOf('.')
      if (index !== -1) {
        num = num.substring(0, decimal + index + 1)
      } else {
        num = num.substring(0)
      }
      return num
    }
  }
})
</script>
<style lang="less" scoped>
@import '../styles/base.less';
.fair-detail-all {
  width: 100%;
  height: 100%;
  // background: #000;
  display: flex;
  justify-content: space-between;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.fair-detail-pc {
  width: 520px;
  position: relative;
  z-index: 100;
  padding: 128px 0 0;
  .fair-title {
    display: flex;
    align-items: center;
    > div {
      display: flex;
      align-items: center;
      color: #b5b8c2;
      margin-left: 12px;
      cursor: pointer;
      &:hover {
        color: #fff;
        svg {
          fill: #fff;
        }
      }
    }
  }
  img {
    width: 400px;
    height: 50px;
  }
  p {
    margin: 10px 0 20px 4px;
    font-size: 18px;
    font-weight: bold;
  }
  .fair-count-down {
    width: 430px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;
    font-size: 32px;
    span {
      width: 80px;
      height: 60px;
      background: rgba(#707070, 0.2);
      border-radius: 8px;
      font-size: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: 'DIN-Regular';
    }
  }
  .fair-date {
    width: 430px;
    margin-top: 10px;
    font-size: 16px;
    display: flex;
    justify-content: space-between;
    span {
      width: 80px;
      text-align: center;
      color: rgba(#fff, 0.5);
    }
  }
  .fair-crm {
    p {
      font-size: 18px;
      margin-bottom: 2px;
      span {
        font-size: 16px;
        color: rgba(#fff, 0.5);
      }
    }
    > div {
      font-size: 50px;
      font-weight: bold;
      background: linear-gradient(48deg, #d032ff 0%, #8ab6ff 40%, #4ce1ff 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-family: 'DIN-Regular';
      word-wrap: break-word;
      word-break: break-all;
    }
  }
  .fair-cany {
    p {
      margin-top: 6px;
    }
  }
}
.fair-hint-pc {
  width: 400px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  align-content: center;
  padding-top: 0px;
  .hint-dim {
    width: 400px;
    // height: 190px;
    min-height: 190px;
    padding: 20px 20px;
    border-radius: 20px;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(50px);
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-content: center;
    > div {
      width: 100%;
      // display: flex;
      // align-items: center;
      // justify-content: center;
      text-align: center;
      margin-bottom: 16px;
      font-size: 36px;
      word-wrap: break-word;
      word-break: break-all;
      .text-wrap {
        word-wrap: break-word;
        word-break: break-all;
      }
      // white-space: wrap !important;
    }
    p {
      width: 100%;
      margin: 0 0 20px 4px;
      text-align: left;
    }
    .fair-title-s {
      color: rgba(#fff, 0.5);
    }
    .not-wallet-connected {
      img {
        width: 120px;
        height: 120px;
      }
    }
  }

  .hint-tkanc {
    background: none !important;
    padding: 15px 0 0 0 !important;
    .btncf-fa {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
    .action-btn {
      width: 186px !important;
      margin: 0;
    }
  }
  .fair-Deposit {
    width: 400px;
    height: 96px;
    border-radius: 20px;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(30px);
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    .with-fair {
      width: 120px;
      margin: 0;
    }
    .fair-Deposit-left {
      display: flex;
      flex-wrap: wrap;
      align-content: space-between;
      p {
        width: 100%;
        text-align: left;
      }
      > p:nth-child(2) {
        font-size: 18px;
      }
    }
  }
  img {
    width: 36px;
    height: 36px;
  }
  p {
    font-size: 14px;
    text-align: center;
    margin: 0;
  }
  span {
    font-size: 36px;
    margin-left: 8px;
  }
  h3 {
    font-weight: bold;
    font-size: 18px;
    background: linear-gradient(48deg, #d032ff 0%, #8ab6ff 53%, #4ce1ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .action-btn {
    .gradient-btn-large();
    margin: 0 auto;
    width: 360px;
    line-height: 1;
    border: 0 solid rgba(232, 228, 255, 0.5) !important;
    height: 48px;
    font-size: 16px;
    font-weight: 100;
  }
  .disconnect-btn {
    width: 186px;
    height: 48px;
    box-shadow: 0px 4px 12px 0px #25282c;
    border-radius: 12px;
    font-size: 16px;
    border: 1px solid #3f434e;
    font-weight: 600;
    background: transparent;
    &:hover {
      background: rgba(255, 255, 255, 0.05);
    }
  }
}
.fair-modal {
  position: absolute;
}
svg {
  width: 20px;
  height: 20px;
  fill: #b5b8c2;
  margin-left: 4px;
}
.journey-fair {
  justify-content: flex-start !important;
  margin-bottom: 0 !important;
  text-align: left !important;
  font-size: 18px !important;
  span {
    font-size: 18px;
    font-weight: bold;
  }
  img {
    width: 46px;
    height: 36px;
  }
}
.Half-Max-fair {
  display: flex;
  justify-content: space-between !important;
  margin-top: 20px;
  align-items: center;
  span {
    font-size: 14px;
    margin: 0 !important;
  }
  .token-box {
    white-space: nowrap;
  }
  img {
    width: 20px !important;
    height: 20px !important;
    // margin-right: 5px;
  }

  .quantity-list {
    display: flex;
    justify-content: space-between;
    > div {
      width: 48px;
      height: 24px;
      border: #909090 1px solid;
      border-radius: 4px;
      text-align: center;
      cursor: pointer;
      line-height: 24px;
      font-size: 12px;
      & + div {
        margin-left: 8px;
      }
      &:hover {
        border: #fff 1px solid;
        color: #fff !important;
        background: rgba(#fff, 0.2);
      }
    }
  }
  .active {
    border: #07ebad 1px solid;
    background: rgba(#07ebad, 0.2);
    color: #07ebad;
    &:hover {
      color: #07ffbd !important;
      background: rgba(#07ffbd, 0.4);
      border: #07ffbd 1px solid;
    }
  }
}
.value-fair {
  width: 360px;
  height: 60px;
  background: rgba(#000, 0.2);
  border-radius: 10px;
  justify-content: space-between !important;
  padding: 0 12px;
  img {
    width: 32px;
    height: 32px;
  }
  margin-bottom: 22px !important;
}
.deposit-tips {
  display: flex;
  align-items: center;
  .icon {
    width: 14px;
    height: 14px;
    fill: #fb0;
  }
  span {
    font-size: 12px !important;
  }
  color: #fb0;
}
.ant-modal {
  background: #000 !important;
}
input {
  min-height: 32px !important;
  width: 80%;
  font-family: 'DIN-Regular' !important;
  font-size: 32px;
  color: #fff;
  border: none;
  background: none;
  padding-left: 10px;
  text-align: right;
}
@media screen and (max-width: 750px) {
  .fair-detail-all {
    flex-wrap: wrap;
  }
  .fair-detail-pc {
    width: 100%;
    padding: 20px 0 0 0;
    margin-bottom: 20px;
    .fair-title {
      justify-content: center;
      flex-wrap: wrap;
      img {
        width: 309px;
        height: 36px;
      }
    }
    .fair-date {
      width: 100%;
    }
    .fair-crm {
      text-align: center;
    }
    p {
      margin: 28px 0 20px 0;
      text-align: center;
    }
    .fair-count-down {
      width: 100%;
      span {
        width: 64px;
        height: 48px;
        background: rgba(#707070, 0.2);
        border-radius: 8px;
        font-size: 32px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
  .fair-hint-pc {
    width: 100%;
    height: 440px;
    display: block;
    .hint-dim {
      width: 100%;
      > div {
        word-wrap: unset;
        word-break: unset;
      }
    }
    .fair-Deposit {
      width: 100%;
    }
  }
  .fair-hint-detail {
    height: auto;
    .hint-tkanc {
      .action-btn {
        width: 45% !important;
        margin: 0;
      }
      .disconnect-btn {
        width: 45% !important;
      }
    }
  }
  .Half-Max-fair {
    flex-wrap: wrap;
    .quantity-list {
      width: 100%;
      margin-top: 10px;
      > div {
        width: 101px;
      }
    }
    // > div {
    //   width: 80px;
    //   height: 24px;
    //   border: #909090 1px solid;
    //   border-radius: 4px;
    //   text-align: center;
    //   margin-top: 10px !important;
    // }
    > span {
      display: block !important;
      width: 90% !important;
    }
    // img {
    //   margin-right: 0px !important;
    // }
  }
}
</style>
