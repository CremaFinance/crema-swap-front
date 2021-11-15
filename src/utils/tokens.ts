import { TokenAmount } from '@/utils/safe-math'
import { cloneDeep } from 'lodash-es'

export const RATES: any = {
  HYSD: 0.2,
  USDD: 1,
  USDC: 1
}
export interface TokenInfo {
  symbol: string
  name: string

  mintAddress: string
  decimals: number
  totalSupply?: TokenAmount

  referrer?: string

  details?: string
  docs?: object
  socials?: object

  tokenAccountAddress?: string
  balance?: TokenAmount
  official?: boolean
  showDefault?: boolean
}

/**
 * Get token use symbol

 * @param {string} symbol

 * @returns {TokenInfo | null} tokenInfo
 */
export function getTokenBySymbol(symbol: string): TokenInfo | null {
  if (symbol === 'SOL') {
    return cloneDeep(NATIVE_SOL)
  }

  let token = cloneDeep(TOKENS[symbol])

  if (!token) {
    token = null
  }

  return token
}

/**
 * Get token use mint addresses

 * @param {string} mintAddress

 * @returns {TokenInfo | null} tokenInfo
 */
export function getTokenByMintAddress(mintAddress: string): TokenInfo | null {
  if (mintAddress === NATIVE_SOL.mintAddress) {
    return cloneDeep(NATIVE_SOL)
  }
  const token = Object.values(TOKENS).find((item) => item.mintAddress === mintAddress)
  return token ? cloneDeep(token) : null
}

export interface Tokens {
  [key: string]: any
  [index: number]: any
}

export const NATIVE_SOL: TokenInfo = {
  symbol: 'SOL',
  name: 'Native Solana',
  mintAddress: '11111111111111111111111111111111',
  decimals: 9,
  official: true,
  showDefault: true
}

export const TOKENS: Tokens = {
  // CRM: {
  //   symbol: 'CRM',
  //   name: 'CRM',
  //   mintAddress: 'D11M7swUBM2wJWnUeTU9KCEv317gn8s1C8V7SJzXbfmm',
  //   decimals: 6,
  //   referrer: '',
  //   official: true,
  //   showDefault: true
  // },
  // USDT: {
  //   symbol: 'USDT',
  //   name: 'USDT',
  //   mintAddress: 'D11M7swUBM2wJWnUeTU9KCEv317gn8s1C8V7SJzXbfmm',
  //   decimals: 6,
  //   referrer: '',
  //   official: true,
  //   showDefault: true
  // },
  // USDT: {
  //   symbol: 'USDT',
  //   name: 'USDT',
  //   mintAddress: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
  //   decimals: 6,
  //   referrer: '8DwwDNagph8SdwMUdcXS5L9YAyutTyDJmK6cTKrmNFk3',
  //   official: true,
  //   showDefault: false
  // },
  // USDD: {
  //   symbol: 'CUSDD',
  //   name: 'CUSDD',
  //   mintAddress: 'D11M7swUBM2wJWnUeTU9KCEv317gn8s1C8V7SJzXbfmm',
  //   decimals: 6,
  //   referrer: '',
  //   official: true,
  //   showDefault: true
  // },
  // HYSD: {
  //   symbol: 'HYSD',
  //   name: 'HYSD',
  //   mintAddress: 'HdJ8pzRMFquse6MAdLTm2JHum51WFkocZX8YzXpPjNpG',
  //   decimals: 6,
  //   referrer: '',
  //   official: true,
  //   showDefault: true
  // },
  CSOL: {
    symbol: 'CSOL',
    name: 'CSOL',
    mintAddress: '1msZrgEMrhEzhLWjGvEpqo3RUuzMWGs4x9S6j3Nk1hK',
    decimals: 8,
    referrer: '',
    official: true,
    showDefault: true
  },
  CUSDC: {
    symbol: 'CUSDC',
    name: 'CUSDC',
    mintAddress: 'GHStiPQDe4HEQxtDzyFFuNjP6Z6GqYhbPqJ6oiRFmGWT',
    decimals: 8,
    referrer: '',
    official: true,
    showDefault: true
  },
  CUSDT: {
    symbol: 'CUSDT',
    name: 'CUSDT',
    mintAddress: 'Gcu9zjxrjez4xWGj8bi2gTLXYN8hD8Avu2tN8xfnV65Q',
    decimals: 8,
    referrer: '',
    official: true,
    showDefault: true
  }
  // USDC: {
  //   symbol: 'USDC',
  //   name: 'USDC',
  //   mintAddress: '78wWR5HJPujs7RfsbJNDDMbCuYzcZkrdUE3txjnmYdKp',
  //   decimals: 8,
  //   referrer: '',
  //   official: true,
  //   showDefault: true
  // }
  // WSOL: {
  //   symbol: 'WSOL',
  //   name: 'Wrapped Solana',
  //   mintAddress: 'So11111111111111111111111111111111111111112',
  //   decimals: 9,
  //   referrer: 'AUxC4Y8ns3RmHsjcujZVjv5ioA1LkNfgXPwZjkJT4rz1',
  //   official: true,
  //   showDefault: false
  // }
}

export const LP_TOKENS: Tokens = {
  'HYSD-USDD': {
    symbol: 'HYSD-USDD',
    name: 'HYSD-USDD',
    coin: { ...TOKENS.HYSD },
    pc: { ...TOKENS.USDD },
    mintAddress: 'FAmdutSS9sTVoqTbw2JYrcns58ZfEozrgevgeZuZiyML', // 没找到lp地址
    decimals: 6
  }
  // 'SOL-USDC': {
  //   symbol: 'SOL-USDC',
  //   name: 'SOL-USDC',
  //   coin: { ...NATIVE_SOL },
  //   pc: { ...TOKENS.USDC },
  //   mintAddress: 'FAmdutSS9sTVoqTbw2JYrcns58ZfEozrgevgeZuZiyML',
  //   decimals: 6
  // },
  // 'ETH-USDC': {
  //   symbol: 'ETH-USDC',
  //   name: 'ETH-USDC',
  //   coin: { ...TOKENS.ETH },
  //   pc: { ...TOKENS.USDC },
  //   mintAddress: 'HRhugQTKnX5TK6dQUygwUr7rgCZmzJjk4CiAxZV3eaTk',
  //   decimals: 6
  // },
  // 'BTC-USDC': {
  //   symbol: 'BTC-USDC',
  //   name: 'BTC-USDC',
  //   coin: { ...TOKENS.BTC },
  //   pc: { ...TOKENS.USDC },
  //   mintAddress: '5vVrn1ioAjAeCNSYhwA19CnPTSmcDuMPnB2wUFQ5hkeg',
  //   decimals: 6
  // }
}
