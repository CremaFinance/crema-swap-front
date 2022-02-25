<template>
  <div class="stats-container">
    <h3 class="title">Pools Overview</h3>
    <div class="banner-box">
      <div class="tvl-banner">
        <h3 class="title">TVL</h3>
        <p class="num">
          $ <span>{{ addCommom(TVL, 2) }}</span>
        </p>
      </div>
      <div class="volume-banner">
        <h3 class="title">Volume 24H</h3>
        <p class="num">
          $ <span>{{ addCommom(Volume, 2) }}</span>
        </p>
      </div>
    </div>
    <table class="data-table">
      <thead>
        <tr>
          <th>Pool Name</th>
          <th>
            <div class="middle">
              <span>TVL</span>
              <!-- <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-contract_chevronupbeifen"></use>
              </svg> -->
            </div>
          </th>
          <th>Volume (24H)</th>
          <th>
            <div class="middle left-adr">
              <span>APR</span>
              <svg
                class="icon"
                aria-hidden="true"
                @mouseenter="isShowPop = !isShowPop"
                @mouseleave="isShowPop = !isShowPop"
              >
                <use xlink:href="#icon-a-icon-MarketAdress"></use>
              </svg>
              <div v-if="isShowPop">Assuming all liquidity is in active price ranges</div>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in list" :key="index">
          <td>
            <!-- <img src="../assets/coins/usdt.png" />
            <img src="../assets/coins/usdc.png" /> -->
            <img :src="importIcon(`/coins/${item.name.split('-')[0].toLowerCase()}.png`)" />
            <img class="last" :src="importIcon(`/coins/${item.name.split('-')[1].toLowerCase()}.png`)" />
            <span>{{ item.name }}</span>
            <i>0.01%</i>
          </td>
          <td>${{ addCommom(item.tvl_in_usd, 2) }}</td>
          <td>${{ addCommom(item.vol_in_usd, 2) }}</td>
          <td>{{ item.apr }}</td>
        </tr>
      </tbody>
    </table>
    <ul class="h5-data-list">
      <li v-for="(item, index) in list" :key="index">
        <div class="top">
          <img :src="importIcon(`/coins/${item.name.split('-')[0].toLowerCase()}.png`)" />
          <img class="last" :src="importIcon(`/coins/${item.name.split('-')[1].toLowerCase()}.png`)" />
          <!-- <img class="last" src="../assets/coins/usdc.png" /> -->
          <span>{{ item.name }}</span>
          <i>0.01%</i>
        </div>
        <div class="block">
          <div class="left">
            <h3>TVL</h3>
            <p>${{ addCommom(item.tvl_in_usd, 2) }}</p>
          </div>
          <div class="right">
            <h3>Volume(24H)</h3>
            <p>${{ addCommom(item.vol_in_usd, 2) }}</p>
          </div>
          <div class="right">
            <h3>
              APR
              <svg
                class="icon"
                aria-hidden="true"
                @mouseenter="item.isShowPop = !item.isShowPop"
                @mouseleave="item.isShowPop = !item.isShowPop"
              >
                <use xlink:href="#icon-a-icon-MarketAdress"></use>
              </svg>
            </h3>
            <p>{{ item.apr }}</p>
            <div v-if="item.isShowPop">Assuming all liquidity is in active price ranges</div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { LIQUIDITY_POOLS } from '@/utils/pools'
import { number } from 'echarts'
import { decimalFormat, addCommom } from '@/utils'
import importIcon from '@/utils/import-icon'
export default Vue.extend({
  data() {
    return {
      list: [],
      TVL: 0,
      Volume: 0,
      APR: 0,
      isShowPop: false
    }
  },
  watch: {},
  mounted() {
    this.getUct()
    // this.getJupiterDay()
  },
  methods: {
    importIcon,
    decimalFormat,
    addCommom,
    getUct() {
      this.$axios.get(`https://api.crema.finance/tvl/24hour`).then((res) => {
        const list = res.data.pairs
        const result: any = []
        if (list) {
          list.forEach((item) => {
            result.push({
              name: item.name,
              tvl_in_usd: item.tvl_in_usd,
              vol_in_usd: item.vol_in_usd,
              tx_num: item.tx_num,
              apr: item.apr,
              swap_account: item.swap_account,
              isShowPop: false
            })
          })
        }
        this.list = result
        this.TVL = res.data.total_tvl_in_usd
        this.Volume = res.data.total_vol_in_usd
        this.APR = res.data.apr
      })
    }
    // getJupiterDay() {
    //   this.$axios.get(`https://stats.jup.ag/info/day`).then((res) => {
    //     console.log('getJupiterDay####res####', res)
    //     if (res && res.lastXVolumeByAMMs) {
    //       const cremaAmount = res.lastXVolumeByAMMs.filter((item) => item.amm === 'Crema')
    //       if (cremaAmount && cremaAmount[0] && cremaAmount[0].amount) {
    //         this.Volume = cremaAmount[0].amount
    //       }
    //     }
    //     // this.list = res.data.pairs
    //     // this.TVL = res.data.total_tvl_in_usd
    //     // this.Volume = res.data.total_vol_in_usd
    //   })
    // }
  }
})
</script>
<style lang="less" scoped>
.stats-container {
  width: 1000px;
  margin: 0 auto;
  position: relative;
  > .title {
    font-size: 20px;
    color: #fff;
    padding: 28px 0px;
    margin-bottom: 0px;
    font-weight: 700;
  }
  .banner-box {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    > div {
      width: 490px;
      height: 178px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding-left: 37px;
      background-repeat: no-repeat;
      background-size: 100% auto;
      background-position: center center;
      &.tvl-banner {
        background-image: url('../assets/images/tvl-back.png');
      }
      &.volume-banner {
        background-image: url('../assets/images/volume-back.png');
      }
      h3 {
        font-family: 'HelveticaBlk';
        font-size: 20px;
        color: #fff;
      }
      p {
        font-family: 'HelveticaBlkObl';
        height: 28px;
        font-size: 16px;
        font-weight: 700;
        color: #fff;
        line-height: 28px;
        background: linear-gradient(267deg, #6676f5 0%, #4cffdf 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 0px;
        span {
          font-size: 28px;
          font-family: 'Helvetica-NeueBd';
        }
      }
    }
  }
  .data-table {
    width: 100%;
    background: linear-gradient(214deg, #3e434e 0%, #23262b 100%);
    border-radius: 20px;
    margin-top: 20px;
    overflow: hidden;
    tr {
      &:nth-of-type(2n) {
        background: rgba(#696969, 0.1);
      }
    }
    th,
    td {
      padding-left: 40px;
      padding-right: 40px;
      height: 73px;
      font-size: 14px;
      color: #fff;
      &:last-child {
        text-align: right;
      }

      img {
        width: 36px;
        height: 36px;
        margin-right: 4px;
      }
      i {
        display: inline-block;
        width: 40px;
        height: 20px;
        line-height: 20px;
        vertical-align: middle;
        background: rgba(#07ebad, 0.1);
        border-radius: 4px;
        color: #07ebad;
        font-size: 12px;
        text-align: center;
        font-style: normal;
        margin-left: 4px;
      }
    }
    th {
      height: 55px;
      font-size: 12px;
      color: #b5b8c2;
      .middle {
        height: 55px;
        display: flex;
        align-items: center;
        svg {
          width: 16px;
          height: 16px;
          fill: #b5b8c2;
          &:hover {
            fill: #fff;
          }
        }
      }
      .left-adr {
        justify-content: flex-end;
        svg {
          width: 20px;
          height: 20px;
          margin-left: 2px;
          cursor: pointer;
        }
        > div {
          position: absolute;
          padding: 10px 15px;
          background: linear-gradient(214deg, #3e434e 0%, #23262b 100%);
          border-radius: 10px;
          top: 260px;
          right: 40px;
        }
      }
    }
  }
  .h5-data-list {
    display: none;
  }
}

@media screen and (max-width: 750px) {
  .stats-container {
    width: 100%;
    // padding: 0px 16px;
    > .title {
      padding: 20px 0px;
      margin-bottom: 0px;
    }
    .banner-box {
      flex-direction: column;
      > div {
        width: 100%;
        height: 125px;
        padding-left: 20px;
        &:last-child {
          margin-top: 20px;
        }
        h3 {
          font-size: 16px;
        }
        p {
          font-size: 20px;
        }
      }
    }
    .data-table {
      display: none;
    }
    .h5-data-list {
      display: block;
      width: 100%;
      background: linear-gradient(214deg, #3e434e 0%, #23262b 100%);
      border-radius: 20px;
      // border: 1px solid #565c6a;
      margin-top: 20px;
      li {
        padding: 20px;
        position: relative;
        &:nth-of-type(2n) {
          background: rgba(#696969, 0.1);
          border-radius: 0 0 20px 20px;
        }
        .top {
          display: flex;
          align-items: center;
          img {
            width: 36px;
            height: 36px;
            &.last {
              margin-left: -10px;
            }
          }

          i {
            display: inline-block;
            width: 40px;
            height: 20px;
            line-height: 20px;
            vertical-align: middle;
            background: rgba(#07ebad, 0.1);
            border-radius: 4px;
            color: #07ebad;
            font-size: 12px;
            text-align: center;
            font-style: normal;
            margin-left: 8px;
          }
          span {
            font-size: 16px;
            color: #fff;
            margin-left: 8px;
          }
        }
        .block {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 40px;
          h3 {
            font-size: 12px;
            color: #b5b8c2;
            display: flex;
            align-items: center;
          }
          p {
            font-size: 14px;
            color: #fff;
            margin-bottom: 0px;
          }
          > div > div {
            position: absolute;
            padding: 8px;
            background: linear-gradient(214deg, #3e434e 0%, #23262b 100%);
            border-radius: 10px;
            font-size: 10px;
            top: 60px;
            right: 20px;
          }
          svg {
            width: 20px;
            height: 20px;
            margin-left: 2px;
            fill: #b5b8c2;
            &:hover {
              fill: #fff;
            }
          }
        }
      }
    }
  }
}
</style>
