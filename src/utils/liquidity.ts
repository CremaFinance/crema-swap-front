import assert from 'assert'
import {
  // nu64,
  struct
  // u8
} from 'buffer-layout'
import * as BufferLayout from 'buffer-layout'
import BN from 'bn.js'
import * as Layout from '../tokenSwap/layout'
import { publicKey, u64, u128 } from '@project-serum/borsh'
import {
  Account,
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
  TransactionSignature,
  Signer,
  Keypair,
  SystemProgram
} from '@solana/web3.js'
import { NATIVE_SOL, TOKENS, TokenInfo, LP_TOKENS, WSOL } from '@/utils/tokens'
import { AccountLayout, NATIVE_MINT, Token, TOKEN_PROGRAM_ID, MintLayout } from '@solana/spl-token'
import { Numberu64, TokenSwap, UserPosition, TokenSwapLayout } from '../tokenSwap'
import { preview_calculate_liqudity, price2tick } from '../tokenSwap/swapv3'
// import { price2tick, tick2price } from './common'
import { createTokenAccountIfNotExist, sendTransaction } from '@/utils/web3'
import { LiquidityPoolInfo } from '@/utils/pools'
import { TokenAmount } from '@/utils/safe-math'
import { loadAccount } from '../tokenSwap/util/account'
import { closeAccount } from '@project-serum/serum/lib/token-instructions'
import { SWAPV3_PROGRAMID } from '@/utils/ids'
import { sendAndConfirmTransaction } from '@/tokenSwap/util/send-and-confirm-transaction'

const USER_POSITION_LENGTH = 360000

const payer = new Account([
  145, 101, 210, 147, 165, 195, 23, 69, 182, 224, 218, 4, 144, 61, 168, 176, 20, 187, 204, 236, 117, 88, 182, 47, 231,
  219, 50, 169, 28, 175, 124, 100, 103, 10, 24, 183, 209, 36, 230, 201, 249, 29, 188, 155, 200, 187, 54, 151, 203, 137,
  135, 31, 160, 75, 250, 72, 225, 22, 173, 88, 38, 147, 165, 53
])

export class Numberu128 extends BN {
  /**
   * Convert to Buffer representation
   */
  toBuffer(): Buffer {
    const a = super.toArray().reverse()
    const b = Buffer.from(a)
    if (b.length === 16) {
      return b
    }
    assert(b.length < 16, 'Numberu128 too large')

    const zeroPad = Buffer.alloc(16)
    b.copy(zeroPad)
    return zeroPad
  }

  /**
   * Construct a Numberu64 from Buffer representation
   */
  static fromBuffer(buffer: Buffer): Numberu128 {
    assert(buffer.length === 16, `Invalid buffer length: ${buffer.length}`)
    return new Numberu128(
      [...buffer]
        .reverse()
        .map((i) => `00${i.toString(16)}`.slice(-2))
        .join(''),
      16
    )
  }
}

export const UserPositionLayout = BufferLayout.struct([
  Layout.publicKey('nft_token_id'),
  BufferLayout.s32('lower_tick'),
  BufferLayout.s32('upper_tick'),
  Layout.uint128('liquity'),
  Layout.uint128('fee_growth_inside_a_last'),
  Layout.uint128('fee_growth_inside_b_last'),
  Layout.uint128('token_a_fee'),
  Layout.uint128('token_b_fee')
])

function getUserPositionIdx(
  nft_pubkey: PublicKey,
  user_position_account_array: any
): { index: number; user_position_pubkey?: PublicKey } {
  for (let i = 0; i < user_position_account_array.length; i++) {
    let length = user_position_account_array[i].user_positions.length
    let user_position_pubkey = user_position_account_array[i].pubkey
    let user_position_array = user_position_account_array[i].user_positions
    for (let j = 0; j < length; j++) {
      if (user_position_array[j].nft_token_id.equals(nft_pubkey)) {
        console.log('there already exist deposit user ', nft_pubkey.toString())
        return { index: j, user_position_pubkey }
      }
    }
  }
  return { index: 0 }
}

function choosePosition(user_position_account_array: any): PublicKey | null {
  for (let i = 0; i < user_position_account_array.length; i++) {
    let length = user_position_account_array[i].user_positions.length
    if (length < USER_POSITION_LENGTH) {
      let user_position_pubkey = user_position_account_array[i].pubkey
      return user_position_pubkey
    }
  }
  return null
}

export async function addLiquidityNew(
  connection: Connection | undefined | null,
  wallet: any | undefined | null,
  poolInfo: any,
  fromCoin: TokenInfo | undefined | null,
  toCoin: TokenInfo | undefined | null,
  userAccountA: PublicKey,
  userAccountB: PublicKey,
  user_mint_pubkey: PublicKey | null,
  user_nft_pubkey: PublicKey | null,
  tick_lower: number,
  tick_upper: number,
  liquity_mount: number | Numberu128 | string,
  maximumTokenA: number | string,
  maximumTokenB: number | string,
  new_position: number,
  fromCoinBalance?: number | string,
  toCoinBalance?: number | string
): Promise<string> {
  console.log('addLiquidityNew####poolInfo###', poolInfo)
  console.log('addLiquidityNew####fromCoin###', fromCoin)
  console.log('addLiquidityNew####toCoin###', toCoin)
  console.log('addLiquidityNew####connection###', connection)
  console.log('addLiquidityNew####wallet###', wallet)
  console.log('addLiquidityNew###userAccountA###', userAccountA)
  console.log('addLiquidityNew###userAccountB###', userAccountB)
  // console.log('addLiquidityNew###userTransferAuthority###', userTransferAuthority)
  console.log('addLiquidityNew###user_mint_pubkey###', user_mint_pubkey)
  console.log('addLiquidityNew###user_nft_pubkey###', user_nft_pubkey)
  console.log('addLiquidityNew###tick_lower###', tick_lower)
  console.log('addLiquidityNew###tick_upper###', tick_upper)
  console.log('addLiquidityNew###liquity_mount###', liquity_mount)
  console.log('addLiquidityNew###maximumTokenA###', maximumTokenA)
  console.log('addLiquidityNew###maximumTokenB###', maximumTokenB)
  // console.log('addLiquidityNew###new_position###', new_position)

  if (!connection || !wallet) throw new Error('Miss connection')
  if (!poolInfo) {
    throw new Error('Miss pool infomations')
  }
  // if (!fromCoinAccount || !toCoinAccount || !poolInfo.tokenSwapAccount) {
  //   throw new Error('Miss account infomations')
  // }
  // if (!liquityAmount) {
  //   throw new Error('Miss liquityAmount')
  // }

  const transaction = new Transaction()
  const signers: any = []

  const owner = wallet.publicKey
  console.log('userAccountA####', userAccountA)
  const userAccounts = [new PublicKey(userAccountA), new PublicKey(userAccountB)]
  const userAmounts = [maximumTokenA, maximumTokenB]
  const balanceAmounts = [fromCoinBalance, toCoinBalance]

  if (poolInfo.coin.mintAddress === toCoin?.mintAddress && poolInfo.pc.mintAddress === fromCoin?.mintAddress) {
    // userAccounts.reverse()
    console.log('是进到这里了吗####')
    userAmounts.reverse()
    balanceAmounts.reverse()
  }

  const userCoinTokenAccount = userAccounts[0]
  const userPcTokenAccount = userAccounts[1]

  let coinAmount: any
  let coinBalance: any

  console.log('poolInfo.coin.decimals####', poolInfo.coin.decimals)
  console.log('poolInfo.pc.decimals####', poolInfo.pc.decimals)
  console.log('userAmounts#######', userAmounts)

  if (userAmounts[0]) {
    // coinAmount = new TokenAmount(userAmounts[0], poolInfo.coin.decimals, false).wei.toNumber()
    coinAmount = userAmounts[0]
    coinBalance = balanceAmounts[0]
  }

  let pcAmount: any
  let pcBalance: any
  if (userAmounts[1]) {
    // pcAmount = new TokenAmount(userAmounts[1], poolInfo.pc.decimals, false).wei.toNumber()
    pcAmount = userAmounts[1]
    pcBalance = balanceAmounts[1]
  }

  console.log('addLiquidityNew###coinAmount####', coinAmount)
  console.log('addLiquidityNew###pcAmount####', pcAmount)

  console.log('addLiquidityNew###coinBalance####', coinAmount)
  console.log('addLiquidityNew###pcBalance####', pcBalance)

  let wrappedCoinSolAccount
  if (poolInfo.coin.mintAddress === NATIVE_SOL.mintAddress) {
    wrappedCoinSolAccount = await createTokenAccountIfNotExist(
      connection,
      wrappedCoinSolAccount,
      owner,
      WSOL.mintAddress,
      coinAmount > coinBalance ? coinBalance : coinAmount,
      transaction,
      signers
    )
  }
  let wrappedSolAccount
  if (poolInfo.pc.mintAddress === NATIVE_SOL.mintAddress) {
    wrappedSolAccount = await createTokenAccountIfNotExist(
      connection,
      wrappedSolAccount,
      owner,
      WSOL.mintAddress,
      pcAmount > pcBalance ? pcBalance : pcAmount,
      transaction,
      signers
    )
  }

  console.log('wrappedCoinSolAccount@@@@@', wrappedCoinSolAccount && wrappedCoinSolAccount.toString())
  console.log('wrappedSolAccount@@@@@', wrappedSolAccount && wrappedSolAccount.toString())

  console.log('signers###', signers)

  let result
  let user_position_key
  let index = 0
  let user_wallet_key = owner
  if (user_mint_pubkey != null) {
    result = getUserPositionIdx(user_mint_pubkey, poolInfo.user_position_account_array)
    if (result.user_position_pubkey == null) {
      console.log("deposite old user: %s, but can't find in user position", user_mint_pubkey?.toString())
    }
    user_position_key = result.user_position_pubkey
    index = result.index
  } else {
    user_position_key = choosePosition(poolInfo.user_position_account_array)
  }
  // let transaction = new Transaction()
  // let instruction
  if (new_position === 0 && user_position_key != null) {
    let { mintTrans, mintAccount } = await TokenSwap.createMintInstruction(connection, wallet, poolInfo.authority)
    let { nftAccountInstruction, nft_account } = await TokenSwap.createAccountInstruction(
      connection,
      owner,
      mintAccount.publicKey,
      wallet
    )
    user_mint_pubkey = mintAccount.publicKey
    user_nft_pubkey = nft_account.publicKey
    transaction.add(mintTrans)
    transaction.add(nftAccountInstruction)

    // userTransferAuthority, mintAccount, nft_account, userTransferAuthority
    signers.push(mintAccount)
    signers.push(nft_account)

    // console.log('mintTrans#########', mintTrans)
    // console.log('nftAccountInstruction#########', nftAccountInstruction)

    transaction.add(
      depositAllTokenTypesInstruction(
        poolInfo.tokenSwap,
        poolInfo.authority,
        user_wallet_key,
        wrappedCoinSolAccount || userAccountA,
        wrappedSolAccount || userAccountB,
        poolInfo.tokenAccountA,
        poolInfo.tokenAccountB,
        user_mint_pubkey,
        user_nft_pubkey,
        poolInfo.tick_detail_key,
        user_position_key,
        poolInfo.swapProgramId,
        poolInfo.tokenProgramId,
        new_position,
        tick_lower,
        tick_upper,
        liquity_mount,
        coinAmount,
        pcAmount,
        0
      )
    )
    console.log(
      'the tick_detail_key is ',
      poolInfo.tick_detail_key.toString(),
      'the user position key ',
      user_position_key.toString()
    )
    // transaction.add(instruction)
  } else if (user_mint_pubkey != null && user_nft_pubkey != null && user_position_key != null) {
    transaction.add(
      depositAllTokenTypesInstruction(
        poolInfo.tokenSwap,
        poolInfo.authority,
        user_wallet_key,
        // wallet.publicKey,
        wrappedCoinSolAccount || userAccountA,
        wrappedSolAccount || userAccountB,
        poolInfo.tokenAccountA,
        poolInfo.tokenAccountB,
        user_mint_pubkey,
        new PublicKey(user_nft_pubkey),
        poolInfo.tick_detail_key,
        user_position_key,
        poolInfo.swapProgramId,
        poolInfo.tokenProgramId,
        new_position,
        tick_lower,
        tick_upper,
        liquity_mount,
        coinAmount,
        pcAmount,
        index
      )
    )
  }

  if (wrappedCoinSolAccount) {
    transaction.add(
      closeAccount({
        source: wrappedCoinSolAccount,
        destination: owner,
        owner
      })
    )
  }
  if (wrappedSolAccount) {
    transaction.add(
      closeAccount({
        source: wrappedSolAccount,
        destination: owner,
        owner
      })
    )
  }

  // console.log('99999####signers####', signers)
  return await sendTransaction(connection, wallet, transaction, signers)
  // return await sendAndConfirmTransaction('depositAllTokenTypes', connection, transaction, wallet, owner)
}

function depositAllTokenTypesInstruction(
  tokenSwap: PublicKey,
  authority: PublicKey,
  userTransferAuthority: PublicKey,
  sourceA: PublicKey,
  sourceB: PublicKey,
  intoA: PublicKey,
  intoB: PublicKey,
  nft_mint_pubkey: PublicKey,
  user_nft_pubkey: PublicKey,
  tick_info_key: PublicKey,
  user_postion_key: PublicKey,
  swapProgramId: PublicKey,
  tokenProgramId: PublicKey,
  new_position: number,
  tick_lower: number,
  tick_upper: number,
  liquity_amount: number | Numberu128 | string,
  maximumTokenA: number | Numberu64,
  maximumTokenB: number | Numberu64,
  user_position_index: number | Numberu64
): TransactionInstruction {
  console.log('@test####depositAllTokenTypesInstruction###tokenSwap###', tokenSwap)
  console.log('@test####depositAllTokenTypesInstruction###authority###', authority)
  console.log('@test####depositAllTokenTypesInstruction###userTransferAuthority###', userTransferAuthority)
  console.log('@test####depositAllTokenTypesInstruction###sourceA###', sourceA)
  console.log('@test####depositAllTokenTypesInstruction###sourceB###', sourceB)
  console.log('@test####depositAllTokenTypesInstruction###intoA###', intoA)
  console.log('@test####depositAllTokenTypesInstruction###intoB###', intoB)
  console.log('@test####depositAllTokenTypesInstruction###nft_mint_pubkey###', nft_mint_pubkey)
  console.log('@test####depositAllTokenTypesInstruction###user_nft_pubkey###', user_nft_pubkey)
  console.log('@test####depositAllTokenTypesInstruction###tick_info_key###', tick_info_key)
  console.log('@test####depositAllTokenTypesInstruction###user_postion_key###', user_postion_key)
  console.log('@test####depositAllTokenTypesInstruction###swapProgramId###', swapProgramId)
  console.log('@test####depositAllTokenTypesInstruction###tokenProgramId###', tokenProgramId)

  console.log('depositAllTokenTypesInstruction###tokenSwap###', tokenSwap.toString())
  console.log('depositAllTokenTypesInstruction###authority###', authority.toString())
  // console.log('depositAllTokenTypesInstruction###user_wallet_key###', user_wallet_key.toString())
  console.log('depositAllTokenTypesInstruction###userTransferAuthority###', userTransferAuthority.toString())
  console.log('depositAllTokenTypesInstruction###sourceA###', sourceA.toString())
  console.log('depositAllTokenTypesInstruction###sourceB###', sourceB.toString())
  console.log('depositAllTokenTypesInstruction###intoA###', intoA.toString())
  console.log('depositAllTokenTypesInstruction###intoB###', intoB.toString())
  console.log('depositAllTokenTypesInstruction###nft_mint_pubkey###', nft_mint_pubkey.toString())
  console.log('depositAllTokenTypesInstruction###user_nft_pubkey###', user_nft_pubkey.toString())
  console.log('depositAllTokenTypesInstruction###tick_info_key###', tick_info_key.toString())
  console.log('depositAllTokenTypesInstruction###user_postion_key###', user_postion_key.toString())
  console.log('depositAllTokenTypesInstruction###swapProgramId###', swapProgramId.toString())
  console.log('depositAllTokenTypesInstruction###tokenProgramId###', tokenProgramId.toString())

  console.log('depositAllTokenTypesInstruction###new_position###', new_position)
  console.log('depositAllTokenTypesInstruction###tick_lower###', tick_lower)
  console.log('depositAllTokenTypesInstruction###tick_upper###', tick_upper)
  console.log('depositAllTokenTypesInstruction###liquity_amount###', liquity_amount)
  console.log('depositAllTokenTypesInstruction###maximumTokenA###', maximumTokenA)
  console.log('depositAllTokenTypesInstruction###maximumTokenB###', maximumTokenB)
  console.log('depositAllTokenTypesInstruction###user_position_index###', user_position_index)

  const dataLayout = BufferLayout.struct([
    BufferLayout.u8('instruction'),
    BufferLayout.u8('new_position'),
    Layout.uint128('liquity_amount'),
    BufferLayout.s32('tick_lower'),
    BufferLayout.s32('tick_upper'),
    Layout.uint64('maximumTokenA'),
    Layout.uint64('maximumTokenB'),
    Layout.uint64('user_position_index')
  ])

  const data = Buffer.alloc(dataLayout.span)
  dataLayout.encode(
    {
      instruction: 2, // Deposit instruction
      new_position,
      liquity_amount: new Numberu128(String(liquity_amount)).toBuffer(),
      tick_lower,
      tick_upper,
      maximumTokenA: new Numberu64(maximumTokenA).toBuffer(),
      maximumTokenB: new Numberu64(maximumTokenB).toBuffer(),
      user_position_index: new Numberu64(user_position_index).toBuffer()
    },
    data
  )

  const keys = [
    { pubkey: tokenSwap, isSigner: false, isWritable: true },
    { pubkey: authority, isSigner: false, isWritable: false },
    { pubkey: userTransferAuthority, isSigner: true, isWritable: false },
    { pubkey: sourceA, isSigner: false, isWritable: true },
    { pubkey: sourceB, isSigner: false, isWritable: true },
    { pubkey: intoA, isSigner: false, isWritable: true },
    { pubkey: intoB, isSigner: false, isWritable: true },
    { pubkey: nft_mint_pubkey, isSigner: false, isWritable: true },
    { pubkey: user_nft_pubkey, isSigner: false, isWritable: true },
    { pubkey: tick_info_key, isSigner: false, isWritable: true },
    { pubkey: user_postion_key, isSigner: false, isWritable: true },
    { pubkey: tokenProgramId, isSigner: false, isWritable: false }
  ]
  return new TransactionInstruction({
    keys,
    programId: swapProgramId,
    data
  })
}

export async function claim(
  connection: Connection | undefined | null,
  wallet: any | undefined | null,
  poolInfo: any,
  fromCoinAccount: string | undefined | null,
  toCoinAccount: string | undefined | null,
  user_mint_pubkey: PublicKey | null,
  user_nft_pubkey: PublicKey | null
) {
  if (!connection || !wallet) throw new Error('Miss connection')

  if (!fromCoinAccount || !toCoinAccount || !poolInfo.tokenSwapAccount) {
    throw new Error('Miss account infomations')
  }

  const transaction = new Transaction()
  const signers: any = []
  const owner = wallet.publicKey

  const userAccounts = [new PublicKey(fromCoinAccount), new PublicKey(toCoinAccount)]

  const userCoinTokenAccount = userAccounts[0]
  const userPcTokenAccount = userAccounts[1]

  let result
  let user_position_key
  let index = 0
  if (user_mint_pubkey != null) {
    result = getUserPositionIdx(user_mint_pubkey, poolInfo.user_position_account_array)
    if (result.user_position_pubkey == null) {
      console.log("deposite old user: %s, but can't find in user position", user_mint_pubkey?.toString())
    }
    user_position_key = result.user_position_pubkey
    index = result.index
  } else {
    user_position_key = choosePosition(poolInfo.user_position_account_array)
  }

  let wrappedCoinSolAccount
  if (poolInfo.coin.mintAddress === NATIVE_SOL.mintAddress) {
    wrappedCoinSolAccount = await createTokenAccountIfNotExist(
      connection,
      wrappedCoinSolAccount,
      owner,
      WSOL.mintAddress,
      null,
      transaction,
      signers
    )
  }
  let wrappedSolAccount
  if (poolInfo.pc.mintAddress === NATIVE_SOL.mintAddress) {
    wrappedSolAccount = await createTokenAccountIfNotExist(
      connection,
      wrappedSolAccount,
      owner,
      WSOL.mintAddress,
      null,
      transaction,
      signers
    )
  }

  if (user_mint_pubkey && user_position_key && user_nft_pubkey) {
    transaction.add(
      claimInstruction(
        poolInfo.tokenSwap,
        poolInfo.authority,
        owner,
        new PublicKey(poolInfo.poolCoinTokenAccount),
        new PublicKey(poolInfo.poolPcTokenAccount),
        wrappedCoinSolAccount || userCoinTokenAccount,
        wrappedSolAccount || userPcTokenAccount,
        user_mint_pubkey,
        new PublicKey(user_nft_pubkey),
        poolInfo.tick_detail_key,
        user_position_key,
        poolInfo.swapProgramId,
        poolInfo.tokenProgramId,
        index
      )
    )
  }

  return await sendTransaction(connection, wallet, transaction, signers)
}

function claimInstruction(
  tokenSwap: PublicKey,
  authority: PublicKey,
  user_account_key: PublicKey,
  fromA: PublicKey,
  fromB: PublicKey,
  userAccountA: PublicKey,
  userAccountB: PublicKey,
  user_nft_mint_pubkey: PublicKey,
  user_nft_pubkey: PublicKey,
  tick_info_key: PublicKey,
  user_postion_key: PublicKey,
  swapProgramId: PublicKey,
  tokenProgramId: PublicKey,
  user_position_index: number | Numberu64
): TransactionInstruction {
  const dataLayout = BufferLayout.struct([BufferLayout.u8('instruction'), Layout.uint64('user_position_index')])

  const data = Buffer.alloc(dataLayout.span)
  dataLayout.encode(
    {
      instruction: 4, // Withdraw instruction]
      user_position_index: new Numberu64(user_position_index).toBuffer()
    },
    data
  )

  const keys = [
    { pubkey: tokenSwap, isSigner: false, isWritable: false },
    { pubkey: authority, isSigner: false, isWritable: false },
    { pubkey: user_account_key, isSigner: true, isWritable: false },
    { pubkey: user_nft_mint_pubkey, isSigner: false, isWritable: false },
    { pubkey: user_nft_pubkey, isSigner: false, isWritable: false },
    { pubkey: fromA, isSigner: false, isWritable: true },
    { pubkey: fromB, isSigner: false, isWritable: true },
    { pubkey: userAccountA, isSigner: false, isWritable: true },
    { pubkey: userAccountB, isSigner: false, isWritable: true },
    { pubkey: tick_info_key, isSigner: false, isWritable: false },
    { pubkey: user_postion_key, isSigner: false, isWritable: true },
    { pubkey: tokenProgramId, isSigner: false, isWritable: false }
  ]
  return new TransactionInstruction({
    keys,
    programId: swapProgramId,
    data
  })
}

export async function removeLiquidity(
  connection: Connection | undefined | null,
  wallet: any | undefined | null,
  poolInfo: any,
  user_mint_pubkey: PublicKey | null,
  user_nft_pubkey: PublicKey | null,
  fromCoinAccount: string | undefined | null,
  toCoinAccount: string | undefined | null,
  fromCoin: TokenInfo | undefined | null,
  toCoin: TokenInfo | undefined | null,
  fromAmount: string | undefined | null,
  toAmount: string | undefined | null,
  liquityAmount: number | Numberu128 | string
): Promise<string> {
  console.log('removeLiquidity###connection###', connection)
  console.log('removeLiquidity###wallet###', wallet)
  console.log('removeLiquidity###poolInfo###', poolInfo)
  console.log('removeLiquidity###fromCoinAccount###', fromCoinAccount)
  console.log('removeLiquidity###toCoinAccount###', toCoinAccount)
  console.log('removeLiquidity###fromCoin###', fromCoin)
  console.log('removeLiquidity###toCoin###', toCoin)
  console.log('removeLiquidity###fromAmount###', fromAmount)
  console.log('removeLiquidity###toAmount###', toAmount)
  console.log('removeLiquidity###liquityAmount###', liquityAmount)
  if (!connection || !wallet) throw new Error('Miss connection')
  if (!poolInfo || !fromCoin || !toCoin) {
    throw new Error('Miss pool infomations')
  }
  if (!fromCoinAccount || !toCoinAccount || !poolInfo.tokenSwapAccount) {
    throw new Error('Miss account infomations')
  }
  if (!liquityAmount) {
    throw new Error('Miss liquityAmount')
  }

  const transaction = new Transaction()
  const signers: any = []

  const owner = wallet.publicKey

  const userAccounts = [new PublicKey(fromCoinAccount), new PublicKey(toCoinAccount)]
  const userAmounts = [fromAmount, toAmount]

  if (poolInfo.coin.mintAddress === toCoin.mintAddress && poolInfo.pc.mintAddress === fromCoin.mintAddress) {
    userAccounts.reverse()
    userAmounts.reverse()
  }

  const userCoinTokenAccount = userAccounts[0]
  const userPcTokenAccount = userAccounts[1]

  let coinAmount: any
  if (userAmounts[0]) {
    // coinAmount = new TokenAmount(userAmounts[0], poolInfo.coin.decimals, false).wei.toNumber()
    coinAmount = Number(userAmounts[0])
  }

  let pcAmount: any
  if (userAmounts[1]) {
    // pcAmount = new TokenAmount(userAmounts[1], poolInfo.pc.decimals, false).wei.toNumber()
    pcAmount = Number(userAmounts[1])
  }

  let wrappedCoinSolAccount
  if (poolInfo.coin.mintAddress === NATIVE_SOL.mintAddress) {
    wrappedCoinSolAccount = await createTokenAccountIfNotExist(
      connection,
      wrappedCoinSolAccount,
      owner,
      WSOL.mintAddress,
      null,
      transaction,
      signers
    )
  }
  let wrappedSolAccount
  if (poolInfo.pc.mintAddress === NATIVE_SOL.mintAddress) {
    wrappedSolAccount = await createTokenAccountIfNotExist(
      connection,
      wrappedSolAccount,
      owner,
      WSOL.mintAddress,
      null,
      transaction,
      signers
    )
  }

  let result
  let user_position_key
  let index = 0
  if (user_mint_pubkey != null) {
    result = getUserPositionIdx(user_mint_pubkey, poolInfo.user_position_account_array)
    if (result.user_position_pubkey == null) {
      console.log("deposite old user: %s, but can't find in user position", user_mint_pubkey?.toString())
    }
    user_position_key = result.user_position_pubkey
    index = result.index
  } else {
    user_position_key = choosePosition(poolInfo.user_position_account_array)
  }

  // console.log('Math.floor(liquityAmount)####', Math.floor(liquityAmount))
  // console.log('coinAmount ? Math.floor(coinAmount) : 0####', coinAmount ? Math.floor(coinAmount) : 0)
  // console.log('pcAmount ? Math.floor(pcAmount) : 0####', pcAmount ? Math.floor(pcAmount) : 0)
  if (user_position_key && user_mint_pubkey && user_nft_pubkey) {
    transaction.add(
      withdrawAllTokenTypesInstruction(
        poolInfo.tokenSwap,
        poolInfo.authority,
        owner,
        new PublicKey(poolInfo.poolCoinTokenAccount),
        new PublicKey(poolInfo.poolPcTokenAccount),
        wrappedCoinSolAccount || userCoinTokenAccount,
        wrappedSolAccount || userPcTokenAccount,
        user_mint_pubkey,
        new PublicKey(user_nft_pubkey),
        poolInfo.tick_detail_key,
        user_position_key,
        poolInfo.swapProgramId,
        poolInfo.tokenProgramId,
        liquityAmount,
        coinAmount ? Math.floor(coinAmount) - 10 : 0,
        pcAmount ? Math.floor(pcAmount) - 10 : 0,
        index
      )
    )
  }

  if (wrappedCoinSolAccount) {
    transaction.add(
      closeAccount({
        source: wrappedCoinSolAccount,
        destination: owner,
        owner
      })
    )
  }
  if (wrappedSolAccount) {
    transaction.add(
      closeAccount({
        source: wrappedSolAccount,
        destination: owner,
        owner
      })
    )
  }

  return await sendTransaction(connection, wallet, transaction, signers)
}

function withdrawAllTokenTypesInstruction(
  tokenSwap: PublicKey,
  authority: PublicKey,
  userTransferAuthority: PublicKey,
  fromA: PublicKey,
  fromB: PublicKey,
  userAccountA: PublicKey,
  userAccountB: PublicKey,
  nft_mint_pubkey: PublicKey,
  user_nft_pubkey: PublicKey,
  tick_info_key: PublicKey,
  user_postion_key: PublicKey,
  swapProgramId: PublicKey,
  tokenProgramId: PublicKey,
  liquityAmount: number | Numberu128 | string,
  minimumTokenA: number | Numberu64,
  minimumTokenB: number | Numberu64,
  user_position_index: number | Numberu64
): TransactionInstruction {
  console.log('到这了了了了了')
  console.log('withdrawAllTokenTypesInstruction###tokenSwap###', tokenSwap)
  console.log('withdrawAllTokenTypesInstruction###authority###', authority)
  console.log('withdrawAllTokenTypesInstruction###userTransferAuthority###', userTransferAuthority)
  console.log('withdrawAllTokenTypesInstruction###fromA###', fromA)
  console.log('withdrawAllTokenTypesInstruction###fromB###', fromB)
  console.log('withdrawAllTokenTypesInstruction###userAccountA###', userAccountA)
  console.log('withdrawAllTokenTypesInstruction###userAccountB###', userAccountB)
  console.log('withdrawAllTokenTypesInstruction###nft_mint_pubkey###', nft_mint_pubkey.toString())
  console.log('withdrawAllTokenTypesInstruction###user_nft_pubkey###', user_nft_pubkey.toString())
  console.log('withdrawAllTokenTypesInstruction###tick_info_key###', tick_info_key.toString())
  console.log('withdrawAllTokenTypesInstruction###user_postion_key###', user_postion_key.toString())
  console.log('withdrawAllTokenTypesInstruction###swapProgramId###', swapProgramId)
  console.log('withdrawAllTokenTypesInstruction###tokenProgramId###', tokenProgramId)
  console.log('withdrawAllTokenTypesInstruction###liquityAmount###', liquityAmount)
  console.log('withdrawAllTokenTypesInstruction###minimumTokenA###', minimumTokenA)
  console.log('withdrawAllTokenTypesInstruction###minimumTokenB###', minimumTokenB)
  console.log('withdrawAllTokenTypesInstruction###user_position_index###', user_position_index)
  const dataLayout = BufferLayout.struct([
    BufferLayout.u8('instruction'),
    Layout.uint128('liquityAmount'),
    Layout.uint64('minimumTokenA'),
    Layout.uint64('minimumTokenB'),
    Layout.uint64('user_position_index')
  ])

  const data = Buffer.alloc(dataLayout.span)
  dataLayout.encode(
    {
      instruction: 3, // Withdraw instruction]
      liquityAmount: new Numberu128(liquityAmount).toBuffer(),
      minimumTokenA: new Numberu64(minimumTokenA).toBuffer(),
      minimumTokenB: new Numberu64(minimumTokenB).toBuffer(),
      user_position_index: new Numberu64(user_position_index).toBuffer()
    },
    data
  )

  const keys = [
    { pubkey: tokenSwap, isSigner: false, isWritable: true },
    { pubkey: authority, isSigner: false, isWritable: false },
    { pubkey: userTransferAuthority, isSigner: true, isWritable: false },
    { pubkey: nft_mint_pubkey, isSigner: false, isWritable: true },
    { pubkey: user_nft_pubkey, isSigner: false, isWritable: true },
    { pubkey: fromA, isSigner: false, isWritable: true },
    { pubkey: fromB, isSigner: false, isWritable: true },
    { pubkey: userAccountA, isSigner: false, isWritable: true },
    { pubkey: userAccountB, isSigner: false, isWritable: true },
    { pubkey: tick_info_key, isSigner: false, isWritable: true },
    { pubkey: user_postion_key, isSigner: false, isWritable: true },
    { pubkey: tokenProgramId, isSigner: false, isWritable: false }
  ]
  return new TransactionInstruction({
    keys,
    programId: swapProgramId,
    data
  })
}
