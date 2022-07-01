<template>
  <div class="farming-container">
    <div class="banners-all">
      <img class="banners-pc" src="../assets/images/farming-img-banner.png" alt="" />
      <img class="banners-h5" src="../assets/images/farming-img-banner-h5.png" alt="" />
      <nuxt-link to="/active" class="farming-jump"></nuxt-link>
    </div>
    <div class="farming-container-center">
      <!-- title开始 -->
      <div class="farming-title">
        <div class="type-tab">
          <span
            v-for="item in typeList"
            :key="item.value"
            :class="item.value == currentType ? 'active' : ''"
            @click="selectType(item.value)"
          >
            {{ item.label }}
          </span>
        </div>
        <div class="serach-pool">
          <div class="search-symbol">
            <input
              type="text"
              :value="value"
              autocomplete="off"
              autocorrect="off"
              placeholder="Search by token or pair"
              minlength="1"
              maxlength="79"
              spellcheck="false"
              oninput="this.value=this.value.replace(/[^a-zA-Z]/g,'')"
              @input="handleInput"
            />
            <!-- <svg v-if="!value" class="icon" aria-hidden="true"> -->
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-a-bianzu30"></use>
            </svg>
            <svg v-if="value" class="icon out-icon" aria-hidden="true" @click="value = ''">
              <use xlink:href="#icon-a-icon_Shutdownbeifen"></use>
            </svg>
          </div>
          <RefreshIcon :loading="farming.loading" @refresh="toRefresh"></RefreshIcon>
        </div>
        <div class="search-symbol search-h5">
          <!-- <svg v-if="!value" class="icon" aria-hidden="true"> -->
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-a-bianzu30"></use>
          </svg>
          <svg v-if="value" class="icon h5-out-icon" aria-hidden="true" @click="value = ''">
            <use xlink:href="#icon-a-icon_Shutdownbeifen"></use>
          </svg>
          <input
            type="text"
            :value="value"
            autocomplete="off"
            autocorrect="off"
            placeholder="Search by token or pair"
            minlength="1"
            maxlength="79"
            spellcheck="false"
            oninput="this.value=this.value.replace(/[^a-zA-Z]/g,'')"
            @input="handleInput"
          />
        </div>
        <div class="pool-select">
          <Select ref="select" v-model="currentType" class="rpc-select" @change="selectType">
            <Option v-for="item in typeList" :key="item.label" :value="item.value" class="rpc-option">
              {{ item.label }}
            </Option>
          </Select>
          <RefreshIcon :loading="farming.loading" @refresh="toRefresh"></RefreshIcon>
        </div>
      </div>

      <!-- banner -->
      <!-- <div class="farming-banner">
        <DFarmingBanner class="pc-banner" :is-farming="showFarm" />
        <H5DFarmingBanner class="h5-banner" :is-farming="showFarm" />
      </div> -->

      <div class="farming-pool-container">
        <div v-if="farming.farmingListLoading" class="loading-box"><Spin /></div>
        <!-- 池子列表 -->
        <FarmingPoolNc
          class="pc-farming-pool"
          :tvl-data="tvlData"
          :search-key="value"
          :current-type="currentType"
          @refreshData="toRefresh"
        ></FarmingPoolNc>
        <H5FarmingPoolNc
          class="h5-farming-pool"
          :tvl-data="tvlData"
          :search-key="value"
          :current-type="currentType"
          @refreshData="toRefresh"
        ></H5FarmingPoolNc>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { Spin, Select } from 'ant-design-vue'
import { mapState } from 'vuex'
import { fixD, addCommom, decimalFormat, checkNullObj } from '@/utils'
import { tick2Price } from 'test-crema-sdk'
const Option = Select.Option
Vue.use(Option)
export default Vue.extend({
  components: {
    Spin,
    Select,
    Option
  },
  data() {
    return {
      poolStatus: 'Live',
      searchKey: '',
      showFarm: 'Farming',
      tvlData: null,
      timer: null,
      earningTimer: null,
      value: '',
      currentType: 'Live',
      typeList: [
        {
          label: 'Live',
          value: 'Live'
        },
        {
          label: 'Ended',
          value: 'Ended'
        }
      ]
    }
  },
  computed: {
    ...mapState(['farming', 'wallet', 'liquidity', 'farmingv2']),
    farmingConfigData() {
      return {
        walletConnected: this.wallet.connected,
        rates: this.liquidity.rates,
        farmingConfigObj: this.farming.farmingConfigObj,
        tvlData: this.tvlData
      }
    },
    walletConnectedAndFarmingListReady() {
      if (this.wallet.connected && this.farmingv2.farmingList && this.farmingv2.farmingList.length > 0) {
        return true
      }
      return false
    }
  },
  watch: {
    farmingConfigData(newVal, oldVal) {
      // if (newVal.rates && newVal.farmingConfigObj && newVal.tvlData && this.farming.farmingList.length < 1) {
      //   this.$accessor.farming.getFarmingList({
      //     rates: newVal.rates,
      //     farmingConfig: newVal.farmingConfigObj,
      //     haveLoading: true,
      //     tvlData: newVal.tvlData
      //   })
      // }
      // if (
      //   newVal.rates &&
      //   newVal.farmingConfigObj &&
      //   newVal.tvlData &&
      //   newVal.walletConnected &&
      //   checkNullObj(this.farming.earningObj)
      // ) {
      //   this.$accessor.farming.getEarningsObj(true)
      // }
    },
    // 'liquidity.tokensObj': {
    //   handler: 'tokensObjWatch',
    //   immediate: true
    // },
    walletConnectedAndFarmingListReady: {
      handler: 'walletConnectedAndFarmingListReadyWatch',
      immediate: true
    },
    $route: {
      handler: 'routeWatch',
      immediate: true
    }
  },
  created() {
    this.getFarmTvl()
  },
  mounted() {
    this.$accessor.farmingv2.getFarmingList()
    this.$accessor.farmingv2.getAprAndTvl()
    this.$accessor.farmingv2.getWrappers()

    const _this = this
    this.timer = setInterval(function () {
      _this.toRefresh(true)
    }, 60000)
  },
  destroyed() {
    clearInterval(this.timer)
    this.timer = null
  },
  methods: {
    routeWatch(newVal) {
      console.log('routeWatch####newVal####', newVal)
      if (newVal && newVal.query && newVal.query.type) {
        this.currentType = newVal.query.type
      }
    },
    walletConnectedAndFarmingListReadyWatch(newVal) {
      if (newVal) {
        this.$accessor.farmingv2.getRewardsObj({ farmingList: this.farmingv2.farmingList, haveLoading: true })
      }
    },
    selectType(value) {
      console.log('selectType###value###', value, 'this.$route####', this.$route)
      this.currentType = value
      if (this.$route.query.type) {
        this.$route.query.type = value
      }
    },
    handleInput(e: any) {
      this.value = e.target.value
    },
    // tokensObjWatch(newVal) {
    //   if (newVal && !checkNullObj(newVal)) this.$accessor.farming.getFarmingConfig(newVal)
    // },
    getFarmTvl() {
      // this.$axios.get(`https://api.crema.finance/farm/tvl`).then((res) => {
      this.$axios.get(`https://pre-api-crema.bitank.com/farm/tvl`).then((res) => {
        // this.$axios.get(`/farm/tvl`).then((res) => {
        console.log('farmingTest####getFarmTvl###res#####', res)
        const result: any = {}
        if (res && res.wrappers) {
          res.wrappers.forEach((item) => {
            const apr = item.apr * 100
            const tvl = item.tvl
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
    refreshEarningsObj() {
      this.$accessor.farming.getEarningsObj()
    },
    toRefresh(unLoading) {
      this.$accessor.farmingv2.getFarmingList()
      this.$accessor.farmingv2.getAprAndTvl()
      this.$accessor.farmingv2.getWrappers()
      if (this.wallet.connected) {
        this.$accessor.farmingv2.getRewardsObj({ farmingList: this.farmingv2.farmingList, haveLoading: !unLoading })
      }
    }
  }
})
</script>
<style lang="less" scoped>
.farming-container {
  .banners-all {
    position: relative;
    width: auto;
    margin-top: -20px;

    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    // img {

    // }

    .banners-pc {
      display: block;
      height: 180px;
    }
    .banners-h5 {
      display: none;
    }
    .farming-jump {
      position: absolute;
      bottom: 0px;
      left: 50%;
      margin-left: 370px;
      // width: 120px;
      // height: 140px;
      width: 123px;
      height: 138px;
      background: url('../assets/images/img-Caffeine-Farming-Mint.png') center bottom no-repeat;
      background-size: 100% auto;
      cursor: pointer;
      &:hover {
        background: url('../assets/images/img-Caffeine-Farming-Mint-hover.png') center bottom no-repeat;
        background-size: 100% auto;
      }
    }
  }
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
      flex-wrap: wrap;
      margin-top: 40px;
      // padding-bottom: 20px;
      > div {
        display: flex;
        align-items: center;
      }
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
      .search-symbol {
        position: relative;
        margin-left: 20px;
        input {
          width: 240px;
          height: 36px;
          padding: 11px 36px;
          background: linear-gradient(270deg, #3e434e 0%, #282a2f 100%);
          border-radius: 8px;
          border: 1px solid #3f434e;
          font-size: 14px;
          &::placeholder {
            color: rgba(#fff, 0.5);
          }
        }
        .icon {
          width: 20px;
          height: 20px;
          position: absolute;
          fill: rgba(#fff, 0.5);
          top: 8px;
          left: 12px;
          right: 0;
          cursor: pointer;
        }
        .out-icon {
          left: 210px;
        }
      }
      .type-tab {
        // margin-left: 20px;
        // min-width: 380px;
        height: 36px;
        background: linear-gradient(270deg, #3e434e 0%, #282a2f 100%);
        border-radius: 8px;
        display: flex;
        align-items: center;
        span {
          width: 88px;
          flex: 1;
          border-radius: 7px;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.5);
          height: 100%;
          display: flex;
          padding: 0 5px;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          &.active {
            background: linear-gradient(270deg, #3e434e 0%, #282a2f 100%);
            color: #fff;
            border: 1px solid #666b77;
          }
        }
        .check-content {
          display: flex;
          align-items: center;
          flex-wrap: nowrap;
          .check-box {
            width: 18px;
            height: 18px;
            background: linear-gradient(270deg, #3e434e 0%, #282a2f 100%);
            box-shadow: 0px 4px 12px 0px rgba(26, 28, 31, 0.5);
            border-radius: 4px;
            border: 1px solid #666b77;
            margin-right: 8px;
            margin-left: 20px;
            padding: 3px;
            .check-box-active {
              width: 100%;
              height: 100%;
              background: linear-gradient(233deg, #5fe6d0 0%, #596cff 38%, #9380ff 72%, #e590ff 100%);
              box-shadow: 0px 4px 12px 0px rgba(26, 28, 31, 0.5);
              border-radius: 2px;
            }
          }
        }
      }
      .search-h5 {
        display: none;
      }
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
      .pool-select {
        display: none;
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

@media screen and (min-width: 1920px) {
  .farming-container {
    .banners-all {
      .banners-pc {
        width: 100%;
        height: auto;
      }
      .farming-jump {
        margin-left: 20%;
      }
    }
  }
}
@media screen and (max-width: 1366px) {
  .farming-container {
    .banners-all {
      margin-top: -40px;
    }
  }
}
@media screen and (max-width: 980px) {
  .farming-container {
    .banners-all {
      margin-top: -20px;
    }
  }
}
@media screen and (max-width: 750px) {
  .farming-container {
    .banners-all {
      margin-top: 0px;
      .banners-pc {
        display: none;
      }
      .banners-h5 {
        display: block;
        border-radius: 20px;
        margin-top: 20px;
        // height: 180px;
        width: 100%;
      }
      .farming-jump {
        bottom: 0;
        width: 98px;
        // height: 117px;
        // height: auto;
        left: 50%;
        margin-left: -142px;
        // right: 0;
      }
    }
    width: 100%;
    // padding: 20px 16px 0;
    .farming-container-center {
      width: 100%;
      .farming-title {
        padding: 0;
        .type-tab,
        .serach-pool {
          display: none;
        }
        .search-h5 {
          display: block;
          width: 100%;
          margin: 0;
          .icon {
            left: 8px;
          }
          .h5-out-icon {
            left: auto;
            right: 10px;
          }
          input {
            width: 100%;
            padding: 11px 8px 11px 45px;
          }
        }
        .title-right {
          .search-pool {
            display: none;
          }
        }
        .pool-select {
          // display: block;
          width: 100%;
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
          .rpc-select {
            width: 160px;
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
        margin-top: 16px;
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
