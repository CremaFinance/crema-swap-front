<template>
  <div class="stats-container">
    <h3 class="title">Overview</h3>
    <StatsEcharts class="title-overview" :is-show="showEcharts" :wd-all="wdAll" />
    <H5StatsEcharts class="h5-overview" :is-show="showEchart" :wd-all="wdAll" />
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
                <use :xlink:href="drop ? '#icon-contract_chevronupbeifen' : '#icon-icon-gains'"></use>
              </svg>
            </div>
          </th>
          <th>Volume (24H)</th>
          <th>
            <div class="middle left-adr">
              <span>Total APR</span>
              <svg
                class="icon"
                aria-hidden="true"
                @mouseenter="isShowPop = !isShowPop"
                @mouseleave="isShowPop = !isShowPop"
              >
                <use xlink:href="#icon-a-icon-MarketAdress"></use>
              </svg>
              <div v-if="isShowPop">Estimated based on trading activity in the past 7D plus farming rewards.</div>
            </div>
          </th>
          <th>Recommend Range</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in poolsvas" :key="index">
          <td class="fee-top">
            <!-- <img src="../assets/coins/usdt.png" />
            <img src="../assets/coins/usdc.png" /> -->
            <img
              :src="getIcon(item.name.split('-')[0])"
              @mouseenter="item.isShowSwap = !item.isShowSwap"
              @mouseleave="item.isShowSwap = !item.isShowSwap"
            />
            <img
              class="last"
              :src="getIcon(item.name.split('-')[1])"
              @mouseenter="item.isShowSwap = !item.isShowSwap"
              @mouseleave="item.isShowSwap = !item.isShowSwap"
            />
            <span>
              <a
                :href="`https://solscan.io/address/${item.swap_account}`"
                target="_blank"
                @mouseenter="item.isShowSwap = !item.isShowSwap"
                @mouseleave="item.isShowSwap = !item.isShowSwap"
              >
                {{ item.name }}</a
              >
              <span v-if="item.isShowFee" class="Fee">Fee tier</span>
            </span>
            <!-- <p v-if="item.isShowSwap">
              {{ processNftAddress(item.swap_account) }}
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-icon-Jump"></use>
              </svg>
            </p> -->
            <!-- <i
              class="show-fee"
              @mouseenter="item.isShowFee = !item.isShowFee"
              @mouseleave="item.isShowFee = !item.isShowFee"
              >{{
                (liquidity.coinPairConfigObj &&
                  liquidity.coinPairConfigObj[item.swap_account] &&
                  liquidity.coinPairConfigObj[item.swap_account].fee * 100 + '%') ||
                '0.01%'
              }}</i
            > -->
          </td>
          <td class="fee-bot">$ {{ addCommom(item.tvl_in_usd, 2) }}</td>
          <td>$ {{ addCommom(item.vol_in_usd_24h, 2) }}</td>
          <!-- <td>{{ item.apr }}</td> -->
          <td>
            <Tooltip overlay-class-name="td-title-tooltip" placement="bottom">
              <!-- <div v-if="farming.setStatisticsDataObj && farming.setStatisticsDataObj[item.swap_account]">123</div> -->
              <div class="have-pointer">
                {{ getTotalApr(item) }}
              </div>

              <template slot="title">
                <ul class="apr-list">
                  <li>
                    <h3>Fees</h3>
                    <p>{{ item.apr }}</p>
                  </li>
                  <li>
                    <h3>Farm</h3>
                    <p v-if="farming.statisticsDataObj && farming.statisticsDataObj[item.swap_account]">
                      {{ fixD(Number(farming.statisticsDataObj[item.swap_account].apr) * 100, 2) }}%
                    </p>
                    <p v-else>N/A</p>
                  </li>
                </ul>
              </template>
            </Tooltip>
          </td>
          <td>
            <span>{{
              item.price_interval ? item.price_interval.lower_price + ' - ' + item.price_interval.upper_price : ''
            }}</span>
            <Button class="deposit-btn" @click="gotoLp(item)">Deposit</Button>
          </td>
        </tr>
      </tbody>
      <tbody style="height: 60px; position: relative">
        <div class="page-table-pc">
          <div>
            <svg class="icon" :class="poolsLeft ? 'icon-dis' : ''" aria-hidden="true" @click="poolSource('red')">
              <use xlink:href="#icon-icon-solid-left-copy"></use>
            </svg>
            <span class="highlight">
              {{ poolsPage.page }}
            </span>
            /
            <span>
              {{ poolsPage.total ? poolsPage.total : '-' }}
            </span>
            <svg class="icon" :class="poolsRight ? 'icon-dis' : ''" aria-hidden="true" @click="poolSource('add')">
              <use xlink:href="#icon-icon-solid-right-copy"></use>
            </svg>
          </div>
        </div>
      </tbody>
    </table>
    <ul class="h5-data-list">
      <li v-for="(item, index) in poolsvas" :key="index">
        <div class="top">
          <div>
            <img
              :src="getIcon(item.name.split('-')[0])"
              @mouseenter="item.isShowSwap = !item.isShowSwap"
              @mouseleave="item.isShowSwap = !item.isShowSwap"
            />
            <img
              class="last"
              :src="getIcon(item.name.split('-')[1])"
              @mouseenter="item.isShowSwap = !item.isShowSwap"
              @mouseleave="item.isShowSwap = !item.isShowSwap"
            />
            <!-- <img class="last" src="../assets/coins/usdc.png" /> -->
            <span @mouseenter="item.isShowSwap = !item.isShowSwap" @mouseleave="item.isShowSwap = !item.isShowSwap">{{
              item.name
            }}</span>
            <!-- <i
              class="show-fee"
              @mouseenter="item.isShowFee = !item.isShowFee"
              @mouseleave="item.isShowFee = !item.isShowFee"
              >{{
                (liquidity.coinPairConfigObj &&
                  liquidity.coinPairConfigObj[item.swap_account] &&
                  liquidity.coinPairConfigObj[item.swap_account].fee * 100 + '%') ||
                '0.01%'
              }}</i
            > -->
            <span v-if="item.isShowFee" class="Fee">Fee tier</span>
            <!-- <p v-if="item.isShowSwap">
              <a :href="`https://solscan.io/address/${item.swap_account}`" target="_blank">
                {{ processNftAddress(item.swap_account) }}
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-icon-Jump"></use>
                </svg>
              </a>
            </p> -->
          </div>
          <div class="right">
            <h3>
              Total APR
              <svg
                class="icon"
                aria-hidden="true"
                @mouseenter="item.isShowPop = !item.isShowPop"
                @mouseleave="item.isShowPop = !item.isShowPop"
              >
                <use xlink:href="#icon-a-icon-MarketAdress"></use>
              </svg>
            </h3>
            <!-- <p>{{ item.apr }}</p> -->
            <Tooltip overlay-class-name="td-title-tooltip" placement="bottom">
              <!-- <div v-if="farming.setStatisticsDataObj && farming.setStatisticsDataObj[item.swap_account]">123</div> -->
              <div class="have-pointer">
                {{ getTotalApr(item) }}
              </div>

              <template slot="title">
                <ul class="apr-list">
                  <li>
                    <h3>Fees</h3>
                    <p>{{ item.apr }}</p>
                  </li>
                  <li>
                    <h3>Farm</h3>
                    <p v-if="farming.statisticsDataObj && farming.statisticsDataObj[item.swap_account]">
                      {{ fixD(Number(farming.statisticsDataObj[item.swap_account].apr) * 100, 2) }}%
                    </p>
                    <p v-else>N/A</p>
                  </li>
                </ul>
              </template>
            </Tooltip>
          </div>
        </div>
        <div class="block">
          <div class="left">
            <h3>TVL</h3>
            <p>$ {{ addCommom(item.tvl_in_usd, 2) }}</p>
          </div>
          <div class="right">
            <h3>Volume(24H)</h3>
            <p>$ {{ addCommom(item.vol_in_usd_24h, 2) }}</p>
          </div>
          <div class="right">
            <h3>Recommend Range</h3>
            <p>
              {{ item.price_interval ? item.price_interval.lower_price + ' - ' + item.price_interval.upper_price : '' }}
            </p>
          </div>
        </div>
        <div v-if="item.isShowPop" class="top-title">
          Estimated based on trading activity in the past 7D plus farming rewards.
        </div>
        <Button class="deposit-btn-h5" @click="gotoLp(item)">Deposit</Button>
      </li>
    </ul>
    <div class="page-table-h5">
      <div>
        <svg class="icon" :class="poolsLeft ? 'icon-dis' : ''" aria-hidden="true" @click="poolSource('red')">
          <use xlink:href="#icon-icon-solid-left-copy"></use>
        </svg>
        <span class="highlight">
          {{ poolsPage.page }}
        </span>
        /
        <span>
          {{ poolsPage.total }}
        </span>
        <svg class="icon" :class="poolsLeft ? 'icon-dis' : ''" aria-hidden="true" @click="poolSource('add')">
          <use xlink:href="#icon-icon-solid-right-copy"></use>
        </svg>
      </div>
    </div>
    <h3 class="title">Top Tokens</h3>
    <table class="data-table">
      <thead>
        <tr>
          <th>Token</th>
          <th class="th-ri">Price</th>
          <th class="th-le">Price Change</th>
          <!-- <th>Volume (24H)</th> -->
          <!-- <th>
            <div class="middle">
              <span>TVL</span>
              <svg class="icon" aria-hidden="true" @click="sortList('tokens)">
                <use :xlink:href="litre ? '#icon-contract_chevronupbeifen':'#icon-icon-gains'"></use>
              </svg>
            </div>
          </th> -->
          <th>Volume (24H)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in tokenvas" :key="index">
          <td>
            <img class="last" :src="getIcon(item.name)" />
            <span>{{ item.name }}</span>
          </td>
          <td class="th-ri">
            $ {{ item.price }}
            <!-- <i :class="String(item.price_rate_24h).slice(0, 1) == '-' ? 'i-red' : ''">
              {{ String(item.price_rate_24h).slice(0, 1) != '-' 
                && (String(item.price_rate_24h).substr(0, String(item.price_rate_24h).length - 1)) * 1 != 0
                ? '+'+item.price_rate_24h : ''+item.price_rate_24h }}
            </i> -->
          </td>
          <!-- <td>$ {{ addCommom(item.tvl_in_usd, 2) }}</td> -->
          <td class="th-le" :class="String(item.price_rate_24h).slice(0, 1) == '-' ? 'i-reda' : 'i-green'">
            {{
              String(item.price_rate_24h).slice(0, 1) != '-' &&
              String(item.price_rate_24h).substr(0, String(item.price_rate_24h).length - 1) * 1 != 0
                ? '+' + item.price_rate_24h
                : '' + item.price_rate_24h
            }}
          </td>
          <td>$ {{ addCommom(item.vol_in_usd_24h, 2) }}</td>
        </tr>
      </tbody>
      <tbody style="height: 60px; position: relative">
        <div class="page-table-pc">
          <div>
            <svg class="icon" :class="tokenLeft ? 'icon-dis' : ''" aria-hidden="true" @click="tokenSource('red')">
              <use xlink:href="#icon-icon-solid-left-copy"></use>
            </svg>
            <span class="highlight">
              {{ tokenPage.page }}
            </span>
            /
            <span>
              {{ tokenPage.total ? tokenPage.total : '-' }}
            </span>
            <svg class="icon" :class="tokenRight ? 'icon-dis' : ''" aria-hidden="true" @click="tokenSource('add')">
              <use xlink:href="#icon-icon-solid-right-copy"></use>
            </svg>
          </div>
        </div>
      </tbody>
    </table>
    <ul class="h5-data-list">
      <li v-for="(item, index) in tokenvas" :key="index">
        <div class="top">
          <div>
            <img :src="getIcon(item.name)" />
            <span>{{ item.name }}</span>
            <!-- <i>0.01%</i> -->
          </div>
        </div>
        <div class="block">
          <div class="left">
            <h3>Price</h3>
            <p>
              $ {{ item.price }}
              <!-- <i :class="String(item.price_rate_24h).slice(0, 1) == '-' ? 'i-red' : ''">
              {{ String(item.price_rate_24h).slice(0, 1) != '-' 
                && (String(item.price_rate_24h).substr(0, String(item.price_rate_24h).length - 1)) * 1 != 0
                ? '+'+item.price_rate_24h : ''+item.price_rate_24h }}
            </i> -->
            </p>
          </div>
          <div class="left">
            <!-- <h3>TVL</h3>
            <p>$ {{ addCommom(item.tvl_in_usd, 2) }}</p> -->
            <h3>Price Change</h3>
            <p :class="String(item.price_rate_24h).slice(0, 1) == '-' ? 'i-reda' : 'i-green'">
              {{
                String(item.price_rate_24h).slice(0, 1) != '-' &&
                String(item.price_rate_24h).substr(0, String(item.price_rate_24h).length - 1) * 1 != 0
                  ? '+' + item.price_rate_24h
                  : '' + item.price_rate_24h
              }}
            </p>
          </div>
          <div class="right">
            <h3>Volume(24H)</h3>
            <p>$ {{ addCommom(item.vol_in_usd_24h, 2) }}</p>
          </div>
        </div>
      </li>
    </ul>
    <div class="page-table-h5">
      <div>
        <svg class="icon" :class="tokenRight ? 'icon-dis' : ''" aria-hidden="true" @click="tokenSource('red')">
          <use xlink:href="#icon-icon-solid-left-copy"></use>
        </svg>
        <span class="highlight">
          {{ tokenPage.page }}
        </span>
        /
        <span>
          {{ tokenPage.total }}
        </span>
        <svg class="icon" :class="tokenRight ? 'icon-dis' : ''" aria-hidden="true" @click="tokenSource('add')">
          <use xlink:href="#icon-icon-solid-right-copy"></use>
        </svg>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
//
import Vue from 'vue'
import { mapState } from 'vuex'
import { LIQUIDITY_POOLS } from '@/utils/pools'
import { number } from 'echarts'
import { decimalFormat, addCommom, fixD } from '@/utils'
import importIcon from '@/utils/import-icon'
import { Tooltip } from 'ant-design-vue'
// import { fixD } from '@/utils'
// import { Spin } from 'ant-design-vue';
// Vue.use(Spin)
export default Vue.extend({
  components: {
    // Pagination
    // Spin
    Tooltip
  },
  data() {
    return {
      // list: [],
      pools: [], //pools数据
      tokens: [], //token数据
      TVL: 0,
      Volume: 0,
      APR: 0,
      isShowPop: false,
      showEcharts: 'big',
      showEchart: 'small',
      drop: false,
      litre: false,
      wdAll: {},
      tokenPage: {
        page: 1,
        total: null
      },
      tokenLeft: true,
      tokenRight: false,
      poolsLeft: true,
      poolsRight: false,
      tokenvas: [],
      poolsPage: {
        page: 1,
        total: null
      },
      poolsvas: [],
      state: {
        current: 1, //列表 -- 当前页码
        total: 50, //列表 -- 数据总数
        pages: 0, //列表 -- 页数总数
        pageSize: 10 //列表 -- 页码大小
      }
      // current: 6
    }
  },
  computed: {
    ...mapState(['farming', 'liquidity'])
  },
  watch: {
    'tokenPage.page'(newVal, oldVal) {
      if (this.tokenPage.page == this.tokenPage.total) {
        if (this.tokenPage.total > 1) {
          this.tokenLeft = false
        }
        this.tokenRight = true
      } else if (this.tokenPage.page == 1) {
        if (this.tokenPage.total > 1) {
          this.tokenRight = false
        }
        this.tokenLeft = true
      } else {
        this.tokenRight = false
        this.tokenLeft = false
      }
    },
    'poolsPage.page'(newVal, oldVal) {
      if (this.poolsPage.page == this.poolsPage.total) {
        if (this.poolsPage.total > 1) {
          this.poolsLeft = false
        }
        this.poolsRight = true
      } else if (this.poolsPage.page == 1) {
        if (this.poolsPage.total > 1) {
          this.poolsRight = false
        }
        this.poolsLeft = true
      } else {
        this.poolsRight = false
        this.poolsLeft = false
      }
    }
  },
  created() {
    this.$accessor.farming.getStatisticsDataObj()
  },
  mounted() {
    this.getUct()
    this.getDatum()
    // this.getJupiterDay()
    this.sortList('pools')
    this.sortList('tokens')
  },
  methods: {
    fixD,
    // importIcon,
    decimalFormat,
    addCommom,
    getIcon(name: string) {
      const tokensObj = this.liquidity.tokensObj
      if (tokensObj && name) {
        for (let key in tokensObj) {
          const item: any = tokensObj[key]
          if (name.toUpperCase() === item.symbol.toUpperCase()) {
            if (item.icon) {
              return item.icon
            }
            break
          }
        }
      }
      return importIcon(`/coins/${name.toLowerCase()}.png`)
    },
    getTotalApr(item: any) {
      if (this.farming.statisticsDataObj && this.farming.statisticsDataObj[item.swap_account]) {
        const farmApr = Number(this.farming.statisticsDataObj[item.swap_account].apr) * 100
        const currentApr = Number(item.apr.split('%')[0])
        return `${fixD(String(farmApr + currentApr), 2)}%`
      } else {
        return item.apr
      }
    },
    gotoLp(item: any) {
      console.log('gotoLp####item###', item)
      if (item) {
        const arr = item.name.split('-')
        this.$router.push(`/deposit?from=${arr[0]}&to=${arr[1]}`)
      }
    },
    getDatum() {
      // let basic = "abc,def,ghi,"
      // let a = ''
      // a = basic.substr(0, basic.length - 1);
      // console.log(a);
      this.timer = setInterval(() => {
        this.getUct()
      }, 60000)
    },
    poolSource(val) {
      this.changeAbout(760)
      // this.sortList('pools')
      let data = this.pools
      if (val == 'add') {
        if (this.poolsPage.total == this.poolsPage.page) return false
        let valu: any = []
        data.forEach((item, index) => {
          valu[index] = item
        })
        let start = 10 * (this.poolsPage.page + 1) - 10
        let end = 10 * (this.poolsPage.page + 1)
        let ultimately = valu.slice(start, end)
        this.poolsvas = ultimately
        this.poolsPage.page = this.poolsPage.page + 1
      } else {
        if (this.poolsPage.page == 1) return false
        // let data = this.pools
        let valu: any = []
        data.forEach((item, index) => {
          valu[index] = item
        })
        let start = 10 * (this.poolsPage.page - 1) - 10
        let end = 10 * (this.poolsPage.page - 1)
        let ultimately = valu.slice(start, end)
        this.poolsvas = ultimately
        this.poolsPage.page = this.poolsPage.page - 1
      }
    },
    tokenSource(val) {
      // this.sortList('tokens')
      // this.litre = false
      let data = this.tokens

      if (val == 'add') {
        if (this.tokenPage.total == this.tokenPage.page) return false
        let valu: any = []
        data.forEach((item, index) => {
          valu[index] = item
        })
        let start = 10 * (this.tokenPage.page + 1) - 10
        let end = 10 * (this.tokenPage.page + 1)
        let ultimately = valu.slice(start, end)
        this.tokenvas = ultimately
        this.tokenPage.page = this.tokenPage.page + 1
      } else {
        if (this.tokenPage.page == 1) return false
        // let data = this.tokens
        let valu: any = []
        data.forEach((item, index) => {
          valu[index] = item
        })
        let start = 10 * (this.tokenPage.page - 1) - 10
        let end = 10 * (this.tokenPage.page - 1)
        let ultimately = valu.slice(start, end)
        this.tokenvas = ultimately
        this.tokenPage.page = this.tokenPage.page - 1
      }
    },
    changeAbout(e) {
      window.scrollTo({
        top: e,
        behavior: 'smooth'
      })
    },
    getUct() {
      this.$axios.get(`https://api.crema.finance/v1/swap/count`).then((res) => {
        let results = res.data
        const list = res.data.pools
        const token = res.data.tokens
        const result: any = []
        const values: any = []
        if (list) {
          list.forEach((item) => {
            result.push({
              name: item.name,
              tvl_in_usd: item.tvl_in_usd,
              tvl: item.tvl_in_usd,
              vol_in_usd: item.vol_in_usd,
              vol_in_usd_24h: item.vol_in_usd_24h,
              apr: item.apr,
              price: item.price_intervals,
              swap_account: item.swap_account,
              price_interval: item.price_interval,
              isShowPop: false,
              isShowFee: false,
              isShowSwap: false
            })
          })
          token.forEach((item) => {
            values.push({
              name: item.name,
              price: item.price,
              price_rate_24h: item.price_rate_24h,
              tvl_in_usd: item.tvl_in_usd,
              tvl: item.tvl_in_usd,
              vol_in_usd_24h: item.vol_in_usd_24h
            })
          })
        }
        let tra = this.thousands(Math.round(results.tx_num * 100) / 100 + 0.1)
        let user = this.thousands(Math.round(results.user_num * 100) / 100 + 0.1)
        this.wdAll = {
          Vol: this.getNum(results.vol_in_usd),
          // Tra : this.getNum(results.tx_num),
          Tra: tra.substr(0, tra.length - 2),
          Token: results.token_num,
          // Users : this.getNum(results.user_num),
          Users: user.substr(0, user.length - 2),
          TradingVolume: this.thousands(Math.round(results.vol_in_usd_24h * 100) / 100),
          TotalValue: this.thousands(Math.round(results.tvl_in_usd * 100) / 100)
        }
        this.pools = result
        this.tokens = values
        this.tokenPage.total = Math.ceil(values.length / 10)
        this.poolsPage.total = Math.ceil(result.length / 10)
        if (this.tokenPage.total == 1) {
          this.tokenLeft = true
          this.tokenRight = true
        }
        if (this.poolsPage.total == 1) {
          this.poolsLeft = true
          this.poolsRight = true
        }
        this.tokenvas = values.slice(0, 10)
        this.poolsvas = result.slice(0, 10)

        this.sortList()
        this.tokenPage.page = 1
        this.poolsPage.page = 1
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
          this.poolsvas = val.slice(0, 10)
          this.drop = !this.drop
        } else {
          let val = this.pools.sort(this.changeArrs('tvl'))
          this.pools = val
          this.poolsvas = val.slice(0, 10)
          this.drop = !this.drop
        }
      } else if (vol == 'tokens') {
        if (this.litre) {
          let val = this.tokens.sort(this.changeArr('tvl'))
          this.tokens = val
          let start = 10 * (this.tokenPage.page + 1) - 10
          let end = 10 * (this.tokenPage.page + 1)
          this.tokenvas = val.slice(start, end)
          this.litre = !this.litre
        } else {
          let val = this.tokens.sort(this.changeArrs('tvl'))
          this.tokens = val
          let start = 10 * (this.tokenPage.page + 1) - 10
          let end = 10 * (this.tokenPage.page + 1)
          this.tokenvas = val.slice(start, end)
          this.litre = !this.litre
        }
      } else {
        let val = this.tokens.sort(this.changeArrs('vol_in_usd_24h'))
        this.tokenvas = val.slice(0, 10)
        this.tokens = val
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
    // 添加计位符
    thousands(num: any) {
      if (Math.floor(num) === num) {
        const numStr = (num || 0).toString()
        return numStr.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
      } else {
        const str = num.toString()
        const reg = str.includes('.') > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g
        return str.replace(reg, '$1,')
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
        txt = parseInt(String(num - 4)) / 3 >= 1 ? 'M' : 'K'
        fm = txt === 'K' ? 1000 : 1000000
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
    },
    processNftAddress(address: string) {
      if (address) {
        const result = `${address.substr(0, 4)}...${address.substr(address.length - 4, 4)}`
        return result
      }
      return ''
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
    padding: 40px 0px 12px;
    margin-bottom: 0px;
    // padding-bottom: 0px;
    font-weight: 700;
    margin-block-start: 0px;
    margin-block-end: 0px;
  }
  > .pools-val {
    padding: 40px 0px 12px;
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
    background: #30343c;
    border-radius: 20px;
    overflow: hidden;
    tr {
      &:nth-of-type(2n) {
        background: rgba(#696969, 0.1);
      }
    }
    th,
    td {
      padding: 0 20px;
      height: 73px;
      font-size: 14px;
      color: #fff;
      position: relative;
      &:last-child {
        text-align: right;
      }
      .have-pointer {
        cursor: pointer;
      }

      img {
        width: 36px;
        height: 36px;
        margin-right: 4px;
        border-radius: 50%;
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
      .show-fee {
        background: rgba(#fff, 0.1);
        color: #fff;
      }
      .i-red {
        background: rgba(red, 0.1);
        color: #f73c3c;
      }
      p {
        position: absolute;
        top: -10px;
        left: 50px;
        padding: 5px 10px;
        background: rgba(#000, 0.1);
        border-radius: 10px;
        display: flex;
        align-items: center;
        svg {
          width: 20px;
          height: 20px;
          margin-left: 10px;
        }
      }
      a {
        color: #fff;
      }
      span {
        position: relative;
        .Fee {
          position: absolute;
          right: -130px;
          padding: 5px 10px;
          background: rgba(#000, 0.1);
          -webkit-backdrop-filter: blur(10px);
          backdrop-filter: blur(10px);
          border-radius: 10px;
        }
      }
      .deposit-btn {
        width: 68px;
        height: 28px;
        background: linear-gradient(270deg, #3e434e 0%, #333740 100%);
        box-shadow: 0px 2px 10px 0px rgba(26, 28, 31, 0.37);
        border-radius: 8px;
        border: 1px solid #3f434e;
        color: #07ebad;
        font-size: 14px;
        margin-left: 12px;
        &:hover {
          background: linear-gradient(233deg, #4bb5ff 0%, #ce90ff 100%);
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.4);
          // border-image: linear-gradient(180deg, rgba(232, 228, 255, 1), rgba(0, 143, 232, 0.58)) 1 1;
          color: #fff;
        }
      }
    }
    .fee-top {
      z-index: 8;
    }
    .fee-bot {
      z-index: 5;
    }
    .th-ri {
      width: 260px;
    }
    .th-le {
      width: 130px;
    }
    .i-reda {
      color: #f73c3c;
    }
    .i-green {
      color: #07ebad;
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
          top: 50px;
          right: 0px;
          z-index: 100;
          // top: 750px;
          // right: 30px;
        }
      }
    }
  }
  .page-table-pc {
    position: absolute;
    width: 1000px;
    margin-top: 20px;
    display: flex;
    justify-content: center;
    font-size: 12px;
    color: #909db4 !important;
    > div .highlight {
      // font-size: 12px;
      color: #fff !important;
    }
    .icon {
      width: 20px;
      height: 20px;
      cursor: pointer;
      fill: #909db4;
      &:hover {
        fill: #fff;
      }
    }
    .icon-dis {
      fill: rgba(#909db4, 0.4) !important;
      &:hover {
        fill: rgba(#909db4, 0.4) !important;
      }
    }
    > div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      text-align: center;
      width: 160px;
      height: 100%;
      background: #363a41;
      border-radius: 8px;
      padding: 0 12px;
    }
  }
  .page-table-h5 {
    display: none;
  }
  .h5-data-list {
    display: none;
  }
  .action-pag {
    margin: 30px auto;
    text-align: center;
    /deep/ li .ant-pagination-item-link {
      background: none !important;
    }
    /deep/ .ant-pagination-item-ellipsis {
      color: #fff !important;
      &:hover {
        display: block;
        color: #07ebad !important;
      }
    }
    /deep/ .ant-pagination-item {
      background: none !important;
    }
    /deep/ .anticon-right {
      color: #fff;
      &:hover {
        color: #07ebad;
      }
    }
  }
  // .stats-pag {
  //   width: 100%;
  //   display: flex;
  //   justify-content: center;
  // }
}
.apr-list {
  padding: 0px;
  margin: 0px;
  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-width: 100px;
    margin-top: 6px;
    p,
    h3 {
      margin: 0px;
      padding: 0px;
    }
    &:first-child {
      margin-top: 0px;
    }
    h3 {
      color: rgba(255, 255, 255, 0.5);
      margin-bottom: 0px;
      margin-right: 4px;
    }
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
      li {
        padding: 20px;
        position: relative;
        &:nth-of-type(2n) {
          background: rgba(#696969, 0.1);
          // border-radius: 20px;
        }
        &:last-child {
          border-radius: 0 0 20px 20px;
        }
        .top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          img {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            &.last {
              margin-left: -10px;
            }
          }
          > div:nth-child(1) {
            display: flex;
            align-items: center;
            position: relative;
            p {
              position: absolute;
              left: 44px;
              top: -40px;
              padding: 5px 10px;
              background: rgba(#000, 0.2);
              border-radius: 10px;
              a {
                color: #fff;
                display: flex;
                align-items: center;
              }
              svg {
                width: 20px;
                height: 20px;
                margin-left: 10px;
              }
            }
          }
          span {
            font-size: 16px;
            color: #fff;
            margin-left: 8px;
          }
          .show-fee {
            background: rgba(#fff, 0.1);
            color: #fff;
          }
          .Fee {
            position: absolute;
            top: -30px;
            right: -10px;
            padding: 5px 10px;
            background: rgba(#000, 0.1);
            border-radius: 10px;
            font-size: 10px !important;
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
          .i-red {
            background: rgba(red, 0.1);
            color: #f73c3c;
          }
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
        .i-reda {
          color: #f73c3c;
        }
        .i-green {
          color: #07ebad;
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
          width: 50px;
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
          padding: 0 2px;
        }
        .deposit-btn-h5 {
          width: 100%;
          height: 30px;
          background: linear-gradient(270deg, #3e434e 0%, #333740 100%);
          box-shadow: 0px 2px 10px 0px rgba(26, 28, 31, 0.37);
          border-radius: 8px;
          border: 1px solid #3f434e;
          color: #07ebad;
          font-size: 14px;
          margin-top: 20px;
          // margin-left: 12px;
          &:hover {
            background: linear-gradient(233deg, #4bb5ff 0%, #ce90ff 100%);
            border-radius: 8px;
            border: 1px solid rgba(255, 255, 255, 0.4);
            // border-image: linear-gradient(180deg, rgba(232, 228, 255, 1), rgba(0, 143, 232, 0.58)) 1 1;
            color: #fff;
          }
        }
      }
    }
    .page-table-pc {
      display: none;
    }
    .page-table-h5 {
      margin-top: 20px;
      display: flex;
      justify-content: center;
      font-size: 16px;
      color: #909db4 !important;
      > div .highlight {
        color: #fff !important;
      }
      .icon {
        width: 20px;
        height: 20px;
        cursor: pointer;
        fill: #909db4;
        // &:hover {
        //   fill: #fff;
        // }
      }
      .icon-dis {
        fill: rgba(#909db4, 0.4) !important;
        // &:hover {
        //   fill: rgba(#909db4, 0.4) !important;
        // }
      }
      > div {
        display: flex;
        align-items: center;
        justify-content: space-between;
        text-align: center;
        width: 200px;
        height: 100%;
        background: #30343c;
        border-radius: 8px;
        padding: 0 12px;
      }
    }
  }
}
</style>