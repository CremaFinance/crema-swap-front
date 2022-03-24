import {
  clusterApiUrl,
  Connection,
  Keypair,
  PublicKey,
  AccountInfo as BaseAccountInfo,
  Signer,
  TokenAccountsFilter
} from '@solana/web3.js'
import { QuarrySDK, PositionWrapper } from 'test-quarry-sdk'
import { Provider as AnchorProvider, setProvider, Wallet as AnchorWallet } from '@project-serum/anchor'
import { SignerWallet, SolanaProvider } from '@saberhq/solana-contrib'
import type { AccountInfo } from '@solana/spl-token'
import { AccountLayout, TOKEN_PROGRAM_ID, u64 } from '@solana/spl-token'
import invariant from 'tiny-invariant'
import { currentTs } from './utils'
import { Token, TokenAmount } from '@saberhq/token-utils'

export function makeSDK(conn: any, wallet: any) {
  const anchorProvider = new AnchorProvider(conn, wallet, {
    preflightCommitment: 'recent',
    commitment: 'recent'
  })
  setProvider(anchorProvider)
  const provider = SolanaProvider.init({
    connection: anchorProvider.connection,
    wallet: anchorProvider.wallet,
    opts: anchorProvider.opts
  })
  return QuarrySDK.load({
    provider
  })
}

export function deserializeTokenAccount(account: BaseAccountInfo<Buffer>): AccountInfo {
  invariant(account?.data !== null)
  /*eslint-disable  @typescript-eslint/no-unsafe-call */
  const accountInfo = AccountLayout.decode(account?.data)
  accountInfo.mint = new PublicKey(accountInfo.mint)
  accountInfo.owner = new PublicKey(accountInfo.owner)
  accountInfo.amount = u64.fromBuffer(accountInfo.amount)

  if (accountInfo.delegateOption === 0) {
    accountInfo.delegate = null
    accountInfo.delegatedAmount = new u64(0)
  } else {
    accountInfo.delegate = new PublicKey(accountInfo.delegate)
    accountInfo.delegatedAmount = u64.fromBuffer(accountInfo.delegatedAmount)
  }

  accountInfo.isInitialized = accountInfo.state !== 0
  accountInfo.isFrozen = accountInfo.state === 2

  if (accountInfo.isNativeOption === 1) {
    accountInfo.rentExemptReserve = u64.fromBuffer(accountInfo.isNative)
    accountInfo.isNative = true
  } else {
    accountInfo.rentExemptReserve = null
    accountInfo.isNative = false
  }

  if (accountInfo.closeAuthorityOption === 0) {
    accountInfo.closeAuthority = null
  } else {
    accountInfo.closeAuthority = new PublicKey(accountInfo.closeAuthority)
  }

  /*eslint-disable  @typescript-eslint/no-unsafe-return*/
  return accountInfo
}

export async function getTokenAccountsByOwnerAndMint(
  conn: Connection,
  owner: PublicKey,
  mint: PublicKey
): Promise<Array<AccountInfo>> {
  console.log('getTokenAccountsByOwnerAndMint@@@conn#####', conn)
  console.log('getTokenAccountsByOwnerAndMint@@@owner#####', owner.toString())
  console.log('getTokenAccountsByOwnerAndMint@@@mint#####', mint.toString())
  const filter: TokenAccountsFilter = {
    mint,
    programId: TOKEN_PROGRAM_ID
  }
  const tokenAccounts: Array<AccountInfo> = []
  console.log('resp前####')
  const resp = await conn.getTokenAccountsByOwner(owner, filter)
  console.log('resp####', resp)
  for (const accountInfo of resp.value) {
    const v = deserializeTokenAccount(accountInfo.account)
    v.address = accountInfo.pubkey
    tokenAccounts.push(v)
  }
  return tokenAccounts
}

// 获取池子中我的仓位
export async function fetchSwapPositionsByOwner(swapKey: PublicKey, authority: PublicKey | null, conn, wallet) {
  const sdk = makeSDK(conn, wallet)
  const owner = authority !== null ? authority : sdk.provider.wallet.publicKey
  const positions = await PositionWrapper.fetchSwapPositionsByOwner(swapKey, owner, conn)

  console.log('fetchSwapPositionsByOwner####positions####', positions)
  return positions

  // if (positions.length > 0) {
  //   printTable(positions)
  // } else {
  //   console.log('The position owner of %s not found', owner.toBase58())
  // }
}

// 获取 earned
export async function minerInfo(conn: any, wallet: any, rewarderKey: PublicKey, mint: PublicKey) {
  const sdk = makeSDK(conn, wallet)
  const rewarder = await sdk.mine.loadRewarderWrapper(rewarderKey)
  const token = await Token.load(sdk.provider.connection, mint)
  invariant(token !== null)
  const quarry = await rewarder.getQuarry(token)
  const info = await quarry.getMiner(wallet.publicKey)
  if (info === null) {
    console.log('The miner not found.')
    return
  }
  invariant(info !== null)
  const minerKey = await quarry.getMinerAddress(wallet.publicKey)
  const ts = await currentTs(sdk.provider.connection)
  const reward = quarry.payroll.calculateRewardsEarned(ts, info.balance, info.rewardsPerTokenPaid, info.rewardsEarned)
  // printObjectTable({
  //   MinerKey: minerKey.toBase58(),
  //   PendingReward: reward.toString(),
  //   BlockTime: ts.toString(),
  //   ...info
  // })
  return {
    PendingReward: reward.toString(),
    BlockTime: ts.toString(),
    ...info
  }
}

// 获取池子信息(获取reward range等)
export async function fetchPositionWrapper(conn, wallet, wrapper: PublicKey) {
  const sdk = makeSDK(conn, wallet)
  const info = await PositionWrapper.fetchPositionWrapper(wrapper, conn)
  if (info === null) {
    console.log('PositionWrapper %s not found', wrapper.toBase58())
    return
  }
  // printObjectTable(info)
  return info
}

// 获取已质押的池子列表
export async function fetchStakedPositions(conn: any, wallet: any, wrapper: PublicKey, owner: PublicKey | null) {
  const sdk = makeSDK(conn, wallet)
  const positions = await PositionWrapper.fetchStakePositions(wrapper, owner, conn)
  return positions
  // if (positions.length > 0) {
  //   printTable(positions);
  // } else {
  //   console.log("No position in this wrapper:%s", wrapper.toBase58());
  // }
}

// activity
export async function fetchCremakeys(conn: any, wallet: any, user: PublicKey) {
  const sdk = makeSDK(conn, wallet)
  const info = await sdk.activity.fetchCremaKeys(user)
  return info
}
