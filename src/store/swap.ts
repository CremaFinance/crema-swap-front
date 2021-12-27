import { getterTree, mutationTree, actionTree } from 'typed-vuex'
// import { PublicKey } from '@solana/web3.js'
// import { _MARKET_STATE_LAYOUT_V2 } from '@project-serum/serum/lib/market.js'
import { cloneDeep } from 'lodash-es'
// import { SERUM_PROGRAM_ID_V3 } from '@/utils/ids'
// import { MARKETS } from '@/utils/serum'
// import { getFilteredProgramAccounts } from '@/utils/web3'
// import logger from '@/utils/logger'
import { TOKEN_LIST_URL } from '@jup-ag/core'

export const state = () => ({
  markets: {},
  tokenIsLoading: true,
  tokens: [] as any,
  tokensObj: {} as any
})

export const getters = getterTree(state, {})

export const mutations = mutationTree(state, {
  setMarkets(state, markets: any) {
    state.markets = cloneDeep(markets)
  },
  setTokens(state, tokens: any) {
    state.tokenIsLoading = false
    state.tokens = tokens
    const objs: any = {}
    tokens.forEach((item: any) => {
      objs[item.address] = item
    })
    state.tokensObj = objs
  }
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    getTokens({ commit }) {
      fetch(TOKEN_LIST_URL['mainnet-beta']).then((res) => {
        res.json().then((tokens) => {
          commit('setTokens', tokens)
        })
      })
    }
    // getMarkets({ commit }) {
    //   const conn = this.$web3
    //   const filters = [
    //     {
    //       dataSize: _MARKET_STATE_LAYOUT_V2.span
    //     }
    //   ]
    //   getFilteredProgramAccounts(conn, new PublicKey(SERUM_PROGRAM_ID_V3), filters)
    //     .then((marketInfos) => {
    //       const markets: any = {}
    //       marketInfos.forEach((marketInfo) => {
    //         const address = marketInfo.publicKey.toBase58()
    //         if (MARKETS.includes(address)) {
    //           const { data } = marketInfo.accountInfo
    //           markets[address] = _MARKET_STATE_LAYOUT_V2.decode(data)
    //         }
    //       })
    //       commit('setMarkets', markets)
    //       logger('Markets updated')
    //     })
    //     .catch()
    // }
  }
)
