<template>
  <div class="pool-container-box">
    <div class="pool-container-hint">
      <img src="@/assets/images/tips.svg" alt="" />
      Please note that this section is only a preview version. No actual service will be executed.
    </div>
    <div class="container pool-container">
      <div class="c-title">
        <span>Concentrated Liquidity</span>

        <div class="buttons">
          <!-- <Tooltip placement="bottomRight">
          <template slot="title">
            <p>tooltip内容</p>
          </template> -->
          <svg class="icon" aria-hidden="true" @click="showSetting = true">
            <use xlink:href="#icon-a-bianzu81"></use>
          </svg>
          <!-- </Tooltip> -->
        </div>
      </div>
      <div class="coin-rate">
        <div class="coin-text" v-if="nowCoinA === coinA">1 {{ coinA }} ≈ {{ coinARate }} {{ coinB }}</div>
        <div class="coin-text" v-else>1 {{ coinB }} ≈ {{ coinBRate }} {{ coinA }}</div>
        <div class="tab-coin">
          <div :class="nowCoinA === coinA ? 'coin-a' : 'coin-b'" @click="nowCoinA = coinA">{{ coinA }}</div>
          <div :class="nowCoinA === coinB ? 'coin-a' : 'coin-b'" @click="nowCoinA = coinB">{{ coinB }}</div>
        </div>
      </div>
      <div class="form-block">
        <CoinBlock
          :coin-name="nowCoinA === coinA ? coinA : coinB"
          :balance="solAccount ? solAccount.balance : null"
        ></CoinBlock>
        <div class="add-icon">
          <a></a>
        </div>
        <CoinBlock
          :coin-name="nowCoinA === coinB ? coinA : coinB"
          :balance="usdtAccount ? usdtAccount.balance : null"
        ></CoinBlock>
      </div>
      <SetPriceRange
        :coinA="nowCoinA === coinA ? coinA : coinB"
        :coinB="nowCoinA === coinB ? coinA : coinB"
      ></SetPriceRange>
      <button class="add-liquidity-btn" @click="showSuccessHint = true">Add Liquidity</button>
      <div class="link-block">
        <nuxt-link to="/position">
          <!-- <span>My Position</span> -->
          <!-- <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-a-bianzu18"></use>
        </svg> -->
        </nuxt-link>
      </div>
      <Setting v-if="showSetting" @onClose="() => (showSetting = false)"></Setting>
      <WaitingHint v-if="showWaitingHint" @onClose="() => (showWaitingHint = false)"></WaitingHint>
      <SuccessHint v-if="showSuccessHint" @onClose="() => (showSuccessHint = false)"></SuccessHint>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue } from 'nuxt-property-decorator'
import { mapState } from 'vuex'
// import { Tooltip } from 'ant-design-vue'
// import AddLiquidity from '../layouts/components/AddLiquidity.vue'
import WaitingHint from '../components/waiting.vue'
import SuccessHint from '../components/success.vue'
import { fixD } from '../utils/index'
import { cloneDeep } from 'lodash-es'
import { TokenInfo, TOKENS, NATIVE_SOL } from '@/utils/tokens'

export default Vue.extend({
  components: {
    WaitingHint,
    SuccessHint
    // Tooltip
    // AddLiquidity
  },
  data() {
    return {
      showAddLiquidity: true,
      tokenList: [] as Array<TokenInfo>,
      fromCoin: null as TokenInfo | null,
      toCoin: null as TokenInfo | null,
      showSetting: false,
      showWaitingHint: false,
      showSuccessHint: false,
      currentCoinKey: 'fromCoin',
      coinARate: 0,
      coinBRate: 0,
      coinA: 'SOL',
      coinB: 'USDT',
      nowCoinA: 'SOL',
      SOLAddress: '11111111111111111111111111111111',
      USDTAddress: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
      solAccount: {},
      usdtAccount: {}
    }
  },
  computed: {
    // ...mapState(['wallet', 'farm', 'url', 'price', 'liquidity'])
    ...mapState({
      price: (state: any) => state.price,
      wallet: (state: any) => state.wallet
    })
  },
  watch: {
    'price.prices'(prices: any) {
      if (prices) {
        const coinARate = prices[this.coinA]
        const coinBRate = prices[this.coinB]
        this.coinARate = Number(fixD(coinARate / coinBRate, 4))
        this.coinBRate = Number(fixD(coinBRate / coinARate, 4))
      }
    },
    'wallet.tokenAccounts': {
      handler(_newTokenAccounts: any, _oldTokenAccounts: any) {
        this.createTokenList()
      },
      deep: true
    }
  },
  mounted() {
    // let hasBalance = []
    this.createTokenList()
  },
  methods: {
    createTokenList() {
      const usdtInfo = cloneDeep(TOKENS.USDT)
      const usdtAccount = this.wallet.tokenAccounts[usdtInfo.mintAddress]
      const solInfo = cloneDeep(NATIVE_SOL)
      const solAccount = this.wallet.tokenAccounts[solInfo.mintAddress]

      if (usdtAccount) {
        this.usdtAccount = usdtAccount
      }

      if (solAccount) {
        this.solAccount = solAccount
      }
    }
  }
})
</script>
<style lang="less" scoped>
@import '../styles/base.less';
.pool-container {
  width: 492px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 30px;
  .form-block {
    .add-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      padding-top: 20px;
      a {
        display: block;
        width: 40px;
        height: 40px;
        background-position: center center;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-image: url('../assets/images/add@2x.png');
        // &:hover {
        //   background-image: url('../assets/images/add_hover@2x.png');
        // }
      }
    }
  }
  .coin-rate {
    display: flex;
    justify-content: space-between;
    align-items: center;
    line-height: 1;
    margin-bottom: 20px;

    .coin-text {
      font-weight: 700;
      color: #fff;
      font-size: 16px;
      // background: angular-gradient(214deg, #59bdad 0%, #6676f5 61%, #9a89f9 76%, #eba7ff 100%);
      background: linear-gradient(to right, #59bdad, #6676f5, #9a89f9, #eba7ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .tab-coin {
      display: flex;
      align-items: center;
      padding: 3px;
      height: 26px;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.1);
      .coin-a {
        padding: 4px 12px;
        height: 20px;
        background: linear-gradient(214deg, #59bdad 0%, #6676f5 61%, #9a89f9 76%, #eba7ff 100%);
        border-radius: 4px;
        cursor: pointer;
      }
      .coin-b {
        height: 20px;
        padding: 4px 10px;
        // background: rgba(255, 255, 255, 0.1);
        // border-radius: 4px;
        cursor: pointer;
      }
    }
  }
  .add-liquidity-btn {
    font-weight: bold;
    color: #fff;
    font-size: 20px;
    .gradient-btn-large();
    margin-top: 20px;
  }
  .link-block {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
    > a {
      font-size: 14px;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      svg {
        width: 20px;
        height: 20px;
        fill: #fff;
      }
    }
  }
}
.pool-container-hint {
  width: 492px;
  padding: 20px;
  margin: auto;
  // height: 38px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 30px;
  margin-bottom: 10px;
  font-size: 12px;
  color: rgba(#fff, 0.6);
  display: flex;
  align-items: center;
  img {
    width: 20px;
    height: 20px;
    margin-right: 10px;
  }
}
@media screen and (max-width: 750px) {
  .pool-container {
    width: 343px;
  }
  .pool-container-hint {
    width: 343px;
    margin-top: 10px;
  }
}
</style>
