import { Vue } from 'nuxt-property-decorator'
import { mapState } from 'vuex'
import { checkNullObj } from '@/utils'
import { loadSwapPair } from '@/contract/pool'
import { lamportPrice2uiPrice } from 'test-crema-sdk'

export default Vue.extend({
  data() {
    return {
      tokenSwap: null as any,
      currentPriceView: '',
      currentPriceViewReverse: ''
    }
  },
  // computed: {
  //   ...mapState(['wallet', 'liquidity'])
  // },
  // watch: {},
  methods: {
    async getTokenSwap() {
      if (this.poolInfo && this.poolInfo.tokenSwapKey) {
        const swap: any = await loadSwapPair(this.poolInfo.tokenSwapKey, this.$wallet)
        this.tokenSwap = swap
        const currentPriceView = lamportPrice2uiPrice(
          swap.tokenSwapInfo.currentSqrtPrice.pow(2),
          this.poolInfo.token_a.decimal,
          this.poolInfo.token_b.decimal
        ).toNumber()
        const currentPriceViewReverse = String(1 / Number(currentPriceView))
        this.currentPriceView = String(currentPriceView)
        this.currentPriceViewReverse = currentPriceViewReverse
      }
    }
  }
})
