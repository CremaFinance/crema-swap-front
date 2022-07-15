import { getterTree, mutationTree, actionTree } from 'typed-vuex'
import { LPFARMS } from '@/utils/farming'
import {
  fetchSwapPositionsByOwner,
  minerInfo,
  fetchStakedPositions,
  fetchMiners,
  fetchCremaSwaps
} from '@/contract/farming'
import { PublicKey } from '@solana/web3.js'
import { calculateTokenAmount, tick2Price, tick2UiPrice, lamportPrice2uiPrice } from '@cremafinance/crema-sdk'
import Decimal from 'decimal.js'
import { TOKENS } from '@/utils/tokens'
import { decimalFormat, addCommom } from '@/utils'

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
      const res: any = await this.$axios.get('https://api.crema.finance/farm/tvl')
      console.log('getStatisticsDataObj####res####', res)
      if (res && res.wrappers) {
        res.wrappers.forEach((item) => {
          result[item.swapKey] = item
        })
      }

      commit('setStatisticsDataObj', result)
      console.log('getStatisticsDataObj####result###', result)
    },
    async getFarmingConfig({ commit }, tokenObj) {
      // https://api.crema.finance/config?name=farming  生产
      // https://pre-api-crema.bitank.com/config?name=farming 预发布
      // const configRes = await this.$axios.get('https://dev-api-crema.bitank.com/config?name=farming')
      const configRes = await this.$axios.get('https://api.crema.finance/config?name=farming')
      // const configRes = await this.$axios.get('https://pre-api-crema.bitank.com/config?name=farming')
      console.log('getFarmingConfig###res####', configRes)
      console.log('getFarmingConfig####tokenObj###', tokenObj)
      const farmingConfig: any = []
      if (configRes && configRes.data) {
        configRes.data.forEach((item) => {
          farmingConfig.push({
            ...item,
            tokenA: tokenObj[item.tokenA],
            tokenB: tokenObj[item.tokenB]
          })
        })
      }

      console.log('getFarmingConfig####farmingConfig####', farmingConfig)
      commit('setFarmingConfigObj', farmingConfig)
    },
    getFarmingList({ state, commit }, { rates, farmingConfig, haveLoading, tvlData }) {
      commit('setLoading', true)
      if (haveLoading) {
        commit('setFarmingListLoading', true)
      }

      const conn = this.$web3
      const wallet = (this as any)._vm.$wallet
      console.log('wallet####', wallet)

      const result: any = []
      for (let key in farmingConfig) {
        const { tokenA, tokenB } = farmingConfig[key]
        const item = farmingConfig[key]
        const now = parseInt(String(new Date().getTime() / 1000))
        result.push({
          ...item,
          isEnded: Number(now) > Number(item.famineTs),
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

      console.log('getPositionObj####tokenA####', tokenA)
      console.log('getPositionObj####tokenB####', tokenB)

      commit('setPositionsLoadingObj', { key: farmingInfo.positionWrapper, value: true })

      const swap: any = await fetchCremaSwaps([new PublicKey(farmingInfo.swapKey)], conn)

      const currentPrice = lamportPrice2uiPrice(
        swap.currentSqrtPrice.pow(2),
        tokenA.decimal,
        tokenB.decimal
      ).toNumber()

      console.log('getPositionObj###swap####', swap)

      if (wallet) {
        const canStatePositions: any = await fetchSwapPositionsByOwner(
          new PublicKey(farmingInfo.swapKey),
          wallet.publicKey,
          conn,
          wallet
        )

        console.log('farming#####canStatePositions####', canStatePositions)

        const cpresult: any = []
        for (let j = 0; j < canStatePositions.length; j++) {
          console.log('j###', j, 'canStatePositions[j].liquity###', canStatePositions[j].liquity.toString())
          const amount = await calculateTokenAmount(
            canStatePositions[j].lowerTick,
            canStatePositions[j].upperTick,
            new Decimal(canStatePositions[j].liquity),
            // swap.tokenSwapInfo.currentSqrtPrice
            swap.currentSqrtPrice
          )

          console.log('getPositionObj####amount.amountA####', amount.amountA.toString())
          console.log('getPositionObj####amount.amountB####', amount.amountB.toString())
          console.log('getPositionObj####currentPrice###', currentPrice.toString())

          const amountA = amount.amountA.div(Math.pow(10, tokenA.decimal)).mul(currentPrice)
          const amountB = amount.amountB.div(Math.pow(10, tokenB.decimal))

          console.log('getPositionObj####amountA###', amountA.toString())
          console.log('getPositionObj####amountB###', amountB.toString())

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
            // lowerPrice:
            //   canStatePositions[j].lowerTick !== -443632
            //     ? decimalFormat(tick2Price(canStatePositions[j].lowerTick).toString(), 6)
            //     : '0',
            // upperPrice:
            //   canStatePositions[j].upperTick !== 443632
            //     ? decimalFormat(tick2Price(canStatePositions[j].upperTick).toString(), 6)
            //     : '∞',
            lowerPrice:
              canStatePositions[j].lowerTick !== -443632
                ? decimalFormat(tick2UiPrice(canStatePositions[j].lowerTick, tokenA.decimal, tokenB.decimal).toString(), 6)
                : '0',
            upperPrice:
              canStatePositions[j].upperTick !== 443632
                ? decimalFormat(tick2UiPrice(canStatePositions[j].upperTick, tokenA.decimal, tokenB.decimal).toString(), 6)
                : '∞',
            isStaked: false,
            withinRange
          })
        }

        const stakedPositons = await fetchStakedPositions(
          conn,
          new PublicKey(farmingInfo.positionWrapper),
          wallet.publicKey
        )

        const sdresult: any = []
        for (let k = 0; k < stakedPositons.length; k++) {
          const item: any = stakedPositons[k]
          const amount = await calculateTokenAmount(
            stakedPositons[k].lowerTick,
            stakedPositons[k].upperTick,
            new Decimal(stakedPositons[k].liquity.toString()),
            swap.currentSqrtPrice
          )

          const amountA = amount.amountA.div(Math.pow(10, tokenA.decimal)).mul(currentPrice)
          const amountB = amount.amountB.div(Math.pow(10, tokenB.decimal))

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
            // lowerPrice:
            //   stakedPositons[k].lowerTick !== -443632
            //     ? decimalFormat(tick2Price(stakedPositons[k].lowerTick).toString(), 6)
            //     : '0',
            // upperPrice:
            //   stakedPositons[k].upperTick !== 443632
            //     ? decimalFormat(tick2Price(stakedPositons[k].upperTick).toString(), 6)
            //     : '∞',
            lowerPrice:
              stakedPositons[k].lowerTick !== -443632
                ? decimalFormat(tick2UiPrice(stakedPositons[k].lowerTick, tokenA.decimal, tokenB.decimal).toString(), 6)
                : '0',
            upperPrice:
              stakedPositons[k].upperTick !== 443632
                ? decimalFormat(tick2UiPrice(stakedPositons[k].upperTick, tokenA.decimal, tokenB.decimal).toString(), 6)
                : '∞',
            isStaked: true
          })
        }

        cpresult.sort(function (a, b) {
          return b.withinRange - a.withinRange
        })

        const newCanStakePositions: any = []
        cpresult.forEach(item => {
          const ep = sdresult.filter(eitem => eitem.nftMintAddress === item.nftMintAddress)
          if (!ep || ep.length < 1) {
            newCanStakePositions.push(item)
          }
        })

        console.log('positionsObj####setPositionsObj###', sdresult, cpresult)

        commit('setPositionsObj', { positions: [...sdresult, ...newCanStakePositions], farmingInfo })
        commit('setPositionsLoadingObj', { key: farmingInfo.positionWrapper, value: false })
      }
    },
    // async getEarnings({ commit }) {
    //   const conn = this.$web3
    //   const wallet = (this as any)._vm.$wallet

    //   const miner: any = await minerInfo(
    //     conn,
    //     wallet,
    //     new PublicKey(LPFARMS[0].rewarderKey),
    //     new PublicKey(LPFARMS[0].positionWrapperWrapMint)
    //   )

    //   const rewardTokenInfo = await conn.getTokenSupply(new PublicKey(LPFARMS[0].rewardTokenMint))
    //   console.log('getEarnings###rewardTokenInfo####', rewardTokenInfo)
    //   const rewardTokenDecimal = rewardTokenInfo.value.decimals

    //   console.log('farming.ts###miner###', miner)
    //   if (miner) {
    //     const earning = new Decimal(miner.PendingReward).div(Math.pow(10, rewardTokenDecimal)).toString()
    //     commit('setEarnings', earning)
    //   }
    // },
    async getEarningsObj({ state, commit }, haveLoading) {
      const conn = this.$web3
      const wallet = (this as any)._vm.$wallet
      const result: any = {}

      if (haveLoading) {
        commit('setEarningLoading', true)
      }

      const minerList: any = (await fetchMiners(conn, wallet, wallet.publicKey)) || []
      console.log('getEarningsObj###minerList####', minerList)
      minerList.forEach((item, index) => {
        console.log('getEarningsObj###index###', index, '###item.MinerKey####', item.MinerKey.toString())
        console.log('getEarningsObj###index###', index, '###item.tokenVaultKey####', item.tokenVaultKey.toString())
        console.log('getEarningsObj###index###', index, '###item.tokenMintKey####', item.tokenMintKey.toString())
        if (item.PendingReward && item.PendingReward.toNumber()) {
          const earning = new Decimal(item.PendingReward.toString()).div(Math.pow(10, 6)).toString()
          result[item.tokenMintKey.toString()] = {
            value: earning,
            view: Number(earning) < 0 ? '0' : addCommom(earning, 6)
          }
        } else {
          result[item.tokenMintKey.toString()] = {
            value: '0',
            view: '0'
          }
        }
      })

      console.log('getEarningsObj###result####', result)
      commit('setEarningObj', result)
      if (haveLoading) {
        commit('setEarningLoading', false)
      }
    }
    // async getRewardTokenDecimal
  }
)

// export const action = actionTree({ state, getters, mutations }, {})
