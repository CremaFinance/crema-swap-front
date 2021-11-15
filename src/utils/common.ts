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
