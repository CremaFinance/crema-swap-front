<template>
  <div class="farming-container">
    <div class="farming-container-center">
      <!-- title开始 -->
      <div class="farming-title">
        <h3 class="title">Farming</h3>
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
        <FarmingPoolNew class="pc-farming-pool" :is-staked="poolStatus" :search-key="searchKey"></FarmingPoolNew>
        <H5FarmingPoolNew class="h5-farming-pool" :is-staked="poolStatus" :search-key="searchKey"></H5FarmingPoolNew>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { Input, Spin } from 'ant-design-vue'
import { mapState } from 'vuex'
export default Vue.extend({
  components: {
    Spin
  },
  data() {
    return {
      poolStatus: 'All',
      searchKey: '',
      showFarm: 'Farming'
    }
  },
  computed: {
    ...mapState(['farming'])
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
      .title {
        // font-size: 20px;
        // font-weight: normal;
        // color: #B5B8C2;
        font-size: 20px;
        color: #fff;
        padding: 28px 0px 12px;
        margin-bottom: 0px;
        font-weight: 700;
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
      // margin-top: 20px;
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
