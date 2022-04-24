<template>
  <div class="farming-container">
    <div class="farming-container-center">
      <!-- title开始 -->
      <div class="farming-title">
        <h3 class="title">Farming</h3>
        <!-- <div class="refresh-icon-box"> -->
        <!-- <svg class="icon" aria-hidden="true" @click="toRefresh">
            <use xlink:href="#icon-icon-refresh"></use>
          </svg> -->
        <RefreshIcon @refresh="toRefresh" :loading="farming.loading"></RefreshIcon>
        <!-- </div> -->
      </div>
      <!-- banner -->
      <div class="farming-banner">
        <DFarmingBanner class="pc-banner" :is-farming="showFarm" />
        <H5DFarmingBanner class="h5-banner" :is-farming="showFarm" />
        <!-- <img class="h5-banner" src="@/assets/images/farming-banner-h5.png" alt="" /> -->
      </div>

      <div class="farming-pool-container">
        <div v-if="farming.farmingListLoading" class="loading-box"><Spin /></div>
        <!-- 池子列表 -->
        <FarmingPoolNew
          class="pc-farming-pool"
          :tvlData="tvlData"
          :is-staked="poolStatus"
          :search-key="searchKey"
          @refreshData="toRefresh"
        ></FarmingPoolNew>
        <H5FarmingPoolNew
          class="h5-farming-pool"
          :tvlData="tvlData"
          :is-staked="poolStatus"
          :search-key="searchKey"
          @refreshData="toRefresh"
        ></H5FarmingPoolNew>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { Input, Spin } from 'ant-design-vue'
import { mapState } from 'vuex'
import { fixD, addCommom, decimalFormat, checkNullObj } from '@/utils'
import { TokenSwap, calculateTokenAmount, tick2Price } from '@cremafinance/crema-sdk'
export default Vue.extend({
  components: {
    Spin
  },
  data() {
    return {
      poolStatus: 'All',
      searchKey: '',
      showFarm: 'Farming',
      tvlData: null,
      timer: null,
      earningTimer: null
    }
  },
  computed: {
    ...mapState(['farming', 'wallet', 'liquidity']),
    farmingConfigData() {
      return {
        walletConnected: this.wallet.connected,
        rates: this.liquidity.rates,
        farmingConfigObj: this.farming.farmingConfigObj,
        tvlData: this.tvlData
      }
    }
  },
  watch: {
    // 'wallet.connected': {
    //   handler: 'walletWatch',
    //   immediate: true
    // },
    farmingConfigData(newVal, oldVal) {
      console.log('123getFarmingList###farmingConfigData####newVal###', newVal)
      if (newVal.rates && newVal.farmingConfigObj && newVal.tvlData && this.farming.farmingList.length < 1) {
        this.$accessor.farming.getFarmingList({
          rates: newVal.rates,
          farmingConfig: newVal.farmingConfigObj,
          haveLoading: true,
          tvlData: newVal.tvlData
        })
      }
      if (
        newVal.rates &&
        newVal.farmingConfigObj &&
        newVal.tvlData &&
        newVal.walletConnected &&
        checkNullObj(this.farming.earningObj)
      ) {
        this.$accessor.farming.getEarningsObj(true)
      }
    }
  },
  created() {
    this.getFarmTvl()
    this.$accessor.farming.getFarmingConfig()
  },
  mounted() {
    const _this = this
    this.timer = setInterval(function () {
      console.log('123getFarmingList###进到轮循了')
      _this.toRefresh(true)
    }, 60000)
  },
  destroyed() {
    clearInterval(this.timer)
    this.timer = null

    // clearInterval(this.earningTimer)
    // this.earningTimer = null
  },
  methods: {
    getFarmTvl() {
      this.$axios.get(`https://pre-api-crema.bitank.com/farm/tvl`).then((res) => {
        // this.$axios.get(`/farm/tvl`).then((res) => {
        console.log('farmingTest####getFarmTvl###res#####', res)
        const result: any = {}
        // const farmingConfg = this.farming.farmingConfg
        if (res && res.wrappers) {
          res.wrappers.forEach((item) => {
            const apr = item.apr * 100
            const tvl = item.tvl
            // console.log('farmingConfgsdfsdf####', farmingConfg)
            // const farmingConfigItem = farmingConfg.filter((fitem) => fitem.positionWrapper === item.address)
            // console.log('farmingConfigItem####', farmingConfigItem)
            result[item.address] = {
              ...item,
              aprView: apr > 10000 ? Infinity : `${fixD(apr, 2)}%`,
              tvlView: tvl ? `$ ${addCommom(tvl, 2)}` : '--',
              etrMinPrice: decimalFormat(tick2Price(item.etrMin).toString(), 6),
              etrMaxPrice: decimalFormat(tick2Price(item.etrMax).toString(), 6)
            }
          })
        }

        this.tvlData = result
      })
    },
    // walletWatch(newVal) {
    //   const _this = this
    //   if (newVal) {
    //     _this.refreshEarningsObj()
    //     this.earningTimer = setInterval(function () {
    //       _this.refreshEarningsObj()
    //     }, 20000)
    //   } else {
    //     clearInterval(this.earningTimer)
    //     this.earningTimer = null
    //   }
    // },
    refreshEarningsObj() {
      this.$accessor.farming.getEarningsObj()
    },
    toRefresh(unLoaidng) {
      this.$accessor.farming.getFarmingList({
        rates: this.farmingConfigData.rates,
        farmingConfig: this.farmingConfigData.farmingConfigObj,
        haveLoading: !unLoaidng,
        tvlData: this.tvlData
      })
      this.getFarmTvl()
      if (this.wallet.connected) {
        this.$accessor.farming.getEarningsObj(!unLoaidng)
        this.$accessor.wallet.getTokenAccounts()
      }
    }
  }
})
</script>
<style lang="less" scoped>
.farming-container {
  .farming-container-center {
    width: 1100px;
    margin: auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    .farming-title {
      width: 1000px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 28px;
      padding-bottom: 20px;
      .title {
        // font-size: 20px;
        // font-weight: normal;
        // color: #B5B8C2;
        font-size: 20px;
        color: #fff;
        // padding: 28px 0px 12px;
        margin-bottom: 0px;
        font-weight: 700;
      }
      // .refresh-icon-box {
      //   width: 30px;
      //   height: 30px;
      //   background: linear-gradient(141deg, #383e49 0%, #1a1c1f 100%);
      //   box-shadow: 2px 4px 12px 0px #23262b, -3px -2px 10px 0px rgba(138, 147, 160, 0.16);
      //   border-radius: 15px;
      //   // border-image: linear-gradient(137deg, rgba(35, 38, 43, 1), rgba(62, 67, 78, 1)) 1 1;
      //   padding: 6px;

      //   & + .icon-box {
      //     margin-left: 20px;
      //   }

      //   &:hover {
      //     background: linear-gradient(141deg, #424953 0%, #2a2e33 100%);
      //   }
      // }
      .icon {
        width: 18px;
        height: 18px;
        // fill: rgba(255, 255, 255, 0.5);
        fill: #fff;
        cursor: pointer;
        // &:hover {
        //   fill: #fff;
        // }
      }
      .title-right {
        display: flex;
        align-items: center;
        .pool-status-tab {
          display: flex;
          max-height: 28px;
          cursor: pointer;
          padding: 2px;
          line-height: 1;
          background: rgba(255, 255, 255, 0.1);
          // background: red;
          border-radius: 8px;
          .pool-status-staked-active {
            padding: 5px 9px;
            background: linear-gradient(233deg, #4bb5ff 0%, #ce90ff 100%);
            box-shadow: 0px 2px 9px 0px rgba(0, 0, 0, 0.3), -3px -3px 5px 0px rgba(255, 255, 255, 0.1);
            border-radius: 7px;
            font-size: 14px;
            color: #fff;
          }
          .pool-status-staked {
            padding: 5px 9px;
          }
          .pool-status-all {
            padding: 5px 23px 5px 19px;
          }
          .pool-status-all-active {
            padding: 5px 23px 5px 19px;
            background: linear-gradient(233deg, #4bb5ff 0%, #ce90ff 100%);
            box-shadow: 0px 2px 9px 0px rgba(0, 0, 0, 0.3), -3px -3px 5px 0px rgba(255, 255, 255, 0.1);
            border-radius: 7px;
            font-size: 14px;
            color: #fff;
          }
        }
        .search-pool {
          width: 273px;
          margin-left: 20px;
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
      }
    }
    .farming-banner {
      border-radius: 20px;
      img {
        width: 1000px;
        height: 160px;
      }
      .h5-banner {
        display: none;
      }
    }
    .farming-pool-container {
      width: 1000px;
      // min-height: 80px;
      position: relative;
      margin-top: 20px;
    }
    .loading-box {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      // height: 200px;
      position: absolute;
      left: 0px;
      top: 0px;
      right: 0px;
      bottom: 0px;
      z-index: 9999;
      background: rgba(0, 0, 0, 0.4);
      border-radius: 20px;
    }
    .pc-farming-pool {
      display: block;
    }
    .h5-farming-pool {
      display: none;
    }
  }
}
@media screen and (max-width: 750px) {
  .farming-container {
    width: 100%;
    // padding: 20px 16px 0;
    .farming-container-center {
      width: 100%;
      .farming-title {
        .title-right {
          .search-pool {
            display: none;
          }
        }
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
          // height: auto;
        }
      }
      .farming-pool-container {
        width: 100%;
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
