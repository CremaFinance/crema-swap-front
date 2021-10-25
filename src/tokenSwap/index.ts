/* eslint-disable @typescript-eslint/no-unused-vars */
import assert from 'assert'
import BN from 'bn.js'
import { Buffer } from 'buffer'
import * as BufferLayout from 'buffer-layout'
import type { Connection, TransactionSignature } from '@solana/web3.js'
import { Account, PublicKey, SystemProgram, Transaction, TransactionInstruction } from '@solana/web3.js'

import * as Layout from './layout'
// import * as amm_test from '../cli/ammv3-test'
import { sendAndConfirmTransaction } from './util/send-and-confirm-transaction'
import { loadAccount } from './util/account'
export const ORACLE_PRAGRAM_ID = new PublicKey('gSbePebfvPy7tRqimPoVecS2UsBvYv46ynrzWocc92s')
export const SWAPV3_PROGRAMID: PublicKey = new PublicKey('C8L7YYHrn38sKfAxVo5BFsGYFWcLeRAdaavVNfzg9s5N')

const amm_test = {
  tick_map_account: new Account([
    63, 142, 248, 74, 136, 12, 8, 235, 128, 48, 114, 134, 53, 187, 166, 210, 190, 167, 105, 131, 62, 154, 236, 196, 142,
    28, 246, 39, 93, 163, 215, 239, 237, 172, 120, 156, 87, 136, 219, 14, 107, 15, 207, 189, 209, 232, 202, 55, 146,
    157, 151, 12, 145, 165, 39, 3, 133, 121, 2, 130, 21, 26, 62, 183
  ]),
  tick_position_account: new Account([
    72, 74, 243, 207, 113, 67, 225, 200, 93, 223, 110, 201, 108, 0, 124, 207, 35, 217, 237, 83, 223, 161, 108, 118, 194,
    198, 226, 174, 5, 145, 87, 203, 17, 131, 163, 242, 208, 221, 35, 183, 31, 147, 92, 182, 213, 119, 112, 138, 155, 19,
    55, 39, 39, 139, 213, 1, 187, 137, 133, 120, 187, 220, 0, 115
  ]),
  tick_info_account: new Account([
    210, 224, 116, 2, 106, 5, 28, 126, 130, 188, 145, 43, 245, 100, 243, 252, 182, 174, 143, 253, 188, 164, 109, 27, 93,
    83, 125, 99, 249, 81, 154, 233, 180, 127, 188, 72, 167, 11, 53, 121, 227, 54, 33, 170, 100, 143, 156, 187, 112, 81,
    67, 65, 1, 130, 114, 130, 171, 156, 248, 154, 135, 238, 145, 217
  ]),
  user_postion_account: new Account([
    118, 12, 183, 31, 169, 40, 129, 189, 147, 252, 232, 124, 183, 186, 16, 240, 38, 146, 237, 52, 116, 13, 171, 40, 224,
    73, 204, 165, 14, 178, 68, 181, 194, 25, 148, 22, 81, 185, 223, 89, 188, 238, 200, 195, 90, 115, 233, 149, 40, 179,
    191, 113, 195, 123, 83, 241, 129, 61, 3, 131, 36, 223, 244, 90
  ])
}

/**
 * Some amount of tokens
 */
export class Numberu64 extends BN {
  /**
   * Convert to Buffer representation
   */
  toBuffer(): Buffer {
    const a = super.toArray().reverse()
    const b = Buffer.from(a)
    if (b.length === 8) {
      return b
    }
    assert(b.length < 8, 'Numberu64 too large')

    const zeroPad = Buffer.alloc(8)
    b.copy(zeroPad)
    return zeroPad
  }

  /**
   * Construct a Numberu64 from Buffer representation
   */
  static fromBuffer(buffer: Buffer): Numberu64 {
    assert(buffer.length === 8, `Invalid buffer length: ${buffer.length}`)
    return new Numberu64(
      [...buffer]
        .reverse()
        .map((i) => `00${i.toString(16)}`.slice(-2))
        .join(''),
      16
    )
  }
}

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

export const TokenSwapLayout = BufferLayout.struct([
  BufferLayout.u8('version'),
  BufferLayout.u8('isInitialized'),
  BufferLayout.u8('nonce'),
  Layout.publicKey('tokenProgramId'),
  Layout.publicKey('tokenAccountA'),
  Layout.publicKey('tokenAccountB'),
  Layout.publicKey('mintA'),
  Layout.publicKey('mintB'),
  Layout.publicKey('tick_map_pubkey'),
  Layout.publicKey('tick_detail_key'),
  Layout.publicKey('tick_position_key'),
  Layout.publicKey('user_position_key'),
  Layout.publicKey('oracleProgramID'),
  BufferLayout.u8('curveType'),
  BufferLayout.u32('fee'),
  BufferLayout.u32('tick_space'),
  BufferLayout.u32('tick_append_index'),
  BufferLayout.u32('user_position_index'),
  Layout.uint128('current_price'),
  Layout.uint128('current_liquity'),
  Layout.uint128('fee_growth_global0'),
  Layout.uint128('fee_growth_global1')
])

export const CurveType = Object.freeze({
  AMMv3: 0, // Constant product curve, Uniswap-style
  HMMv3: 1 // Offset curve, like Uniswap, but with an additional offset on the token B side
})

export const UserPositionLayout = BufferLayout.struct([
  Layout.publicKey('nft_token_id'),
  BufferLayout.u32('lower_tick'),
  BufferLayout.u32('upper_tick'),
  Layout.uint128('liquity'),
  Layout.uint128('fee_growth_inside_a_last'),
  Layout.uint128('fee_growth_inside_b_last'),
  Layout.uint128('token_a_fee'),
  Layout.uint128('token_b_fee')
])

export class UserPosition {
  constructor(
    private connection: Connection,
    public nft_token_id: PublicKey,
    public lower_tick: number,
    public upper_tick: number,
    public liquity: number,
    public fee_growth_inside_a_last: number,
    public fee_growth_inside_b_last: number,
    public token_a_fee: number,
    public token_b_fee: number
  ) {
    this.connection = connection
    this.nft_token_id = nft_token_id
    this.lower_tick = lower_tick
    this.upper_tick = upper_tick
    this.liquity = liquity
    this.fee_growth_inside_a_last = fee_growth_inside_a_last
    this.fee_growth_inside_b_last = fee_growth_inside_b_last
    this.token_a_fee = token_a_fee
    this.token_b_fee = token_b_fee
  }

  static async loadUserPosition(
    connection: Connection,
    address: PublicKey,
    programId: PublicKey,
    length: number
  ): Promise<Array<UserPosition>> {
    const data = await loadAccount(connection, address, programId)
    // eslint-disable-next-line no-array-constructor
    const array = new Array<UserPosition>()
    for (let i = 0; i < length; i++) {
      const userPositionData = UserPositionLayout.decode(
        data.slice(i * UserPositionLayout.span, (i + 1) * UserPositionLayout.span)
      )
      const nft_token_id = new PublicKey(userPositionData.nft_token_id)
      console.log('the nft_token_id is %s', nft_token_id.toString())
      const liquity = Numberu128.fromBuffer(userPositionData.liquity).toNumber()
      const lower_tick = userPositionData.lower_tick
      const upper_tick = userPositionData.upper_tick
      const fee_growth_inside_a_last = Numberu128.fromBuffer(userPositionData.fee_growth_inside_a_last).toNumber()
      const fee_growth_inside_b_last = Numberu128.fromBuffer(userPositionData.fee_growth_inside_b_last).toNumber()
      const token_a_fee = Numberu128.fromBuffer(userPositionData.token_a_fee).toNumber()
      const token_b_fee = Numberu128.fromBuffer(userPositionData.token_b_fee).toNumber()
      const userPostion = new UserPosition(
        connection,
        nft_token_id,
        lower_tick,
        upper_tick,
        liquity,
        fee_growth_inside_a_last,
        fee_growth_inside_b_last,
        token_a_fee,
        token_b_fee
      )
      array.push(userPostion)
    }
    return array
  }
}
/**
 * A program to exchange tokens against a pool of liquidity
 */
export class TokenSwap {
  /**
   * Create a Token object attached to the specific token
   *
   * @param connection The connection to use
   * @param tokenSwap The token swap account
   * @param swapProgramId The program ID of the token-swap program
   * @param tokenProgramId The program ID of the token program
   * @param poolToken The pool token
   * @param authority The authority over the swap and accounts
   * @param tokenAccountA The token swap's Token A account
   * @param tokenAccountB The token swap's Token B account
   * @param mintA The mint of Token A
   * @param mintB The mint of Token B
   * @param curveType The curve type
   * @param payer Pays for the transaction
   */
  constructor(
    private connection: Connection,
    public tokenSwap: PublicKey,
    public swapProgramId: PublicKey,
    public tokenProgramId: PublicKey,
    public authority: PublicKey,
    public tokenAccountA: PublicKey,
    public tokenAccountB: PublicKey,
    public mintA: PublicKey,
    public mintB: PublicKey,
    public tick_map_pubkey: PublicKey,
    public tick_detail_key: PublicKey,
    public tick_position_key: PublicKey,
    public user_position_key: PublicKey,
    public curveType: number,
    public fee: number,
    public tick_space: number,
    public tick_append_index: number,
    public user_postion_index: number,
    public current_price: number,
    public current_liquity: number,
    public fee_growth_global0: number,
    public fee_growth_global1: number,
    public payer: Account
  ) {
    this.connection = connection
    this.tokenSwap = tokenSwap
    this.swapProgramId = swapProgramId
    this.tokenProgramId = tokenProgramId
    this.authority = authority
    this.tokenAccountA = tokenAccountA
    this.tokenAccountB = tokenAccountB
    this.mintA = mintA
    this.mintB = mintB
    this.curveType = curveType
    this.fee = fee
    this.tick_space = tick_space
    this.tick_append_index = tick_append_index
    this.current_price = current_price
    this.current_liquity = current_liquity
    this.fee_growth_global0 = fee_growth_global0
    this.fee_growth_global1 = fee_growth_global1
    this.payer = payer
  }

  /**
   * Get the minimum balance for the token swap account to be rent exempt
   *
   * @return Number of lamports required
   */
  static async getMinBalanceRentForExemptTokenSwap(connection: Connection): Promise<number> {
    return await connection.getMinimumBalanceForRentExemption(TokenSwapLayout.span)
  }

  static async getMinBalanceRentForExemptAccount(connection: Connection, length: number): Promise<number> {
    return await connection.getMinimumBalanceForRentExemption(length)
  }

  static createInitSwapInstruction(
    tokenSwapAccount: Account,
    authority: PublicKey,
    tokenAccountA: PublicKey,
    tokenAccountB: PublicKey,
    tick_map_pubkey: PublicKey,
    tick_detail_key: PublicKey,
    tick_position_key: PublicKey,
    user_position_key: PublicKey,
    tokenProgramId: PublicKey,
    swapProgramId: PublicKey,
    nonce: number,
    curveType: number,
    fee: number,
    tick_space: number,
    current_price: number
  ): TransactionInstruction {
    const keys = [
      { pubkey: tokenSwapAccount.publicKey, isSigner: false, isWritable: true },
      { pubkey: authority, isSigner: false, isWritable: false },
      { pubkey: tokenAccountA, isSigner: false, isWritable: false },
      { pubkey: tokenAccountB, isSigner: false, isWritable: false },
      { pubkey: tick_map_pubkey, isSigner: false, isWritable: false },
      { pubkey: tick_detail_key, isSigner: false, isWritable: false },
      { pubkey: tick_position_key, isSigner: false, isWritable: false },
      { pubkey: user_position_key, isSigner: false, isWritable: false },
      { pubkey: tokenProgramId, isSigner: false, isWritable: false },
      { pubkey: ORACLE_PRAGRAM_ID, isSigner: false, isWritable: false }
    ]
    const commandDataLayout = BufferLayout.struct([
      BufferLayout.u8('instruction'),
      BufferLayout.u8('nonce'),
      BufferLayout.u8('curveType'),
      BufferLayout.u32('fee'),
      BufferLayout.u32('tick_space'),
      BufferLayout.u32('tick_append_index'),
      BufferLayout.u32('user_postion_index'),
      Layout.uint128('current_price'),
      Layout.uint128('current_liquity'),
      Layout.uint128('fee_growth_global0'),
      Layout.uint128('fee_growth_global1')
    ])
    const data = Buffer.alloc(commandDataLayout.span)
    // eslint-disable-next-line no-lone-blocks
    {
      commandDataLayout.encode(
        {
          instruction: 0, // InitializeSwap instruction
          nonce,
          curveType,
          fee,
          tick_space,
          tick_append_index: 0,
          user_position_index: 0,
          current_price: new Numberu128(current_price).toBuffer(),
          current_liquity: new Numberu128(0).toBuffer(),
          fee_growth_global0: new Numberu128(0).toBuffer(),
          fee_growth_global1: new Numberu128(0).toBuffer()
        },
        data
      )
    }
    return new TransactionInstruction({
      keys,
      programId: swapProgramId,
      data
    })
  }

  static async loadTokenSwap(
    connection: Connection,
    address: PublicKey,
    programId: PublicKey,
    payer: Account
  ): Promise<TokenSwap> {
    const data = await loadAccount(connection, address, programId)
    const tokenSwapData = TokenSwapLayout.decode(data)
    if (!tokenSwapData.isInitialized) {
      throw new Error(`Invalid token swap state`)
    }

    const [authority] = await PublicKey.findProgramAddress([address.toBuffer()], programId)
    const tokenAccountA = new PublicKey(tokenSwapData.tokenAccountA)
    const tokenAccountB = new PublicKey(tokenSwapData.tokenAccountB)
    const mintA = new PublicKey(tokenSwapData.mintA)
    const mintB = new PublicKey(tokenSwapData.mintB)
    const tick_map_pubkey = new PublicKey(tokenSwapData.tick_map_pubkey)
    const tick_detail_key = new PublicKey(tokenSwapData.tick_detail_key)
    const tick_position_key = new PublicKey(tokenSwapData.tick_position_key)
    const user_position_key = new PublicKey(tokenSwapData.user_position_key)
    const tokenProgramId = new PublicKey(tokenSwapData.tokenProgramId)
    console.log('the token a pool is ', tokenAccountA.toString())
    console.log('the token b pool is ', tokenAccountB.toString())
    console.log('the mint a is ', mintA.toString())
    console.log('the mint b is ', mintB.toString())
    console.log('the tick_map_pubkey is ', tick_map_pubkey.toString())
    console.log('the tick_detail_key is ', tick_detail_key.toString())
    console.log('the tick_position_key is ', tick_position_key.toString())
    console.log('the user_position_key is ', user_position_key.toString())
    console.log('the tokenProgramId is ', tokenProgramId.toString())
    const curveType = tokenSwapData.curveType
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // eslint-disable-next-line no-unused-vars
    const fee = tokenSwapData.fee
    const tick_space = tokenSwapData.tick_space
    const tick_append_index = tokenSwapData.tick_append_index
    const user_position_index = tokenSwapData.tick_append_index
    const current_price = Numberu128.fromBuffer(tokenSwapData.current_price).toNumber()
    const current_liquity = Numberu128.fromBuffer(tokenSwapData.current_liquity).toNumber()
    const fee_growth_global0 = Numberu128.fromBuffer(tokenSwapData.fee_growth_global0).toNumber()
    const fee_growth_global1 = Numberu128.fromBuffer(tokenSwapData.fee_growth_global1).toNumber()
    console.log('the current_price is ', current_price)
    console.log('the current_liquity is ', current_liquity)
    return new TokenSwap(
      connection,
      address,
      programId,
      tokenProgramId,
      authority,
      tokenAccountA,
      tokenAccountB,
      mintA,
      mintB,
      tick_map_pubkey,
      tick_detail_key,
      tick_position_key,
      user_position_key,
      curveType,
      0,
      tick_space,
      tick_append_index,
      user_position_index,
      current_price,
      current_liquity,
      fee_growth_global0,
      fee_growth_global1,
      payer
    )
  }

  /**
   * Create a new Token Swap
   *
   * @param connection The connection to use
   * @param payer Pays for the transaction
   * @param tokenSwapAccount The token swap account
   * @param authority The authority over the swap and accounts
   * @param nonce The nonce used to generate the authority
   * @param tokenAccountA: The token swap's Token A account
   * @param tokenAccountB: The token swap's Token B account
   * @param poolToken The pool token
   * @param tokenAccountPool The token swap's pool token account
   * @param tokenProgramId The program ID of the token program
   * @param swapProgramId The program ID of the token-swap program
   * @param feeNumerator Numerator of the fee ratio
   * @param feeDenominator Denominator of the fee ratio
   * @return Token object for the newly minted token, Public key of the account holding the total supply of new tokens
   */
  static async createTokenSwap(
    connection: Connection,
    payer: Account,
    tokenSwapAccount: Account,
    authority: PublicKey,
    tokenAccountA: PublicKey,
    tokenAccountB: PublicKey,
    mintA: PublicKey,
    mintB: PublicKey,
    tick_map_pubkey: PublicKey,
    tick_detail_key: PublicKey,
    tick_position_key: PublicKey,
    user_position_key: PublicKey,
    swapProgramId: PublicKey,
    tokenProgramId: PublicKey,
    nonce: number,
    curveType: number,
    fee: number,
    tick_space: number,
    current_price: number
  ): Promise<TokenSwap> {
    console.log('create toke swap program id is ', swapProgramId.toString())
    const tokenSwap = new TokenSwap(
      connection,
      tokenSwapAccount.publicKey,
      swapProgramId,
      tokenProgramId,
      authority,
      tokenAccountA,
      tokenAccountB,
      mintA,
      mintB,
      tick_map_pubkey,
      tick_detail_key,
      tick_position_key,
      user_position_key,
      curveType,
      fee,
      tick_space,
      0,
      0,
      current_price,
      0,
      0,
      0,
      payer
    )

    // Allocate memory for the account
    const balanceNeeded = await TokenSwap.getMinBalanceRentForExemptTokenSwap(connection)
    const tick_map_length = 221824
    const tick_position_length = 1774592
    const tick_info_length = 64000
    const user_positon_length = 36000
    const tick_map_balance = await TokenSwap.getMinBalanceRentForExemptAccount(connection, tick_map_length)
    const tick_position_balance = await TokenSwap.getMinBalanceRentForExemptAccount(connection, tick_position_length)
    const tick_info_balance = await TokenSwap.getMinBalanceRentForExemptAccount(connection, tick_info_length)
    const user_position_balance = await TokenSwap.getMinBalanceRentForExemptAccount(connection, user_positon_length)
    const transaction = new Transaction()
    transaction.add(
      SystemProgram.createAccount({
        fromPubkey: payer.publicKey,
        newAccountPubkey: tokenSwapAccount.publicKey,
        lamports: balanceNeeded,
        space: TokenSwapLayout.span,
        programId: swapProgramId
      }),
      SystemProgram.createAccount({
        fromPubkey: payer.publicKey,
        newAccountPubkey: tick_map_pubkey,
        lamports: tick_map_balance,
        space: 221824,
        programId: swapProgramId
      }),
      SystemProgram.createAccount({
        fromPubkey: payer.publicKey,
        newAccountPubkey: tick_position_key,
        lamports: tick_position_balance,
        space: 1774592,
        programId: swapProgramId
      }),
      SystemProgram.createAccount({
        fromPubkey: payer.publicKey,
        newAccountPubkey: tick_detail_key,
        lamports: tick_info_balance,
        space: 64000,
        programId: swapProgramId
      }),
      SystemProgram.createAccount({
        fromPubkey: payer.publicKey,
        newAccountPubkey: user_position_key,
        lamports: user_position_balance,
        space: 36000,
        programId: swapProgramId
      })
    )
    const instruction = TokenSwap.createInitSwapInstruction(
      tokenSwapAccount,
      authority,
      tokenAccountA,
      tokenAccountB,
      tick_map_pubkey,
      tick_detail_key,
      tick_position_key,
      user_position_key,
      tokenProgramId,
      swapProgramId,
      nonce,
      curveType,
      fee,
      tick_space,
      current_price
    )

    transaction.add(instruction)
    await sendAndConfirmTransaction(
      'createAccount and InitializeSwap',
      connection,
      transaction,
      payer,
      tokenSwapAccount,
      amm_test.tick_map_account,
      amm_test.tick_info_account,
      amm_test.tick_position_account,
      amm_test.user_postion_account
    )
    return tokenSwap
  }

  /**
   * Swap token A for token B
   *
   * @param userSource User's source token account
   * @param poolSource Pool's source token account
   * @param poolDestination Pool's destination token account
   * @param userDestination User's destination token account
   * @param hostFeeAccount Host account to gather fees
   * @param userTransferAuthority Account delegated to transfer user's tokens
   * @param amountIn Amount to transfer from source account
   * @param minimumAmountOut Minimum amount of tokens the user will receive
   */
  async swap(
    userSource: PublicKey,
    userDestination: PublicKey,
    userTransferAuthority: Account,
    amountIn: number | Numberu64,
    minimumAmountOut: number | Numberu64
  ): Promise<TransactionSignature> {
    return await sendAndConfirmTransaction(
      'swap',
      this.connection,
      new Transaction().add(
        TokenSwap.swapInstruction(
          this.tokenSwap,
          this.authority,
          userTransferAuthority.publicKey,
          userSource,
          userDestination,
          this.tokenAccountA,
          this.tokenAccountB,
          this.tick_map_pubkey,
          this.tick_position_key,
          this.tick_detail_key,
          this.swapProgramId,
          this.tokenProgramId,
          amountIn,
          minimumAmountOut
        )
      ),
      this.payer,
      userTransferAuthority
    )
  }

  static swapInstruction(
    tokenSwap: PublicKey,
    authority: PublicKey,
    userTransferAuthority: PublicKey,
    userSource: PublicKey,
    userDestination: PublicKey,
    swapSource: PublicKey,
    swapDestination: PublicKey,
    tick_map_key: PublicKey,
    tick_position_key: PublicKey,
    tick_info_key: PublicKey,
    swapProgramId: PublicKey,
    tokenProgramId: PublicKey,
    amountIn: number | Numberu64,
    minimumAmountOut: number | Numberu64
  ): TransactionInstruction {
    const dataLayout = BufferLayout.struct([
      BufferLayout.u8('instruction'),
      Layout.uint64('amountIn'),
      Layout.uint64('minimumAmountOut')
    ])

    const data = Buffer.alloc(dataLayout.span)
    dataLayout.encode(
      {
        instruction: 1, // Swap instruction
        amountIn: new Numberu64(amountIn).toBuffer(),
        minimumAmountOut: new Numberu64(minimumAmountOut).toBuffer()
      },
      data
    )
    const keys = [
      { pubkey: tokenSwap, isSigner: false, isWritable: true },
      { pubkey: authority, isSigner: false, isWritable: false },
      { pubkey: userTransferAuthority, isSigner: true, isWritable: false },
      { pubkey: userSource, isSigner: false, isWritable: true },
      { pubkey: userDestination, isSigner: false, isWritable: true },
      { pubkey: swapSource, isSigner: false, isWritable: true },
      { pubkey: swapDestination, isSigner: false, isWritable: true },
      { pubkey: tick_map_key, isSigner: false, isWritable: true },
      { pubkey: tick_position_key, isSigner: false, isWritable: true },
      { pubkey: tick_info_key, isSigner: false, isWritable: true },
      { pubkey: tokenProgramId, isSigner: false, isWritable: false }
    ]
    return new TransactionInstruction({
      keys,
      programId: swapProgramId,
      data
    })
  }

  /**
   * Deposit tokens into the pool
   * @param userAccountA User account for token A
   * @param userAccountB User account for token B
   * @param poolAccount User account for pool token
   * @param userTransferAuthority Account delegated to transfer user's tokens
   * @param poolTokenAmount Amount of pool tokens to mint
   * @param maximumTokenA The maximum amount of token A to deposit
   * @param maximumTokenB The maximum amount of token B to deposit
   */
  async depositAllTokenTypes(
    userAccountA: PublicKey,
    userAccountB: PublicKey,
    userTransferAuthority: Account,
    nft_mint_pubkey: PublicKey,
    user_nft_pubkey: PublicKey,
    new_position: number,
    tick_lower: number,
    tick_upper: number,
    liquity_mount: number | Numberu64,
    maximumTokenA: number | Numberu64,
    maximumTokenB: number | Numberu64,
    user_position_index: number | Numberu64
  ): Promise<TransactionSignature> {
    return await sendAndConfirmTransaction(
      'depositAllTokenTypes',
      this.connection,
      new Transaction().add(
        TokenSwap.depositAllTokenTypesInstruction(
          this.tokenSwap,
          this.authority,
          userTransferAuthority.publicKey,
          userAccountA,
          userAccountB,
          this.tokenAccountA,
          this.tokenAccountB,
          nft_mint_pubkey,
          user_nft_pubkey,
          this.tick_map_pubkey,
          this.tick_position_key,
          this.tick_detail_key,
          this.user_position_key,
          this.swapProgramId,
          this.tokenProgramId,
          new_position,
          tick_lower,
          tick_upper,
          liquity_mount,
          maximumTokenA,
          maximumTokenB,
          user_position_index
        )
      ),
      this.payer,
      userTransferAuthority
    )
  }

  static depositAllTokenTypesInstruction(
    tokenSwap: PublicKey,
    authority: PublicKey,
    userTransferAuthority: PublicKey,
    sourceA: PublicKey,
    sourceB: PublicKey,
    intoA: PublicKey,
    intoB: PublicKey,
    nft_mint_pubkey: PublicKey,
    user_nft_pubkey: PublicKey,
    tick_map_key: PublicKey,
    tick_position_key: PublicKey,
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    user_position_index: number | Numberu64
  ): TransactionInstruction {
    const dataLayout = BufferLayout.struct([
      BufferLayout.u8('instruction'),
      BufferLayout.u8('new_position'),
      Layout.uint64('liquity_amount'),
      BufferLayout.u32('tick_lower'),
      BufferLayout.u32('tick_upper'),
      Layout.uint64('maximumTokenA'),
      Layout.uint64('maximumTokenB'),
      Layout.uint64('user_position_index')
    ])

    const data = Buffer.alloc(dataLayout.span)
    dataLayout.encode(
      {
        instruction: 2, // Deposit instruction
        // eslint-disable-next-line object-shorthand
        new_position: new_position,
        liquity_amount: new Numberu64(liquity_amount).toBuffer(),
        // eslint-disable-next-line object-shorthand
        tick_lower: tick_lower,
        // eslint-disable-next-line object-shorthand
        tick_upper: tick_upper,
        maximumTokenA: new Numberu64(maximumTokenA).toBuffer(),
        maximumTokenB: new Numberu64(maximumTokenB).toBuffer(),
        user_position_index: new Numberu64(0).toBuffer()
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
      { pubkey: tick_map_key, isSigner: false, isWritable: true },
      { pubkey: tick_position_key, isSigner: false, isWritable: true },
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

  /**
   * Withdraw tokens from the pool
   *
   * @param userAccountA User account for token A
   * @param userAccountB User account for token B
   * @param poolAccount User account for pool token
   * @param userTransferAuthority Account delegated to transfer user's tokens
   * @param poolTokenAmount Amount of pool tokens to burn
   * @param minimumTokenA The minimum amount of token A to withdraw
   * @param minimumTokenB The minimum amount of token B to withdraw
   */
  async withdrawAllTokenTypes(
    userAccountA: PublicKey,
    userAccountB: PublicKey,
    userTransferAuthority: Account,
    nft_mint_pubkey: PublicKey,
    user_nft_pubkey: PublicKey,
    liquity_amount: number | Numberu64,
    minimumTokenA: number | Numberu64,
    minimumTokenB: number | Numberu64,
    user_position_index: number | Numberu64
  ): Promise<TransactionSignature> {
    return await sendAndConfirmTransaction(
      'withdraw',
      this.connection,
      new Transaction().add(
        TokenSwap.withdrawAllTokenTypesInstruction(
          this.tokenSwap,
          this.authority,
          userTransferAuthority.publicKey,
          this.tokenAccountA,
          this.tokenAccountB,
          userAccountA,
          userAccountB,
          nft_mint_pubkey,
          user_nft_pubkey,
          this.tick_map_pubkey,
          this.tick_position_key,
          this.tick_detail_key,
          this.user_position_key,
          this.swapProgramId,
          this.tokenProgramId,
          liquity_amount,
          minimumTokenA,
          minimumTokenB,
          user_position_index
        )
      ),
      this.payer,
      userTransferAuthority
    )
  }

  static withdrawAllTokenTypesInstruction(
    tokenSwap: PublicKey,
    authority: PublicKey,
    userTransferAuthority: PublicKey,
    fromA: PublicKey,
    fromB: PublicKey,
    userAccountA: PublicKey,
    userAccountB: PublicKey,
    nft_mint_pubkey: PublicKey,
    user_nft_pubkey: PublicKey,
    tick_map_key: PublicKey,
    tick_position_key: PublicKey,
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
      { pubkey: tick_map_key, isSigner: false, isWritable: true },
      { pubkey: tick_position_key, isSigner: false, isWritable: true },
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

  /**
   * claim tokens from the v3 pool
   *
   * @param userAccountA User account for token A
   * @param userAccountB User account for token B
   * @param poolAccount User account for pool token
   * @param userTransferAuthority Account delegated to transfer user's tokens
   * @param poolTokenAmount Amount of pool tokens to burn
   * @param minimumTokenA The minimum amount of token A to withdraw
   * @param minimumTokenB The minimum amount of token B to withdraw
   */
  async claim(
    userAccountA: PublicKey,
    userAccountB: PublicKey,
    user_account: Account,
    user_nft_pubkey: PublicKey,
    user_position_index: number | Numberu64
  ): Promise<TransactionSignature> {
    return await sendAndConfirmTransaction(
      'claim',
      this.connection,
      new Transaction().add(
        TokenSwap.claimInstruction(
          this.tokenSwap,
          this.authority,
          user_account.publicKey,
          this.tokenAccountA,
          this.tokenAccountB,
          userAccountA,
          userAccountB,
          user_nft_pubkey,
          this.tick_map_pubkey,
          this.tick_position_key,
          this.tick_detail_key,
          this.user_position_key,
          this.swapProgramId,
          this.tokenProgramId,
          user_position_index
        )
      ),
      this.payer,
      user_account
    )
  }

  static claimInstruction(
    tokenSwap: PublicKey,
    authority: PublicKey,
    user_account_key: PublicKey,
    fromA: PublicKey,
    fromB: PublicKey,
    userAccountA: PublicKey,
    userAccountB: PublicKey,
    user_nft_pubkey: PublicKey,
    tick_map_key: PublicKey,
    tick_position_key: PublicKey,
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
      { pubkey: tick_map_key, isSigner: false, isWritable: false },
      { pubkey: tick_position_key, isSigner: false, isWritable: false },
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
}
