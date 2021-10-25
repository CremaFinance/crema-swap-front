import { Schema } from 'borsh'
import BN from 'bn.js'
import solanaWeb3, { Struct, Enum, PublicKey, SOLANA_SCHEMA } from '@solana/web3.js'
export class AccountType extends Enum {}

export class AccountTypeEnum extends Struct {}

export enum AccountTypeKind {
  Uninitialized = 'Uninitialized',
  StakePool = 'StakePool',
  UsersList = 'UsersList'
}

export class StakeUserInfo extends Struct {
  userAccountAddress: PublicKey | undefined
  stakeAmount: BN | undefined
  rewardDebt: BN | undefined
  sigend: number | undefined
}

export class StakeUserList extends Struct {
  public accountType: AccountType | undefined
  public maxUsers: number | undefined
  public users: [StakeUserInfo] | undefined
}

export function addStakePoolSchema(schema: Schema): void {
  /**
   * Borsh requires something called a Schema,
   * which is a Map (key-value pairs) that tell borsh how to deserialise the raw data
   * This function adds a new schema to an existing schema object.
   */
  schema.set(PublicKey, {
    kind: 'struct',
    fields: [['_bn', 'u256']]
  })

  schema.set(AccountType, {
    kind: 'enum',
    field: 'enum',
    values: [
      // if the account has not been initialized, the enum will be 0
      [AccountTypeKind.Uninitialized, AccountTypeEnum],
      [AccountTypeKind.StakePool, AccountTypeEnum],
      [AccountTypeKind.UsersList, AccountTypeEnum]
    ]
  })

  schema.set(AccountTypeEnum, { kind: 'struct', fields: [] })
  schema.set(StakeUserList, {
    kind: 'struct',
    fields: [
      ['accountType', AccountType],
      ['maxUsers', 'u32'],
      ['users', [StakeUserInfo]]
    ]
  })

  schema.set(StakeUserInfo, {
    kind: 'struct',
    fields: [
      ['userAccountAddress', PublicKey],
      ['stakeAmount', 'u64'],
      ['rewardDebt', 'u64'],
      ['signed', 'u8']
    ]
  })
}

export interface StakeUserListAccount {
  pubkey: solanaWeb3.PublicKey
  account: solanaWeb3.AccountInfo<StakeUserList>
}

export class StakePoolAccounts {
  /**
   * Wrapper class for a stake pool.
   * Each stake pool has a stake pool account and a validator list account.
   */
  StakeUserList: StakeUserListAccount | undefined
}

/**
 * Retrieves and deserializes a ValidatorList account using a web3js connection and the validator list address.
 * @param connection: An active web3js connection.
 * @param UserListPubKey: The public key (address) of the validator list account.
 */
export async function getStakeUserListAccount(
  connection: solanaWeb3.Connection,
  UserListPubKey: solanaWeb3.PublicKey
): Promise<void> {
  try {
    addStakePoolSchema(SOLANA_SCHEMA)
    const account = await connection.getAccountInfo(UserListPubKey)
    if (account != null) {
      const result = StakeUserList.decode(account.data)
      // eslint-disable-next-line camelcase
      const user_list: any = result.users
      // eslint-disable-next-line camelcase
      for (const entry of user_list) {
        const pubkey: PublicKey = entry.userAccountAddress
        // eslint-disable-next-line eqeqeq
        if (entry.signed == 1) {
          console.log(
            'userAccountAddress:',
            pubkey,
            'stakeAmount:',
            entry.stakeAmount.toNumber(),
            'reward_debt:',
            entry.rewardDebt.toNumber()
          )
        } else {
          // eslint-disable-next-line camelcase
          const reward_debt = 0 - entry.rewardDebt
          console.log(
            'userAccountAddress:',
            pubkey,
            'stakeAmount:',
            entry.stakeAmount.toNumber(),
            'reward_debt:',
            reward_debt
          )
        }
      }
    } else {
      console.log('stake user list is null')
    }
  } catch (error) {
    console.log('error happend')
    console.log(error)
  }
}

export async function getStakeUserAccountInfo(
  connection: solanaWeb3.Connection,
  UserListPubKey: solanaWeb3.PublicKey,
  userPubKey: solanaWeb3.PublicKey
): Promise<StakeUserInfo | null> {
  addStakePoolSchema(SOLANA_SCHEMA)
  const account = await connection.getAccountInfo(UserListPubKey)
  if (account != null) {
    const result = StakeUserList.decode(account.data)
    // eslint-disable-next-line camelcase
    const user_list = result.users
    // eslint-disable-next-line camelcase
    for (const entry of user_list) {
      const pubkey: PublicKey = entry.userAccountAddress
      // eslint-disable-next-line eqeqeq
      if (pubkey.toString() === userPubKey.toString()) {
        const stakeAmount = entry.stakeAmount
        const rewardDebt = entry.rewardDebt
        const stake = new StakeUserInfo(userPubKey)
        stake.stakeAmount = stakeAmount
        stake.sigend = entry.signed
        stake.rewardDebt = rewardDebt
        return stake
      }
    }
  }
  return null
}

export async function getStakeUserIdx(
  connection: solanaWeb3.Connection,
  UserListPubKey: solanaWeb3.PublicKey,
  userPubKey: solanaWeb3.PublicKey
): Promise<number> {
  addStakePoolSchema(SOLANA_SCHEMA)
  const account = await connection.getAccountInfo(UserListPubKey)
  if (account != null) {
    const result = StakeUserList.decode(account.data)
    let idx = 1
    // eslint-disable-next-line camelcase
    const user_list = result.users
    // eslint-disable-next-line camelcase
    for (const entry of user_list) {
      const pubkey: PublicKey = entry.userAccountAddress
      console.log('entry is', pubkey.toString(), 'the user pubkey', userPubKey.toString())
      if (pubkey.equals(userPubKey)) {
        return idx
      }
      idx = idx + 1
    }
  }
  return 0
}
