import { TOKENS } from '@/utils/tokens'
export interface FarmingInfo {
  name: string
  address: string // 如果是lp 则为swapkey
  rewarderKey: string
  rewardTokenMint: string
  positionWrapperWrapMint: string
  positionWrapper: string
  swapKey: string
  tokenA: any
  tokenB: any
}
export const LPFARMS: FarmingInfo[] = [
  // {
  //   name: 'CUSDT-CUSDC',
  //   address: '6jZ1KK9LephzTTTL4pRnHwL9qBG8ymHk5Biv7vFdNtrR',
  //   rewarderKey: 'Aqz8Zvot5BZht6vuwRHpLmP4M126WaECRmc3cVDWnRtm',
  //   rewardTokenMint: '32JXVurQacMxQF6qFxKkeAbysQcXsCakuYx3eyYRBoSR',
  //   positionWrapperWrapMint: 'GAQbaSD7aFDhkijfAjh2tebxJpm1iJRhWwtrbdNYGTBh',
  //   positionWrapper: 'AbWDB31gaTB3qezZ5Dx29WDyaX7d7jgcZyrAQaKwutRy',
  //   swapKey: '6jZ1KK9LephzTTTL4pRnHwL9qBG8ymHk5Biv7vFdNtrR',
  //   tokenA: TOKENS['Gcu9zjxrjez4xWGj8bi2gTLXYN8hD8Avu2tN8xfnV65Q'],
  //   tokenB: TOKENS['GHStiPQDe4HEQxtDzyFFuNjP6Z6GqYhbPqJ6oiRFmGWT']
  // },
  // {
  //   name: 'CSOL-CUSDC',
  //   address: 'Gz113eAqg5FPJr3mnB2EhmDrGkUBHfsaY4xtbExd53nv',
  //   rewarderKey: 'Aqz8Zvot5BZht6vuwRHpLmP4M126WaECRmc3cVDWnRtm',
  //   rewardTokenMint: '32JXVurQacMxQF6qFxKkeAbysQcXsCakuYx3eyYRBoSR',
  //   positionWrapperWrapMint: 'J31JbnqfdxWcWytguUSNGJv5ooEo93SRKq6a9kVkHb1p',
  //   positionWrapper: 'FyASrn3okGj2NAaNrYeiZnJh4cewmQQKehCSNUz3yzfn',
  //   swapKey: 'Gz113eAqg5FPJr3mnB2EhmDrGkUBHfsaY4xtbExd53nv',
  //   tokenA: TOKENS['1msZrgEMrhEzhLWjGvEpqo3RUuzMWGs4x9S6j3Nk1hK'],
  //   tokenB: TOKENS['GHStiPQDe4HEQxtDzyFFuNjP6Z6GqYhbPqJ6oiRFmGWT']
  // }
]
