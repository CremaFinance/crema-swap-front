// import {
//   // LIQUIDITY_POOL_PROGRAM_ID_V2,
//   LIQUIDITY_POOL_PROGRAM_ID_V3,
//   LIQUIDITY_POOL_PROGRAM_ID_V4,
//   // SERUM_PROGRAM_ID_V2,
//   SERUM_PROGRAM_ID_V3
// } from './ids'
import {
  LP_TOKENS,
  // NATIVE_SOL,
  TOKENS,
  TokenInfo
} from './tokens'
// @ts-ignore
import SERUM_MARKETS from '@project-serum/serum/lib/markets.json'
import { cloneDeep } from 'lodash-es'
import { Numberu128 } from '@/tokenSwap'

// export interface LiquidityPoolInfo {
//   name: string
//   coin: TokenInfo
//   pc: TokenInfo
//   lp: TokenInfo

//   version: number
//   programId: string

//   ammId: string
//   ammAuthority: string
//   ammOpenOrders: string
//   ammTargetOrders: string
//   ammQuantities: string

//   poolCoinTokenAccount: string
//   poolPcTokenAccount: string
//   poolWithdrawQueue: string
//   poolTempLpTokenAccount: string

//   serumProgramId: string
//   serumMarket: string
//   serumBids?: string
//   serumAsks?: string
//   serumEventQueue?: string
//   serumCoinVaultAccount: string
//   serumPcVaultAccount: string
//   serumVaultSigner: string

//   official: boolean
//   isTest?: boolean
//   tokenSwapAccount?: string
//   feeAccount?: string
//   isHmm?: boolean
//   fee?: number
//   c?: number
//   product?: string
//   price?: string
// }
export interface LiquidityPoolInfo {
  coinPair?: string
  name?: string
  coin?: TokenInfo
  pc?: TokenInfo
  // lp: TokenInfo

  programId?: string
  authority?: string

  poolCoinTokenAccount?: string
  poolPcTokenAccount?: string
  tokenSwapAccount: string
  tokenSwapToken?: string
  // tickMapPubkey: string
  tickDetailKey?: string
  tickPositionKey?: string
  userPositionKey?: string
  // userPositionIndex: number
  currentPrice?: string
  currentPriceOrigin?: Numberu128
  fee?: string
}

/**
 * Get pool use two mint addresses

 * @param {string} coinMintAddress
 * @param {string} pcMintAddress

 * @returns {LiquidityPoolInfo | undefined} poolInfo
 */
// export function getPoolByTokenMintAddresses(
//   coinMintAddress: string,
//   pcMintAddress: string
// ): LiquidityPoolInfo | undefined {
//   const pool = LIQUIDITY_POOLS.find(
//     (pool) =>
//       (pool.coin.mintAddress === coinMintAddress && pool.pc.mintAddress === pcMintAddress) ||
//       (pool.coin.mintAddress === pcMintAddress && pool.pc.mintAddress === coinMintAddress)
//   )

//   if (pool) {
//     return cloneDeep(pool)
//   }

//   return pool
// }

// export function getPoolListByTokenMintAddresses(
//   coinMintAddress: string,
//   pcMintAddress: string,
//   ammIdOrMarket: string | undefined
// ): LiquidityPoolInfo[] {
//   const pool = LIQUIDITY_POOLS.filter((pool) => {
//     if (coinMintAddress && pcMintAddress) {
//       if (
//         (pool.coin.mintAddress === coinMintAddress && pool.pc.mintAddress === pcMintAddress) ||
//         (pool.coin.mintAddress === pcMintAddress && pool.pc.mintAddress === coinMintAddress)
//       ) {
//         return !(ammIdOrMarket !== undefined)
//       }
//     } else {
//       return !(ammIdOrMarket !== undefined)
//     }
//     return false
//   })
//   if (pool.length > 0) {
//     return cloneDeep(pool)
//   } else {
//     return cloneDeep(
//       LIQUIDITY_POOLS.filter((pool) => {
//         if (coinMintAddress && pcMintAddress) {
//           if (
//             (pool.coin.mintAddress === coinMintAddress && pool.pc.mintAddress === pcMintAddress) ||
//             (pool.coin.mintAddress === pcMintAddress && pool.pc.mintAddress === coinMintAddress)
//           ) {
//             return !(ammIdOrMarket !== undefined)
//           }
//         } else {
//           return !(ammIdOrMarket !== undefined)
//         }
//         return false
//       })
//     )
//   }
// }

// export function getLpListByTokenMintAddresses(
//   coinMintAddress: string,
//   pcMintAddress: string,
//   ammIdOrMarket: string | undefined,
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   version = [3, 4]
// ): LiquidityPoolInfo[] {
//   const pool = LIQUIDITY_POOLS.filter((pool) => {
//     if (coinMintAddress && pcMintAddress) {
//       if (
//         (pool.coin.mintAddress === coinMintAddress && pool.pc.mintAddress === pcMintAddress) ||
//         (pool.coin.mintAddress === pcMintAddress && pool.pc.mintAddress === coinMintAddress)
//       ) {
//         return !(ammIdOrMarket !== undefined)
//       }
//     } else {
//       return !(ammIdOrMarket !== undefined)
//     }
//     return false
//   })
//   if (pool.length > 0) {
//     return pool
//   } else {
//     return LIQUIDITY_POOLS.filter((pool) => {
//       if (coinMintAddress && pcMintAddress) {
//         if (
//           (pool.coin.mintAddress === coinMintAddress && pool.pc.mintAddress === pcMintAddress) ||
//           (pool.coin.mintAddress === pcMintAddress && pool.pc.mintAddress === coinMintAddress)
//         ) {
//           return !(ammIdOrMarket !== undefined)
//         }
//       } else {
//         return !(ammIdOrMarket !== undefined)
//       }
//       return false
//     })
//   }
// }

export function canWrap(fromMintAddress: string, toMintAddress: string): boolean {
  return fromMintAddress === TOKENS.WUSDT.mintAddress && toMintAddress === TOKENS.USDT.mintAddress
}

export function isOfficalMarket(marketAddress: string) {
  for (const market of SERUM_MARKETS) {
    if (market.address === marketAddress && !market.deprecated) {
      return true
    }
  }

  // for (const pool of LIQUIDITY_POOLS) {
  //   if (pool.serumMarket === marketAddress && pool.official === true) {
  //     return true
  //   }
  // }

  return false
}

export const LIQUIDITY_POOLS: LiquidityPoolInfo[] = [
  // main net start ********
  // USDT-USDC
  {
    coinPair: 'USDT-USDC',
    tokenSwapAccount: '8J3avAjuRfL2CYFKKDwhhceiRoajhrHv9kN5nUiEnuBG'
  },
  {
    coinPair: 'UST-USDC',
    tokenSwapAccount: 'FESPUeMZLHPGqQvpyJe2QCbNmqCtYPEr1fw2oUDGJN9Z'
  },
  {
    coinPair: 'PAI-USDC',
    tokenSwapAccount: 'CYnnubJbqfeMcAiZE6cTMCfvuoWJiRrMKQANE7s3wLSK'
  },
  {
    coinPair: 'USDH-USDC',
    tokenSwapAccount: 'B1eNrQEExnPPmVbM3jiEAd89nW7tXUiArrk81JtUz6H8'
  },
  {
    coinPair: 'pUSDT-pUSDC',
    tokenSwapAccount: 'QNZScPBQzskAPvYVipVeUBSkGVQ4vrkXyowcibXdi7V'
  },
  {
    coinPair: 'UST-USDH',
    tokenSwapAccount: 'C52SfQELE8kAUES36fAfBcvCkoWLgHTrANqMdFXqEnm8'
  },
  {
    coinPair: 'scnSOL-SOL',
    tokenSwapAccount: '4i4QctWjgDPRZfe62PVmJw1Lf5iirAKBDjQccim427hY'
  },
  {
    coinPair: 'mSOL-scnSOL',
    tokenSwapAccount: '44tS4kvhDHdAmwU7pcMMfovwjfbWGhNegQeMwzazkhDG'
  },
  {
    coinPair: 'prtSOL-SOL',
    tokenSwapAccount: 'ALPuJ3E525CHrNxNdCoUvjorppQ1W7EiYGnv9o42etfn'
  }
  // {
  //   coinPair: ''
  // }
  // main net end ********
  // test net start **********
  // HYSD-USDD
  // {
  //   // tokenSwapAccount: 'Ei9AknG73StHLYgFvobYGsSFVKxDUYnMmm7m5FPkG5dm'
  //   coinPair: 'HYSD-USDD',
  //   tokenSwapAccount: '2CQJoV8r4jYmtnAuj967pnSCbgDfe8w7gKuGKE8RSuPw'
  // },
  // csol-usdc
  // {
  //   coinPair: 'CSOL-CUSDC',
  //   tokenSwapAccount: 'Gz113eAqg5FPJr3mnB2EhmDrGkUBHfsaY4xtbExd53nv'
  // },
  // usdt-usdc
  // {
  //   coinPair: 'CUSDT-CUSDC',
  //   tokenSwapAccount: '38ZpXbmvga78CFPR2YJbS3vDNHYsV67K1angDNLje3gA'
  // },
  // {
  //   coinPair: 'CUSDT-CUSDC',
  //   tokenSwapAccount: '6jZ1KK9LephzTTTL4pRnHwL9qBG8ymHk5Biv7vFdNtrR'
  // },
  // {
  //   coinPair: 'CNSOL-CNUSDC',
  //   tokenSwapAccount: '7JEGfvmHNecSV826CAAwoeaf2tY55jM9vQJrt1avALmy'
  // }
  // test net end ********
  // {
  //   name: 'HYSD-USDD',
  //   coin: { ...TOKENS.HYSD },
  //   pc: { ...TOKENS.USDD },
  //   // lp: { ...LP_TOKENS['HYSD-USDD'] },
  //   programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  //   authority: 'BVMrSmqEuzU9YC48FrKTAsxMHFDJmPFkDMZdnZvFchW9',
  //   tokenSwapAccount: 'CoNeVJauDhYAWzN9JCFwFq8QZP5MY83yrFJuikd8aTmM',
  //   tokenSwapToken: 'C8L7YYHrn38sKfAxVo5BFsGYFWcLeRAdaavVNfzg9s5N',
  //   poolCoinTokenAccount: 'J17HLnZRGbV7koT8oeaY4tzAU3iPpf4S6DAERzK3uWpk',
  //   poolPcTokenAccount: '6Y6dAWQZXz6NXy3dSRMCVLRLC5Bk1sW3gUrra9Uv3j77',
  //   tickDetailKey: '7Qar8wQ1fQ1dkHao67fgVab6aAJmdbmXkMjfoLzMmDRD',
  //   userPositionKey: 'yxf3KxY8Qjf3goML3dE9Bo6mQhcqD6d1mjXH4zWKHvm',
  //   userPositionIndex: 2,
  //   currentPrice: new Numberu128(0),
  //   fee: 0
  // },
  // {
  //   name: 'CSOL-CUSDC',
  //   coin: { ...TOKENS.CSOL },
  //   pc: { ...TOKENS.CUSDC },
  //   programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  //   authority: '6E8nkxyb2yjVR3jE5P7ffiGjWX6WLGM1J1cHpJRrGoNk',
  //   tokenSwapAccount: 'DVARSmW7FNauTfJkpVvcGoPATyU61xRGo9K6nzZxBDq4',
  //   tokenSwapToken: 'C8L7YYHrn38sKfAxVo5BFsGYFWcLeRAdaavVNfzg9s5N',
  //   poolCoinTokenAccount: '48L7wCo6z6KHY8p4yMaWRXf1KfyXJHcUPorzUi9L6yNW',
  //   poolPcTokenAccount: 'AC94xqiTMNP9mtB7yPjXHiMFwi6KWu95hLbYW7gr7C8k',
  //   tickDetailKey: '3Y8xFVjPkmf2bnyK5pgi51FQa4qLfSoCXD57dkPxGDar',
  //   userPositionKey: '23avuYmyZxQJbn8qu4a3rHipmsVRVXtGwgZ8WAUZ7TXC',
  //   userPositionIndex: 2,
  //   currentPrice: new Numberu128(0),
  //   fee: 0
  // },
  // {
  //   name: 'CUSDC-USDD',
  //   coin: { ...TOKENS.CUSDC },
  //   pc: { ...TOKENS.USDD },
  //   programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  //   authority: 'Aa1PZbUBqnjJvdQ5gs71aJkskcWBTmQ6Qh5KDx3K2xnc',
  //   tokenSwapAccount: 'CJRGUYSNz6WBp2ZVpm75uqB2soxxBvmWmgQG2NPZC4Lr',
  //   tokenSwapToken: 'C8L7YYHrn38sKfAxVo5BFsGYFWcLeRAdaavVNfzg9s5N',
  //   poolCoinTokenAccount: 'CbZCHymADCLygdxoE1HE7G4251T8mF2Q6rKhyceDipyZ',
  //   poolPcTokenAccount: 'BWaJSJ6kc4V9eomxG7XbJt6BFjWNvteGsJ58RcSs5TYH',
  //   tickDetailKey: 'CmKHdLP9PHnje84jemRwcPBGULsqjbgCt9xDheUPxCdD',
  //   userPositionKey: 'GbqyKw4TSRmsBdw8C3HULMHPGKDoUWnLSi29evLcMJTP',
  //   userPositionIndex: 2,
  //   currentPrice: new Numberu128(0),
  //   fee: 0
  // },
  // {
  //   name: 'CUSDC-CUSDT',
  //   coin: { ...TOKENS.CUSDC },
  //   pc: { ...TOKENS.CUSDT },
  //   programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  //   authority: '12sHo9vJZqyaNoQXMCDZ5FWrm1ERo6RvTfykhiJReYeW',
  //   tokenSwapAccount: '9BA626KEedFiS4N4PRk47vPxDppsgZX7Zhs8m4NLAtPL',
  //   tokenSwapToken: 'C8L7YYHrn38sKfAxVo5BFsGYFWcLeRAdaavVNfzg9s5N',
  //   poolCoinTokenAccount: '2ztbi2g8FKTtzQsucoYDwAUPYoqJUEEUnBxgfNJTrBNn',
  //   poolPcTokenAccount: 'MCok9TZnB9cufH2GsdX1WQ2y3XRnjT1iA6Jum1xkoAf',
  //   tickDetailKey: 'HN3sr6PSrWJG9BANkKeEvgSMSQ6XAdgkSX4SFantXtmB',
  //   userPositionKey: 'DrF7qZNPbrvVTVhWipvoHFZriu6YCqR7xtndSXRJ4EGz',
  //   userPositionIndex: 2,
  //   currentPrice: new Numberu128(0),
  //   fee: 0
  // },
  // {
  //   name: 'CTA-CTB',
  //   coin: { ...TOKENS.CTA },
  //   pc: { ...TOKENS.CTB },
  //   programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  //   authority: '28FBQfWBqw7ZHRKLcxfiFbu3VoPDUKUH5TsZcX4mdNYw',
  //   tokenSwapAccount: 'BeHeQPu2GWxvNJ3xqFgWUx6CoSnvFLZdDj7P4NkN1nXo',
  //   tokenSwapToken: 'C8L7YYHrn38sKfAxVo5BFsGYFWcLeRAdaavVNfzg9s5N',
  //   poolCoinTokenAccount: 'CUdhfvSxkXjP67uLGzQKEjkonZ7usg8U1kmC5MFNbF29',
  //   poolPcTokenAccount: 'HbhrQhf4i98rCyJnAqsjHBDqCo73yLKtGdXkYJYG88mk',
  //   tickDetailKey: '4qDqiyeKe37U6BeV6Wu8xZ793LZM8mMsseQUXgJmyrKe',
  //   userPositionKey: '9vWstD9S7hDYDCAaF2qF9ENUZDNxPHBQXuYZrwHA8YvV',
  //   userPositionIndex: 2,
  //   currentPrice: new Numberu128(0),
  //   fee: 0
  // }
  // {
  //   name: 'CSOL-USDC',
  //   coin: { ...TOKENS.CSOL },
  //   pc: { ...TOKENS.USDC },
  //   // lp: { ...LP_TOKENS['CSOL-USDC'] },
  //   programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  //   authority: '7pMg6c8Y375CMFv3fkoF7x6DYW2QxFR3W4X3gEStY4aH',
  //   tokenSwapAccount: 'GDy7ip2WQX52avJz8qKnpRUBQ3hMpkSdLYMcPtHaFx1M',
  //   tokenSwapToken: 'C8L7YYHrn38sKfAxVo5BFsGYFWcLeRAdaavVNfzg9s5N',
  //   poolCoinTokenAccount: '4n7GEvJsyDWkX3WBHJUXkxbgvZvPHSKPrAZkUbFTe5tX',
  //   poolPcTokenAccount: 'C7AZy7aie5a28KMZLwTuuTSTk4s9PyyK2GhLSTJ42LYe',
  //   tickDetailKey: '49Z9YptbwTerQThmsY9HXWa4XaFYqwj5pgoZvawBj7kF',
  //   userPositionKey: 'GXYWqgZER3wwa5vsiBrwK52rjqErtxXfhgps3gDJuiaY',
  //   userPositionIndex: 2,
  //   currentPrice: new Numberu128(0),
  //   fee: 0
  // },
  // {
  //   name: 'USDC-USDD',
  //   coin: { ...TOKENS.USDC },
  //   pc: { ...TOKENS.USDD },
  //   // lp: { ...LP_TOKENS['CSOL-USDC'] },
  //   programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  //   authority: '2C5SPpb88tbuF11UbH5y3XwXJu44hAyBrEQvDUN7JaR2',
  //   tokenSwapAccount: '5FD6LzMpwH5HPkuv2DeFdunaWtDP8Yg7mnAYVm3yvk9Y',
  //   tokenSwapToken: 'C8L7YYHrn38sKfAxVo5BFsGYFWcLeRAdaavVNfzg9s5N',
  //   poolCoinTokenAccount: 'CR7X57dusbS6DxPfWZCkh1SXZAXeaMAA8CHp7Dz4TooK',
  //   poolPcTokenAccount: '3reUj9ay7Nz6uUdr7MzENym5DzxEVWHKacMPtim1Zk4E',
  //   tickDetailKey: '28pABjsJdi1vQqBLuH9GEunzX6wz3uQQd9ZAKD6Xhb8j',
  //   userPositionKey: '7o9thAcg15Q9AGhS7aG27Jn7fbpyEB1Bss4mZg4eQ89i',
  //   userPositionIndex: 2,
  //   currentPrice: new Numberu128(0),
  //   fee: 0
  // }
  // {
  //   name: 'SOL-USDC',
  //   coin: { ...NATIVE_SOL },
  //   pc: { ...TOKENS.USDC },
  //   lp: { ...LP_TOKENS['SOL-USDC'] },
  //   version: 2,
  //   programId: 'A2sR7LZWEwD6nXjt9wb8HoJKM5CzbPA5fbrBRcXFmWq7',
  //   ammId: '',
  //   ammAuthority: '',
  //   ammOpenOrders: '',
  //   ammTargetOrders: '',
  //   ammQuantities: '',
  //   poolCoinTokenAccount: '87aJ6pqNUrPxdCP4pFoywqA82AR5rHiA5iAi6bW4PMPA',
  //   poolPcTokenAccount: '8aWGPVwBmQT8fT3fLGce7ULTBED1bKYGjkUNMPZAUEC9',
  //   poolWithdrawQueue: '',
  //   poolTempLpTokenAccount: '',
  //   serumProgramId: '',
  //   serumMarket: '',
  //   serumCoinVaultAccount: '',
  //   serumPcVaultAccount: '',
  //   serumVaultSigner: '',
  //   official: true,
  //   isTest: true,
  //   tokenSwapAccount: 'DRBbc9cgLhtyS7MtQ8kAaUak2CdLBQWoiHa4Kw9SxBzF',
  //   feeAccount: '8jqoJbMifSTNhYdW1SGo2S8U5S3h998mTx6EeXL7cRpK',
  //   isHmm: true,
  //   fee: 0,
  //   c: 0,
  //   product: 'ALP8SdU9oARYVLgLR7LrqMNCYBnhtnQz1cj6bwgwQmgj',
  //   price: 'H6ARHf6YXhGYeQfUzQNGk6rDNnLBQKrenN712K4AQJEG'
  // }
]
