import { Numberu64, Numberu128, TokenSwap } from '../tokenSwap'
import { getterTree, mutationTree, actionTree } from 'typed-vuex'
import { PublicKey } from '@solana/web3.js'
import { cloneDeep } from 'lodash-es'
import { LIQUIDITY_POOLS } from '@/utils/pools'

import logger from '@/utils/logger'
import { SWAP_PAYER, SWAPV3_PROGRAMID } from '@/utils/ids'
import { TOKENS, RATES, NATIVE_SOL } from '@/utils/tokens'
import { fixD, decimalFormat, checkNullObj } from '@/utils'
import { tick2price, contractPrice2showPrice, preview_calculate_liqudity, preclaim, TickWord } from '@/tokenSwap/swapv3'
import BigNumber from 'bignumber.js'
import { fetchSwapPositionsByOwner, fetchSwapPositions } from '@/contract/farming'
import { LPFARMS } from '@/utils/farming'
import Decimal from 'decimal.js'
import { getprice } from '@/utils/stake'
import { fetchSwapPairs } from '@/contract/pool'
import { lamportPrice2uiPrice, tick2Price, calculateTokenAmount, tick2UiPrice } from 'test-crema-sdk'
import { loadSwapPair } from '@/contract/pool'

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
  currentPositon: {},
  rates: {},
  poolsDefaultPriceRangeObj: {} as any,
  tokensObj: null as any,
  coinPairConfigObj: null as any,
  poolsObj: null as any,
  liquidityPools: [] as any,
  myPositionObj: {},
  statisticsInfo: {},
  poolListLoading: true
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
  },
  setRates(state, value) {
    state.rates = value
  },
  setPoolsDefaultPriceRangeObj(state, value) {
    state.poolsDefaultPriceRangeObj = value
  },
  setCoinPairConfig(state, list: any) {
    const tokensObj = {} as any
    const coinPairConfigObj = {} as any
    for (let i = 0; i < list.length; i++) {
      const item: any = list[i]
      tokensObj[item.token_a.token_mint] = item.token_a
      tokensObj[item.token_b.token_mint] = item.token_b
      coinPairConfigObj[item.swap_account] = item
    }
    state.tokensObj = tokensObj
    state.coinPairConfigObj = coinPairConfigObj
  },
  setPoolsObj(state, res) {
    state.poolsObj = res
  },
  setMyPositionObj(state, res) {
    console.log(res, '==>myPositionObj##')
    state.myPositionObj = res
  },
  setStatisticsInfo(state, res) {
    state.statisticsInfo = res
  },
  setPoolListLoading(state, res) {
    state.poolListLoading = res
  }
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    // async requestInfos({ commit }) {
    //   commit('setLoading', true)
    //   const liquidityPools = {} as any // 池子信息
    //   // let userPositionAccountObj: any = {} // 用户仓位列表
    //   const myPosionList = [] as any // 我的仓位列表
    //   const connection = this.$web3
    //   const payer = SWAP_PAYER
    //   for (let i = 0; i < LIQUIDITY_POOLS.length; i++) {
    //     const userPositionAccountObj: any = {} // 用户仓位列表
    //     const pool = LIQUIDITY_POOLS[i]
    //     const poolInfo = cloneDeep(pool)
    //     const swapTokenPubkey = new PublicKey(pool.tokenSwapAccount)
    //     const tokenSwap = await TokenSwap.getAllAccounts(connection, swapTokenPubkey, SWAPV3_PROGRAMID, payer)
    //     console.log(i, '#####', 'tokenSwap####', tokenSwap)
    //     // 存用户仓位信息
    //     if (tokenSwap && tokenSwap.user_position_account_array && tokenSwap.user_position_account_array.length > 0) {
    //       tokenSwap.user_position_account_array.forEach((item) => {
    //         item.user_positions.forEach((pos) => {
    //           userPositionAccountObj[pos.nft_token_id.toString()] = pos
    //         })
    //       })
    //     }

    //     let coin = TOKENS[tokenSwap.mintA.toString()]
    //     if (tokenSwap.mintA.toString() === 'So11111111111111111111111111111111111111112') {
    //       coin = NATIVE_SOL
    //     }
    //     let pc = TOKENS[tokenSwap.mintB.toString()]
    //     if (tokenSwap.mintB.toString() === 'So11111111111111111111111111111111111111112') {
    //       pc = NATIVE_SOL
    //     }
    //     console.log('tokenSwap.mintA.toString()####', tokenSwap.mintA.toString())
    //     console.log('tokenSwap.mintB.toString()####', tokenSwap.mintB.toString())

    //     const name = `${coin.symbol}-${pc.symbol}`
    //     const currentPriceView = contractPrice2showPrice(tokenSwap.current_price.toNumber(), coin.decimals, pc.decimals) // 前端展示用(正向)
    //     const currentPriceViewReverse = String(1 / Number(currentPriceView)) // 前端展示当前价格(反向)
    //     const feeView = tokenSwap.fee.toNumber() / Math.pow(10, 10) // 考虑到展示百分比，所以除以了10次方， 实际decimal为12
    //     // console.log('feeView#####', feeView)
    //     const newPool = {
    //       ...tokenSwap,
    //       ...poolInfo,
    //       coin,
    //       pc,
    //       name,
    //       currentPriceView, // 前端展示的current_price
    //       currentPriceViewReverse,
    //       feeView, // 展示的fee
    //       programId: tokenSwap.tokenProgramId.toString(),
    //       poolCoinTokenAccount: tokenSwap.tokenAccountA.toString(),
    //       poolPcTokenAccount: tokenSwap.tokenAccountB.toString(),
    //       tickDetailKey: tokenSwap.tick_detail_key.toString(),
    //       userPositionKey: tokenSwap.user_position_key.toString(),
    //       userPositionAccountObj,
    //       tokenSwapOrigin: tokenSwap
    //     }

    //     liquidityPools[name] = newPool
    //   }

    //   console.log('liquidityPools#####', liquidityPools)

    //   commit('setInfos', liquidityPools)
    //   logger('Liquidity pool infomations updated')

    //   commit('setInitialized')
    //   commit('setLoading', false)
    // },
    // async getMyPositions({ state, commit }, tokenAccounts) {
    //   const conn = this.$web3
    //   const wallet = (this as any)._vm.$wallet

    //   const list: any = []
    //   const infos = state.infos
    //   if (checkNullObj(tokenAccounts)) {
    //     return list
    //   }

    //   console.log('getMyPositions###infos###', infos)

    //   for (const coinPair in infos) {
    //     const poolInfo = cloneDeep(infos[coinPair])
    //     const userPositionAccountObj = poolInfo.userPositionAccountObj

    //     let unstakeObj: any = {}
    //     // for (const key in infos) {
    //     const stakedPositons = await fetchSwapPositionsByOwner(
    //       new PublicKey(infos[coinPair].tokenSwapAccount),
    //       wallet.publicKey,
    //       conn,
    //       wallet
    //     )

    //     console.log('getMyPositions###stakedPositons###', stakedPositons)
    //     // statedList = [...statedList, ...stakedPositons]
    //     for (let j = 0; j < stakedPositons.length; j++) {
    //       unstakeObj[stakedPositons[j].nftTokenId.toString()] = stakedPositons[j]
    //     }
    //     // }

    //     for (const key in tokenAccounts) {
    //       if (userPositionAccountObj[key]) {
    //         const myPos = userPositionAccountObj[key]
    //         const minPrice = tick2price(myPos.lower_tick)
    //         const maxPrice = tick2price(myPos.upper_tick)

    //         console.log('myPos###liquity####', myPos.liquity.toString())
    //         if (unstakeObj[myPos.nft_token_id.toString()]) {
    //           list.push({
    //             ...unstakeObj[myPos.nft_token_id.toString()],
    //             nftTokenAccount: unstakeObj[myPos.nft_token_id.toString()].nftAccount.toString(),
    //             nftTokenId: myPos.nft_token_id.toString(),
    //             nftTokenMint: key,
    //             minPrice: fixD(Math.pow(minPrice, 2), 12),
    //             maxPrice: fixD(Math.pow(maxPrice, 2), 12),
    //             ...myPos,
    //             poolInfo
    //           })
    //         }
    //       }
    //     }
    //   }

    //   console.log('myPositions#####', list)
    //   commit('setMyPositions', list)
    // },

    async getMyPositionsNew({ state, commit }, tokenAccounts) {
      const connection = this.$web3
      const poolsObj = state.poolsObj
      const poolsList: any = Object.values(poolsObj)
      const promiseArr: any = []
      console.log('getMyPositionsNew####tokenAccounts####', tokenAccounts)
      console.log('getMyPositionsNew####poolsObj####', poolsObj)
      console.log('getMyPositionsNew####poolsList####', poolsList)
      for (let key in poolsObj) {
        promiseArr.push(fetchSwapPositions(new PublicKey(key), connection))
      }

      const result: any = await Promise.all(promiseArr)
      console.log('getMyPositionsNew####result####', result)

      const list: any = []
      for (let i = 0; i < result.length; i++) {
        for (let j = 0; j < result[i].length; j++) {
          const item = result[i][j]
          console.log('item.nftTokenId###', item.nftTokenId)
          console.log('item.nftTokenId###toBase58###', item.nftTokenId.toBase58())
          if (
            tokenAccounts[item.nftTokenId.toBase58()] &&
            tokenAccounts[item.nftTokenId.toBase58()].balance &&
            Number(tokenAccounts[item.nftTokenId.toBase58()].balance.fixed())
          ) {
            console.log('getMyPositionsNew####item.nftTokenId.toBase58()###', item.nftTokenId.toBase58())
            console.log(
              'getMyPositionsNew####tokenAccounts[item.nftTokenId.toBase58()]####balance###',
              tokenAccounts[item.nftTokenId.toBase58()].balance.fixed()
            )
            const citem: any = poolsList[i]
            // const minPrice = lamportPrice2uiPrice(
            //   tick2Price(item.lowerTick),
            //   citem.token_a.decimal,
            //   citem.token_b.decimal
            // )
            // const maxPrice = lamportPrice2uiPrice(
            //   tick2Price(item.upperTick),
            //   citem.token_a.decimal,
            //   citem.token_b.decimal
            // )
            const minPrice = tick2UiPrice(item.lowerTick, citem.token_a.decimal, citem.token_b.decimal)
            const maxPrice = tick2UiPrice(item.upperTick, citem.token_a.decimal, citem.token_b.decimal)
            list.push({
              ...poolsList[i],
              ...item,
              minPrice: fixD(minPrice.toString(), 12),
              maxPrice: fixD(maxPrice.toString(), 12),
              nftTokenAccount: tokenAccounts[item.nftTokenId.toBase58()].tokenAccountAddress,
              nftTokenMint: item.nftTokenId.toBase58()
            })
          }
        }
      }

      console.log('getMyPositionsNew####list####', list)

      commit('setMyPositions', list)
      const myPositionObj = {}
      list.forEach((item: any) => {
        myPositionObj[item.name] = item
      })
      console.log(myPositionObj, 'myPositionObj##')
      commit('setMyPositionObj', myPositionObj)
    },

    // async getMyPositions({ state, commit }) {},

    getRates({ commit }) {
      const result: any = {}
      // this.$axios.get('https://dev-api-crema.bitank.com/price?quote_symbol=usd').then((res: any) => {
      this.$axios.get('https://api.crema.finance/price?quote_symbol=usd').then((res: any) => {
        console.log('getRates###res####', res)

        if (res && res.data && res.data.prices) {
          res.data.prices.forEach((item) => {
            result[item.base_symbol] = Number(item.price)
          })
          console.log('getRates###result####', result)
          commit('setRates', result)
        }
      })
    },

    async setCurrentPositon({ state, commit }, data) {
      if (!data) {
        commit('setCurrentPosition', {})
        return
      }
      const conn = this.$web3
      const wallet = (this as any)._vm.$wallet
      const { myPosions, id } = data
      const list = myPosions
      // const id = this.$router
      let currentData: any = {}
      let isFind = false
      console.log('setCurrentPositon####list###', list)
      console.log('setCurrentPositon####id###', id)
      for (let i = 0; i < list.length; i++) {
        if (list[i].nftTokenMint === id) {
          currentData = list[i]
          isFind = true
          break
        }
      }

      console.log('setCurrentPositon####currentData###', currentData)

      if (isFind) {
        const swap: any = await loadSwapPair(currentData.tokenSwapKey, wallet)
        console.log('setCurrentPositon####swap####', swap)
        const { amountA, amountB } = calculateTokenAmount(
          currentData.lowerTick,
          currentData.upperTick,
          currentData.liquity,
          // swap.tokenSwapInfo.currentSqrtPrice
          currentData.currentSqrtPrice
        )
        console.log(currentData, 'currentData##368')

        console.log('setCurrentPositon####currentData.liquity#####', currentData.liquity.toString())
        console.log('setCurrentPositon####amountA####', amountA.toString())
        console.log('setCurrentPositon####amountB####', amountB.toString())

        const fromCoinAmount = fixD(amountA.div(Math.pow(10, currentData.token_a.decimal)), currentData.token_a.decimal)
        const toCoinAmount = fixD(amountB.div(Math.pow(10, currentData.token_b.decimal)), currentData.token_b.decimal)

        // const current
        const currentPrice = currentData.currentPriceView
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

        const feeObj: any = swap.preClaim(currentData.nftTokenId)

        const tokenaFee = feeObj.amountA.div(Math.pow(10, currentData.token_a.decimal))
        const tokenbFee = feeObj.amountB.div(Math.pow(10, currentData.token_b.decimal))

        // amountUSD计算
        const fromCoinAmountBig = new BigNumber(fromCoinAmount)
        const toCoinAmountBig = new BigNumber(toCoinAmount)
        const fromNum = fromCoinAmountBig.multipliedBy(currentPrice)
        const toNum = toCoinAmountBig.plus(fromNum)

        let pcSymbolRate = RATES[currentData.token_b.symbol] || 1

        if (state.rates[currentData.token_b.symbol.toUpperCase()]) {
          pcSymbolRate = state.rates[currentData.token_b.symbol.toUpperCase()]
        } else {
          try {
            const price = await getprice(currentData.token_b.symbol.toLowerCase())
            pcSymbolRate = price
          } catch (err) {}
        }

        if (currentData.token_b.symbol.toUpperCase() === 'CUSDC') {
          pcSymbolRate = RATES[currentData.token_b.symbol]
        }

        const amountUSDBig = toNum.multipliedBy(pcSymbolRate)

        const amountUSD = decimalFormat(amountUSDBig.toFixed(), 4)

        console.log('123###amountUSDBig####', amountUSDBig.toString())
        console.log('123###fromNum####', fromNum.toString())
        console.log('123###toCoinAmountBig###', toCoinAmountBig.toString())
        console.log('123###pcSymbolRate#####', pcSymbolRate.toString())

        // let fromPercent: any = fromNum.toNumber()
        //   ? fromNum.dividedBy(amountUSDBig.multipliedBy(pcSymbolRate)).multipliedBy(100)
        //   : new BigNumber(0)
        // let toPercent: any = toCoinAmountBig.toNumber()
        //   ? toCoinAmountBig.dividedBy(amountUSDBig.multipliedBy(pcSymbolRate)).multipliedBy(100)
        //   : new BigNumber(0)
        let fromPercent: any = fromNum.toNumber() ? fromNum.dividedBy(toNum).multipliedBy(100) : new BigNumber(0)
        let toPercent: any = toCoinAmountBig.toNumber()
          ? toCoinAmountBig.dividedBy(toNum).multipliedBy(100)
          : new BigNumber(0)

        console.log('123###fromPercent###', fromPercent.toString())
        console.log('123###toPercent###', toPercent.toString())

        fromPercent = Math.round(fromPercent.toNumber())
        toPercent = Math.round(toPercent.toNumber())

        // console.log('fromPercent####', fromPercent.toString())
        // console.log('toPercent####', toPercent.toString())

        // feeUSD计算

        // const tokenaFeeBig = new BigNumber(tokenaFee.toString())
        // const tokenbFeeBig = new BigNumber(tokenbFee.toString())

        // console.log('currentPrice####', currentPrice)

        // const tokenfeeA = feeObj.amountA.mul(currentPrice)
        // const tokenfeeB = tokenbFeeBig.plus(tokenfeeA)
        const tokenfeeA = tokenaFee.mul(currentPrice)
        const tokenfeeB = tokenbFee.plus(tokenfeeA)
        const feeUSDBig = tokenfeeB.mul(pcSymbolRate)
        const feeUSD = decimalFormat(feeUSDBig.toString(), 4)
        console.log('feeUSDBig.toString()####', feeUSDBig.toString())
        console.log('feeUSD###', feeUSD)

        const newData = {
          ...currentData,
          fromCoinAmount,
          toCoinAmount,
          tokenaFee: tokenaFee.toString(),
          tokenbFee: tokenbFee.toString(),
          amountUSD,
          feeUSD,
          currentStatus,
          id,
          fromPercent,
          toPercent
        }

        console.log('newData###', newData)

        commit('setCurrentPosition', newData)
      } else {
        // this.gotoMyPosition()
        console.log('sdsfsdfd')
        commit('setCurrentPosition', {})
      }
    },

    getPoolsDefaultPriceRange({ state, commit }) {
      // this.$axios.get(`https://dev-api-crema.bitank.com/v1/swap/count`).then((res) => {
      this.$axios.get(`https://api.crema.finance/v1/swap/count`).then((res) => {
        commit('setPoolListLoading', true)
        let pools: any = []
        let statisticsInfo = {}
        const result: any = {}
        if (res && res.data && res.data.pools) {
          pools = res.data.pools
          statisticsInfo = res.data
          commit('setPoolListLoading', false)
        }
        pools.forEach((item: any) => {
          result[item.name] = item
        })
        console.log('getPoolsDefaultPriceInterval###result#####', result)
        commit('setPoolsDefaultPriceRangeObj', result)
        commit('setStatisticsInfo', statisticsInfo)
      })
    },
    getPairConfigApi({ state, commit }) {
      // this.$axios.get(`https://dev-api-crema.bitank.com/config?name=swap-pairs`).then((res) => {
      this.$axios.get(`https://api.crema.finance/config?name=swap-pairs`).then((res) => {
        console.log('getPairConfigApi###res####', res)
        if (res && res.data) {
          commit('setCoinPairConfig', [
            ...res.data
            // {
            //   fee: '0.0001',
            //   name: 'CNSOL-CNUSDC',
            //   price_interval: {
            //     lower_price: '997.702098',
            //     upper_price: '999.699399'
            //   },
            //   swap_account: '7JEGfvmHNecSV826CAAwoeaf2tY55jM9vQJrt1avALmy',
            //   token_a: {
            //     decimal: 9,
            //     name: 'CNSOL test',
            //     symbol: 'CNSOL',
            //     swap_token_account: '',
            //     token_mint: '8CZUSdQu5A6jE4oWMVYRZ29QVpYXigostjnYbWjXuCYs'
            //   },
            //   token_b: {
            //     decimal: 6,
            //     name: 'CNUSDC test',
            //     symbol: 'CNUSDC',
            //     swap_token_account: '',
            //     token_mint: 'BVwhuJSmKCTXVCP6y1Vyso46Z8tktD3LBBkBGtcESvji'
            //   }
            // },
            // {
            //   fee: '0.0001',
            //   name: 'TEST1-TEST2',
            //   price_interval: {
            //     lower_price: '0.9',
            //     upper_price: '1.1'
            //   },
            //   swap_account: 'C3xNCM3SGR4NLCSWSJyaKdvSPWvJnGMMLYQ2rhPufyBF',
            //   token_a: {
            //     decimal: 6,
            //     name: 'TEST1 test',
            //     symbol: 'TEST1',
            //     swap_token_account: '',
            //     token_mint: '5TCMBNQ6QV5a57c9vbCusv9BSK83rsPzTLoDFeyxaEWb'
            //   },
            //   token_b: {
            //     decimal: 9,
            //     name: 'TEST2 test',
            //     symbol: 'TEST2',
            //     swap_token_account: '',
            //     token_mint: 'ETJ8GA6R9h3H6KEzbpRR1ZCT14ePQaNeDUWHGV5aMqNt'
            //   }
            // }
          ])
        }
      })
    },
    async getPoolList({ state, commit }) {
      commit('setLoading', true)
      // const conn = this.$web3
      const coinPairConfigObj = state.coinPairConfigObj
      const wallet = (this as any)._vm.$wallet
      console.log('getPoolList####start###', new Date().getTime())
      const list: any = await fetchSwapPairs(wallet)
      console.log('getPoolList####end###', new Date().getTime())
      console.log('getPoolList####', list)

      const result: any = {}
      for (let i = 0; i < list.length; i++) {
        const item: any = list[i]

        const citem: any = coinPairConfigObj[item.tokenSwapKey.toString()]
        if (citem) {
          const currentPriceView = lamportPrice2uiPrice(
            item.currentSqrtPrice.pow(2),
            citem.token_a.decimal,
            citem.token_b.decimal
          ).toNumber()
          const currentPriceViewReverse = String(1 / Number(currentPriceView))
          result[item.tokenSwapKey.toString()] = {
            ...citem,
            ...item,
            feeView: item.fee.mul(100).toNumber(),
            currentPriceView,
            currentPriceViewReverse
          }
        }
      }

      console.log('setPoolsObj####result###', result)
      commit('setPoolsObj', result)
      commit('setLoading', false)
    }
  }
)
