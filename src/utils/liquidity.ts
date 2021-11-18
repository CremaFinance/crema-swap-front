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
import { Account, Connection, PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js'
import { NATIVE_SOL, TOKENS, TokenInfo, LP_TOKENS } from '@/utils/tokens'
import { AccountLayout, NATIVE_MINT, Token, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { Numberu64, TokenSwap, UserPosition, TokenSwapLayout } from '../tokenSwap'
import { preview_calculate_liqudity, price2tick } from '../tokenSwap/swapv3'
// import { price2tick, tick2price } from './common'
import { createTokenAccountIfNotExist, sendTransaction } from '@/utils/web3'
import { LiquidityPoolInfo } from '@/utils/pools'
import { TokenAmount } from '@/utils/safe-math'
import { loadAccount } from '../tokenSwap/util/account'
import { closeAccount } from '@project-serum/serum/lib/token-instructions'
import { SWAPV3_PROGRAMID } from '@/utils/ids'

const payer = new Account([
  145, 101, 210, 147, 165, 195, 23, 69, 182, 224, 218, 4, 144, 61, 168, 176, 20, 187, 204, 236, 117, 88, 182, 47, 231,
  219, 50, 169, 28, 175, 124, 100, 103, 10, 24, 183, 209, 36, 230, 201, 249, 29, 188, 155, 200, 187, 54, 151, 203, 137,
  135, 31, 160, 75, 250, 72, 225, 22, 173, 88, 38, 147, 165, 53
])

export const AMM_INFO_LAYOUT_V4 = struct([
  u64('status'),
  u64('nonce'),
  u64('orderNum'),
  u64('depth'),
  u64('coinDecimals'),
  u64('pcDecimals'),
  u64('state'),
  u64('resetFlag'),
  u64('minSize'),
  u64('volMaxCutRatio'),
  u64('amountWaveRatio'),
  u64('coinLotSize'),
  u64('pcLotSize'),
  u64('minPriceMultiplier'),
  u64('maxPriceMultiplier'),
  u64('systemDecimalsValue'),
  // Fees
  u64('minSeparateNumerator'),
  u64('minSeparateDenominator'),
  u64('tradeFeeNumerator'),
  u64('tradeFeeDenominator'),
  u64('pnlNumerator'),
  u64('pnlDenominator'),
  u64('swapFeeNumerator'),
  u64('swapFeeDenominator'),
  // OutPutData
  u64('needTakePnlCoin'),
  u64('needTakePnlPc'),
  u64('totalPnlPc'),
  u64('totalPnlCoin'),
  u128('poolTotalDepositPc'),
  u128('poolTotalDepositCoin'),
  u128('swapCoinInAmount'),
  u128('swapPcOutAmount'),
  u64('swapCoin2PcFee'),
  u128('swapPcInAmount'),
  u128('swapCoinOutAmount'),
  u64('swapPc2CoinFee'),

  publicKey('poolCoinTokenAccount'),
  publicKey('poolPcTokenAccount'),
  publicKey('coinMintAddress'),
  publicKey('pcMintAddress'),
  publicKey('lpMintAddress'),
  publicKey('ammOpenOrders'),
  publicKey('serumMarket'),
  publicKey('serumProgramId'),
  publicKey('ammTargetOrders'),
  publicKey('poolWithdrawQueue'),
  publicKey('poolTempLpTokenAccount'),
  publicKey('ammOwner'),
  publicKey('pnlOwner')
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

export async function addLiquidity(
  connection: Connection | undefined | null,
  wallet: any | undefined | null,
  // poolInfo: LiquidityPoolInfo | undefined | null,
  poolInfo: any,
  nftMintToken: PublicKey | undefined | null,
  userNftPubkey: PublicKey | undefined | null,
  fromCoinAccount: string | undefined | null,
  toCoinAccount: string | undefined | null,
  fromCoin: TokenInfo | undefined | null,
  toCoin: TokenInfo | undefined | null,
  fromAmount: string | undefined | null,
  toAmount: string | undefined | null,
  tick_lower: number,
  tick_upper: number,
  liquityAmount: number
): Promise<string> {
  console.log('addLiquidity###connection###', connection)
  console.log('addLiquidity###wallet###', wallet)
  console.log('addLiquidity###poolInfo###', poolInfo)
  console.log('addLiquidity###nftMintToken###', nftMintToken)
  console.log('addLiquidity###userNftPubkey###', userNftPubkey)
  console.log('addLiquidity###fromCoinAccount###', fromCoinAccount)
  console.log('addLiquidity###toCoinAccount###', toCoinAccount)
  console.log('addLiquidity###fromCoin###', fromCoin)
  console.log('addLiquidity###toCoin###', toCoin)
  console.log('addLiquidity###fromAmount###', fromAmount)
  console.log('addLiquidity###toAmount###', toAmount)
  console.log('addLiquidity###tick_lower###', tick_lower)
  console.log('addLiquidity###tick_upper###', tick_upper)
  console.log('addLiquidity###liquityAmount###', liquityAmount)
  if (!connection || !wallet) throw new Error('Miss connection')
  if (!poolInfo || !fromCoin || !toCoin) {
    throw new Error('Miss pool infomations')
  }
  if (!fromCoinAccount || !toCoinAccount || !poolInfo.tokenSwapAccount) {
    throw new Error('Miss account infomations')
  }
  // if (!fromAmount || !toAmount) {
  //   throw new Error('Miss amount infomations')
  // }
  if (!userNftPubkey) {
    throw new Error('Miss userNftPubkey')
  }
  if (!nftMintToken) {
    throw new Error('Miss nftMintToken')
  }
  // if (!tick_lower) {
  //   throw new Error('Miss tick_lower')
  // }
  // if (!tick_upper) {
  //   throw new Error('Miss tick_upper')
  // }
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
    coinAmount = new TokenAmount(userAmounts[0], poolInfo.coin.decimals, false).wei.toNumber()
  }

  let pcAmount: any
  if (userAmounts[1]) {
    pcAmount = new TokenAmount(userAmounts[1], poolInfo.pc.decimals, false).wei.toNumber()
  }

  let wrappedCoinSolAccount
  if (poolInfo.coin.mintAddress === NATIVE_SOL.mintAddress) {
    wrappedCoinSolAccount = await createTokenAccountIfNotExist(
      connection,
      wrappedCoinSolAccount,
      owner,
      TOKENS.WSOL.mintAddress,
      coinAmount + 1e7,
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
      TOKENS.WSOL.mintAddress,
      pcAmount + 1e7,
      transaction,
      signers
    )
  }

  // let nft_mint_token = await Token.createMint(
  //   connection,
  //   payer,
  //   // tokenSwap.authority,
  //   new PublicKey(poolInfo.authority),
  //   null,
  //   0,
  //   TOKEN_PROGRAM_ID
  // )

  // console.log('nft_mint_token####', nft_mint_token)
  // console.log('nft_mint_token##publicKey####', nft_mint_token.publicKey)
  // console.log('owner####', owner)
  // // let user_nft_pubkey = await nft_mint_token.createAccount(owner.publicKey)
  // let user_nft_pubkey = await nft_mint_token.createAccount(owner)
  const data = await loadAccount(connection, new PublicKey(poolInfo.tokenSwapAccount), SWAPV3_PROGRAMID)
  const tokenSwapData = TokenSwapLayout.decode(data)

  // const fee_growth_global0 = Numberu128.fromBuffer(tokenSwapData.fee_growth_global0).toNumber()
  // const fee_growth_global1 = Numberu128.fromBuffer(tokenSwapData.fee_growth_global1).toNumber()
  // console.log('tokenSwapData#####', tokenSwapData)
  const userPositionIndex = tokenSwapData.user_position_index

  let { index: user_position_index, new_flag: new_position } = await UserPosition.getUserPositionIdx(
    connection,
    new PublicKey(poolInfo.userPositionKey),
    userNftPubkey,
    // new PublicKey(poolInfo.tokenSwapToken),
    SWAPV3_PROGRAMID,
    // poolInfo.userPositionIndex
    userPositionIndex
  )

  transaction.add(
    depositAllTokenTypesInstruction(
      new PublicKey(poolInfo.tokenSwapAccount),
      new PublicKey(poolInfo.authority),
      owner,
      wrappedCoinSolAccount || userCoinTokenAccount,
      wrappedSolAccount || userPcTokenAccount,
      new PublicKey(poolInfo.poolCoinTokenAccount),
      new PublicKey(poolInfo.poolPcTokenAccount),
      nftMintToken,
      userNftPubkey,
      // new PublicKey(poolInfo.tickMapPubkey),
      // new PublicKey(poolInfo.tickPositionKey),
      new PublicKey(poolInfo.tickDetailKey),
      new PublicKey(poolInfo.userPositionKey),
      new PublicKey(poolInfo.tokenSwapToken),
      new PublicKey(poolInfo.programId),
      new_position,
      tick_lower,
      tick_upper,
      liquityAmount,
      coinAmount ? Math.ceil(coinAmount) : 0,
      pcAmount ? Math.ceil(pcAmount) : 0,
      user_position_index
    )
  )

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
  liquity_amount: number | Numberu64,
  maximumTokenA: number | Numberu64,
  maximumTokenB: number | Numberu64,
  user_position_index: number | Numberu64
): TransactionInstruction {
  console.log('depositAllTokenTypesInstruction###tick_lower###', tick_lower)
  console.log('depositAllTokenTypesInstruction####tick_upper###', tick_upper)
  console.log('depositAllTokenTypesInstruction####maximumTokenA###', maximumTokenA)
  console.log('depositAllTokenTypesInstruction###maximumTokenB###', maximumTokenB)

  console.log('depositAllTokenTypesInstruction###new_position######', new_position)
  console.log('depositAllTokenTypesInstruction###liquity_amount######', liquity_amount)
  console.log('depositAllTokenTypesInstruction###tick_lower######', tick_lower)
  console.log('depositAllTokenTypesInstruction###tick_upper######', tick_upper)
  console.log('depositAllTokenTypesInstruction###maximumTokenA######', maximumTokenA)
  console.log('depositAllTokenTypesInstruction###maximumTokenB######', maximumTokenB)
  console.log('depositAllTokenTypesInstruction###user_position_index######', user_position_index)

  const dataLayout = BufferLayout.struct([
    BufferLayout.u8('instruction'),
    BufferLayout.u8('new_position'),
    Layout.uint64('liquity_amount'),
    BufferLayout.s32('tick_lower'),
    BufferLayout.s32('tick_upper'),
    Layout.uint64('maximumTokenA'),
    Layout.uint64('maximumTokenB'),
    Layout.uint64('user_position_index')
  ])

  const data = Buffer.alloc(dataLayout.span)

  const lq = String(liquity_amount).split('.')[0]
  console.log('depositAllTokenTypesInstruction###lq#######', lq)

  dataLayout.encode(
    {
      instruction: 2, // Deposit instruction
      // eslint-disable-next-line object-shorthand
      new_position: new_position,
      liquity_amount: new Numberu64(lq).toBuffer(),
      // liquity_amount,
      // eslint-disable-next-line object-shorthand
      tick_lower: tick_lower,
      // eslint-disable-next-line object-shorthand
      tick_upper: tick_upper,
      maximumTokenA: new Numberu64(maximumTokenA).toBuffer(),
      maximumTokenB: new Numberu64(maximumTokenB).toBuffer(),
      user_position_index: new Numberu64(user_position_index).toBuffer()
    },
    data
  )

  const test = dataLayout.decode(data)
  console.log('test####', test)

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
  toCoinAccount: string | undefined | null
) {
  if (!connection || !wallet) throw new Error('Miss connection')

  if (!fromCoinAccount || !toCoinAccount || !poolInfo.tokenSwapAccount) {
    throw new Error('Miss account infomations')
  }

  const transaction = new Transaction()
  const signers: any = []
  const owner = wallet.publicKey

  const userAccounts = [new PublicKey(fromCoinAccount), new PublicKey(toCoinAccount)]
  // const userAmounts = [fromAmount, toAmount]

  // if (poolInfo.coin.mintAddress === toCoin.mintAddress && poolInfo.pc.mintAddress === fromCoin.mintAddress) {
  //   userAccounts.reverse()
  //   // userAmounts.reverse()
  // }

  const userCoinTokenAccount = userAccounts[0]
  const userPcTokenAccount = userAccounts[1]
  // const coinAmount = new TokenAmount(userAmounts[0], poolInfo.coin.decimals, false).wei.toNumber()
  // const pcAmount = new TokenAmount(userAmounts[1], poolInfo.pc.decimals, false).wei.toNumber()

  // let wrappedCoinSolAccount
  // if (poolInfo.coin.mintAddress === NATIVE_SOL.mintAddress) {
  //   wrappedCoinSolAccount = await createTokenAccountIfNotExist(
  //     connection,
  //     wrappedCoinSolAccount,
  //     owner,
  //     TOKENS.WSOL.mintAddress,
  //     coinAmount + 1e7,
  //     transaction,
  //     signers
  //   )
  // }
  // let wrappedSolAccount
  // if (poolInfo.pc.mintAddress === NATIVE_SOL.mintAddress) {
  //   wrappedSolAccount = await createTokenAccountIfNotExist(
  //     connection,
  //     wrappedSolAccount,
  //     owner,
  //     TOKENS.WSOL.mintAddress,
  //     pcAmount + 1e7,
  //     transaction,
  //     signers
  //   )
  // }
  const data = await loadAccount(connection, new PublicKey(poolInfo.tokenSwapAccount), SWAPV3_PROGRAMID)
  const tokenSwapData = TokenSwapLayout.decode(data)

  // const fee_growth_global0 = Numberu128.fromBuffer(tokenSwapData.fee_growth_global0).toNumber()
  // const fee_growth_global1 = Numberu128.fromBuffer(tokenSwapData.fee_growth_global1).toNumber()
  // console.log('liquidity.ts###claim###tokenSwapData#####', tokenSwapData)
  const userPositionIndex = tokenSwapData.user_position_index
  // console.log('liquidity.ts###claim###userPositionIndex####', userPositionIndex)

  let { index: user_position_index, new_flag: new_position } = await UserPosition.getUserPositionIdx(
    connection,
    new PublicKey(poolInfo.userPositionKey),
    poolInfo.nft_token_id,
    // new PublicKey(poolInfo.tokenSwapToken),
    SWAPV3_PROGRAMID,
    userPositionIndex
  )

  transaction.add(
    claimInstruction(
      new PublicKey(poolInfo.tokenSwapAccount),
      new PublicKey(poolInfo.authority),
      owner,
      new PublicKey(poolInfo.poolCoinTokenAccount),
      new PublicKey(poolInfo.poolPcTokenAccount),
      userCoinTokenAccount,
      userPcTokenAccount,
      poolInfo.nft_token_id,
      new PublicKey(poolInfo.tickDetailKey),
      new PublicKey(poolInfo.userPositionKey),
      new PublicKey(poolInfo.tokenSwapToken),
      new PublicKey(poolInfo.programId),
      user_position_index
    )
  )

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
  // poolInfo: LiquidityPoolInfo | undefined | null,
  poolInfo: any,
  nftMintToken: PublicKey | undefined | null,
  userNftPubkey: PublicKey | undefined | null,
  fromCoinAccount: string | undefined | null,
  toCoinAccount: string | undefined | null,
  fromCoin: TokenInfo | undefined | null,
  toCoin: TokenInfo | undefined | null,
  fromAmount: string | undefined | null,
  toAmount: string | undefined | null,
  // tick_lower: number,
  // tick_upper: number,
  liquityAmount: number
): Promise<string> {
  console.log('removeLiquidity###connection###', connection)
  console.log('removeLiquidity###wallet###', wallet)
  console.log('removeLiquidity###poolInfo###', poolInfo)
  console.log('removeLiquidity###nftMintToken###', nftMintToken)
  console.log('removeLiquidity###userNftPubkey###', userNftPubkey)
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
  // if (!fromAmount || !toAmount) {
  //   throw new Error('Miss amount infomations')
  // }
  if (!userNftPubkey) {
    throw new Error('Miss userNftPubkey')
  }
  if (!nftMintToken) {
    throw new Error('Miss nftMintToken')
  }
  // if (!tick_lower) {
  //   throw new Error('Miss tick_lower')
  // }
  // if (!tick_upper) {
  //   throw new Error('Miss tick_upper')
  // }
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
    coinAmount = new TokenAmount(userAmounts[0], poolInfo.coin.decimals, false).wei.toNumber()
  }

  let pcAmount: any
  if (userAmounts[1]) {
    pcAmount = new TokenAmount(userAmounts[1], poolInfo.pc.decimals, false).wei.toNumber()
  }

  let wrappedCoinSolAccount
  if (poolInfo.coin.mintAddress === NATIVE_SOL.mintAddress) {
    wrappedCoinSolAccount = await createTokenAccountIfNotExist(
      connection,
      wrappedCoinSolAccount,
      owner,
      TOKENS.WSOL.mintAddress,
      coinAmount + 1e7,
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
      TOKENS.WSOL.mintAddress,
      pcAmount + 1e7,
      transaction,
      signers
    )
  }

  // let nft_mint_token = await Token.createMint(
  //   connection,
  //   payer,
  //   // tokenSwap.authority,
  //   new PublicKey(poolInfo.authority),
  //   null,
  //   0,
  //   TOKEN_PROGRAM_ID
  // )

  // console.log('nft_mint_token####', nft_mint_token)
  // console.log('nft_mint_token##publicKey####', nft_mint_token.publicKey)
  // console.log('owner####', owner)
  // // let user_nft_pubkey = await nft_mint_token.createAccount(owner.publicKey)
  // let user_nft_pubkey = await nft_mint_token.createAccount(owner)

  const data = await loadAccount(connection, new PublicKey(poolInfo.tokenSwapAccount), SWAPV3_PROGRAMID)
  const tokenSwapData = TokenSwapLayout.decode(data)

  // const fee_growth_global0 = Numberu128.fromBuffer(tokenSwapData.fee_growth_global0).toNumber()
  // const fee_growth_global1 = Numberu128.fromBuffer(tokenSwapData.fee_growth_global1).toNumber()
  // console.log('tokenSwapData#####', tokenSwapData)
  const userPositionIndex = tokenSwapData.user_position_index
  // console.log('userPositionIndex####', userPositionIndex)

  let { index: user_position_index, new_flag: new_position } = await UserPosition.getUserPositionIdx(
    connection,
    new PublicKey(poolInfo.userPositionKey),
    userNftPubkey,
    // new PublicKey(poolInfo.tokenSwapToken),
    SWAPV3_PROGRAMID,
    userPositionIndex
  )

  let nft_mint_token = new Token(connection, nftMintToken, TOKEN_PROGRAM_ID, payer)

  // console.log('Math.floor(liquityAmount)####', Math.floor(liquityAmount))
  // console.log('coinAmount ? Math.floor(coinAmount) : 0####', coinAmount ? Math.floor(coinAmount) : 0)
  // console.log('pcAmount ? Math.floor(pcAmount) : 0####', pcAmount ? Math.floor(pcAmount) : 0)

  transaction.add(
    withdrawAllTokenTypesInstruction(
      new PublicKey(poolInfo.tokenSwapAccount),
      new PublicKey(poolInfo.authority),
      owner,
      new PublicKey(poolInfo.poolCoinTokenAccount),
      new PublicKey(poolInfo.poolPcTokenAccount),
      wrappedCoinSolAccount || userCoinTokenAccount,
      wrappedSolAccount || userPcTokenAccount,
      nft_mint_token.publicKey,
      userNftPubkey,
      // new PublicKey(poolInfo.tickMapPubkey),
      // new PublicKey(poolInfo.tickPositionKey),
      new PublicKey(poolInfo.tickDetailKey),
      new PublicKey(poolInfo.userPositionKey),
      new PublicKey(poolInfo.tokenSwapToken),
      new PublicKey(poolInfo.programId),
      // new_position,
      // tick_lower,
      // tick_upper,
      Math.floor(liquityAmount),
      coinAmount ? Math.floor(coinAmount) : 0,
      pcAmount ? Math.floor(pcAmount) : 0,
      user_position_index
    )
  )

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
  liquity_amount: number | Numberu64,
  minimumTokenA: number | Numberu64,
  minimumTokenB: number | Numberu64,
  user_position_index: number | Numberu64
): TransactionInstruction {
  const dataLayout = BufferLayout.struct([
    BufferLayout.u8('instruction'),
    Layout.uint64('liquity_amount'),
    Layout.uint64('minimumTokenA'),
    Layout.uint64('minimumTokenB'),
    Layout.uint64('user_position_index')
  ])

  const data = Buffer.alloc(dataLayout.span)
  dataLayout.encode(
    {
      instruction: 3, // Withdraw instruction]
      liquity_amount: new Numberu64(liquity_amount).toBuffer(),
      minimumTokenA: new Numberu64(minimumTokenA).toBuffer(),
      minimumTokenB: new Numberu64(minimumTokenB).toBuffer(),
      user_position_index: new Numberu64(user_position_index).toBuffer()
    },
    data
  )

  console.log('nft_mint_pubkey##string####', nft_mint_pubkey.toString())
  console.log('user_nft_pubkey##string####', user_nft_pubkey.toString())

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
