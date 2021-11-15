import { getterTree, mutationTree, actionTree } from 'typed-vuex'
import { loadAccount } from '@/tokenSwap/util/account'
import { PublicKey } from '@solana/web3.js'
import { UserPosition, TokenSwapLayout, Numberu128 } from '@/tokenSwap'
import { USER_POSITION_ACCOUNT, SWAPV3_PROGRAMID } from '@/utils/ids'
import { tick2price } from '@/tokenSwap/swapv3'
import { fixD } from '@/utils'
import { LIQUIDITY_POOLS } from '@/utils/pools'
import { cloneDeep } from 'lodash-es'

export const state = () => ({
  myPositions: []
})

export const getters = getterTree(state, {})

export const mutations = mutationTree(state, {
  setMyPositions(state, list: any) {
    state.myPositions = cloneDeep(list)
  }
})

// export const actions = actionTree(
//   { state, getters, mutations }
//   {
//     async getMyPositionList({ commit }, tokenAccounts) {
//       // const conn = this.$web3
//       // const wallet = (this as any)._vm.$wallet

//       // const tokenAccounts = wallet.tokenAccounts

//       const list: any = []
//       //poolInfo.tokenSwapAccount  目前只有一个交易对，多个交易对的时候要取多次
//       const data = await loadAccount(
//         this.$web3,
//         new PublicKey('9c58dGLFcsaomxgc3UNR92AviUoiSa6P5G9QhWcAonPJ'),
//         SWAPV3_PROGRAMID
//       )
//       const tokenSwapData = TokenSwapLayout.decode(data)

//       const length = tokenSwapData.user_position_index
//       const priceDecimal = 8
//       const currentPrice = Numberu128.fromBuffer(tokenSwapData.current_price).toNumber() / Math.pow(10, priceDecimal)

//       let userPositions = await UserPosition.loadUserPosition(
//         this.$web3,
//         USER_POSITION_ACCOUNT.publicKey,
//         SWAPV3_PROGRAMID,
//         length
//       )
//       // console.log('userPositions#####', userPositions)
//       const userPositionObj: any = {}
//       for (let i = 0; i < length; i++) {
//         let userPosition = userPositions[i]
//         userPositionObj[userPosition.nft_token_id.toString()] = userPosition
//       }
//       for (const key in tokenAccounts) {
//         const tokenAccountAddress = tokenAccounts[key].tokenAccountAddress
//         if (userPositionObj[tokenAccountAddress]) {
//           const item = userPositionObj[tokenAccountAddress]
//           const minPrice = tick2price(item.lower_tick)
//           const maxPrice = tick2price(item.upper_tick)
//           list.push({
//             nftTokenId: item.nft_token_id.toString(),
//             minPrice: fixD(minPrice, priceDecimal),
//             maxPrice: fixD(maxPrice, priceDecimal),
//             currentPrice: fixD(currentPrice, priceDecimal)
//           })
//         }
//       }
//       commit('setMyPositions', list)
//     }
//   }
// )

export const actions = actionTree(
  { state, getters, mutations },
  {
    async requestMyPositions({ commit }, tokenAccounts) {
      // const conn = this.$web3
      // const wallet = (this as any)._vm.$wallet

      // const tokenAccounts = wallet.tokenAccounts
      // console.log('requestMyPositions####tokenAccounts###', tokenAccounts)

      const list: any = []
      //poolInfo.tokenSwapAccount  目前只有一个交易对，多个交易对的时候要取多次
      for (let p = 0; p < LIQUIDITY_POOLS.length; p++) {
        const poolInfo = cloneDeep(LIQUIDITY_POOLS[p])

        const data = await loadAccount(this.$web3, new PublicKey(poolInfo.tokenSwapAccount), SWAPV3_PROGRAMID)
        const tokenSwapData = TokenSwapLayout.decode(data)

        const length = tokenSwapData.user_position_index
        const priceDecimal = 12
        const currentPrice = Numberu128.fromBuffer(tokenSwapData.current_price).toNumber() / Math.pow(10, priceDecimal)

        let userPositions = await UserPosition.loadUserPosition(
          this.$web3,
          // USER_POSITION_ACCOUNT.publicKey,
          new PublicKey(poolInfo.userPositionKey),
          SWAPV3_PROGRAMID,
          length
        )
        // console.log('userPositions#####', userPositions)
        const userPositionObj: any = {}
        for (let i = 0; i < length; i++) {
          let userPosition = userPositions[i]
          userPositionObj[userPosition.nft_token_id.toString()] = userPosition
          // console.log('所有的userPosition.nft_token_id####', userPosition.nft_token_id.toString())
        }

        // console.log('tokenAccounts#####', tokenAccounts)
        for (const key in tokenAccounts) {
          const tokenAccountAddress = tokenAccounts[key].tokenAccountAddress
          // console.log('所有的tokenAccountAddress####', tokenAccountAddress)
          if (userPositionObj[tokenAccountAddress]) {
            const item = userPositionObj[tokenAccountAddress]
            const minPrice = tick2price(item.lower_tick)
            const maxPrice = tick2price(item.upper_tick)
            console.log('item####', item)
            // item.balance.toEther()
            list.push({
              ...poolInfo,
              nftTokenId: item.nft_token_id.toString(),
              nftTokenMint: key,
              minPrice: fixD(Math.pow(minPrice, 2), priceDecimal),
              maxPrice: fixD(Math.pow(maxPrice, 2), priceDecimal),
              currentPrice: fixD(Math.pow(currentPrice, 2), priceDecimal),
              currentPriceOrigin: Numberu128.fromBuffer(tokenSwapData.current_price).toNumber(),
              ...item
            })
          }
        }
      }

      console.log('store###position###list####', list)

      commit('setMyPositions', list)
    }
  }
)
