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
              <img class="coin-before" :src="importIcon(`/coins/${item.tokenA.symbol.toLowerCase()}.png`)" alt="" />
              <img class="coin-after" :src="importIcon(`/coins/${item.tokenB.symbol.toLowerCase()}.png`)" alt="" />
            </div>
            <div class="symbol-text">
              <div class="symbol-name">{{ item.name }}</div>
              <!-- <div class="fee-rate">Fee Rate {{ item.fee }}%</div> -->
            </div>
          </div>
          <div style="width: 110px">
            <div class="td-title">
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
            <div class="td-text">
              {{ (tvlDataObjNew[item.positionWrapper] && tvlDataObjNew[item.positionWrapper].aprView) || '--' }}
            </div>
          </div>
          <div style="width: 140px">
            <div class="td-title">Liquidity</div>
            <div class="td-text">
              {{ (tvlDataObjNew[item.positionWrapper] && tvlDataObjNew[item.positionWrapper].tvlView) || '--' }}
            </div>
          </div>
          <div style="width: 180px">
            <div class="td-title">Reward Range</div>
            <div class="td-text">
              {{ item.minPrice }} -
              {{ item.maxPrice }}
            </div>
          </div>
          <div style="width: 130px">
            <div class="td-title">
              Caffeine Earned
              <!-- <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-a-bianzu181"></use>
              </svg> -->
            </div>
            <!-- <div class="td-text">{{ item.miner ? item.miner.PendingRewardView : '--' }}</div> -->
            <div v-if="farming.earningLoading" class="td-text"><Spin size="small" /></div>
            <div v-if="wallet.connected && !farming.earningLoading" class="td-text">
              {{
                (farming.earningObj &&
                  farming.earningObj[item.positionWrapper] &&
                  farming.earningObj[item.positionWrapper].view) ||
                '--'
              }}
            </div>

            <div v-if="!wallet.connected" class="td-text">--</div>
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
              :loading="isClaiming && currentPool.positionWrapper === item.positionWrapper"
              :disabled="
                !farming.earningObj ||
                !farming.earningObj[item.positionWrapper] ||
                !Number(farming.earningObj[item.positionWrapper].value) ||
                isDisabled
              "
              @click="toClaim(item)"
              >Harvest all
            </Button>
            <Tooltip overlay-class-name="the-more-tooltip" placement="top">
              <div class="the-more-icon-box">
                <svg class="stern-icon set-dot" aria-hidden="true">
                  <use xlink:href="#icon-icon-Pack-Deposit"></use>
                </svg>
              </div>

              <template slot="title">
                <div class="symbol-relation">
                  <div @click="gotoLp(item)">Add Liquidity</div>
                  <!-- <div @click="gotoLp(item)">
                    <svg aria-hidden="true">
                      <use xlink:href="#icon-icon-Get-NFT"></use>
                    </svg>
                    Get LP NFT
                  </div> -->
                  <!-- <div>
                    <svg aria-hidden="true">
                      <use xlink:href="#icon-icon-Show-Contract"></use>
                    </svg>
                    Show Contract
                  </div> -->
                </div>
              </template>
            </Tooltip>
            <div class="the-more-icon-box" v-if="!changeNFT && wallet && wallet.connected">
              <svg class="stern-icon" aria-hidden="true" @click="toogleData(index, item)">
                <use :xlink:href="isOpenArr[index] ? '#icon-icon-Pack-up' : '#icon-icon-Pack-on'"></use>
              </svg>
            </div>
            <img
              v-if="changeNFT && wallet && wallet.connected"
              style="width: 103px; height: 18px"
              src="../assets/images/img-Coming_soon.png"
              alt=""
            />
          </div>
        </div>
        <div v-if="!changeNFT" class="farming-pool-content-Bot" :class="isOpenArr[index] ? '' : 'is-close'">
          <div
            v-if="!farming.positionsObj[item.positionWrapper] || farming.positionsObj[item.positionWrapper].length < 1"
            class="no-positions"
          >
            <p>No positions</p>
            <Button class="action-btn" @click="gotoLp(item)">Add Liquidity</Button>
          </div>
          <div
            v-else
            class="content-Bot-All"
            v-for="(pitem, pindex) in farming.positionsObj[item.positionWrapper]"
            :key="pindex"
          >
            <div>
              <div class="td-title">NFT</div>
              <a
                class="td-text nft-address"
                :href="`https://solscan.io/account/${pitem.nftAccountAddress}`"
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
          <div v-if="farming.positionsLoadingObj[item.positionWrapper]" class="position-loading"><Spin /></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import importIcon from '@/utils/import-icon'
import { mapState } from 'vuex'
import { Button } from 'ant-design-vue'
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
import { makeSDK, getTokenAccountsByOwnerAndMint, calculateWrapAmount } from '@/contract/farming'
import { Token, TokenAmount } from '@saberhq/token-utils'
import { Tooltip, Spin } from 'ant-design-vue'
import { fixD, addCommom } from '@/utils'

Vue.use(Button)
export default Vue.extend({
  components: {
    Button,
    Tooltip,
    Spin
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
      currentPosition: null as any,
      currentPool: null as any,
      tvlDataObjNew: {} as any,
      isOpenArr: {
        // 0: false,
        // 1: false,
        // 2: false,
        // 3: false,
        // 4: false,
        // 5: false
      } as any
    }
  },
  computed: {
    ...mapState(['wallet', 'transaction', 'url', 'farming', 'liquidity'])
  },
  watch: {
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
    tvlData: {
      handler: 'tvlDataWatch',
      immediate: true
    },
    'farming.positionsObj'(newVal) {
      console.log('positionsObj####newVal###', newVal)
    },
    'farming.earningObj'(newVal) {
      console.log('farming.earningObj#####', newVal)
    }
  },
  methods: {
    importIcon,
    tvlDataWatch(newVal) {
      if (newVal) {
        // const result: any = {}
        // for (let key in newVal) {
        //   const item = newVal[key]
        //   const apr = item.apr * 100
        //   const tvl = item.tvl
        //   result[key] = {
        //     ...item,
        //     aprView: apr > 10000 ? Infinity : `${fixD(apr, 2)}%`,
        //     tvlView: tvl ? `$ ${addCommom(tvl, 2)}` : '--'
        //   }
        // }
        this.tvlDataObjNew = newVal
      }
    },
    // getTvl(item: any) {
    //   let apr
    //   if (item && this.tvlData && this.tvlData[item.positionWrapper]) {
    //     apr = this.tvlData[item.positionWrapper].apr * 100
    //     if (apr > 10000) {
    //       apr = Infinity
    //     } else {
    //       apr = `${apr}%`
    //     }
    //   } else {
    //     apr = '--'
    //   }
    //   return apr
    // },
    // getLiquidity(item: any) {
    //   let tvl
    //   if (item && this.tvlData && this.tvlData[item.positionWrapper]) {
    //     tvl = this.tvlData[item.positionWrapper].tvl
    //     if (tvl) {
    //       tvl = '$ ' + fixD(tvl, 2)
    //     }
    //   } else {
    //     tvl = '--'
    //   }
    //   return tvl
    // },
    gotoLp(item: any) {
      if (item) {
        console.log('gotoLp###item####', item)
        let tokenA = item.tokenA.symbol
        if (item.tokenA.symbol === 'WSOL') {
          tokenA = 'SOL'
        }
        let tokenB = item.tokenB.symbol
        if (item.tokenB.symbol === 'WSOL') {
          tokenB = 'SOL'
        }
        this.$router.push(`/pool?from=${tokenA}&to=${tokenB}`)
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
      this.dataList = list
    },
    toogleData(index: number, item: any) {
      const obj = JSON.parse(JSON.stringify(this.isOpenArr))
      this.isOpenArr = {
        ...obj,
        [index]: !obj[index]
      }
      if (!obj[index]) {
        console.log('positionsObj####setPositionsObj######obj[index]', obj[index])
        this.$accessor.farming.getPositionObj({ tvlData: this.tvlData, farmingInfo: item, rates: this.liquidity.rates })
      }
    },
    async toStake(poolInfo: any, positionInfo: any) {
      this.currentPosition = positionInfo
      this.isStaking = true
      this.isDisabled = true
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
        this.$accessor.transaction.setShowWaiting(false)
        const receipt: any = await res.tx.confirm()
        if (receipt && receipt.signature) {
          const txid = receipt.signature
          const description = `Stake ${poolInfo.name} NFT`
          this.$accessor.transaction.setShowSubmitted(true)
          const _this = this
          this.$accessor.transaction.sub({
            txid,
            description,
            type: 'Stake',
            successCallback: () => {
              _this.isStaking = false
              _this.isDisabled = false
              _this.$emit('refreshData')
              _this.$accessor.farming.getPositionObj({
                tvlData: _this.tvlData,
                farmingInfo: poolInfo,
                rates: _this.liquidity.rates
              })
            },
            errorCallback: () => {
              _this.isStaking = false
              _this.isDisabled = false
            }
          })

          // conn.onSignature(txid, function (signatureResult: SignatureResult, context: Context) {
          //   _this.isStaking = false
          //   _this.isDisabled = false
          //   if (!signatureResult.err) {
          //     // setTimeout(() => {
          //     // _this.$accessor.farming.getFarmingList()
          //     // _this.$accessor.farming.getEarningsObj()

          //     // }, 1500)
          //     _this.$emit('refreshData')
          //     _this.$accessor.farming.getPositionObj({
          //       tvlData: _this.tvlData,
          //       farmingInfo: poolInfo,
          //       rates: _this.liquidity.rates
          //     })
          //   }
          // })
        }
      } catch (err) {
        this.$accessor.transaction.setShowWaiting(false)
        this.isStaking = false
        this.isDisabled = false
        this.$notify.error({
          key: 'StakeErr',
          message: 'Transaction failed',
          description: ''
        })
      }
    },
    async toUnStake(poolInfo: any, positionInfo: any) {
      this.currentPosition = positionInfo
      this.isUnStaking = true
      this.isDisabled = true
      const wrapper = new PublicKey(poolInfo.positionWrapper)
      const nftMint = new PublicKey(positionInfo.nftMintAddress)
      const rewarderKey = new PublicKey(poolInfo.rewarderKey)
      const isClaim = false

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
          this.$accessor.transaction.setShowSubmitted(true)
          const _this = this
          this.$accessor.transaction.sub({
            txid,
            description,
            type: 'Unstake',
            successCallback: () => {
              _this.isUnStaking = false
              _this.isDisabled = false
              _this.$emit('refreshData')
              _this.$accessor.farming.getPositionObj({
                tvlData: _this.tvlData,
                farmingInfo: poolInfo,
                rates: _this.liquidity.rates
              })
            },
            errorCallback: () => {
              _this.isUnStaking = false
              _this.isDisabled = false
            }
          })

          // conn.onSignature(txid, function (signatureResult: SignatureResult, context: Context) {
          //   _this.isUnStaking = false
          //   _this.isDisabled = false
          //   if (!signatureResult.err) {
          //     // setTimeout(() => {
          //     // _this.$accessor.farming.getFarmingList()
          //     // _this.$accessor.farming.getEarningsObj()
          //     // }, 1500)
          //     _this.$emit('refreshData')
          //     _this.$accessor.farming.getPositionObj({
          //       tvlData: _this.tvlData,
          //       farmingInfo: poolInfo,
          //       rates: _this.liquidity.rates
          //     })
          //   }
          // })
        }
      } catch (err) {
        this.$accessor.transaction.setShowWaiting(false)
        this.isUnStaking = false
        this.isDisabled = false
        this.$notify.error({
          key: 'UnStakeErr',
          message: 'Transaction failed',
          description: ''
        })
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
      this.currentPool = poolInfo
      this.isClaiming = true
      this.isDisabled = true
      const conn = this.$web3
      const rewarderKey = new PublicKey(poolInfo.rewarderKey)
      const mint = new PublicKey(poolInfo.positionWrapperWrapMint)

      this.$accessor.transaction.setTransactionDesc('Harvest all rewards')
      this.$accessor.transaction.setShowWaiting(true)

      try {
        const miner = await this.minerWrapper(rewarderKey, mint)
        console.log('toClaim###miner###', miner)
        const tx = await miner.claim()
        console.log('toClaim###tx###', tx)

        const receipt = await tx.confirm({ maxRetries: 10 })
        this.$accessor.transaction.setShowWaiting(false)
        console.log('toClaim###receipt###', receipt)

        if (receipt && receipt.signature) {
          const txid = receipt.signature
          const description = `Harvest all rewards`
          const _this = this
          this.$accessor.transaction.setShowSubmitted(true)
          this.$accessor.transaction.sub({
            txid,
            description,
            type: 'Harvest',
            successCallback: () => {
              _this.isClaiming = false
              _this.isDisabled = false
              _this.$emit('refreshData')
              _this.$accessor.farming.getPositionObj({
                tvlData: _this.tvlData,
                farmingInfo: poolInfo,
                rates: _this.liquidity.rates
              })
            },
            errorCallback: () => {
              _this.isClaiming = false
              _this.isDisabled = false
            }
          })

          // const _this = this
          // conn.onSignature(txid, function (signatureResult: SignatureResult, context: Context) {
          //   _this.isClaiming = false
          //   _this.isDisabled = false
          //   if (!signatureResult.err) {
          //     // _this.$accessor.farming.getFarmingList()
          //     // _this.$accessor.farming.getEarningsObj()
          //     _this.$emit('refreshData')
          //     _this.$accessor.farming.getPositionObj({
          //       tvlData: _this.tvlData,
          //       farmingInfo: poolInfo,
          //       rates: _this.liquidity.rates
          //     })
          //   }
          // })
        }
      } catch (err) {
        this.$accessor.transaction.setShowWaiting(false)
        this.isClaiming = false
        this.isDisabled = false
        this.$notify.error({
          key: 'HarvestErr',
          message: 'Transaction failed',
          description: ''
        })
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
.td-text {
  .ant-spin-dot-item {
    background-color: rgba(255, 255, 255, 0.5);
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
  margin: 0px auto;
  margin-top: 20px;
  border-radius: 20px;
  background: #30343c;
  padding: 0 20px 0 20px;
  overflow: hidden;
  &:first-child {
    margin-top: 0px;
  }
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
  .the-more-icon-box {
    width: 20px;
    height: 20px;
    border: 1px solid #b5b8c2 !important;
    border-radius: 50%;
    display: flex;
    > svg {
      width: 18px;
      height: 18px;
    }
    &:hover {
      border: 1px solid #fff !important;
    }
  }
  .symbol-stern {
    margin: auto 0;
    padding: 20px 0 20px 10px;
    width: 200px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    // > div {
    //   width: 20px;
    //   height: 20px;
    //   border: 1px solid #b5b8c2;
    //   border-radius: 50%;
    //   display: flex;
    //   > svg {
    //     width: 18px;
    //     height: 18px;
    //   }
    //   &:hover {
    //     border: 1px solid #fff !important;
    //   }
    // }
  }
  .symbol-stern > button {
    position: relative;
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
    cursor: pointer;
    &:hover {
      fill: #fff;
    }
  }
  > div {
    display: flex;
    align-items: center;
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
  position: relative;
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
  .position-loading {
    height: auto !important;
    min-height: 100px;
    position: absolute;
    left: 0px;
    right: 0px;
    top: 0px;
    bottom: 0px;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
  }
}
.is-close {
  display: none !important;
}
.farming-pool-content-Bot div:last-child {
  border: none;
}

.no-positions {
  height: 150px !important;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  button {
    height: 40px;
    width: 150px;
  }
}
</style>