<template>
  <div class="farming-pool-card-list">
    <div v-for="(item, index) in dataList" :key="index" class="farming-pool-card-box">
      <div
        v-if="isStaked === 'All' || isStaked === item.isStaked"
        class="farming-pool-card"
        :class="isShowTableTr == index && index == 0 ? 'is-open' : ''"
      >
        <div class="symbol-info">
          <div class="symbol-left">
            <img class="coin-before" :src="importIcon(`/coins/${item.tokenA.symbol.toLowerCase()}.png`)" alt="" /><img
              class="coin-after"
              :src="importIcon(`/coins/${item.tokenB.symbol.toLowerCase()}.png`)"
              alt=""
            />
            <div class="symbol-text">
              <div class="symbol-name">{{ item.name }}</div>
              <!-- <div class="fee-rate">Fee Rate {{ item.fee }}%</div> -->
            </div>
          </div>
          <div class="symbol-right">
            <div class="open-or-close" :class="index !== 0 ? 'open-or-close-disabled' : ''">
              <!-- <div @mouseenter="changeRel = !changeRel" @mouseleave="changeRel = !changeRel">
                <svg class="stern-icon set-dot" aria-hidden="true">
                  <use xlink:href="#icon-more"></use>
                </svg>

                <div v-show="changeRel" class="symbol-relation">
                  <div @click="gotoLp(item)">
                    <svg aria-hidden="true">
                      <use xlink:href="#icon-icon-Get-NFT"></use>
                    </svg>
                    Get LP NFT
                  </div>
                  <div>
                    <svg aria-hidden="true">
                      <use xlink:href="#icon-icon-Show-Contract"></use>
                    </svg>
                    Show Contract
                  </div>
                </div>
              </div> -->

              <Tooltip overlay-class-name="the-more-tooltip" placement="top">
                <div class="the-more-icon-box">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-icon-Pack-Deposit"></use>
                  </svg>
                </div>

                <template slot="title">
                  <div class="symbol-relation" @click="gotoLp(item)">
                    <div>Add Liquidity</div>
                  </div>
                </template>
              </Tooltip>

              <div class="toggle-icon-box" @click="updateIsShowTableTr(index)">
                <svg class="icon" aria-hidden="true">
                  <use :xlink:href="isShowTableTr ? '#icon-icon-Pack-on' : '#icon-icon-Pack-up'"></use>
                </svg>
              </div>

              <!-- <svg class="stern-icon" aria-hidden="true" @click="toogleData()">
                <use :xlink:href="isOpen ? '#icon-icon-Pack-on' : '#icon-icon-Pack-up'"></use>
              </svg> -->
            </div>
          </div>
        </div>
        <div class="trade-info">
          <div class="trade-info-item">
            <div class="trade-info-title">
              <span>APR</span>
              <Tooltip overlay-class-name="td-title-tooltip" placement="top">
                <div>
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-a-bianzu181"></use>
                  </svg>
                </div>
                <template slot="title">
                  <div>Only the effective liquidity within the reward range is taken into account.</div>
                </template>
              </Tooltip>
            </div>
            <div class="trade-info-text">
              {{ (tvlDataObjNew[item.positionWrapper] && tvlDataObjNew[item.positionWrapper].aprView) || '--' }}
            </div>
          </div>
          <div class="trade-info-item">
            <div class="trade-info-title">Liquidity</div>
            <div class="trade-info-text">
              {{ (tvlDataObjNew[item.positionWrapper] && tvlDataObjNew[item.positionWrapper].tvlView) || '--' }}
            </div>
          </div>
          <div class="trade-info-item">
            <div class="trade-info-title">Reward Range</div>
            <div class="trade-info-text">
              {{ tvlDataObjNew[item.positionWrapper] && tvlDataObjNew[item.positionWrapper].etrMinPrice }} -
              {{ tvlDataObjNew[item.positionWrapper] && tvlDataObjNew[item.positionWrapper].etrMaxPrice }}
            </div>
          </div>
          <div class="trade-info-item">
            <div class="trade-info-title">
              Caffeine Earned
              <!-- <svg class="icon" aria-hidden="true" @click="toogleData()"> -->
              <!-- <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-a-bianzu181"></use>
              </svg> -->
            </div>
            <div class="trade-info-text">
              {{ (farming.earningObj && farming.earningObj[item.positionWrapper]) || '--' }}
            </div>
          </div>
        </div>
        <div class="get-lp">
          <Button v-if="!wallet.connected" @click="$accessor.wallet.openModal">Connect Wallet</Button>
          <Button
            v-else
            class="action-btn"
            :loading="isClaiming"
            :disabled="(!farming.earningObj && !Number(farming.earningObj[item.positionWrapper])) || isDisabled"
            @click="toClaim(item)"
          >
            <!-- <div>Harvest all</div> -->
            Harvest all
          </Button>
        </div>
        <div class="stake-and-unstake">
          <div v-for="(pitem, pindex) in item.positions" :key="pindex" class="stake-box trade-info">
            <div class="trade-info-item">
              <div class="trade-info-title">NFT</div>
              <div class="trade-info-text">
                <a class="td-text" :href="`https://solscan.io/account/${pitem.nftAccountAddress}`" target="_blank">{{
                  processNftAddress(pitem.nftMintAddress)
                }}</a>
              </div>
            </div>
            <div class="trade-info-item">
              <div class="trade-info-title">Liquidity</div>
              <div class="trade-info-text">$ {{ pitem.liquityUSD }}</div>
            </div>
            <div class="trade-info-item">
              <div class="trade-info-title">Price Range</div>
              <div class="trade-info-text">{{ pitem.lowerPrice }} - {{ pitem.upperPrice }}</div>
            </div>
            <Button
              v-if="!pitem.isStaked"
              class="action-btn"
              :disabled="!pitem.withinRange || isDisabled"
              :loading="isStaking && currentPosition && currentPosition.nftMintAddress === pitem.nftMintAddress"
              @click="toStake(item, pitem)"
            >
              <!-- <div>Stake</div> -->
              Stake
            </Button>
            <Button
              v-else
              class="action-btn none-btn"
              :loading="isUnStaking && currentPosition && currentPosition.nftMintAddress === pitem.nftMintAddress"
              :class="pitem.isStaked ? '' : 'un-stake'"
              :disabled="isDisabled"
              @click="toUnStake(item, pitem)"
            >
              <!-- <div>Unstake</div> -->
              Unstake
            </Button>
          </div>
          <!-- <div class="stake-box trade-info unstake-box">
            <div class="trade-info-item">
              <div class="trade-info-title">NFT ID</div>
              <div class="trade-info-text">2</div>
            </div>
            <div class="trade-info-item">
              <div class="trade-info-title">Liquidity</div>
              <div class="trade-info-text">$ 1856.89</div>
            </div>
            <div class="trade-info-item">
              <div class="trade-info-title">Price Range</div>
              <div class="trade-info-text">0.999 - 1.001</div>
            </div>
            <Button class="action-btn none-btn" @click="showNotify('UnStake')">
              <div>Unstake</div>
            </Button>
          </div> -->
        </div>
      </div>
    </div>
    <div v-if="isShowHidebox" class="farming-pool-card-hide-box">
      <div class="symbol-info">
        <div class="symbol-left">
          <img class="coin-before" src="../assets/coins/cusdt.png" alt="" /><img
            class="coin-after"
            src="../assets/coins/cusdc.png"
            alt=""
          />
          <div class="symbol-text">
            <div class="symbol-name">CUSDC / CUSDT</div>
            <div class="fee-rate">Fee Rate 0.05 %</div>
          </div>
        </div>
        <!-- <div class="symbol-right">
            Coming soon
          </div> -->
        <div class="symbol-right">Coming soon</div>
      </div>
    </div>
    <!-- <img class="farming-pool-tag" src="@/assets/images/img-Prelaunch.png" alt="" /> -->
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import importIcon from '@/utils/import-icon'
import { Button } from 'ant-design-vue'
import { mapState } from 'vuex'
import { QuarrySDK, MinerWrapper, PositionWrapper } from '@cremafinance/crema-farming'
import { Provider as AnchorProvider, setProvider, Wallet as AnchorWallet } from '@project-serum/anchor'
import { SignerWallet, SolanaProvider } from '@saberhq/solana-contrib'
import {
  clusterApiUrl,
  Connection,
  Keypair,
  PublicKey,
  AccountInfo as BaseAccountInfo,
  Signer,
  TokenAccountsFilter,
  Context,
  SignatureResult
} from '@solana/web3.js'
import type { AccountInfo } from '@solana/spl-token'
import { AccountLayout, TOKEN_PROGRAM_ID, u64 } from '@solana/spl-token'
import invariant from 'tiny-invariant'
import { makeSDK, getTokenAccountsByOwnerAndMint } from '@/contract/farming'
import { Token, TokenAmount } from '@saberhq/token-utils'
import { Tooltip } from 'ant-design-vue'
import { fixD, addCommom } from '@/utils'
Vue.use(Button)
export default Vue.extend({
  components: {
    Tooltip
    // Button
  },
  props: {
    isStaked: {
      type: String,
      default: 'All'
    },
    searchKey: {
      type: String,
      default: ''
    },
    tvlData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      stakeTitle: 'Stake',
      showStake: false,
      isShowTableTr: -1,
      isShowHidebox: false,
      changeRel: false,
      tableDataArr: [
        {
          symbolName: 'CUSDT-CUSDC',
          feeRate: '0.05',
          coinA: 'CUSDT',
          coinB: 'CUSDC',
          apr: '106.8',
          liquidity: '999.8',
          rewardRangeTab: '1 - 1.002',
          rewardRange: '0.989 - 1',
          earned: '17.54',
          isStaked: 'Staked'
        }
      ],
      dataList: [],
      isStaking: false,
      isUnStaking: false,
      isClaiming: false,
      isDisabled: false,
      currentPosition: null as any,
      tvlDataObjNew: {} as any
    }
  },
  computed: {
    ...mapState(['wallet', 'transaction', 'url', 'farming'])
  },
  watch: {
    // searchKey: {
    //   immediate: true,
    //   handler: 'updateSearchKey'
    // }
    tableDataArr: {
      handler(newValue, oldValue) {
        if (!newValue[0]) {
          this.isShowHidebox = true
        } else {
          this.isShowHidebox = false
        }
      },
      deep: true
    },
    'farming.farmingList': {
      handler: 'watchFarmingList',
      immediate: true
    },
    // 'wallet.connected': {
    //   handler: 'walletWatch',
    //   immediate: true
    // },
    tvlData: {
      handler: 'tvlDataWatch',
      immediate: true
    }
  },
  methods: {
    importIcon,
    tvlDataWatch(newVal) {
      if (newVal) {
        const result: any = {}
        for (let key in newVal) {
          const item = newVal[key]
          const apr = item.apr * 100
          const tvl = item.tvl
          result[key] = {
            ...item,
            aprView: apr > 10000 ? Infinity : `${fixD(apr, 2)}%`,
            tvlView: tvl ? `$ ${addCommom(tvl, 2)}` : '--'
          }
        }
        this.tvlDataObjNew = result
      }
    },
    getTvl(item: any) {
      let apr
      if (item && this.tvlData && this.tvlData[item.positionWrapper]) {
        apr = this.tvlData[item.positionWrapper].apr * 100
        if (apr > 10000) {
          apr = Infinity
        } else {
          apr = `${apr}%`
        }
      } else {
        apr = '--'
      }
      return apr
    },
    getLiquidity(item: any) {
      let tvl
      if (item && this.tvlData && this.tvlData[item.positionWrapper]) {
        tvl = this.tvlData[item.positionWrapper].tvl
        if (tvl) {
          tvl = '$ ' + fixD(tvl, 2)
        }
      } else {
        tvl = '--'
      }
      return tvl
    },
    showStakeConfirm(title: string) {
      this.stakeTitle = title
      this.showStake = true
    },
    showNotify(title: string) {
      this.$notify.success({
        message: `${title} Success`,
        icon: this.$createElement('img', { class: { 'notify-icon': true }, attrs: { src: '/icon_Copied@2x.png' } }),
        description: (h: any) => h('div', [`${title} Success`])
      })
    },
    updateIsShowTableTr(index: any) {
      if (index == 0 && this.isShowTableTr != 0) {
        this.isShowTableTr = 0
      } else if (index == 0 && this.isShowTableTr == 0) {
        this.isShowTableTr = -1
      }
    },
    toogleData(index: number) {
      const info = this.tableDataArr[index]
      const tempcoinA = info.coinB
      const tempcoinB = info.coinA
      const rewardRange = info.rewardRange
      const temprewardRange = info.rewardRange.split('').reverse().join('')
      const data = {
        ...info,
        coinA: tempcoinA,
        coinB: tempcoinB,
        rewardRange: temprewardRange
      }
      this.tableDataArr[index] = data
      this.$forceUpdate()
    },
    gotoLp(item: any) {
      if (item) {
        this.$router.push(`/pool?from=${item.tokenA.symbol}&to=${item.tokenB.symbol}`)
      }
    },
    processNftAddress(address: string) {
      if (address) {
        const result = `${address.substr(0, 4)}...${address.substr(address.length - 4, 4)}`
        return result
      }
      return ''
    },
    watchFarmingList(list: any) {
      console.log('watchFarmingList####list####', list)
      this.dataList = list
    },
    // walletWatch(newValue) {
    //   // if (newValue) {
    //   this.$accessor.farming.getFarmingList()
    //   // }
    // },
    async toStake(poolInfo: any, positionInfo: any) {
      this.currentPosition = positionInfo
      this.isStaking = true
      this.isDisabled = true
      console.log('toStake####poolInfo####', poolInfo)
      console.log('toStake####positionInfo####', positionInfo)
      const wrapper = new PublicKey(poolInfo.positionWrapper)
      const nftMint = positionInfo.nftTokenId
      const rewarderKey = new PublicKey(poolInfo.rewarderKey)

      const wallet = (this as any).$wallet
      const conn = this.$web3
      const sdk = makeSDK(conn, wallet)
      const wrapperInfo = await PositionWrapper.fetchPositionWrapper(wrapper, conn)
      invariant(wrapperInfo !== null, 'wrapper not found')

      const userSwapPosition = await PositionWrapper.fetchSwapPositionsByOwner(wrapperInfo.swapKey, nftMint, conn)
      invariant(userSwapPosition !== null, "Can't find the swap position you own")

      this.$accessor.transaction.setTransactionDesc(`Stake ${poolInfo.name} NFT`)
      this.$accessor.transaction.setShowWaiting(true)

      try {
        const res = await sdk.positionWrapper.mintAndStake({
          wrapper: wrapperInfo,
          nftMint,
          rewarderKey
        })
        console.log('res#####', res)
        this.$accessor.transaction.setShowWaiting(false)
        const receipt: any = await res.tx.confirm()
        console.log('receipt####', receipt)
        if (receipt && receipt.signature) {
          const txid = receipt.signature
          const description = `Stake ${poolInfo.name} NFT`
          this.$accessor.transaction.sub({ txid, description })
          this.$accessor.transaction.setShowSubmitted(true)
          const _this = this
          conn.onSignature(txid, function (signatureResult: SignatureResult, context: Context) {
            if (!signatureResult.err) {
              // setTimeout(() => {
              // _this.$accessor.farming.getFarmingList()
              // _this.$accessor.farming.getEarningsObj()
              // }, 1500)
              _this.$emit('refreshData')
            }
          })
        }
        this.isStaking = false
        this.isDisabled = false
      } catch (err) {
        this.$accessor.transaction.setShowWaiting(false)
        this.isStaking = false
        this.isDisabled = false
      }
    },
    async toUnStake(poolInfo: any, positionInfo: any) {
      this.currentPosition = positionInfo
      this.isUnStaking = true
      this.isDisabled = true
      console.log('toUnStake####poolInfo###', poolInfo)
      console.log('toUnStake####positionInfo####', positionInfo)
      const wrapper = new PublicKey(poolInfo.positionWrapper)
      const nftMint = new PublicKey(positionInfo.nftMintAddress)
      const rewarderKey = new PublicKey(poolInfo.rewarderKey)
      const isClaim = true

      const wallet = (this as any).$wallet
      const conn = this.$web3
      const sdk = makeSDK(conn, wallet)

      // Get nft account
      const tokenAccounts = await getTokenAccountsByOwnerAndMint(
        sdk.provider.connection,
        sdk.provider.wallet.publicKey,
        nftMint
      )
      if (tokenAccounts.length <= 0) {
        console.log('The nft token account not foundkj')
      }
      invariant(tokenAccounts[0] !== undefined, 'The nft token accuont is undefined')

      this.$accessor.transaction.setTransactionDesc(`Unstake ${poolInfo.name} NFT`)
      this.$accessor.transaction.setShowWaiting(true)

      // Get wrapper info
      const wrapperInfo = await PositionWrapper.fetchPositionWrapper(wrapper, conn)
      invariant(wrapperInfo !== null, 'wrapper not found')

      try {
        const tx = await sdk.positionWrapper.unstakeAndBurn({
          wrapper: wrapperInfo,
          nftMint,
          nftAccount: tokenAccounts[0].address,
          rewarderKey,
          isClaim
        })
        const receipt = await tx.confirm()
        this.$accessor.transaction.setShowWaiting(false)
        if (receipt && receipt.signature) {
          const txid = receipt.signature
          const description = `Unstake ${poolInfo.name} NFT`
          this.$accessor.transaction.sub({ txid, description })
          this.$accessor.transaction.setShowSubmitted(true)
          const _this = this
          conn.onSignature(txid, function (signatureResult: SignatureResult, context: Context) {
            if (!signatureResult.err) {
              // setTimeout(() => {
              // _this.$accessor.farming.getFarmingList()
              // _this.$accessor.farming.getEarningsObj()
              // }, 1500)
              _this.$emit('refreshData')
            }
          })
        }
        this.isUnStaking = false
        this.isDisabled = false
      } catch (err) {
        this.$accessor.transaction.setShowWaiting(false)
        this.isUnStaking = false
        this.isDisabled = false
      }
    },
    async minerWrapper(rewarderKey: PublicKey, mint: PublicKey): Promise<MinerWrapper> {
      const wallet = (this as any).$wallet
      const conn = this.$web3
      const sdk = makeSDK(conn, wallet)
      const rewarder = await sdk.mine.loadRewarderWrapper(rewarderKey)
      const token = await Token.load(sdk.provider.connection, mint)
      invariant(token !== null)
      const quarry = await rewarder.getQuarry(token)
      return await quarry.getMinerActions(wallet.publicKey)
    },
    async toClaim(poolInfo: any) {
      this.isClaiming = true
      this.isDisabled = true
      const conn = this.$web3
      const rewarderKey = new PublicKey(poolInfo.rewarderKey)
      const mint = new PublicKey(poolInfo.positionWrapperWrapMint)

      this.$accessor.transaction.setTransactionDesc('Harvest all rewards')
      this.$accessor.transaction.setShowWaiting(true)

      try {
        const miner = await this.minerWrapper(rewarderKey, mint)
        const tx = await miner.claim()
        this.$accessor.transaction.setShowWaiting(false)
        const receipt = await tx.confirm()
        if (receipt && receipt.signature) {
          const txid = receipt.signature
          const description = `Harvest all rewards`
          this.$accessor.transaction.sub({ txid, description })
          this.$accessor.transaction.setShowSubmitted(true)
          const _this = this
          conn.onSignature(txid, function (signatureResult: SignatureResult, context: Context) {
            if (!signatureResult.err) {
              // _this.$accessor.farming.getFarmingList()
              // _this.$accessor.farming.getEarningsObj()
              _this.$emit('refreshData')
            }
          })
        }
        this.isClaiming = false
        this.isDisabled = false
      } catch (err) {
        this.$accessor.transaction.setShowWaiting(false)
        this.isClaiming = false
        this.isDisabled = false
      }
    }
  }
})
</script>

<style lang="less">
.the-more-tooltip {
  .ant-tooltip-inner {
    padding: 0px !important;
    background: rgba(#000, 0) !important;
  }
  .ant-tooltip-arrow {
    &::before {
      background: rgba(#000, 0) !important;
    }
  }
}

.td-title-tooltip {
  .ant-tooltip-inner {
    background: rgba(#000, 0.2) !important;
    backdrop-filter: blur(10px);
  }
  .ant-tooltip-arrow {
    &::before {
      background: rgba(#000, 0) !important;
    }
  }
}
</style>
<style lang="less" scoped>
@import '../styles/base.less';
* {
  line-height: 1;
}
.is-open {
  height: auto !important;
}
.farming-pool-card-list {
  // margin-top: 27px;
  position: relative;
}
.farming-pool-card-list > img {
  width: 80px;
  position: absolute;
  top: -20px;
  left: -12px;
}
.farming-pool-card-box {
  margin-bottom: 40px;
  background: linear-gradient(270deg, #3e434e 0%, #292d33 100%);
  border-radius: 20px;
  border: 1px solid #3f434e;
  & + .farming-pool-card-box {
    margin-top: 20px;
  }
  &:last-child {
    margin-bottom: 0px;
  }
}
.farming-pool-card {
  padding: 22px 12px;
  height: 235px;
  overflow: hidden;
  .trade-info {
    padding: 0 16px;
    display: flex;
    flex-wrap: wrap;
    .trade-info-item {
      width: 50%;
      margin: 15px 0;
      .trade-info-title {
        font-size: 12px;
        color: #d8d8d8;
        display: flex;
        align-items: center;
        // justify-content: center;
        line-height: 20px;
        .icon {
          width: 14px;
          height: 14px;
          fill: #b5b8c2;
          margin: 2px 0 0 6px;
        }
      }
      .trade-info-text {
        font-size: 14px;
        font-weight: 800;
        color: #fff;
        margin-top: 12px;
        display: flex;
        // justify-content: center;
        img {
          width: 16px;
          height: 16px;
        }
      }
    }
  }
  .get-lp {
    margin-top: 20px;
    padding: 0 16px;
    display: flex;
    justify-content: space-between;
    a {
      color: #fff;
    }
    .get-lp-btn,
    .view-contract-btn {
      width: 136px;
      height: auto;
      display: inline-block;
      padding: 13px 0;
      text-align: center;
      background: linear-gradient(270deg, #3e434e 0%, #282a2f 100%);
      border-radius: 8px;
      border: 1px solid #3f434e;
      line-height: 1;
      font-size: 14px;
      font-family: Arial-BoldMT, Arial;
      font-weight: normal;
    }
  }
  .action-btn {
    .gradient-btn-large();
    width: 100%;
    line-height: 1;
    height: 40px;
    padding: 1px;
    font-size: 14px;
    font-weight: normal;
  }
  .un-stake {
    box-sizing: border-box;
    padding: 1px;
    background: #282c33 !important;
    &:hover {
      background: #34383e !important;
    }
  }
  .none-btn {
    box-sizing: border-box;
    padding: 2px;
    border-radius: 6px;
    background-image: -webkit-linear-gradient(top, #5fe6d0 0%, #597bff 38%, #9380ff 72%, #e590ff 100%);
    div {
      width: 100%;
      height: 100%;
      border-radius: 6px;
      background: #282c33;
      &:hover {
        background: #30343b;
      }
    }
  }
  .stake-and-unstake {
    margin-top: 28px;
    // background: #282c33;
    border-radius: 10px;
    .stake-box {
      padding: 0 16px 40px;
      border-bottom: 1px solid rgba(#fff, 0.1);
      &:last-child {
        border-bottom: none;
      }
    }
    .unstake-box {
      margin-top: 20px;
      padding-bottom: 20px;
      border: none;
    }
  }
}
.symbol-info {
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  .symbol-left {
    display: flex;
    align-items: center;
    img {
      width: 36px;
      height: 36px;
    }
    .coin-after {
      margin-left: -5px;
    }
    margin-right: 8px;
    .symbol-text {
      font-size: 14px;
      color: #fff;
      margin-left: 12px;
    }
    .fee-rate {
      padding: 4px 7px;
      border-radius: 4px;
      background: rgba(#07ebad, 0.1);
      font-size: 12px;
      color: #07ebad;
      margin-top: 4px;
      line-height: 1;
    }
  }
  .symbol-right {
    .open-or-close {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      .toggle-icon-box,
      .the-more-icon-box {
        background: none !important;
        width: 16px;
        height: 16px;
        border: 1px solid #b5b8c2;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 8px;
      }
    }
    .open-or-close-disabled {
      color: #5f667c;
      .icon {
        width: 20px;
        height: 20px;
        fill: #5f667c;
      }
    }
  }
}
.symbol-relation {
  // position: absolute;
  // width: 140px;
  // left: -20px;
  // height: 90px;
  background: rgba(#000, 0.2);
  backdrop-filter: blur(10px);
  z-index: 20;
  padding: 6px 10px;
  display: flex;
  flex-wrap: wrap;
  align-content: space-around;
  border-radius: 10px;
  > div {
    background: none;
    color: #b5b8c2;
    width: 100%;
    height: 28px;
    display: flex;
    align-items: center;
    // padding-left: 8px;
    font-size: 12px;
    border-radius: 10px;
    cursor: pointer;
    svg {
      margin-right: 4px;
      width: 20px;
      height: 20px;
      fill: #fff;
      cursor: pointer;
    }
    // &:hover {
    //   background: #30343c;
    // }
  }
}
.farming-pool-card-hide-box {
  width: 340px;
  background: linear-gradient(270deg, #3e434e 0%, #292d33 100%);
  border-radius: 20px;
  border: 1px solid #3f434e;
  & + .farming-pool-card-hide-box {
    margin-top: 20px;
  }
  .symbol-info {
    margin: 10px;
    padding: 0 10px;
  }
  .symbol-info .symbol-right {
    height: 16px;
    background: linear-gradient(233deg, #4bb5ff 0%, #ce90ff 100%);
    -webkit-background-clip: text;
    color: transparent;
    font-family: 'Arial-BoldMT', Arial;
  }
}
</style>
