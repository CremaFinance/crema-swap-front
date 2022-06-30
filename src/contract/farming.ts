import {
  clusterApiUrl,
  Connection,
  Keypair,
  PublicKey,
  AccountInfo as BaseAccountInfo,
  Signer,
  TokenAccountsFilter,
  GetProgramAccountsFilter
} from '@solana/web3.js'
import {
  QuarrySDK,
  PositionWrapper,
  findActivityMasterAddress,
  QUARRY_CODERS,
  QUARRY_ADDRESSES,
  MinerData,
  QuarryData,
  Payroll,
  SwapPosition,
  POSITIONS_ACCOUNT_SIZE as SWAP_POSITION_ACCOUNT_SIZE,
  parsePositionsAccount
} from '@cremafinance/crema-farming'
import { AnchorProvider, setProvider, Wallet as AnchorWallet } from '@project-serum/anchor'
import { SignerWallet, SolanaProvider } from '@saberhq/solana-contrib'
import type { AccountInfo } from '@solana/spl-token'
import { AccountLayout, TOKEN_PROGRAM_ID, u64 } from '@solana/spl-token'
import invariant from 'tiny-invariant'
import { currentTs } from './utils'
import { fixD, decimalFormat } from '@/utils'
import { Token, TokenAmount } from '@saberhq/token-utils'
import * as base58 from 'bs58'
import Decimal from 'decimal.js'

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
export async function fetchSwapPositionsByOwner(swapKey: PublicKey, authority: PublicKey, conn, wallet) {
  const positions = await PositionWrapper.fetchSwapPositionsByOwner(swapKey, authority, conn)
  return positions
}

// 获取仓位
export async function fetchSwapPositions(swapKey: PublicKey, connection: Connection): Promise<Array<SwapPosition>> {
  const positionAccounts = await connection.getProgramAccounts(QUARRY_ADDRESSES.CremaSwap, {
    filters: [
      { dataSize: SWAP_POSITION_ACCOUNT_SIZE },
      {
        memcmp: {
          offset: 1,
          bytes: swapKey.toBase58()
        }
      }
    ]
  })
  const swapPositions: any = []
  for (const accountInfo of positionAccounts) {
    const list = parsePositionsAccount(accountInfo.pubkey, accountInfo.account)
    if (list?.data.positions === undefined) continue
    for (const p of list.data.positions) {
      swapPositions.push({
        positionKey: accountInfo.pubkey,
        ...p
      })
    }
  }
  return swapPositions
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

// interface MinerInfo extends MinerData {
//   MinerKey: PublicKey
//   PendingReward: u64
//   BlockTime: u64
//   tokenMintKey: PublicKey
// }
interface QuarryInfo extends QuarryData {
  address: PublicKey
}

// async function fetchQuarries(connection: Connection): Promise<Array<QuarryInfo>> {
//   const filters: Array<GetProgramAccountsFilter> = [
//     {
//       memcmp: {
//         offset: 0,
//         bytes: base58.encode(QUARRY_CODERS.Mine.accounts.quarry.discriminator)
//       }
//     }
//   ]
//   const accounts = await connection.getProgramAccounts(QUARRY_ADDRESSES.Mine, {
//     filters
//   })
//   const quarries: QuarryInfo[] = []
//   accounts.forEach((accountInfo) => {
//     const info = QUARRY_CODERS.Mine.coder.accounts.decode<QuarryData>('Quarry', accountInfo.account.data)
//     console.log('这里的accountInfo#####', accountInfo)
//     console.log('accountInfo.account.data#####', info)
//     quarries.push({
//       address: accountInfo.pubkey,
//       ...info
//     })
//   })
//   return quarries
// }

// interface NewPayroll {
//   payroll: Payroll
//   tokenMintKey: PublicKey
// }

export async function fetchMiners(conn, wallet, authority: PublicKey | null) {
  const sdk = makeSDK(conn, wallet);
  const miners = await getMiners(sdk, authority);
  // printTable(miners);
  return miners
}

// export async function fetchMiners(authority: PublicKey | null, conn) {
//   // const sdk = makeSDK()
//   const quarries = await fetchQuarries(conn)
//   const payrolls: Map<string, NewPayroll> = new Map()
//   quarries.forEach((quarry) => {
//     console.log('fetchMiners###quarry####', quarry)
//     console.log('fetchMiners###quarry####quarry.tokenMintKey.toString()###', quarry.tokenMintKey.toString())
//     payrolls.set(quarry.address.toBase58(), {
//       payroll: new Payroll(
//         quarry.famineTs,
//         quarry.lastUpdateTs,
//         quarry.annualRewardsRate,
//         quarry.rewardsPerTokenStored,
//         quarry.totalTokensDeposited
//       ),
//       tokenMintKey: quarry.tokenMintKey
//     })
//   })
//   const ts = await currentTs(conn)

//   const filters: Array<GetProgramAccountsFilter> = [
//     {
//       memcmp: {
//         offset: 0,
//         bytes: base58.encode(QUARRY_CODERS.Mine.accounts.miner.discriminator)
//       }
//     }
//   ]
//   if (authority !== null) {
//     filters.push({
//       memcmp: {
//         offset: 40,
//         bytes: authority?.toBase58()
//       }
//     })
//   }
//   const accounts = await conn.getProgramAccounts(QUARRY_ADDRESSES.Mine, {
//     filters
//   })

//   const miners: MinerInfo[] = []

//   accounts.forEach((accountInfo) => {
//     const info = QUARRY_CODERS.Mine.coder.accounts.decode<MinerData>('Miner', accountInfo.account.data)
//     const payroll = payrolls.get(info.quarryKey.toBase58())
//     invariant(payroll !== undefined, `The ${info.quarryKey.toBase58()} payroll not found`)
//     miners.push({
//       MinerKey: accountInfo.pubkey,
//       tokenMintKey: payroll.tokenMintKey,
//       PendingReward: payroll.payroll.calculateRewardsEarned(
//         ts,
//         info.balance,
//         info.rewardsPerTokenPaid,
//         info.rewardsEarned
//       ),
//       BlockTime: ts,
//       ...info
//     })
//   })
//   // printTable(miners)
//   return miners
// }

interface MinerInfo extends MinerData {
  MinerKey: PublicKey;
  PendingReward: u64;
  BlockTime: u64;
  tokenMintKey: PublicKey;
}

export async function getQuarries(
  connection: Connection
): Promise<Array<QuarryInfo>> {
  const filters: Array<GetProgramAccountsFilter> = [
    {
      memcmp: {
        offset: 0,
        bytes: base58.encode(QUARRY_CODERS.Mine.accounts.quarry.discriminator),
      },
    },
  ];
  const accounts = await connection.getProgramAccounts(QUARRY_ADDRESSES.Mine, {
    filters,
  });
  const quarries: QuarryInfo[] = [];
  accounts.forEach((accountInfo) => {
    const info = QUARRY_CODERS.Mine.coder.accounts.decode<QuarryData>(
      "Quarry",
      accountInfo.account.data
    );
    quarries.push({
      address: accountInfo.pubkey,
      ...info,
    });
  });
  return quarries;
}

interface NewPayroll {
  payroll: Payroll
  tokenMintKey: PublicKey
}
export async function getMiners(
  sdk: QuarrySDK,
  authority: PublicKey | null
): Promise<Array<MinerInfo>> {
  const quarries = await getQuarries(sdk.provider.connection);
  const payrolls: Map<string, NewPayroll> = new Map();
  quarries.forEach((quarry) => {
    payrolls.set(quarry.address.toBase58(), {
      payroll: new Payroll(
        quarry.famineTs,
        quarry.lastUpdateTs,
        quarry.annualRewardsRate,
        quarry.rewardsPerTokenStored,
        quarry.totalTokensDeposited
      ),
      tokenMintKey: quarry.tokenMintKey
    })
  });
  const ts = await currentTs(sdk.provider.connection);

  const filters: Array<GetProgramAccountsFilter> = [
    {
      memcmp: {
        offset: 0,
        bytes: base58.encode(QUARRY_CODERS.Mine.accounts.miner.discriminator),
      },
    },
  ];
  if (authority !== null) {
    filters.push({
      memcmp: {
        offset: 40,
        bytes: authority?.toBase58(),
      },
    });
  }
  const accounts = await sdk.provider.connection.getProgramAccounts(
    QUARRY_ADDRESSES.Mine,
    {
      filters,
    }
  );

  const miners: MinerInfo[] = [];

  accounts.forEach((accountInfo) => {
    const info = QUARRY_CODERS.Mine.coder.accounts.decode<MinerData>(
      "Miner",
      accountInfo.account.data
    );
    const payroll = payrolls.get(info.quarry.toBase58());
    invariant(
      payroll !== undefined,
      `The ${info.quarry.toBase58()} payroll not found`
    );
    miners.push({
      MinerKey: accountInfo.pubkey,
      tokenMintKey: payroll.tokenMintKey,
      PendingReward: payroll.payroll.calculateRewardsEarned(
        ts,
        info.balance,
        info.rewardsPerTokenPaid,
        info.rewardsEarned
      ),
      BlockTime: ts,
      ...info,
    });
  });

  return miners;
}

export async function fetchCremaSwaps(swapList: PublicKey[], conn) {
  // const sdk = makeSDK();
  console.log('这里进来了吗##fetchCremaSwaps##')
  const list = await PositionWrapper.fetchCremaSwaps(
    swapList,
    conn
    // sdk.provider.connection
  )
  for (let i = 0; i < swapList.length; i++) {
    const swap = list[i]
    if (swap === null || swap === undefined) {
      console.log('CremaSwap %s not foundl', swapList[i]?.toBase58())
      return
    }
    const data = {
      ...swap,
      currentPrice: swap.currentSqrtPrice.pow(2)
    }
    return data
    // printObjectTable(data)
  }
}

// 获取池子信息(获取reward range等)
export async function fetchPositionWrapper(conn, wallet, wrapper: PublicKey) {
  // const sdk = makeSDK(conn, wallet)
  const info = await PositionWrapper.fetchPositionWrapper(wrapper, conn)
  if (info === null) {
    console.log('PositionWrapper %s not found', wrapper.toBase58())
    return
  }
  // printObjectTable(info)
  return info
}

// 获取已质押的池子列表
export async function fetchStakedPositions(conn: any, wrapper: PublicKey, owner: PublicKey) {
  const positions = await PositionWrapper.fetchStakePositions(wrapper, owner, conn)
  return positions
}

export async function calculateWrapAmount(conn: any, wallet: any, wrapper: PublicKey, nftMint: PublicKey) {
  const sdk = makeSDK(conn, wallet)
  const wrapperInfo = await PositionWrapper.fetchPositionWrapper(wrapper, sdk.provider.connection)
  invariant(wrapperInfo !== null, 'wrapper not found')

  const positionInfo = await PositionWrapper.fetchSwapPositionByNFT(
    wrapperInfo.swapKey,
    nftMint,
    sdk.provider.connection
  )
  invariant(positionInfo !== null, 'The swap position not found')

  const amount = PositionWrapper.calculateWrapAmount(wrapperInfo, positionInfo)

  console.log(amount.toString())
  return amount
}

// activity
export async function fetchCremakeys(conn: any, wallet: any, user: PublicKey) {
  const sdk = makeSDK(conn, wallet)
  const info = await sdk.activity.fetchCremaKeysV2(sdk.provider.connection, user)
  console.log('fetchCremakeys###info###', info)
  const result: any = {}
  if (info && info.keys && info.keys.length > 0 && info.meta) {
    const decimals = info.meta.decimals
    const names = info.meta.names
    const crmMint = 'CrMKwgPf5qFmvamgvZ7sdUiK4vYrwaHi9WK5qabJvddS'

    info.keys.forEach(item => {
      const claimAmounts = item.claimAmounts
      const isSecondPartyClaimed = item.isSecondPartyClaimed
      const newObj: any = {}

      console.log('开启宝箱crm不展示问题测试###', item.mint, 'item####', item, '###item.crmClaimedAmount###', item.crmClaimedAmount)
      newObj[crmMint] = {
        amount: decimalFormat(new Decimal(item.crmClaimedAmount).div(Math.pow(10, 9)).toString(), 6),
        amountOrigin: item.crmClaimedAmount,
        isSecondPartyClaimed: isSecondPartyClaimed.get(crmMint),
        name: 'crm'
      }

      claimAmounts.forEach((value, key) => {
        const decimal = decimals.get(key)
        const amountStr = new Decimal(value).div(Math.pow(10, decimal)).toString()
        const amount = decimalFormat(amountStr, 6)
        newObj[key] = {
          amount,
          amountOrigin: value,
          isSecondPartyClaimed: isSecondPartyClaimed.get(key),
          name: names.get(key)
        }
      })



      const newItem = {
        ...item,
        // claim
        newClaimAmounts: newObj
      }

      if (result[item.degree]) {
        result[item.degree].push(newItem)
      } else {
        result[item.degree] = [newItem]
      }
    })

  }
  return result
}

export async function fetchTransferInfoMap(conn: any, wallet: any) {
  const sdk = makeSDK(conn, wallet)
  const info = await sdk.activity.fetchTransferInfoMap()
  console.log('fetchTransferInfoMap####info###', info)
  const result: any = {}
  if (info && info.names) {
    const names = info.names
    const decimals = info.decimals

    names.forEach((value, key) => {
      result[key] = {
        name: value,
        decimal: decimals.get(key) || 6
      }
    })
    return result
  }
  return {}
}

export async function getMasterPda() {
  const pda = await findActivityMasterAddress()
  return pda
  // printObjectJSON({ activityMaster: pda })
}

export async function fetchActivitymaster(conn: any, wallet: any, master: PublicKey) {
  const sdk = makeSDK(conn, wallet)
  const info = await sdk.activity.fetchActivitymaster(master)
  if (info === null) {
    console.log('Activitymaster %s not found', master.toBase58())
    return null
  }
  return info
  // console.log(typeof UactivityErrors)
  // printObjectTable(info)
}

export async function quarryInfo(conn: any, wallet: any, rewarderKey: PublicKey, tokenMint: PublicKey) {
  const sdk = makeSDK(conn, wallet)
  const rewarder = await sdk.mine.loadRewarderWrapper(rewarderKey)
  const token = await Token.load(sdk.provider.connection, tokenMint)
  invariant(token !== null, 'The token is null')
  const quarry = await rewarder.getQuarry(token)
  const info = quarry.quarryData
  const ts = await currentTs(sdk.provider.connection)
  // printObjectTable({
  //   quarry: quarry.key.toBase58(),
  //   rewardPerToken: quarry.payroll.calculateRewardPerToken(ts).toString(),
  //   ...info
  // })
  return {
    quarry: quarry.key.toBase58(),
    rewardPerToken: quarry.payroll.calculateRewardPerToken(ts).toString(),
    ...info
  }
}
