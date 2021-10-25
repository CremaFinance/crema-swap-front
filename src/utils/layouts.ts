import { bool, publicKey, struct, u32, u64, u8, vecU8 } from '@project-serum/borsh'
// import { Struct, Enum, PublicKey } from '@solana/web3.js'
// import BN from 'bn.js'
// https://github.com/solana-labs/solana-program-library/blob/master/token/js/client/token.js#L210
export const ACCOUNT_LAYOUT = struct([
  publicKey('mint'),
  publicKey('owner'),
  u64('amount'),
  u32('delegateOption'),
  publicKey('delegate'),
  u8('state'),
  u32('isNativeOption'),
  u64('isNative'),
  u64('delegatedAmount'),
  u32('closeAuthorityOption'),
  publicKey('closeAuthority')
])

export const MINT_LAYOUT = struct([
  u32('mintAuthorityOption'),
  publicKey('mintAuthority'),
  u64('supply'),
  u8('decimals'),
  bool('initialized'),
  u32('freezeAuthorityOption'),
  publicKey('freezeAuthority')
])

export const StakePoolLayout = struct([
  u8('account_type'),
  u8('nonce'),
  publicKey('user_stake_list'),
  publicKey('stake_pool_token_account'),
  publicKey('rewardTokenAccount'),
  publicKey('lp_token_mint'),
  publicKey('reward_token_mint'),
  publicKey('token_program_id'),
  u64('acc_point'),
  u64('acc_share_numerator'),
  u64('acc_share_dominator'),
  u64('stake_total_amount'),
  u64('total_amount'),
  u64('already_reward_amount'),
  u64('last_reward_slot'),
  u64('start_timestamp'),
  u64('start_slot')
])

export const stakeUserInfo = struct([
  publicKey('userAccountAddress'),
  u64('stakeAmount'),
  u64('rewardDebt'),
  u64('sigend')
])

export const testStakeAccount = struct([u8('account_type'), u64('maxUsers'), vecU8('users')])

// export class AccountType extends Enum {}

// export class StakeUserInfo extends Struct {
//   userAccountAddress: PublicKey | undefined
//   stakeAmount: BN | undefined
//   rewardDebt: BN | undefined
//   sigend: number | undefined
// }
// export class StakeUserList extends Struct {
//   public accountType: AccountType | undefined
//   public maxUsers: number | undefined
//   public users: [StakeUserInfo] | undefined
// }

export const SwapPoolLayout = struct([
  u64('tradeFeeDenominator'),
  u64('tradeFeeNumerator'),
  u64('coefficientNumerator'),
  u64('coefficientDominator'),
  publicKey('feeAccount'),
  publicKey('tokenPool')
])
