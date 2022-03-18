import assert from 'assert'
import BN from 'bn.js'
import { Buffer } from 'buffer'
import * as BufferLayout from 'buffer-layout'
import {
  Connection,
  GetProgramAccountsConfig,
  GetProgramAccountsFilter,
  Keypair,
  MemcmpFilter,
  TransactionSignature
} from '@solana/web3.js'
import type { Signer } from '@solana/web3.js'
import { Account, PublicKey, SystemProgram, Transaction, TransactionInstruction } from '@solana/web3.js'

import * as Layout from './layout'
import { sendAndConfirmTransaction } from './util/send-and-confirm-transaction'
import { deserializeTickInfo, deserializeTokenSwapAccount, deserializeUserPositionn, loadAccount } from './util/account'
import { AccountLayout, MintLayout, Token, TOKEN_PROGRAM_ID } from '@solana/spl-token'
export const ORACLE_PRAGRAM_ID = new PublicKey('gSbePebfvPy7tRqimPoVecS2UsBvYv46ynrzWocc92s')
export const INIT_PUBKEY = new PublicKey('11111111111111111111111111111111')
export const USER_POSITION_LENGTH = 360000
export const MAX_USER_POSITION_COUNT = Math.floor((USER_POSITION_LENGTH - 38) / 120)
export const TICK_INFO_LENGTH = 504000
// export const TICK_INFO_LENGTH = 840000
export const SWAPV3_PROGRAMID: PublicKey = new PublicKey(
  //'VenTxqaDv4Mj2krfs5Xahf23owM2MCVDQmTR1Qxj7J5',
  //'C8L7YYHrn38sKfAxVo5BFsGYFWcLeRAdaavVNfzg9s5N'
  '6MLxLqiXaaSUpkgMnWDTuejNZEz3kE7k2woyHGVFw319'
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

export class Numberu256 extends BN {
  /**
   * Convert to Buffer representation
   */
  toBuffer(): Buffer {
    const a = super.toArray().reverse()
    const b = Buffer.from(a)
    if (b.length === 32) {
      return b
    }
    assert(b.length < 32, 'Numberu256 too large')

    const zeroPad = Buffer.alloc(32)
    b.copy(zeroPad)
    return zeroPad
  }

  /**
   * Construct a Numberu64 from Buffer representation
   */
  static fromBuffer(buffer: Buffer): Numberu256 {
    assert(buffer.length === 32, `Invalid buffer length: ${buffer.length}`)
    return new Numberu256(
      [...buffer]
        .reverse()
        .map((i) => `00${i.toString(16)}`.slice(-2))
        .join(''),
      32
    )
  }
}

export const TokenSwapLayout = BufferLayout.struct([
  Layout.publicKey('swapTokenPubkey'),
  BufferLayout.u8('accountType'),
  BufferLayout.u8('version'),
  BufferLayout.u8('isInitialized'),
  BufferLayout.u8('nonce'),
  Layout.publicKey('tokenProgramId'),
  Layout.publicKey('managerKey'),
  Layout.publicKey('managerTokenAKey'),
  Layout.publicKey('managerTokenBKey'),
  Layout.publicKey('tokenAccountA'),
  Layout.publicKey('tokenAccountB'),
  Layout.publicKey('mintA'),
  Layout.publicKey('mintB'),
  Layout.publicKey('tick_detail_key'),
  Layout.publicKey('user_position_key'),
  BufferLayout.u8('curveType'),
  Layout.uint64('fee'),
  Layout.uint64('manager_fee'),
  BufferLayout.u32('tick_space'),
  Layout.uint128('current_price'),
  Layout.uint128('current_liquity'),
  Layout.uint128('fee_growth_global0'),
  Layout.uint128('fee_growth_global1'),
  Layout.uint128('manager_fee_a'),
  Layout.uint128('manager_fee_b')
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
    public nft_token_id: PublicKey,
    public lower_tick: number,
    public upper_tick: number,
    public liquity: Numberu128,
    public fee_growth_inside_a_last: Numberu128,
    public fee_growth_inside_b_last: Numberu128,
    public token_a_fee: Numberu128,
    public token_b_fee: Numberu128
  ) {
    this.nft_token_id = nft_token_id
    this.lower_tick = lower_tick
    this.upper_tick = upper_tick
    this.liquity = liquity
    this.fee_growth_inside_a_last = fee_growth_inside_a_last
    this.fee_growth_inside_b_last = fee_growth_inside_b_last
    this.token_a_fee = token_a_fee
    this.token_b_fee = token_b_fee
  }
}

export class UserPositionsAccount {
  constructor(public pubkey: PublicKey, public user_positions: Array<UserPosition>) {
    this.pubkey = pubkey
    this.user_positions = user_positions
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
    public tick: number,
    public tick_price: Numberu128,
    public liquity_gross: Numberu128,
    public liquity_net: Number128,
    public feeGrowthOutside0: Numberu128,
    public feeGrowthOutside1: Numberu128
  ) {
    this.tick = tick
    this.tick_price = tick_price
    this.liquity_gross = liquity_gross
    this.liquity_net = liquity_net
    this.feeGrowthOutside0 = feeGrowthOutside0
    this.feeGrowthOutside1 = feeGrowthOutside1
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
    public connection: Connection,
    public tokenSwap: PublicKey,
    public swapProgramId: PublicKey,
    public tokenProgramId: PublicKey,
    public authority: PublicKey,
    public managerKey: PublicKey,
    public managerTokenAKey: PublicKey,
    public managerTokenBKey: PublicKey,
    public tokenAccountA: PublicKey,
    public tokenAccountB: PublicKey,
    public mintA: PublicKey,
    public mintB: PublicKey,
    public tick_detail_key: PublicKey,
    public user_position_key: PublicKey,
    public curveType: number,
    public fee: Numberu64,
    public managerFee: Numberu64,
    public tick_space: number,
    public current_price: Numberu128,
    public current_liquity: Numberu128,
    public fee_growth_global0: Numberu128,
    public fee_growth_global1: Numberu128,
    public manager_fee_a: Numberu128,
    public manager_fee_b: Numberu128,
    public tick_info_array: Array<TickInfo>,
    public user_position_account_array: Array<UserPositionsAccount>,
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
    this.managerFee = managerFee
    this.tick_space = tick_space
    this.current_price = current_price
    this.current_liquity = current_liquity
    this.fee_growth_global0 = fee_growth_global0
    this.fee_growth_global1 = fee_growth_global1
    this.manager_fee_a = manager_fee_a
    this.manager_fee_b = manager_fee_b
    this.payer = payer
    this.tick_info_array = tick_info_array
    this.user_position_account_array = user_position_account_array
  }

  toString() {
    console.log(
      'tokenSwap: %s, current_price: %s, fee: %s, managerFee: %s, fee_global_fee_a: %s, fee_global_fee_b: %s, manager_fee_a: %s, manager_fee_b: %s',
      this.tokenSwap.toString(),
      this.current_price.toString(),
      this.fee.toString(),
      this.managerFee.toString(),
      this.fee_growth_global0.toString(),
      this.fee_growth_global1.toString(),
      this.manager_fee_a.toString(),
      this.manager_fee_b.toString()
    )
    console.log('tick info:')
    for (let tick_info of this.tick_info_array) {
      console.log(
        'tick: %d, liquity_gross: %s, liquity_net: %s, outsid_fee_a: %s, outside_fee_b: %s',
        tick_info.tick.toString(),
        tick_info.liquity_gross,
        tick_info.liquity_net,
        tick_info.feeGrowthOutside0,
        tick_info.feeGrowthOutside1
      )
    }
    for (let user_position_account of this.user_position_account_array) {
      for (let user_postion of user_position_account.user_positions) {
        console.log(
          'nft: %s, lower_tick: %d, upper_tick: %d, liquity: %s, token_a_fee: %s, token_b_fee: %s, fee_a_last: %s, fee_b_last: %s',
          user_postion.nft_token_id.toString(),
          user_postion.lower_tick,
          user_postion.upper_tick,
          user_postion.liquity.toString(),
          user_postion.token_a_fee.toString(),
          user_postion.token_b_fee.toString(),
          user_postion.fee_growth_inside_a_last.toString(),
          user_postion.fee_growth_inside_b_last.toString()
        )
      }
    }
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
    managerKey: PublicKey,
    managerTokenAKey: PublicKey,
    managerTokenBKey: PublicKey,
    tokenAccountA: PublicKey,
    tokenAccountB: PublicKey,
    tick_detail_key: PublicKey,
    user_position_key: PublicKey,
    tokenProgramId: PublicKey,
    swapProgramId: PublicKey,
    nonce: number,
    curveType: number,
    fee: number,
    managerFee: number,
    tick_space: number,
    current_price: number
  ): TransactionInstruction {
    const keys = [
      { pubkey: tokenSwapAccount.publicKey, isSigner: false, isWritable: true },
      { pubkey: authority, isSigner: false, isWritable: false },
      { pubkey: managerKey, isSigner: false, isWritable: false },
      { pubkey: managerTokenAKey, isSigner: false, isWritable: false },
      { pubkey: managerTokenBKey, isSigner: false, isWritable: false },
      { pubkey: tokenAccountA, isSigner: false, isWritable: false },
      { pubkey: tokenAccountB, isSigner: false, isWritable: false },
      { pubkey: tick_detail_key, isSigner: false, isWritable: true },
      { pubkey: user_position_key, isSigner: false, isWritable: true },
      { pubkey: tokenProgramId, isSigner: false, isWritable: false }
    ]
    const commandDataLayout = BufferLayout.struct([
      BufferLayout.u8('instruction'),
      BufferLayout.u8('nonce'),
      BufferLayout.u8('curveType'),
      Layout.uint64('fee'),
      Layout.uint64('manager_fee'),
      BufferLayout.u32('tick_space'),
      Layout.uint128('current_price'),
      Layout.uint128('current_liquity'),
      Layout.uint128('fee_growth_global0'),
      Layout.uint128('fee_growth_global1'),
      Layout.uint128('manager_fee_a'),
      Layout.uint128('manager_fee_b')
    ])
    const data = Buffer.alloc(commandDataLayout.span)
    // {
    commandDataLayout.encode(
      {
        instruction: 0, // InitializeSwap instruction
        nonce,
        curveType,
        fee: new Numberu64(fee).toBuffer(),
        manager_fee: new Numberu64(managerFee).toBuffer(),
        tick_space,
        current_price: new Numberu128(current_price).toBuffer(),
        current_liquity: new Numberu128(0).toBuffer(),
        fee_growth_global0: new Numberu128(0).toBuffer(),
        fee_growth_global1: new Numberu128(0).toBuffer(),
        manager_fee_a: new Numberu128(0).toBuffer(),
        manager_fee_b: new Numberu128(0).toBuffer()
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

  choosePosition(): PublicKey | null {
    for (let i = 0; i < this.user_position_account_array.length; i++) {
      let length = this.user_position_account_array[i].user_positions.length
      if (length < MAX_USER_POSITION_COUNT) {
        let user_position_pubkey = this.user_position_account_array[i].pubkey
        return user_position_pubkey
      }
    }
    return null
  }

  getUserPositionIdx(nft_pubkey: PublicKey): { index: number; user_position_pubkey?: PublicKey } {
    for (let i = 0; i < this.user_position_account_array.length; i++) {
      let length = this.user_position_account_array[i].user_positions.length
      let user_position_pubkey = this.user_position_account_array[i].pubkey
      let user_position_array = this.user_position_account_array[i].user_positions
      for (let j = 0; j < length; j++) {
        if (user_position_array[j].nft_token_id.equals(nft_pubkey)) {
          console.log('there already exist deposit user ', nft_pubkey.toString())
          return { index: j, user_position_pubkey }
        }
      }
    }
    return { index: 0 }
  }

  static async getAllAccounts(
    connection: Connection,
    address: PublicKey,
    programId: PublicKey,
    payer: Account
  ): Promise<TokenSwap> {
    let tokenSwap: TokenSwap = new TokenSwap(
      connection,
      address,
      programId,
      TOKEN_PROGRAM_ID,
      INIT_PUBKEY,
      INIT_PUBKEY,
      INIT_PUBKEY,
      INIT_PUBKEY,
      INIT_PUBKEY,
      INIT_PUBKEY,
      INIT_PUBKEY,
      INIT_PUBKEY,
      INIT_PUBKEY,
      INIT_PUBKEY,
      0,
      new Numberu64(0),
      new Numberu64(0),
      0,
      new Numberu64(0),
      new Numberu64(0),
      new Numberu64(0),
      new Numberu64(0),
      new Numberu64(0),
      new Numberu64(0),
      // eslint-disable-next-line no-array-constructor
      new Array<TickInfo>(),
      // eslint-disable-next-line no-array-constructor
      new Array<UserPositionsAccount>(),
      payer
    )
    let memFilter: MemcmpFilter = {
      memcmp: {
        offset: 1,
        bytes: address.toBase58()
      }
    }
    let filters: GetProgramAccountsFilter[] = [memFilter]
    let config: GetProgramAccountsConfig = {
      encoding: 'base64',
      filters
    }
    const [authority] = await PublicKey.findProgramAddress([address.toBuffer()], programId)
    tokenSwap.authority = authority
    let accounts = await connection.getProgramAccounts(programId, config)
    // eslint-disable-next-line array-callback-return
    accounts.map((item) => {
      if (item.account.data.length === TokenSwapLayout.span) {
        deserializeTokenSwapAccount(item.account.data, tokenSwap)
      } else if (item.account.data.length === TICK_INFO_LENGTH) {
        deserializeTickInfo(item.account.data, tokenSwap)
        tokenSwap.tick_detail_key = item.pubkey
      } else if (item.account.data.length === USER_POSITION_LENGTH) {
        deserializeUserPositionn(item.account.data, item.pubkey, tokenSwap)
      }
    })
    return tokenSwap
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
    managerKey: PublicKey,
    managerTokenAKey: PublicKey,
    managerTokenBKey: PublicKey,
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
    managerFee: number,
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
      managerKey,
      managerTokenAKey,
      managerTokenBKey,
      tokenAccountA,
      tokenAccountB,
      mintA,
      mintB,
      tick_detail_key,
      user_position_key,
      curveType,
      new Numberu64(fee),
      new Numberu64(managerFee),
      tick_space,
      new Numberu64(current_price),
      new Numberu64(0),
      new Numberu64(0),
      new Numberu64(0),
      new Numberu64(0),
      new Numberu64(0),
      new Array<TickInfo>(0),
      new Array<UserPositionsAccount>(0),
      payer
    )
    // Allocate memory for the account
    const balanceNeeded = await TokenSwap.getMinBalanceRentForExemptTokenSwap(connection)
    let tick_info_length = TICK_INFO_LENGTH
    let user_positon_length = USER_POSITION_LENGTH
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
        space: tick_info_length,
        programId: swapProgramId
      }),
      SystemProgram.createAccount({
        fromPubkey: payer.publicKey,
        newAccountPubkey: user_position_key,
        lamports: user_position_balance,
        space: user_positon_length,
        programId: swapProgramId
      })
    )
    const instruction = TokenSwap.createInitSwapInstruction(
      tokenSwapAccount,
      authority,
      managerKey,
      managerTokenAKey,
      managerTokenBKey,
      tokenAccountA,
      tokenAccountB,
      tick_detail_key,
      user_position_key,
      tokenProgramId,
      swapProgramId,
      nonce,
      curveType,
      fee,
      managerFee,
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
    user_wallet_signer: Signer,
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
      user_wallet_signer,
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
    userTransferAuthority: Signer,
    user_mint_pubkey: PublicKey | null,
    user_nft_pubkey: PublicKey | null,
    tick_lower: number,
    tick_upper: number,
    liquity_mount: number | Numberu128,
    maximumTokenA: number | Numberu64,
    maximumTokenB: number | Numberu64,
    new_position: number
  ): Promise<TransactionSignature | null> {
    let result
    let user_position_key
    let index = 0
    let user_wallet_key = userTransferAuthority.publicKey
    if (new_position != 0 && user_mint_pubkey != null) {
      result = this.getUserPositionIdx(user_mint_pubkey)
      if (result.user_position_pubkey == null) {
        console.log("deposite old user: %s, but can't find in user position", user_mint_pubkey?.toString())
      }
      user_position_key = result.user_position_pubkey
      index = result.index
    } else {
      user_position_key = this.choosePosition()
    }
    let transaction = new Transaction()
    let instruction
    if (new_position === 0 && user_position_key != null) {
      let { mintTrans, mintAccount } = await TokenSwap.createMintInstruction(
        this.connection,
        userTransferAuthority,
        this.authority
      )
      let { nftAccountInstruction, nft_account } = await TokenSwap.createAccountInstruction(
        this.connection,
        user_wallet_key,
        mintAccount.publicKey,
        userTransferAuthority
      )
      user_mint_pubkey = mintAccount.publicKey
      user_nft_pubkey = nft_account.publicKey
      transaction.add(mintTrans)
      transaction.add(nftAccountInstruction)
      instruction = TokenSwap.depositAllTokenTypesInstruction(
        this.tokenSwap,
        this.authority,
        userTransferAuthority.publicKey,
        userAccountA,
        userAccountB,
        this.tokenAccountA,
        this.tokenAccountB,
        user_mint_pubkey,
        user_nft_pubkey,
        this.tick_detail_key,
        user_position_key,
        this.swapProgramId,
        this.tokenProgramId,
        new_position,
        tick_lower,
        tick_upper,
        liquity_mount,
        maximumTokenA,
        maximumTokenB,
        0
      )
      console.log(
        'the tick_detail_key is ',
        this.tick_detail_key.toString(),
        'the user position key ',
        user_position_key.toString()
      )
      transaction.add(instruction)
      return await sendAndConfirmTransaction(
        'depositAllTokenTypes',
        this.connection,
        transaction,
        userTransferAuthority,
        mintAccount,
        nft_account,
        userTransferAuthority
      )
    } else if (user_mint_pubkey != null && user_nft_pubkey != null && user_position_key != null) {
      instruction = TokenSwap.depositAllTokenTypesInstruction(
        this.tokenSwap,
        this.authority,
        userTransferAuthority.publicKey,
        userAccountA,
        userAccountB,
        this.tokenAccountA,
        this.tokenAccountB,
        user_mint_pubkey,
        user_nft_pubkey,
        this.tick_detail_key,
        user_position_key,
        this.swapProgramId,
        this.tokenProgramId,
        new_position,
        tick_lower,
        tick_upper,
        liquity_mount,
        maximumTokenA,
        maximumTokenB,
        index
      )
      transaction.add(instruction)
      return await sendAndConfirmTransaction(
        'depositAllTokenTypes',
        this.connection,
        transaction,
        userTransferAuthority
      )
    }
    return null
  }

  static async createMintInstruction(
    connection: Connection,
    payer: Signer,
    mintAuthority: PublicKey
  ): Promise<{ mintTrans: Transaction; mintAccount: Keypair }> {
    const mintAccount = Keypair.generate()
    let transaction = new Transaction()
    // Allocate memory for the account
    const balanceNeeded = await Token.getMinBalanceRentForExemptMint(connection)
    let instruction = SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: mintAccount.publicKey,
      lamports: balanceNeeded,
      space: MintLayout.span,
      programId: TOKEN_PROGRAM_ID
    })
    transaction.add(instruction)
    let mintInstruction = Token.createInitMintInstruction(
      TOKEN_PROGRAM_ID,
      mintAccount.publicKey,
      0,
      mintAuthority,
      null
    )
    transaction.add(mintInstruction)
    return { mintTrans: transaction, mintAccount }
  }

  static async createAccountInstruction(
    connection: Connection,
    owner: PublicKey,
    mintPublicKey: PublicKey,
    payer: Signer
  ): Promise<{ nftAccountInstruction: Transaction; nft_account: Keypair }> {
    const balanceNeeded = await Token.getMinBalanceRentForExemptAccount(connection)

    const newAccount = Keypair.generate()
    const transaction = new Transaction()
    transaction.add(
      SystemProgram.createAccount({
        fromPubkey: payer.publicKey,
        newAccountPubkey: newAccount.publicKey,
        lamports: balanceNeeded,
        space: AccountLayout.span,
        programId: TOKEN_PROGRAM_ID
      })
    )

    transaction.add(Token.createInitAccountInstruction(TOKEN_PROGRAM_ID, mintPublicKey, newAccount.publicKey, owner))
    return { nftAccountInstruction: transaction, nft_account: newAccount }
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
    liquity_amount: number | Numberu128,
    maximumTokenA: number | Numberu64,
    maximumTokenB: number | Numberu64,
    user_position_index: number | Numberu64
  ): TransactionInstruction {
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
        liquity_amount: new Numberu128(liquity_amount).toBuffer(),
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
    userTransferAuthority: Signer,
    nft_mint_pubkey: PublicKey,
    user_nft_pubkey: PublicKey,
    liquity_amount: number | Numberu128,
    minimumTokenA: number | Numberu64,
    minimumTokenB: number | Numberu64
  ): Promise<TransactionSignature | null> {
    let { index: user_position_index, user_position_pubkey } = this.getUserPositionIdx(nft_mint_pubkey)
    if (user_position_pubkey == null) {
      console.log('withdraw a user: %s is not exist on user deposit position', nft_mint_pubkey.toString())
      return null
    }
    console.log(
      'the user position is %d, minimumTokenA is %d, minimumTokenB is %d and liquty amount is %d',
      user_position_index,
      minimumTokenA,
      minimumTokenB,
      liquity_amount
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
          user_position_pubkey,
          this.swapProgramId,
          this.tokenProgramId,
          liquity_amount,
          minimumTokenA,
          minimumTokenB,
          user_position_index
        )
      ),
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
    liquityAmount: number | Numberu128,
    minimumTokenA: number | Numberu64,
    minimumTokenB: number | Numberu64,
    user_position_index: number | Numberu64
  ): TransactionInstruction {
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
    user_wallet_signer: Signer,
    userAccountA: PublicKey,
    userAccountB: PublicKey,
    user_nft_mint_pubkey: PublicKey,
    user_nft_pubkey: PublicKey
  ): Promise<TransactionSignature | null> {
    let { index: user_position_index, user_position_pubkey } = this.getUserPositionIdx(user_nft_mint_pubkey)
    if (user_position_pubkey == null) {
      return null
    }
    return await sendAndConfirmTransaction(
      'claim',
      this.connection,
      new Transaction().add(
        TokenSwap.claimInstruction(
          this.tokenSwap,
          this.authority,
          user_wallet_signer.publicKey,
          this.tokenAccountA,
          this.tokenAccountB,
          userAccountA,
          userAccountB,
          user_nft_mint_pubkey,
          user_nft_pubkey,
          this.tick_detail_key,
          user_position_pubkey,
          this.swapProgramId,
          this.tokenProgramId,
          user_position_index
        )
      ),
      user_wallet_signer
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

  /**
   * claim tokens from the v3 pool
   *
   * @param userAccountA User account for token A
   * @param userAccountB User account for token B
   * @param poolAccount User account for pool token
   * @param minimumTokenA The minimum amount of token A to withdraw
   * @param minimumTokenB The minimum amount of token B to withdraw
   */
  async managerClaim(
    user_wallet_signer: Signer,
    userAccountA: PublicKey,
    userAccountB: PublicKey
  ): Promise<TransactionSignature | null> {
    return await sendAndConfirmTransaction(
      'ManagerClaim',
      this.connection,
      new Transaction().add(
        TokenSwap.managerClaimInstruction(
          this.tokenSwap,
          this.authority,
          user_wallet_signer.publicKey,
          this.tokenAccountA,
          this.tokenAccountB,
          userAccountA,
          userAccountB,
          this.swapProgramId,
          this.tokenProgramId
        )
      ),
      user_wallet_signer
    )
  }

  static managerClaimInstruction(
    tokenSwap: PublicKey,
    authority: PublicKey,
    user_account_key: PublicKey,
    fromA: PublicKey,
    fromB: PublicKey,
    userAccountA: PublicKey,
    userAccountB: PublicKey,
    swapProgramId: PublicKey,
    tokenProgramId: PublicKey
  ): TransactionInstruction {
    const dataLayout = BufferLayout.struct([BufferLayout.u8('instruction')])

    const data = Buffer.alloc(dataLayout.span)
    dataLayout.encode(
      {
        instruction: 5 // Withdraw instruction]
      },
      data
    )
    const keys = [
      { pubkey: tokenSwap, isSigner: false, isWritable: true },
      { pubkey: authority, isSigner: false, isWritable: false },
      { pubkey: user_account_key, isSigner: true, isWritable: false },
      { pubkey: fromA, isSigner: false, isWritable: true },
      { pubkey: fromB, isSigner: false, isWritable: true },
      { pubkey: userAccountA, isSigner: false, isWritable: true },
      { pubkey: userAccountB, isSigner: false, isWritable: true },
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
   * @param minimumTokenA The minimum amount of token A to withdraw
   * @param minimumTokenB The minimum amount of token B to withdraw
   */
  async addUserPositionAccount(user_position_account: Account): Promise<TransactionSignature | null> {
    let user_positon_length = USER_POSITION_LENGTH
    let user_position_balance = await TokenSwap.getMinBalanceRentForExemptAccount(this.connection, user_positon_length)
    let transaction = new Transaction()
    transaction.add(
      SystemProgram.createAccount({
        fromPubkey: this.payer.publicKey,
        newAccountPubkey: user_position_account.publicKey,
        lamports: user_position_balance,
        space: user_positon_length,
        programId: this.swapProgramId
      }),
      TokenSwap.addUserPositionInstruction(
        this.tokenSwap,
        this.authority,
        user_position_account.publicKey,
        this.swapProgramId,
        this.tokenProgramId
      )
    )
    return await sendAndConfirmTransaction(
      'AddUserPositionAccount',
      this.connection,
      transaction,
      this.payer,
      user_position_account
    )
  }

  static addUserPositionInstruction(
    tokenSwap: PublicKey,
    authority: PublicKey,
    user_position_key: PublicKey,
    swapProgramId: PublicKey,
    tokenProgramId: PublicKey
  ): TransactionInstruction {
    const dataLayout = BufferLayout.struct([BufferLayout.u8('instruction')])

    const data = Buffer.alloc(dataLayout.span)
    dataLayout.encode(
      {
        instruction: 6 // Withdraw instruction]
      },
      data
    )

    const keys = [
      { pubkey: tokenSwap, isSigner: false, isWritable: false },
      { pubkey: authority, isSigner: false, isWritable: false },
      { pubkey: user_position_key, isSigner: false, isWritable: true },
      { pubkey: tokenProgramId, isSigner: false, isWritable: false }
    ]
    return new TransactionInstruction({
      keys,
      programId: swapProgramId,
      data
    })
  }

  async updateFee(
    tokenSwapAccount: Account,
    new_fee: number | Numberu64,
    new_manager_fee: number | Numberu64
  ): Promise<TransactionSignature> {
    return await sendAndConfirmTransaction(
      'swap',
      this.connection,
      new Transaction().add(
        TokenSwap.updateFeeInstruction(this.tokenSwap, this.authority, this.swapProgramId, new_fee, new_manager_fee)
      ),
      this.payer,
      tokenSwapAccount
    )
  }

  static updateFeeInstruction(
    tokenSwap: PublicKey,
    authority: PublicKey,
    swapProgramId: PublicKey,
    new_fee: number | Numberu64,
    new_manager_fee: number | Numberu64
  ): TransactionInstruction {
    const dataLayout = BufferLayout.struct([
      BufferLayout.u8('instruction'),
      Layout.uint64('new_fee'),
      Layout.uint64('new_manager_fee')
    ])

    const data = Buffer.alloc(dataLayout.span)
    dataLayout.encode(
      {
        instruction: 7, // Swap instruction
        new_fee: new Numberu64(new_fee).toBuffer(),
        new_manager_fee: new Numberu64(new_manager_fee).toBuffer()
      },
      data
    )
    const keys = [
      { pubkey: tokenSwap, isSigner: false, isWritable: true },
      { pubkey: authority, isSigner: false, isWritable: false }
    ]
    return new TransactionInstruction({
      keys,
      programId: swapProgramId,
      data
    })
  }
}
