
import type {
  Provider
} from '@saberhq/solana-contrib'
import { SolanaProvider } from '@saberhq/solana-contrib'
import { Connection, PublicKey, GetProgramAccountsFilter } from '@solana/web3.js'
import { QuarrySDK, QUARRY_ADDRESSES, QUARRY_CODERS, MergePoolData, QuarryData, MinerData, Payroll, PositionWrapper } from '@cremafinance/crema-farming'
import { AnchorProvider, setProvider } from "@project-serum/anchor";
import { u64 } from '@solana/spl-token'
import base58 from "bs58"
import invariant from 'tiny-invariant'
import { web3Config } from '@/utils/web3'
import { currentTs } from './utils'

export function loadProvider(wallet: any): Provider {
  const localRpc = window.localStorage.getItem('c-current-rpc')
  let url: string
  if (localRpc) {
    url = localRpc
  } else {
    url = web3Config.rpcs[0].url
  }

  const provider = SolanaProvider.init({
    connection: new Connection(url, {
      commitment: "recent",
      disableRetryOnRateLimit: true,
      confirmTransactionInitialTimeout: 60 * 1000,
    }),
    wallet,
    opts: {
      preflightCommitment: "recent",
      commitment: "recent",
    },
  });
  console.log('farmingv2###provider###', provider)
  return provider;
}

export function makeSDK(wallet: any): QuarrySDK {
  const localRpc = window.localStorage.getItem('c-current-rpc')
  let url: string
  if (localRpc) {
    url = localRpc
  } else {
    url = web3Config.rpcs[0].url
  }

  const anchorProvider = new AnchorProvider(new Connection(url), wallet, {
    preflightCommitment: "recent",
    commitment: "recent",
  })
  setProvider(anchorProvider)

  const provider = loadProvider(wallet)
  console.log('makeSDK###provider####', provider)
  return QuarrySDK.load({
    provider
  })
}

export async function fetchMergePools(wallet: any) {
  const sdk = makeSDK(wallet);
  const accounts = await sdk.provider.connection.getProgramAccounts(
    QUARRY_ADDRESSES.MergeMine,
    {
      filters: [
        {
          memcmp: {
            offset: 0,
            bytes: base58.encode(
              QUARRY_CODERS.MergeMine.accounts.mergePool.discriminator
            ),
          },
        },
      ],
    }
  );

  // const list: any = [];
  const mergePoolObj: any = {}

  accounts.forEach((accountInfo) => {
    const pool = QUARRY_CODERS.MergeMine.coder.accounts.decode<MergePoolData>(
      "MergePool",
      accountInfo.account.data
    );

    mergePoolObj[accountInfo.pubkey.toBase58()] = {
      mergePoolKey: accountInfo.pubkey.toBase58(),
      primaryMint: pool.primaryMint.toBase58(),
      replicaMint: pool.replicaMint.toBase58(),
      mmCount: pool.mmCount.toNumber(),
      totalPrimaryBalance: pool.totalPrimaryBalance,
      totalReplicaBalance: pool.totalReplicaBalance,
    }

  });

  // printTable(list);
  console.log('fetchMergePools####', mergePoolObj)
  return mergePoolObj

}

interface QuarryInfo extends QuarryData {
  address: PublicKey;
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

export async function fetchMiners(wallet, authority: PublicKey | null) {
  const sdk = makeSDK(wallet);
  const miners = await getMiners(sdk, authority);
  // printTable(miners);
  return miners
}

interface MinerInfo extends MinerData {
  MinerKey: PublicKey;
  PendingReward: u64;
  BlockTime: u64;
}

export async function getMiners(
  sdk: QuarrySDK,
  authority: PublicKey | null
): Promise<Array<MinerInfo>> {
  const quarries = await getQuarries(sdk.provider.connection);
  const payrolls: Map<string, Payroll> = new Map();
  quarries.forEach((quarry) => {
    payrolls.set(
      quarry.address.toBase58(),
      new Payroll(
        quarry.famineTs,
        quarry.lastUpdateTs,
        quarry.annualRewardsRate,
        quarry.rewardsPerTokenStored,
        quarry.totalTokensDeposited
      )
    );
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
      PendingReward: payroll.calculateRewardsEarned(
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

export async function fetchWrappers(conn: any) {
  // try {
  const wrappers = await PositionWrapper.fetchWrappers(conn);
  // console.log('getWrappers####wrappers####', wrappers)
  return wrappers
  // } catch (err) {
  //   console.log('fetchWrappers###error###', err)
  // }

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

// 获取池子中我的仓位
export async function fetchSwapPositionsByOwner(swapKey: PublicKey, authority: PublicKey, conn, wallet) {
  const positions = await PositionWrapper.fetchSwapPositionsByOwner(swapKey, authority, conn)
  return positions
}

// 获取已质押的池子列表
export async function fetchStakedPositions(conn: any, wrapper: PublicKey, owner: PublicKey) {
  const positions = await PositionWrapper.fetchStakePositions(wrapper, owner, conn)
  return positions
}

export async function fetchMergeMiner(wallet: any, mpKey: PublicKey, owner: PublicKey | undefined) {
  const sdk = makeSDK(wallet);
  if (owner === undefined) {
    owner = sdk.provider.wallet.publicKey;
  }
  const mmKey = await sdk.mergeMine.findMergeMinerAddress({
    owner,
    pool: mpKey,
  });
  const mm = await sdk.mergeMine.loadMM({ mmKey });

  const miners = await getMiners(sdk, mmKey);
  console.log('fetchMergeMiner###miners####', miners)

  return miners
}

export async function calculateWrapAmount(wallet: any, wrapper: PublicKey, nftMint: PublicKey) {
  const sdk = makeSDK(wallet);
  const wrapperInfo = await PositionWrapper.fetchPositionWrapper(
    wrapper,
    sdk.provider.connection
  );
  invariant(wrapperInfo !== null, "wrapper not found");

  const positionInfo = await PositionWrapper.fetchSwapPositionByNFT(
    wrapperInfo.swapKey,
    nftMint,
    sdk.provider.connection
  );
  invariant(positionInfo !== null, "The swap position not found");

  const amount = PositionWrapper.calculateWrapAmount(wrapperInfo, positionInfo);
  // const amount = PositionWrapper.calculateWrapAmount(wrapperInfo, positionInfo);

  console.log('toStake###amount###', amount.toString(), '####', amount);
  return amount
}
