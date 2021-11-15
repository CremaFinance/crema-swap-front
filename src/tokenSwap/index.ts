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
export const SWAPV3_PROGRAMID: PublicKey = new PublicKey(
  //'VenTxqaDv4Mj2krfs5Xahf23owM2MCVDQmTR1Qxj7J5',
  'C8L7YYHrn38sKfAxVo5BFsGYFWcLeRAdaavVNfzg9s5N'
)

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

export class Number128 extends BN {
  /**
   * Convert to Buffer representation
   */
  toBuffer(): Buffer {
    const a = super.toArray().reverse()
    const b = Buffer.from(a)
    if (b.length === 16) {
      return b
    }
    assert(b.length < 16, 'Number128 too large')

    const zeroPad = Buffer.alloc(16)
    b.copy(zeroPad)
    return zeroPad
  }

  /**
   * Construct a Numberu64 from Buffer representation
   */
  static fromBuffer(buffer: Buffer): Number128 {
    assert(buffer.length === 16, `Invalid buffer length: ${buffer.length}`)
    let negtive = false
    if (buffer[15] >= 0x80) {
      negtive = true
    }
    let tmp: Number128
    if (negtive === true) {
      tmp = new Number128(
        [...buffer]
          .reverse()
          // eslint-disable-next-line unicorn/number-literal-case
          .map((i) => `00${Math.abs(~i & 0xff).toString(16)}`.slice(-2))
          .join(''),
        16
      )
      tmp = tmp.add(new BN(1))
    } else {
      tmp = new Number128(
        [...buffer]
          .reverse()
          // eslint-disable-next-line unicorn/number-literal-case
          .map((i) => `00${Math.abs(i & 0xff).toString(16)}`.slice(-2))
          .join(''),
        16
      )
    }
    if (negtive) {
      tmp.ineg()
    }
    return tmp
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
  Layout.publicKey('tick_detail_key'),
  Layout.publicKey('user_position_key'),
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

export class UserPosition {
  constructor(
    private connection: Connection,
    public nft_token_id: PublicKey,
    public lower_tick: number,
    public upper_tick: number,
    public liquity: Numberu128,
    public fee_growth_inside_a_last: Numberu128,
    public fee_growth_inside_b_last: Numberu128,
    public token_a_fee: Numberu128,
    public token_b_fee: Numberu128
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
    let array = new Array<UserPosition>()
    for (let i = 0; i < length; i++) {
      const userPositionData = UserPositionLayout.decode(
        data.slice(i * UserPositionLayout.span, (i + 1) * UserPositionLayout.span)
      )
      const nft_token_id = new PublicKey(userPositionData.nft_token_id)
      const liquity = Numberu128.fromBuffer(userPositionData.liquity)
      const lower_tick = userPositionData.lower_tick
      const upper_tick = userPositionData.upper_tick
      const fee_growth_inside_a_last = Numberu128.fromBuffer(userPositionData.fee_growth_inside_a_last)
      const fee_growth_inside_b_last = Numberu128.fromBuffer(userPositionData.fee_growth_inside_b_last)
      const token_a_fee = Numberu128.fromBuffer(userPositionData.token_a_fee)
      const token_b_fee = Numberu128.fromBuffer(userPositionData.token_b_fee)
      let userPostion = new UserPosition(
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

  static async getUserPositionIdx(
    connection: Connection,
    address: PublicKey,
    nft_pubkey: PublicKey,
    programId: PublicKey,
    length: number
  ): Promise<{ index: number; new_flag: number }> {
    let array = await UserPosition.loadUserPosition(connection, address, programId, length)
    for (let i = 0; i < length; i++) {
      if (array[i].nft_token_id.equals(nft_pubkey)) {
        console.log('there already exist deposit user ', nft_pubkey.toString())
        return { index: i, new_flag: 1 }
      }
    }
    console.log('there not exist deposit user ', nft_pubkey.toString())
    return { index: length, new_flag: 0 }
  }
}
export const TickInfoLayout = BufferLayout.struct([
  Layout.int32('tick'),
  Layout.uint128('tick_price'),
  Layout.uint128('liquity_gross'),
  Layout.uint128('liquity_net'),
  Layout.uint128('fee_growth_outside_a'),
  Layout.uint128('fee_growth_outside_b')
])
export class TickInfo {
  // unsigned int 引用这个tick得引用总和，不需要区分upper tick 和 lower tick，主要用来判断是否被position判断，可以用来计算费用
  // siged int  价格由左向右穿过时，流动性增加得净值
  constructor(
    private connection: Connection,
    public tick: number,
    public tick_price: Numberu128,
    public liquity_gross: Numberu128,
    public liquity_net: Number128,
    public feeGrowthOutside0: Numberu128,
    public feeGrowthOutside1: Numberu128
  ) {
    this.connection = connection
    this.tick = tick
    this.tick_price = tick_price
    this.liquity_gross = liquity_gross
    this.liquity_net = liquity_net
    this.feeGrowthOutside0 = feeGrowthOutside0
    this.feeGrowthOutside1 = feeGrowthOutside1
  }

  static async loadTickInfo(
    connection: Connection,
    address: PublicKey,
    programId: PublicKey,
    length: number
  ): Promise<Array<TickInfo>> {
    const data = await loadAccount(connection, address, programId)
    // eslint-disable-next-line no-array-constructor
    let array = new Array<TickInfo>()
    for (let i = 0; i < length; i++) {
      const tickInfoData = TickInfoLayout.decode(data.slice(i * TickInfoLayout.span, (i + 1) * TickInfoLayout.span))
      // const tick = tickInfoData.tick.readInt32LE()
      const tick = Buffer.from(tickInfoData.tick).readInt32LE(0)
      const tick_price = Numberu128.fromBuffer(tickInfoData.tick_price)
      const liquity_gross = Numberu128.fromBuffer(tickInfoData.liquity_gross)
      const liquity_net = Number128.fromBuffer(tickInfoData.liquity_net)
      const fee_growth_outside_a = Numberu128.fromBuffer(tickInfoData.fee_growth_outside_a)
      const fee_growth_outside_b = Numberu128.fromBuffer(tickInfoData.fee_growth_outside_b)
      let userPostion = new TickInfo(
        connection,
        tick,
        tick_price,
        liquity_gross,
        liquity_net,
        fee_growth_outside_a,
        fee_growth_outside_b
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
    public tick_detail_key: PublicKey,
    public user_position_key: PublicKey,
    public curveType: number,
    public fee: number,
    public tick_space: number,
    public tick_append_index: number,
    public user_postion_index: number,
    public current_price: Numberu128,
    public current_liquity: Numberu128,
    public fee_growth_global0: Numberu128,
    public fee_growth_global1: Numberu128,
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
    this.tick_detail_key = tick_detail_key
    this.user_position_key = user_position_key
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
    tick_detail_key: PublicKey,
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
      { pubkey: tick_detail_key, isSigner: false, isWritable: false },
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
    // {
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
    // }
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
    const tick_detail_key = new PublicKey(tokenSwapData.tick_detail_key)
    const user_position_key = new PublicKey(tokenSwapData.user_position_key)
    const tokenProgramId = new PublicKey(tokenSwapData.tokenProgramId)
    console.log('the token a pool is ', tokenAccountA.toString())
    console.log('the token b pool is ', tokenAccountB.toString())
    console.log('the mint a is ', mintA.toString())
    console.log('the mint b is ', mintB.toString())
    console.log('the tick_detail_key is ', tick_detail_key.toString())
    console.log('the user_position_key is ', user_position_key.toString())
    console.log('the tokenProgramId is ', tokenProgramId.toString())
    const curveType = tokenSwapData.curveType
    const fee = tokenSwapData.fee
    const tick_space = tokenSwapData.tick_space
    const tick_append_index = tokenSwapData.tick_append_index
    const user_position_index = tokenSwapData.user_position_index
    const current_price = Numberu128.fromBuffer(tokenSwapData.current_price)
    const current_liquity = Numberu128.fromBuffer(tokenSwapData.current_liquity)
    const fee_growth_global0 = Numberu128.fromBuffer(tokenSwapData.fee_growth_global0)
    const fee_growth_global1 = Numberu128.fromBuffer(tokenSwapData.fee_growth_global1)
    console.log('the fee is ', fee)
    console.log('the current_price is ', current_price.toString())
    console.log('the current_liquity is ', current_liquity.toString())
    console.log('the user append index is', user_position_index)
    console.log('the fee_growth_global0 is %d', fee_growth_global0.toString())
    console.log('the fee_growth_global1 is %d', fee_growth_global1.toString())
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
      tick_detail_key,
      user_position_key,
      curveType,
      fee,
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
    tick_info_account: Account,
    user_postion_account: Account,
    authority: PublicKey,
    tokenAccountA: PublicKey,
    tokenAccountB: PublicKey,
    mintA: PublicKey,
    mintB: PublicKey,
    tick_detail_key: PublicKey,
    user_position_key: PublicKey,
    swapProgramId: PublicKey,
    tokenProgramId: PublicKey,
    nonce: number,
    curveType: number,
    fee: number,
    tick_space: number,
    current_price: number
  ): Promise<TokenSwap> {
    let transaction
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
      tick_detail_key,
      user_position_key,
      curveType,
      fee,
      tick_space,
      0,
      0,
      new Numberu64(current_price),
      new Numberu64(0),
      new Numberu64(0),
      new Numberu64(0),
      payer
    )

    // Allocate memory for the account
    const balanceNeeded = await TokenSwap.getMinBalanceRentForExemptTokenSwap(connection)
    let tick_info_length = 64000
    let user_positon_length = 36000
    let tick_info_balance = await TokenSwap.getMinBalanceRentForExemptAccount(connection, tick_info_length)
    let user_position_balance = await TokenSwap.getMinBalanceRentForExemptAccount(connection, user_positon_length)
    transaction = new Transaction()
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
        newAccountPubkey: tick_detail_key,
        lamports: tick_info_balance,
        space: 84000,
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
      tick_detail_key,
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
      tick_info_account,
      user_postion_account
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
    tick_lower: number,
    tick_upper: number,
    liquity_mount: number | Numberu64,
    maximumTokenA: number | Numberu64,
    maximumTokenB: number | Numberu64
  ): Promise<TransactionSignature> {
    let { index: user_position_index, new_flag: new_position } = await UserPosition.getUserPositionIdx(
      this.connection,
      this.user_position_key,
      user_nft_pubkey,
      this.swapProgramId,
      this.user_postion_index
    )
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
    minimumTokenB: number | Numberu64
  ): Promise<TransactionSignature> {
    let { index: user_position_index, new_flag: new_position } = await UserPosition.getUserPositionIdx(
      this.connection,
      this.user_position_key,
      user_nft_pubkey,
      this.swapProgramId,
      this.user_postion_index
    )
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
    user_nft_pubkey: PublicKey
  ): Promise<TransactionSignature> {
    let { index: user_position_index, new_flag: new_position } = await UserPosition.getUserPositionIdx(
      this.connection,
      this.user_position_key,
      user_nft_pubkey,
      this.swapProgramId,
      this.user_postion_index
    )
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
}
