<template>
  <div class="farming-container">
    <div class="farming-container-center">
      <!-- title开始 -->
      <div class="farming-title">
        <div @click="gotoMyPosition">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-icon-return"></use>
          </svg>
          Back to Farms
        </div>
        <RefreshIcon :loading="refreshLoading" @refresh="toRefresh"></RefreshIcon>
      </div>
      <!-- banner -->
      <div class="farming-banner">
        <!-- <img class="pc-banner" src="@/assets/images/farming-nav-pc.png" alt="" /> -->
        <DFarmingBanner class="pc-banner" :is-farming="showFarm" />
        <!-- <img class="h5-banner" src="@/assets/images/farming-banner-h5.png" alt="" /> -->
        <H5DFarmingBanner class="h5-banner" :is-farming="showFarm" />
      </div>
      <!-- NFT -->
      <DfarmCaffeine
        class="pc-farming-pool"
        :earnings-amount="earningsAmount"
        :caffeine-amount="caffeineAmount"
        :name-obj="nameObj"
        :keys-obj="processedKeysObj.newObj"
        :count-obj="processedKeysObj.countObj"
        :keys-list="keysList"
        @refreshKeysData="refreshKeysData"
      />
      <H5DfarmCaffeine
        class="h5-farming-pool"
        :earnings-amount="earningsAmount"
        :caffeine-amount="caffeineAmount"
        :name-obj="nameObj"
        :keys-obj="processedKeysObj.newObj"
        :count-obj="processedKeysObj.countObj"
        :keys-list="keysList"
        @refreshKeysData="refreshKeysData"
      />
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
// import { Input } from 'ant-design-vue'
import { checkNullObj } from '@/utils'
import { TokenAmount, gt } from '@/utils/safe-math'
import {
  makeSDK,
  fetchCremakeys,
  getMasterPda,
  fetchActivitymaster,
  quarryInfo,
  fetchTransferInfoMap
} from '@/contract/farming'

export default Vue.extend({
  data() {
    return {
      poolStatus: 'All',
      searchKey: '',
      showFarm: 'Farm',
      earningsAmount: 0,
      historyObj: {} as any,
      keysObj: null as any,
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
      keysList: [] as any,
      loadings: false,
      refreshLoading: false,
      refreshTimer: null,
      nameObj: {} as any
      // : {} as any
    }
  },
  computed: {
    ...mapState(['wallet', 'farming']),
    caffeineAmount() {
      if (this.wallet && this.wallet.tokenAccounts && this.wallet.connected) {
        const account: any = this.wallet.tokenAccounts
        // console.log('account###', account)
        let caffeineAmount = new TokenAmount(0)
        if (account['CAFTP2Yof8bJuwSScigqnZaLQKiBzECgJPxvEDzfivzw']) {
          caffeineAmount = account['CAFTP2Yof8bJuwSScigqnZaLQKiBzECgJPxvEDzfivzw'].balance
          return caffeineAmount.fixed()
        }
      }
      return '0'
    },
    processedKeysObj() {
      const newObj: any = {}
      const countObj: any = {}
      console.log('processedKeysObj###this.keysObj####', this.keysObj)
      console.log('processedKeysObj###historyObj###', this.historyObj)
      for (const k in this.keysObj) {
        const newlist: any = []
        const itemList: any = this.keysObj[k]
        let count = 0
        itemList.forEach((item) => {
          console.log('this.keyBaseData[k]####', this.keyBaseData[k])
          if (this.historyObj[item.mint]) {
            const newItem = {
              ...item,
              ...this.historyObj[item.mint],
              ...this.keyBaseData[k]
            }
            newlist.push(newItem)
          } else {
            count++
            const newItem = {
              ...item,
              ...this.keyBaseData[k]
            }
            newlist.push(newItem)
          }
        })
        newObj[k] = newlist
        countObj[k] = count
      }
      console.log('processedKeysObj###newObj###', newObj)
      return {
        newObj,
        countObj
      }
    }
  },
  watch: {
    'wallet.connected': {
      handler: 'walletWatch',
      immediate: true
    },
    'farming.earningObj': {
      handler: 'earningObjWatch',
      immediate: true
    },
    processedKeysObj: {
      handler: 'processedKeysObjWatch',
      immediate: true
    }
  },
  mounted() {
    this.refreshTimer = setInterval(() => {
      this.toRefresh()
    }, 20000)
  },
  destroyed() {
    clearInterval(this.refreshTimer)
    this.refreshTimer = null
  },
  methods: {
    toRefresh() {
      this.refreshLoading = true
      let promise: any = []

      if (this.wallet.connected) {
        promise = [this.getKeys(), this.$accessor.wallet.getTokenAccounts(), this.$accessor.farming.getEarningsObj()]
      } else {
        promise = [this.getKeys()]
      }
      Promise.all(promise)
        .then((res) => {
          this.refreshLoading = false
        })
        .catch(() => {
          this.refreshLoading = false
        })
    },
    processedKeysObjWatch(newVal) {
      console.log('processedKeysObjWatch###newVal###', newVal)
      const list: any = []
      const keysObj: any = newVal.newObj
      for (const k in this.keyBaseData) {
        if (keysObj[k]) {
          keysObj[k].forEach((item) => {
            list.push(item)
          })
        } else {
          list.push(this.keyBaseData[k])
        }
      }

      console.log('this.keysList####', list)
      this.keysList = list
    },
    gotoMyPosition() {
      this.$router.push('/farming')
    },
    walletWatch(newVal) {
      if (newVal) {
        this.$accessor.farming.getEarningsObj()
        // this.getKeys()
        // this.getClaimedHistory()
        this.refreshKeysData()
      } else {
        this.keysObj = null
        this.earningsAmount = 0
      }
    },
    earningObjWatch(newVal) {
      if (!checkNullObj(newVal)) {
        let result: number = 0
        for (let key in newVal) {
          result += Number(newVal[key].value)
        }
        this.earningsAmount = result
      }
    },
    refreshKeysData() {
      this.getKeys()
      // this.getClaimedHistory()
    },
    getReardCoinINfo() {},
    async getKeys() {
      console.log('active###getKeys了####')
      const wallet = (this as any).$wallet
      const conn = this.$web3
      // const namesObj = await fetchTransferInfoMap(conn, wallet)
      // this.nameObj = namesObj
      // console.log('namesObj####', namesObj)
      const keys = await fetchCremakeys(conn, wallet, wallet.publicKey)
      console.log('getKeys###keys####', keys)
      this.keysObj = keys
    },
    async getClaimedHistory() {
      // this.$axios.get(`https://api.crema.finance/v1/swap/count`).then((res) => {
      const wallet = (this as any).$wallet
      const res = await this.$axios.get(
        `https://dev-api-crema.bitank.com/activity/history/${wallet.publicKey.toString()}`
      )
      console.log('history#####', res)
      let historyObj: any = {}
      if (res && res.data && res.data.history) {
        res.data.history.forEach((item) => {
          historyObj[item.mint_key] = item
        })
      }
      this.historyObj = historyObj
    }
  }
})
</script>
<style lang="less" scoped>
.farming-container {
  background: url('@/assets/images/farm-background.png');
  background-size: 100% 100%;
  overflow: hidden;
  margin-top: -10px;
  padding-top: 20px;
  width: 100%;
  .farming-container-center {
    // width: 1600px;
    margin: auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    .farming-title {
      width: 1000px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      .icon {
        width: 20px;
        height: 20px;
        fill: #b5b8c2;
        margin-right: 4px;
      }

      font-size: 14px;
      color: #b5b8c2;
      > div {
        display: flex;
        align-items: center;
        &:hover {
          color: #fff;
          .icon {
            fill: #fff;
          }
        }
      }
    }
    .farming-banner {
      margin-top: 15px;
      border-radius: 20px;
      img {
        width: 1000px;
        height: 160px;
      }
      .h5-banner {
        display: none;
      }
      .pc-banner {
        width: 1600px;
        display: flex;
        justify-content: center;
      }
    }
    .h5-search-pool {
      display: none;
    }
    .pc-farming-pool {
      display: block;
    }
    .h5-farming-pool {
      display: none;
    }
  }
}
@media screen and (max-width: 1370px) {
  .farming-container {
    margin-top: -40px;
  }
}
@media screen and (max-width: 750px) {
  .farming-container {
    width: 100%;
    padding: 40px 0px 0;
    margin-top: 0px;
    padding-top: 20px;
    background: none;
    .farming-container-center {
      width: 100%;
      .farming-title {
        margin-top: 8px;
      }
      .farming-banner {
        width: 100%;
        .pc-banner {
          display: none;
        }
        .h5-banner {
          display: block;
          width: 100%;
          // height: 88px;
          height: auto;
        }
      }
      .h5-search-pool {
        width: 100%;
        margin-top: 20px;
        padding-left: 20px;
        padding-right: 5px;
        background: #23262b;
        box-shadow: 0px 0px 2px 0px #535966, 0px 2px 3px 1px #1a1c1f;
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        input {
          border: none;
          outline: none;
          background: #23262b;
          line-height: 40px;
        }
        .input-search {
          width: 30px;
          height: 30px;
          background: url('../assets/images/input-search.png');
          background-size: 100% auto;
        }
      }
      .pc-farming-pool {
        display: none;
      }
      .h5-farming-pool {
        display: block;
      }
    }
  }
}
</style>
