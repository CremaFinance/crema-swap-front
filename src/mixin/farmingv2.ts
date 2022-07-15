import Vue from 'vue'
import importIcon from '@/utils/import-icon'
import { mapState } from 'vuex'
import { Button } from 'ant-design-vue'
import {
  QuarrySDK,
  MinerWrapper,
  PositionWrapper,
  PositionWrapperErrors,
  QUARRY_CODERS,
  QuarryData,
  findMinerAddress,
  findQuarryAddress,
  QUARRY_ADDRESSES,
  RedeemTokenArgs
} from '@cremafinance/crema-farming'
import { ProgramError, Provider as AnchorProvider, setProvider, Wallet as AnchorWallet } from '@project-serum/anchor'
import {
  BroadcastOptions,
  SignerWallet,
  SolanaProvider,
  TransactionEnvelope,
  TransactionReceipt
} from '@saberhq/solana-contrib'
import {
  clusterApiUrl,
  Connection,
  Keypair,
  PublicKey,
  AccountInfo as BaseAccountInfo,
  Signer,
  TokenAccountsFilter,
  Context,
  SignatureResult,
  TransactionInstruction,
  SystemProgram
} from '@solana/web3.js'
import type { AccountInfo } from '@solana/spl-token'
import { AccountLayout, TOKEN_PROGRAM_ID, u64 } from '@solana/spl-token'
import invariant from 'tiny-invariant'
import { makeSDK, getTokenAccountsByOwnerAndMint } from '@/contract/farming'
import { Token, TokenAmount, getOrCreateATA, getATAAddress } from '@saberhq/token-utils'
import { Tooltip, Spin } from 'ant-design-vue'
import { fixD, addCommom, decimalFormat } from '@/utils'
import { fetchMergePools, calculateWrapAmount, fetchMergeMiner } from '@/contract/farmingv2'
import { deposit } from '@/utils/stake'
import { publicKey } from '@project-serum/anchor/dist/cjs/utils'
import { tick2UiPrice } from '@cremafinance/crema-sdk'
import Decimal from 'decimal.js'
import { program } from '@project-serum/anchor/dist/cjs/spl/token'
import BN from 'bn.js';

Vue.use(Button)
export default Vue.extend({
  components: {
    Button,
    Tooltip,
    Spin
  },
  props: {
    searchKey: {
      type: String,
      default: ''
    },
    currentType: {
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
      dataOriginList: [],
      dataList: [],
      isStaking: false,
      isUnStaking: false,
      isClaiming: false,
      isDisabled: false,
      currentPosition: null as any,
      currentPool: null as any,
      aprAndTvlObj: {} as any,
      isOpenArr: {
        // 0: false,
        // 1: false,
        // 2: false,
        // 3: false,
        // 4: false,
        // 5: false
      } as any,
      // new farming
      rewardTokenObj: {
        // CRM8JcGQstDainWZKr3PzhioCyNNpNKNq9P6ayGe7aok: {
        //   name: 'CRM',
        //   decimal: 9
        // },
        // BTCqxfibinZiNkfgxSRZp2sXPT7ZK6JgDU61nsg7QRmA: {
        //   name: 'BTC',
        //   decimal: 9
        // },
        // RTHe7GaZaZXopPniociRPAbAiFcg8h2r4zAgmcJm7yM: {
        //   name: 'RTH',
        //   decimal: 9
        // }
        CRMaDAzKCWYbhUfsKYA8448vaA1qUzCETd7gNBDzQ1ks: {
          name: 'CRM',
          decimal: 9
        },
        rmdfxskErRXRvMjiCoSiBQNp1wWeBQe19YeHZGBe3jD: {
          name: 'MNDE',
          decimal: '9'
        },
        RLDo72wLsjrzRWdkz3DcgsQj4p2HeZKioydUyjyatYi: {
          name: 'LDO',
          decimal: '8'
        },
        CHdG3BVWrADKT4Hh6jcLpvfQfAiSmnLLqx7X8q5cnR2D: {
          name: 'HDG',
          decimal: '9'
        }


      },
      rewardRange: {
        'DM3hoNvAHSZxqAT1q8NYZJfC5NU3PY3V96nqQwSVYiTb': {
          name: 'USDT-USDC',
          rewardRange: '0.999 - 1.0005'
        },
        'DqoE4gtukSEzFDdZ4ymeay1tBS6h8Z7BYCSmFWHyuDgP': {
          name: 'mSOL-SOL',
          rewardRange: '1.04 - 1.08'
        },
        '8x5Rjz61rh4N5CdFHGQQNGK2vAND9Lt8SXCBshye8kU4': {
          name: 'stSOL-SOL',
          rewardRange: '1.03 - 1.07'
        },
        'Fg8NYsi6zv7Yhtww7mQqQ8wwpAGQDUxMTccKtxp1PicM': {
          name: 'USDH-USDC',
          rewardRange: '0.998 - 1.008'
        },
        '8a5StzsVKvf9Lwv7CPN82Bcbnaws8gUiGp5LzVSV2QRY': {
          name: 'USH-USDC',
          rewardRange: '0.99 - 1.05'
        }
      },
      stakeSuccess: false,
      stakeFailed: false
    }
  },
  computed: {
    ...mapState(['wallet', 'transaction', 'url', 'farming', 'liquidity', 'farmingv2'])
  },
  watch: {
    'farmingv2.farmingList': {
      handler: 'watchFarmingV2List',
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
    'farmingv2.aprAndTvlObj': {
      handler: 'watchAprAndTvlObj',
      immediate: true
    },
    searchKey(newVal) {
      // let result: any = []
      // if (newVal) {
      //   result = this.dataOriginList.filter((item) => {
      //     return item.name.toLowerCase().includes(newVal.toLowerCase())
      //   })
      // } else {
      //   result = this.dataOriginList
      // }
      // this.dataList = result
      this.filterDataList(newVal, this.currentType)
    },
    currentType(newVal) {
      console.log('farmingv2##currentType##watch###', newVal)
      this.filterDataList(this.searchKey, newVal)
    }
  },
  methods: {
    importIcon,
    watchAprAndTvlObj(newVal) {
      this.aprAndTvlObj = newVal
    },
    // data processing
    filterDataList(search, type, list) {
      const originList = list || this.dataOriginList
      let result: any = []
      if (type === 'Ended') {
        this.dataList = result
        return
      }
      // if (search && type === '') {
      result = originList.filter((item: any) => {
        // return item.name.toLowerCase().includes(search.toLowerCase()) &&
        console.log('filterDataList####item###', item)
        let searchFlag = true
        let typeFlag = true
        if (search) {
          searchFlag = item.name.toLowerCase().includes(search.toLowerCase())
        }
        if (type !== 'Live') {
          typeFlag = item.quarries && item.quarries.length > 1
        }
        return searchFlag && typeFlag
      })
      this.dataList = result
      // }
    },
    // get farming type position icon
    getIcon(swapKey: string, type: string) {
      if (this.liquidity.coinPairConfigObj && this.liquidity.coinPairConfigObj[swapKey]) {
        const coinPairItem = this.liquidity.coinPairConfigObj[swapKey]
        if (type === 'a') {
          if (coinPairItem.token_a.icon) {
            return coinPairItem.token_a.icon
          } else {
            return importIcon(`/coins/${coinPairItem.token_a.symbol.toLowerCase()}.png`)
          }
        } else {
          if (coinPairItem.token_b.icon) {
            return coinPairItem.token_b.icon
          } else {
            return importIcon(`/coins/${coinPairItem.token_b.symbol.toLowerCase()}.png`)
          }
        }
      }
      return require('../assets/icons/unknown.png')
    },
    getRewardRange(swapKey: string) {
      if (
        this.liquidity.coinPairConfigObj &&
        this.liquidity.coinPairConfigObj[swapKey] &&
        this.farmingv2.wrappersObj &&
        this.farmingv2.wrappersObj[swapKey]
      ) {
        const coinPairItem = this.liquidity.coinPairConfigObj[swapKey]
        const tokenA = coinPairItem.token_a
        const tokenB = coinPairItem.token_b
        const wrapperItem = this.farmingv2.wrappersObj[swapKey]
        const lowerPrice =
          wrapperItem.etrMin !== -443632
            ? decimalFormat(tick2UiPrice(wrapperItem.etrMin, tokenA.decimal, tokenB.decimal).toString(), 6)
            : '0'
        const upperPrice =
          wrapperItem.etrMax !== 443632
            ? decimalFormat(tick2UiPrice(wrapperItem.etrMax, tokenA.decimal, tokenB.decimal).toString(), 6)
            : '∞'
        return `${lowerPrice}-${upperPrice}`
      }
      return '--'
    },
    getRewardNumber(item, qitem: any, rewardsObj: any) {
      const mpKey = item['merge_pool'].address
      if (rewardsObj && rewardsObj[mpKey] && rewardsObj[mpKey][qitem.reward_token_mint]) {
        const PendingReward = rewardsObj[mpKey][qitem.reward_token_mint]
        if (PendingReward && PendingReward !== '0') {
          const decimal = this.rewardTokenObj[qitem.reward_token_mint].decimal || 9
          // const decimal = 6

          const num = new Decimal(PendingReward).div(Math.pow(10, decimal)).toString()
          return Number(num) < 0 ? '0' : addCommom(num, 6)
        }
      }
      return '0'
    },
    gotoLp(item: any) {
      const info = this.liquidity.coinPairConfigObj && this.liquidity.coinPairConfigObj[item.swap_key]
      let tokenA = ''
      let tokenB = ''
      if (info) {
        console.log('gotoLp###info####', info)
        tokenA = info.token_a.symbol
        if (info.token_a.symbol.toUpperCase() === 'WSOL') {
          tokenA = 'SOL'
        }
        tokenB = info.token_b.symbol
        if (info.token_b.symbol.toUpperCase() === 'WSOL') {
          tokenB = 'SOL'
        }
      } else {
        const arr = item.name.split('-')
        tokenA = arr[0]
        tokenB = arr[1]
      }
      this.$router.push(`/deposit?from=${tokenA}&to=${tokenB}`)
    },
    processNftAddress(address: string) {
      if (address) {
        const result = `${address.substr(0, 4)}...${address.substr(address.length - 4, 4)}`
        return result
      }
      return ''
    },
    watchFarmingV2List(list: any) {
      console.log('farmingv2###watchFarmingV2List###', list)
      this.dataOriginList = list
      // if (this.searchKey) {
      //   this.dataList = list.filter((item) => item.name.toLowerCase().includes(this.searchKey.toLowerCase()))
      // } else {
      //   this.dataList = list
      // }
      this.filterDataList(this.searchKey, this.currentType, list)
    },
    toogleData(index: number, item: any) {
      const obj = JSON.parse(JSON.stringify(this.isOpenArr))
      this.isOpenArr = {
        ...obj,
        [index]: !obj[index]
      }
      if (!obj[index]) {
        console.log('toogleData###item####', item)
        this.$accessor.farmingv2.getPositionObj({
          tvlData: this.tvlData,
          farmingInfo: item,
          rates: this.liquidity.rates,
          coinPairConfigObj: this.liquidity.coinPairConfigObj
          // wrappersObj: this.farmingv2.wrappersObj
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
    async toInitMinerV2(mpKey, rewarder, replicaMint, mmKey) {
      const wallet = (this as any).$wallet
      const conn = this.$web3
      const sdk = makeSDK(conn, wallet)
      const programe: any = sdk.mergeMine.programs.MergeMine
      const [quarry] = await findQuarryAddress(rewarder, replicaMint)
      const [miner] = await findMinerAddress(quarry, mmKey)

      const txEnv = new TransactionEnvelope(sdk.provider, [])

      if (!(await sdk.provider.getAccountInfo(miner))) {
        const minerReplicaMintTokenAccount = await getOrCreateATA({
          provider: sdk.provider,
          mint: replicaMint,
          owner: miner
        })
        txEnv.instructions.unshift(
          programe.instruction.initMinerV2({
            accounts: {
              pool: mpKey,
              mm: mmKey,
              miner,
              quarry,
              rewarder,
              tokenMint: replicaMint,
              minerVault: minerReplicaMintTokenAccount.address,
              payer: sdk.provider.wallet.publicKey,
              mineProgram: QUARRY_ADDRESSES.Mine,
              systemProgram: SystemProgram.programId,
              tokenProgram: TOKEN_PROGRAM_ID
            }
          })
        )
        if (minerReplicaMintTokenAccount.instruction) {
          txEnv.instructions.unshift(minerReplicaMintTokenAccount.instruction)
        }

        console.log('toInitMinerV2####txEnv###', txEnv)

        return txEnv
      } else {
        console.error('HERE')
      }
    },
    async confirmTx(tx: TransactionEnvelope): Promise<TransactionReceipt> {
      const opt: BroadcastOptions = {
        skipPreflight: true,
        commitment: 'confirmed',
        preflightCommitment: 'confirmed',
        maxRetries: 30,
        printLogs: true
      }

      const pendingTx = await tx.send(opt)
      console.log('%s  confirming...', pendingTx.signature.toString())

      return await pendingTx.wait({
        commitment: 'confirmed',
        useWebsocket: true,
        retries: 30
      })
    },
    // 多挖stake调试
    async toStake(poolInfo: any, positionInfo: any) {
      this.stakeSuccess = false
      this.stakeFailed = false
      console.log('toStake###poolInfo###', poolInfo)
      console.log('toStake###positionInfo###', positionInfo)
      this.currentPosition = positionInfo
      const positionWrapper = poolInfo.positionWrapper
      const mergePool = poolInfo['merge_pool'].address
      const quarries = poolInfo.quarries

      const nftMint = positionInfo.nftTokenId || positionInfo.nftMint

      const wallet = (this as any).$wallet
      const conn = this.$web3
      const sdk = makeSDK(conn, wallet)

      this.isStaking = true
      this.isDisabled = true
      this.$accessor.transaction.setTransactionDesc(`Stake ${poolInfo.name} NFT`)
      this.$accessor.transaction.setShowWaiting(true)

      let txid = ''

      try {
        // 为防止transaction too large将创建账号和三挖时InitMinerV2放到第一个TX先执行
        const wrapperInfo = await PositionWrapper.fetchPositionWrapper(
          new PublicKey(positionWrapper), // wrapper
          sdk.provider.connection
        )
        invariant(wrapperInfo !== null, 'wrapper not found')

        const userSwapPosition = await PositionWrapper.fetchSwapPositionByOwner(
          wrapperInfo.swapKey,
          nftMint,
          sdk.provider.wallet.publicKey,
          sdk.provider.connection
        )
        invariant(userSwapPosition !== null, "Can't find the swap position you own")

        // let txEnvRes: any = null

        // const { address: nftVault, instruction: nftVaultAtaInstruction } = await getOrCreateATA({
        //   provider: sdk.provider,
        //   mint: userSwapPosition.nftTokenId,
        //   owner: wrapperInfo.address
        // })

        // console.log('toStake####nftVaultAtaInstruction####', nftVaultAtaInstruction)

        // if (nftVaultAtaInstruction) {
        //   txEnvRes = [nftVaultAtaInstruction]
        // }

        const mp = sdk.mergeMine.loadMP({ mpKey: new PublicKey(mergePool) })
        const mmKey = await sdk.mergeMine.findMergeMinerAddress({
          owner: sdk.provider.wallet.publicKey,
          pool: new PublicKey(mergePool)
        })
        console.log('toStake###mmKey###', mmKey.toString())

        // 3挖时候
        // if (quarries.length > 2) {
        //   for (let i = 0; i < quarries.length; i++) {
        //     const item: any = quarries[i]
        //     // is replicaToken
        //     if (!item.stake_token_mint) {
        //       const replicaRewarder = item.rewarder
        //       const replicaMint = poolInfo['merge_pool']['replica_mint']
        //       const txEnv = await this.toInitMinerV2(
        //         new PublicKey(mergePool),
        //         new PublicKey(replicaRewarder),
        //         new PublicKey(replicaMint),
        //         mmKey
        //       )
        //       console.log('toStake###txEnv是什么###', txEnv)
        //       if (txEnvRes && txEnv) {
        //         if (txEnvRes.instructions) {
        //           txEnvRes.instructions.push(...txEnv.instructions)
        //         } else {
        //           txEnv.instructions.unshift(...txEnvRes)
        //           txEnvRes = txEnv
        //         }
        //       } else {
        //         txEnvRes = txEnv || null
        //       }
        //     } else {
        //       const primaryRewarder = item.rewarder
        //       const primaryMint = poolInfo['merge_pool']['primary_mint']
        //       const mmAccount = await sdk.provider.getAccountInfo(mmKey)
        //       const { address: mmPrimaryTokenAccount, instruction: mmATAIx } = await getOrCreateATA({
        //         provider: sdk.provider,
        //         mint: new PublicKey(primaryMint),
        //         owner: mmKey
        //       })

        //       const primaryInstructions: TransactionInstruction[] = []
        //       // Initialize mergeMiner if it does not exist
        //       if (!mmAccount) {
        //         const programe: any = sdk.mergeMine.programs.MergeMine
        //         primaryInstructions.push(
        //           programe.instruction.initMergeMinerV2({
        //             accounts: {
        //               pool: new PublicKey(mergePool),
        //               owner: sdk.provider.wallet.publicKey,
        //               mm: mmKey,
        //               payer: sdk.provider.wallet.publicKey,
        //               systemProgram: SystemProgram.programId
        //             }
        //           })
        //         )

        //         if (mmATAIx) {
        //           primaryInstructions.push(mmATAIx)
        //         }

        //         const { ixs: initPrimaryIxs } = await sdk.mergeMine.getOrCreatePrimary({
        //           mint: new PublicKey(primaryMint),
        //           pool: new PublicKey(mergePool),
        //           mm: mmKey,
        //           payer: sdk.provider.wallet.publicKey,
        //           rewarder: new PublicKey(primaryRewarder)
        //         })
        //         primaryInstructions.push(...initPrimaryIxs)
        //       }

        //       if (txEnvRes) {
        //         console.log('toStake###1163###txEnvRes####', txEnvRes)
        //         if (txEnvRes.instructions) {
        //           txEnvRes.instructions.push(...primaryInstructions)
        //         } else {
        //           // txEnvRes.push(...primaryInstructions)
        //           txEnvRes = new TransactionEnvelope(sdk.provider, [...txEnvRes, ...primaryInstructions])
        //         }
        //       } else {
        //         txEnvRes = new TransactionEnvelope(sdk.provider, primaryInstructions)
        //       }
        //     }
        //   }
        // }

        // console.log('toStake###txEnvRes####', txEnvRes)
        // if (txEnvRes && txEnvRes.instructions && txEnvRes.instructions.length > 0) {
        //   const receiptInitMinerV2 = await this.confirmTx(txEnvRes)
        //   console.log('toStake###initMinerV2成功了####', receiptInitMinerV2)
        // }

        // mint ft and get amount

        const mintRes = await sdk.positionWrapper.mintWrapTokens({
          wrapper: wrapperInfo,
          positionInfo: userSwapPosition,
          tokenProgram: TOKEN_PROGRAM_ID
        })


        // const res = await mintRes.tx.simulate();
        // if (res.value.err !== null) {
        //   console.log(res);
        // }
        // invariant(
        //   res.value.err === null,
        //   ProgramError.parse(res.value.logs ?? [0], PositionWrapperErrors)?.msg
        // );
        // const mintEvent = QUARRY_CODERS.PositionWrapper.parseProgramLogEvents(
        //   res.value.logs ?? []
        // )[0];
        // invariant(
        //   mintEvent && mintEvent.name === "MintWrapTokensEvent",
        //   "Mint wrap token event not found"
        // );
        // let stakeAmount = mintEvent.data.amount;




        console.log('toStake###mintRes.tx.instructions####', mintRes.tx.instructions)
        const instructions: TransactionInstruction[] = [...mintRes.tx.instructions]

        const stakeAmount = await calculateWrapAmount(wallet, new PublicKey(positionWrapper), new PublicKey(nftMint))

        console.log('toStake###多挖###stakeAmount###', stakeAmount, '###', stakeAmount.toString())

        console.log('toStake###sdk123###', sdk)

        const mpData = await mp.data()
        const primaryToken = await Token.load(sdk.provider.connection, mpData.primaryMint)
        invariant(primaryToken !== null, 'The primary token is null')

        let tsx: any = {}
        const primaryMint = poolInfo['merge_pool']['primary_mint']
        const replicaMint = poolInfo['merge_pool']['replica_mint']

        for (let i = 0; i < quarries.length; i++) {
          const item: any = quarries[i]
          // is primaryToken
          if (item.stake_token_mint === primaryMint) {
            const primaryRewarder = item.rewarder
            const depositRes = await mp.deposit({
              amount: new TokenAmount(primaryToken, stakeAmount.toString()),
              rewarder: new PublicKey(primaryRewarder)
            })
            if (i === quarries.length - 1) {
              depositRes.instructions.unshift(...instructions)
              tsx = depositRes
            } else {
              instructions.push(...depositRes.instructions)
            }
          } else {
            // is replicaToken
            const replicaRewarder = item.rewarder

            const stakeReplicaRes = await mp.stakeReplicaMiner(new PublicKey(replicaRewarder), mmKey)

            if (i === quarries.length - 1) {
              stakeReplicaRes.instructions.unshift(...instructions)
              tsx = stakeReplicaRes
            } else {
              instructions.push(...stakeReplicaRes.instructions)
            }
          }
        }

        const opt: BroadcastOptions = {
          skipPreflight: true,
          commitment: 'confirmed',
          preflightCommitment: 'confirmed',
          maxRetries: 30,
          printLogs: true
        }

        console.log('toStake###tsx####', tsx)
        tsx.instructions.forEach((item: any, index) => {
          console.log('toStake###tsx###', index, '##item###', item.programId.toString())
        })

        const receipt: any = await tsx.send(opt)
        this.$accessor.transaction.setShowWaiting(false)

        if (receipt && receipt.signature) {
          txid = receipt.signature
          console.log('走到这里了吗###', txid)
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
              _this.$accessor.farmingv2.getPositionObj({
                tvlData: _this.tvlData,
                farmingInfo: poolInfo,
                rates: _this.liquidity.rates,
                coinPairConfigObj: _this.liquidity.coinPairConfigObj
              })
              _this.stakeSuccess = true
            },
            errorCallback: () => {
              _this.isStaking = false
              _this.isDisabled = false
              _this.stakeFailed = true
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
        console.log('toStakeTest##err###', err)
        this.stakeFailed = true
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
      console.log('toUnStake####poolInfo####', poolInfo)
      this.currentPosition = positionInfo
      const positionWrapper = poolInfo.positionWrapper
      const mergePool = poolInfo['merge_pool'].address
      const quarries = poolInfo.quarries
      const nftMint = new PublicKey(positionInfo.nftMintAddress)
      const positionWrapperMint = poolInfo['position_wrapper'].wrap_mint

      const wallet = (this as any).$wallet
      const conn = this.$web3
      const sdk = makeSDK(conn, wallet)

      this.isUnStaking = true
      this.isDisabled = true
      this.$accessor.transaction.setTransactionDesc(`Unstake ${poolInfo.name} NFT`)
      this.$accessor.transaction.setShowWaiting(true)

      let txid = ''

      try {



        // unstake replica
        const mmKey = await sdk.mergeMine.findMergeMinerAddress({
          pool: new PublicKey(mergePool),
          owner: sdk.provider.wallet.publicKey
        })

        const mm = await sdk.mergeMine.loadMM({ mmKey })
        const mp = sdk.mergeMine.loadMP({ mpKey: new PublicKey(mergePool) })

        const instructions: TransactionInstruction[] = []
        let stakeReplicaResAll: any = null

        const primaryMint = poolInfo['merge_pool']['primary_mint']
        const replicaMint = poolInfo['merge_pool']['replica_mint']
        for (let i = 0; i < quarries.length; i++) {
          const item: any = quarries[i]
          // is primaryToken
          if (item.stake_token_mint === primaryMint) {

            const account: any = this.wallet.tokenAccounts
            const userPosionWrapperBalance: any = account && account[positionWrapperMint] && account[positionWrapperMint]?.balance || null


            const primaryRewarder = item.rewarder
            const primaryTokenAmount = positionInfo.wrapBalance
            const primaryToken = await Token.load(sdk.provider.connection, mm.primaryMint)
            invariant(primaryToken !== null, 'The primary token is null')
            console.log('toUnStake###primaryTokenAmount###', primaryTokenAmount.toString())
            console.log('toUnStake###userPosionWrapperBalance###', userPosionWrapperBalance.toWei().toString())
            const resPrimaryTokenAmount = userPosionWrapperBalance ? new Decimal(primaryTokenAmount.toString()).sub(userPosionWrapperBalance.toWei().toString()) : primaryTokenAmount
            console.log('toUnStake###resPrimaryTokenAmount####', resPrimaryTokenAmount.toString())
            const unstakePrimaryRes = await mm.withdraw({
              amount: new TokenAmount(primaryToken, resPrimaryTokenAmount.toString()),
              rewarder: new PublicKey(primaryRewarder)
            })

            // unstakePrimaryRes.instructions.unshift(...instructions)
            instructions.push(...unstakePrimaryRes.instructions)
          } else {
            console.log('toUnStake###is replica rewarder')
            const replicaRewarder = item.rewarder
            const unstakeAllReplicaRes = await mm.unstakeAllReplica(new PublicKey(replicaRewarder))
            instructions.unshift(...unstakeAllReplicaRes.instructions)

            const stakeReplicaRes = await mp.stakeReplicaMiner(new PublicKey(replicaRewarder), mmKey)
            if (!stakeReplicaResAll) {
              stakeReplicaResAll = stakeReplicaRes
            } else {
              stakeReplicaResAll.instructions.push(...stakeReplicaRes.instructions)
            }
            // stakeReplicaMinerInstructions.push(...stakeReplicaRes.instructions)
          }
        }

        // burn
        const tokenAccounts = await getTokenAccountsByOwnerAndMint(
          sdk.provider.connection,
          sdk.provider.wallet.publicKey,
          nftMint
        )
        if (tokenAccounts.length <= 0) {
          console.log('The nft token account not foundkj')
        }
        invariant(tokenAccounts[0] !== undefined, 'The nft token accuont is undefined')

        const wrapperInfo = await PositionWrapper.fetchPositionWrapper(
          new PublicKey(positionWrapper),
          sdk.provider.connection
        )
        invariant(wrapperInfo !== null, 'wrapper not found')
        const nftAccount = tokenAccounts[0].address
        const burnRes = await sdk.positionWrapper.burnWrapTokens({
          wrapper: wrapperInfo,
          nftMint,
          nftAccount
        })

        let tsx: any = null

        // 单挖时候
        if (stakeReplicaResAll) {
          console.log('toUnStake####stakeReplicaResAll####', stakeReplicaResAll)
          instructions.push(...burnRes.instructions)
          stakeReplicaResAll.instructions.unshift(...instructions)
          tsx = stakeReplicaResAll
        } else {
          //多挖时候
          burnRes.instructions.unshift(...instructions)
          tsx = burnRes
          console.log('toUnStake####burnRes####', burnRes)
        }

        const opt: BroadcastOptions = {
          skipPreflight: true,
          commitment: 'confirmed',
          preflightCommitment: 'confirmed',
          maxRetries: 30,
          printLogs: true
        }

        console.log('toUnStake###tsx###', tsx)
        const receipt: any = await tsx.send(opt)
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
              _this.isUnStaking = false
              _this.isDisabled = false
              _this.$emit('refreshData')
              _this.$accessor.farmingv2.getPositionObj({
                tvlData: _this.tvlData,
                farmingInfo: poolInfo,
                rates: _this.liquidity.rates,
                coinPairConfigObj: _this.liquidity.coinPairConfigObj
              })
            },
            errorCallback: () => {
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
        console.log('toUnStake###error###', err)
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
    async redeemTokensAllIx(program: any, redeemer: any, args: RedeemTokenArgs): Promise<TransactionInstruction> {
      const accounts = await redeemer.getRedeemTokenAccounts(args)
      return program.instruction.redeemAllTokens({
        // accounts
        // accounts: await redeemer.getRedeemTokenAccounts(args)
        accounts: {
          redeemer: accounts.redeemer,
          sourceAuthority: accounts.sourceAuthority,
          iouMint: accounts.iouMint,
          iouSource: accounts.iouSource,
          redemptionVault: accounts.redemptionVault,
          redemptionDestination: accounts.redemptionDestination,
          tokenProgram: TOKEN_PROGRAM_ID
        }
      })
    },
    async redeemAllTokens(sdk: any, iouMint: PublicKey, redemptionMint: PublicKey) {
      const program = sdk.programs.Redeemer

      const redeemer = await sdk.loadRedeemer({
        iouMint,
        redemptionMint
      })
      const iouATA = await getATAAddress({
        // provider: sdk.provider,
        mint: iouMint,
        owner: sdk.provider.wallet.publicKey
      })
      const redemptionATA = await getOrCreateATA({
        provider: sdk.provider,
        mint: redemptionMint,
        owner: sdk.provider.wallet.publicKey
      })

      const args: RedeemTokenArgs = {
        tokenAmount: new u64(1),
        sourceAuthority: sdk.provider.wallet.publicKey,
        iouSource: iouATA,
        redemptionDestination: redemptionATA.address
      }
      return new TransactionEnvelope(sdk.provider, [
        // ...(iouATA.instruction ? [iouATA.instruction] : []),
        ...(redemptionATA.instruction ? [redemptionATA.instruction] : []),
        await this.redeemTokensAllIx(program, redeemer, args)
      ])
    },
    async toClaim(poolInfo: any, qitem: any) {
      console.log('toClaim###farmingInfo###', poolInfo)
      console.log('toClaim###qitem###', qitem)

      const wallet = (this as any).$wallet
      const conn = this.$web3
      const sdk = makeSDK(conn, wallet)
      const positionWrapper = poolInfo.positionWrapper
      const mpKey = poolInfo['merge_pool'].address
      const mmKey = await sdk.mergeMine.findMergeMinerAddress({
        pool: new PublicKey(mpKey),
        owner: sdk.provider.wallet.publicKey
      })
      const mm = await sdk.mergeMine.loadMM({ mmKey })

      const rewarderKey = new PublicKey(qitem.rewarder)
      const redeemers = poolInfo.redeemers

      this.isClaiming = true
      this.isDisabled = true
      const currentRwardToken = this.rewardTokenObj[qitem.reward_token_mint]
      this.$accessor.transaction.setTransactionDesc(`Harvest ${currentRwardToken.name} rewards`)
      this.$accessor.transaction.setShowWaiting(true)

      let txid = ''
      try {
        let tx: any = null
        const primaryMint = poolInfo['merge_pool']['primary_mint']
        const replicaMint = poolInfo['merge_pool']['replica_mint']
        // primary rewards
        if (qitem.stake_token_mint === primaryMint) {
          tx = await mm.claimPrimaryRewards(rewarderKey)
        } else {
          // replica rewards
          tx = await mm.claimReplicaRewards(rewarderKey)
        }

        if (redeemers && redeemers[qitem.reward_token_mint]) {
          const redeemerRes = await this.redeemAllTokens(
            sdk,
            new PublicKey(qitem.reward_token_mint),
            new PublicKey(redeemers[qitem.reward_token_mint].redemption_mint)
          )
          tx.instructions.push(...redeemerRes.instructions)
        }

        const opt: BroadcastOptions = {
          skipPreflight: true,
          commitment: 'confirmed',
          preflightCommitment: 'confirmed',
          maxRetries: 30,
          printLogs: true
        }
        // const receipt = await tx.confirm()
        const receipt: any = await tx.send(opt)
        this.$accessor.transaction.setShowWaiting(false)

        if (receipt && receipt.signature) {
          txid = receipt.signature
          const description = `Harvest ${currentRwardToken.name} rewards`
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
              _this.$accessor.farmingv2.getPositionObj({
                tvlData: _this.tvlData,
                farmingInfo: poolInfo,
                rates: _this.liquidity.rates,
                coinPairConfigObj: _this.liquidity.coinPairConfigObj
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
        }
      } catch (err) {
        console.log('toClaim###err###', err)
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