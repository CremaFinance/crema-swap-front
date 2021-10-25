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
  name: string
  coin: TokenInfo
  pc: TokenInfo
  lp: TokenInfo

  programId: string
  authority: string

  poolCoinTokenAccount: string
  poolPcTokenAccount: string
  tokenSwapAccount: string
  tickMapPubkey: string
  tickDetailKey: string
  tickPositionKey: string
  userPositionKey: string
}

/**
 * Get pool use two mint addresses

 * @param {string} coinMintAddress
 * @param {string} pcMintAddress

 * @returns {LiquidityPoolInfo | undefined} poolInfo
 */
export function getPoolByTokenMintAddresses(
  coinMintAddress: string,
  pcMintAddress: string
): LiquidityPoolInfo | undefined {
  const pool = LIQUIDITY_POOLS.find(
    (pool) =>
      (pool.coin.mintAddress === coinMintAddress && pool.pc.mintAddress === pcMintAddress) ||
      (pool.coin.mintAddress === pcMintAddress && pool.pc.mintAddress === coinMintAddress)
  )

  if (pool) {
    return cloneDeep(pool)
  }

  return pool
}

export function getPoolListByTokenMintAddresses(
  coinMintAddress: string,
  pcMintAddress: string,
  ammIdOrMarket: string | undefined
): LiquidityPoolInfo[] {
  const pool = LIQUIDITY_POOLS.filter((pool) => {
    if (coinMintAddress && pcMintAddress) {
      if (
        (pool.coin.mintAddress === coinMintAddress && pool.pc.mintAddress === pcMintAddress) ||
        (pool.coin.mintAddress === pcMintAddress && pool.pc.mintAddress === coinMintAddress)
      ) {
        return !(ammIdOrMarket !== undefined)
      }
    } else {
      return !(ammIdOrMarket !== undefined)
    }
    return false
  })
  if (pool.length > 0) {
    return cloneDeep(pool)
  } else {
    return cloneDeep(
      LIQUIDITY_POOLS.filter((pool) => {
        if (coinMintAddress && pcMintAddress) {
          if (
            (pool.coin.mintAddress === coinMintAddress && pool.pc.mintAddress === pcMintAddress) ||
            (pool.coin.mintAddress === pcMintAddress && pool.pc.mintAddress === coinMintAddress)
          ) {
            return !(ammIdOrMarket !== undefined)
          }
        } else {
          return !(ammIdOrMarket !== undefined)
        }
        return false
      })
    )
  }
}

export function getLpMintByTokenMintAddresses(
  coinMintAddress: string,
  pcMintAddress: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  version = [3, 4]
): string | null {
  // const pool = LIQUIDITY_POOLS.find(
  //   (pool) =>
  //     ((pool.coin.mintAddress === coinMintAddress && pool.pc.mintAddress === pcMintAddress) ||
  //       (pool.coin.mintAddress === pcMintAddress && pool.pc.mintAddress === coinMintAddress)) &&
  //     version.includes(pool.version)
  // )
  const pool = LIQUIDITY_POOLS.find((pool) => {
    return (
      (pool.coin.mintAddress === coinMintAddress && pool.pc.mintAddress === pcMintAddress) ||
      (pool.coin.mintAddress === pcMintAddress && pool.pc.mintAddress === coinMintAddress) ||
      (pool.coin.mintAddress === coinMintAddress && pool.pc.mintAddress === pcMintAddress) ||
      (pool.coin.mintAddress === pcMintAddress && pool.pc.mintAddress === coinMintAddress)
    )
  })

  if (pool) {
    return pool.lp.mintAddress
  }

  return null
}

export function getLpListByTokenMintAddresses(
  coinMintAddress: string,
  pcMintAddress: string,
  ammIdOrMarket: string | undefined,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  version = [3, 4]
): LiquidityPoolInfo[] {
  const pool = LIQUIDITY_POOLS.filter((pool) => {
    if (coinMintAddress && pcMintAddress) {
      if (
        (pool.coin.mintAddress === coinMintAddress && pool.pc.mintAddress === pcMintAddress) ||
        (pool.coin.mintAddress === pcMintAddress && pool.pc.mintAddress === coinMintAddress)
      ) {
        return !(ammIdOrMarket !== undefined)
      }
    } else {
      return !(ammIdOrMarket !== undefined)
    }
    return false
  })
  if (pool.length > 0) {
    return pool
  } else {
    return LIQUIDITY_POOLS.filter((pool) => {
      if (coinMintAddress && pcMintAddress) {
        if (
          (pool.coin.mintAddress === coinMintAddress && pool.pc.mintAddress === pcMintAddress) ||
          (pool.coin.mintAddress === pcMintAddress && pool.pc.mintAddress === coinMintAddress)
        ) {
          return !(ammIdOrMarket !== undefined)
        }
      } else {
        return !(ammIdOrMarket !== undefined)
      }
      return false
    })
  }
}

export function canWrap(fromMintAddress: string, toMintAddress: string): boolean {
  return fromMintAddress === TOKENS.WUSDT.mintAddress && toMintAddress === TOKENS.USDT.mintAddress
}

export function getPoolByLpMintAddress(lpMintAddress: string): LiquidityPoolInfo | undefined {
  const pool = LIQUIDITY_POOLS.find((pool) => pool.lp.mintAddress === lpMintAddress)

  if (pool) {
    return cloneDeep(pool)
  }

  return pool
}

export function getAddressForWhat(address: string) {
  for (const pool of LIQUIDITY_POOLS) {
    for (const [key, value] of Object.entries(pool)) {
      if (key === 'lp') {
        if (value.mintAddress === address) {
          return { key: 'lpMintAddress', lpMintAddress: pool.lp.mintAddress, version: '' }
        }
      } else if (value === address) {
        return { key, lpMintAddress: pool.lp.mintAddress, version: '' }
      }
    }
  }

  return {}
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
  {
    name: 'HYSD-USDD',
    coin: { ...TOKENS.HYSD },
    pc: { ...TOKENS.USDD },
    lp: { ...LP_TOKENS['HYSD-USDD'] },
    programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    authority: 'Dwesu9Fg63QifmUP7epm9RHhDD8e9rpCdMYA3keqCCyN',
    tokenSwapAccount: 'CHdxYT1DWMraPrMUa5suYdNeh9h5SL7ZoZsXVJPxEYNV',
    poolCoinTokenAccount: '3jgBQWwgsLnUU8mMyags9f4sqKaMdAweV6dAv5B8ULET',
    poolPcTokenAccount: 'DGRXbamNuabgabHCpT4S9eExKEGQgShXAtX8TeH1ere6',
    tickMapPubkey: 'GznACvQZxes7k2CA7z5SQYpjdmYUysBTvZ4C4AXkifbL',
    tickDetailKey: '2BNMYw76D6bgBSTaGMJ9pyDZ2xKw8HgnQbbukPoG2TNr',
    tickPositionKey: 'D9bMcvY4oXeJ9bBp618EAAgiH3JrQqqU3PQjmVp7yqW8',
    userPositionKey: 'E4giUZhTVxq5oNq4wSGsdxUWiTtNmm4CWSuLgZPgaifb'
  }
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
