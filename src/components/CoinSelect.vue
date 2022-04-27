<template>
  <Modal title="Select a token" :width="400" centered :visible="true" :footer="null" @cancel="$emit('onClose')">
    <div class="coin-select-modal">
      <div class="search-input">
        <input
          v-model="keyword"
          onkeyup="value=value.replace(/[^A-Za-z0-9]+$/g,'')"
          placeholder="Enter the token symbol or address"
        />
      </div>

      <div class="coin-list-box">
        <vue-scroll>
          <ul v-if="tokenList && tokenList.length > 0" class="coin-list">
            <li
              v-for="(item, index) in tokenList"
              :key="index"
              :class="item.unusable ? 'unusable' : ''"
              @click="toSelect(item)"
            >
              <div class="left">
                <img :src="item.icon || importIconNew(`/coins/${item.symbol.toLowerCase()}.png`)" />
                <div class="name-box">
                  <h3>{{ item.symbol }}</h3>
                  <p>{{ item.name }}</p>
                </div>
              </div>
              <div class="balance-box">
                <div class="balance">
                  <div v-if="wallet.loading">
                    <Icon type="loading" />
                  </div>
                  <div v-else-if="item.tokenAccountAddress && wallet.connected">
                    {{ item.balance.fixed() }}
                  </div>
                  <div v-else></div>
                </div>
                <p></p>
              </div>
            </li>
          </ul>
          <div v-else class="no-data">
            <img src="../assets/images/icon_NoDate@2x.png" />
            <p>No Data</p>
          </div>
        </vue-scroll>
      </div>
    </div>
  </Modal>
</template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { Modal, Icon } from 'ant-design-vue'
import { TokenInfo, NATIVE_SOL } from '@/utils/tokens'
import { cloneDeep } from 'lodash-es'
import { checkNullObj } from '@/utils'

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
    },
    lastSelectCoin: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      keyword: '',
      // tokenList: [] as Array<TokenInfo>
      tokenList: [] as any
    }
  },
  computed: {
    ...mapState(['wallet', 'liquidity'])
  },
  watch: {
    keyword(newKeyword) {
      this.createTokenList(undefined, newKeyword)
    },
    'wallet.tokenAccounts': {
      handler(_newTokenAccounts: any, _oldTokenAccounts: any) {
        this.createTokenList(undefined, this.keyword)
      },
      deep: true
    },
    // 'liquidity.infos': {
    //   handler(_newTokenAccounts: any, _oldTokenAccounts: any) {
    //     this.createTokenList()
    //   },
    //   deep: true
    // },
    'liquidity.tokensObj': {
      handler: 'tokensObjWatch',
      immediate: true
    }
  },
  // mounted() {

  // },
  methods: {
    tokensObjWatch(newVal) {
      console.log('没进来吗#####liquidity.tokensObj###newVal###', newVal)
      if (!checkNullObj(newVal)) {
        this.createTokenList(newVal)
      }
    },
    toSelect(item: any, oldItem: any) {
      this.$emit('onSelect', item)
    },
    importIconNew(path: string) {
      try {
        return require(`../assets${path}`)
      } catch (e) {
        // return false
        return require('../assets/icons/unknown.png')
      }
    },
    createTokenList(tokensObj = this.liquidity.tokensObj, keyword = '') {
      let tokenList: any = []

      let nativeSol = cloneDeep(NATIVE_SOL)

      let hasBalance: any = []
      const noBalance: any = []

      let tokenObject: any = {}
      const usableTokenObject: any = {} // 可以配对的币种

      tokenObject = cloneDeep(tokensObj)
      console.log('createTokenList###tokenObject###', tokenObject)

      for (const address of Object.keys(tokenObject)) {
        let tokenInfo: any = cloneDeep(tokenObject[address])
        // if (this.existingCoins && !usableTokenObject[address]) {
        //   tokenInfo.unusable = true
        // }
        if (this.lastSelectCoin && tokenInfo.symbol === this.lastSelectCoin) {
          tokenInfo.unusable = true
        }

        // if (!tokenInfo.showDefault) continue
        if (tokenInfo.symbol === 'SOL') continue

        // tokenInfo.symbol = symbol

        const tokenAccount = this.wallet.tokenAccounts[tokenInfo.token_mint]

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

      if (this.existingCoins !== 'SOL') {
        tokenList = [...[nativeSol], ...hasBalance, ...noBalance]
      } else {
        tokenList = [...hasBalance, ...noBalance]
      }
      console.log('solAccount###', solAccount)

      // 暂时没有sol相关交易对，先注释了
      tokenList = [...[nativeSol], ...hasBalance, ...noBalance]
      // tokenList = [...hasBalance, ...noBalance]

      // if (keyword) {
      //   tokenList = tokenList.filter(
      //     (token) => token.symbol.includes(keyword.toUpperCase()) || token.mintAddress.includes(keyword.toUpperCase())
      //   )
      // }

      if (keyword) {
        tokenList = tokenList.filter((token: any) => {
          return (
            token.symbol.toUpperCase().includes(keyword.toUpperCase()) ||
            // eslint-disable-next-line unicorn/prefer-includes
            token.token_mint.toUpperCase().indexOf(keyword.toUpperCase()) >= 0
          )
        })
      }

      console.log('new###CoinSelect###tokenList####', tokenList)

      this.tokenList = cloneDeep(tokenList)
    }
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
    // max-height: 282px;
    // max-height: 310px;
    height: 282px;
    overflow-y: auto;
    margin-top: 20px;
    .coin-list {
      min-height: 300px;
      // background: red;
      li {
        display: flex;
        height: 48px;
        margin-top: 10px;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        color: #fff;
        cursor: pointer;
        .left {
          display: flex;
          align-items: center;
          img {
            width: 30px;
            height: 30px;
            border-radius: 100%;
          }
          // span {
          //   margin-left: 10px;
          // }
          .name-box {
            margin-left: 10px;
            h3,
            p {
              padding: 0px;
              margin: 0px;
            }
            p {
              font-size: 12px;
              color: rgba(255, 255, 255, 0.5);
            }
          }
        }
        .balance-box {
          padding-right: 10px;
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
