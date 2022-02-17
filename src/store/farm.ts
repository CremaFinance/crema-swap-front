import { getterTree, mutationTree, actionTree } from 'typed-vuex'

// import { fixD } from '@/utils'
import {
  FARMS,
  // RATES,
  getAddressForWhat,
  getFarmByPoolId
} from '@/utils/farms'
import {
  // STAKE_INFO_LAYOUT,
  // STAKE_INFO_LAYOUT_V4,
  USER_STAKE_INFO_ACCOUNT_LAYOUT,
  getStakeAccountInfo,
  getReward
  // getprice,
  // caculateAPR
  // USER_STAKE_INFO_ACCOUNT_LAYOUT_V4
} from '@/utils/stake'
import {
  commitment,
  getFilteredProgramAccounts,
  getMultipleAccounts
  // getStakeInfo
} from '@/utils/web3'

import { ACCOUNT_LAYOUT } from '@/utils/layouts'
import { PublicKey } from '@solana/web3.js'
import {
  // STAKE_PROGRAM_ID,
  STAKE_PROGRAM_ID_H
  // STAKE_PROGRAM_ID_V4,
  // STAKE_PROGRAM_ID_V5
} from '@/utils/ids'
import { TokenAmount, lt } from '@/utils/safe-math'
import { cloneDeep } from 'lodash-es'
import logger from '@/utils/logger'
import { StakePoolLayout } from '@/utils/layouts'
import * as schema from '@/utils/schema'

const AUTO_REFRESH_TIME = 60

export const state = () => ({
  initialized: false,
  loading: false,

  autoRefreshTime: AUTO_REFRESH_TIME,
  countdown: 0,
  lastSubBlock: 0,

  infos: {},
  stakeAccounts: {}
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

  setStakeAccounts(state, stakeAccounts) {
    state.stakeAccounts = cloneDeep(stakeAccounts)
  },

  setCountdown(state, countdown: number) {
    state.countdown = countdown
  },

  setLastSubBlock(state, lastSubBlock: number) {
    state.lastSubBlock = lastSubBlock
  }
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    async requestInfos({
      commit
      // dispatch
    }) {
      commit('setLoading', true)
      // dispatch('getStakeAccounts')

      const conn = this.$web3

      const farms = {} as any
      // const publicKeys = [] as any
      const wallet = (this as any)._vm.$wallet
      // FARMS.forEach(async (farm) => {
      for (let i = 0; i < FARMS.length; i++) {
        const farm = FARMS[i]
        const { lp, poolId, stakeUserListAccount, poolLpTokenAccount } = farm

        // publicKeys.push(new PublicKey(poolId), new PublicKey(poolLpTokenAccount))

        const farmInfo: any = cloneDeep(farm)

        farmInfo.lp.balance = new TokenAmount(0, lp.decimals)
        const publicKeys = [] as any
        publicKeys.push(new PublicKey(poolId), new PublicKey(poolLpTokenAccount))
        const multipleInfo = await getMultipleAccounts(conn, publicKeys, commitment)

        multipleInfo.forEach((info) => {
          if (info) {
            const address = info.publicKey.toBase58()
            const data = Buffer.from(info.account.data)

            const { key, poolId } = getAddressForWhat(address)

            if (key && poolId) {
              // const farmInfo = farms[poolId]

              switch (key) {
                // pool info
                // case 'poolId': {
                //   let parsed

                //   if ([4, 5].includes(farmInfo.version)) {
                //     parsed = STAKE_INFO_LAYOUT_V4.decode(data)
                //   } else {
                //     parsed = STAKE_INFO_LAYOUT.decode(data)
                //   }

                //   farmInfo.poolInfo = parsed

                //   break
                // }
                // staked balance
                case 'poolLpTokenAccount': {
                  const parsed = ACCOUNT_LAYOUT.decode(data)
                  farmInfo.lp.balance.wei = farmInfo.lp.balance.wei.plus(parsed.amount.toNumber())

                  break
                }
              }
            }
          }
        })

        // console.log('这里的farmInfo#####', farmInfo)

        const farmInfoBuffer = await getStakeAccountInfo(conn, new PublicKey(poolId), new PublicKey(STAKE_PROGRAM_ID_H))

        const farmInfoMore = StakePoolLayout.decode(farmInfoBuffer)

        const totalAmount = new TokenAmount(0, farmInfo.lp.decimals)
        totalAmount.wei = totalAmount.wei.plus(farmInfoMore.stake_total_amount.toString())
        farmInfoMore.totalAmount = totalAmount
        // const accPoint = new TokenAmount(0, farmInfo.reward.decimals)
        // accPoint.wei = accPoint.wei.plus(farmInfoMore.acc_point.toString())
        // farmInfoMore.accPoint = accPoint

        // const rewardTokenPrice = RATES[farmInfo.reward.symbol] || 1

        // const currentSlot = await conn.getSlot()
        // // const stakeTokenPrice = await getprice(farm.poolLpTokenAccount)
        // // const stakeTokenPrice = 1
        // const stakeTokenPrice = RATES[farmInfo.lp.symbol] || 1

        // const apr = await caculateAPR(
        //   farmInfoMore.start_timestamp.toNumber(), // start: number,
        //   farmInfoMore.acc_point.toNumber(), // accPoint: number,
        //   farmInfoMore.start_slot.toNumber(), // lastUpdateSlot: number,
        //   currentSlot, // currentSlot: number,
        //   rewardTokenPrice, // rewardTokenPrice: number,
        //   farmInfoMore.stake_total_amount.toNumber(), // stake_total_amount *
        //   stakeTokenPrice // stakeTokenPrice: number
        // )
        // farmInfoMore.apr = fixD(apr * 100, 2)

        const userInfo = {} as any
        if (wallet && wallet.connected && stakeUserListAccount) {
          const userinfo = await schema.getStakeUserAccountInfo(
            conn,
            new PublicKey(stakeUserListAccount),
            wallet.publicKey
          )
          const { myreward = 0, stakeAmount = 0 } = await getReward(conn, userinfo, farmInfoMore)
          // const rewardTokenPrice = await getprice(farm.reward.mintAddress)
          const myrewardAmount = new TokenAmount(0, farmInfo.reward.decimals)
          myrewardAmount.wei = myrewardAmount.wei.plus(myreward)
          userInfo.myreward = myrewardAmount
          const myStakeAmount = new TokenAmount(0, farmInfo.lp.decimals)
          myStakeAmount.wei = myStakeAmount.wei.plus(stakeAmount)
          userInfo.stakeAmount = myStakeAmount
        }

        farms[poolId] = { ...farmInfo, ...farmInfoMore, ...userInfo }
      }
      // })

      // const multipleInfo = await getMultipleAccounts(conn, publicKeys, commitment)
      // multipleInfo.forEach((info) => {
      //   if (info) {
      //     const address = info.publicKey.toBase58()
      //     const data = Buffer.from(info.account.data)

      //     const { key, poolId } = getAddressForWhat(address)

      //     if (key && poolId) {
      //       const farmInfo = farms[poolId]

      //       switch (key) {
      //         // pool info
      //         case 'poolId': {
      //           let parsed

      //           if ([4, 5].includes(farmInfo.version)) {
      //             parsed = STAKE_INFO_LAYOUT_V4.decode(data)
      //           } else {
      //             parsed = STAKE_INFO_LAYOUT.decode(data)
      //           }

      //           farmInfo.poolInfo = parsed

      //           break
      //         }
      //         // staked balance
      //         case 'poolLpTokenAccount': {
      //           const parsed = ACCOUNT_LAYOUT.decode(data)

      //           farmInfo.lp.balance.wei = farmInfo.lp.balance.wei.plus(parsed.amount.toNumber())

      //           break
      //         }
      //       }
      //     }
      //   }
      // })

      commit('setInfos', farms)
      logger('Farm&Stake pool infomations updated')
      commit('setInitialized')
      commit('setLoading', false)
    },

    getStakeAccounts({ commit }) {
      const conn = this.$web3
      const wallet = (this as any)._vm.$wallet

      if (wallet && wallet.connected) {
        // stake user info account
        const stakeFilters = [
          {
            memcmp: {
              offset: 40,
              bytes: wallet.publicKey.toBase58()
            }
          },
          {
            dataSize: USER_STAKE_INFO_ACCOUNT_LAYOUT.span
          }
        ]

        const stakeAccounts: any = {}

        getFilteredProgramAccounts(conn, new PublicKey(STAKE_PROGRAM_ID_H), stakeFilters)
          .then((stakeAccountInfos) => {
            stakeAccountInfos.forEach((stakeAccountInfo) => {
              const stakeAccountAddress = stakeAccountInfo.publicKey.toBase58()
              const { data } = stakeAccountInfo.accountInfo

              const userStakeInfo = USER_STAKE_INFO_ACCOUNT_LAYOUT.decode(data)

              const poolId = userStakeInfo.poolId.toBase58()

              const rewardDebt = userStakeInfo.rewardDebt.toNumber()

              const farm = getFarmByPoolId(poolId)

              if (farm) {
                const depositBalance = new TokenAmount(userStakeInfo.depositBalance.toNumber(), farm.lp.decimals)

                if (Object.prototype.hasOwnProperty.call(stakeAccounts, poolId)) {
                  if (lt(stakeAccounts[poolId].depositBalance.wei.toNumber(), depositBalance.wei.toNumber())) {
                    stakeAccounts[poolId] = {
                      depositBalance,
                      rewardDebt: new TokenAmount(rewardDebt, farm.reward.decimals),
                      stakeAccountAddress
                    }
                  }
                } else {
                  stakeAccounts[poolId] = {
                    depositBalance,
                    rewardDebt: new TokenAmount(rewardDebt, farm.reward.decimals),
                    stakeAccountAddress
                  }
                }
              }
            })

            commit('setStakeAccounts', stakeAccounts)
            logger('User StakeAccounts updated')

            // stake user info account v4
            // const stakeFiltersV4 = [
            //   {
            //     memcmp: {
            //       offset: 40,
            //       bytes: wallet.publicKey.toBase58()
            //     }
            //   },
            //   {
            //     dataSize: USER_STAKE_INFO_ACCOUNT_LAYOUT_V4.span
            //   }
            // ]

            // getFilteredProgramAccounts(conn, new PublicKey(STAKE_PROGRAM_ID_V4), stakeFiltersV4)
            //   .then((stakeAccountInfos) => {
            //     stakeAccountInfos.forEach((stakeAccountInfo) => {
            //       const stakeAccountAddress = stakeAccountInfo.publicKey.toBase58()
            //       const { data } = stakeAccountInfo.accountInfo

            //       const userStakeInfo = USER_STAKE_INFO_ACCOUNT_LAYOUT_V4.decode(data)

            //       const poolId = userStakeInfo.poolId.toBase58()

            //       const rewardDebt = userStakeInfo.rewardDebt.toNumber()
            //       const rewardDebtB = userStakeInfo.rewardDebtB.toNumber()

            //       const farm = getFarmByPoolId(poolId)

            //       if (farm) {
            //         const depositBalance = new TokenAmount(userStakeInfo.depositBalance.toNumber(), farm.lp.decimals)

            //         if (Object.prototype.hasOwnProperty.call(stakeAccounts, poolId)) {
            //           if (lt(stakeAccounts[poolId].depositBalance.wei.toNumber(), depositBalance.wei.toNumber())) {
            //             stakeAccounts[poolId] = {
            //               depositBalance,
            //               rewardDebt: new TokenAmount(rewardDebt, farm.reward.decimals),
            //               // @ts-ignore
            //               rewardDebtB: new TokenAmount(rewardDebtB, farm.rewardB.decimals),
            //               stakeAccountAddress
            //             }
            //           }
            //         } else {
            //           stakeAccounts[poolId] = {
            //             depositBalance,
            //             rewardDebt: new TokenAmount(rewardDebt, farm.reward.decimals),
            //             // @ts-ignore
            //             rewardDebtB: new TokenAmount(rewardDebtB, farm.rewardB.decimals),
            //             stakeAccountAddress
            //           }
            //         }
            //       }
            //     })

            //     getFilteredProgramAccounts(conn, new PublicKey(STAKE_PROGRAM_ID_V5), stakeFiltersV4)
            //       .then((stakeAccountInfos) => {
            //         stakeAccountInfos.forEach((stakeAccountInfo) => {
            //           const stakeAccountAddress = stakeAccountInfo.publicKey.toBase58()
            //           const { data } = stakeAccountInfo.accountInfo

            //           const userStakeInfo = USER_STAKE_INFO_ACCOUNT_LAYOUT_V4.decode(data)

            //           const poolId = userStakeInfo.poolId.toBase58()

            //           const rewardDebt = userStakeInfo.rewardDebt.toNumber()
            //           const rewardDebtB = userStakeInfo.rewardDebtB.toNumber()

            //           const farm = getFarmByPoolId(poolId)

            //           if (farm) {
            //             const depositBalance = new TokenAmount(
            //               userStakeInfo.depositBalance.toNumber(),
            //               farm.lp.decimals
            //             )

            //             if (Object.prototype.hasOwnProperty.call(stakeAccounts, poolId)) {
            //               if (lt(stakeAccounts[poolId].depositBalance.wei.toNumber(), depositBalance.wei.toNumber())) {
            //                 stakeAccounts[poolId] = {
            //                   depositBalance,
            //                   rewardDebt: new TokenAmount(rewardDebt, farm.reward.decimals),
            //                   // @ts-ignore
            //                   rewardDebtB: new TokenAmount(rewardDebtB, farm.rewardB.decimals),
            //                   stakeAccountAddress
            //                 }
            //               }
            //             } else {
            //               stakeAccounts[poolId] = {
            //                 depositBalance,
            //                 rewardDebt: new TokenAmount(rewardDebt, farm.reward.decimals),
            //                 // @ts-ignore
            //                 rewardDebtB: new TokenAmount(rewardDebtB, farm.rewardB.decimals),
            //                 stakeAccountAddress
            //               }
            //             }
            //           }
            //         })

            //         commit('setStakeAccounts', stakeAccounts)
            //         logger('User StakeAccounts updated')
            //       })
            //       .catch()
            //   })
            //   .catch()
          })
          .catch((error) => {
            console.log('难道在error吗#####', error)
          })
      }
    }
  }
)
