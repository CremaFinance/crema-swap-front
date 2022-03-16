<template>
  <Modal title="Select a token" :width="400" centered :visible="true" :footer="null" @cancel="$emit('onClose')">
    <div class="coin-select-modal">
      <div class="search-input">
        <input
          v-model="keyword"
          onkeyup="value=value.replace(/[^A-Za-z0-9]+$/g,'')"
          placeholder="Enter the token symbol or address"
          @input="handleInput"
        />
      </div>
      <div class="coin-list-box">
        <!-- <ul v-if="list && list.length > 0" class="coin-list">
          <li v-for="(item, index) in list" :key="index" @click="toSelect(item)">
            <div class="left">
              <img :src="item.logoURI" />
              <span>{{ item.symbol }}</span>
            </div>
            <div class="balance">
              <div v-if="wallet.loading">
                <Icon type="loading" />
              </div>
              <div v-else-if="tokenAccounts && tokenAccounts[item.address]">
                {{ tokenAccounts[item.address].balance.toEther() }}
              </div>
              <div v-else-if="tokenAccounts && item.address === 'So11111111111111111111111111111111111111112'">
                {{ tokenAccounts['11111111111111111111111111111111'].balance.toEther() }}
              </div>
              <div v-else></div>
            </div>
          </li>
        </ul> -->
        <div v-if="list && list.length > 0" class="coin-list">
          <virtual-list
            style="height: 280px; overflow-y: auto"
            :data-key="'address'"
            :data-sources="list"
            :data-component="coinItemComponent"
            :extra-props="{ onSelect: toSelect }"
          />
        </div>
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
import { cloneDeep, debounce } from 'lodash-es'
import VirtualList from 'vue-virtual-scroll-list'
import CoinItem from './CoinItem.vue'

Vue.use(Modal)

export default Vue.extend({
  components: {
    Modal,
    // eslint-disable-next-line vue/no-unused-components
    Icon,
    // eslint-disable-next-line vue/no-unused-components
    'virtual-list': VirtualList
  },
  props: {
    existingCoins: {
      type: String,
      default: ''
    },
    lastSelectCoin: {
      type: String,
      default: ''
    },
    sList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      keyword: '',
      tokenList: [] as Array<TokenInfo>,
      tokenAccounts: {} as any,
      tokens: [] as any,
      searchList: [] as any,
      coinItemComponent: CoinItem
    }
  },
  computed: {
    ...mapState(['wallet', 'liquidity', 'swap']),
    list(): any {
      if (this.keyword) {
        return this.searchList
      } else {
        return this.sList
      }
      // if (this.sList && this.sList.length > 0) {
      //   return this.sList
      // }
      // // return (this.swap.tokens && this.swap.tokens.slice(0, 30)) || []
      // return this.swap.tokens || []
    }
  },
  watch: {
    // keyword(newKeyword) {
    //   this.createTokenList(newKeyword)
    // // },
    'wallet.tokenAccounts': {
      // handler(_newTokenAccounts: any, _oldTokenAccounts: any) {
      //   // this.createTokenList()
      //   console.log('_newTokenAccounts#####', _newTokenAccounts)
      // },
      // deep: true
      handler: 'tokenAccountsWatch',
      immediate: true
    }
    // 'swap.tokens': {
    //   handler: 'swapTokensWatch',
    //   immediate: true
    // }
    // 'liquidity.infos': {
    //   handler(_newTokenAccounts: any, _oldTokenAccounts: any) {
    //     this.createTokenList()
    //   },
    //   deep: true
    // }
  },
  mounted() {
    // this.createTokenList()
  },
  methods: {
    // handleInput(value: string) {
    //   console.log('没劲道这里吗###handleInput')
    //   debounce(() => {
    //     console.log('value####', value)
    //   }, 500)
    // },
    handleInput: debounce(function (e: any) {
      console.log('query#####', e.target.value)
      if (e.target.value !== '') {
        if (this.sList && this.sList.length > 0) {
          this.searchList = this.sList.filter((token) => {
            return token.symbol.includes(e.target.value) || token.symbol.includes(e.target.value.toUpperCase())
          })
        } else {
          this.searchList = this.swap.tokens.filter((token) => {
            return token.symbol.includes(e.target.value) || token.symbol.includes(e.target.value.toUpperCase())
          })
        }
      }
    }, 500),
    // handleInput(e) {
    //   if (e.target.value !== '') {
    //     if (this.sList && this.sList.length > 0) {
    //       this.searchList = this.sList.filter((token: any) => {
    //         return token.symbol.includes(e.target.value) || token.symbol.includes(e.target.value.toUpperCase())
    //       })
    //     } else {
    //       this.searchList = this.swap.tokens.filter((token) => {
    //         return token.symbol.includes(e.target.value) || token.symbol.includes(e.target.value.toUpperCase())
    //       })
    //     }
    //   }
    // },
    // swapTokensWatch(tokens: any) {
    //   console.log('swapTokensWatch####tokens####', tokens)
    //   this.tokens = tokens.slice(0, 100)
    // },
    tokenAccountsWatch(tokenAccounts: any) {
      console.log('tokenAccounts####', tokenAccounts)
      this.tokenAccounts = tokenAccounts
    },
    toSelect(item: any, oldItem: any) {
      console.log('22222')
      this.$emit('onSelect', item)
    },
    importIconNew(path: string) {
      try {
        return require(`../assets${path}`)
      } catch (e) {
        // return false
        return require('../assets/icons/unknown.png')
      }
    }
    // createTokenList(keyword = '') {
    //   let tokenList = []

    //   let nativeSol = cloneDeep(NATIVE_SOL)

    //   let hasBalance = []
    //   const noBalance = []

    //   let tokenObject: any = {}
    //   const usableTokenObject: any = {} // 可以配对的币种
    //   // if (this.existingCoins) {
    //   //   for (const coinPair in this.liquidity.infos) {
    //   //     const poolInfo = cloneDeep(this.liquidity.infos[coinPair])
    //   //     if (poolInfo.coin.symbol === this.existingCoins) {
    //   //       usableTokenObject[poolInfo.pc.symbol] = poolInfo.pc
    //   //     }

    //   //     if (poolInfo.pc.symbol === this.existingCoins) {
    //   //       usableTokenObject[poolInfo.coin.symbol] = poolInfo.coin
    //   //     }
    //   //   }
    //   // }

    //   // else {
    //   //   tokenObject = cloneDeep(TOKENS)
    //   // }
    //   tokenObject = cloneDeep(TOKENS)

    //   for (const address of Object.keys(tokenObject)) {
    //     let tokenInfo: any = cloneDeep(tokenObject[address])
    //     // if (this.existingCoins && !usableTokenObject[address]) {
    //     //   tokenInfo.unusable = true
    //     // }
    //     if (this.lastSelectCoin && tokenInfo.symbol === this.lastSelectCoin) {
    //       tokenInfo.unusable = true
    //     }

    //     if (!tokenInfo.showDefault) continue

    //     // tokenInfo.symbol = symbol

    //     const tokenAccount = this.wallet.tokenAccounts[tokenInfo.mintAddress]

    //     if (tokenAccount) {
    //       tokenInfo = { ...tokenInfo, ...tokenAccount }

    //       hasBalance.push(tokenInfo)
    //     } else {
    //       noBalance.push(tokenInfo)
    //     }
    //   }

    //   const solAccount = this.wallet.tokenAccounts[NATIVE_SOL.mintAddress]

    //   if (solAccount) {
    //     nativeSol = { ...nativeSol, ...solAccount }
    //   }

    //   hasBalance = hasBalance.sort((a, b) => {
    //     return b.balance.toEther() - a.balance.toEther()
    //   })

    //   // if (this.existingCoins !== 'SOL') {
    //   //   tokenList = [...[nativeSol], ...hasBalance, ...noBalance]
    //   // } else {
    //   //   tokenList = [...hasBalance, ...noBalance]
    //   // }

    //   // 暂时没有sol相关交易对，先注释了
    //   tokenList = [...hasBalance, ...noBalance]

    //   // if (keyword) {
    //   //   tokenList = tokenList.filter(
    //   //     (token) => token.symbol.includes(keyword.toUpperCase()) || token.mintAddress.includes(keyword.toUpperCase())
    //   //   )
    //   // }

    //   if (keyword) {
    //     tokenList = tokenList.filter((token: any) => {
    //       return (
    //         token.symbol.includes(keyword.toUpperCase()) ||
    //         // eslint-disable-next-line unicorn/prefer-includes
    //         token.mintAddress.toUpperCase().indexOf(keyword.toUpperCase()) >= 0
    //       )
    //     })
    //   }

    //   console.log('new###CoinSelect###tokenList####', tokenList)

    //   this.tokenList = cloneDeep(tokenList)
    // }
  }
})
</script>
<style lang="less" scoped>
.coin-select-modal {
  .search-input {
    background: #23262b;
    box-shadow: 0px 2px 3px 1px #1a1c1f;
    border-radius: 10px;
    width: 100%;
    height: 60px;
    padding: 1px;
    input {
      width: 100%;
      height: 100%;
      background: transparent;
      border-radius: 10px;
      font-size: 14px;
      border: none;
      padding: 0px 20px;
    }
  }
  .coin-list-box {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    max-height: 280px;
    margin-top: 20px;
    // overflow: hidden;
    // overflow-y: auto;
    // .coin-list {
    // }
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
