/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Numberu64 } from '../tokenSwap'
import * as Layout from '../tokenSwap/layout'
import * as BufferLayout from 'buffer-layout'
import { Connection, PublicKey, SYSVAR_CLOCK_PUBKEY, Transaction, TransactionInstruction } from '@solana/web3.js'
import { createProgramAccountIfNotExist, createTokenAccountIfNotExist, sendTransaction } from '@/utils/web3'
// @ts-ignore
import { nu64, struct, u8, blob } from 'buffer-layout'
import { publicKey, u128, u64 } from '@project-serum/borsh'

import { FarmInfo } from '@/utils/farms'
import {
  TOKEN_PROGRAM_ID
  // STAKE_PROGRAM_ID_H
} from '@/utils/ids'
import { TokenAmount } from '@/utils/safe-math'
import { getStakeUserIdx } from '@/utils/schema'
// import * as schema from '@/utils/schema'
import { CoinGeckoClient } from 'coingecko-api-v3'
// import { StakePoolLayout } from '@/utils/layouts'
// import { claim } from './ido'

// deposit
export async function deposit(
  connection: Connection | undefined | null,
  wallet: any | undefined | null,
  farmInfo: FarmInfo | undefined | null,
  lpAccount: string | undefined | null,
  rewardAccount: string | undefined | null,
  infoAccount: string | undefined | null,
  amount: string | undefined | null
): Promise<string> {
  if (!connection || !wallet) throw new Error('Miss connection')
  if (!farmInfo) throw new Error('Miss pool infomations')
  if (!farmInfo.stakeUserListAccount) throw new Error('Miss pool infomations')
  if (!lpAccount) throw new Error('Miss account infomations')
  if (!amount) throw new Error('Miss amount infomations')

  const transaction = new Transaction()
  const signers: any = []

  const owner = wallet.publicKey

  // if no account, create new one
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const userRewardTokenAccount = await createTokenAccountIfNotExist(
    connection,
    rewardAccount,
    owner,
    farmInfo.reward.mintAddress,
    null,
    transaction,
    signers
  )

  // if no userinfo account, create new one
  const programId = new PublicKey(farmInfo.programId)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // eslint-disable-next-line no-unused-vars
  const userInfoAccount = await createProgramAccountIfNotExist(
    connection,
    infoAccount,
    owner,
    programId,
    null,
    USER_STAKE_INFO_ACCOUNT_LAYOUT,
    transaction,
    signers
  )

  const value = new TokenAmount(amount, farmInfo.lp.decimals, false).wei.toNumber()
  const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
  const STAKE_PROGRAM_ID = new PublicKey('9fLFkrVrBMUS1MieyB1EAdmKcc1DEGTJ7mRLK2NYM3nB')

  const idx: number = await getStakeUserIdx(connection, new PublicKey(farmInfo.stakeUserListAccount), owner)

  transaction.add(
    // depositInstruction(
    //   programId,
    //   new PublicKey(farmInfo.poolId),
    //   new PublicKey(farmInfo.poolAuthority),
    //   userInfoAccount,
    //   wallet.publicKey,
    //   new PublicKey(lpAccount),
    //   new PublicKey(farmInfo.poolLpTokenAccount),
    //   userRewardTokenAccount,
    //   new PublicKey(farmInfo.poolRewardTokenAccount),
    //   value
    // )
    depositInstructionNew(
      new PublicKey(farmInfo.poolId),
      // userList
      new PublicKey(farmInfo.stakeUserListAccount),
      // user
      new PublicKey(lpAccount),
      // userOwner
      owner,
      new PublicKey(farmInfo.poolLpTokenAccount),
      STAKE_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      owner,
      // authority, // authority
      new PublicKey(farmInfo.poolAuthority),
      value,
      idx
    )
  )

  return await sendTransaction(connection, wallet, transaction, signers)
}

// depositV4
export async function depositV4(
  connection: Connection | undefined | null,
  wallet: any | undefined | null,
  farmInfo: FarmInfo | undefined | null,
  lpAccount: string | undefined | null,
  rewardAccount: string | undefined | null,
  rewardAccountB: string | undefined | null,
  infoAccount: string | undefined | null,
  amount: string | undefined | null
): Promise<string> {
  if (!connection || !wallet) throw new Error('Miss connection')
  if (!farmInfo) throw new Error('Miss pool infomations')
  if (!lpAccount) throw new Error('Miss account infomations')
  if (!amount) throw new Error('Miss amount infomations')

  const transaction = new Transaction()
  const signers: any = []

  const owner = wallet.publicKey

  // if no account, create new one
  const userRewardTokenAccount = await createTokenAccountIfNotExist(
    connection,
    rewardAccount,
    owner,
    farmInfo.reward.mintAddress,
    null,
    transaction,
    signers
  )

  // if no account, create new one
  const userRewardTokenAccountB = await createTokenAccountIfNotExist(
    connection,
    rewardAccountB,
    owner,
    // @ts-ignore
    farmInfo.rewardB.mintAddress,
    null,
    transaction,
    signers
  )

  // if no userinfo account, create new one
  const programId = new PublicKey(farmInfo.programId)
  const userInfoAccount = await createProgramAccountIfNotExist(
    connection,
    infoAccount,
    owner,
    programId,
    null,
    USER_STAKE_INFO_ACCOUNT_LAYOUT_V4,
    transaction,
    signers
  )

  const value = new TokenAmount(amount, farmInfo.lp.decimals, false).wei.toNumber()

  transaction.add(
    depositInstructionV4(
      programId,
      new PublicKey(farmInfo.poolId),
      new PublicKey(farmInfo.poolAuthority),
      userInfoAccount,
      wallet.publicKey,
      new PublicKey(lpAccount),
      new PublicKey(farmInfo.poolLpTokenAccount),
      userRewardTokenAccount,
      new PublicKey(farmInfo.poolRewardTokenAccount),
      userRewardTokenAccountB,
      // @ts-ignore
      new PublicKey(farmInfo.poolRewardTokenAccountB),
      value
    )
  )

  return await sendTransaction(connection, wallet, transaction, signers)
}

// withdraw
export async function withdraw(
  connection: Connection | undefined | null,
  wallet: any | undefined | null,
  farmInfo: FarmInfo | undefined | null,
  lpAccount: string | undefined | null,
  rewardAccount: string | undefined | null,
  infoAccount: string | undefined | null,
  amount: string | undefined | null
): Promise<string> {
  // console.log('withdraw######connection####', connection)
  // console.log('withdraw######wallet####', wallet)
  // console.log('withdraw######farmInfo####', farmInfo)
  // console.log('withdraw######lpAccount####', lpAccount)
  // console.log('withdraw######rewardAccount####', rewardAccount)
  // console.log('withdraw######infoAccount####', infoAccount)
  // console.log('withdraw######amount####', amount)

  if (!connection || !wallet) throw new Error('Miss connection')
  if (!farmInfo) throw new Error('Miss pool infomations')
  if (!farmInfo.stakeUserListAccount) throw new Error('Miss pool infomations')

  // if (!lpAccount || !infoAccount) throw new Error('Miss account infomations')
  if (!lpAccount) throw new Error('Miss account infomations')
  if (!amount) throw new Error('Miss amount infomations')

  const transaction = new Transaction()
  const signers: any = []

  const owner = wallet.publicKey

  // if no account, create new one
  // const userRewardTokenAccount = await createTokenAccountIfNotExist(
  //   connection,
  //   rewardAccount,
  //   owner,
  //   farmInfo.reward.mintAddress,
  //   null,
  //   transaction,
  //   signers
  // )

  // const programId = new PublicKey(farmInfo.programId)
  const value = new TokenAmount(amount, farmInfo.lp.decimals, false).wei.toNumber()

  const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
  const STAKE_PROGRAM_ID = new PublicKey('9fLFkrVrBMUS1MieyB1EAdmKcc1DEGTJ7mRLK2NYM3nB')
  // const stakeUserListAccount = new PublicKey('J7dnXpEVBjyj5YvoEGQaK2MFdodPWsiRNQDM7nLqNgJC')
  // const authority = new PublicKey('DtmmeUpmkLuaJK9vhaCBZJ8EVmM5YcabQCNHCQd8yLxH')

  const idx: number = await getStakeUserIdx(connection, new PublicKey(farmInfo.stakeUserListAccount), owner)

  transaction.add(
    // withdrawInstruction(
    //   programId,
    //   new PublicKey(farmInfo.poolId),
    //   new PublicKey(farmInfo.poolAuthority),
    //   new PublicKey(infoAccount),
    //   wallet.publicKey,
    //   new PublicKey(lpAccount),
    //   new PublicKey(farmInfo.poolLpTokenAccount),
    //   userRewardTokenAccount,
    //   new PublicKey(farmInfo.poolRewardTokenAccount),
    //   value
    // )
    withdrawInstructionNew(
      new PublicKey(farmInfo.poolId),
      // userList
      // stakeUserListAccount,
      new PublicKey(farmInfo.stakeUserListAccount),
      // user
      new PublicKey(lpAccount),
      // userOwner
      owner,
      new PublicKey(farmInfo.poolLpTokenAccount),
      STAKE_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      // authority, // authority
      new PublicKey(farmInfo.poolAuthority),
      value,
      idx
    )
  )

  return await sendTransaction(connection, wallet, transaction, signers)
}

// withdrawV4
export async function withdrawV4(
  connection: Connection | undefined | null,
  wallet: any | undefined | null,
  farmInfo: FarmInfo | undefined | null,
  lpAccount: string | undefined | null,
  rewardAccount: string | undefined | null,
  rewardAccountB: string | undefined | null,
  infoAccount: string | undefined | null,
  amount: string | undefined | null
): Promise<string> {
  if (!connection || !wallet) throw new Error('Miss connection')
  if (!farmInfo) throw new Error('Miss pool infomations')
  if (!lpAccount || !infoAccount) throw new Error('Miss account infomations')
  if (!amount) throw new Error('Miss amount infomations')

  const transaction = new Transaction()
  const signers: any = []

  const owner = wallet.publicKey

  // if no account, create new one
  const userRewardTokenAccount = await createTokenAccountIfNotExist(
    connection,
    rewardAccount,
    owner,
    farmInfo.reward.mintAddress,
    null,
    transaction,
    signers
  )

  // if no account, create new one
  const userRewardTokenAccountB = await createTokenAccountIfNotExist(
    connection,
    rewardAccountB,
    owner,
    // @ts-ignore
    farmInfo.rewardB.mintAddress,
    null,
    transaction,
    signers
  )

  const programId = new PublicKey(farmInfo.programId)
  const value = new TokenAmount(amount, farmInfo.lp.decimals, false).wei.toNumber()

  transaction.add(
    withdrawInstructionV4(
      programId,
      new PublicKey(farmInfo.poolId),
      new PublicKey(farmInfo.poolAuthority),
      new PublicKey(infoAccount),
      wallet.publicKey,
      new PublicKey(lpAccount),
      new PublicKey(farmInfo.poolLpTokenAccount),
      userRewardTokenAccount,
      new PublicKey(farmInfo.poolRewardTokenAccount),
      userRewardTokenAccountB,
      // @ts-ignore
      new PublicKey(farmInfo.poolRewardTokenAccountB),
      value
    )
  )

  return await sendTransaction(connection, wallet, transaction, signers)
}

// claim
export async function claim(
  connection: Connection | undefined | null,
  wallet: any | undefined | null,
  farmInfo: FarmInfo | undefined | null,
  rewardAccount: string | undefined | null
): Promise<string> {
  if (!connection || !wallet) throw new Error('Miss connection')
  if (!farmInfo) throw new Error('Miss pool infomations')
  if (!farmInfo.stakeUserListAccount) throw new Error('Miss pool infomations')
  if (!rewardAccount) throw new Error('Miss account infomations')

  const transaction = new Transaction()
  const signers: any = []

  const owner = wallet.publicKey
  const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
  const STAKE_PROGRAM_ID = new PublicKey('9fLFkrVrBMUS1MieyB1EAdmKcc1DEGTJ7mRLK2NYM3nB')

  const idx: number = await getStakeUserIdx(connection, new PublicKey(farmInfo.stakeUserListAccount), owner)

  transaction.add(
    claimInstruction(
      STAKE_PROGRAM_ID,
      new PublicKey(farmInfo.poolId),
      // userList
      new PublicKey(farmInfo.stakeUserListAccount),
      // user
      new PublicKey(rewardAccount),
      owner,
      new PublicKey(farmInfo.poolRewardTokenAccount),
      new PublicKey(farmInfo.poolAuthority),
      TOKEN_PROGRAM_ID,
      idx
    )
  )

  return await sendTransaction(connection, wallet, transaction, signers)
}

export function claimInstruction(
  programId: PublicKey,
  stakePool: PublicKey,
  userList: PublicKey,
  user: PublicKey,
  userStakeAccount: PublicKey,
  rewardToken: PublicKey,
  authority: PublicKey,
  tokenProgramId: PublicKey,
  idx: number
): TransactionInstruction {
  const dataLayout = BufferLayout.struct([BufferLayout.u8('instruction'), BufferLayout.u32('idx')])

  const data = Buffer.alloc(dataLayout.span)
  dataLayout.encode(
    {
      instruction: 4, // Withdraw instruction
      idx
    },
    data
  )
  const clockId = new PublicKey('SysvarC1ock11111111111111111111111111111111')
  const keys = [
    { pubkey: stakePool, isSigner: false, isWritable: true },
    { pubkey: user, isSigner: false, isWritable: true },
    { pubkey: userStakeAccount, isSigner: false, isWritable: false },
    { pubkey: userList, isSigner: false, isWritable: true },
    { pubkey: rewardToken, isSigner: false, isWritable: true },
    { pubkey: authority, isSigner: false, isWritable: false },
    { pubkey: tokenProgramId, isSigner: false, isWritable: false },
    { pubkey: clockId, isSigner: false, isWritable: false }
  ]
  return new TransactionInstruction({
    keys,
    programId,
    data
  })
}

export function depositInstructionNew(
  stakePool: PublicKey,
  userList: PublicKey,
  user: PublicKey,
  userOwner: PublicKey,
  stakePoolTokenAccount: PublicKey,
  programId: PublicKey,
  tokenProgramId: PublicKey,
  userTransferAuthority: PublicKey,
  authority: PublicKey,
  amount: number | Numberu64,
  idx: number
): TransactionInstruction {
  const dataLayout = BufferLayout.struct([
    BufferLayout.u8('instruction'),
    Layout.uint64('amount'),
    BufferLayout.u32('idx')
  ])

  const data = Buffer.alloc(dataLayout.span)
  dataLayout.encode(
    {
      instruction: 2, // Deposit instruction
      amount: new Numberu64(amount).toBuffer(),
      idx
    },
    data
  )
  const clockId = new PublicKey('SysvarC1ock11111111111111111111111111111111')
  const keys = [
    { pubkey: stakePool, isSigner: false, isWritable: true },
    { pubkey: userList, isSigner: false, isWritable: true },
    { pubkey: user, isSigner: false, isWritable: true },
    { pubkey: userOwner, isSigner: false, isWritable: false },
    { pubkey: stakePoolTokenAccount, isSigner: false, isWritable: true },
    { pubkey: authority, isSigner: false, isWritable: false },
    { pubkey: userTransferAuthority, isSigner: true, isWritable: false },
    { pubkey: tokenProgramId, isSigner: false, isWritable: false },
    { pubkey: clockId, isSigner: false, isWritable: false }
  ]
  return new TransactionInstruction({
    keys,
    programId,
    data
  })
}

export function depositInstruction(
  programId: PublicKey,
  // staking pool
  poolId: PublicKey,
  poolAuthority: PublicKey,
  // user
  userInfoAccount: PublicKey,
  userOwner: PublicKey,
  userLpTokenAccount: PublicKey,
  poolLpTokenAccount: PublicKey,
  userRewardTokenAccount: PublicKey,
  poolRewardTokenAccount: PublicKey,
  // tokenProgramId: PublicKey,
  amount: number
): TransactionInstruction {
  const dataLayout = struct([u8('instruction'), nu64('amount')])

  const keys = [
    { pubkey: poolId, isSigner: false, isWritable: true },
    { pubkey: poolAuthority, isSigner: false, isWritable: true },
    { pubkey: userInfoAccount, isSigner: false, isWritable: true },
    { pubkey: userOwner, isSigner: true, isWritable: true },
    { pubkey: userLpTokenAccount, isSigner: false, isWritable: true },
    { pubkey: poolLpTokenAccount, isSigner: false, isWritable: true },
    { pubkey: userRewardTokenAccount, isSigner: false, isWritable: true },
    { pubkey: poolRewardTokenAccount, isSigner: false, isWritable: true },
    { pubkey: SYSVAR_CLOCK_PUBKEY, isSigner: false, isWritable: true },
    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: true }
  ]

  const data = Buffer.alloc(dataLayout.span)
  dataLayout.encode(
    {
      instruction: 1,
      amount
    },
    data
  )

  return new TransactionInstruction({
    keys,
    programId,
    data
  })
}

export function depositInstructionV4(
  programId: PublicKey,
  // staking pool
  poolId: PublicKey,
  poolAuthority: PublicKey,
  // user
  userInfoAccount: PublicKey,
  userOwner: PublicKey,
  userLpTokenAccount: PublicKey,
  poolLpTokenAccount: PublicKey,
  userRewardTokenAccount: PublicKey,
  poolRewardTokenAccount: PublicKey,
  userRewardTokenAccountB: PublicKey,
  poolRewardTokenAccountB: PublicKey,
  // tokenProgramId: PublicKey,
  amount: number
): TransactionInstruction {
  const dataLayout = struct([u8('instruction'), nu64('amount')])

  const keys = [
    { pubkey: poolId, isSigner: false, isWritable: true },
    { pubkey: poolAuthority, isSigner: false, isWritable: true },
    { pubkey: userInfoAccount, isSigner: false, isWritable: true },
    { pubkey: userOwner, isSigner: true, isWritable: true },
    { pubkey: userLpTokenAccount, isSigner: false, isWritable: true },
    { pubkey: poolLpTokenAccount, isSigner: false, isWritable: true },
    { pubkey: userRewardTokenAccount, isSigner: false, isWritable: true },
    { pubkey: poolRewardTokenAccount, isSigner: false, isWritable: true },
    { pubkey: SYSVAR_CLOCK_PUBKEY, isSigner: false, isWritable: true },
    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: true },
    { pubkey: userRewardTokenAccountB, isSigner: false, isWritable: true },
    { pubkey: poolRewardTokenAccountB, isSigner: false, isWritable: true }
  ]

  const data = Buffer.alloc(dataLayout.span)
  dataLayout.encode(
    {
      instruction: 1,
      amount
    },
    data
  )

  return new TransactionInstruction({
    keys,
    programId,
    data
  })
}

export function withdrawInstructionNew(
  stakePool: PublicKey,
  userList: PublicKey,
  user: PublicKey,
  userOwner: PublicKey,
  stakePoolTokenAccount: PublicKey,
  programId: PublicKey,
  tokenProgramId: PublicKey,
  authority: PublicKey,
  amount: number | Numberu64,
  idx: number
): TransactionInstruction {
  const dataLayout = BufferLayout.struct([
    BufferLayout.u8('instruction'),
    Layout.uint64('amount'),
    BufferLayout.u32('idx')
  ])

  const data = Buffer.alloc(dataLayout.span)
  dataLayout.encode(
    {
      instruction: 3, // Withdraw instruction
      amount: new Numberu64(amount).toBuffer(),
      idx
    },
    data
  )
  const clockId = new PublicKey('SysvarC1ock11111111111111111111111111111111')
  const keys = [
    { pubkey: stakePool, isSigner: false, isWritable: true },
    { pubkey: user, isSigner: false, isWritable: true },
    { pubkey: userOwner, isSigner: false, isWritable: false },
    { pubkey: userList, isSigner: false, isWritable: true },
    { pubkey: stakePoolTokenAccount, isSigner: false, isWritable: true },
    { pubkey: authority, isSigner: false, isWritable: false },
    { pubkey: tokenProgramId, isSigner: false, isWritable: false },
    { pubkey: clockId, isSigner: false, isWritable: false }
  ]
  return new TransactionInstruction({
    keys,
    programId,
    data
  })
}

export function withdrawInstruction(
  programId: PublicKey,
  // staking pool
  poolId: PublicKey,
  poolAuthority: PublicKey,
  // user
  userInfoAccount: PublicKey,
  userOwner: PublicKey,
  userLpTokenAccount: PublicKey,
  poolLpTokenAccount: PublicKey,
  userRewardTokenAccount: PublicKey,
  poolRewardTokenAccount: PublicKey,
  // tokenProgramId: PublicKey,
  amount: number
): TransactionInstruction {
  const dataLayout = struct([u8('instruction'), nu64('amount')])

  const keys = [
    { pubkey: poolId, isSigner: false, isWritable: true },
    { pubkey: poolAuthority, isSigner: false, isWritable: true },
    { pubkey: userInfoAccount, isSigner: false, isWritable: true },
    { pubkey: userOwner, isSigner: true, isWritable: true },
    { pubkey: userLpTokenAccount, isSigner: false, isWritable: true },
    { pubkey: poolLpTokenAccount, isSigner: false, isWritable: true },
    { pubkey: userRewardTokenAccount, isSigner: false, isWritable: true },
    { pubkey: poolRewardTokenAccount, isSigner: false, isWritable: true },
    { pubkey: SYSVAR_CLOCK_PUBKEY, isSigner: false, isWritable: true },
    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: true }
  ]

  const data = Buffer.alloc(dataLayout.span)
  dataLayout.encode(
    {
      instruction: 2,
      amount
    },
    data
  )

  return new TransactionInstruction({
    keys,
    programId,
    data
  })
}

export function withdrawInstructionV4(
  programId: PublicKey,
  // staking pool
  poolId: PublicKey,
  poolAuthority: PublicKey,
  // user
  userInfoAccount: PublicKey,
  userOwner: PublicKey,
  userLpTokenAccount: PublicKey,
  poolLpTokenAccount: PublicKey,
  userRewardTokenAccount: PublicKey,
  poolRewardTokenAccount: PublicKey,
  userRewardTokenAccountB: PublicKey,
  poolRewardTokenAccountB: PublicKey,
  // tokenProgramId: PublicKey,
  amount: number
): TransactionInstruction {
  const dataLayout = struct([u8('instruction'), nu64('amount')])

  const keys = [
    { pubkey: poolId, isSigner: false, isWritable: true },
    { pubkey: poolAuthority, isSigner: false, isWritable: true },
    { pubkey: userInfoAccount, isSigner: false, isWritable: true },
    { pubkey: userOwner, isSigner: true, isWritable: true },
    { pubkey: userLpTokenAccount, isSigner: false, isWritable: true },
    { pubkey: poolLpTokenAccount, isSigner: false, isWritable: true },
    { pubkey: userRewardTokenAccount, isSigner: false, isWritable: true },
    { pubkey: poolRewardTokenAccount, isSigner: false, isWritable: true },
    { pubkey: SYSVAR_CLOCK_PUBKEY, isSigner: false, isWritable: true },
    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: true },
    { pubkey: userRewardTokenAccountB, isSigner: false, isWritable: true },
    { pubkey: poolRewardTokenAccountB, isSigner: false, isWritable: true }
  ]

  const data = Buffer.alloc(dataLayout.span)
  dataLayout.encode(
    {
      instruction: 2,
      amount
    },
    data
  )

  return new TransactionInstruction({
    keys,
    programId,
    data
  })
}

export const STAKE_INFO_LAYOUT = struct([
  u64('state'),
  u64('nonce'),
  publicKey('poolLpTokenAccount'),
  publicKey('poolRewardTokenAccount'),
  publicKey('owner'),
  publicKey('feeOwner'),
  u64('feeY'),
  u64('feeX'),
  u64('totalReward'),
  u128('rewardPerShareNet'),
  u64('lastBlock'),
  u64('rewardPerBlock')
])

export const STAKE_INFO_LAYOUT_V4 = struct([
  u64('state'),
  u64('nonce'),
  publicKey('poolLpTokenAccount'),
  publicKey('poolRewardTokenAccount'),
  u64('totalReward'),
  u128('perShare'),
  u64('perBlock'),
  u8('option'),
  publicKey('poolRewardTokenAccountB'),
  blob(7),
  u64('totalRewardB'),
  u128('perShareB'),
  u64('perBlockB'),
  u64('lastBlock'),
  publicKey('owner')
])

export const USER_STAKE_INFO_ACCOUNT_LAYOUT = struct([
  u64('state'),
  publicKey('poolId'),
  publicKey('stakerOwner'),
  u64('depositBalance'),
  u64('rewardDebt')
])

export const USER_STAKE_INFO_ACCOUNT_LAYOUT_V4 = struct([
  u64('state'),
  publicKey('poolId'),
  publicKey('stakerOwner'),
  u64('depositBalance'),
  u64('rewardDebt'),
  u64('rewardDebtB')
])

export async function getStakeAccountInfo(connection: Connection, address: PublicKey, programId: PublicKey) {
  const accountInfo = await connection.getAccountInfo(address)
  if (accountInfo === null) {
    throw new Error('Failed to find account')
  }

  if (!accountInfo.owner.equals(programId)) {
    throw new Error(`Invalid owner: ${JSON.stringify(accountInfo.owner)}`)
  }

  return Buffer.from(accountInfo.data)
}

export async function getReward(connection: any, userinfo: any, stakePool: any) {
  let reward = 0
  // const userinfo = await schema.getStakeUserAccountInfo(connection, stakeUserListAccount, userKey)
  // const stakePoolBuffer = await getStakeAccountInfo(connection, poolId, new PublicKey(STAKE_PROGRAM_ID_H))
  // const stakePool = StakePoolLayout.decode(stakePoolBuffer)

  // eslint-disable-next-line camelcase
  const acc_share_numerator = stakePool.acc_share_numerator.toNumber()
  // eslint-disable-next-line camelcase
  const acc_share_dominator = stakePool.acc_share_dominator.toNumber()
  const curruntSlot = await connection.getSlot()
  const lastSlot = stakePool.last_reward_slot
  // eslint-disable-next-line camelcase
  const delta_slot = curruntSlot - lastSlot.toNumber()
  if (userinfo != null) {
    if (
      // eslint-disable-next-line eqeqeq
      userinfo.rewardDebt != undefined &&
      // eslint-disable-next-line eqeqeq
      userinfo.stakeAmount != undefined &&
      // eslint-disable-next-line eqeqeq
      userinfo.stakeAmount != undefined
    ) {
      // eslint-disable-next-line camelcase
      let reward_debt = userinfo.rewardDebt.toNumber()
      // eslint-disable-next-line eqeqeq
      if (userinfo.sigend == 0) {
        // eslint-disable-next-line camelcase
        reward_debt = 0 - reward_debt
      }
      // reward =
      //   // eslint-disable-next-line camelcase
      //   (acc_share_numerator / acc_share_dominator) * userinfo.stakeAmount.toNumber() +
      //   // eslint-disable-next-line camelcase
      //   (stakePool.acc_point.toNumber() * delta_slot * userinfo.stakeAmount.toNumber()) /
      //     stakePool.total_amount?.toNumber() -
      //   // eslint-disable-next-line camelcase
      //   reward_debt
      // console.log('stakePool######', stakePool)
      // console.log('reward####acc_share_numerator####', acc_share_numerator)
      // console.log('reward####acc_share_dominator####', acc_share_dominator)
      // console.log('reward####userinfo.stakeAmount####', userinfo.stakeAmount.toNumber())
      // console.log('reward####stakePool.acc_point.toNumber()####', stakePool.acc_point.toNumber())
      // console.log('reward####stakePool.stake_total_amount.toNumber()####', stakePool.stake_total_amount.toNumber())
      // console.log('reward####reward_debt####', reward_debt)
      // console.log('reward####delta_slot####', delta_slot)
      reward =
        // eslint-disable-next-line camelcase
        (acc_share_numerator / acc_share_dominator) * userinfo.stakeAmount.toNumber() +
        // eslint-disable-next-line camelcase
        (stakePool.acc_point.toNumber() * delta_slot * userinfo.stakeAmount.toNumber()) /
          stakePool.stake_total_amount.toNumber() -
        // eslint-disable-next-line camelcase
        reward_debt
    }
  }
  return { myreward: reward, stakeAmount: userinfo?.stakeAmount }
}

export async function getprice(ids: string): Promise<number> {
  const client = new CoinGeckoClient({
    timeout: 10000,
    autoRetry: true
  })
  // eslint-disable-next-line camelcase
  const vs_currencies = 'usd'
  const input = {
    vs_currencies,
    ids
  }
  const price = await client.simplePrice(input)
  const tmp = price[ids]
  return tmp[vs_currencies]
}

export function caculateAPR(
  start: number,
  accPoint: number,
  lastUpdateSlot: number,
  currentSlot: number,
  rewardTokenPrice: number,
  totalAmount: number
  // stakeTokenPrice: number
): number {
  // console.log('caculateAPR####start####', start)
  // console.log('caculateAPR####accPoint####', accPoint)
  // console.log('caculateAPR####lastUpdateSlot####', lastUpdateSlot)
  // console.log('caculateAPR####currentSlot####', currentSlot)
  // console.log('caculateAPR####rewardTokenPrice####', rewardTokenPrice)
  // console.log('caculateAPR####totalAmount####', totalAmount)
  // console.log('caculateAPR####stakeTokenPrice####', stakeTokenPrice)

  const deltaSlot = currentSlot - lastUpdateSlot
  const end = Math.floor(Date.now() / 1000)
  // console.log('caculateAPR####end####', end)
  const deltaTime = end - start
  // console.log('caculateAPR####deltaTime####', deltaTime)
  const reward = accPoint * deltaSlot // 单个区块的奖励数量
  const rewardAmount = reward * rewardTokenPrice // 总的奖励价值
  // console.log('rewardAmount#####', rewardAmount)
  // const stakeAmount = totalAmount * stakeTokenPrice // 当前总质押价值
  const rate1 = deltaTime / (24 * 3600 * 365)
  const rate2 = rewardAmount / totalAmount
  const apr = rate2 / rate1

  // console.log('apr####', apr)

  // const apr = (accPoint * (24 * 3600 * 365 * 3) * rewardTokenPrice) / (totalAmount * stakeTokenPrice)
  return apr
}
