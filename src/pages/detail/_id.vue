<template>
  <div class="pool-container-box">
    <div class="pool-container-rollback">
      <svg class="icon" aria-hidden="true" @click="gotoMyPosition">
        <use xlink:href="#icon-icon-return"></use>
      </svg>
      Back to Pools Overview
    </div>
    <div class="pool-container-filePacket">
      <HeaderDetails headers-value="yes" :current-data="currentData" :current-status="currentStatus" />
      <div class="filePacket-right">
        <a class="title-active exact-active" :disabled="!wallet.connected" @click="openAddLiquiditySecondConfirm"
          >Increase Liquidity</a
        >
        <a
          v-if="currentStatus !== 'Closed'"
          class="title-active"
          :disabled="!wallet.connected"
          @click="openRemoveLiquidityHint"
          >Remove Liquidity</a
        >
      </div>
    </div>
    <div class="pool-container-argument">
      <DetailPool title="Liquidity" :current-data="currentData" :direction="direction" />
      <DetailPool
        title="Unclaimed fees"
        :current-data="currentData"
        :direction="direction"
        @onChange="tokenfeeChanged"
        @claim="showClaimHint = true"
      />
    </div>
    <div class="pool-container-rateExchange">
      <div class="price-range">
        <div class="price-range-left">
          <span>Price range</span>
          <StatusBlock :current-status="currentStatus" />
        </div>
        <div v-if="currentData.coin && currentData.pc" class="price-range-right">
          <span v-if="direction"
            >1 {{ currentData.coin.symbol }} ≈ {{ fixD(currentData.currentPrice, currentData.pc.decimals) }}
            {{ currentData.pc.symbol }}</span
          >
          <span v-else
            >1 {{ currentData.pc.symbol }} ≈ {{ fixD(1 / currentData.currentPrice, currentData.coin.decimals) }}
            {{ currentData.coin.symbol }}</span
          >
          <div class="range-icon">
            <div :class="direction ? 'active' : ''" @click="direction = true">{{ currentData.coin.symbol }}</div>
            <div :class="!direction ? 'active' : ''" @click="direction = false">
              {{ currentData.pc.symbol }}
            </div>
          </div>
        </div>
      </div>
      <div class="information-pool">
        <PriceRange type="min" :current-data="currentData" :direction="direction" />
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-icon-link"></use>
        </svg>
        <PriceRange type="max" :current-data="currentData" :direction="direction" />
      </div>
    </div>

    <AddLiquidityConfirm
      v-if="showAddLiquiditySecondConfirm"
      :second-confirm-data="secondConfirmData"
      title="Increase Liquidity"
      @supply="supply"
      @onClose="closeAddLiquiditySecondConfirm"
    ></AddLiquidityConfirm>

    <RemoveLiquidity
      v-if="showRemoveLiquidityHint"
      :is-loading="isLoading"
      :current-data="currentData"
      @onClose="() => (showRemoveLiquidityHint = false)"
      @remove="toRemoveLiquidity"
    ></RemoveLiquidity>
    <Claim
      v-if="showClaimHint"
      :current-data="currentData"
      :tokena-fee="tokenaFee"
      :tokenb-fee="tokenbFee"
      :is-loading="isLoading"
      @onClose="() => (showClaimHint = false)"
      @toClaim="toClaim"
    ></Claim>
  </div>
</template>
<script lang="ts">
import { Vue } from 'nuxt-property-decorator'
import { mapState } from 'vuex'
import { preview_calculate_liqudity } from '@/tokenSwap/swapv3'
import { fixD, getUnixTs } from '@/utils'
import { Account, Connection, PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js'
import { cloneDeep, get } from 'lodash-es'
import { addLiquidity, claim, removeLiquidity } from '@/utils/liquidity'
import { Numberu128 } from '@/tokenSwap'

export default Vue.extend({
  components: {
    // WaitingHint,
    // SuccessHint
    // // Tooltip
    // // AddLiquidity
  },
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
      currentStatus: 'Active',
      tokenaFee: '',
      tokenbFee: ''
    }
  },
  computed: {
    // ...mapState(['wallet', 'farm', 'url', 'price', 'liquidity'])
    ...mapState({
      price: (state: any) => state.price,
      wallet: (state: any) => state.wallet,
      position: (state: any) => state.position,
      url: (state: any) => state.url
    })
  },
  watch: {
    'position.myPositions': {
      handler: 'watchMyPosions',
      immediate: true
    },
    currentData: {
      handler: 'watchCurrentData',
      immediate: true
    }
  },
  mounted() {},
  methods: {
    fixD,
    tokenfeeChanged(token_a_fee: string, token_b_fee: string) {
      this.tokenaFee = token_a_fee
      this.tokenbFee = token_b_fee
    },
    watchCurrentData(newData: any) {
      const currentPrice = Number(newData.currentStatus)
      const minPrice = Number(newData.minPrice)
      const maxPrice = Number(newData.maxPrice)
      // // 区间中包含当前价格, 一种资产返回另外一种资产，并且返回liquity
      if (!newData.liquity) {
        this.currentStatus = 'Closed'
      } else if (currentPrice >= minPrice && currentPrice <= maxPrice) {
        this.currentStatus = 'Active'
      } else if (currentPrice > maxPrice) {
        // 区间在当前价格的左侧时，也就是只有token b这一种资产, 返回liquity
        this.currentStatus = 'InActive'
      } else if (currentPrice < minPrice) {
        // 区间在当前价格的右侧时，也就是只有token a这一种资产, 返回liquity
        this.currentStatus = 'InActive'
      }
    },
    gotoMyPosition() {
      this.$router.push('/position')
    },
    openRemoveLiquidityHint() {
      this.showRemoveLiquidityHint = true
    },
    watchMyPosions(myPosions: any) {
      const list = myPosions
      // const id = this.$router
      let currentData: any = {}
      let isFind = false
      for (let i = 0; i < list.length; i++) {
        if (list[i].nftTokenId === this.$route.params.id) {
          currentData = list[i]
          isFind = true
          break
        }
      }

      if (isFind) {
        console.log('currentData.currentPriceOrigin#####', currentData.currentPriceOrigin)
        const { ans_src, ans_dst } = preview_calculate_liqudity(
          currentData.lower_tick,
          currentData.upper_tick,
          currentData.liquity,
          new Numberu128(currentData.currentPriceOrigin)
        )

        const fromCoinAmount = fixD(ans_src / Math.pow(10, currentData.coin.decimals), currentData.coin.decimals)
        const toCoinAmount = fixD(ans_dst / Math.pow(10, currentData.pc.decimals), currentData.pc.decimals)
        this.currentData = {
          ...currentData,
          fromCoinAmount,
          toCoinAmount
        }
        // const current
        const currentPrice = Number(currentData.currentPrice)
        const minPrice = Number(currentData.minPrice)
        const maxPrice = Number(currentData.maxPrice)
        // // 区间中包含当前价格, 一种资产返回另外一种资产，并且返回liquity
        if (currentPrice >= minPrice && currentPrice <= maxPrice) {
          this.currentStatus = 'Active'
        } else if (currentPrice > maxPrice) {
          // 区间在当前价格的左侧时，也就是只有token b这一种资产, 返回liquity
          this.currentStatus = 'InActive'
        } else if (currentPrice < minPrice) {
          // 区间在当前价格的右侧时，也就是只有token a这一种资产, 返回liquity
          this.currentStatus = 'InActive'
        }
      }
    },
    openAddLiquiditySecondConfirm() {
      const currentPriceP = Number(Math.pow(Number(this.currentData.currentPrice) / Math.pow(10, 12), 2))

      console.log('this.currentData.####', this.currentData)
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
        currentStatus: this.currentStatus,
        ...this.currentData
      }
      this.showAddLiquiditySecondConfirm = true
    },
    closeAddLiquiditySecondConfirm() {
      this.secondConfirmData = {}
      this.showAddLiquiditySecondConfirm = false
    },
    supply(fromCoinAmount: string, toCoinAmount: string, deltaLiquity: number) {
      const conn = this.$web3
      const wallet = (this as any).$wallet

      const poolInfo = cloneDeep(this.currentData)
      // const poolInfo = JSON.parse(JSON.stringify(this.currentData))
      const nftMintToken = new PublicKey(poolInfo.nftTokenMint)
      const userNftPubkey = poolInfo.nft_token_id

      console.log('_id.vue###supply###poolInfo.nftTokenMint###', poolInfo.nftTokenMint)
      console.log('_id.vue###supply###poolInfo.nft_token_id###', poolInfo.nft_token_id.toString())

      // @ts-ignore
      const fromCoinAccount = get(this.wallet.tokenAccounts, `${poolInfo.coin.mintAddress}.tokenAccountAddress`)
      // @ts-ignore
      const toCoinAccount = get(this.wallet.tokenAccounts, `${poolInfo.pc.mintAddress}.tokenAccountAddress`)

      const key = getUnixTs().toString()
      this.$notify.info({
        key,
        message: 'Making transaction...',
        description: '',
        duration: 0,
        icon: this.$createElement('img', { class: { 'notify-icon': true }, attrs: { src: '/tanhao@2x.png' } })
      })

      addLiquidity(
        conn,
        wallet,
        poolInfo,
        nftMintToken,
        userNftPubkey,
        fromCoinAccount,
        toCoinAccount,
        poolInfo.coin,
        poolInfo.pc,
        fromCoinAmount,
        toCoinAmount,
        poolInfo.lower_tick,
        poolInfo.upper_tick,
        deltaLiquity
        // poolInfo.liquity.toNumber()
        // Number(fixD(this.deltaLiquity, 0))
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

          const description = `Add liquidity for ${fromCoinAmount} ${poolInfo.coin?.symbol} and ${toCoinAmount} ${poolInfo.pc?.symbol}`

          this.$accessor.transaction.sub({ txid, description })
          // this.$accessor.transaction.sub({ txid: 'txid问题？', description: '难道是这个问题吗' })
        })
        .catch((error) => {
          console.log('error#####', error)
          this.$notify.error({
            key,
            message: 'Add liquidity failed',
            description: error.message,
            class: 'error',
            icon: this.$createElement('img', { class: { 'notify-icon': true }, attrs: { src: '/icon_Error@2x.png' } })
          })
        })
        .finally(() => {
          // this.suppling = false
          // this.fromCoinAmount = ''
          // this.toCoinAmount = ''
          console.log('结束了###')
        })
    },
    toRemoveLiquidity(fromCoinAmount: string, toCoinAmount: string, sliderValue: number) {
      this.isLoading = true
      // this.showRemoveLiquidityHint = false

      const conn = this.$web3
      const wallet = (this as any).$wallet

      const poolInfo = cloneDeep(this.currentData)
      // const poolInfo = JSON.parse(JSON.stringify(this.currentData))
      // const nftMintToken = new PublicKey(poolInfo.nftTokenMint)
      const nftMintToken = poolInfo.nftTokenMint
      const userNftPubkey = poolInfo.nft_token_id

      // @ts-ignore
      const fromCoinAccount = get(this.wallet.tokenAccounts, `${poolInfo.coin.mintAddress}.tokenAccountAddress`)
      // @ts-ignore
      const toCoinAccount = get(this.wallet.tokenAccounts, `${poolInfo.pc.mintAddress}.tokenAccountAddress`)

      const key = getUnixTs().toString()
      this.$notify.info({
        key,
        message: 'Making transaction...',
        description: '',
        duration: 0,
        icon: this.$createElement('img', { class: { 'notify-icon': true }, attrs: { src: '/tanhao@2x.png' } })
      })

      // console.log('toRemoveLiquidity###fromCoinAmount#####', fromCoinAmount)
      // console.log('toRemoveLiquidity###toCoinAmount#####', toCoinAmount)
      // console.log(
      //   'toRemoveLiquidity###poolInfo.liquity * (sliderValue / 100)#####',
      //   poolInfo.liquity * (sliderValue / 100)
      // )

      removeLiquidity(
        conn,
        wallet,
        poolInfo,
        nftMintToken,
        userNftPubkey,
        fromCoinAccount,
        toCoinAccount,
        poolInfo.coin,
        poolInfo.pc,
        fromCoinAmount,
        toCoinAmount,
        // poolInfo.lower_tick,
        // poolInfo.upper_tick,
        poolInfo.liquity.toNumber() * (sliderValue / 100)
        // Number(fixD(this.deltaLiquity, 0))
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

          this.showRemoveLiquidityHint = false
          this.isLoading = false
          const description = `Remove liquidity for ${fromCoinAmount} ${poolInfo.coin?.symbol} and ${toCoinAmount} ${poolInfo.pc?.symbol}`

          this.$accessor.transaction.sub({ txid, description })
          // this.$accessor.transaction.sub({ txid: 'txid问题？', description: '难道是这个问题吗' })
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
          console.log('结束了###')
        })
    },
    toClaim() {
      this.isLoading = true
      const conn = this.$web3
      const wallet = (this as any).$wallet

      const poolInfo = cloneDeep(this.currentData)

      // @ts-ignore
      const fromCoinAccount = get(this.wallet.tokenAccounts, `${poolInfo.coin.mintAddress}.tokenAccountAddress`)
      // @ts-ignore
      const toCoinAccount = get(this.wallet.tokenAccounts, `${poolInfo.pc.mintAddress}.tokenAccountAddress`)

      const key = getUnixTs().toString()
      this.$notify.info({
        key,
        message: 'Making transaction...',
        description: '',
        duration: 0,
        icon: this.$createElement('img', { class: { 'notify-icon': true }, attrs: { src: '/tanhao@2x.png' } })
      })
      claim(conn, wallet, poolInfo, fromCoinAccount, toCoinAccount)
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

          const description = `claim liquidity is ${poolInfo.liquity}`
          this.showClaimHint = false
          this.$accessor.transaction.sub({ txid, description })
          // this.$accessor.transaction.sub({ txid: 'txid问题？', description: '难道是这个问题吗' })
        })
        .catch((error) => {
          console.log('error#####', error)
          this.$notify.error({
            key,
            message: 'Claim failed',
            description: error.message,
            class: 'error',
            icon: this.$createElement('img', { class: { 'notify-icon': true }, attrs: { src: '/icon_Error@2x.png' } })
          })
        })
        .finally(() => {
          this.isLoading = false
          // this.suppling = false
          // this.fromCoinAmount = ''
          // this.toCoinAmount = ''
          console.log('结束了###')
        })
    }
  }
})
</script>
<style lang="less" scoped>
@import '../../styles/base.less';
.pool-container-box {
  width: 770px;
  margin: auto;
}
.pool-container-rollback {
  font-size: 14px;
  color: rgba(#fff);
  display: flex;
  align-items: center;
  margin-bottom: 2px;
  .icon {
    width: 20px;
    height: 20px;
    margin-right: 10px;
    cursor: pointer;
  }
}
.pool-container-filePacket {
  // height: 74px;
  padding: 20px 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .filePacket-right {
    // width: 334px;
    // height: 34px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    .title-active {
      color: #fff;
    }
    a {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 137px;
      height: 28px;
      position: relative;
      z-index: 1;
      background: #1b2023;
      border-radius: 8px;
      margin-left: 10px;
      color: rgba(255, 255, 255, 0.5);
      font-family: 'Arial Bold';
      font-weight: bold;
      &:hover,
      &.active,
      &.exact-active {
        &::after,
        &::before {
          display: block;
        }
      }
      &::after,
      &::before {
        content: '';
        display: none;
        width: 139px;
        height: 30px;
        background: linear-gradient(214deg, #59bdad 0%, #6676f5 61%, #9a89f9 76%, #eba7ff 100%);
        position: absolute;
        z-index: -2;
        border-radius: 8px;
      }
      &::before {
        width: 100%;
        height: 100%;
        background: #1b2023;
        z-index: -1;
      }
    }
  }
}
.pool-container-argument {
  // width: 770px;
  // height: 225px;
  // margin: auto;
  padding-bottom: 20px;
  // background: rgba(255,255,255,0.06);
  display: flex;
  justify-content: space-between;
}
.pool-container-rateExchange {
  // width: 770px;
  // height: 187px;
  // margin: auto;
  border-radius: 30px;
  background: rgba(#fff, 0.03);
  padding: 14px 20px 20px;
  display: flex;
  flex-wrap: wrap;
  align-content: space-between;
  .price-range {
    width: 100%;
    // width: 730px;
    // height: 34px;
    // background: #000;
    display: flex;
    justify-content: space-between;
    .price-range-left {
      display: flex;
      align-items: center;
      // justify-content: space-between;
      // width: 205px;
      // height: 28px;
      > span {
        width: 92px;
        height: 30px;
        line-height: 30px;
        font-family: 'Arial Bold';
        font-size: 16px;
        font-weight: bold;
        margin-right: 10px;
      }
    }
    .price-range-right {
      margin-top: 6px;
      // height: 28px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      > span {
        font-weight: 700;
        font-size: 16px;
        background: linear-gradient(to right, #59bdad, #6676f5, #9a89f9, #eba7ff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-right: 10px;
      }
      .range-icon {
        display: flex;
        align-items: center;
        padding: 3px;
        border-radius: 7px;
        background: rgba(255, 255, 255, 0.1);
        height: 26px;
        div {
          height: 20px;
          padding: 0px 10px;
          cursor: pointer;
          &.active {
            background: linear-gradient(214deg, #59bdad 0%, #6676f5 61%, #9a89f9 76%, #eba7ff 100%);
            border-radius: 7px;
            cursor: pointer;
          }
        }
      }
    }
  }
  .information-pool {
    // width: 730px;
    width: 100%;
    // height: 105px;
    // background: #aaa;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 16px;
    .icon {
      width: 20px;
      height: 20px;
      cursor: pointer;
      margin: 0 4px;
    }
  }
}
@media screen and (max-width: 750px) {
  .pool-container-box {
    width: 100%;
    padding: 0 20px;
  }
  .pool-container-rollback {
    margin-top: 10px;
  }
  .pool-container-filePacket {
    display: block;
    .filePacket-right {
      margin-top: 10px;
    }
  }
  .pool-container-argument {
    display: block;
  }
  .pool-container-rateExchange {
    .price-range {
      display: block;
    }
  }
}
</style>
