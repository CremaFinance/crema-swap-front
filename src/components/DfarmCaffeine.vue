<template>
  <div>
    <div class="farm-pool-table-NFT">
      <div class="farm-caffeine">
        <div></div>
        <div class="farm-caffeine-title">
          <a
            target="_blank"
            href="https://medium.com/@Crema.finance/caffeine-farming-event-your-prelaunch-opportunity-to-grab-cremas-token-incentives-706425032a88"
            >Learn more ></a
          >
        </div>
        <div class="farm-caffeine-option" :class="changeBtn">
          <div v-for="(item, index) in keyData" :key="index" :class="item.name" @click="changeIcon(item)">
            <div class="option-icon"></div>
            {{ item.key }}
            <div v-if="countObj && countObj[item.id]" class="option-count">
              <div></div>
              {{ countObj[item.id] }}
            </div>
          </div>
        </div>
      </div>
      <div class="farm-NFT-detail">
        <div class="farm-NFT-detail-caffeine">
          <img src="@/assets/images/img-NFT-caffeine.png" alt="" />
          <div>
            <div>
              <div class="td-title">My Caffeine</div>
              <div class="td-text">
                <span>{{ addCommom(caffeineAmount, 4) }}</span>
                <Tooltip overlay-class-name="burn-btn-tooltip" placement="top">
                  <!-- <button class="burn-btn" @click="openBurnModal">Burn</button> -->
                  <template slot="title">
                    <div class="burn-tips">
                      <img src="@/assets/images/icon-Burn@2x.png" />
                      <span>Burn remaining Caffeine to get CRM</span>
                    </div>
                  </template>
                </Tooltip>
              </div>
            </div>
            <!-- <div>
              <div class="td-title">Total Earned</div>
              <div class="td-text">106.8%</div>
            </div> -->
            <div>
              <div class="td-title">
                Earnings <span class="title-Harvest" @click="gotoFarming">&nbsp;&nbsp;Harvest&nbsp;></span>
              </div>
              <div class="td-text" style="text-align: right !important">{{ addCommom(earningsAmount, 4) }}</div>
            </div>
          </div>
        </div>
        <div class="farm-NFT-detail-Mint">
          <div class="farm-NFT-detail-Mint-Left" :class="farmingIsEnd ? 'farm-NFT-isClaim' : ''">
            <!-- <div v-if="wallet.connected && !isClaim" style="height: 160px; padding: 60px 0">
              Still need to produce xxx caffeine to mint NFT
            </div> -->
            <div class="tips-text-box">
              <div class="tips-stats" v-if="wallet.connected && !farmingIsEnd && !currentKeyItem.is_crm_claimed">
                <div
                  class="changeStats"
                  v-if="
                    delcommafy(addCommom(caffeineAmount, 0)) > delcommafy(addCommom(currentKeyItem.minRequireAmount, 0))
                  "
                >
                  100%
                </div>
                <div class="caync">
                  <img :src="`/images/icon-${isdir}-Key-bright.png`" alt="" />
                  <!-- <img :src="`/_nuxt/img/${isdirIcon}.png`" alt="" /> -->
                  <!-- <img :src="`/images/${currentKeyItem.icon}.png`" alt="" /> -->
                </div>
                <Progress
                  :percent="
                    Math.ceil(
                      (delcommafy(addCommom(caffeineAmount, 0)) /
                        delcommafy(addCommom(currentKeyItem.minRequireAmount, 0))) *
                        100
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

              <img
                v-if="!wallet.connected"
                :class="!wallet.connected ? 'NotLink-img' : ''"
                src="@/assets/images/img-link-Wallet.png"
                alt=""
              />
              <h3 v-if="isClaimedText" class="congratulations">Congratulations</h3>
              <p v-if="wallet.connected" class="tips-text">{{ tipText || isClaimedText }}</p>
              <ul v-if="isClaimedText" class="reward-coin-list">
                <li>
                  <img src="@/assets/coins/crm.png" />
                  <span>x {{ currentKeyItem['crm'] }}</span>
                </li>
                <li>
                  <img src="@/assets/coins/hubble.png" />
                  <span>x {{ currentKeyItem['hubble'] }}</span>
                </li>
                <li>
                  <img src="@/assets/coins/port.png" />
                  <span>x {{ currentKeyItem['port'] }}</span>
                </li>
                <li>
                  <img src="@/assets/coins/nirv.png" />
                  <span>x {{ currentKeyItem['nirv'] }}</span>
                </li>
                <li>
                  <img src="@/assets/coins/marinade.png" />
                  <span>x {{ currentKeyItem['marinade'] }}</span>
                </li>
              </ul>
              <!-- <div class="nft-rewards"> -->
              <!-- <div>
                  <img src="@/assets/images/CRM.png" alt="">
                  <span>x 1,000</span>
                </div> -->
              <!-- </div> -->
            </div>

            <!-- isClaimedText -->
            <!-- <p v-if="wallet.connected && isClaim">Congratulations</p>
            <h3 v-if="wallet.connected && isClaim">Congratulations, this event the NFT got the rewards 1000 CRM</h3> -->

            <div class="farm-NFT-detail-Mint-pmgressbar">
              <!-- <div
                v-if="wallet.connected && !farmingIsEnd && !currentKeyItem.is_crm_claimed"
                class="pmgressbar-hint"
                :class="isdir"
              >
                <p v-if="isdir === 'Golden'">Gold</p>
                <p v-else>{{ isdir }}</p>
                <span>{{ addCommom(caffeineAmount, 0) }} / {{ addCommom(currentKeyItem.minRequireAmount, 0) }}</span>
              </div> -->
              <!-- <div v-if="wallet.connected && !farmingIsEnd && !currentKeyItem.is_crm_claimed" class="pmgressbar-detail">
                <div>
                  <div v-for="(item, index) in changeHintData" :key="index"></div>
                </div>
              </div> -->
              <!-- @mouseenter="changeHint(item.val)"
                  @mouseleave="changeHint" -->
              <div class="pmgressbar-btn">
                <Button
                  v-if="wallet.connected && !farmingIsEnd && !currentKeyItem.is_crm_claimed"
                  class="action-btn"
                  :disabled="!canMint"
                  @click="changeMint"
                >
                  <!-- <div @click="changeMint">Mint</div> -->
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
                  <!-- <div @click="changeUpgrade">Upgrade</div> -->
                  Upgrade
                </Button>
                <Button v-if="!wallet.connected" class="action-btn" @click="$accessor.wallet.openModal">
                  Connect a wallet
                </Button>
                <Button
                  v-if="wallet.connected && farmingIsEnd && currentKeyAmount > 0 && !isClaimedText"
                  class="action-btn"
                  @click="changeClaim"
                >
                  <!-- <div @click="changeClaim">Claim</div> -->
                  Open
                </Button>
              </div>
            </div>
          </div>
          <div class="farm-NFT-detail-Mint-Reight">
            <i class="card-left-icon">
              <img src="@/assets/images/icon-left-NFT.png" alt="" @click="changeImg('left')" />
            </i>
            <img
              v-if="currentKeyItem && currentKeyItem.icon"
              :src="
                currentKeyItem.mint ? `/images/${currentKeyItem.icon}.png` : `/images/icon-${currentKeyItem.icon}.png`
              "
              alt=""
              class="card-img"
            />
            <!-- <img
              v-if="currentKeyItem && currentKeyItem.icon"
              :src="`/images/${currentKeyItem.icon}.png`"
              alt=""
              class="card-img"
            /> -->
            <i class="card-right-icon">
              <img src="@/assets/images/icon-right-NFT.png" alt="" @click="changeImg('right')" />
            </i>

            <!-- <div v-if="!currentKeyItem.mint && wallet.connected" class="img-text">
              Rewards up to {{ nftPrice }} CRM tokens
            </div> -->
            <a
              v-if="wallet.connected && currentKeyItem && currentKeyItem.mint"
              class="img-text"
              style="margin-top: 6px"
              target="_blank"
              :href="`https://solscan.io/token/${currentKeyItem.mint}?cluster=devnet`"
            >
              {{ currentKeyItem.mint && currentKeyItem.mint.substr(0, 4) }}
              ...
              {{ currentKeyItem.mint && currentKeyItem.mint.substr(currentKeyItem.mint.length - 4, 4) }}
            </a>
          </div>
        </div>
      </div>
      <DMintNFTPopout
        v-if="showMint"
        :currentKeyItem="currentKeyItem"
        :isMinting="isMinting"
        @onClose="() => (showMint = false)"
        @toMint="toMint"
      />
      <ClaimRewards
        v-if="showClaim"
        :isClaiming="isClaiming"
        :currentKeyItem="currentKeyItem"
        :openRewardTimestamp="openRewardTimestamp"
        @onClose="() => (showClaim = false)"
        @toClaim="toClaim"
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
      this.showBurnModal = true
    },
    walletWatch(newValue) {
      if (newValue) {
        // this.getKeys()
        this.$emit('refreshKeysData')
        this.$accessor.farming.getEarnings()
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
      console.log(this.keyData[this.canUpgradeHeighKeyId])

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
      const rewarderKey = new PublicKey('9VdAkPH9WTiAEEr1fdSd5ycbK8Z3JsdyDuzxCk6vpJod')
      const positionWrapperWrapMint = new PublicKey('9aExwsPhX6i1NMdWgPG6odh8VxTfib2Fw2hLd1Tui9V4')
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
.farm-pool-table-NFT {
  width: 1400px;
  height: 500px;
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  padding-right: 180px;
}
.farm-caffeine {
  width: 600px;
  height: 500px;
  display: flex;
  justify-content: space-between;
  position: relative;
  > div:nth-child(1) {
    position: absolute;
    width: 460px;
    height: 460px;
    background: url('@/assets/images/img-NFT-left.png');
    background-size: 100% 100%;
  }
}
.farm-caffeine-title {
  width: 305px;
  height: 100%;
  display: flex;
  z-index: 100;
  align-items: center;
  justify-content: flex-end;
  > a {
    color: #fff;
    // cursor: pointer;
    margin-top: 10px;
  }
}
.farm-caffeine-option {
  width: 260px;
  height: 100%;
  position: relative;
  > div {
    position: absolute;
    display: flex;
    align-items: center;
    cursor: pointer;
    color: #b5b8c2;
  }
  .option-icon {
    width: 20px;
    height: 20px;
    margin-right: 8px;
    cursor: pointer;
  }
  .option-count {
    width: 34px;
    height: 24px;
    background: rgba(#000, 0.1);
    border-radius: 8px;
    margin-left: 8px;
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
    top: 33px;
    left: 30px;
    > .option-icon {
      background: url('@/assets/images/icon-Brass-Key-dark.png');
      background-size: 100% 100%;
    }
  }
  .option-Silver {
    top: 113px;
    left: 92px;
    > .option-icon {
      background: url('@/assets/images/icon-Silver-Key-dark.png');
      background-size: 100% 100%;
    }
  }
  .option-Golden {
    top: 190px;
    left: 110px;
    > .option-icon {
      background: url('@/assets/images/icon-Golden-Key-dark.png');
      background-size: 100% 100%;
    }
  }
  .option-Platinum {
    top: 270px;
    left: 94px;
    > .option-icon {
      height: 22px !important;
      background: url('@/assets/images/icon-Platinum-Key-dark.png');
      background-size: 100% 100%;
    }
  }
  .option-Diamond {
    top: 350px;
    left: 32px;
    > .option-icon {
      background: url('@/assets/images/icon-Diamond-Key-dark.png');
      background-size: 100% 100%;
    }
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
.farm-NFT-detail {
  width: 600px;
  height: 500px;
}
.farm-NFT-detail-caffeine {
  height: 85px;
  width: 100%;
  border-bottom: 1px solid rgba(#fff, 0.1);
  display: flex;
  img {
    width: 60px;
    height: 60px;
  }
  > div {
    width: 530px;
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    font-weight: bold;
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
}
.td-title {
  font-size: 12px;
  color: #b5b8c2;
  display: flex;
  align-items: center;
  margin-top: 8px;
  .icon {
    width: 14px;
    height: 14px;
    fill: #b5b8c2;
    margin-left: 12px;
    &:hover {
      fill: #fff;
    }
  }
}
.title-Harvest {
  color: #fff !important;
  cursor: pointer;
}
.td-text {
  font-size: 14px;
  font-weight: 800;
  color: #fff;
  margin-top: 10px;
  display: flex;
  align-items: center;
  height: 24px;
  img {
    width: 20px;
    height: 20px;
    margin-left: 7px;
  }
}
.burn-tips {
  display: flex;
  align-items: center;
  img {
    width: 20px;
    height: 20px;
  }
  span {
    font-size: 12px;
    font-family: Arial-BoldMT, Arial;
    font-weight: normal;
    color: #fff;
    line-height: 12px;
    background: linear-gradient(233deg, #5fe6d0 0%, #596cff 38%, #9380ff 72%, #e590ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-left: 4px;
  }
}
.farm-NFT-detail-Mint {
  height: 325px;
  margin-top: 12px;
  display: flex;
  justify-content: space-between;
}
.farm-NFT-detail-Mint-Left {
  width: 280px;
  height: 100%;
  display: flex;
  // flex-wrap: wrap;
  flex-direction: column;
  // justify-content: center;
  // align-content: space-between;
  .tips-text-box {
    height: 260px;
    position: relative;
    > img {
      width: 160px;
      height: 160px;
    }
    .congratulations {
      width: 100%;
      font-size: 18px;
      font-family: Krungthep;
      // line-height: 20px;
      background: linear-gradient(233deg, #89cfff 0%, #e0b9ff 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      height: 20px;
      margin-bottom: 25px;
      margin-top: 20px;
    }
    .tips-text {
      width: 100%;
      margin: 20px 0 0;
    }
    .nft-rewards {
      width: 100%;
      height: 100px;
      background: #000;
    }
    .reward-coin-list {
      width: 280px;
      display: flex;
      flex-wrap: wrap;
      li {
        display: flex;
        align-items: center;
        width: 50%;
        margin-top: 16px;
        img {
          width: 36px;
          height: 36px;
        }
        span {
          display: block;
          flex: 1;
          margin-left: 8px;
          height: 24px;
          font-size: 18px;
          font-family: Arial-BoldMT, Arial;
          font-weight: normal;
          color: #fff;
          line-height: 24px;
          background: linear-gradient(233deg, #4bb5ff 0%, #ce90ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      }
    }
    .tips-stats {
      .changeStats {
        position: absolute;
        width: 100%;
        text-align: center;
        top: 106px;
      }
      .interval {
        margin: 10px auto 0;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 50;
      }
      .caync {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 55px;
        height: 55px;
        border-radius: 50%;
        background: rgba(#fff, 0.1);
        position: absolute;
        z-index: 60;
        left: 113px;
        top: 40px;
        img {
          width: 20px;
          height: 20px;
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
  }
}
.farm-NFT-isClaim {
  justify-content: flex-start;
  align-content: space-around;
}
.farm-NFT-isClaim > .farm-NFT-detail-Mint-pmgressbar .pmgressbar-btn {
  justify-content: flex-start;
}
.NotLink-img {
  // margin-top: 80px;
  margin: 40px 0 0 60px;
}
.farm-NFT-detail-Mint-pmgressbar {
  height: 130px;
  width: 100%;
  position: relative;
}
.pmgressbar-hint {
  min-width: 100px;
  height: 40px;
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: flex-start;
  // flex-wrap: wrap;
  flex-direction: column;
  padding: 0 10px;
  // background: url('@/assets/images/caffeine-value.png');
  // background-size: 100% 100%;
  border-radius: 6px;
  position: absolute;
  p {
    margin: 0 !important;
    font-weight: 800;
    background: linear-gradient(283deg, #4cffdf 0%, #6676f5 62%, #c400ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}
.Brass {
  left: 0;
  border: 2px solid #d18945;
}
.Silver {
  left: 6px;
  border: 2px solid #e3f3ff;
}
.Golden {
  left: 53px;
  border: 2px solid #fbff7c;
}
.Platinum {
  left: 133px;
  border: 2px solid #6efbff;
}
.Diamond {
  right: 0;
  border: 2px solid #c495ff;
}
.pmgressbar-detail {
  width: 100%;
  height: 28px;
  margin-top: 48px;
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
      // cursor: pointer;
      // &:hover,
      // &.active {
      //   border: 2px #fff solid;
      // }
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
      left: 271px;
    }
  }
}
.pmgressbar-btn {
  width: 100%;
  margin-top: 24px;
  display: flex;
  justify-content: space-around;
}
.action-btn {
  // .farm-btn-small();
  .gradient-btn-large();
  width: 130px;
  height: 40px;
  font-size: 14px;
  font-weight: 100;
  div {
    line-height: 38px;
  }
}
.farm-NFT-detail-Mint-Reight {
  width: 276px;
  display: flex;
  align-items: center;
  position: relative;
  .img-text {
    display: block;
    width: 190px;
    left: 43px;
    text-align: center;
    position: absolute;
    top: 258px;
    color: #fff;
  }
  > a {
    &.img-text {
      &:hover {
        text-decoration: underline;
      }
    }
  }
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
}
</style>