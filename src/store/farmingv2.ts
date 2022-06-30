import { getterTree, mutationTree, actionTree } from 'typed-vuex'
import { getQuarries, fetchMiners, fetchWrappers, fetchCremaSwaps, fetchStakedPositions, fetchSwapPositionsByOwner, fetchMergeMiner } from '@/contract/farmingv2'
import { tick2UiPrice, lamportPrice2uiPrice, calculateTokenAmount } from 'test-crema-sdk'
import { PublicKey } from '@solana/web3.js'
import Decimal from 'decimal.js'
import { decimalFormat, addCommom } from '@/utils'

export const state = () => ({
  quarryObj: {} as any,
  farmingList: [] as any,
  wrappersObj: {} as any, // can get etrMax and etrMin
  rewardsObj: {} as any,
  rewardsLoading: false,
  positionsLoadingObj: {} as any,
  positionsObj: {} as any,
  aprAndTvlObj: {} as any
})

export const getters = getterTree(state, {})

export const mutations = mutationTree(state, {
  setQuarryObj(state, data) {
    state.quarryObj = data
  },
  setFarmingList(state, list) {
    state.farmingList = list
  },
  setWrappersObj(state, data) {
    state.wrappersObj = data
  },
  setRewardsObj(state, data) {
    state.rewardsObj = data
  },
  setRewardsLoading(state, value) {
    state.rewardsLoading = value
  },
  setPositionsLoadingObj(state, value: any) {
    state.positionsLoadingObj = {
      ...state.positionsLoadingObj,
      [value.key]: value.value
    }
  },
  setPositionsObj(state, value: any) {
    if (state.positionsObj) {
      state.positionsObj = {
        ...state.positionsObj,
        [value.farmingInfo['position_wrapper'].address]: value.positions
      }
    } else {
      state.positionsObj = {
        [value.farmingInfo['position_wrapper'].address]: value.positions
      }
    }
    // state.positionsObj = value
  },
  setAprAndTvlObj(state, list) {
    const result: any = {}
    list.forEach(item => {
      result[item.merge_pool] = item
    })
    state.aprAndTvlObj = result
  }
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    async getQuarryObj({ commit }) {
      const conn = this.$web3
      // const wallet = (this as any)._vm.$wallet
      const quarryData = await getQuarries(conn)
      console.log('quarryData#####', quarryData)

      const quarryObj: any = {}
      quarryData.forEach((item: any) => {
        quarryObj[item.rewarder.toString()] = { ...item }
      })
      console.log('quarryObj#####', quarryObj)
      commit('setQuarryObj', quarryData)
    },
    async getFarmingList({ commit }) {
      // const farmingRes = await this.$axios.get('https://dev-api-crema.bitank.com/config?name=farming-v2')
      const farmingRes = await this.$axios.get('https://pre-api-crema.bitank.com/config?name=farming-v2')
      console.log('getFarmingList###farmingRes####', farmingRes)
      const farmingData = farmingRes && farmingRes.data || {}
      let result: any = []
      const positions: any = farmingData.positions || []
      positions.forEach((pitem) => {
        result.push({
          ...pitem,
          positionWrapper: pitem['position_wrapper'] && pitem['position_wrapper'].address,
          mpKey: pitem['merge_pool'] && pitem['merge_pool'].address
        })
      })

      // 暂时没有单币质押，都是仓位质押, 暂注释
      // const tokens: any = farmingData.tokens || []
      // tokens.forEach((titem: any) => {
      //   result.push({
      //     ...titem,
      //     positionWrapper: titem['position_wrapper'] && titem['position_wrapper'].address,
      //     mpKey: titem['merge_pool'] && titem['merge_pool'].address
      //   })
      // })

      console.log('farmingv2###getFarmingList####result###', result)
      commit('setFarmingList', result)
    },
    async getRewardsObj({ commit }, { farmingList, haveLoading }) {
      const conn = this.$web3
      const wallet = (this as any)._vm.$wallet

      if (haveLoading) {
        commit('setRewardsLoading', true)
      }
      console.log('farmingv2###getRewardsObj###start###')
      const promiseArr = farmingList.map((item: any) => {
        return fetchMergeMiner(wallet, new PublicKey(item.mpKey), wallet.publicKey)
      })

      console.log('farmingv2###getRewardsObj###promiseArr###', promiseArr)
      const res: any = await Promise.allSettled(promiseArr)
      console.log('farmingv2###getRewardsObj###res####', res)
      const result: any = {}
      res.forEach((item: any, index: number) => {
        if (item.status === 'fulfilled' && item.value) {
          const rItemObj: any = {}
          const currentQuarries: any = farmingList[index].quarries
          const mpKey = farmingList[index]['merge_pool'].address
          item.value.forEach((ritem: any) => {
            const currentQItem = currentQuarries.filter(cq => cq.quarry === ritem.quarry.toString())
            if (currentQItem && currentQItem[0]) {
              rItemObj[currentQItem[0].reward_token_mint] = ritem.PendingReward.toString()
            }
          })
          result[mpKey] = rItemObj
        }
      })

      console.log('farmingv2###getRewardsObj###result####', result)
      commit('setRewardsLoading', false)
      // return result
      commit('setRewardsObj', result)


    },
    async getWrappers({ commit }) {
      const conn = this.$web3
      console.log('getWrappers###start####')
      const wrappers: any = await fetchWrappers(conn)
      console.log('getWrappers###wrappers###', wrappers)
      // console.log('getWrappers###coinPairConfigObj###', coinPairConfigObj)
      const result: any = {}
      wrappers.forEach((item: any) => {
        // console.log('getWrappers###item.swapKey.toString()####', item.swapKey.toString())
        // const etrMax = item.etrMax
        // const etrMin = item.etrMin
        // if (coinPairConfigObj[item.swapKey.toString()]) {
        //   const tokenA = coinPairConfigObj[item.swapKey.toString()].token_a
        //   const tokenB = coinPairConfigObj[item.swapKey.toString()].token_b

        //   result[item.swapKey.toString()] = {
        //     ...item,
        //     lowerPrice:
        //       etrMin !== -443632
        //         ? decimalFormat(tick2UiPrice(etrMin, tokenA.decimal, tokenB.decimal).toString(), 6)
        //         : '0',
        //     upperPrice:
        //       etrMax.upperTick !== 443632
        //         ? decimalFormat(tick2UiPrice(etrMax, tokenA.decimal, tokenB.decimal).toString(), 6)
        //         : '∞',
        //   }
        // }
        result[item.swapKey.toString()] = { ...item }

      })
      console.log('getWrappers###result####', result)
      commit('setWrappersObj', result)
    },
    async getPositionObj({ state, commit }, { rates, farmingInfo, tvlData, coinPairConfigObj }) {
      const conn = this.$web3
      const wallet = (this as any)._vm.$wallet
      const RATES = { ...rates, CUSDC: 1 }
      // const { tokenA, tokenB } = farmingInfo



      const coinPairItem = coinPairConfigObj[farmingInfo.swap_key]
      const tokenA = coinPairItem.token_a
      const tokenB = coinPairItem.token_b
      console.log('farmingv2###getPositionObj####tokenA####', tokenA)
      console.log('farmingv2###getPositionObj####tokenB####', tokenB)
      const wrappersObj = state.wrappersObj
      console.log('farmingv2###getPositionObj###wrappersObj###', wrappersObj)
      const wrapperItem = wrappersObj[farmingInfo.swap_key]
      const etrMax = wrapperItem.etrMax || 0
      const etrMin = wrapperItem.etrMin || 0
      const currentPositionWrapper = farmingInfo['position_wrapper'].address

      commit('setPositionsLoadingObj', { key: currentPositionWrapper, value: true })

      const swap: any = await fetchCremaSwaps([new PublicKey(farmingInfo.swap_key)], conn)

      const currentPrice = lamportPrice2uiPrice(
        swap.currentSqrtPrice.pow(2),
        tokenA.decimal,
        tokenB.decimal
      ).toNumber()

      console.log('farmingv2###getPositionObj###swap####', swap)

      if (wallet) {
        const canStatePositions: any = await fetchSwapPositionsByOwner(
          new PublicKey(farmingInfo.swap_key),
          wallet.publicKey,
          conn,
          wallet
        )

        console.log('farmingv2###getPositionObj#####canStatePositions####', canStatePositions)

        const cpresult: any = []
        for (let j = 0; j < canStatePositions.length; j++) {
          // console.log('j###', j, 'canStatePositions[j].liquity###', canStatePositions[j].liquity.toString())
          const amount = await calculateTokenAmount(
            canStatePositions[j].lowerTick,
            canStatePositions[j].upperTick,
            new Decimal(canStatePositions[j].liquity),
            // swap.tokenSwapInfo.currentSqrtPrice
            swap.currentSqrtPrice
          )

          console.log('farmingv2###getPositionObj####amount.amountA####', amount.amountA.toString())
          console.log('farmingv2###getPositionObj####amount.amountB####', amount.amountB.toString())
          console.log('farmingv2###getPositionObj####currentPrice###', currentPrice.toString())

          const amountA = amount.amountA.div(Math.pow(10, tokenA.decimal)).mul(currentPrice)
          const amountB = amount.amountB.div(Math.pow(10, tokenB.decimal))

          console.log('farmingv2###getPositionObj####amountA###', amountA.toString())
          console.log('farmingv2###getPositionObj####amountB###', amountB.toString())

          let liquityUSD = amountA.plus(amountB)
          const tokenBSymbol = tokenB.symbol.toUpperCase() === 'WSOL' ? 'SOL' : tokenB.symbol.toUpperCase()
          const tokenBRate = RATES[tokenBSymbol] || 1
          liquityUSD = liquityUSD.mul(tokenBRate)

          let withinRange = true

          // 判断是否在有效tick范围内
          if (canStatePositions[j].lowerTick >= etrMax || canStatePositions[j].upperTick <= etrMin) {
            withinRange = false
          }

          console.log('farmingv2###getPositionObj###canStatePositions[j].lowerTick###', canStatePositions[j].lowerTick)
          console.log('farmingv2###getPositionObj###canStatePositions[j].upperTick###', canStatePositions[j].upperTick)

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
          new PublicKey(currentPositionWrapper),
          wallet.publicKey
        )

        console.log('farmingv2###stakedPositons#####', stakedPositons)

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

        console.log('farmingv2###positionsObj####setPositionsObj###', sdresult, cpresult)


        commit('setPositionsObj', { positions: [...sdresult, ...newCanStakePositions], farmingInfo })
        commit('setPositionsLoadingObj', { key: currentPositionWrapper, value: false })
      }
    },
    getAprAndTvl({ commit }) {
      const aprAndTvl = [
        {
          "apr": "0",
          "merge_pool": "BuAw6F7RBPQjMRj6v1APoBUfFNYBNrbCcqMQb92uo8ma",
          "tvl": "0"
        },
        {
          "apr": "0",
          "merge_pool": "F3b7tshxgcEqUpQNXRyNeERcGoFohERDJj3idbJp8SFF",
          "tvl": "0"
        },
        {
          "apr": "0",
          "merge_pool": "HUxnFnqFYStWhKL2NH57HC6jXqoCyA4CptuQAE3HnHWq",
          "tvl": "0"
        },

        // {
        //   "apr": "0",
        //   "merge_pool": "6jZ1KK9LephzTTTL4pRnHwL9qBG8ymHk5Biv7vFdNtrR",
        //   "tvl": "0"
        // },
        // {
        //   "apr": "0",
        //   "merge_pool": "VN7kVGTF8yNejs1Su1owEN3byo4HaBoZk9dnBnC9z4V",
        //   "tvl": "0"
        // },
        // {
        //   "apr": "0",
        //   "merge_pool": "CjCoqsummKzipiJTmPRPUYfm8yz1gSHptZfhhAZsPVsR",
        //   "tvl": "0"
        // },
        // {
        //   "apr": "225257.1428571428571428571428571428571428571428571428571428571429",
        //   "merge_pool": "CRM8JcGQstDainWZKr3PzhioCyNNpNKNq9P6ayGe7aok",
        //   "tvl": "2"
        // }
      ]
      commit('setAprAndTvlObj', aprAndTvl)
    }
  }
)
