<template>
  <Modal title="Select a token" centered :visible="true" :footer="null" @cancel="$emit('onClose')">
    <div class="coin-select-modal">
      <div class="search-input">
        <input v-model="keyword" placeholder="Enter the token symbol or address" />
      </div>
      <div class="coin-list-box">
        <ul v-if="tokenList && tokenList.length > 0" class="coin-list">
          <li
            v-for="(item, index) in tokenList"
            :key="index"
            :class="item.unusable ? 'unusable' : ''"
            @click="$emit('onSelect', item)"
          >
            <div class="left">
              <img :src="importIconNew(`/coins/${item.symbol.toLowerCase()}.png`)" />
              <span>{{ item.symbol }}</span>
            </div>
            <div class="balance">
              <div v-if="wallet.loading">
                <Icon type="loading" />
              </div>
              <div v-else-if="item.tokenAccountAddress">
                {{ item.balance.toEther() }}
              </div>
              <div v-else></div>
            </div>
          </li>
        </ul>
        <div v-else class="no-data">
          <img src="../assets/images/icon_NoDate@2x.png" />
          <p>No Data</p>
        </div>
      </div>
    </div>
  </Modal>
</template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { Modal, Icon } from 'ant-design-vue'
import { TOKENS, TokenInfo, NATIVE_SOL } from '@/utils/tokens'
import { LIQUIDITY_POOLS } from '@/utils/pools'
import { cloneDeep } from 'lodash-es'

Vue.use(Modal)

export default Vue.extend({
  components: {
    Modal,
    Icon
  },
  props: {
    existingCoins: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      keyword: '',
      tokenList: [] as Array<TokenInfo>
    }
  },
  computed: {
    ...mapState(['wallet'])
  },
  watch: {
    keyword(newKeyword) {
      this.createTokenList(newKeyword)
    },
    'wallet.tokenAccounts': {
      handler(_newTokenAccounts: any, _oldTokenAccounts: any) {
        this.createTokenList()
      },
      deep: true
    }
  },
  mounted() {
    this.createTokenList()
  },
  methods: {
    importIconNew(path: string) {
      try {
        return require(`../assets${path}`)
      } catch (e) {
        // return false
        return require('../assets/icons/unknown.png')
      }
    },
    createTokenList(keyword = '') {
      let tokenList = []

      let nativeSol = cloneDeep(NATIVE_SOL)

      let hasBalance = []
      const noBalance = []

      let tokenObject: any = {}
      const usableTokenObject: any = {} // 可以配对的币种
      if (this.existingCoins) {
        for (const coinPair in LIQUIDITY_POOLS) {
          const poolInfo = cloneDeep(LIQUIDITY_POOLS[coinPair])
          if (poolInfo.coin.symbol === this.existingCoins) {
            usableTokenObject[poolInfo.pc.symbol] = poolInfo.pc
          }

          if (poolInfo.pc.symbol === this.existingCoins) {
            usableTokenObject[poolInfo.coin.symbol] = poolInfo.coin
          }
        }
      }
      // else {
      //   tokenObject = cloneDeep(TOKENS)
      // }
      tokenObject = cloneDeep(TOKENS)

      for (const symbol of Object.keys(tokenObject)) {
        let tokenInfo: any = cloneDeep(tokenObject[symbol])

        if (this.existingCoins && !usableTokenObject[symbol]) {
          tokenInfo.unusable = true
        }

        if (!tokenInfo.showDefault) continue

        tokenInfo.symbol = symbol

        const tokenAccount = this.wallet.tokenAccounts[tokenInfo.mintAddress]

        if (tokenAccount) {
          tokenInfo = { ...tokenInfo, ...tokenAccount }

          hasBalance.push(tokenInfo)
        } else {
          noBalance.push(tokenInfo)
        }
      }

      const solAccount = this.wallet.tokenAccounts[NATIVE_SOL.mintAddress]

      if (solAccount) {
        nativeSol = { ...nativeSol, ...solAccount }
      }

      hasBalance = hasBalance.sort((a, b) => {
        return b.balance.toEther() - a.balance.toEther()
      })

      // if (this.existingCoins !== 'SOL') {
      //   tokenList = [...[nativeSol], ...hasBalance, ...noBalance]
      // } else {
      //   tokenList = [...hasBalance, ...noBalance]
      // }

      // 暂时没有sol相关交易对，先注释了
      tokenList = [...hasBalance, ...noBalance]

      if (keyword) {
        tokenList = tokenList.filter((token) => token.symbol.includes(keyword.toUpperCase()))
      }

      this.tokenList = cloneDeep(tokenList)

      // const resultObj: any = {}
      // if (this.existingCoins) {
      //   for (const coinPair in LIQUIDITY_POOLS) {
      //     const poolInfo = cloneDeep(LIQUIDITY_POOLS[coinPair])
      //     if (poolInfo.coin.symbol === this.existingCoins && tokenList.includes(poolInfo.pc)) {
      //       resultObj[poolInfo.pc.symbol] = poolInfo.pc
      //     }

      //     if (poolInfo.pc.symbol === this.existingCoins && tokenList.includes(poolInfo.coin)) {
      //       resultObj[poolInfo.coin.symbol] = poolInfo.coin
      //     }
      //   }
      //   this.tokenList = cloneDeep(Object.values(resultObj))
      // } else {
      //   this.tokenList = cloneDeep(tokenList)
      // }
    }
  }
})
</script>
<style lang="less" scoped>
.coin-select-modal {
  .search-input {
    background: linear-gradient(214deg, #59bdad 0%, #6676f5 61%, #9a89f9 76%, #eba7ff 100%);
    width: 100%;
    height: 48px;
    padding: 1px;
    border-radius: 10px;
    input {
      width: 100%;
      height: 100%;
      background: #1a1e21;
      border-radius: 10px;
      font-size: 14px;
      border: none;
      padding: 0px 20px;
    }
  }
  .coin-list-box {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    max-height: 280px;
    overflow-y: auto;
    margin-top: 20px;
    .coin-list {
      li {
        display: flex;
        height: 48px;
        margin-top: 10px;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        color: #fff;
        .left {
          display: flex;
          align-items: center;
          img {
            width: 30px;
            height: 30px;
            border-radius: 100%;
          }
          span {
            margin-left: 10px;
          }
        }
        &.unusable {
          color: rgba(255, 255, 255, 0.5);
          cursor: not-allowed;
          .left {
            img {
              filter: grayscale(1);
            }
          }
        }
      }
    }
  }
  .no-data {
    width: 100%;
    min-height: 260px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    img {
      width: 80px;
      height: 80px;
    }
    p {
      color: rgba(255, 255, 255, 0.8);
      padding-top: 10px;
    }
  }
}
</style>
