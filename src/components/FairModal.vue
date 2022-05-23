<template>
  <Modal :width="440" :visible="true" :footer="null" centered @cancel="delval">
    <template slot="closeIcon">
      <svg class="icon modal-icon-close" aria-hidden="true">
        <use xlink:href="#icon-icon-close"></use>
      </svg>
    </template>

    <div class="fair-hint-pc fair-hint-detail">
      <div class="hint-dim hint-tkanc">
        <div class="journey-fair">
          <!-- <img src="@/assets/images/fair-sjzan.png" alt="" /> -->
          {{ popout }}
        </div>
        <p v-if="popout == 'Deposit'">When you're ready, deposit your USDC</p>
        <div class="Half-Max-fair">
          <span>
            <img v-if="popout == 'Deposit'" src="@/assets/images/fair-icon-wallet.png" alt="" />
            <img v-else src="@/assets/images/fair-icon-withdraw.png" alt="" />
            {{ thousands(currentToken) }} USDC
          </span>
          <!-- <div @click="getQuantity(4)">1/4</div>
            <div @click="getQuantity(2)">Half</div>
            <div @click="getQuantity(1)">Max</div> -->
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
        <div class="value-fair">
          <img src="@/assets/images/icon_USDC.png" alt="" />
          <!-- <span>998.55</span> -->
          <input
            v-model="fairvalue"
            type="text"
            autocomplete="off"
            autocorrect="off"
            placeholder="0.00"
            oninput="value=this.value.replace(/[^\d-]*(\d*(?:\.\d{0,6})?).*$/g,'$1')"
            minlength="1"
            maxlength="79"
            spellcheck="false"
            :disabled="disabled"
            @input="changeInput($event.target.value, popout)"
          />
          <!-- @focus="changeS" -->
        </div>
        <div class="btncf-fa">
          <Button class="disconnect-btn" @click="delval"> Cancel </Button>
          <Button
            class="action-btn"
            :disabled="!fairvalue || withdrawLoading || fairvalue > currentToken"
            :loading="withdrawLoading"
            @click="toWithdraw"
          >
            {{ popout }}
          </Button>
        </div>
      </div>
    </div>
  </Modal>
</template>
<script lang="ts">
import Vue from 'vue'
import { Button, Modal, Icon } from 'ant-design-vue'
import {
  programGen,
  getPoolAccount,
  // initializePool,
  exchangeUsdcForRedeemable,
  WithdrawRedeemableTokens
} from '@/contract/fair'
import * as anchor from '@project-serum/anchor'
import IdoIdl from '@/idl/ido_pool.json'
import { fixD } from '@/utils'
import { Connection, PublicKey, Keypair, SignatureResult, Context } from '@solana/web3.js'
import { getATAAddress } from '@saberhq/token-utils'
import { mapState } from 'vuex'
import { POOL_ACCOUNT, USDC_MINT, REDEEM_MINT, USDC_DECIMAL, MELON_DECIMAL } from '@/utils/fair'

Vue.use(Modal)

export default Vue.extend({
  components: {
    Modal
  },
  props: {
    popout: {
      type: String,
      default: ''
    },
    depositVal: {
      type: String,
      default: ''
    },
    currentToken: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      disabled: false,
      isActive: -1,
      withdrawLoading: false,
      fairvalue: '',
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
      ]
    }
  },
  computed: {
    ...mapState(['wallet'])
  },
  mounted() {},
  methods: {
    changeInput(val) {
      this.$emit('changeInput', val)
      this.fairvalue = val
      this.isActive = -1
    },
    delval() {
      this.isActive = -1
      this.fairvalue = ''
      this.$emit('handleCancel')
    },
    submit() {
      this.$emit('submitToken')
    },
    getQuantity(val, index) {
      if (this.isActive == index) {
        this.isActive = -1
        this.fairvalue = ''
      } else {
        this.isActive = index
        const Bidn = Number(this.currentToken)
        const finallyBidn = Bidn / val
        this.fairvalue = fixD(finallyBidn, USDC_DECIMAL)
      }
      // console.log(val, Number(this.currentBidn))
    },
    toWithdraw() {
      this.withdraw()
      this.$emit('onClose')
    },
    // 提现
    async withdraw() {
      this.withdrawLoading = true
      const wallet = (this as any).$wallet
      const connection = this.$web3
      const program = await programGen(wallet, connection, IdoIdl)
      const withdrawAmount = new anchor.BN(this.fairvalue * Math.pow(10, USDC_DECIMAL))
      // 用户钱包
      const userUsdc = await getATAAddress({
        mint: USDC_MINT,
        owner: new PublicKey(this.wallet.address)
      })
      const userRedeemable = await getATAAddress({
        mint: REDEEM_MINT,
        owner: new PublicKey(this.wallet.address)
      })
      const _this = this
      this.$accessor.transaction.setTransactionDesc(`Withdraw ${this.thousands(this.fairvalue)} USDC`)
      this.$accessor.transaction.setShowWaiting(true)
      let txid = ''
      // console.log(poolAccountInfo, 'poolAccountInfo##')
      try {
        const poolAccountInfo = await getPoolAccount(program, POOL_ACCOUNT)
        txid = await WithdrawRedeemableTokens(program, poolAccountInfo, withdrawAmount, userUsdc, userRedeemable)

        const description = `Withdraw ${this.thousands(this.fairvalue)} USDC`
        this.$accessor.transaction.setShowSubmitted(true)
        this.$accessor.transaction.sub({
          txid,
          description,
          type: 'Withdraw',
          successCallback: () => {
            _this.fairvalue = ''
            _this.isActive = -1
            _this.withdrawLoading = false
            this.$emit('update', true)
          },
          errorCallback: () => {
            _this.withdrawLoading = false
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
        this.withdrawLoading = false
      }
    },
    // 添加计位符
    thousands(num) {
      const res = String(num).replace(/\d+/, function (n) {
        // 先提取整数部分
        return n.replace(/(\d)(?=(\d{3})+$)/g, function ($1) {
          return $1 + ','
        })
      })
      return res
    }
  }
})
</script>
<style lang="less" scoped>
@import '../styles/base.less';
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
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
    }
    p {
      width: 100%;
      margin: 0 0 20px 4px;
      text-align: left;
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
    font-size: 20px;
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
svg {
  width: 20px;
  height: 20px;
  fill: #b5b8c2;
  margin-left: 4px;
}
.journey-fair {
  justify-content: flex-start !important;
  margin-bottom: 0 !important;
  font-size: 18px;
  font-weight: bold;
  img {
    width: 46px;
    height: 36px;
  }
}
.Half-Max-fair {
  justify-content: space-between !important;
  margin-top: 20px;
  span {
    font-size: 14px;
    margin: 0 !important;
  }
  img {
    width: 20px !important;
    height: 20px !important;
    margin-right: 6px;
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
      & + div {
        margin-left: 8px;
      }
      &:hover {
        border: #fff 1px solid;
        color: #fff !important;
        background: rgba(#fff, 0.2);
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
  // > div {
  //   width: 48px;
  //   height: 24px;
  //   border: #909090 1px solid;
  //   border-radius: 4px;
  //   text-align: center;
  //   cursor: pointer;
  //   &:hover {
  //     border: #fff 1px solid;
  //     color: #fff !important;
  //     background: rgba(#fff, 0.2);
  //   }
  // }
  // > div:nth-child(4) {
  //   border: #07ebad 1px solid;
  //   background: rgba(#07ebad, 0.2);
  //   color: #07ebad;
  //   &:hover {
  //     color: #07ffbd !important;
  //     background: rgba(#07ffbd, 0.4);
  //     border: #07ffbd 1px solid;
  //   }
  // }
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
  margin-bottom: 32px !important;
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
  .fair-hint-pc {
    width: 100%;
    height: 440px;
    .hint-dim {
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
    // > div {
    //   width: 80px;
    //   height: 24px;
    //   border: #909090 1px solid;
    //   border-radius: 4px;
    //   text-align: center;
    //   margin-top: 10px !important;
    // }
    .quantity-list {
      width: 100%;
      margin-top: 10px;
      > div {
        width: 101px;
      }
    }
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
