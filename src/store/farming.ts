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
import { RATES } from '@/utils/tokens'
import { decimalFormat } from '@/utils'
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
  farmingList: [],
  farmingListLoading: false,
  earnings: ''
})

export const getters = getterTree(state, {})

export const mutations = mutationTree(state, {
  setFarmingList(state, list) {
    state.farmingList = list
  },
  setFarmingListLoading(state, status) {
    state.farmingListLoading = status
  },
  setEarnings(state, value) {
    state.earnings = value
  }
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    async getFarmingList({ commit }) {
      commit('setFarmingListLoading', true)
      const conn = this.$web3
      const wallet = (this as any)._vm.$wallet
      console.log('wallet####', wallet)

      // const sdk = makeSDK(conn, wallet)

      const result: any = []
      for (let i = 0; i < LPFARMS.length; i++) {
        const rewardTokenInfo = await conn.getTokenSupply(new PublicKey(LPFARMS[i].rewardTokenMint))
        const rewardTokenDecimal = rewardTokenInfo.value.decimals

        const { tokenA, tokenB } = LPFARMS[i]
        const swap = await new TokenSwap(
          conn,
          new PublicKey(SWAPV3_PROGRAMID),
          new PublicKey(LPFARMS[i].swapKey),
          null
        ).load()

        console.log('farming#####swap####', swap)

        if (wallet) {
          const pinfo: any = await fetchPositionWrapper(conn, wallet, new PublicKey(LPFARMS[i].positionWrapper))
          console.log('farming#####pinfo####', pinfo)
          const payer = SWAP_PAYER
          const tokenSwap = await CTokenSwap.getAllAccounts(
            conn,
            new PublicKey(LPFARMS[i].swapKey),
            SWAPV3_PROGRAMID,
            payer
          )
          const currentPrice = contractPrice2showPrice(
            tokenSwap.current_price.toNumber(),
            tokenA.decimals,
            tokenB.decimals
          )

          const miner: any = await minerInfo(
            conn,
            wallet,
            new PublicKey(LPFARMS[i].rewarderKey),
            new PublicKey(LPFARMS[i].positionWrapperWrapMint)
          )

          console.log('farming#####miner####', miner)

          const canStatePositions: any = await fetchSwapPositionsByOwner(
            new PublicKey(LPFARMS[i].address),
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
            liquityUSD = liquityUSD.mul(RATES[tokenB.symbol])

            let withinRange = true

            // 判断是否在有效tick范围内
            if (canStatePositions[j].lowerTick >= pinfo.etrMax || canStatePositions[j].upperTick <= pinfo.etrMin) {
              withinRange = false
            }

            console.log('canStatePositions[j].lowerTick###', canStatePositions[j].lowerTick)
            console.log('canStatePositions[j].upperTick###', canStatePositions[j].upperTick)

            cpresult.push({
              ...canStatePositions[j],
              nftMintAddress: canStatePositions[j].nftTokenId.toString(),
              liquityToString: canStatePositions[j].liquity.toString(),
              liquityUSD: decimalFormat(liquityUSD.toString(), 4),
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
            new PublicKey(LPFARMS[i].positionWrapper),
            wallet.publicKey
          )

          console.log('farming#####stakedPositons####', stakedPositons)

          const sdresult: any = []
          for (let k = 0; k < stakedPositons.length; k++) {
            const amount = await calculateTokenAmount(
              stakedPositons[k].lowerTick,
              stakedPositons[k].upperTick,
              new Decimal(stakedPositons[k].liquity.toString()),
              swap.tokenSwapInfo.currentSqrtPrice
            )

            const amountA = amount.amountA.div(Math.pow(10, tokenA.decimals)).mul(currentPrice)
            const amountB = amount.amountB.div(Math.pow(10, tokenB.decimals))

            // const liquityUSD = amountA.mul(RATES[tokenA.symbol]).plus(amountB.mul(RATES[tokenB.symbol]))
            let liquityUSD = amountA.plus(amountB)
            liquityUSD = liquityUSD.mul(RATES[tokenB.symbol])
            sdresult.push({
              ...stakedPositons[k],
              nftMintAddress: stakedPositons[k].nftMint.toString(),
              liquityToString: stakedPositons[k].liquity.toString(),
              liquityUSD: decimalFormat(liquityUSD.toString(), 4),
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

          result.push({
            ...LPFARMS[i],
            positions: [...cpresult, ...sdresult],
            miner: miner
              ? {
                  ...miner,
                  PendingRewardView: new Decimal(miner.PendingReward).div(Math.pow(10, rewardTokenDecimal)).toString()
                }
              : null,
            pinfo: {
              ...pinfo,
              etrMinPrice: decimalFormat(tick2Price(pinfo.etrMin).toString(), 6),
              etrMaxPrice: decimalFormat(tick2Price(pinfo.etrMax).toString(), 6)
            },
            fee: swap.tokenSwapInfo.fee.mul(100).toString()
          })
        } else {
          result.push({
            ...LPFARMS[i],
            positions: [],
            miner: null,
            pinfo: null,
            fee: swap.tokenSwapInfo.fee.mul(100).toString()
          })
        }
      }

      console.log('farming#####farmingList#####', result)
      commit('setFarmingList', result)
      commit('setFarmingListLoading', false)
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
    }
    // async getRewardTokenDecimal
  }
)

// export const action = actionTree({ state, getters, mutations }, {})
