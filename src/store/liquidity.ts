import { Numberu64, Numberu128, TokenSwap } from '../tokenSwap'
import { getterTree, mutationTree, actionTree } from 'typed-vuex'
import { PublicKey } from '@solana/web3.js'
import { cloneDeep } from 'lodash-es'
import { LIQUIDITY_POOLS } from '@/utils/pools'

import logger from '@/utils/logger'
import { SWAP_PAYER, SWAPV3_PROGRAMID } from '@/utils/ids'
import { TOKENS, RATES } from '@/utils/tokens'
import { fixD, decimalFormat, checkNullObj } from '@/utils'
import { tick2price, contractPrice2showPrice, preview_calculate_liqudity, preclaim, TickWord } from '@/tokenSwap/swapv3'
import BigNumber from 'bignumber.js'

// const AUTO_REFRESH_TIME = 60
const AUTO_REFRESH_TIME = 60

export const state = () => ({
  initialized: false,
  loading: false,

  autoRefreshTime: AUTO_REFRESH_TIME,
  countdown: 0,
  lastSubBlock: 0,

  feeIsSet: false,
  infos: {} as any,
  myPositions: [],
  currentPositon: {}
  // userPositionAccountObj: {} as any
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
  },

  setMyPositions(state, list: any) {
    state.myPositions = cloneDeep(list)
  },

  setCurrentPosition(state, obj: object) {
    state.currentPositon = cloneDeep(obj)
  }
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    async requestInfos({ commit }) {
      const liquidityPools = {} as any // 池子信息
      // let userPositionAccountObj: any = {} // 用户仓位列表
      const myPosionList = [] as any // 我的仓位列表
      const connection = this.$web3
      const payer = SWAP_PAYER
      for (let i = 0; i < LIQUIDITY_POOLS.length; i++) {
        const userPositionAccountObj: any = {} // 用户仓位列表
        const pool = LIQUIDITY_POOLS[i]
        const poolInfo = cloneDeep(pool)
        const swapTokenPubkey = new PublicKey(pool.tokenSwapAccount)
        const tokenSwap = await TokenSwap.getAllAccounts(connection, swapTokenPubkey, SWAPV3_PROGRAMID, payer)
        console.log(i, '#####', 'tokenSwap####', tokenSwap)
        // 存用户仓位信息
        if (tokenSwap && tokenSwap.user_position_account_array && tokenSwap.user_position_account_array.length > 0) {
          tokenSwap.user_position_account_array.forEach((item) => {
            item.user_positions.forEach((pos) => {
              userPositionAccountObj[pos.nft_token_id.toString()] = pos
            })
          })
        }

        const coin = TOKENS[tokenSwap.mintA.toString()]
        const pc = TOKENS[tokenSwap.mintB.toString()]
        const name = `${coin.symbol}-${pc.symbol}`
        const currentPriceView = contractPrice2showPrice(tokenSwap.current_price.toNumber(), coin.decimals, pc.decimals) // 前端展示用(正向)
        const currentPriceViewReverse = String(1 / Number(currentPriceView)) // 前端展示当前价格(反向)
        const feeView = tokenSwap.fee.toNumber() / Math.pow(10, 10) // 考虑到展示百分比，所以除以了10次方， 实际decimal为12
        const newPool = {
          ...tokenSwap,
          ...poolInfo,
          coin,
          pc,
          name,
          currentPriceView, // 前端展示的current_price
          currentPriceViewReverse,
          feeView, // 展示的fee
          programId: tokenSwap.tokenProgramId.toString(),
          poolCoinTokenAccount: tokenSwap.tokenAccountA.toString(),
          poolPcTokenAccount: tokenSwap.tokenAccountB.toString(),
          tickDetailKey: tokenSwap.tick_detail_key.toString(),
          userPositionKey: tokenSwap.user_position_key.toString(),
          userPositionAccountObj,
          tokenSwapOrigin: tokenSwap
        }

        liquidityPools[name] = newPool
        console.log('swapProgramId#####', tokenSwap.swapProgramId.toString())
      }

      commit('setInfos', liquidityPools)
      logger('Liquidity pool infomations updated')

      commit('setInitialized')
      commit('setLoading', false)
    },
    getMyPositions({ state, commit }, tokenAccounts) {
      const list: any = []
      const infos = state.infos
      if (checkNullObj(tokenAccounts)) {
        return list
      }
      for (const coinPair in infos) {
        const poolInfo = cloneDeep(infos[coinPair])
        const userPositionAccountObj = poolInfo.userPositionAccountObj

        for (const key in tokenAccounts) {
          if (userPositionAccountObj[key]) {
            const myPos = userPositionAccountObj[key]
            const minPrice = tick2price(myPos.lower_tick)
            const maxPrice = tick2price(myPos.upper_tick)
            list.push({
              nftTokenId: myPos.nft_token_id.toString(),
              nftTokenMint: key,
              minPrice: fixD(Math.pow(minPrice, 2), 12),
              maxPrice: fixD(Math.pow(maxPrice, 2), 12),
              ...myPos,
              poolInfo
            })
          }
        }
      }
      commit('setMyPositions', list)
    },
    setCurrentPositon({ commit }, data) {
      const { myPosions, id } = data
      const list = myPosions
      // const id = this.$router
      let currentData: any = {}
      let isFind = false
      for (let i = 0; i < list.length; i++) {
        if (list[i].nftTokenId === id) {
          currentData = list[i]
          isFind = true
          break
        }
      }

      if (isFind) {
        console.log('到这里了吗####isFind###', isFind)
        console.log('currentData####', currentData)
        const { ans_src, ans_dst } = preview_calculate_liqudity(
          currentData.lower_tick,
          currentData.upper_tick,
          currentData.liquity,
          currentData.poolInfo.current_price
        )

        const fromCoinAmount = fixD(
          ans_src / Math.pow(10, currentData.poolInfo.coin.decimals),
          currentData.poolInfo.coin.decimals
        )
        const toCoinAmount = fixD(
          ans_dst / Math.pow(10, currentData.poolInfo.pc.decimals),
          currentData.poolInfo.pc.decimals
        )

        // const current
        const currentPrice = currentData.poolInfo.currentPriceView
        const minPrice = Number(currentData.minPrice)
        const maxPrice = currentData.maxPrice.indexOf('+') > 0 ? 99999999999999 : Number(currentData.maxPrice)

        let currentStatus = ''
        // // 区间中包含当前价格, 一种资产返回另外一种资产，并且返回liquity
        if (currentPrice >= minPrice && currentPrice <= maxPrice) {
          currentStatus = 'Active'
        } else if (currentPrice > maxPrice) {
          // 区间在当前价格的左侧时，也就是只有token b这一种资产, 返回liquity
          currentStatus = 'Inactive'
        } else if (currentPrice < minPrice) {
          // 区间在当前价格的右侧时，也就是只有token a这一种资产, 返回liquity
          currentStatus = 'Inactive'
        }

        let tick_word = new TickWord(currentData.poolInfo.tick_info_array, currentData.poolInfo.tick_info_array.length)
        const { token_a_fee, token_b_fee } = preclaim(tick_word, currentData, currentData.poolInfo)

        console.log('watchCurrentData####token_a_fee####', token_a_fee.toString())
        console.log('watchCurrentData####token_b_fee####', token_b_fee.toString())
        // const a = token_a_fee.div(new Numberu128(Math.pow(10, poolData.coin.decimals)))
        // const b = token_b_fee.div(new Numberu128(Math.pow(10, poolData.pc.decimals)))
        const a = token_a_fee.toNumber() / Math.pow(10, currentData.poolInfo.coin.decimals)
        const b = token_b_fee.toNumber() / Math.pow(10, currentData.poolInfo.pc.decimals)

        const tokenaFee = a
        const tokenbFee = b

        // amountUSD计算
        const fromCoinAmountBig = new BigNumber(fromCoinAmount)
        const toCoinAmountBig = new BigNumber(toCoinAmount)
        const fromNum = fromCoinAmountBig.multipliedBy(currentPrice)
        const toNum = toCoinAmountBig.plus(fromNum)
        const amountUSDBig = toNum.multipliedBy(RATES[currentData.poolInfo.pc.symbol])

        const amountUSD = decimalFormat(amountUSDBig.toFixed(), 4)

        let fromPercent: any = fromNum.toNumber()
          ? fromNum.dividedBy(amountUSDBig.multipliedBy(RATES[currentData.poolInfo.pc.symbol])).multipliedBy(100)
          : new BigNumber(0)
        let toPercent: any = toCoinAmountBig.toNumber()
          ? toCoinAmountBig
              .dividedBy(amountUSDBig.multipliedBy(RATES[currentData.poolInfo.pc.symbol]))
              .multipliedBy(100)
          : new BigNumber(0)

        fromPercent = Math.round(fromPercent.toNumber())
        toPercent = Math.round(toPercent.toNumber())

        // console.log('fromPercent####', fromPercent.toString())
        // console.log('toPercent####', toPercent.toString())

        // feeUSD计算

        const tokenaFeeBig = new BigNumber(tokenaFee)
        const tokenbFeeBig = new BigNumber(tokenbFee)

        const tokenfeeA = tokenaFeeBig.multipliedBy(currentPrice)
        const tokenfeeB = tokenbFeeBig.plus(tokenfeeA)
        const feeUSDBig = tokenfeeB.multipliedBy(RATES[currentData.poolInfo.pc.symbol])
        const feeUSD = decimalFormat(feeUSDBig.toFixed(), 4)

        const newData = {
          ...currentData,
          fromCoinAmount,
          toCoinAmount,
          tokenaFee,
          tokenbFee,
          amountUSD,
          feeUSD,
          currentStatus,
          id,
          fromPercent,
          toPercent
        }

        commit('setCurrentPosition', newData)
      } else {
        // this.gotoMyPosition()
        console.log('sdsfsdfd')
        commit('setCurrentPosition', {})
      }
    }
  }
)
