import type { Account, Connection } from '@solana/web3.js'
import { PublicKey } from '@solana/web3.js'
import {
  Number128,
  Numberu128,
  Numberu64,
  TickInfo,
  TickInfoLayout,
  TokenSwap,
  TokenSwapLayout,
  UserPosition,
  UserPositionLayout,
  UserPositionsAccount
} from '../index'

export async function loadAccount(connection: Connection, address: PublicKey, programId: PublicKey): Promise<Buffer> {
  const accountInfo = await connection.getAccountInfo(address)
  if (accountInfo === null) {
    throw new Error('Failed to find account')
  }

  if (!accountInfo.owner.equals(programId)) {
    throw new Error(`Invalid owner: ${JSON.stringify(accountInfo.owner)}`)
  }

  return Buffer.from(accountInfo.data)
}

export function deserializeTokenSwapAccount(data: Buffer, tokenSwap: TokenSwap) {
  const tokenSwapData = TokenSwapLayout.decode(data)
  if (!tokenSwapData.isInitialized) {
    throw new Error(`Invalid token swap state`)
  }
  const managerKey = new PublicKey(tokenSwapData.managerKey)
  const managerTokenAKey = new PublicKey(tokenSwapData.managerTokenAKey)
  const managerTokenBKey = new PublicKey(tokenSwapData.managerTokenBKey)
  const tokenAccountA = new PublicKey(tokenSwapData.tokenAccountA)
  const tokenAccountB = new PublicKey(tokenSwapData.tokenAccountB)
  const mintA = new PublicKey(tokenSwapData.mintA)
  const mintB = new PublicKey(tokenSwapData.mintB)
  const curveType = tokenSwapData.curveType
  const fee = Numberu64.fromBuffer(tokenSwapData.fee)
  const manager_fee = Numberu64.fromBuffer(tokenSwapData.manager_fee)
  const tick_space = tokenSwapData.tick_space
  const current_price = Numberu128.fromBuffer(tokenSwapData.current_price)
  const current_liquity = Numberu128.fromBuffer(tokenSwapData.current_liquity)
  const fee_growth_global0 = Numberu128.fromBuffer(tokenSwapData.fee_growth_global0)
  const fee_growth_global1 = Numberu128.fromBuffer(tokenSwapData.fee_growth_global1)
  const manager_fee_a = Numberu128.fromBuffer(tokenSwapData.manager_fee_a)
  const manager_fee_b = Numberu128.fromBuffer(tokenSwapData.manager_fee_b)
  tokenSwap.managerKey = managerKey
  tokenSwap.managerTokenAKey = managerTokenAKey
  tokenSwap.managerTokenBKey = managerTokenBKey
  tokenSwap.tokenAccountA = tokenAccountA
  tokenSwap.tokenAccountB = tokenAccountB
  tokenSwap.mintA = mintA
  tokenSwap.mintB = mintB
  tokenSwap.curveType = curveType
  tokenSwap.fee = fee
  tokenSwap.managerFee = manager_fee
  tokenSwap.tick_space = tick_space
  tokenSwap.current_price = current_price
  tokenSwap.current_liquity = current_liquity
  tokenSwap.fee_growth_global0 = fee_growth_global0
  tokenSwap.fee_growth_global1 = fee_growth_global1
  tokenSwap.manager_fee_a = manager_fee_a
  tokenSwap.manager_fee_b = manager_fee_b
}

export function deserializeTickInfo(data: Buffer, tokenSwap: TokenSwap) {
  console.log('the deserializeTickInfo start')
  let length = data.readInt32LE(34)
  // eslint-disable-next-line no-array-constructor
  let array = new Array<TickInfo>()
  data = data.slice(38)
  for (let i = 0; i < length; i++) {
    const tickInfoData = TickInfoLayout.decode(data.slice(i * TickInfoLayout.span, (i + 1) * TickInfoLayout.span))
    // const tick = tickInfoData.tick.readInt32LE()
    const tick = Buffer.from(tickInfoData.tick).readInt32LE(0) // web端兼容性写法
    const tick_price = Numberu128.fromBuffer(tickInfoData.tick_price)
    const liquity_gross = Numberu128.fromBuffer(tickInfoData.liquity_gross)
    const liquity_net = Number128.fromBuffer(tickInfoData.liquity_net)
    const fee_growth_outside_a = Numberu128.fromBuffer(tickInfoData.fee_growth_outside_a)
    const fee_growth_outside_b = Numberu128.fromBuffer(tickInfoData.fee_growth_outside_b)
    let tickInfo = new TickInfo(
      tick,
      tick_price,
      liquity_gross,
      liquity_net,
      fee_growth_outside_a,
      fee_growth_outside_b
    )
    array.push(tickInfo)
  }
  tokenSwap.tick_info_array = array
}

export function deserializeUserPositionn(data: Buffer, user_position_pubkey: PublicKey, tokenSwap: TokenSwap) {
  console.log('the deserializeUserPositionn start')
  let length = data.readInt32LE(34)
  // eslint-disable-next-line no-array-constructor
  let array = new Array<UserPosition>()
  data = data.slice(38)
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
  let userPositionsAccount = new UserPositionsAccount(user_position_pubkey, array)
  tokenSwap.user_position_account_array.push(userPositionsAccount)
}
