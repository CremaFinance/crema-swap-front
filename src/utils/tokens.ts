import { TokenAmount } from '@/utils/safe-math'
import { cloneDeep } from 'lodash-es'

export const RATES: any = {
  HYSD: 0.2,
  USDD: 1,
  USDC: 1,
  CUSDT: 1,
  CUSDC: 1,
  CSOL: 1,
  CTA: 1,
  CTB: 1
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

  // let token = cloneDeep(TOKENS[symbol])
  let token = Object.values(TOKENS).find((item) => item.symbol === symbol)

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
  // main net start *************
  Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB: {
    symbol: 'USDT',
    name: 'USDT',
    mintAddress: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
    decimals: 6,
    referrer: '',
    official: true,
    showDefault: true
  },
  EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v: {
    symbol: 'USDC',
    name: 'USDC',
    mintAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    decimals: 6,
    referrer: '',
    official: true,
    showDefault: true
  },
  '9vMJfxuKxXBoEa7rM12mYLMwTacLMLDJqHozw96WQL8i': {
    symbol: 'UST',
    name: 'UST',
    mintAddress: '9vMJfxuKxXBoEa7rM12mYLMwTacLMLDJqHozw96WQL8i',
    decimals: 6,
    referrer: '',
    official: true,
    showDefault: true
  }
  // Ea5SjE2Y6yvCeW5dYTn7PYMuW5ikXkvbGdcmSnXeaLjS: {
  //   symbol: 'PAI',
  //   name: 'PAI',
  //   mintAddress: 'Ea5SjE2Y6yvCeW5dYTn7PYMuW5ikXkvbGdcmSnXeaLjS',
  //   decimals: 6,
  //   referrer: '',
  //   official: true,
  //   showDefault: true
  // }

  // main net end *************

  // test net start ***************
  // '1msZrgEMrhEzhLWjGvEpqo3RUuzMWGs4x9S6j3Nk1hK': {
  //   symbol: 'CSOL',
  //   name: 'CSOL',
  //   mintAddress: '1msZrgEMrhEzhLWjGvEpqo3RUuzMWGs4x9S6j3Nk1hK',
  //   decimals: 8,
  //   referrer: '',
  //   official: true,
  //   showDefault: true
  // },
  // GHStiPQDe4HEQxtDzyFFuNjP6Z6GqYhbPqJ6oiRFmGWT: {
  //   symbol: 'CUSDC',
  //   name: 'CUSDC',
  //   mintAddress: 'GHStiPQDe4HEQxtDzyFFuNjP6Z6GqYhbPqJ6oiRFmGWT',
  //   decimals: 8,
  //   referrer: '',
  //   official: true,
  //   showDefault: true
  // },
  // Gcu9zjxrjez4xWGj8bi2gTLXYN8hD8Avu2tN8xfnV65Q: {
  //   symbol: 'CUSDT',
  //   name: 'CUSDT',
  //   mintAddress: 'Gcu9zjxrjez4xWGj8bi2gTLXYN8hD8Avu2tN8xfnV65Q',
  //   decimals: 8,
  //   referrer: '',
  //   official: true,
  //   showDefault: true
  // }
  // test net end ******************

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
  // D11M7swUBM2wJWnUeTU9KCEv317gn8s1C8V7SJzXbfmm: {
  //   symbol: 'USDD',
  //   name: 'USDD',
  //   mintAddress: 'D11M7swUBM2wJWnUeTU9KCEv317gn8s1C8V7SJzXbfmm',
  //   decimals: 6,
  //   referrer: '',
  //   official: true,
  //   showDefault: true
  // },
  // HdJ8pzRMFquse6MAdLTm2JHum51WFkocZX8YzXpPjNpG: {
  //   symbol: 'HYSD',
  //   name: 'HYSD',
  //   mintAddress: 'HdJ8pzRMFquse6MAdLTm2JHum51WFkocZX8YzXpPjNpG',
  //   decimals: 6,
  //   referrer: '',
  //   official: true,
  //   showDefault: true
  // },
  // USDD: {
  //   symbol: 'USDD',
  //   name: 'USDD',
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
  // CTA: {
  //   symbol: 'CTA',
  //   name: 'CTA',
  //   mintAddress: 'H6vMBxX6RLatrbxiGPR6pCmSCHgNBmfv9B1Yr5stgGba',
  //   decimals: 9,
  //   referrer: '',
  //   official: true,
  //   showDefault: true
  // },
  // CTB: {
  //   symbol: 'CTB',
  //   name: 'CTB',
  //   mintAddress: 'FT1hRFXB9BvBs2RzMhfRQzr9yoDMLQLio1BeN9SVHd5u',
  //   decimals: 9,
  //   referrer: '',
  //   official: true,
  //   showDefault: true
  // }
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
