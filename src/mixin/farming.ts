import Vue from 'vue'
import importIcon from '@/utils/import-icon'
import { mapState } from 'vuex'
import { Button } from 'ant-design-vue'
import { QuarrySDK, MinerWrapper, PositionWrapper } from '@cremafinance/crema-farming'
import { Provider as AnchorProvider, setProvider, Wallet as AnchorWallet } from '@project-serum/anchor'
import { BroadcastOptions, SignerWallet, SolanaProvider } from '@saberhq/solana-contrib'
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
    stakeSuccess: {
      type: Boolean,
      default: false
    },
    stakeFailed: {
      type: Boolean,
      default: false
    },
    isNewStaking: {
      type: Boolean,
      default: false
    }
    // searchKey: {
    //   type: String,
    //   default: ''
    // },
    // tvlData: {
    //   type: Object,
    //   default: () => {
    //     return {}
    //   }
    // }
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
      } as any,
      showUnstakeTips: false,
      newPoolInfo: null as any,
      unStakeSuccess: false,
      unStakeFailed: false,
      newPoolObj: null as any
    }
  },
  computed: {
    ...mapState(['wallet', 'transaction', 'url', 'farming', 'liquidity', 'farmingv2'])
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
    'farmingv2.farmingList': {
      handler: 'farmingv2ListWatch',
      immediate: true
    }
  },
  methods: {
    importIcon,
    farmingv2ListWatch(newVal) {
      const result: any = {}
      if (newVal) {
        newVal.forEach(item => {
          result[item.name] = item
        })
      }
      this.newPoolObj = result
    },
    closeUnstakeTips() {
      this.showUnstakeTips = false
    },
    openUnstake(poolInfo: any, positionInfo: any) {
      this.currentPool = poolInfo
      this.currentPosition = positionInfo
      const haveNewPool = this.farmingv2.farmingList.filter(item => item.name.toUpperCase() === poolInfo.name.toUpperCase())
      if (poolInfo.isEnded && haveNewPool && haveNewPool.length > 0) {
        this.newPoolInfo = haveNewPool[0]
        this.showUnstakeTips = true
      } else {
        this.toUnStake(poolInfo, positionInfo)
      }
    },
    toNewStake() {
      // this.closeUnstakeTips()
      console.log('toNewStake####this.newPoolInfo####', this.newPoolInfo)
      console.log('toNewStake####this.currentPosition####', this.currentPosition)
      this.$emit('newStake', this.newPoolInfo, this.currentPosition)
    },
    gotoUnstake() {
      this.toUnStake(this.currentPool, this.currentPosition)
    },
    tvlDataWatch(newVal) {
      if (newVal) {
        this.tvlDataObjNew = newVal
      }
    },
    gotoLp(item: any) {
      if (item) {
        console.log('gotoLp###item####', item)
        let tokenA = item.tokenA.symbol
        if (item.tokenA.symbol.toUpperCase() === 'WSOL') {
          tokenA = 'SOL'
        }
        let tokenB = item.tokenB.symbol
        if (item.tokenB.symbol.toUpperCase() === 'WSOL') {
          tokenB = 'SOL'
        }
        this.$router.push(`/deposit?from=${tokenA}&to=${tokenB}`)
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
        this.$accessor.farming.getPositionObj({ tvlData: this.tvlData, farmingInfo: item, rates: this.liquidity.rates })
      }
    },
    async toStake(poolInfo: any, positionInfo: any) {
      this.currentPool = poolInfo
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

      let txid = ''

      try {
        const res = await sdk.positionWrapper.mintAndStake({
          wrapper: wrapperInfo,
          nftMint,
          rewarderKey
        })

        // const receipt: any = await res.tx.confirm()

        const opt: BroadcastOptions = {
          skipPreflight: true,
          commitment: 'confirmed',
          preflightCommitment: 'confirmed',
          maxRetries: 30,
          printLogs: true
        }

        const receipt: any = await res.tx.send(opt)
        this.$accessor.transaction.setShowWaiting(false)
        console.log('whattest####', receipt)

        // const receipt = await (
        //   await res.tx.send(opt)
        // ).wait({
        //   commitment: 'confirmed',
        //   useWebsocket: true,
        //   retries: 30
        // })

        if (receipt && receipt.signature) {
          txid = receipt.signature
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
              // _this.$emit('refreshData')
              _this.toRefresh()
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
        }
        const whatWait = await receipt.wait({
          commitment: 'confirmed',
          useWebsocket: true,
          retries: 30
        })

        console.log('whatWait####', whatWait)
      } catch (err) {
        console.log('stake##err###', err)
        this.$accessor.transaction.setShowWaiting(false)
        this.$accessor.transaction.setShowSubmitted(false)
        this.isStaking = false
        this.isDisabled = false
        this.$notify.close(txid + 'loading')
        this.$notify.error({
          key: 'StakeErr',
          message: 'Transaction failed',
          description: ''
        })
      }
    },
    async toUnStake(poolInfo: any, positionInfo: any) {
      this.unStakeSuccess = false
      this.unStakeFailed = false

      this.currentPool = poolInfo
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
      // const tokenAccounts = await getTokenAccountsByOwnerAndMint(
      //   sdk.provider.connection,
      //   sdk.provider.wallet.publicKey,
      //   nftMint
      // )
      // if (tokenAccounts.length <= 0) {
      //   console.log('The nft token account not foundkj')
      // }
      // invariant(tokenAccounts[0] !== undefined, 'The nft token accuont is undefined')

      this.$accessor.transaction.setTransactionDesc(`Unstake ${poolInfo.name} NFT`)
      this.$accessor.transaction.setShowWaiting(true)

      // Get wrapper info
      const wrapperInfo = await PositionWrapper.fetchPositionWrapper(wrapper, conn)
      invariant(wrapperInfo !== null, 'wrapper not found')

      let txid = ''

      try {
        console.log('toUnstake###rewarderKey###', rewarderKey.toString())
        const tx = await sdk.positionWrapper.unstakeAndBurn({
          wrapper: wrapperInfo,
          nftMint,
          // nftAccount: tokenAccounts[0].address,
          rewarderKey,
          isClaim
        })

        const opt: BroadcastOptions = {
          skipPreflight: true,
          commitment: 'confirmed',
          preflightCommitment: 'confirmed',
          maxRetries: 30,
          printLogs: true
        }
        // const receipt = await tx.confirm()
        const receipt: any = await tx.send(opt)
        console.log('whattest####', receipt)

        this.$accessor.transaction.setShowWaiting(false)
        if (receipt && receipt.signature) {
          txid = receipt.signature
          const description = `Unstake ${poolInfo.name} NFT`
          this.$accessor.transaction.setShowSubmitted(true)
          const _this = this
          this.$accessor.transaction.sub({
            txid,
            description,
            type: 'Unstake',
            successCallback: () => {
              _this.unStakeSuccess = true
              _this.isUnStaking = false
              _this.isDisabled = false
              // _this.$emit('refreshData')
              _this.toRefresh()
              _this.$accessor.farming.getPositionObj({
                tvlData: _this.tvlData,
                farmingInfo: poolInfo,
                rates: _this.liquidity.rates
              })
            },
            errorCallback: () => {
              _this.unStakeFailed = true
              _this.isUnStaking = false
              _this.isDisabled = false
            }
          })
        }

        const whatWait = await receipt.wait({
          commitment: 'confirmed',
          useWebsocket: true,
          retries: 30
        })

        console.log('whatWait####', whatWait)
      } catch (err) {
        console.log('toUnstake###err####', err)
        this.unStakeFailed = true

        this.$accessor.transaction.setShowWaiting(false)
        this.$accessor.transaction.setShowSubmitted(false)
        this.isUnStaking = false
        this.isDisabled = false
        this.$notify.close(txid + 'loading')
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

      let txid = ''
      try {
        const miner = await this.minerWrapper(rewarderKey, mint)
        const tx = await miner.claim()

        // const receipt = await tx.confirm()

        const opt: BroadcastOptions = {
          skipPreflight: true,
          commitment: 'confirmed',
          preflightCommitment: 'confirmed',
          maxRetries: 30,
          printLogs: true
        }
        // const receipt = await tx.confirm()
        const receipt: any = await tx.send(opt)
        console.log('whattest####', receipt)
        this.$accessor.transaction.setShowWaiting(false)

        if (receipt && receipt.signature) {
          txid = receipt.signature
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
              // _this.$emit('refreshData')
              _this.toRefresh()
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

          const whatWait = await receipt.wait({
            commitment: 'confirmed',
            useWebsocket: true,
            retries: 30
          })

          console.log('whatWait####', whatWait)

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
        console.log('toClaim###err####', err)
        this.$accessor.transaction.setShowWaiting(false)
        this.$accessor.transaction.setShowSubmitted(false)
        this.isClaiming = false
        this.isDisabled = false
        this.$notify.close(txid + 'loading')
        this.$notify.error({
          key: 'HarvestErr',
          message: 'Transaction failed',
          description: ''
        })
      }
    }
  }
})