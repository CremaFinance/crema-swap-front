<template>
  <div class="farming-container">
    <div class="farming-container-center">
      <!-- title开始 -->
      <div class="farming-title">
        <div class="title">Farming</div>
        <div class="title-right">
          <div class="pool-status-tab">
            <div
              :class="poolStatus === 'Staked' ? 'pool-status-staked-active' : 'pool-status-staked'"
              @click="poolStatus = 'Staked'"
            >
              Staked
            </div>
            <div
              :class="poolStatus === 'All' ? 'pool-status-all-active' : 'pool-status-all'"
              @click="poolStatus = 'All'"
            >
              All
            </div>
          </div>
          <div class="search-pool">
            <Input v-model="searchKey" placeholder="Search Token or Pools" />
            <div class="input-search"></div>
          </div>
        </div>
      </div>
      <!-- banner -->
      <div class="farming-banner">
        <img class="pc-banner" src="@/assets/images/farming-banner-pc.png" alt="" />
        <img class="h5-banner" src="@/assets/images/farming-banner-h5.png" alt="" />
      </div>
      <div class="h5-search-pool">
        <Input v-model="searchKey" placeholder="Search Token or Pools" />
        <div class="input-search"></div>
      </div>
      <!-- 池子列表 -->
      <FarmingPool class="pc-farming-pool" :isStaked="poolStatus" :searchKey="searchKey"></FarmingPool>
      <H5FarmingPool class="h5-farming-pool" :isStaked="poolStatus" :searchKey="searchKey"></H5FarmingPool>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { Input } from 'ant-design-vue'
export default Vue.extend({
  data() {
    return {
      poolStatus: 'All',
      searchKey: ''
    }
  }
})
</script>
<style lang="less" scoped>
.farming-container {
  .farming-container-center {
    width: 1000px;
    margin: auto;
    .farming-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .title {
        font-size: 20px;
        font-weight: normal;
        color: #fff;
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
      margin-top: 20px;
      border-radius: 20px;
      img {
        width: 1000px;
        height: 120px;
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
@media screen and (max-width: 750px) {
  .farming-container {
    width: 100%;
    padding: 20px 16px 0;
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
