<template>
  <div class="stats-container">
    <h3 class="title">Overview</h3>
    <StatsEcharts class="title-overview" :is-show="showEcharts" />
    <StatsEcharts class="h5-overview" :is-show="showEchart" />
    <!-- <div class="banner-box">
      <div class="tvl-banner">
        <h3 class="title">TVL</h3>
        <p class="num">
          $ <Spin v-if="!TVL" /><span>{{ TVL ? addCommom(TVL, 2) : '' }}</span>
        </p>
      </div>
      <div class="volume-banner">
        <h3 class="title">Volume 24H</h3>
        <p class="num">
          $ <Spin v-if="!Volume" /><span>{{ TVL ? addCommom(Volume, 2) : '' }}</span>
        </p>
      </div>
    </div> -->
    <h3 class="title pools-val">Top Pools</h3>
    <table class="data-table">
      <thead>
        <tr>
          <th>Pool</th>
          <th>
            <div class="middle">
              <span>TVL</span>
              <svg class="icon" aria-hidden="true" @click="sortList('pools')">
                <use xlink:href="#icon-contract_chevronupbeifen"></use>
              </svg>
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
              <div v-if="isShowPop">
                Estimated by the pool’s current total data. Actual performance depends on each user’s own liquidity
                settings.
              </div>
            </div>
          </th>
          <th>Recommend Range</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in pools" :key="index">
          <td>
            <!-- <img src="../assets/coins/usdt.png" />
            <img src="../assets/coins/usdc.png" /> -->
            <img :src="importIcon(`/coins/${item.name.split('-')[0].toLowerCase()}.png`)" />
            <img class="last" :src="importIcon(`/coins/${item.name.split('-')[1].toLowerCase()}.png`)" />
            <span>{{ item.name }}</span>
            <i @mouseenter="item.isShowFee = !item.isShowFee" @mouseleave="item.isShowFee = !item.isShowFee">0.01%</i>
            <span v-if="item.isShowFee" class="Fee">Fee tier</span>
          </td>
          <td>$ {{ addCommom(item.tvl_in_usd, 2) }}</td>
          <td>$ {{ addCommom(item.vol_in_usd, 2) }}</td>
          <td>{{ item.apr }}</td>
          <td>{{ item.apr }}</td>
        </tr>
      </tbody>
    </table>
    <ul class="h5-data-list">
      <li v-for="(item, index) in pools" :key="index">
        <div class="top">
          <div>
            <img :src="importIcon(`/coins/${item.name.split('-')[0].toLowerCase()}.png`)" />
            <img class="last" :src="importIcon(`/coins/${item.name.split('-')[1].toLowerCase()}.png`)" />
            <!-- <img class="last" src="../assets/coins/usdc.png" /> -->
            <span>{{ item.name }}</span>
            <i>0.01%</i>
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
          </div>
        </div>
        <div class="block">
          <div class="left">
            <h3>TVL</h3>
            <p>$ {{ addCommom(item.tvl_in_usd, 2) }}</p>
          </div>
          <div class="right">
            <h3>Volume(24H)</h3>
            <p>$ {{ addCommom(item.vol_in_usd, 2) }}</p>
          </div>
          <div class="right">
            <h3>Recommend Range</h3>
            <p>{{ item.apr }}</p>
          </div>
        </div>
        <div v-if="item.isShowPop" class="top-title">
          Estimated by the pool’s current total data. Actual performance depends on each user’s own liquidity settings.
        </div>
      </li>
    </ul>
    <h3 class="title">Top Tokens</h3>
    <table class="data-table">
      <thead>
        <tr>
          <th>Token</th>
          <th>Price</th>
          <!-- <th>Volume (24H)</th> -->
          <th>
            <div class="middle">
              <span>TVL</span>
              <svg class="icon" aria-hidden="true" @click="sortList()">
                <use xlink:href="#icon-contract_chevronupbeifen"></use>
              </svg>
            </div>
          </th>
          <th>Volume (24H)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in tokens" :key="index">
          <td>
            <img class="last" :src="importIcon(`/coins/${item.name.toLowerCase()}.png`)" />
            <span>{{ item.name }}</span>
          </td>
          <td>
            $ {{ addCommom(item.price, 2) }}
            <i :class="String(item.price_rate_24h).slice(0, 1) == '-' ? 'i-red' : ''">
              {{ String(item.price_rate_24h).slice(0, 1) == '-' ? '' : '+' }}{{ item.price_rate_24h }}</i
            >
          </td>
          <td>$ {{ addCommom(item.tvl_in_usd, 2) }}</td>
          <td>$ {{ item.vol_in_usd_24h }}</td>
        </tr>
      </tbody>
    </table>
    <ul class="h5-data-list">
      <li v-for="(item, index) in tokens" :key="index">
        <div class="top">
          <div>
            <img :src="importIcon(`/coins/${item.name.toLowerCase()}.png`)" />
            <span>{{ item.name }}</span>
            <!-- <i>0.01%</i> -->
          </div>
        </div>
        <div class="block">
          <div class="left">
            <h3>Price</h3>
            <p>
              $ {{ addCommom(item.price, 2) }}<i>{{ item.price_rate_24h }}</i>
            </p>
          </div>
          <div class="left">
            <h3>TVL</h3>
            <p>$ {{ addCommom(item.tvl_in_usd, 2) }}</p>
          </div>
          <div class="right">
            <h3>Volume(24H)</h3>
            <p>$ {{ addCommom(item.vol_in_usd_24h, 2) }}</p>
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
// import { Spin } from 'ant-design-vue';
// Vue.use(Spin)
export default Vue.extend({
  components: {
    // Spin
  },
  data() {
    return {
      // list: [],
      pools: [],
      tokens: [],
      TVL: 0,
      Volume: 0,
      APR: 0,
      isShowPop: false,
      showEcharts: 'big',
      showEchart: 'small',
      drop: true,
      litre: true
    }
  },
  watch: {},
  mounted() {
    this.getUct()
    this.getDatum()
    // this.getJupiterDay()
  },
  methods: {
    importIcon,
    decimalFormat,
    addCommom,
    getDatum() {
      this.timer = setInterval(() => {
        this.getUct()
      }, 60000)
    },
    getUct() {
      // this.$axios.get(`https://api.crema.finance/tvl/24hour`).then((res) => {
      //   const list = res.data.pairs
      //   const result: any = []
      //   if (list) {
      //     list.forEach((item) => {
      //       result.push({
      //         name: item.name,
      //         tvl_in_usd: item.tvl_in_usd,
      //         vol_in_usd: item.vol_in_usd,
      //         tx_num: item.tx_num,
      //         apr: item.apr,
      //         swap_account: item.swap_account,
      //         isShowPop: false
      //       })
      //     })
      //   }
      //   this.list = result
      //   this.TVL = res.data.total_tvl_in_usd
      //   this.Volume = res.data.total_vol_in_usd
      //   this.APR = res.data.apr
      // })
      this.$axios.get(`https://dev-api-crema.bitank.com/v1/swap/count`).then((res) => {
        const list = res.data.pools
        const token = res.data.tokens
        const result: any = []
        const values: any = []
        if (list) {
          list.forEach((item) => {
            result.push({
              name: item.name,
              tvl_in_usd: this.getNum(item.tvl_in_usd),
              tvl: item.tvl_in_usd,
              vol_in_usd: this.getNum(item.vol_in_usd),
              apr: item.apr,
              price: item.price_intervals,
              swap_account: item.swap_account,
              isShowPop: false,
              isShowFee: false
            })
          })
          token.forEach((item) => {
            values.push({
              name: item.name,
              price: item.price,
              price_rate_24h: item.price_rate_24h,
              tvl_in_usd: this.getNum(item.tvl_in_usd),
              tvl: item.tvl_in_usd,
              vol_in_usd_24h: this.getNum(item.vol_in_usd_24h)
            })
          })
        }
        this.pools = result
        this.tokens = values
      })
    },
    // drop       // 将
    // litre      // 升
    sortList(vol) {
      // console.log(this.pools);
      // console.log(this.tokens);
      if (vol == 'pools') {
        if (this.drop) {
          let val = this.pools.sort(this.changeArr('tvl'))
          this.pools = val
          this.drop = !this.drop
        } else {
          let val = this.pools.sort(this.changeArrs('tvl'))
          this.pools = val
          this.drop = !this.drop
        }
      } else {
        if (this.litre) {
          let val = this.tokens.sort(this.changeArr('tvl'))
          this.tokens = val
          this.litre = !this.litre
        } else {
          let val = this.tokens.sort(this.changeArrs('tvl'))
          this.tokens = val
          this.litre = !this.litre
        }
      }
    },
    changeArr(vpg) {
      return (obj1, obj2) => {
        let value1 = obj1[vpg]
        let value2 = obj2[vpg]
        return value1 - value2 // 升序
      }
    },
    changeArrs(vpg) {
      return (obj1, obj2) => {
        let value1 = obj1[vpg]
        let value2 = obj2[vpg]
        return value2 - value1 // 降序
      }
    },
    getNum(value) {
      if (!value) return 0
      const newValue = ['', '', '']
      let fr = 1000
      let num = 3
      let txt = ''
      let fm = 1
      while (value / fr >= 1) {
        fr *= 10
        num += 1
      }
      if (num <= 3) {
        newValue[0] = parseInt(value) + ''
        newValue[1] = ''
      } else if (num <= 9) {
        txt = parseInt(String(num - 4)) / 3 >= 1 ? 'M' : 'k'
        fm = txt === 'k' ? 1000 : 1000000
        if (value % fm === 0) {
          newValue[0] = parseInt(String(value / fm)) + ''
        } else {
          newValue[0] = this.retain(parseFloat(String(value / fm)), 2)
        }
        newValue[1] = txt
      } else if (num <= 16) {
        txt = (num - 9) / 3 > 1 ? 'T' : 'B'
        fm = 1
        if (txt === 'B') {
          fm = 1000000000
        } else if (txt === 'T') {
          fm = 1000000000000
        }
        if (value % fm === 0) {
          newValue[0] = parseInt(String(value / fm)) + ''
        } else {
          newValue[0] = this.retain(parseFloat(String(value / fm)), 2)
        }
        newValue[1] = txt
      }
      if (value < 1000) {
        newValue[0] = value + ''
        newValue[1] = ''
      }
      return newValue.join('')
    },
    retain(num, decimal) {
      num = num.toString()
      let index = num.indexOf('.')
      if (index !== -1) {
        num = num.substring(0, decimal + index + 1)
      } else {
        num = num.substring(0)
      }
      return parseFloat(num).toFixed(decimal)
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
    padding: 28px 0px 12px;
    margin-bottom: 0px;
    font-weight: 700;
  }
  > .pools-val {
    padding: 8px 0px 12px;
  }
  .title-overview {
    display: block;
  }
  .h5-overview {
    display: none;
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
    // background: linear-gradient(214deg, #3e434e 0%, #23262b 100%);
    background: #282d36;
    border-radius: 20px;
    // margin-top: 20px;
    overflow: hidden;
    tr {
      &:nth-of-type(2n) {
        background: rgba(#696969, 0.1);
      }
    }
    th,
    td {
      padding: 0 30px;
      height: 73px;
      font-size: 14px;
      color: #fff;
      position: relative;
      &:last-child {
        text-align: right;
      }
      img {
        width: 36px;
        height: 36px;
        margin-right: 4px;
      }
      img,
      span,
      i {
        cursor: pointer;
      }
      i {
        display: inline-block;
        width: 48px;
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
      .i-red {
        background: rgba(red, 0.1);
        color: red;
      }
      .Fee {
        position: absolute;
        right: 16px;
        padding: 5px 10px;
        background: rgba(#000, 0.1);
        border-radius: 10px;
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
          cursor: pointer;
          &:hover {
            fill: #fff;
          }
        }
      }
      .left-adr {
        // justify-content: flex-end;
        svg {
          width: 20px;
          height: 20px;
          margin-left: 2px;
        }
        > div {
          width: 420px;
          position: absolute;
          text-align: left;
          padding: 10px 15px;
          background: linear-gradient(214deg, #3e434e 0%, #23262b 100%);
          border-radius: 10px;
          top: 750px;
          right: 30px;
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
    padding-bottom: 60px;
    > .title {
      padding: 20px 0px 12px;
      margin-bottom: 0px;
    }
    .title-overview {
      display: none;
    }
    .h5-overview {
      display: block;
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
      // margin-top: 20px;
      li {
        padding: 20px;
        position: relative;
        &:nth-of-type(2n) {
          background: rgba(#696969, 0.1);
          // border-radius: 20px;
        }
        .top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          img {
            width: 36px;
            height: 36px;
            &.last {
              margin-left: -10px;
            }
          }
          > div:nth-child(1) {
            display: flex;
            align-items: center;
          }
          span {
            font-size: 16px;
            color: #fff;
            margin-left: 8px;
          }
        }
        .block {
          > div {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          height: 120px;
          align-content: space-between;
          margin-top: 10px;
          padding: 20px 0 0;
          border-top: 1px solid rgba(#fff, 0.2);
        }
        .top-title {
          position: absolute;
          width: 90%;
          padding: 8px;
          background: linear-gradient(214deg, #3e434e 0%, #23262b 100%);
          border-radius: 10px;
          font-size: 10px;
          top: -50px;
          right: 0px;
        }
        h3 {
          font-size: 12px;
          color: #b5b8c2;
          display: flex;
          align-items: center;
          margin: 0 !important;
        }
        p {
          display: flex;
          align-items: center;
          font-size: 14px;
          color: #fff;
          margin-bottom: 0px;
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
      }
    }
  }
}
</style>
