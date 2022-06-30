<template>
  <div v-if="!loading" class="fair-container">
    <div class="fair-container-center">
      <div class="fair-coin">
        <div class="fair-coin-one"></div>
        <div class="fair-coin-two"></div>
        <div class="fair-coin-three"></div>
        <div class="fair-coin-four"></div>
      </div>
      <FairLeft
        :pool-usdcall="poolUsdcall"
        :pool-account-info="poolAccountInfo"
        :pool-water="poolWater"
        :token-price="tokenPrice"
        @getPoolAcount="getPoolAcount"
      />
    </div>
  </div>
  <div v-else><Spin size="large" /></div>
</template>
<script lang="ts">
import Vue from 'vue'
import { Input, Spin } from 'ant-design-vue'
import {
  programGen,
  getPoolAccount,
  // initializePool,
  exchangeUsdcForRedeemable,
  WithdrawRedeemableTokens
} from '@/contract/fair'
import { mapState } from 'vuex'
import IdoIdl from '@/idl/ido_pool.json'
import * as anchor from '@project-serum/anchor'
import { Connection, PublicKey, Keypair } from '@solana/web3.js'
// import { decimalFormat } from '@/utils'
import { checkNullObj, decimalFormat, fixD } from '@/utils'
import BigNumber from 'bignumber.js'
import { toNumber } from 'lodash'
// const SOLANA_RPC_ENDPOINT = 'https://solana-api.projectserum.com'
import * as serum from '@project-serum/common'
import { getATAAddress } from '@saberhq/token-utils'
import { publicKey } from '@project-serum/borsh'
import { POOL_ACCOUNT, USDC_DECIMAL, MELON_DECIMAL, REDEEM_MINT, POOL_MELON_NUM } from '@/utils/fair'
export default Vue.extend({
  components: {
    Spin
  },
  data() {
    return {
      poolUsdcall: null,
      poolWater: '',
      poolAccountInfo: {},
      tokenPrice: null,
      loading: true,
      poolRedeemToken: null,
      timer: null
    }
  },
  computed: {
    ...mapState(['wallet'])
  },
  mounted() {
    this.getPoolAcount()
    if (this.timer) {
      clearInterval(this.timer)
    } else {
      this.timer = setInterval(() => this.getPoolAcount(), 10000)
    }
    const _this = this
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        _this.getPoolAcount()
      }
    })
  },
  beforeDestroy() {
    clearInterval(this.timer)
    this.timer = null
  },
  methods: {
    // 池子信息
    async getPoolAcount() {
      const wallet = (this as any).$wallet
      const connection = this.$web3
      const program: any = await programGen(wallet, connection, IdoIdl)
      //池子信息
      const poolAccountInfo = await getPoolAccount(program, POOL_ACCOUNT)
      this.poolAccountInfo = poolAccountInfo
      console.log(poolAccountInfo, 'poolAccountInfo##')
      const poolUsdcs = await serum.getTokenAccount(program.provider, poolAccountInfo.poolUsdc)
      const toPoolUsdcs: any = poolUsdcs.amount.toNumber() / Math.pow(10, USDC_DECIMAL)
      // this.poolUsdcall = toPoolUsdcs
      this.poolUsdcall = 151
      console.log(toPoolUsdcs, 'toPoolUsdcs##')

      // const poolWatermelon: any = await serum.getTokenAccount(program.provider, poolAccountInfo.poolWatermelon)
      // const toWatermelon: any = poolWatermelon.amount.toNumber() / Math.pow(10, MELON_DECIMAL)
      this.poolWater = POOL_MELON_NUM
      if (POOL_MELON_NUM > 0) {
        // this.tokenPrice = new BigNumber(toPoolUsdcs).dividedBy(new BigNumber(POOL_MELON_NUM)).toNumber()
        this.tokenPrice = new BigNumber(151).dividedBy(new BigNumber(POOL_MELON_NUM)).toNumber()
      } else {
        this.tokenPrice = null
      }

      console.log(poolUsdcs.amount.toNumber() / Math.pow(10, USDC_DECIMAL), 'pool池子usdc总量')
      console.log(POOL_MELON_NUM, 'pool池子奖励总量')
      console.log(this.tokenPrice, 'this.tokenPrice##')
      this.loading = false
    }
  }
})
</script>
<style lang="less" scoped>
@keyframes icon {
  0% {
    // opacity: 0.8;
    transform: translate(0, 0);
  }
  50% {
    transform: translate(0px, 15px);
  }
  100% {
    transform: translate(0, 0);
  }
}
@keyframes iconK {
  0% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(0px, 23px);
  }
  100% {
    transform: translate(0, 0);
  }
}
@keyframes iconM {
  0% {
    transform: translate(0, 0);
    // transform: translateX(800px) scale(1.5) rotate(360deg);
  }
  50% {
    transform: translate(0px, 30px);
  }
  100% {
    transform: translate(0, 0);
  }
}
.fair-container {
  // overflow: hidden;
  position: relative;
  // height: 900px;
  .fair-container-center {
    width: 1100px;
    height: 700px;
    padding: 0 80px;
    position: absolute;
    left: 50%;
    top: 50vh;
    transform: translate(-50%, -50vh);
    // margin: auto;
    // position: relative;
  }
}
.fair-coin {
  position: relative;
  position: absolute;
  right: -100px;
  top: 0;
  width: 660px;
  height: 600px;
  background: url('@/assets/images/img-bgs-fairs.png') right center;
  background-size: 100% 100%;
  animation: iconK 6s linear infinite;
}
.fair-coin-one {
  width: 74px;
  height: 82px;
  background: url('@/assets/images/img-token-fair.png');
  background-size: 100% 100%;
  position: absolute;
  top: 300px;
  left: 137px;
  animation: icon 2s linear infinite;
}
.fair-coin-two {
  width: 24px;
  height: 89px;
  background: url('@/assets/images/img-arrow-one.png');
  background-size: 100% 100%;
  position: absolute;
  top: 208px;
  left: 280px;
  animation: iconM 2s linear infinite;
}
.fair-coin-three {
  width: 12px;
  height: 128px;
  background: url('@/assets/images/img-arrow-two.png');
  background-size: 100% 100%;
  position: absolute;
  top: 156px;
  left: 436px;
  animation: iconM 3s linear infinite;
}
.fair-coin-four {
  width: 100px;
  height: 106px;
  background: url('@/assets/images/img-token-two-fair.png');
  background-size: 100% 100%;
  position: absolute;
  top: 410px;
  left: 484px;
  animation: icon 3s linear infinite;
}
@media screen and (max-width: 1370px) {
  .fair-container {
    margin-top: -40px;
  }
}
@media screen and (max-width: 750px) {
  .fair-container {
    width: 100%;
    margin-top: 20px;
    padding: 0px 0px 0;
    background: none;
    height: 900px;
    .fair-container-center {
      width: 100%;
      height: 1000px;
      padding: 0;
    }
  }
  .fair-coin {
    // display: none;
    width: 100%;
    height: 316px;
    top: 400px;
    right: 0px;
    background: url('@/assets/images/fair-h5-bg.png');
    background-size: 100% 100%;
    .fair-coin-one,
    .fair-coin-two {
      display: none;
    }
  }
}
.ant-spin-spinning {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
