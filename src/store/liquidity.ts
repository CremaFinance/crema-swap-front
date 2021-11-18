import {
  // Numberu64,
  TokenSwap
} from '../tokenSwap'
import { getterTree, mutationTree, actionTree } from 'typed-vuex'
// import { OpenOrders } from '@project-serum/serum'
import { PublicKey, Account } from '@solana/web3.js'
import { cloneDeep } from 'lodash-es'
// import {
//   ACCOUNT_LAYOUT,
//   MINT_LAYOUT
//   // SwapPoolLayout
// } from '@/utils/layouts'
// import {
//   // AMM_INFO_LAYOUT,
//   // AMM_INFO_LAYOUT_V3,
//   AMM_INFO_LAYOUT_V4
// } from '@/utils/liquidity'
import {
  LIQUIDITY_POOLS
  // getAddressForWhat
} from '@/utils/pools'
// import { commitment, getMultipleAccounts } from '@/utils/web3'
// import { getStakeAccountInfo } from '@/utils/stake'

import { TokenAmount } from '@/utils/safe-math'

// import logger from '@/utils/logger'
// import { TokenSwap } from '@/tokenSwap'

import logger from '@/utils/logger'

// const AUTO_REFRESH_TIME = 60
const AUTO_REFRESH_TIME = 6

export const state = () => ({
  initialized: false,
  loading: false,

  autoRefreshTime: AUTO_REFRESH_TIME,
  countdown: 0,
  lastSubBlock: 0,

  infos: {},
  feeIsSet: false
})

export const getters = getterTree(state, {})

export const mutations = mutationTree(state, {
  setInitialized(state) {
    state.initialized = true
  },

  setLoading(state, loading: boolean) {
    if (loading) {
      state.countdown = AUTO_REFRESH_TIME
    }

    state.loading = loading

    if (!loading) {
      state.countdown = 0
    }
  },

  setInfos(state, infos: object) {
    state.infos = cloneDeep(infos)
  },

  setCountdown(state, countdown: number) {
    state.countdown = countdown
  },

  setLastSubBlock(state, lastSubBlock: number) {
    state.lastSubBlock = lastSubBlock
  },
  setFeeIsSet(state, feeIsSet: boolean) {
    state.feeIsSet = feeIsSet
  }
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    async requestInfos({ commit }) {
      console.log('liquidity###requestInfos#####')
      commit('setLoading', true)

      const conn = this.$web3
      const liquidityPools = {} as any
      // const publicKeys = [] as any

      const swapPayer = new Account([
        104, 175, 178, 162, 29, 34, 251, 8, 16, 31, 138, 62, 52, 119, 198, 130, 5, 225, 96, 153, 237, 181, 67, 56, 93,
        203, 160, 38, 160, 129, 138, 11, 55, 165, 121, 217, 51, 156, 240, 143, 43, 176, 65, 227, 29, 128, 188, 67, 226,
        178, 84, 67, 224, 141, 121, 198, 127, 13, 182, 219, 202, 197, 220, 112
      ])
      const SWAPV3_PROGRAMID: PublicKey = new PublicKey('C8L7YYHrn38sKfAxVo5BFsGYFWcLeRAdaavVNfzg9s5N')
      for (let i = 0; i < LIQUIDITY_POOLS.length; i++) {
        const pool = LIQUIDITY_POOLS[i]

        const { coin, pc } = pool

        const poolInfo = cloneDeep(pool)

        poolInfo.coin.balance = new TokenAmount(0, coin.decimals)
        poolInfo.pc.balance = new TokenAmount(0, pc.decimals)

        const tokenSwap = await TokenSwap.loadTokenSwap(
          conn,
          new PublicKey(poolInfo.tokenSwapAccount),
          SWAPV3_PROGRAMID,
          swapPayer
        )

        // console.log('the token swap token id:', tokenSwap.swapProgramId.toString())
        // console.log('the token program id:', tokenSwap.tokenProgramId.toString())
        // console.log('the program  authority:', tokenSwap.authority.toString())
        // console.log('the token swap account:', tokenSwap.tokenSwap.toString())
        // console.log('the token a account:', tokenSwap.tokenAccountA.toString())
        // console.log('the token b account:', tokenSwap.tokenAccountB.toString())
        // console.log('the token a is', tokenSwap.mintA.toString())
        // console.log('the token b is', tokenSwap.mintB.toString())
        // console.log('tokenSwap####', tokenSwap)
        // console.log('tokenSwap.current_price#####', tokenSwap.current_price)

        poolInfo.currentPrice = tokenSwap.current_price
        poolInfo.fee = tokenSwap.fee / Math.pow(10, 10) // 考虑到展示百分比，所以除以了10次方， 实际decimal为12

        liquidityPools[poolInfo.name] = poolInfo
      }

      console.log('liquidityPools#####', liquidityPools)

      commit('setInfos', liquidityPools)
      logger('Liquidity pool infomations updated')

      commit('setInitialized')
      commit('setLoading', false)
    }
  }
)
