import Vue from 'vue'
import { Spin } from 'ant-design-vue'
import { mapState } from 'vuex'
import { fixD, addCommom, decimalFormat, checkNullObj } from '@/utils'
import { tick2Price } from 'test-crema-sdk'
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
    },
    'liquidity.tokensObj': {
      handler: 'tokensObjWatch',
      immediate: true
    }
  },
  created() {
    this.getFarmTvl()
  },
  mounted() {
    const _this = this
    this.timer = setInterval(function () {
      console.log('123getFarmingList###进到轮循了')
      _this.toRefresh(true)
    }, 20000)
  },
  destroyed() {
    clearInterval(this.timer)
    this.timer = null

    // clearInterval(this.earningTimer)
    // this.earningTimer = null
  },
  methods: {
    tokensObjWatch(newVal) {
      if (newVal && !checkNullObj(newVal)) this.$accessor.farming.getFarmingConfig(newVal)
    },
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