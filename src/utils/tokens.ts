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
  CTB: 1,
  pUSDT: 1,
  pUSDC: 1,
  mSOL: 0,
  scnSOL: 0,
  SOL: 0,
  CNUSDC: 1,
  CNSOL: 1
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
  decimal?: number
  token_mint?: string
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

export const NATIVE_SOL: any = {
  symbol: 'SOL',
  name: 'Wrapped SOL',
  mintAddress: '11111111111111111111111111111111',
  token_mint: '11111111111111111111111111111111',
  decimals: 9,
  decimal: 9,
  official: true,
  showDefault: true
}

export const WSOL: any = {
  symbol: 'WSOL',
  name: 'Wrapped SOL',
  mintAddress: 'So11111111111111111111111111111111111111112',
  token_mint: 'So11111111111111111111111111111111111111112',
  decimals: 9,
  decimal: 9,
  referrer: 'AUxC4Y8ns3RmHsjcujZVjv5ioA1LkNfgXPwZjkJT4rz1',
  official: true,
  showDefault: false
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
    name: 'USD Coin',
    mintAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    decimals: 6,
    referrer: '',
    official: true,
    showDefault: true
  },
  '9vMJfxuKxXBoEa7rM12mYLMwTacLMLDJqHozw96WQL8i': {
    symbol: 'UST',
    name: 'UST (Wormhole)',
    mintAddress: '9vMJfxuKxXBoEa7rM12mYLMwTacLMLDJqHozw96WQL8i',
    decimals: 6,
    referrer: '',
    official: true,
    showDefault: true
  },
  Ea5SjE2Y6yvCeW5dYTn7PYMuW5ikXkvbGdcmSnXeaLjS: {
    symbol: 'PAI',
    name: 'Parrot USD',
    mintAddress: 'Ea5SjE2Y6yvCeW5dYTn7PYMuW5ikXkvbGdcmSnXeaLjS',
    decimals: 6,
    referrer: '',
    official: true,
    showDefault: true
  },
  USDH1SM1ojwWUga67PGrgFWUHibbjqMvuMaDkRJTgkX: {
    symbol: 'USDH',
    name: 'USDH Hubble Stablecoin',
    mintAddress: 'USDH1SM1ojwWUga67PGrgFWUHibbjqMvuMaDkRJTgkX',
    decimals: 6,
    referrer: '',
    official: true,
    showDefault: true
  },
  '3RudPTAkfcq9Q9Jk8SVeCoecCBmdKMj6q5smsWzxqtqZ': {
    symbol: 'pUSDT',
    name: 'Port Finance USDT',
    mintAddress: '3RudPTAkfcq9Q9Jk8SVeCoecCBmdKMj6q5smsWzxqtqZ',
    decimals: 6,
    referrer: '',
    official: true,
    showDefault: true
  },
  FgSsGV8GByPaMERxeQJPvZRZHf7zCBhrdYtztKorJS58: {
    symbol: 'pUSDC',
    name: 'Port Finance USDC',
    mintAddress: 'FgSsGV8GByPaMERxeQJPvZRZHf7zCBhrdYtztKorJS58',
    decimals: 6,
    referrer: '',
    official: true,
    showDefault: true
  },
  '5oVNBeEEQvYi1cX3ir8Dx5n1P7pdxydbGF2X4TxVusJm': {
    symbol: 'scnSOL',
    name: 'Socean staked SOL',
    mintAddress: '5oVNBeEEQvYi1cX3ir8Dx5n1P7pdxydbGF2X4TxVusJm',
    decimals: 9,
    referrer: '',
    official: true,
    showDefault: true
  },
  mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So: {
    symbol: 'mSOL',
    name: 'Marinade staked SOL(mSOL)',
    mintAddress: 'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So',
    decimals: 9,
    referrer: '',
    official: true,
    showDefault: true
  },
  BdZPG9xWrG3uFrx2KrUW1jT4tZ9VKPDWknYihzoPRJS3: {
    symbol: 'prtSOL',
    name: 'prtSOL(Parrot Staked SOL)',
    mintAddress: 'BdZPG9xWrG3uFrx2KrUW1jT4tZ9VKPDWknYihzoPRJS3',
    decimals: 9,
    referrer: '',
    official: true,
    showDefault: true
  },
  So11111111111111111111111111111111111111112: {
    symbol: 'WSOL',
    name: 'Wrapped SOL',
    mintAddress: 'So11111111111111111111111111111111111111112',
    decimals: 9,
    referrer: 'AUxC4Y8ns3RmHsjcujZVjv5ioA1LkNfgXPwZjkJT4rz1',
    official: true,
    showDefault: false
  },
  NRVwhjBQiUPYtfDT5zRBVJajzFQHaBUNtC7SNVvqRFa: {
    symbol: 'NIRV',
    name: 'NIRV',
    mintAddress: 'NRVwhjBQiUPYtfDT5zRBVJajzFQHaBUNtC7SNVvqRFa',
    decimals: 6,
    referrer: '',
    official: true,
    showDefault: true
  },
  '7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj': {
    symbol: 'stSOL',
    name: 'Lido Staked SOL',
    mintAddress: '7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj',
    decimals: 9,
    referrer: '',
    official: true,
    showDefault: true
  }
  // CSoLEzPj3EWGpZthSwKSHr8U9WQJrg93vCkURGkLEcQH: {
  //   symbol: 'cSOL',
  //   name: 'cSOL',
  //   mintAddress: 'CSoLEzPj3EWGpZthSwKSHr8U9WQJrg93vCkURGkLEcQH',
  //   decimals: 9,
  //   referrer: '',
  //   official: true,
  //   showDefault: true
  // }
  // So11111111111111111111111111111111111111112: {
  //   symbol: 'WSOL',
  //   name: 'Wrapped SOL',
  //   mintAddress: 'So11111111111111111111111111111111111111112',
  //   decimals: 9,
  //   referrer: 'AUxC4Y8ns3RmHsjcujZVjv5ioA1LkNfgXPwZjkJT4rz1',
  //   official: true,
  //   showDefault: false
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
  // },
  // '8CZUSdQu5A6jE4oWMVYRZ29QVpYXigostjnYbWjXuCYs': {
  //   symbol: 'CNSOL',
  //   name: 'CNSOL',
  //   mintAddress: '8CZUSdQu5A6jE4oWMVYRZ29QVpYXigostjnYbWjXuCYs',
  //   decimals: 9,
  //   referrer: '',
  //   official: true,
  //   showDefault: true
  // },
  // BVwhuJSmKCTXVCP6y1Vyso46Z8tktD3LBBkBGtcESvji: {
  //   symbol: 'CNUSDC',
  //   name: 'CNUSDC',
  //   mintAddress: 'BVwhuJSmKCTXVCP6y1Vyso46Z8tktD3LBBkBGtcESvji',
  //   decimals: 6,
  //   referrer: '',
  //   official: true,
  //   showDefault: true
  // },
  // '3RudPTAkfcq9Q9Jk8SVeCoecCBmdKMj6q5smsWzxqtqZ': {
  //   symbol: 'pUSDT',
  //   name: 'pUSDT',
  //   mintAddress: '3RudPTAkfcq9Q9Jk8SVeCoecCBmdKMj6q5smsWzxqtqZ',
  //   decimals: 6,
  //   referrer: '',
  //   official: true,
  //   showDefault: true
  // },
  // FgSsGV8GByPaMERxeQJPvZRZHf7zCBhrdYtztKorJS58: {
  //   symbol: 'pUSDC',
  //   name: 'pUSDC',
  //   mintAddress: 'FgSsGV8GByPaMERxeQJPvZRZHf7zCBhrdYtztKorJS58',
  //   decimals: 6,
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
