import { TokenSwap, TickInfo, TickInfoLayout, UserPosition, Numberu128 } from './index'

const LIQUITY_FEE_DECIMAL = 10000_0000_0000_0000
const PRICISE_DECIMAL = 10000_0000_0000
// storge x or token a price:  p = y / x   l / p = x * x
export class TickWord {
  constructor(public tick_infos: TickInfo[], public tick_append_index: number) {
    this.tick_infos = tick_infos
    this.tick_append_index = tick_append_index
  }

  public get_tick_info(current_tick: number): TickInfo | null {
    let position = this.find_tick_position(current_tick)
    if (position != null) {
      let tick_info = this.tick_infos[position]
      return tick_info
    } else {
      return null
    }
  }

  public get_next_tick_info(current_tick_position: number, direct: number): TickInfo | null {
    if (direct == 0 && current_tick_position > 0) {
      let tick_info_index = current_tick_position - 1
      let tick_info = this.tick_infos[tick_info_index]
      return tick_info
    } else if (direct == 1 && current_tick_position < this.tick_append_index - 1) {
      let tick_info_index = current_tick_position + 1
      let tick_info = this.tick_infos[tick_info_index]
      return tick_info
    } else {
      return null
    }
  }

  public find_tick_insert_position(tick: number): number {
    if (this.tick_append_index == 0) {
      return 0
    }
    let insert_end = this.tick_append_index
    let insert_start = 0
    let insert_index = this.tick_append_index >> 1
    while (true) {
      let tick_iter = this.tick_infos[insert_index].tick
      if (tick > tick_iter) {
        insert_start = insert_index + 1
        insert_index = (insert_start + insert_end) >> 1
      } else if (tick < tick_iter) {
        insert_end = insert_index
        insert_index = (insert_start + insert_end) >> 1
      }
      if (insert_end == insert_start) {
        break
      }
    }
    return insert_end
  }

  public find_tick_position(tick: number): number | null {
    if (this.tick_append_index == 0) {
      return null
    }
    let insert_end = this.tick_append_index
    let insert_start = 0
    let insert_index = this.tick_append_index >> 1
    while (true) {
      let tick_iter = this.tick_infos[insert_index].tick
      if (tick > tick_iter) {
        insert_start = insert_index + 1
        insert_index = (insert_start + insert_end) >> 1
      } else if (tick < tick_iter) {
        insert_end = insert_index
        insert_index = (insert_start + insert_end) >> 1
      } else {
        return insert_index
      }
      if (insert_end == insert_start) {
        break
      }
    }
    return null
  }

  public find_nearest_boudary_tick(tick: number, direct: number): number {
    if (this.tick_append_index == 0) {
      return 0
    }
    let nearest_index
    let insert_end = this.tick_append_index
    let insert_start = 0
    let insert_index = this.tick_append_index >> 1
    while (true) {
      let tick_iter = this.tick_infos[insert_index].tick
      if (tick > tick_iter) {
        insert_start = insert_index + 1
        insert_index = (insert_start + insert_end) >> 1
      } else if (tick < tick_iter) {
        insert_end = insert_index
        insert_index = (insert_start + insert_end) >> 1
      } else {
        nearest_index = insert_index
        break
      }
      if (insert_end == insert_start) {
        if (direct == 0) {
          nearest_index = insert_index
        } else {
          nearest_index = insert_index - 1
        }
        break
      }
    }
    return nearest_index
  }
}

export function price2tick(price: number) {
  let d = Math.pow(1.0001, 1 / 2)
  let tick_index = Math.floor(Math.log(price) / Math.log(d))
  return tick_index
}
export function tick2price(tick_index: number): number {
  let absTick = Math.abs(tick_index)
  let ratio = 1
  if ((absTick & 0x1) != 0) {
    ratio = Math.pow(1.0001, 0x1 / 2)
  }
  if ((absTick & 0x2) != 0) {
    ratio = ratio * Math.pow(1.0001, 0x2 / 2)
  }
  if ((absTick & 0x4) != 0) {
    ratio = ratio * Math.pow(1.0001, 0x4 / 2)
  }
  if ((absTick & 0x8) != 0) {
    ratio = ratio * Math.pow(1.0001, 0x8 / 2)
  }
  if ((absTick & 0x10) != 0) {
    ratio = ratio * Math.pow(1.0001, 0x10 / 2)
  }
  if ((absTick & 0x20) != 0) {
    ratio = ratio * Math.pow(1.0001, 0x20 / 2)
  }
  if ((absTick & 0x40) != 0) {
    ratio = ratio * Math.pow(1.0001, 0x40 / 2)
  }
  if ((absTick & 0x80) != 0) {
    ratio = ratio * Math.pow(1.0001, 0x80 / 2)
  }
  if ((absTick & 0x100) != 0) {
    ratio = ratio * Math.pow(1.0001, 0x100 / 2)
  }
  if ((absTick & 0x200) != 0) {
    ratio = ratio * Math.pow(1.0001, 0x200 / 2)
  }
  if ((absTick & 0x400) != 0) {
    ratio = ratio * Math.pow(1.0001, 0x400 / 2)
  }
  if ((absTick & 0x800) != 0) {
    ratio = ratio * Math.pow(1.0001, 0x800 / 2)
  }
  if ((absTick & 0x1000) != 0) {
    ratio = ratio * Math.pow(1.0001, 0x1000 / 2)
  }
  if ((absTick & 0x2000) != 0) {
    ratio = ratio * Math.pow(1.0001, 0x2000 / 2)
  }
  if ((absTick & 0x4000) != 0) {
    ratio = ratio * Math.pow(1.0001, 0x4000 / 2)
  }
  if ((absTick & 0x8000) != 0) {
    ratio = ratio * Math.pow(1.0001, 0x8000 / 2)
  }
  if ((absTick & 0x10000) != 0) {
    ratio = ratio * Math.pow(1.0001, 0x10000 / 2)
  }
  if ((absTick & 0x20000) != 0) {
    ratio = ratio * Math.pow(1.0001, 0x20000 / 2)
  }
  if ((absTick & 0x40000) != 0) {
    ratio = ratio * Math.pow(1.0001, 0x40000 / 2)
  }
  if ((absTick & 0x80000) != 0) {
    ratio = ratio * Math.pow(1.0001, 0x80000 / 2)
  }
  if (tick_index < 0) {
    ratio = 1 / ratio
  }
  return ratio
}

export function preview_calculate_liqudity(
  tick_lower: number,
  tick_upper: number,
  delta_liquity: Numberu128,
  current_price: Numberu128
): { ans_src: number; ans_dst: number } {
  let PRICISE_DECIMAL_INTERN = PRICISE_DECIMAL * 100
  current_price = current_price.mul(new Numberu128(100))
  let n_pricise_decimal = new Numberu128(PRICISE_DECIMAL_INTERN)
  let lower_price_number = tick2price(tick_lower)
  let lower_price = new Numberu128(0)
  if (lower_price_number > 10000000000) {
    lower_price = new Numberu128(lower_price_number * 100)
    let multi = new Numberu128(1000000000000)
    lower_price = lower_price.mul(multi)
  } else if (lower_price_number > 100000000) {
    lower_price = new Numberu128(lower_price_number * 10000)
    let multi = new Numberu128(10000000000)
    lower_price = lower_price.mul(multi)
  } else if (lower_price_number > 10000) {
    lower_price = new Numberu128(lower_price_number * 100000000)
    let multi = new Numberu128(1000000)
    lower_price = lower_price.mul(multi)
  } else {
    lower_price = new Numberu128(lower_price_number * PRICISE_DECIMAL_INTERN)
  }
  let upper_price_number = tick2price(tick_upper)
  console.log('the upper_price_number is', upper_price_number)
  let upper_price = new Numberu128(0)
  if (upper_price_number > 10000000000) {
    upper_price = new Numberu128(upper_price_number * 100)
    let multi = new Numberu128(1000000000000)
    upper_price = upper_price.mul(multi)
  } else if (upper_price_number > 100000000) {
    upper_price = new Numberu128(upper_price_number * 10000)
    let multi = new Numberu128(10000000000)
    upper_price = upper_price.mul(multi)
  } else if (upper_price_number > 10000) {
    upper_price = new Numberu128(upper_price_number * 100000000)
    let multi = new Numberu128(1000000)
    upper_price = upper_price.mul(multi)
  } else {
    upper_price = new Numberu128(upper_price_number * PRICISE_DECIMAL_INTERN)
  }
  let src = new Numberu128(0)
  let dst = new Numberu128(0)
  if (current_price.lt(lower_price)) {
    src = delta_liquity.mul(n_pricise_decimal).mul(upper_price.sub(lower_price)).div(lower_price).div(upper_price)
  } else if (current_price.gt(upper_price)) {
    dst = delta_liquity.mul(upper_price.sub(lower_price)).div(n_pricise_decimal)
  } else {
    src = delta_liquity.mul(n_pricise_decimal).mul(upper_price.sub(current_price)).div(current_price).div(upper_price)
    dst = delta_liquity.mul(current_price.sub(lower_price)).div(n_pricise_decimal)
  }
  return { ans_src: src.toNumber(), ans_dst: dst.toNumber() }
}
//区间中包含当前价格, 一种资产返回另外一种资产，并且返回liquity
export function deposit_src_calulate_dst(
  tick_lower: number,
  tick_upper: number,
  src: number,
  current_price_n: Numberu128,
  direct: number
): { dst: number; delta_liquity: number } {
  let lower_price = tick2price(tick_lower)
  let upper_price = tick2price(tick_upper)
  let current_price = current_price_n.toNumber() / PRICISE_DECIMAL
  let dst: number = 0
  let delta_liquity = 0
  if (direct == 0) {
    delta_liquity = src / (1 / current_price - 1 / upper_price)
    dst = delta_liquity * (current_price - lower_price)
  } else {
    delta_liquity = src / current_price - lower_price
    dst = delta_liquity * (1 / current_price - 1 / upper_price)
  }
  return { dst, delta_liquity }
}

//区间在当前价格的左侧时，也就是只有token b这一种资产, 返回liquity
export function deposit_only_token_b(tick_lower: number, tick_upper: number, src: number): number {
  let lower_price = tick2price(tick_lower)
  let upper_price = tick2price(tick_upper)
  let delta_liquity = src / (upper_price - lower_price)
  return delta_liquity
}

//区间在当前价格的右侧时，也就是只有token a这一种资产, 返回liquity
export function deposit_only_token_a(tick_lower: number, tick_upper: number, src: number): number {
  let lower_price = tick2price(tick_lower)
  let upper_price = tick2price(tick_upper)
  let delta_liquity = src / (1 / lower_price - 1 / upper_price)
  return delta_liquity
}

//test_deposit();
export function preswap(source_amount: number, direct: number, account: TokenSwap, tick_word: TickWord): number {
  //direct is swap dirction, 0 -> x swap y  1 -> y swap x
  let dst_amount = new Numberu128(0)
  let current_price = account.current_price
  let n_pricise_decimal = new Numberu128(PRICISE_DECIMAL)
  let current_tick = price2tick(current_price.toNumber() / PRICISE_DECIMAL)
  let current_nearest_boundary_tick = tick_word.find_nearest_boudary_tick(current_tick, direct)
  let liquity = account.current_liquity
  let remind = new Numberu128(source_amount)
  let remind_with_fee = new Numberu128(0)
  let fee_rate = new Numberu128(account.fee)
  while (true) {
    let next_tick_info = tick_word.get_next_tick_info(current_nearest_boundary_tick, direct)
    if (next_tick_info == null) {
      return 0
    }
    if (direct == 0) {
      current_nearest_boundary_tick -= 1
    } else {
      current_nearest_boundary_tick += 1
    }
    let next_price = next_tick_info.tick_price
    let full_step_fee: Numberu128
    let delta_amount: Numberu128
    if (direct == 0) {
      let one_div_next_price = liquity.mul(n_pricise_decimal).div(next_price)
      let one_div_current_price = liquity.mul(n_pricise_decimal).div(current_price)
      delta_amount = one_div_next_price.sub(one_div_current_price)
      full_step_fee = delta_amount.mul(fee_rate).div(n_pricise_decimal)
    } else {
      delta_amount = liquity.mul(next_price.sub(current_price)).div(n_pricise_decimal)
      full_step_fee = delta_amount.mul(fee_rate).div(n_pricise_decimal)
    }
    if (remind.lte(full_step_fee)) {
      remind_with_fee = remind
    } else {
      remind_with_fee = remind.sub(full_step_fee)
    }
    if (delta_amount.lte(remind_with_fee)) {
      if (direct == 0) {
        dst_amount = liquity.mul(current_price.sub(next_price)).div(n_pricise_decimal).add(dst_amount)
        current_price = next_price
        remind = remind_with_fee.sub(delta_amount)
        // 需要穿越流动性分区了, 这个需要区分方向
        liquity = liquity.sub(next_tick_info.liquity_net)
      } else {
        let delta_dst = liquity
          .mul(n_pricise_decimal)
          .mul(next_price.sub(current_price))
          .div(next_price.mul(current_price))
        dst_amount = dst_amount.add(delta_dst)
        remind = remind_with_fee.sub(delta_amount)
        current_price = next_price
        liquity = liquity.add(next_tick_info.liquity_net)
      }
    } else {
      let step_fee = remind.mul(fee_rate).div(n_pricise_decimal)
      let remind_with_fee = remind.sub(step_fee)
      if (direct == 0) {
        next_price = liquity
          .mul(current_price)
          .mul(n_pricise_decimal)
          .div(remind_with_fee.mul(current_price).add(liquity.mul(n_pricise_decimal)))
        let delta_dst = liquity.mul(current_price.sub(next_price)).div(n_pricise_decimal)
        dst_amount = dst_amount.add(delta_dst)
      } else {
        next_price = remind_with_fee.mul(n_pricise_decimal).div(liquity).add(current_price)
        let delta_dst = liquity
          .mul(n_pricise_decimal)
          .mul(next_price.sub(current_price))
          .div(next_price.mul(current_price))
        dst_amount = dst_amount.add(delta_dst)
      }
      current_price = next_price
      break
    }
    current_tick = next_tick_info.tick
  }
  return dst_amount.toNumber()
}

export function preclaim(tick_word: TickWord, user_position: UserPosition, account: any) {
  let lower_tick_info = tick_word.get_tick_info(user_position.lower_tick)
  let upper_tick_info = tick_word.get_tick_info(user_position.upper_tick)
  if (lower_tick_info == null || upper_tick_info == null) {
    console.log('can not find the user tick info')
    return { token_a_fee: new Numberu128(0), token_b_fee: new Numberu128(0) }
  }
  let n_liquity_fee_decimal_1 = new Numberu128(10000_0000)
  let n_liquity_fee_decimal_2 = new Numberu128(10000_0000)
  let n_liquity_fee_decimal = n_liquity_fee_decimal_1.mul(n_liquity_fee_decimal_2)
  let current_tick = price2tick(account.current_price / PRICISE_DECIMAL)
  let lower_tick = user_position.lower_tick
  let upper_tick = user_position.upper_tick
  let lowerFeeGrowthOutside0
  let lowerFeeGrowthOutside1
  if (lower_tick < current_tick) {
    lowerFeeGrowthOutside0 = lower_tick_info.feeGrowthOutside0
    lowerFeeGrowthOutside1 = lower_tick_info.feeGrowthOutside1
  } else {
    lowerFeeGrowthOutside0 = account.fee_growth_global0.sub(lower_tick_info.feeGrowthOutside0)
    lowerFeeGrowthOutside1 = account.fee_growth_global1.sub(lower_tick_info.feeGrowthOutside1)
  }

  let upperFeeGrowthOutside0
  let upperFeeGrowthOutside1
  if (upper_tick < current_tick) {
    upperFeeGrowthOutside0 = account.fee_growth_global0.sub(upper_tick_info.feeGrowthOutside0)
    upperFeeGrowthOutside1 = account.fee_growth_global1.sub(upper_tick_info.feeGrowthOutside1)
  } else {
    upperFeeGrowthOutside0 = upper_tick_info.feeGrowthOutside0
    upperFeeGrowthOutside1 = upper_tick_info.feeGrowthOutside1
  }
  let new_fee_a = account.fee_growth_global0.sub(lowerFeeGrowthOutside0).sub(upperFeeGrowthOutside0)
  let new_fee_b = account.fee_growth_global1.sub(lowerFeeGrowthOutside1).sub(upperFeeGrowthOutside1)
  const token_a_fee = new_fee_a
    .sub(user_position.fee_growth_inside_a_last)
    .mul(user_position.liquity)
    .div(n_liquity_fee_decimal)
    .add(user_position.token_a_fee)
  const token_b_fee = new_fee_b
    .sub(user_position.fee_growth_inside_b_last)
    .mul(user_position.liquity)
    .div(n_liquity_fee_decimal)
    .add(user_position.token_b_fee)

  return { token_a_fee, token_b_fee }
}

export function test_tick2price() {
  let price = tick2price(-650000)
  console.log('the price is ', price)
}

function test_price2tick() {
  let index = price2tick(52342.3021)
  console.log('the tick is ', index)
}

//test_byte_get_next_tick();
export function test_preview_calculate_liqudity() {
  let upper_index = 21156
  let lower_index = 13863
  let deposit_liquity = new Numberu128(113644200)
  let { ans_src, ans_dst } = preview_calculate_liqudity(
    lower_index,
    upper_index,
    deposit_liquity,
    new Numberu128(12075538100138)
  )
  console.log('the src is %d, the dst is %d', ans_src, ans_dst)
}
//test_tick_word();
//test_preview_calculate_liqudity();
