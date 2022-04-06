import { getterTree, mutationTree, actionTree } from 'typed-vuex'
import { LPFARMS } from '@/utils/farming'
import { fetchSwapPositionsByOwner, minerInfo, fetchPositionWrapper, fetchStakedPositions } from '@/contract/farming'
import {
  clusterApiUrl,
  Connection,
  Keypair,
  PublicKey,
  AccountInfo as BaseAccountInfo,
  Signer,
  TokenAccountsFilter
} from '@solana/web3.js'
import { TokenSwap, calculateTokenAmount, tick2Price } from '@cremafinance/crema-sdk'
import { SWAPV3_PROGRAMID, SWAP_PAYER } from '@/utils/ids'
import Decimal from 'decimal.js'
import { RATES, TOKENS } from '@/utils/tokens'
import { decimalFormat, addCommom } from '@/utils'
import { TokenSwap as CTokenSwap } from '../tokenSwap'
import { contractPrice2showPrice } from '@/tokenSwap/swapv3'

// import {
//   getNearestTickByPrice,
//   tick2Price,
//   price2Tick,
//   calculateLiquityOnlyA,
//   calculateLiquityOnlyB,
//   calculateLiquity,
//   TokenSwap
// } from '@cremafinance/crema-sdk'

export const state = () => ({
  farmingConfig: null as any,
  farmingList: [],
  loading: false,
  farmingListLoading: false,
  earnings: '',
  earningObj: {} as any,
  earningLoading: false,
  farmingConfigObj: null as any,
  statisticsDataObj: null as any,
  positionsObj: {} as any,
  positionsLoadingObj: {} as any
})

export const getters = getterTree(state, {})

export const mutations = mutationTree(state, {
  setFarmingList(state, list) {
    state.farmingList = list
  },
  setFarmingListLoading(state, status) {
    state.farmingListLoading = status
  },
  setLoading(state, value) {
    state.loading = value
  },
  setEarnings(state, value) {
    state.earnings = value
  },
  setEarningObj(state, value) {
    state.earningObj = value
  },
  setEarningLoading(state, value) {
    state.earningLoading = value
  },

  setFarmingConfig(state, value) {
    state.farmingConfig = value
  },
  setFarmingConfigObj(state, value) {
    state.farmingConfigObj = value
  },
  setStatisticsDataObj(state, value) {
    state.statisticsDataObj = value
  },
  setPositionsObj(state, value: any) {
    if (state.positionsObj) {
      state.positionsObj = {
        ...state.positionsObj,
        [value.farmingInfo.positionWrapper]: value.positions
      }
    } else {
      state.positionsObj = {
        [value.farmingInfo.positionWrapper]: value.positions
      }
    }
    // state.positionsObj = value
  },
  setPositionsLoadingObj(state, value: any) {
    state.positionsLoadingObj = {
      ...state.positionsLoadingObj,
      [value.key]: value.value
    }
  }
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    async getStatisticsDataObj({ commit }) {
      const result: any = {}
      // const res: any = await this.$axios.get('https://dev-api-crema.bitank.com/farm/tvl')
      const res: any = await this.$axios.get('https://pre-api-crema.bitank.com/farm/tvl')
      console.log('getStatisticsDataObj####res####', res)
      if (res && res.wrappers) {
        res.wrappers.forEach((item) => {
          result[item.swapKey] = item
        })
      }

      commit('setStatisticsDataObj', result)
      console.log('getStatisticsDataObj####result###', result)
    },
    async getFarmingConfig({ commit }) {
      // https://api.crema.finance/config?name=farming  生产
      // https://pre-api-crema.bitank.com/config?name=farming 预发布
      // const configRes = await this.$axios.get('https://dev-api-crema.bitank.com/config?name=farming')
      const configRes = await this.$axios.get('https://api.crema.finance/config?name=farming')
      console.log('getFarmingConfig###res####', configRes)
      const farmingConfig: any = []
      if (configRes && configRes.data) {
        configRes.data.forEach((item) => {
          farmingConfig.push({
            ...item,
            tokenA: TOKENS[item.tokenA],
            tokenB: TOKENS[item.tokenB]
          })
        })
      }
      commit('setFarmingConfigObj', farmingConfig)
    },
    getFarmingList({ state, commit }, { rates, farmingConfig, haveLoading, tvlData }) {
      console.log('123getFarmingList###rates####', rates)
      console.log('123getFarmingList###haveLoading####', haveLoading)
      console.log('123getFarmingList###farmingConfig####', farmingConfig)
      const RATES = { ...rates, CUSDC: 1 }
      const LPFARMS = farmingConfig
      console.log('LPFARMS####', LPFARMS)

      commit('setLoading', true)
      if (haveLoading) {
        commit('setFarmingListLoading', true)
      }

      const conn = this.$web3
      const wallet = (this as any)._vm.$wallet
      console.log('wallet####', wallet)

      const result: any = []
      // const rewardTokenInfo = await conn.getTokenSupply(new PublicKey(farmingConfig[0].rewardTokenMint))
      // const rewardTokenDecimal = rewardTokenInfo.value.decimals
      for (let key in farmingConfig) {
        const { tokenA, tokenB } = farmingConfig[key]
        // const swap = await new TokenSwap(
        //   conn,
        //   new PublicKey(SWAPV3_PROGRAMID),
        //   new PublicKey(farmingConfig[key].swapKey),
        //   null
        // ).load()

        // console.log('farming#####swap####', swap)

        // if (wallet) {
        //   // const payer = SWAP_PAYER
        //   // const tokenSwap = await CTokenSwap.getAllAccounts(
        //   //   conn,
        //   //   new PublicKey(farmingConfig[key].swapKey),
        //   //   SWAPV3_PROGRAMID,
        //   //   payer
        //   // )
        //   // const currentPrice = contractPrice2showPrice(
        //   //   tokenSwap.current_price.toNumber(),
        //   //   tokenA.decimals,
        //   //   tokenB.decimals
        //   // )

        //   // const canStatePositions: any = await fetchSwapPositionsByOwner(
        //   //   new PublicKey(farmingConfig[key].swapKey),
        //   //   wallet.publicKey,
        //   //   conn,
        //   //   wallet
        //   // )

        //   // console.log('farming#####canStatePositions####', canStatePositions)

        //   // const cpresult: any = []
        //   // for (let j = 0; j < canStatePositions.length; j++) {
        //   //   const amount = await calculateTokenAmount(
        //   //     canStatePositions[j].lowerTick,
        //   //     canStatePositions[j].upperTick,
        //   //     new Decimal(canStatePositions[j].liquity),
        //   //     swap.tokenSwapInfo.currentSqrtPrice
        //   //   )

        //   //   const amountA = amount.amountA.div(Math.pow(10, tokenA.decimals)).mul(currentPrice)
        //   //   const amountB = amount.amountB.div(Math.pow(10, tokenB.decimals))

        //   //   let liquityUSD = amountA.plus(amountB)
        //   //   liquityUSD = liquityUSD.mul(RATES[tokenB.symbol])

        //   //   let withinRange = true

        //   //   // 判断是否在有效tick范围内
        //   //   const etrMax =
        //   //     (tvlData &&
        //   //       tvlData[farmingConfig[key].positionWrapper] &&
        //   //       tvlData[farmingConfig[key].positionWrapper].etrMax) ||
        //   //     0
        //   //   const etrMin =
        //   //     (tvlData &&
        //   //       tvlData[farmingConfig[key].positionWrapper] &&
        //   //       tvlData[farmingConfig[key].positionWrapper].etrMin) ||
        //   //     0
        //   //   if (canStatePositions[j].lowerTick >= etrMax || canStatePositions[j].upperTick <= etrMin) {
        //   //     withinRange = false
        //   //   }

        //   //   console.log('canStatePositions[j].lowerTick###', canStatePositions[j].lowerTick)
        //   //   console.log('canStatePositions[j].upperTick###', canStatePositions[j].upperTick)

        //   //   cpresult.push({
        //   //     ...canStatePositions[j],
        //   //     nftMintAddress: canStatePositions[j].nftTokenId.toString(),
        //   //     nftAccountAddress: canStatePositions[j].nftAccount.toString(),
        //   //     liquityToString: canStatePositions[j].liquity.toString(),
        //   //     liquityUSD: addCommom(liquityUSD.toString(), 4),
        //   //     lowerPrice:
        //   //       canStatePositions[j].lowerTick !== -443632
        //   //         ? decimalFormat(tick2Price(canStatePositions[j].lowerTick).toString(), 6)
        //   //         : '0',
        //   //     upperPrice:
        //   //       canStatePositions[j].upperTick !== 443632
        //   //         ? decimalFormat(tick2Price(canStatePositions[j].upperTick).toString(), 6)
        //   //         : '∞',
        //   //     isStaked: false,
        //   //     withinRange
        //   //   })
        //   // }

        //   // const stakedPositons = await fetchStakedPositions(
        //   //   conn,
        //   //   wallet,
        //   //   new PublicKey(farmingConfig[key].positionWrapper),
        //   //   wallet.publicKey
        //   // )

        //   // console.log('farming#####stakedPositons####', stakedPositons)

        //   // const sdresult: any = []
        //   // for (let k = 0; k < stakedPositons.length; k++) {
        //   //   const item: any = stakedPositons[k]
        //   //   const amount = await calculateTokenAmount(
        //   //     stakedPositons[k].lowerTick,
        //   //     stakedPositons[k].upperTick,
        //   //     new Decimal(stakedPositons[k].liquity.toString()),
        //   //     swap.tokenSwapInfo.currentSqrtPrice
        //   //   )

        //   //   const amountA = amount.amountA.div(Math.pow(10, tokenA.decimals)).mul(currentPrice)
        //   //   const amountB = amount.amountB.div(Math.pow(10, tokenB.decimals))

        //   //   // const liquityUSD = amountA.mul(RATES[tokenA.symbol]).plus(amountB.mul(RATES[tokenB.symbol]))
        //   //   let liquityUSD = amountA.plus(amountB)
        //   //   liquityUSD = liquityUSD.mul(RATES[tokenB.symbol])
        //   //   sdresult.push({
        //   //     ...stakedPositons[k],
        //   //     nftMintAddress: stakedPositons[k].nftMint.toString(),
        //   //     nftAccountAddress: item.nftVault.toString(),
        //   //     liquityToString: stakedPositons[k].liquity.toString(),
        //   //     liquityUSD: addCommom(liquityUSD.toString(), 4),
        //   //     lowerPrice:
        //   //       stakedPositons[k].lowerTick !== -443632
        //   //         ? decimalFormat(tick2Price(stakedPositons[k].lowerTick).toString(), 6)
        //   //         : '0',
        //   //     upperPrice:
        //   //       stakedPositons[k].upperTick !== 443632
        //   //         ? decimalFormat(tick2Price(stakedPositons[k].upperTick).toString(), 6)
        //   //         : '∞',
        //   //     isStaked: true
        //   //   })
        //   // }

        //   // cpresult.sort(function (a, b) {
        //   //   return b.withinRange - a.withinRange
        //   // })
        //   console.log('farmingConfig[key]####', farmingConfig[key])
        //   result.push({
        //     ...farmingConfig[key],
        //     // positions: [...sdresult, ...cpresult],
        //     positions: [],
        //     minPrice:
        //       (farmingConfig[key] && farmingConfig[key].effectivePrice && farmingConfig[key].effectivePrice[0]) || 0,
        //     maxPrice:
        //       (farmingConfig[key] && farmingConfig[key].effectivePrice && farmingConfig[key].effectivePrice[1]) || 0
        //     // miner: miner
        //     //   ? {
        //     //       ...miner,
        //     //       PendingRewardView: new Decimal(miner.PendingReward).div(Math.pow(10, rewardTokenDecimal)).toString()
        //     //     }
        //     //   : null,
        //     // pinfo: {
        //     //   ...pinfo,
        //     //   etrMinPrice: decimalFormat(tick2Price(pinfo.etrMin).toString(), 6),
        //     //   etrMaxPrice: decimalFormat(tick2Price(pinfo.etrMax).toString(), 6)
        //     // },
        //     // fee: swap.tokenSwapInfo.fee.mul(100).toString()
        //   })
        // } else {
        //   result.push({
        //     ...farmingConfig[key],
        //     positions: []
        //     // miner: null,
        //     // pinfo: null,
        //     // fee: swap.tokenSwapInfo.fee.mul(100).toString()
        //   })
        // }
        result.push({
          ...farmingConfig[key],
          // positions: [...sdresult, ...cpresult],
          positions: [],
          minPrice:
            (farmingConfig[key] && farmingConfig[key].effectivePrice && farmingConfig[key].effectivePrice[0]) || 0,
          maxPrice:
            (farmingConfig[key] && farmingConfig[key].effectivePrice && farmingConfig[key].effectivePrice[1]) || 0
        })
      }

      console.log('farmingTest####farming#####farmingList#####', result)
      commit('setFarmingList', result)

      commit('setLoading', false)
      if (haveLoading) {
        commit('setFarmingListLoading', false)
      }
    },
    async getPositionObj({ state, commit }, { rates, farmingInfo, tvlData }) {
      const conn = this.$web3
      const wallet = (this as any)._vm.$wallet
      const RATES = { ...rates, CUSDC: 1 }
      const { tokenA, tokenB } = farmingInfo
      commit('setPositionsLoadingObj', { key: farmingInfo.positionWrapper, value: true })
      const swap = await new TokenSwap(
        conn,
        new PublicKey(SWAPV3_PROGRAMID),
        new PublicKey(farmingInfo.swapKey),
        null
      ).load()

      if (wallet) {
        const payer = SWAP_PAYER
        const tokenSwap = await CTokenSwap.getAllAccounts(
          conn,
          new PublicKey(farmingInfo.swapKey),
          SWAPV3_PROGRAMID,
          payer
        )
        const currentPrice = contractPrice2showPrice(
          tokenSwap.current_price.toNumber(),
          tokenA.decimals,
          tokenB.decimals
        )

        const canStatePositions: any = await fetchSwapPositionsByOwner(
          new PublicKey(farmingInfo.swapKey),
          wallet.publicKey,
          conn,
          wallet
        )

        console.log('farming#####canStatePositions####', canStatePositions)

        const cpresult: any = []
        for (let j = 0; j < canStatePositions.length; j++) {
          const amount = await calculateTokenAmount(
            canStatePositions[j].lowerTick,
            canStatePositions[j].upperTick,
            new Decimal(canStatePositions[j].liquity),
            swap.tokenSwapInfo.currentSqrtPrice
          )

          const amountA = amount.amountA.div(Math.pow(10, tokenA.decimals)).mul(currentPrice)
          const amountB = amount.amountB.div(Math.pow(10, tokenB.decimals))

          let liquityUSD = amountA.plus(amountB)
          const tokenBSymbol = tokenB.symbol.toUpperCase() === 'WSOL' ? 'SOL' : tokenB.symbol.toUpperCase()
          const tokenBRate = RATES[tokenBSymbol] || 1
          liquityUSD = liquityUSD.mul(tokenBRate)

          let withinRange = true

          // 判断是否在有效tick范围内
          const etrMax =
            (tvlData && tvlData[farmingInfo.positionWrapper] && tvlData[farmingInfo.positionWrapper].etrMax) || 0
          const etrMin =
            (tvlData && tvlData[farmingInfo.positionWrapper] && tvlData[farmingInfo.positionWrapper].etrMin) || 0
          if (canStatePositions[j].lowerTick >= etrMax || canStatePositions[j].upperTick <= etrMin) {
            withinRange = false
          }

          console.log('canStatePositions[j].lowerTick###', canStatePositions[j].lowerTick)
          console.log('canStatePositions[j].upperTick###', canStatePositions[j].upperTick)

          cpresult.push({
            ...canStatePositions[j],
            nftMintAddress: canStatePositions[j].nftTokenId.toString(),
            nftAccountAddress: canStatePositions[j].nftAccount.toString(),
            liquityToString: canStatePositions[j].liquity.toString(),
            liquityUSD: addCommom(liquityUSD.toString(), 4),
            lowerPrice:
              canStatePositions[j].lowerTick !== -443632
                ? decimalFormat(tick2Price(canStatePositions[j].lowerTick).toString(), 6)
                : '0',
            upperPrice:
              canStatePositions[j].upperTick !== 443632
                ? decimalFormat(tick2Price(canStatePositions[j].upperTick).toString(), 6)
                : '∞',
            isStaked: false,
            withinRange
          })
        }

        const stakedPositons = await fetchStakedPositions(
          conn,
          wallet,
          new PublicKey(farmingInfo.positionWrapper),
          wallet.publicKey
        )

        console.log('farming#####stakedPositons####', stakedPositons)

        const sdresult: any = []
        for (let k = 0; k < stakedPositons.length; k++) {
          const item: any = stakedPositons[k]
          const amount = await calculateTokenAmount(
            stakedPositons[k].lowerTick,
            stakedPositons[k].upperTick,
            new Decimal(stakedPositons[k].liquity.toString()),
            swap.tokenSwapInfo.currentSqrtPrice
          )

          const amountA = amount.amountA.div(Math.pow(10, tokenA.decimals)).mul(currentPrice)
          const amountB = amount.amountB.div(Math.pow(10, tokenB.decimals))

          // const liquityUSD = amountA.mul(RATES[tokenA.symbol]).plus(amountB.mul(RATES[tokenB.symbol]))
          const tokenBSymbol = tokenB.symbol.toUpperCase() === 'WSOL' ? 'SOL' : tokenB.symbol.toUpperCase()
          const tokenBRate = RATES[tokenBSymbol] || 1
          let liquityUSD = amountA.plus(amountB)
          liquityUSD = liquityUSD.mul(tokenBRate)
          sdresult.push({
            ...stakedPositons[k],
            nftMintAddress: stakedPositons[k].nftMint.toString(),
            nftAccountAddress: item.nftVault.toString(),
            liquityToString: stakedPositons[k].liquity.toString(),
            liquityUSD: addCommom(liquityUSD.toString(), 4),
            lowerPrice:
              stakedPositons[k].lowerTick !== -443632
                ? decimalFormat(tick2Price(stakedPositons[k].lowerTick).toString(), 6)
                : '0',
            upperPrice:
              stakedPositons[k].upperTick !== 443632
                ? decimalFormat(tick2Price(stakedPositons[k].upperTick).toString(), 6)
                : '∞',
            isStaked: true
          })
        }

        cpresult.sort(function (a, b) {
          return b.withinRange - a.withinRange
        })

        console.log('positionsObj####setPositionsObj###', sdresult, cpresult)

        commit('setPositionsObj', { positions: [...sdresult, ...cpresult], farmingInfo })
        commit('setPositionsLoadingObj', { key: farmingInfo.positionWrapper, value: false })
      }
    },
    async getEarnings({ commit }) {
      const conn = this.$web3
      const wallet = (this as any)._vm.$wallet

      const miner: any = await minerInfo(
        conn,
        wallet,
        new PublicKey(LPFARMS[0].rewarderKey),
        new PublicKey(LPFARMS[0].positionWrapperWrapMint)
      )

      const rewardTokenInfo = await conn.getTokenSupply(new PublicKey(LPFARMS[0].rewardTokenMint))
      const rewardTokenDecimal = rewardTokenInfo.value.decimals

      const earning = new Decimal(miner.PendingReward).div(Math.pow(10, rewardTokenDecimal)).toString()
      commit('setEarnings', earning)
    },
    async getEarningsObj({ state, commit }, haveLoading) {
      const LPFARMS = state.farmingConfigObj
      const conn = this.$web3
      const wallet = (this as any)._vm.$wallet
      const result: any = {}

      if (haveLoading) {
        commit('setEarningLoading', true)
      }

      console.log('123getFarmingList###getEarningsObj####进来了吗###', LPFARMS)

      for (const key in LPFARMS) {
        const miner: any = await minerInfo(
          conn,
          wallet,
          new PublicKey(LPFARMS[key].rewarderKey),
          new PublicKey(LPFARMS[key].positionWrapperWrapMint)
        )

        if (miner && miner.PendingReward) {
          const rewardTokenInfo = await conn.getTokenSupply(new PublicKey(LPFARMS[key].rewardTokenMint))
          const rewardTokenDecimal = rewardTokenInfo.value.decimals

          console.log('123getFarmingList###getEarningsObj####miner###', miner)
          const earning = new Decimal(miner.PendingReward).div(Math.pow(10, rewardTokenDecimal)).toString()

          result[LPFARMS[key].positionWrapper] = addCommom(earning, 6)
        } else {
          result[LPFARMS[key].positionWrapper] = '0'
        }
      }

      console.log('123getFarmingList###getEarningsObj###result####', result)

      commit('setEarningObj', result)
      if (haveLoading) {
        commit('setEarningLoading', false)
      }
    }
    // async getRewardTokenDecimal
  }
)

// export const action = actionTree({ state, getters, mutations }, {})
