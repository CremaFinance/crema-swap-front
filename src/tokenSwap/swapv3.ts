/* eslint-disable no-unused-vars */
/* eslint-disable-next-line prefer-const */
class TickInfo {
  // unsigned int 引用这个tick得引用总和，不需要区分upper tick 和 lower tick，主要用来判断是否被position判断，可以用来计算费用
  // siged int  价格由左向右穿过时，流动性增加得净值
  constructor(
    public liquity_gross: number,
    public liquity_net: number,
    public feeGrowthOutside0: number,
    public feeGrowthOutside1: number
  ) {
    this.liquity_gross = liquity_gross
    this.liquity_net = liquity_net
    this.feeGrowthOutside0 = feeGrowthOutside0
    this.feeGrowthOutside1 = feeGrowthOutside1
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class StateAccount {
  constructor(
    public feeGrowthGlobal0: number,
    public feeGrowthGlobal1: number,
    public current_price: number,
    public liquity: number,
    public source: number,
    public dst: number
  ) {
    this.feeGrowthGlobal0 = feeGrowthGlobal0
    this.feeGrowthGlobal1 = feeGrowthGlobal1
    this.current_price = current_price
    this.liquity = liquity
    this.source = source
    this.dst = dst
  }
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class Position {
  constructor(
    public lower_tick: number,
    public upper_tick: number,
    public liquity: number,
    public token_a_fee: number,
    public token_b_fee: number
  ) {
    this.lower_tick = lower_tick
    this.upper_tick = upper_tick
    this.liquity = liquity
    this.token_a_fee = token_a_fee
    this.token_b_fee = token_b_fee
  }
}
const INDEXMAX = 110912
// storge x or token a price:  p = y / x   l / p = x * x
class TickWord {
  constructor(
    public tick_word: Buffer,
    public tick_position: Buffer,
    public tick_infos: TickInfo[],
    public tick_append_index: number
  ) {
    this.tick_word = tick_word
    this.tick_position = tick_position
  }

  public set_tick(index: number, pos: number) {
    const ix = index % 8
    const key = (index >> 2) + INDEXMAX
    this.tick_word[key] = this.tick_word[key] | (1 << ix)
    this.tick_position[index] = pos
  }
  // eslint-disable-next-line lines-between-class-members
  public reset_tick(index: number) {
    const ix = index % 8
    const key = (index >> 3) + INDEXMAX
    this.tick_word[key] = this.tick_word[key] & ~(1 << ix)
    this.tick_position[index] = 0
  }

  public get_tick_info(index: number): TickInfo | null {
    const ix = index % 8
    const key = (index >> 3) + INDEXMAX
    if (((this.tick_word[key] >> ix) & 1) !== 0) {
      const pos = this.tick_position[index]
      return this.tick_infos[pos]
    }
    return null
  }

  public get_next_tick(current_tick: number, direct: number): number | null {
    const current_word = (current_tick >> 3) + INDEXMAX
    const th = current_tick % 8
    let word_space: number
    if (direct === 0) {
      word_space = -1
    } else {
      word_space = 1
    }
    // current word
    let cur = this.tick_word[current_word]
    const res = byte_get_next_tick(cur, direct, th, true)
    if (res != null) {
      console.log('the byte_get_next_tick ans is ', res)
      const ans = ((current_word - INDEXMAX) << 3) + res
      return ans
    }
    // next word
    let iter_word
    // fix me
    let next_th = current_word + word_space
    if (direct === 0) {
      console.log('iter current_word is {}', current_word)
      iter_word = this.tick_word.slice(0, current_word)
      for (cur of iter_word) {
        if (cur > 0) {
          const res = byte_get_next_tick(cur, direct, th, false)
          if (res != null) {
            console.log('the next th is {} and the res is {}', next_th, res)
            const ans = ((next_th - INDEXMAX) << 3) + res
            return ans
          }
        }
        next_th = next_th + word_space
      }
    } else {
      iter_word = this.tick_word.slice(next_th, this.tick_word.length)
      for (cur of iter_word) {
        if (cur > 0) {
          const res = byte_get_next_tick(cur, direct, th, false)
          if (res != null) {
            console.log('the next th is {} and the res is {}', next_th, res)
            const ans = ((next_th - INDEXMAX) << 3) + res
            return ans
          }
        }
        console.log('the next th is {}', next_th)
        next_th = next_th + word_space
      }
    }
    return null
  }
  // eslint-disable-next-line lines-between-class-members
  public update_tick(tick: number, delta_liquity: number, upper: boolean) {
    const tick_append_index = this.tick_append_index
    let tick_info = this.get_tick_info(tick)
    if (tick_info == null) {
      tick_info = new TickInfo(delta_liquity, 0, 0, 0)
      this.set_tick(tick, tick_append_index)
      this.tick_append_index = tick_append_index + 1
    } else {
      tick_info.liquity_gross = tick_info.liquity_gross + delta_liquity
    }
    if (upper === true) {
      tick_info.liquity_net = tick_info.liquity_net - delta_liquity
    } else {
      tick_info.liquity_net = tick_info.liquity_net + delta_liquity
    }
    if (tick_info.liquity_gross === 0) {
      this.reset_tick(tick)
    }
  }
}

export function byte_get_next_tick(byte: number, direct: number, th: number, is_contain: boolean): number {
  let start = 8
  let end = 0
  let ans = -1
  if (byte === 0) {
    return ans
  }
  if (!is_contain) {
    if (direct === 0) {
      end = 8
    } else {
      start = 0
    }
  } else {
    // eslint-disable-next-line no-lonely-if
    if (direct === 1) {
      start = th + 1
    } else {
      end = th
    }
  }
  if (direct === 0) {
    for (let i = 0; i < end; end++) {
      const seq = end - i - 1
      if (((byte >> seq) & 0x1) === 1) {
        ans = seq
        break
      }
    }
  } else {
    for (let i = start; i < 8; i++) {
      if (((byte >> i) & 0x1) === 1) {
        ans = i
        break
      }
    }
  }
  return ans
}

export function price2tick(price: number) {
  const d = Math.pow(1.0001, 1 / 2)
  const tick_index = Math.floor(Math.log(price) / Math.log(d))
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
  delta_liquity: number,
  current_price: number
): { src: number; dst: number } {
  let lower_price = tick2price(tick_lower)
  let upper_price = tick2price(tick_upper)
  console.log('the upper is %d and the lower is %d', upper_price, lower_price)
  let src = 0
  let dst = 0
  if (current_price < lower_price) {
    src = delta_liquity * (1 / lower_price - 1 / upper_price)
  } else if (current_price > upper_price) {
    dst = delta_liquity * (upper_price - lower_price)
  } else {
    src = delta_liquity * (1 / lower_price - 1 / current_price)
    dst = delta_liquity * (upper_price - current_price)
    console.log('the src is %d, the dst is %d', src, dst)
  }
  return { src, dst }
}

export function preswap(
  source_amount: number,
  direct: number,
  current_price: number,
  current_liquity: number,
  tick_word: TickWord
): number {
  //direct is swap dirction, 0 -> x swap y  1 -> y swap x
  let dst_amount = 0
  let current_tick = price2tick(current_price)
  let liquity = current_liquity
  let remind = source_amount
  while (remind > 0.000000001) {
    let next_tick = tick_word.get_next_tick(current_tick, direct)
    if (next_tick == null) {
      return 0
    }
    let next_tick_info = tick_word.get_tick_info(next_tick)
    if (next_tick_info == null) {
      return 0
    }
    let next_price = tick2price(next_tick)
    let delta_amount = (1 / next_price - 1 / current_price) * liquity
    if (delta_amount < remind) {
      dst_amount = dst_amount + liquity * (current_price - next_price)
      current_price = next_price
      remind = remind - delta_amount
      // 需要穿越流动性分区了, 这个需要区分方向
      if (direct == 0) {
        liquity = liquity - next_tick_info.liquity_net
      }
      if (direct == 1) {
        liquity = liquity + next_tick_info.liquity_net
      }
    } else {
      let next_price = 1 / (remind / liquity + 1 / current_price)
      let delta_dst = liquity * (current_price - next_price)
      dst_amount += delta_dst
      current_price = next_price
      remind = 0
      current_price = current_price
      break
    }
    current_tick = next_tick
  }
  return dst_amount
}

function test_tick2price() {
  let price = tick2price(123)
  console.log('the price is ', price)
}

function test_price2tick() {
  let index = price2tick(52342.3021)
  console.log('the tick is ', index)
}

function test_byte_get_next_tick() {
  let next_tick = byte_get_next_tick(232, 0, 0, false)
  console.log('the next_tick is ', next_tick)
  next_tick = byte_get_next_tick(232, 1, 0, false)
  console.log('the next_tick is ', next_tick)
}

function test_preview_calculate_liqudity() {
  let upper_index = price2tick(12.64)
  let lower_index = price2tick(10.24)
  let deposit_liquity = 10000
  let { src, dst } = preview_calculate_liqudity(lower_index, upper_index, deposit_liquity, 12.24)
  console.log('the src is %d, the dst is %d', src, dst)
}

function test() {
  console.log('start to testing!')
}

//test_preview_calculate_liqudity();
