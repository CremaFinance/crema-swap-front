import Vue from 'vue'
import { mapState } from 'vuex'
import importIcon from '@/utils/import-icon'
import {
  QuarrySDK,
  MinerWrapper,
  PositionWrapper,
  findActivityMetadataAddress,
  QUARRY_CODERS
} from '@cremafinance/crema-farming'
import invariant from 'tiny-invariant'
import { makeSDK, fetchCremakeys, getMasterPda, fetchActivitymaster, quarryInfo } from '@/contract/farming'
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
import { addCommom, checkNullObj, fixD } from '@/utils'
import { BroadcastOptions } from '@saberhq/solana-contrib'
import { Tooltip, Progress, Button } from 'ant-design-vue'
import Decimal from 'decimal.js'

// import { Button } from 'ant-design-vue'
// Vue.use(Button)
export default Vue.extend({
  components: {
    // Button
    Tooltip,
    Progress,
    Button
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
    earningsAmount: {
      type: Number,
      default: 0
    },
    caffeineAmount: {
      type: String,
      default: '0'
    },
    keysObj: {
      type: Object,
      default: () => {
        return null as any
      }
    },
    countObj: {
      type: Object,
      default: () => {
        return {} as any
      }
    },
    keysList: {
      type: Array,
      default: () => {
        return [] as any
      }
    },
    nameObj: {
      type: Object,
      default: () => {
        return {} as any
      }
    }
  },
  data() {
    return {
      showMint: false,
      showClaim: false,
      showUpgrade: false,
      stakeTitle: 'Stake',
      showStake: false,
      isShowTableTr: -1,
      changeNFT: false,
      isNotLink: false,
      isClaim: false,
      changeBtn: 'Card-Bronze',
      farmCard: 'Card-Bronze',
      nftPrice: '300',
      keyBaseData: {
        1: {
          id: 1,
          icon: 'Card-Bronze',
          img: 'Brass_Key',
          name: 'option-Bronze',
          key: 'Bronze Key',
          num: '',
          minRequireAmount: 2000,
          upgradeMinAmount: 3000,
          maxpreReward: 1200,
          rewardX: '2X'
        },
        2: {
          id: 2,
          icon: 'Card-Silver',
          img: 'Silver_Key',
          name: 'option-Silver',
          key: 'Silver Key',
          num: '',
          minRequireAmount: 5000,
          upgradeMinAmount: 5000,
          maxpreReward: 4500,
          rewardX: '3X'
        },
        3: {
          id: 3,
          icon: 'Card-Golden',
          img: 'Golden_Key',
          name: 'option-Golden',
          key: 'Golden Key',
          num: '',
          minRequireAmount: 10000,
          upgradeMinAmount: 10000,
          maxpreReward: 12000,
          rewardX: '4X'
        },
        4: {
          id: 4,
          icon: 'Card-Platinum',
          img: 'Platinum_Key',
          name: 'option-Platinum',
          key: 'Platinum Key',
          num: '',
          minRequireAmount: 20000,
          upgradeMinAmount: 15000,
          maxpreReward: 30000,
          rewardX: '5X'
        },
        5: {
          id: 5,
          icon: 'Card-Diamond',
          img: 'Diamond_Key',
          name: 'option-Diamond',
          key: 'Diamond Key',
          num: '',
          minRequireAmount: 35000,
          maxpreReward: 63000,
          rewardX: '6X'
        }
      },
      keyData: [
        {
          id: 1,
          icon: 'Card-Bronze',
          img: 'Brass_Key',
          name: 'option-Bronze',
          key: 'Bronze Key',
          num: '',
          minRequireAmount: 2000,
          upgradeMinAmount: 3000,
          maxpreReward: 200,
          rewardX: '2X'
        },
        {
          id: 2,
          icon: 'Card-Silver',
          img: 'Silver_Key',
          name: 'option-Silver',
          key: 'Silver Key',
          num: '',
          minRequireAmount: 5000,
          upgradeMinAmount: 5000,
          maxpreReward: 500,
          rewardX: '3X'
        },
        {
          id: 3,
          icon: 'Card-Golden',
          img: 'Golden_Key',
          name: 'option-Golden',
          key: 'Golden Key',
          num: '',
          minRequireAmount: 10000,
          upgradeMinAmount: 10000,
          maxpreReward: 1000,
          rewardX: '4X'
        },
        {
          id: 4,
          icon: 'Card-Platinum',
          img: 'Platinum_Key',
          name: 'option-Platinum',
          key: 'Platinum Key',
          num: '',
          minRequireAmount: 20000,
          upgradeMinAmount: 15000,
          maxpreReward: 2000,
          rewardX: '5X'
        },
        {
          id: 5,
          icon: 'Card-Diamond',
          img: 'Diamond_Key',
          name: 'option-Diamond',
          key: 'Diamond Key',
          num: '',
          minRequireAmount: 35000,
          maxpreReward: 3000,
          rewardX: '6X'
        }
      ],
      changeHintData: [
        { val: 'Bronze' },
        { val: 'Silver' },
        { val: 'Golden' },
        { val: 'Platinum' },
        { val: 'Diamond' }
      ],
      isEewardRangeTab: -1,
      isdir: 'Brass',
      isdirIcon: 'icon-Brass-Key-bright',
      isMinting: false,
      isDisabled: false,
      isUpgrading: false,
      isClaiming: false,
      currentKeyItem: {} as any,
      openRewardTimestamp: 0,
      farmingEndTimestamp: 0,
      currentCardIndex: 0,
      showBurnModal: false,
      upgradeObject: {
        id: 2,
        icon: 'Card-Silver',
        img: 'Silver_Key',
        name: 'option-Silver',
        key: 'Silver Key',
        num: '',
        minRequireAmount: 5000,
        upgradeMinAmount: 5000,
        maxpreReward: 500,
        rewardX: '3X'
      },
      claimIsLoadingObj: {} as any,
      claimRewardsType: 'open',
      isBurnLoading: false
    }
  },
  computed: {
    ...mapState(['wallet', 'transaction', 'url', 'farming']),

    currentKeyAmount() {
      if (this.keysObj && this.currentKeyItem && this.keysObj[this.currentKeyItem.id]) {
        return this.keysObj[this.currentKeyItem.id].length
      }
      return 0
    },
    tipText() {
      // 1、未连接钱包，数据占位--
      if (!this.wallet && !this.wallet.connected) {
        return 'Please connect a wallet. '
      }
      if (!this.farmingIsEnd) {
        // 2、当前不存在NFT
        if (this.currentKeyAmount < 1 && this.caffeineAmount < this.currentKeyItem.minRequireAmount) {
          return `You need  
          ${Math.ceil(this.currentKeyItem.minRequireAmount - this.caffeineAmount)}
           more Caffeine to mint a new ${this.currentKeyItem.key}. `
        }

        // 3、当前存在的咖啡因数量可以铸造当前选中的等级时展示
        if (this.currentKeyAmount < 1 && this.caffeineAmount >= this.currentKeyItem.minRequireAmount) {
          return `You are eligible to mint a new ${this.currentKeyItem.key} key. `
        }

        // 4、该等级下存在NFT 时，不可升级时
        if (
          this.currentKeyItem.id !== 5 &&
          this.currentKeyAmount > 0 &&
          this.caffeineAmount < this.currentKeyItem.upgradeMinAmount
        ) {
          return `You need 
          ${Math.ceil(this.currentKeyItem.upgradeMinAmount - this.caffeineAmount)}
           more Caffeine to upgrade this key. `
        }

        // 5、该等级下存在NFT 时，可升级时
        if (
          this.currentKeyItem.id !== 5 &&
          this.currentKeyAmount > 0 &&
          this.caffeineAmount >= this.currentKeyItem.upgradeMinAmount
        ) {
          return `You are eligible to upgrade this key to a ${this.keyData[this.canUpgradeHeighKeyId - 1].key}.`
        }

        // 当是最后一个等级时，且咖啡因够mint时
        if (
          this.currentKeyAmount > 0 &&
          this.caffeineAmount >= this.currentKeyItem.minRequireAmount &&
          this.currentKeyItem.id === 5
        ) {
          return `You are eligible to mint a new ${this.currentKeyItem.key} key. `
        }

        // 当是最后一个等级，且咖啡因不够mint时
        if (
          this.currentKeyAmount > 0 &&
          this.caffeineAmount < this.currentKeyItem.minRequireAmount &&
          this.currentKeyItem.id === 5
        ) {
          return `You need  
          ${Math.ceil(this.currentKeyItem.minRequireAmount - this.caffeineAmount)}
           more Caffeine to mint a new ${this.currentKeyItem.key}. `
        }
      } else {
        // 6、抽奖开启，当前等级下不存在NFT：
        if (this.currentKeyAmount < 1) {
          return `Sorry, you don't have ${this.currentKeyItem.key}.`
        }

        console.log('tipText####currentKeyItem#####', this.currentKeyItem)
        // 7、质押结束后，当前等级下有NFT，等待开启奖励：
        if (this.currentKeyAmount > 0 && !this.canClaim && !this.currentKeyItem.is_crm_claimed) {
          return `You can use your ${this.currentKeyItem.key} to unlock the treasury box soon.`
        } else if (this.currentKeyAmount > 0 && this.canClaim && !this.currentKeyItem.is_crm_claimed) {
          // 8、质押结束后，当前等级下有NFT，到达可开启时间：
          return 'This key is ready to open the treasure box. Claim your rewards now! '
        }
      }

      return ''
    },
    canMintKeyName() {
      if (this.caffeineAmount >= 35000) {
        return 'Diamond Key'
      } else if (this.caffeineAmount >= 20000) {
        return 'Platinum Key'
      } else if (this.caffeineAmount >= 10000) {
        return 'Golden Key'
      } else if (this.caffeineAmount >= 5000) {
        return 'Silver Key'
      } else if (this.caffeineAmount >= 2000) {
        return 'Bronze Key'
      }
      return ''
    },
    canMint() {
      if (Number(this.caffeineAmount) >= this.currentKeyItem.minRequireAmount) {
        return true
      }
      return false
    },
    canUpgrade() {
      if (this.currentKeyItem.upgradeMinAmount && Number(this.caffeineAmount) >= this.currentKeyItem.upgradeMinAmount) {
        return true
      }
      return false
    },
    canUpgradeHeighKeyId() {
      if (this.currentKeyItem.id === 5) return ''
      let i = 4
      while (i > 0) {
        if (Number(this.caffeineAmount) >= this.keyData[i].minRequireAmount - this.currentKeyItem.minRequireAmount) {
          return this.keyData[i].id
        }
        i--
      }
      return ''
    },
    isClaimedText() {
      if (this.currentKeyItem.is_crm_claimed) {
        return 'Congratulations, this event the NFT got the rewards'
      }
      return ''
    },
    farmingIsEnd() {
      if (this.farmingEndTimestamp) {
        const farmingEndTimestamp = this.openRewardTimestamp && this.farmingEndTimestamp > this.openRewardTimestamp ? this.openRewardTimestamp : this.farmingEndTimestamp
        const now = parseInt(String(new Date().getTime() / 1000))
        if (farmingEndTimestamp <= now) {
          return true
        }
      } else {
        return true
      }
      return false
    },
    canClaim() {
      if (this.openRewardTimestamp) {
        const now = parseInt(String(new Date().getTime() / 1000))
        console.log('canClaim###openRewardTimestamp####', this.openRewardTimestamp)
        console.log('canClaim###now###now', now)
        if (this.openRewardTimestamp <= now) {
          return true
        }
      }
      return false
    }
  },
  watch: {
    changeBtn(newValue, oldValue) {
      if (newValue == 'Card-Bronze') {
        this.isClaim = false
        this.isNotLink = false
        this.nftPrice = '300'
        this.isdir = 'Brass'
        this.isdirIcon = 'icon-Brass-Key-bright'
        this.upgradeObject = this.keyData[1]
      } else if (newValue == 'Card-Silver') {
        this.isClaim = false
        this.isNotLink = false
        this.nftPrice = '700'
        this.isdir = 'Silver'
        this.isdirIcon = 'icon-Silver-Key-bright'
        this.upgradeObject = this.keyData[2]
      } else if (newValue == 'Card-Golden') {
        this.isClaim = false
        this.isNotLink = false
        this.nftPrice = '1,300'
        this.isdir = 'Golden'
        this.isdirIcon = 'icon-Golden-Key-bright'
        this.upgradeObject = this.keyData[3]
      } else if (newValue == 'Card-Platinum') {
        this.isClaim = false
        this.isNotLink = false
        this.nftPrice = '2,100'
        this.isdir = 'Platinum'
        this.isdirIcon = 'icon-Platinum-Key-bright'
        this.upgradeObject = this.keyData[4]
      } else if (newValue == 'Card-Diamond') {
        this.isClaim = false
        this.isNotLink = false
        this.nftPrice = '3,100'
        this.isdir = 'Diamond'
        this.isdirIcon = 'icon-Diamond-Key-bright'
      }
    },
    'wallet.connected': {
      handler: 'walletWatch',
      immediate: true
    },
    keysObj: {
      handler: 'keysObjWatch',
      immediate: true
    },
    keysList: {
      handler: 'keysListWatch',
      immediate: true
    }
  },
  mounted() {
    this.getCanClaimDate()
    this.getFarmingDate()
  },
  methods: {
    addCommom,
    importIcon,
    // changeHint(value: string) {
    //   this.hint = value
    //   this.isShowHint = !this.isShowHint
    // },
    closeBurnModal() {
      this.showBurnModal = false
    },
    openBurnModal() {
      if (!this.wallet.connected) {
        this.$accessor.wallet.openModal()
        return false
      }
      this.showBurnModal = true
    },
    walletWatch(newValue) {
      if (newValue) {
        // this.getKeys()
        this.$emit('refreshKeysData')
        this.$accessor.farming.getEarningsObj()
        // this.$accessor.farming.getCaffeineAmount()
      }
    },
    keysListWatch(newVal) {
      console.log('keysListWatch####newVal###', newVal)
      if (!checkNullObj(this.currentKeyItem)) {
        const item = newVal.filter(
          (item) => item.mint === this.currentKeyItem.mint && item.id === this.currentKeyItem.id
        )[0]
        let result: any
        console.log('this.currentKeyItem#####', this.currentKeyItem)
        if (!item) {
          result = newVal.filter((item) => item.id === this.currentKeyItem.id)[0]
        } else {
          result = item
        }
        this.currentKeyItem = result
        console.log('这里item####', item)
        console.log('这里result####', result)
      }
    },
    keysObjWatch(newVal) {
      console.log('keysObjWatch####newVal###', newVal)
      if (newVal !== null && !checkNullObj(newVal) && newVal[1] && newVal[1][0] && checkNullObj(this.currentKeyItem)) {
        this.currentKeyItem = {
          ...newVal[1][0],
          ...this.keyBaseData[1]
        }
      } else if (newVal !== null && checkNullObj(newVal) && checkNullObj(this.currentKeyItem)) {
        this.currentKeyItem = this.keysList[0]
      }
    },
    changeMint() {
      this.showMint = true
    },
    changeClaim() {
      this.claimRewardsType = 'open'
      this.showClaim = true
    },
    changeUpgrade() {
      this.showUpgrade = true
    },
    changeIcon(item: any) {

      this.changeBtn = item.icon
      this.farmCard = item.icon
      for (let i = 0; i < this.keysList.length; i++) {
        if (item.mint && item.mint === this.keysList[i].mint) {
          this.currentKeyItem = this.keysList[i]
          this.currentCardIndex = i
          break
        }
        if (!item.mint && item.id === this.keysList[i].id) {
          this.currentKeyItem = this.keysList[i]
          this.currentCardIndex = i
          break
        }
      }
      this.claimIsLoadingObj = this.currentKeyItem.isSecondPartyClaimed
    },
    changeImg(key) {
      let index
      if (key === 'left') {
        index = this.currentCardIndex - 1
      } else {
        index = this.currentCardIndex + 1
      }
      if (index < 0) {
        index = this.keysList.length - 1
      } else if (index > this.keysList.length - 1) {
        index = 0
      }
      this.currentCardIndex = index
      this.currentKeyItem = this.keysList[index]
      this.changeBtn = this.keysList[index].icon
      this.claimIsLoadingObj = this.currentKeyItem.isSecondPartyClaimed
    },
    async getCanClaimDate() {
      try {
        const res = await getMasterPda()
        let MasterPda
        if (res && res[0]) {
          MasterPda = res[0].toString()
        }
        const wallet = (this as any).$wallet
        const conn = this.$web3
        const activeInfo = await fetchActivitymaster(conn, wallet, new PublicKey(MasterPda))
        console.log('activeInfo####', activeInfo)
        if (activeInfo && activeInfo.openRewardTimestamp) {
          this.openRewardTimestamp = activeInfo.openRewardTimestamp.toNumber()
          console.log('activeInfo.openRewardTimestamp.toNumber()###', activeInfo.openRewardTimestamp.toNumber())
          // 为了测试设置为4月30日
          // this.openRewardTimestamp = 1648569600
          // this.openRewardTimestamp = 1651248000
        }
        if (activeInfo && activeInfo.crmExchangeRate) {
          const crmToUstRate = activeInfo.crmExchangeRate.toNumber() / Math.pow(10, activeInfo.crmPriceDecimal)
          const caffeineToUstRate = 0.1
          const caffeineToCrmRate = caffeineToUstRate / crmToUstRate
          this.caffeineToCrmRate = caffeineToCrmRate
          console.log('activeInfo####crmExchangeRate####', activeInfo.crmExchangeRate.toString())
          console.log('activeInfo####caffeineToCrmRate####', caffeineToCrmRate)
        }
      } catch (err) {
        console.log('getCanClaimDate###err###', err)
      }
    },
    async getFarmingDate() {
      const wallet = (this as any).$wallet
      const conn = this.$web3
      const rewarderKey = new PublicKey('9VdAkPH9WTiAEEr1fdSd5ycbK8Z3JsdyDuzxCk6vpJod')
      const positionWrapperWrapMint = new PublicKey('9aExwsPhX6i1NMdWgPG6odh8VxTfib2Fw2hLd1Tui9V4')
      try {
        const res: any = await quarryInfo(conn, wallet, rewarderKey, positionWrapperWrapMint)
        if (res && res.famineTs) {
          this.farmingEndTimestamp = Number(res.famineTs.toString()) // 目前后端设置的质押活动结束时间是永久 即9223372036854775807
          console.log('Number(res.famineTs.toString())####', Number(res.famineTs.toString()))
          // 为了测试，暂设置为5月30 14:13
          // this.farmingEndTimestamp = 1653898400
        }
      } catch (err) {
        console.log('getFarmingDate###err###', err)
      }
    },
    async toMint() {
      this.showMint = false
      this.isMinting = true
      this.isDisabled = true
      const wallet = (this as any).$wallet
      const conn = this.$web3
      const degree = this.currentKeyItem.id

      const sdk: any = makeSDK(conn, wallet)
      const authoritySdk = sdk.provider.walletKey

      invariant(wallet.publicKey.toString() == authoritySdk.toString(), 'user is the same to sdk')

      this.$accessor.transaction.setTransactionDesc('Mint NFT')
      this.$accessor.transaction.setShowWaiting(true)

      let txid = ''
      try {
        const res = await sdk.activity.mintCremaKey({
          user: wallet.publicKey,
          degree
        })

        const opt: BroadcastOptions = {
          skipPreflight: true,
          preflightCommitment: 'confirmed',
          maxRetries: 30,
          printLogs: true
        }

        const receipt = await res.tx.send(opt)
        this.$accessor.transaction.setShowWaiting(false)

        if (receipt && receipt.signature) {
          txid = receipt.signature
          const description = `Mint NFT`
          this.$accessor.transaction.setShowSubmitted(true)
          const _this = this
          this.$accessor.transaction.sub({
            txid,
            description,
            type: 'Mint',
            successCallback: () => {
              _this.isMinting = false
              _this.isDisabled = false
              // _this.getKeys()
              _this.$emit('refreshKeysData')
            },
            errorCallback: () => {
              _this.isMinting = false
              _this.isDisabled = false
            }
          })

          const whatWait = await receipt.wait({
            commitment: 'confirmed',
            useWebsocket: true,
            retries: 30
          })

          // conn.onSignature(txid, function (signatureResult: SignatureResult, context: Context) {
          //   _this.isMinting = false
          //   _this.isDisabled = false
          //   if (!signatureResult.err) {
          //     // _this.$accessor.farming.getFarmingList()
          //     // 监听到成功后刷新
          //     _this.getKeys()
          //   }
          // })
        }
      } catch (err) {
        console.log('toMint ERROR#####', err)
        this.$accessor.transaction.setShowWaiting(false)
        this.isMinting = false
        this.isDisabled = false
      }
    },
    async toUpgrade() {
      // const mint = this.keysObj[this.currentKeyItem.id][0].mint
      const mint = this.currentKeyItem.mint
      if (!mint) return
      // const mint = ''
      this.showUpgrade = false
      this.isUpgrading = true
      this.isDisabled = true
      const wallet = (this as any).$wallet
      const conn = this.$web3

      const sdk: any = makeSDK(conn, wallet)
      const authoritySdk = sdk.provider.walletKey
      invariant(wallet.publicKey.toBase58() == authoritySdk.toBase58(), 'user is the same to sdk')

      this.$accessor.transaction.setTransactionDesc('Upgrade NFT')
      this.$accessor.transaction.setShowWaiting(true)
      let txid = ''
      try {
        const tx = await sdk.activity.upgrade({
          user: wallet.publicKey,
          mint: new PublicKey(mint)
        })

        const opt: BroadcastOptions = {
          skipPreflight: true,
          preflightCommitment: 'confirmed',
          maxRetries: 30,
          printLogs: true
        }

        const receipt = await tx.send(opt)
        this.$accessor.transaction.setShowWaiting(false)

        if (receipt && receipt.signature) {
          txid = receipt.signature
          const description = 'Upgrade NFT'
          this.$accessor.transaction.setShowSubmitted(true)
          const _this = this
          this.$accessor.transaction.sub({
            txid,
            description,
            type: 'Upgrade',
            successCallback: () => {
              _this.isUpgrading = false
              _this.isDisabled = false
              _this.$emit('refreshKeysData')
            },
            errorCallback: () => {
              _this.isUpgrading = false
              _this.isDisabled = false
            }
          })

          const whatWait = await receipt.wait({
            commitment: 'confirmed',
            useWebsocket: true,
            retries: 30
          })

          // conn.onSignature(txid, function (signatureResult: SignatureResult, context: Context) {
          //   _this.isUpgrading = false
          //   _this.isDisabled = false
          //   if (!signatureResult.err) {
          //     // _this.$accessor.farming.getFarmingList()
          //     // 监听到成功后刷新
          //     _this.getKeys()
          //   }
          // })
        }
      } catch (err) {
        this.$accessor.transaction.setShowWaiting(false)
        this.isUpgrading = false
        this.isDisabled = false
        this.$notify.close(txid + 'loading')
        this.$notify.error({
          key: 'Upgrade',
          message: 'Transaction failed',
          description: ''
        })
      }
    },
    async toOpen() {
      this.showClaim = false
      // const mint = this.keysObj[this.currentKeyItem.id][0].mint
      const mint = this.currentKeyItem.mint
      console.log('toOpen##mint###', mint)
      this.isClaiming = true
      this.isDisabled = true
      const wallet = (this as any).$wallet
      const conn = this.$web3

      const sdk: any = makeSDK(conn, wallet)
      const authoritySdk = sdk.provider.walletKey
      invariant(wallet.publicKey.toBase58() == authoritySdk.toBase58(), 'user is the same to sdk')

      this.$accessor.transaction.setTransactionDesc('Open Treasure Box')
      this.$accessor.transaction.setShowWaiting(true)

      let txid = ''
      try {
        const txs = await sdk.activity.claimReward({
          user: wallet.publicKey,
          mint: new PublicKey(mint)
        })

        const opt: BroadcastOptions = {
          skipPreflight: true,
          commitment: 'confirmed',
          preflightCommitment: 'confirmed',
          maxRetries: 30,
          printLogs: true
        }
        // const receipt = await txs.confirm()
        const receipt: any = await txs.send(opt)
        console.log('cliam###secondPartyClaim##signature###', receipt.signature.toString())
        console.log('cliam###secondPartyClaim##computeUnits###', receipt.computeUnits)
        if (receipt && receipt.signature && receipt.signature.toString()) {
          txid = receipt.signature.toString()
          const description = 'Open Treasure Box'
          const _this = this
          this.$accessor.transaction.setShowSubmitted(true)
          this.$accessor.transaction.sub({
            txid,
            description,
            type: 'Open Treasure Box',
            successCallback: async () => {
              _this.isClaiming = false
              _this.isDisabled = false
              _this.$accessor.wallet.getTokenAccounts()
              await _this.$emit('refreshKeysData')
              setTimeout(() => {
                this.claimRewardsType = 'claim'
                this.showClaim = true
              }, 1500)

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
        }
      } catch (err) {
        console.log('toclaim###err###', err)
        this.$accessor.transaction.setShowWaiting(false)
        this.isClaiming = false
        this.isDisabled = false
        this.$notify.close(txid + 'loading')
        this.$notify.error({
          key: 'Claim',
          message: 'Transaction failed',
          description: ''
        })
      }
    },
    // Harvest currencies other than crm
    async toClaimMint(item: any, token_mint: string) {
      this.claimIsLoadingObj = {
        ...this.claimIsLoadingObj,
        [token_mint]: true
      }
      console.log('toClaimMint###currentKeyItem', this.currentKeyItem)
      // const mint = this.keysObj[this.currentKeyItem.id][0].mint
      const mint = this.currentKeyItem.mint
      const wallet = (this as any).$wallet
      const conn = this.$web3

      const sdk: any = makeSDK(conn, wallet)

      this.$accessor.transaction.setTransactionDesc(`Claim ${item.name.toUpperCase()} Rewards. `)
      this.$accessor.transaction.setShowWaiting(true)

      let txid = ''

      console.log('toClaimMint###item###', item)
      console.log('toClaimMint###mint###', mint)
      console.log('toClaimMint###token_mint###', token_mint)

      try {
        const txs = await sdk.activity.claimSecondParty({
          user: wallet.publicKey,
          mint: new PublicKey(mint),
          token_mint: new PublicKey(token_mint)
        })
        // const receipt = await txs.confirm()
        const opt: BroadcastOptions = {
          skipPreflight: true,
          commitment: 'confirmed',
          preflightCommitment: 'confirmed',
          maxRetries: 30,
          printLogs: true
        }
        // const receipt = await tx.confirm()
        console.log('txs###', txs)
        const receipt: any = await txs.send(opt)
        if (receipt && receipt.signature && receipt.signature.toString()) {
          txid = receipt.signature.toString()
          const description = `Claim ${item.name} Rewards. `
          const _this = this
          this.$accessor.transaction.setShowSubmitted(true)
          this.$accessor.transaction.sub({
            txid,
            description,
            type: 'Claim',
            successCallback: () => {
              // this.claimIsLoadingObj = {
              //   ...this.claimIsLoadingObj,
              //   [token_mint]: false
              // }
              _this.$accessor.wallet.getTokenAccounts()
              _this.$emit('refreshKeysData')
            },
            errorCallback: () => {
              this.claimIsLoadingObj = {
                ...this.claimIsLoadingObj,
                [token_mint]: false
              }
            }
          })
          const whatWait = await receipt.wait({
            commitment: 'confirmed',
            useWebsocket: true,
            retries: 30
          })
        }
      } catch (err: any) {
        this.claimIsLoadingObj[token_mint] = false
        console.log('err####', err)
        this.$accessor.transaction.setShowWaiting(false)
      }
    },
    async toBurn(amount: string) {
      this.isBurnLoading = true
      const wallet = (this as any).$wallet
      const conn = this.$web3
      const sdk: any = makeSDK(conn, wallet)

      this.$accessor.transaction.setTransactionDesc(`Burn CRM. `)
      this.$accessor.transaction.setShowWaiting(true)

      let txid = ''

      try {
        const a = new Decimal(amount).mul(Math.pow(10, 6)).toNumber()
        const txs = await sdk.activity.claimCaffeine({
          user: wallet.publicKey,
          amount: a
        })

        const opt: BroadcastOptions = {
          skipPreflight: true,
          commitment: 'confirmed',
          preflightCommitment: 'confirmed',
          maxRetries: 30,
          printLogs: true
        }

        const receipt: any = await txs.send(opt)
        if (receipt && receipt.signature && receipt.signature.toString()) {
          txid = receipt.signature.toString()
          const description = 'Burn CRM.'
          const _this = this
          this.$accessor.transaction.setShowSubmitted(true)
          this.$accessor.transaction.sub({
            txid,
            description,
            type: 'Burn',
            successCallback: () => {
              _this.isBurnLoading = false
              _this.$accessor.wallet.getTokenAccounts()
              _this.$emit('refreshKeysData')
            },
            errorCallback: () => {
              this.isBurnLoading = false
            }
          })
          const whatWait = await receipt.wait({
            commitment: 'confirmed',
            useWebsocket: true,
            retries: 30
          })
        }

      } catch (error: any) {
        console.log('toBurn Error###', error)
        this.isBurnLoading = false
      }

    },

    gotoFarming() {
      this.$router.push('/farming')
    },
    delcommafy(num) {
      if (num != undefined) {
        num = num.toString()
        num = num.replace(/[ ]/g, '') //去除空格
        num = num.replace(/,/gi, '')
        return Number(num)
      }
    }
  }
})