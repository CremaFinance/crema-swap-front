<template>
  <div class="farming-container">
    <div class="farming-container-center">
      <!-- title开始 -->
      <div class="farming-title" @click="gotoMyPosition">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-icon-return"></use>
        </svg>
        Back to Farms
      </div>
      <!-- banner -->
      <div class="farming-banner">
        <!-- <img class="pc-banner" src="@/assets/images/farming-nav-pc.png" alt="" /> -->
        <DFarmingBanner class="pc-banner" :is-farming="showFarm" />
        <!-- <img class="h5-banner" src="@/assets/images/farming-banner-h5.png" alt="" /> -->
        <H5DFarmingBanner class="h5-banner" :is-farming="showFarm" />
      </div>
      <!-- NFT -->
      <DfarmCaffeine class="pc-farming-pool" :earnings-amount="earningsAmount" :caffeine-amount="caffeineAmount" />
      <H5DfarmCaffeine class="h5-farming-pool" :earnings-amount="earningsAmount" :caffeine-amount="caffeineAmount" />
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
// import { Input } from 'ant-design-vue'
import { checkNullObj } from '@/utils'
import { TokenAmount, gt } from '@/utils/safe-math'

export default Vue.extend({
  data() {
    return {
      poolStatus: 'All',
      searchKey: '',
      showFarm: 'Farm',
      earningsAmount: 0
    }
  },
  computed: {
    ...mapState(['wallet', 'farming']),
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
      return '0'
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
    }
  },
  methods: {
    gotoMyPosition() {
      this.$router.push('/farming')
    },
    walletWatch(newVal) {
      if (newVal) {
        this.$accessor.farming.getEarningsObj()
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
    }
  }
})
</script>
<style lang="less" scoped>
.farming-container {
  background: url('@/assets/images/farm-background.png');
  background-size: 100% 100%;
  overflow: hidden;
  margin-top: -20px;
  padding-top: 20px;
  .farming-container-center {
    width: 1400px;
    margin: auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    .farming-title {
      width: 1000px;
      display: flex;
      align-items: center;
      cursor: pointer;
      .icon {
        width: 20px;
        height: 20px;
        fill: #b5b8c2;
        margin-right: 4px;
      }
      &:hover {
        color: #fff;
        .icon {
          fill: #fff;
        }
      }
      font-size: 14px;
      color: #b5b8c2;
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
    background: none;
    .farming-container-center {
      width: 100%;
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
