import { Vue } from 'nuxt-property-decorator'
import { mapState } from 'vuex'
import { checkNullObj } from '@/utils'

export default Vue.extend({
  data() {
    return {
      shouldRequestMyPos: false
    }
  },
  computed: {
    ...mapState(['wallet', 'liquidity']),
    walletConnectedAndHavePoolsObj(): boolean {
      if (
        this.liquidity.poolsObj &&
        this.wallet.connected &&
        !checkNullObj(this.wallet.tokenAccounts) &&
        this.shouldRequestMyPos
      ) {
        return true
      }
      return false
    }
  },
  watch: {
    walletConnectedAndHavePoolsObj: {
      handler: 'walletConnectedAndHavePoolsObjWatch',
      immediate: true
    },
    'liquidity.myPositions': {
      handler: 'watchMyPositions',
      immediate: true
    }
  },
  mounted() {
    console.log('this is test')
  },

  methods: {
    walletConnectedAndHavePoolsObjWatch(newVal) {
      if (newVal) {
        this.$accessor.liquidity.getMyPositionsNew(this.wallet.tokenAccounts)
        this.shouldRequestMyPos = false
      }
    },
    watchMyPositions(newVal) {
      if (!newVal || newVal.length < 1) {
        this.shouldRequestMyPos = true
      } else {
        console.log('mixin###watchMyPosition###newVal###', newVal)
        this.$accessor.liquidity.setCurrentPositon({
          myPosions: newVal,
          id: this.$route.query.id
        })
      }
    },
    refresh() {
      this.$accessor.liquidity.getMyPositionsNew(this.wallet.tokenAccounts)
    }
  }
})
