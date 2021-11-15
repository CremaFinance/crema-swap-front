<template>
  <Modal
    class="add-liquidity-confirm"
    :title="'Claim fees'"
    width="400px"
    :visible="true"
    centered
    :footer="null"
    @cancel="$emit('onClose')"
  >
    <div class="claim-container">
      <div class="liquidity-coins">
        <div class="before-coin">
          <div class="coin-num">
            <img class="img-left" src="../assets/images/icon_coins.png" alt="" />
            {{ tokenaFee }}
          </div>
          <div class="coin-label">{{ currentData.coin.symbol }}</div>
        </div>
        <div class="before-coin after-coin">
          <div class="coin-num">
            <img class="img-right" src="../assets/images/USDT.png" alt="" />
            {{ tokenbFee }}
          </div>
          <div class="coin-label">{{ currentData.pc.symbol }}</div>
        </div>
      </div>
      <Button class="claim-pond" :disabled="isLoading" :loading="isLoading" @click="toClaim">Claim</Button>
    </div>
  </Modal>
</template>
<script lang="ts">
import Vue from 'vue'
import { Modal, Button } from 'ant-design-vue'
import { loadAccount } from '@/tokenSwap/util/account'
import { Account, Connection, PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js'
import { TokenSwap, TokenSwapLayout, Numberu128, TickInfoLayout, Number128, TickInfo } from '@/tokenSwap'
import { SWAPV3_PROGRAMID, SWAP_PAYER, PAYER } from '@/utils/ids'
import { preclaim } from '@/tokenSwap/swapv3'
import { fixD, getUnixTs } from '../utils/index'

export default Vue.extend({
  components: {
    Modal,
    Button
  },
  props: {
    currentData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    tokenaFee: {
      type: String,
      default: ''
    },
    tokenbFee: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      token_a_fee: '',
      token_b_fee: ''
    }
  },
  // watch: {
  //   currentData: {
  //     handler: 'watchCurrentData',
  //     immediate: true
  //   }
  // },
  methods: {
    fixD,
    preclaim,
    // async watchCurrentData(poolData: any) {
    //   if (poolData && poolData.tokenSwapAccount) {
    //     const conn = this.$web3
    //     const data = await loadAccount(conn, new PublicKey(poolData.tokenSwapAccount), SWAPV3_PROGRAMID)
    //     const tokenSwapData = TokenSwapLayout.decode(data)
    //     const fee_growth_global0 = Numberu128.fromBuffer(tokenSwapData.fee_growth_global0).toNumber()
    //     const fee_growth_global1 = Numberu128.fromBuffer(tokenSwapData.fee_growth_global1).toNumber()
    //     const account = { ...tokenSwapData, fee_growth_global0, fee_growth_global1 }
    //     const { token_a_fee, token_b_fee } = claim(poolData, account)
    //     this.token_a_fee = fixD(token_a_fee / Math.pow(10, poolData.coin.decimals), poolData.coin.decimals) || ''
    //     this.token_b_fee = fixD(token_b_fee / Math.pow(10, poolData.pc.decimals), poolData.pc.decimals) || ''
    //   }
    // },
    toClaim() {
      this.$emit('toClaim')
    }
  }
})
</script>
<style lang="less" scoped>
@import '../styles/base.less';

.claim-container {
  .liquidity-coins {
    .before-coin {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .coin-label {
        font-size: 14px;
        color: #fff;
      }
      .coin-num {
        font-size: 16px;
        font-weight: normal;
        color: #fff;
        display: flex;
        align-items: center;
        img {
          width: 20px;
          height: 20px;
          margin-right: 10px;
        }
      }
    }
    .after-coin {
      margin-top: 10px;
    }
  }
  .claim-pond {
    margin-top: 20px;
    background: linear-gradient(214deg, #59bdad 0%, #6676f5 61%, #9a89f9 76%, #eba7ff 100%);
    text-align: center;
    cursor: pointer;
    .gradient-btn-large();
    // min-width: 62px;
    height: 48px;
    line-height: 48px;
    font-size: 14px;
    border-radius: 10px;
    font-family: 'PingFang';
  }
}
</style>
