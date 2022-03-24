<template>
  <div>
    <div class="farm-pool-table-NFT">
      <div class="farm-caffeine">
        <div></div>
        <div class="farm-caffeine-title"><div>Learn more ></div></div>
        <div class="farm-caffeine-option" :class="changeBtn">
          <div v-for="(item, index) in keyData" :key="index" :class="item.name" @click="changeIcon(item)">
            <div class="option-icon"></div>
            {{ item.key }}
            <div v-if="keysObj && keysObj[item.id]" class="option-count">
              <div></div>
              {{ keysObj[item.id].length }}
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
              <div class="td-text">{{ caffeineAmount }}</div>
            </div>
            <!-- <div>
              <div class="td-title">Total Earned</div>
              <div class="td-text">106.8%</div>
            </div> -->
            <div>
              <div class="td-title">Earnings <span class="title-Harvest">&nbsp;&nbsp;Harvest&nbsp;></span></div>
              <div class="td-text" style="text-align: right !important">{{ farming.earnings }}</div>
            </div>
          </div>
        </div>
        <div class="farm-NFT-detail-Mint">
          <div class="farm-NFT-detail-Mint-Left" :class="isClaim ? 'farm-NFT-isClaim' : ''">
            <!-- <div v-if="wallet.connected && !isClaim" style="height: 160px; padding: 60px 0">
              Still need to produce xxx caffeine to mint NFT
            </div> -->
            <div class="tips-text-box">
              <img
                v-if="!wallet.connected"
                :class="!wallet.connected ? 'NotLink-img' : ''"
                src="@/assets/images/img-link-Wallet.png"
                alt=""
              />
              <h3 class="congratulations">{{ tipsTowLineText ? 'Congratulations' : '' }}</h3>
              <p class="tips-text">{{ tipText || tipsTowLineText }}</p>
            </div>

            <!-- tipsTowLineText -->
            <!-- <p v-if="wallet.connected && isClaim">Congratulations</p>
            <h3 v-if="wallet.connected && isClaim">Congratulations, this event the NFT got the rewards 1000 CRM</h3> -->

            <div class="farm-NFT-detail-Mint-pmgressbar">
              <div v-if="wallet.connected && !isClaim" class="pmgressbar-hint" :class="isdir">
                <p>{{ isdir }}</p>
                <span>1,000 / 2,000</span>
              </div>
              <div v-if="wallet.connected && !isClaim" class="pmgressbar-detail">
                <div>
                  <div v-for="(item, index) in changeHintData" :key="index"></div>
                  <!-- @mouseenter="changeHint(item.val)"
                  @mouseleave="changeHint" -->
                </div>
              </div>
              <div class="pmgressbar-btn">
                <Button v-if="wallet.connected && !isClaim" class="action-btn" @click="changeMint">
                  <!-- <div @click="changeMint">Mint</div> -->
                  Mint
                </Button>
                <Button v-if="wallet.connected && !isClaim" class="action-btn" @click="changeUpgrade">
                  <!-- <div @click="changeUpgrade">Upgrade</div> -->
                  Upgrade
                </Button>
                <Button v-if="!wallet.connected" class="action-btn"> Connect a wallet </Button>
                <Button v-if="wallet.connected && isClaim" class="action-btn" @click="changeClaim">
                  <!-- <div @click="changeClaim">Claim</div> -->
                  Claim
                </Button>
              </div>
            </div>
          </div>
          <div class="farm-NFT-detail-Mint-Reight">
            <img src="@/assets/images/icon-left-NFT.png" alt="" @click="changeImg('left')" />
            <img :src="`/_nuxt/src/assets/images/${farmCard}.png`" alt="" />
            <img src="@/assets/images/icon-right-NFT.png" alt="" @click="changeImg('right')" />
            <div>Rewards up to {{ nftPrice }} CRM tokens</div>
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
      <ClaimRewards v-if="showClaim" @onClose="() => (showClaim = false)" />
      <DUpgradeNFTPopout v-if="showUpgrade" @onClose="() => (showUpgrade = false)" />
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import importIcon from '@/utils/import-icon'
import { QuarrySDK, MinerWrapper, PositionWrapper } from 'test-quarry-sdk'
import invariant from 'tiny-invariant'
import { makeSDK, fetchCremakeys } from '@/contract/farming'
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
import { TokenAmount, gt } from '@/utils/safe-math'
// import { Button } from 'ant-design-vue'
// Vue.use(Button)
export default Vue.extend({
  components: {
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
      keyData: [
        {
          id: 1,
          icon: 'Card-Bronze',
          img: 'Brass_Key',
          name: 'option-Bronze',
          key: 'Brass Key',
          num: '',
          minRequireAmount: 2000,
          upgradeMinAmount: 3000,
          maxpreReward: 300
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
          maxpreReward: 700
        },
        {
          id: 3,
          icon: 'Card-Golden',
          img: 'Golden_Key',
          name: 'option-Golden',
          key: 'Golden Key',
          num: '',
          minRequireAmount: 10000,
          upgradeMinAmount: 7000,
          maxpreReward: 1300
        },
        {
          id: 4,
          icon: 'Card-Platinum',
          img: 'Platinum_Key',
          name: 'option-Platinum',
          key: 'Platinum Key',
          num: '',
          minRequireAmount: 17000,
          upgradeMinAmount: 9000,
          maxpreReward: 2100
        },
        {
          id: 5,
          icon: 'Card-Diamond',
          img: 'Diamond_Key',
          name: 'option-Diamond',
          key: 'Diamond Key',
          num: '',
          minRequireAmount: 26000,
          maxpreReward: 3100
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
      currentKeyItem: {
        id: 1,
        icon: 'Card-Bronze',
        img: 'Brass_Key',
        name: 'option-Bronze',
        key: 'Brass Key',
        num: '',
        minRequireAmount: 2000,
        upgradeMinAmount: 3000,
        maxpreReward: 300
      },
      keysObj: {}
    }
  },
  computed: {
    ...mapState(['wallet', 'transaction', 'url', 'farming']),
    caffeineAmount() {
      if (this.wallet && this.wallet.tokenAccounts) {
        const account: any = this.wallet.tokenAccounts
        // console.log('account###', account)
        let caffeineAmount = new TokenAmount(0)
        if (account['32JXVurQacMxQF6qFxKkeAbysQcXsCakuYx3eyYRBoSR']) {
          caffeineAmount = account['32JXVurQacMxQF6qFxKkeAbysQcXsCakuYx3eyYRBoSR'].balance
          return caffeineAmount.fixed()
        }
      }
      return 0
    },
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

      // 2、当前不存在NFT
      if (this.currentKeyAmount < 1 && this.caffeineAmount < this.currentKeyItem.minRequireAmount) {
        return `You need  ${this.currentKeyItem.minRequireAmount - this.caffeineAmount} more Caffeine to mint a new ${
          this.currentKeyItem.key
        }. `
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
        return `You need ${
          this.currentKeyItem.upgradeMinAmount - this.caffeineAmount
        } more Caffeine to upgrade this key. `
      }

      // 5、该等级下存在NFT 时，可升级时
      if (
        this.currentKeyItem.id !== 5 &&
        this.currentKeyAmount > 0 &&
        this.caffeineAmount >= this.currentKeyItem.upgradeMinAmount
      ) {
        return `You are eligible to upgrade this key to a ${this.canUpgradeHeighKeyName}.`
      }

      return ''
    },
    canMintKeyName() {
      if (this.caffeineAmount >= 26000) {
        return 'Diamond Key'
      } else if (this.caffeineAmount >= 17000) {
        return 'Platinum Key'
      } else if (this.caffeineAmount >= 10000) {
        return 'Golden Key'
      } else if (this.caffeineAmount >= 5000) {
        return 'Silver Key'
      } else if (this.caffeineAmount >= 2000) {
        return 'Brass Key'
      }
      return ''
    },
    canUpgradeHeighKeyName() {
      if (this.currentKeyItem.id === 5) return ''
      let i = 4
      while (i > 0) {
        if (this.caffeineAmount >= this.keyData[i].minRequireAmount - this.currentKeyItem.minRequireAmount) {
          return this.keyData[i].key
        }
        i--
      }
      return ''
    },
    tipsTowLineText() {
      return ''
    }
  },
  watch: {
    changeBtn(newValue, oldValue) {
      if (newValue == 'Card-Bronze') {
        this.isClaim = false
        this.isNotLink = false
        this.nftPrice = '300'
        this.isdir = 'Brass'
      } else if (newValue == 'Card-Silver') {
        this.isClaim = false
        this.isNotLink = false
        this.nftPrice = '700'
        this.isdir = 'Silver'
      } else if (newValue == 'Card-Golden') {
        this.isClaim = false
        this.isNotLink = false
        this.nftPrice = '1,300'
        this.isdir = 'Golden'
      } else if (newValue == 'Card-Platinum') {
        this.isClaim = false
        this.isNotLink = false
        this.nftPrice = '2,100'
        this.isdir = 'Platinum'
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
    }
    // currentKeyItem(newVal, oldVal) {
    //   if (newVal && this.caffeineAmount > 2000) {
    //     this.tipText =
    //   }
    // }
  },
  mounted() {},
  methods: {
    importIcon,
    // changeHint(value: string) {
    //   this.hint = value
    //   this.isShowHint = !this.isShowHint
    // },
    walletWatch(newValue) {
      if (newValue) {
        this.getKeys()
        this.$accessor.farming.getEarnings()
        // this.$accessor.farming.getCaffeineAmount()
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

      console.log('changeIcon####val####', item)

      this.currentKeyItem = item
    },
    changeImg(key) {
      if (key == 'left') {
        this.changeBtn =
          this.changeBtn == 'Card-Bronze'
            ? 'Card-Diamond'
            : this.changeBtn == 'Card-Silver'
            ? 'Card-Bronze'
            : this.changeBtn == 'Card-Golden'
            ? 'Card-Silver'
            : this.changeBtn == 'Card-Platinum'
            ? 'Card-Golden'
            : this.changeBtn == 'Card-Diamond'
            ? 'Card-Platinum'
            : 'Card-Diamond'
        this.farmCard = this.changeBtn
      } else {
        this.changeBtn =
          this.changeBtn == 'Card-Bronze'
            ? 'Card-Silver'
            : this.changeBtn == 'Card-Silver'
            ? 'Card-Golden'
            : this.changeBtn == 'Card-Golden'
            ? 'Card-Platinum'
            : this.changeBtn == 'Card-Platinum'
            ? 'Card-Diamond'
            : this.changeBtn == 'Card-Diamond'
            ? 'Card-Bronze'
            : 'Card-Diamond'
        this.farmCard = this.changeBtn
      }
    },
    async getKeys() {
      const wallet = (this as any).$wallet
      const conn = this.$web3
      console.log('wallet.publicKey#####', wallet.publicKey.toString())
      const keys = await fetchCremakeys(conn, wallet, wallet.publicKey)
      console.log('keys#####', keys)
      this.keysObj = keys
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

      try {
        console.log('到这里了吗#####')
        const res = await sdk.activity.mintCremaKey({
          user: wallet.publicKey,
          degree
        })
        console.log('res#####', res)
        const receipt = await res.tx.confirm()
        this.$accessor.transaction.setShowWaiting(false)
        console.log('receipt####', receipt)
        if (receipt && receipt.signature) {
          const txid = receipt.signature
          const description = `Mint NFT`
          this.$accessor.transaction.sub({ txid, description })
          this.$accessor.transaction.setShowSubmitted(true)
          const _this = this
          conn.onSignature(txid, function (signatureResult: SignatureResult, context: Context) {
            _this.isMinting = false
            _this.isDisabled = false
            if (!signatureResult.err) {
              // _this.$accessor.farming.getFarmingList()
              // 监听到成功后刷新
              _this.getKeys()
            }
          })
        }
      } catch (err) {
        console.log('toMint ERROR#####', err)
        this.$accessor.transaction.setShowWaiting(false)
        this.isMinting = false
        this.isDisabled = false
      }
    },
    async toUpgrade(mint: PublicKey) {
      this.isUpgrading = true
      this.isDisabled = true
      const wallet = (this as any).$wallet
      const conn = this.$web3

      const sdk: any = makeSDK(conn, wallet)
      const authoritySdk = sdk.provider.walletKey
      invariant(wallet.publicKey.toBase58() == authoritySdk.toBase58(), 'user is the same to sdk')

      try {
        const tx = await sdk.activity.upgrade({
          user: wallet.publicKey,
          mint
        })

        const receipt = await tx.confirm()

        this.$accessor.transaction.setShowWaiting(false)
        console.log('receipt####', receipt)
        if (receipt && receipt.signature) {
          const txid = receipt.signature
          const description = `Upgrade`
          this.$accessor.transaction.sub({ txid, description })
          this.$accessor.transaction.setShowSubmitted(true)
          const _this = this
          conn.onSignature(txid, function (signatureResult: SignatureResult, context: Context) {
            _this.isUpgrading = false
            _this.isDisabled = false
            if (!signatureResult.err) {
              // _this.$accessor.farming.getFarmingList()
              // 监听到成功后刷新
            }
          })
        }
      } catch (err) {
        this.$accessor.transaction.setShowWaiting(false)
        this.isUpgrading = false
        this.isDisabled = false
      }
    },
    async toClaim(mint: PublicKey) {
      this.isClaiming = true
      this.isDisabled = true
      const wallet = (this as any).$wallet
      const conn = this.$web3

      const sdk: any = makeSDK(conn, wallet)
      const authoritySdk = sdk.provider.walletKey
      invariant(wallet.publicKey.toBase58() == authoritySdk.toBase58(), 'user is the same to sdk')

      try {
        const tx = await sdk.activity.claimReward({
          user: wallet.publicKey,
          mint
        })
        const receipt = await tx.confirm()
        this.$accessor.transaction.setShowWaiting(false)
        console.log('receipt####', receipt)
        if (receipt && receipt.signature) {
          const txid = receipt.signature
          const description = `Upgrade`
          this.$accessor.transaction.sub({ txid, description })
          this.$accessor.transaction.setShowSubmitted(true)
          const _this = this
          conn.onSignature(txid, function (signatureResult: SignatureResult, context: Context) {
            _this.isClaiming = false
            _this.isDisabled = false
            if (!signatureResult.err) {
              // _this.$accessor.farming.getFarmingList()
              // 监听到成功后刷新
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
  > div {
    cursor: pointer;
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
  img {
    width: 20px;
    height: 20px;
    margin-left: 7px;
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
  margin-top: 80px;
}
.farm-NFT-detail-Mint-pmgressbar {
  height: 130px;
  width: 100%;
  position: relative;
}
.pmgressbar-hint {
  width: 100px;
  height: 40px;
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: flex-start;
  flex-wrap: wrap;
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
      cursor: pointer;
      &:hover,
      &.active {
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
  // justify-content: space-between;
  position: relative;
  img:nth-child(2) {
    width: 240px;
  }
  img:nth-child(1),
  img:nth-child(3) {
    width: 14px;
    height: 44px;
    margin-bottom: 68px;
    cursor: pointer;
  }
  img:nth-child(1),
  img:nth-child(2) {
    margin-right: 4px;
  }
  div {
    width: 190px;
    left: 43px;
    text-align: center;
    position: absolute;
    top: 258px;
  }
}
</style>