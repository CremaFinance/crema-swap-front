<template>
  <div>
    <div class="farming-pool-table-container">
      <div
        v-for="(item, index) in dataList"
        :key="index"
        class="farming-pool-content"
        :class="changeNFT ? 'farming-pool-hide' : ''"
      >
        <!-- <img class="farming-pool-tag" src="@/assets/images/img-Prelaunch.png" alt="" /> -->
        <div class="farming-pool-content-Top">
          <div class="symbol-info">
            <div class="symbol-left">
              <img class="coin-before" src="../assets/coins/cusdt.png" alt="" /><img
                class="coin-after"
                src="../assets/coins/cusdc.png"
                alt=""
              />
            </div>
            <div class="symbol-text">
              <div class="symbol-name">{{ item.name }}</div>
              <div class="fee-rate">Fee Rate {{ item.fee }}%</div>
            </div>
          </div>
          <div style="width: 110px">
            <div class="td-title">APR</div>
            <div class="td-text">{{ getTvl(item) }}</div>
          </div>
          <div style="width: 140px">
            <div class="td-title">Liquidity</div>
            <div class="td-text">{{ getLiquidity(item) }}</div>
          </div>
          <div style="width: 180px">
            <div class="td-title">Reward Range</div>
            <div v-if="item.pinfo" class="td-text">{{ item.pinfo.etrMinPrice }} - {{ item.pinfo.etrMaxPrice }}</div>
            <div v-else>--</div>
          </div>
          <div style="width: 130px">
            <div class="td-title">
              Earned
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-a-bianzu181"></use>
              </svg>
            </div>
            <div class="td-text">{{ item.miner ? item.miner.PendingRewardView : '--' }}</div>
          </div>
          <div class="symbol-stern">
            <!-- <Button v-if="!changeNFT" class="action-btn btn-wind">
              <div v-if="!wallet.connected" @click="$accessor.wallet.openModal">Connect Wallet</div>
              <div
                v-else
                :loading="isClaiming"
                :disabled="!item.miner || !item.miner.PendingRewardView || isDisabled"
                @click="toClaim(item)"
              >
                Harvest all
              </div>
            </Button> -->
            <Button
              v-if="!changeNFT && !wallet.connected"
              class="action-btn btn-wind"
              @click="$accessor.wallet.openModal"
            >
              Connect Wallet
            </Button>
            <Button
              v-if="!changeNFT && wallet.connected"
              class="action-btn btn-wind"
              :loading="isClaiming"
              :disabled="!item.miner || !Number(item.miner.PendingRewardView) || isDisabled"
              @click="toClaim(item)"
              >Harvest all</Button
            >
            <Tooltip overlay-class-name="the-more-tooltip" placement="bottom">
              <div class="the-more-icon-box">
                <svg class="stern-icon set-dot" aria-hidden="true">
                  <use xlink:href="#icon-more"></use>
                </svg>
              </div>

              <template slot="title">
                <div class="symbol-relation">
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
              </template>
            </Tooltip>
            <svg
              v-if="!changeNFT && wallet && wallet.connected"
              class="stern-icon"
              aria-hidden="true"
              @click="toogleData()"
            >
              <use :xlink:href="isOpen ? '#icon-icon-on' : '#icon-icon-down'"></use>
            </svg>
            <img
              v-if="changeNFT && wallet && wallet.connected"
              style="width: 103px; height: 18px"
              src="../assets/images/img-Coming_soon.png"
              alt=""
            />
          </div>
        </div>
        <div v-if="!changeNFT" class="farming-pool-content-Bot" :class="isOpen ? 'is-open' : ''">
          <div class="content-Bot-All" v-for="(pitem, pindex) in item.positions" :key="pindex">
            <div>
              <div class="td-title">NFT</div>
              <a
                class="td-text nft-address"
                :href="`https://explorer.solana.com/address/${pitem.nftMintAddress}`"
                target="_blank"
                >{{ processNftAddress(pitem.nftMintAddress) }}</a
              >
            </div>
            <div>
              <div class="td-title">Liquidity</div>
              <div class="td-text">$ {{ pitem.liquityUSD }}</div>
            </div>
            <div>
              <div class="td-title">Price Range</div>
              <div class="td-text">{{ pitem.lowerPrice }} - {{ pitem.upperPrice }}</div>
            </div>
            <div class="align-right">
              <!-- <Button :class="item.isStaked == 'Unstake' ? 'un-stake' : ''" class="action-btn" @click="changeLoading()"> -->
              <Button
                v-if="!pitem.isStaked"
                :loading="isStaking && currentPosition && currentPosition.nftMintAddress === pitem.nftMintAddress"
                :class="pitem.isStaked ? 'un-stake' : ''"
                :disabled="!pitem.withinRange || isDisabled"
                class="action-btn"
                @click="toStake(item, pitem)"
              >
                Stake
              </Button>
              <Button
                v-else
                :loading="isUnStaking && currentPosition && currentPosition.nftMintAddress === pitem.nftMintAddress"
                :disabled="isDisabled"
                :class="pitem.isStaked ? 'un-stake' : ''"
                class="action-btn"
                @click="toUnStake(item, pitem)"
              >
                Unstake
              </Button>
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="farming-pool-content" :class="nftData ? 'farming-pool-hide' : ''" style="margin-top: 40px">
        <img
          :class="changeNFT || isOpen ? 'pool-tags' : ''"
          class="farming-pool-tag farming-pool-tagnone"
          src="@/assets/images/img-Finished.png"
          alt=""
        />
        <div class="farming-pool-content-Top">
          <div class="symbol-info">
            <div class="symbol-left">
              <img class="coin-before" src="../assets/coins/cusdt.png" alt="" /><img
                class="coin-after"
                src="../assets/coins/cusdc.png"
                alt=""
              />
            </div>
            <div class="symbol-text">
              <div class="symbol-name">USDT — USDC</div>
              <div class="fee-rate">Fee Rate 0.05%</div>
            </div>
          </div>
          <div style="width: 110px">
            <div class="td-title">APR</div>
            <div class="td-text">?</div>
          </div>
          <div style="width: 140px">
            <div class="td-title">Liquidity</div>
            <div class="td-text">--</div>
          </div>
          <div style="width: 180px">
            <div class="td-title">Reward Range</div>
            <div class="td-text">? - ?</div>
          </div>
          <div style="width: 130px">
            <div class="td-title">
              Earned
              <svg class="icon" aria-hidden="true" @click="toogleData()">
                <use xlink:href="#icon-a-bianzu181"></use>
              </svg>
            </div>
            <div class="td-text">0 CRM</div>
          </div>
          <div class="symbol-stern">
            <Button v-if="!dataNFT" class="action-btn">
              <div @click="$accessor.transaction.setShowWaiting(true)">Harvest all</div>
              <div v-show="changeRel" class="symbol-relation">
                <div>
                  <svg aria-hidden="true">
                    <use xlink:href="#icon-more"></use>
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
            </Button>
            <div v-if="!dataNFT">
              <svg class="stern-icon set-dot" aria-hidden="true" @click="changeRel = !changeRel">
                <use xlink:href="#icon-more"></use>
              </svg>
            </div>
            <svg v-if="!dataNFT" class="stern-icon" aria-hidden="true" @click="toogleData()">
              <use :xlink:href="isOpen ? '#icon-icon-on' : '#icon-icon-down'"></use>
            </svg>
            <img v-if="dataNFT" style="width: 103px; height: 18px" src="../assets/images/img-Coming_soon.png" alt="" />
          </div>
        </div>
        <div v-if="!dataNFT" class="farming-pool-content-Bot" :class="isOpen ? 'is-open' : ''">
          <div v-for="(item, index) in tableData" :key="index">
            <div>
              <div class="td-title">NFT ID</div>
              <div class="td-text">{{ item.NFTID }}</div>
            </div>
            <div>
              <div class="td-title">Liquidity</div>
              <div class="td-text">{{ item.Liquidity }}</div>
            </div>
            <div>
              <div class="td-title">Price Range</div>
              <div class="td-text">{{ item.PriceRange }}</div>
            </div>
            <div>
              <Button
                :class="item.isStaked == 'Unstake' ? 'un-stake' : ''"
                class="action-btn"
                @click="showNotify('Unstake')"
              >
                <div>{{ item.isStaked }}</div>
              </Button>
            </div>
          </div>
        </div>
      </div> -->
      <!-- <Waiting
        v-show="$accessor.transaction.showWaiting"
        @onClose="$accessor.transaction.setShowWaiting(false)"
      ></Waiting> -->
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import importIcon from '@/utils/import-icon'
import { mapState } from 'vuex'
import { Button } from 'ant-design-vue'
import { QuarrySDK, MinerWrapper, PositionWrapper } from 'test-quarry-sdk'
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
import { fixD } from '@/utils'

Vue.use(Button)
export default Vue.extend({
  components: {
    Button,
    Tooltip
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
      changeNFT: false,
      dataNFT: true,
      isOpen: true,
      changeRel: false,
      tableData: [
        {
          NFTID: '2',
          Liquidity: '$ 856.89',
          PriceRange: '1 - 1.002',
          isStaked: 'Stake'
        },
        {
          NFTID: '1',
          Liquidity: '$ 1,395.27',
          PriceRange: '1 - 1.002',
          isStaked: 'Unstake'
        }
      ],
      nftData: [],
      isEewardRangeTab: -1,
      dataList: [],
      isStaking: false,
      isUnStaking: false,
      isClaiming: false,
      isDisabled: false,
      currentPosition: null as any
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
    'farming.farmingList': {
      handler: 'watchFarmingList',
      immediate: true
    },
    tableData: {
      handler(newValue, oldValue) {
        if (!newValue[0]) {
          this.changeNFT = true
        } else {
          this.changeNFT = false
        }
      },
      deep: true
    },
    isOpen(newValue, oldValue) {
      if (this.isOpen) {
        this.changeRel = false
      }
    },
    changeRel(newValue, oldValue) {
      if (this.isOpen) {
        this.changeRel = false
      }
    },
    'wallet.connected': {
      handler: 'walletWatch',
      immediate: true
    }
  },
  // mounted() {
  // console.log('this.$accessor#####', this.$accessor)
  // this.$accessor.farming.getFarmingList()
  // },
  methods: {
    importIcon,
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
    walletWatch(newValue) {
      // if (newValue) {
      this.$accessor.farming.getFarmingList()
      // }
    },
    // showStakeConfirm(title: string) {
    //   this.stakeTitle = title
    //   this.showStake = true
    // },
    // showNotify(title: string) {
    //   this.tableData = []
    //   this.$notify.success({
    //     message: `${title} Success`,
    //     icon: this.$createElement('img', { class: { 'notify-icon': true }, attrs: { src: '/icon_Copied@2x.png' } }),
    //     description: (h: any) => h('div', [`${title} Success`])
    //   })
    // },
    // updateIsShowTableTr(index: any) {
    //   if (index == 0 && this.isShowTableTr != 0) {
    //     this.isShowTableTr = 0
    //   } else if (index == 0 && this.isShowTableTr == 0) {
    //     this.isShowTableTr = -1
    //   }
    // },
    toogleData(index: number, item: any) {
      this.isOpen = !this.isOpen
    },
    // changeLoading() {
    //   this.$accessor.transaction.setShowWaiting(true)
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
          this.$accessor.transaction.sub({ txid, description, type: 'Stake' })
          this.$accessor.transaction.setShowSubmitted(true)
          const _this = this
          conn.onSignature(txid, function (signatureResult: SignatureResult, context: Context) {
            _this.isStaking = false
            _this.isDisabled = false
            if (!signatureResult.err) {
              // setTimeout(() => {
              _this.$accessor.farming.getFarmingList()

              // }, 1500)
            }
          })
        }
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
          this.$accessor.transaction.sub({ txid, description, type: 'Unstake' })
          this.$accessor.transaction.setShowSubmitted(true)
          const _this = this
          conn.onSignature(txid, function (signatureResult: SignatureResult, context: Context) {
            _this.isUnStaking = false
            _this.isDisabled = false
            if (!signatureResult.err) {
              // setTimeout(() => {
              _this.$accessor.farming.getFarmingList()
              // }, 1500)
            }
          })
        }
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
          this.$accessor.transaction.sub({ txid, description, type: 'Harvest' })
          this.$accessor.transaction.setShowSubmitted(true)
          const _this = this
          conn.onSignature(txid, function (signatureResult: SignatureResult, context: Context) {
            _this.isClaiming = false
            _this.isDisabled = false
            if (!signatureResult.err) {
              _this.$accessor.farming.getFarmingList()
            }
          })
        }
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
</style>
<style lang="less" scoped>
@import '../styles/base.less';
.farming-pool-table-container {
  // width: 1100px;
  // margin-top: 20px;
  height: 100%;
  position: relative;
}
.farming-pool-content {
  width: 1000px;
  margin: auto;
  border-radius: 20px;
  background: #30343c;
  padding: 0 20px 0 20px;
  overflow: hidden;
}
.farming-pool-hide {
  padding: 0 20px 0 20px;
}
.farming-pool-tag {
  position: absolute;
  width: 100px;
  height: 60px;
  top: -10px;
  left: 35px;
}
.farming-pool-tagnone {
  top: 340px;
}
.pool-tags {
  top: 120px;
}
.farming-pool-content-Top {
  display: flex;
  height: 90px;
  > div {
    padding: 20px 20px 20px 0;
  }
  .symbol-info {
    width: 200px;
    display: flex;
    align-items: center;
    .symbol-left {
      display: flex;
      img {
        width: 36px;
        height: 36px;
      }
      .coin-after {
        margin-left: -5px;
      }
      margin-right: 8px;
    }
    .symbol-text {
      display: flex;
      flex-wrap: wrap;
      font-size: 14px;
      color: #fff;
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

  .stern-icon {
    width: 20px;
    height: 20px;
    fill: #b5b8c2;
    cursor: pointer;
    &:hover {
      fill: #fff;
    }
  }
  .set-dot {
    fill: #000 !important;
  }
  .the-more-tooltip {
    .the-more-icon-box {
      background: #fff;
      svg {
        fill: #000;
      }
    }
  }
  .symbol-stern {
    margin: auto 0;
    padding: 20px 0 20px 10px;
    width: 200px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    > div {
      width: 14px;
      height: 14px;
      background: #b5b8c2;
      border-radius: 50%;
      display: flex;
      > svg {
        width: 14px;
        height: 14px;
      }
      &:hover {
        background: #fff;
      }
    }
  }
  .symbol-stern > button {
    position: relative;
  }
}

.symbol-relation {
  // position: absolute;
  width: 140px;
  // left: -20px;
  height: 90px;
  background: rgba(#000, 0.2);
  backdrop-filter: blur(10px);
  z-index: 20;
  padding: 10px;
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
    padding-left: 8px;
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
    &:hover {
      background: #30343c;
    }
  }
}
.td-title {
  font-size: 12px;
  color: #b5b8c2;
  display: flex;
  align-items: center;
  .icon {
    width: 14px;
    height: 14px;
    fill: #b5b8c2;
    margin-left: 4px;
    &:hover {
      fill: #fff;
    }
  }
}
.td-text {
  font-size: 14px;
  font-weight: 800;
  color: #fff;
  margin-top: 10px;
  display: flex;
  // align-items: center;
  img {
    width: 20px;
    height: 20px;
    margin-left: 7px;
  }
  &.nft-address {
    &:hover {
      text-decoration: underline;
    }
  }
}
.action-btn {
  .gradient-btn-large();
  width: 120px;
  line-height: 1;
  height: 40px;
  font-size: 14px;
  font-weight: 100;
}
.btn-wind {
  width: 132px;
}
.un-stake {
  box-sizing: border-box;
  padding: 1px;
  background: #282c33 !important;
  &:hover {
    background: #34383e !important;
  }
}
.farming-pool-content-Bot {
  // height: 200px;
  width: 100%;
  background: #282c33;
  border-radius: 10px;
  padding: 0 20px;
  margin-bottom: 20px;
  > div {
    display: flex;
    justify-content: space-between;
    height: 100px;
    border-bottom: 1px solid rgba(#fff, 0.1);
    padding: 35px 0 25px;
    .td-title {
      height: 12px !important;
    }
  }
  .content-Bot-All {
    display: flex;
    .align-right {
      flex: 1;
      justify-content: flex-end;
      display: flex;
    }
  }
  .content-Bot-All > div {
    width: 280px;
  }
  .content-Bot-All > div:nth-child(1) {
    width: 190px;
  }
}
.is-open {
  display: none !important;
}
.farming-pool-content-Bot div:last-child {
  border: none;
}
</style>