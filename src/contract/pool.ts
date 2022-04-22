import { TokenSwap } from 'test-crema-sdk'
import { SolanaProvider, Provider } from '@saberhq/solana-contrib'
import { Connection, PublicKey } from '@solana/web3.js'
import { SWAPV3_PROGRAMID } from '@/utils/ids'
import { web3Config } from '@/utils/web3'

export function loadProvider(wallet: any): Provider {
  // const url = 'https://api.devnet.rpcpool.com/2ee3d7c0b48f6c361a06459b1d77'
  const localRpc = window.localStorage.getItem('c-current-rpc')
  let url: string
  if (localRpc) {
    url = localRpc
  } else {
    url = web3Config.rpcs[0].url
  }
  // const url = 'https://stage.devnet.rpcpool.com/2ee3d7c0b48f6c361a06459b1d77'
  // const url = 'https://api.devnet.solana.com'
  const provider = SolanaProvider.init({
    connection: new Connection(url, {
      commitment: 'recent',
      disableRetryOnRateLimit: true,
      confirmTransactionInitialTimeout: 60 * 1000
    }),
    wallet,
    opts: {
      preflightCommitment: 'recent',
      commitment: 'recent'
    }
  })
  return provider
}

export async function loadSwapPair(pairKey: PublicKey, wallet: any): Promise<TokenSwap> {
  const provider = loadProvider(wallet)
  const pair: any = new TokenSwap(provider, SWAPV3_PROGRAMID, pairKey)
  await pair.load()
  return pair
}

export async function fetchSwapPairs(wallet: any) {
  const list = await TokenSwap.fetchSwapPairs(loadProvider(wallet), SWAPV3_PROGRAMID)
  return list
}
