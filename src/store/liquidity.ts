import { getterTree, mutationTree, actionTree } from 'typed-vuex'
import { PublicKey } from '@solana/web3.js'
import { cloneDeep } from 'lodash-es'

import { RATES } from '@/utils/tokens'
import { fixD, decimalFormat, checkNullObj } from '@/utils'
import BigNumber from 'bignumber.js'
import { fetchSwapPositions } from '@/contract/farming'
import { getprice } from '@/utils/stake'
import { fetchSwapPairs, loadSwapPair } from '@/contract/pool'
import { lamportPrice2uiPrice, calculateTokenAmount, tick2UiPrice } from 'test-crema-sdk'

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
  poolListLoading: true,
  currentPositonLoading: false,
  myPositionLoading: false
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
  setCurrentPositonLoading(state, value: boolean) {
    state.currentPositonLoading = value
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

    console.log('tokensObj####', tokensObj)
    state.tokensObj = tokensObj
    state.coinPairConfigObj = coinPairConfigObj
  },
  setPoolsObj(state, res) {
    state.poolsObj = res
  },
  setMyPositionObj(state, res) {
    state.myPositionObj = res
  },
  setStatisticsInfo(state, res) {
    state.statisticsInfo = res
  },
  setPoolListLoading(state, res) {
    state.poolListLoading = res
  },
  setMyPositionLoading(state, value: boolean) {
    state.myPositionLoading = value
  }
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    async getMyPositionsNew({ state, commit }, tokenAccounts) {
      commit('setMyPositionLoading', true)
      commit('setCurrentPositonLoading', true)
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
      commit('setMyPositionObj', myPositionObj)
      commit('setMyPositionLoading', false)
    },

    // async getMyPositions({ state, commit }) {},

    getRates({ commit }) {
      const result: any = {}
      // this.$axios.get('https://dev-api-crema.bitank.com/price?quote_symbol=usd').then((res: any) => {
      this.$axios.get('https://pre-api-crema.bitank.com/price?quote_symbol=usd').then((res: any) => {
        // this.$axios.get('https://api.crema.finance/price?quote_symbol=usd').then((res: any) => {
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
      commit('setCurrentPositonLoading', true)
      if (!data) {
        commit('setCurrentPosition', {})
        commit('setCurrentPositonLoading', false)
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
      commit('setCurrentPositonLoading', true)

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

        let fromPercent: any = fromNum.toNumber()
          ? fromNum.multipliedBy(pcSymbolRate).dividedBy(amountUSDBig).multipliedBy(100)
          : new BigNumber(0)
        let toPercent: any = toCoinAmountBig.toNumber()
          ? toCoinAmountBig.multipliedBy(pcSymbolRate).dividedBy(amountUSDBig).multipliedBy(100)
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
      commit('setCurrentPositonLoading', false)
    },

    getPoolsDefaultPriceRange({ state, commit }) {
      // this.$axios.get(`https://dev-api-crema.bitank.com/v1/swap/count`).then((res) => {
      this.$axios.get(`https://pre-api-crema.bitank.com/v1/swap/count`).then((res) => {
        // this.$axios.get(`https://api.crema.finance/v1/swap/count/new`).then((res) => {
        // this.$axios.get(`https://api.crema.finance/v1/swap/count`).then((res) => {
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
      this.$axios.get(`https://pre-api-crema.bitank.com/config?name=swap-pairs`).then((res) => {
        // this.$axios.get(`https://api.crema.finance/config?name=swap-pairs`).then((res) => {
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
