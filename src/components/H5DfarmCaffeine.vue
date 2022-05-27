<template>
  <div class="caffeine-pool-container">
    <div class="caffeine-banner">
      <div>
        <span>My Caffeine</span>
        <span>{{ addCommom(caffeineAmount, 4) }}</span>
        <Tooltip v-if="false" overlay-class-name="burn-btn-tooltip" placement="top">
          <!-- <button class="burn-btn" @click="openBurnModal">Burn</button> -->
          <template slot="title">
            <div class="burn-tips">
              <img src="@/assets/images/icon-Burn@2x.png" />
              <span>Burn remaining Caffeine to get CRM</span>
            </div>
          </template>
        </Tooltip>
      </div>
      <!-- <div>
        <span>Total Earned</span>
        <span>100,884,295.65</span>
      </div> -->
      <div>
        <span>Earnings</span>
        <span
          >{{ addCommom(earningsAmount, 4) }} <span class="caffeine-clue" @click="gotoFarming">Harvest ></span></span
        >
      </div>
    </div>
    <div class="caffeine-banner-farming">
      <img src="@/assets/images/caffeine-cluh5.png" alt="" />
      <a
        target="_blank"
        href="https://medium.com/@Crema.finance/caffeine-farming-event-your-prelaunch-opportunity-to-grab-cremas-token-incentives-706425032a88"
        >Learn more ></a
      >
    </div>
    <div class="farm-caffeine-option" :class="changeBtn">
      <div v-for="(item, index) in keyData" :key="index" :class="item.name" @click="changeIcon(item)">
        <div class="option-icon"></div>
        <p v-if="item.key.split(' ')[0] === 'Golden'">Gold</p>
        <p v-else>{{ item.key.split(' ')[0] }}</p>
        <div v-if="countObj && countObj[item.id]" class="option-count">
          <div v-if="countObj && countObj[item.id]"></div>
          {{ countObj[item.id] }}
        </div>
      </div>
    </div>
    <div class="farm-caffeine-key">
      <i class="card-left-icon">
        <img src="@/assets/images/icon-left-NFT.png" alt="" @click="changeImg('left')" />
      </i>
      <!-- <img
        v-if="currentKeyItem && currentKeyItem.icon"
        :src="`/images/${currentKeyItem.icon}.png`"
        alt=""
        :class="!currentKeyItem.mint ? 'grey card-img' : 'card-img'"
      /> -->
      <img
        v-if="currentKeyItem && currentKeyItem.icon"
        :src="currentKeyItem.mint ? `/images/${currentKeyItem.icon}.png` : `/images/icon-${currentKeyItem.icon}.png`"
        alt=""
        class="card-img"
      />
      <i class="card-right-icon">
        <img src="@/assets/images/icon-right-NFT.png" alt="" @click="changeImg('right')" />
      </i>
      <!-- <div v-if="!currentKeyItem.mint && wallet.connected" class="img-text">Rewards up to 300 CRM tokens</div> -->
      <a
        v-if="wallet.connected && currentKeyItem && currentKeyItem.mint"
        class="img-text"
        target="_blank"
        :href="`https://solscan.io/token/${currentKeyItem.mint}?cluster=devnet`"
      >
        {{ currentKeyItem.mint && currentKeyItem.mint.substr(0, 4) }}
        ...
        {{ currentKeyItem.mint && currentKeyItem.mint.substr(currentKeyItem.mint.length - 4, 4) }}
      </a>
    </div>
    <!-- <p>Congratulations, you can upgrade NFT from Bronze Key to Silver Key</p> -->
    <p>{{ tipText || isClaimedText }}</p>
    <!-- <div class="pmgressbar-hint" :class="isdir">
      <p v-if="isdir === 'Golden'">Gold</p>
      <p v-else>{{ isdir }}</p>
      <span>{{ addCommom(caffeineAmount, 0) }} / {{ addCommom(currentKeyItem.minRequireAmount, 0) }}</span>
    </div>
    <div class="pmgressbar-detail">
      <div>
        <div v-for="(item, index) in changeHintData" :key="index"></div>
      </div>
    </div> -->
    <div class="tips-stats" v-if="wallet.connected && !farmingIsEnd && !currentKeyItem.is_crm_claimed">
      <div class="caync">
        <div>
          <!-- <img :src="`/_nuxt/src/assets/images/icon-${isdir}-Key-bright.png`" alt="" /> -->
          <img :src="`/images/icon-${isdir}-Key-bright.png`" alt="" />
        </div>
        <!-- <img :src="`/images/${currentKeyItem.icon}.png`" alt="" /> -->
      </div>
      <Progress
        :percent="
          Math.ceil(
            (delcommafy(addCommom(caffeineAmount, 0)) / delcommafy(addCommom(currentKeyItem.minRequireAmount, 0))) * 100
          )
        "
        :success="{ percent: 30 }"
        type="dashboard"
        trailColor="#527983"
        :stroke-color="{
          '0%': '#00EC86',
          '50%': '#3489C1',
          '100%': '#7318E3'
        }"
        class="interval"
      />
      <div class="centerMask">
        <span>{{ addCommom(caffeineAmount, 0) }} </span> / {{ addCommom(currentKeyItem.minRequireAmount, 0) }}
      </div>
    </div>
    <div class="pmgressbar-btn">
      <Button
        v-if="wallet.connected && !farmingIsEnd && !currentKeyItem.is_crm_claimed"
        class="action-btn"
        :disabled="!canMint"
        @click="changeMint"
      >
        Mint
      </Button>
      <Button
        v-if="
          wallet.connected &&
          !farmingIsEnd &&
          currentKeyItem.id !== 5 &&
          currentKeyItem.mint &&
          !currentKeyItem.is_crm_claimed &&
          canUpgrade
        "
        class="action-btn"
        @click="changeUpgrade"
      >
        Upgrade
      </Button>
    </div>
    <DMintNFTPopout
      v-if="showMint"
      :currentKeyItem="currentKeyItem"
      :isMinting="isMinting"
      @onClose="() => (showMint = false)"
      @toMint="toMint"
    />
    <DUpgradeNFTPopout
      v-if="showUpgrade"
      :currentKeyItem="currentKeyItem"
      :isUpgrading="isUpgrading"
      :canUpgradeHeighKeyItem="keyData[canUpgradeHeighKeyId - 1]"
      :upgradeObject="upgradeObject"
      @onClose="() => (showUpgrade = false)"
      @toUpgrade="toUpgrade"
    />
    <BurnCaffeineModal v-if="showBurnModal" @onClose="closeBurnModal"></BurnCaffeineModal>
  </div>
</template>
<script lang="ts">
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
import { Tooltip, Progress } from 'ant-design-vue'

// import { Button } from 'ant-design-vue'
// Vue.use(Button)
export default Vue.extend({
  components: {
    // Button
    Tooltip,
    Progress
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
      }
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
          return `You need  ${Math.ceil(this.currentKeyItem.minRequireAmount - this.caffeineAmount)} 
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
          return `You need ${fixD(
            this.currentKeyItem.upgradeMinAmount - this.caffeineAmount,
            0
          )} more Caffeine to upgrade this key. `
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
          return `You need  ${Math.ceil(this.currentKeyItem.minRequireAmount - this.caffeineAmount)} 
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
        const now = parseInt(String(new Date().getTime() / 1000))
        if (this.farmingEndTimestamp <= now) {
          return true
        }
      }
      return false
    },
    canClaim() {
      if (this.openRewardTimestamp) {
        const now = parseInt(String(new Date().getTime() / 1000))
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
        this.upgradeObject = this.keyData[1]
      } else if (newValue == 'Card-Silver') {
        this.isClaim = false
        this.isNotLink = false
        this.nftPrice = '700'
        this.isdir = 'Silver'
        this.upgradeObject = this.keyData[2]
      } else if (newValue == 'Card-Golden') {
        this.isClaim = false
        this.isNotLink = false
        this.nftPrice = '1,300'
        this.isdir = 'Golden'
        this.upgradeObject = this.keyData[3]
      } else if (newValue == 'Card-Platinum') {
        this.isClaim = false
        this.isNotLink = false
        this.nftPrice = '2,100'
        this.isdir = 'Platinum'
        this.upgradeObject = this.keyData[4]
      } else if (newValue == 'Card-Diamond') {
        this.isClaim = false
        this.isNotLink = false
        this.nftPrice = '3,100'
        this.isdir = 'Diamond'
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
        if (activeInfo && activeInfo.openRewardTimestamp) {
          this.openRewardTimestamp = activeInfo.openRewardTimestamp.toNumber()
          console.log('activeInfo.openRewardTimestamp.toNumber()###', activeInfo.openRewardTimestamp.toNumber())
          // 为了测试设置为4月30日
          // this.openRewardTimestamp = 1648569600
          // this.openRewardTimestamp = 1651248000
        }
      } catch (err) {
        console.log('getCanClaimDate###err###', err)
      }
    },
    async getFarmingDate() {
      const wallet = (this as any).$wallet
      const conn = this.$web3
      const rewarderKey = new PublicKey('Aqz8Zvot5BZht6vuwRHpLmP4M126WaECRmc3cVDWnRtm')
      const positionWrapperWrapMint = new PublicKey('GAQbaSD7aFDhkijfAjh2tebxJpm1iJRhWwtrbdNYGTBh')
      try {
        const res: any = await quarryInfo(conn, wallet, rewarderKey, positionWrapperWrapMint)
        if (res && res.famineTs) {
          this.farmingEndTimestamp = Number(res.famineTs.toString()) // 目前后端设置的质押活动结束时间是永久 即9223372036854775807
          console.log('Number(res.famineTs.toString())####', Number(res.famineTs.toString()))
          // 为了测试，暂设置为4月25
          // this.farmingEndTimestamp = 1650816000
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
      const mint = this.keysObj[this.currentKeyItem.id][0].mint
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
    async toClaim() {
      const mint = this.keysObj[this.currentKeyItem.id][0].mint
      this.isClaiming = true
      this.isDisabled = true
      const wallet = (this as any).$wallet
      const conn = this.$web3

      const sdk: any = makeSDK(conn, wallet)
      const authoritySdk = sdk.provider.walletKey
      invariant(wallet.publicKey.toBase58() == authoritySdk.toBase58(), 'user is the same to sdk')

      this.$accessor.transaction.setTransactionDesc('Claim NFT')
      this.$accessor.transaction.setShowWaiting(true)

      let txid = ''
      try {
        // const tx = await sdk.activity.claim({
        //   user: wallet.publicKey,
        //   mint: new PublicKey(mint)
        // })
        // const opt: BroadcastOptions = {
        //   skipPreflight: true,
        //   preflightCommitment: 'confirmed',
        //   maxRetries: 30,
        //   printLogs: true
        // }
        // // const receipt = await tx.confirm()
        // const receipt: any = await tx.send(opt)
        // this.$accessor.transaction.setShowWaiting(false)
        // if (receipt && receipt.signature) {
        //   txid = receipt.signature
        //   const description = 'Claim NFT'
        //   const _this = this
        //   this.$accessor.transaction.setShowSubmitted(true)
        //   this.$accessor.transaction.sub({
        //     txid,
        //     description,
        //     type: 'Claim',
        //     successCallback: () => {
        //       _this.isClaiming = false
        //       _this.isDisabled = false
        //       _this.$accessor.wallet.getTokenAccounts()
        //     },
        //     errorCallback: () => {
        //       _this.isClaiming = false
        //       _this.isDisabled = false
        //     }
        //   })
        //   const whatWait = await receipt.wait({
        //     commitment: 'confirmed',
        //     useWebsocket: true,
        //     retries: 30
        //   })
        // }
        const txs = await sdk.activity.claim({
          user: wallet.publicKey,
          mint: new PublicKey(mint)
        })

        if (txs.ataCreate.instructions.length > 0) {
          const res = await txs.ataCreate.confirm()
          console.log('claim##ataCreate##signature##', res.signature.toString())
          console.log('claim##ataCreate##computeUnits##', res.computeUnits)
          // printObjectJSON({
          //   name: 'ataCreate',
          //   signature: res.signature.toString(),
          //   computeUnits: res.computeUnits
          // })
        }
        const [activityMedatata, _] = await findActivityMetadataAddress(new PublicKey(mint))
        const info = await sdk.activity.fetchMetadata(activityMedatata)
        if (info === null) {
          console.log('activityMedatata %s not found fot this nft', activityMedatata.toBase58())
          return
        }

        if (!info.isCrmClaimed) {
          const crmClaim = await txs.crmClaim.confirm()
          const event = QUARRY_CODERS.Activity.parseProgramLogEvents(crmClaim.response.meta?.logMessages ?? [])[0]
          invariant(event?.name === 'ClaimRewardEvent', 'ClaimRewardEvent not found')
          // printObjectJSON({
          //   name: 'crmClaim',
          //   signature: crmClaim.signature.toString(),
          //   computeUnits: crmClaim.computeUnits,
          //   mint: mint.toBase58(),
          //   user: user.toBase58()
          // })
          console.log('claim##crmClaim###signature###', crmClaim.signature.toString())
          console.log('claim##crmClaim###computeUnits###', crmClaim.computeUnits)

          console.log('claim##crmClaim###mint###', mint)
          console.log('claim##crmClaim###user###', wallet.publicKey.toString())
        }

        if (!info.isSecondPartyClaimed) {
          const receipt = await txs.secondPartyClaim.confirm()
          const event2 = QUARRY_CODERS.Activity.parseProgramLogEvents(receipt.response.meta?.logMessages ?? [])[0]
          // invariant(event2?.name === 'ClaimSecondPartyEvent', 'ClaimSecondPartyEvent not found')
          // printObjectJSON({
          //   name: 'secondPartyClaim',
          //   signature: receipt.signature.toString(),
          //   computeUnits: receipt.computeUnits,
          //   mint: mint.toBase58(),
          //   user: user.toBase58()
          // })
          console.log('cliam###secondPartyClaim##signature###', receipt.signature.toString())
          console.log('cliam###secondPartyClaim##computeUnits###', receipt.computeUnits)
          if (receipt && receipt.signature && receipt.signature.toString()) {
            txid = receipt.signature.toString()
            const description = 'Claim NFT'
            const _this = this
            this.$accessor.transaction.setShowSubmitted(true)
            this.$accessor.transaction.sub({
              txid,
              description,
              type: 'Claim',
              successCallback: () => {
                _this.isClaiming = false
                _this.isDisabled = false
                _this.$accessor.wallet.getTokenAccounts()
                _this.$emit('refreshKeysData')
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
</script>
<style lang="less" scoped>
@import '../styles/base.less';
.caffeine-pool-container {
  width: 100%;
  padding-top: 20px;
  position: relative;
  margin-bottom: 40px;
  > p {
    margin: 40px 0 20px;
  }
}
.caffeine-banner {
  // width: 340px;
  height: 150px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  background: rgba(#000, 0.2);
  border-radius: 20px;
  padding: 10px 0;
}
.burn-btn {
  width: 72px;
  height: 24px;
  background: linear-gradient(233deg, #5fe6d0 0%, #596cff 38%, #9380ff 72%, #e590ff 100%);
  box-shadow: 0px 4px 12px 0px rgba(26, 28, 31, 0.5);
  border-radius: 6px;
  border: 1px solid rgba(232, 228, 255, 0.5) !important;
  margin-left: 20px;
  font-size: 12px;
  &:hover {
    background: linear-gradient(268deg, #5fe6d0 0%, #596eff 39%, #533cd7 74%, #ad4ff6 100%);
    border: 1px solid rgba(232, 228, 255, 0.5) !important;
  }
}
.caffeine-banner > div {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}
.caffeine-banner-farming {
  position: absolute;
  // position: relative;
  width: 100%;
  height: 340px;
  display: flex;
  justify-content: center;
  top: 176px;
  // img {
  //   width: 340px;
  // }
  > a {
    display: block;
    width: 100%;
    position: absolute;
    text-align: center;
    top: 216px;
    color: #fff;
  }
}
.caffeine-clue {
  margin-left: 8px;
}
.farm-caffeine-option {
  width: 100%;
  height: 140px;
  display: flex;
  justify-content: space-between;
  margin-top: 312px;
  .option-Golden {
    margin-top: 46px;
  }
  .option-Silver,
  .option-Platinum {
    margin-top: 33px;
  }
}
.farm-caffeine-option > div {
  width: 60px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  position: relative;
  z-index: 100;
  color: #b5b8c2;
  p {
    width: 100%;
    margin-bottom: 0 !important;
    text-align: center;
  }
}
.option-icon {
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.option-count {
  width: 34px;
  height: 24px;
  background: rgba(#000, 0.1);
  border-radius: 8px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0 4px;
  > div {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #00ff4d;
  }
}
.option-Bronze {
  > .option-icon {
    background: url('@/assets/images/icon-Brass-Key-dark.png');
    background-size: 100% 100%;
  }
}
.option-Silver {
  > .option-icon {
    background: url('@/assets/images/icon-Silver-Key-dark.png');
    background-size: 100% 100%;
  }
}
.option-Golden {
  > .option-icon {
    background: url('@/assets/images/icon-Golden-Key-dark.png');
    background-size: 100% 100%;
  }
}
.option-Platinum {
  > .option-icon {
    height: 22px !important;
    background: url('@/assets/images/icon-Platinum-Key-dark.png');
    background-size: 100% 100%;
  }
}
.option-Diamond {
  > .option-icon {
    background: url('@/assets/images/icon-Diamond-Key-dark.png');
    background-size: 100% 100%;
  }
}
.Card-Bronze {
  > .option-Bronze {
    color: #fff !important;
    font-weight: 700;
    > .option-icon {
      background: url('@/assets/images/icon-Brass-Key-bright.png');
      background-size: 100% 100%;
    }
  }
}
.Card-Silver {
  > .option-Silver {
    color: #fff !important;
    font-weight: 700;
    > .option-icon {
      background: url('@/assets/images/icon-Silver-Key-bright.png');
      background-size: 100% 100%;
    }
  }
}
.Card-Golden {
  > .option-Golden {
    color: #fff !important;
    font-weight: 700;
    > .option-icon {
      background: url('@/assets/images/icon-Golden-Key-bright.png');
      background-size: 100% 100%;
    }
  }
}
.Card-Platinum {
  > .option-Platinum {
    color: #fff !important;
    font-weight: 700;
    > .option-icon {
      height: 22px !important;
      background: url('@/assets/images/icon-Platinum-Key-bright.png');
      background-size: 100% 100%;
    }
  }
}
.Card-Diamond {
  > .option-Diamond {
    color: #fff !important;
    font-weight: 700;
    > .option-icon {
      background: url('@/assets/images/icon-Diamond-Key-bright.png');
      background-size: 100% 100%;
    }
  }
}
.farm-caffeine-key {
  width: 100%;
  height: 330px;
  // background: #000;
  display: flex;
  // align-items: center;
  justify-content: space-around;
  position: relative;
  // img:nth-child(2) {
  //   width: 240px;
  // }
  // img:nth-child(1),
  // img:nth-child(3) {
  //   width: 18px;
  //   height: 44px;
  //   margin-top: 110px;
  // }
  img {
    &.grey {
      filter: grayscale(100%);
    }
  }
  .card-img {
    width: 240px;
    position: absolute;
    left: 50%;
    top: 0px;
    transform: translate(-50%, 0%);
  }
  > i {
    display: block;
    width: 14px;
    height: 44px;
    // margin-bottom: 68px;
    cursor: pointer;
    position: absolute;
    top: 30%;
    transform: translate(-50%, auto);
    &.card-left-icon {
      left: 0px;
    }
    &.card-right-icon {
      right: 0px;
    }
    img {
      width: 100%;
      height: 100%;
    }
  }
  .img-text {
    display: block;
    width: 190px;
    left: 50%;
    color: #fff;
    transform: translate(-50%, 0%);
    text-align: center;
    position: absolute;
    top: 266px;
  }
}
.pmgressbar-hint {
  min-width: 100px;
  max-width: 130px;
  height: 40px;
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: flex-start;
  // flex-wrap: wrap;
  flex-direction: column;
  padding: 0 10px;
  border: 2px solid #d18945;
  border-radius: 6px;
  p {
    margin: 0 !important;
    font-weight: 800;
    background: linear-gradient(283deg, #4cffdf 0%, #6676f5 62%, #c400ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}
.Bronze {
  border: 2px solid #d18945;
}
.Silver {
  margin-left: 8px;
  border: 2px solid #e3f3ff;
}
.Golden {
  margin-left: 53px;
  border: 2px solid #fbff7c;
}
.Platinum {
  margin-left: 133px;
  border: 2px solid #6efbff;
}
.Diamond {
  margin-left: 180px;
  border: 2px solid #c495ff;
}
.pmgressbar-detail {
  width: 100%;
  height: 28px;
  margin-top: 36px;
  > div:nth-child(1) {
    width: 100%;
    height: 12px;
    background: rgba(255, 255, 255, 0.2) linear-gradient(270deg, #00ff90 0%, #7eadcc 50%, #a057ff 100%);
    border: 2px #000 solid;
    border-radius: 7px;
    position: relative;
    > div {
      position: absolute;
      width: 12px;
      height: 12px;
      top: -1px;
      border-radius: 5px;
      border: 1px #000 solid;
      &:hover {
        border: 2px #fff solid;
      }
    }
    > div:nth-child(1) {
      background: #d18945;
      left: 17px;
    }
    > div:nth-child(2) {
      background: #e3f3ff;
      left: 48px;
    }
    > div:nth-child(3) {
      background: #fbff7c;
      left: 94px;
    }
    > div:nth-child(4) {
      background: #6efbff;
      left: 174px;
    }
    > div:nth-child(5) {
      background: #c495ff;
      // left: 271px;
      right: 0px;
    }
  }
}
.tips-stats {
  position: relative;
  .interval {
    margin: 10px auto 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 50;
  }
  .caync {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 32px;
    z-index: 60;
    > div {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 55px;
      height: 55px;
      border-radius: 50%;
      background: rgba(#fff, 0.1);
      img {
        width: 20px;
        height: 20px;
      }
    }
  }
  /deep/ .ant-progress-text {
    margin-top: 46px;
  }
  .centerMask {
    margin: 0 auto;
    text-align: center;
    span {
      font-size: 18px;
      font-weight: bold;
      background: linear-gradient(48deg, #d032ff 0%, #8ab6ff 40%, #4ce1ff 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-family: Avenir;
    }
  }
}
.pmgressbar-btn {
  width: 100%;
  height: 40px;
  margin-top: 24px;
  display: flex;
  justify-content: space-around;
}
.action-btn {
  // width: 130px;
  .gradient-btn-large();
  width: 130px;
  height: 40px;
  font-size: 14px;
  font-weight: 100;
  // div {
  //   line-height: 38px;
  // }
}
@media screen and (max-width: 750px) {
  .pmgressbar-detail {
    margin-top: 12px;
  }
}
</style>