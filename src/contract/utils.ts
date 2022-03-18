import { Provider as AnchorProvider, setProvider } from '@project-serum/anchor'
import { SignerWallet, SolanaProvider } from '@saberhq/solana-contrib'
import type { AccountInfo } from '@solana/spl-token'
import { AccountLayout, TOKEN_PROGRAM_ID, u64 } from '@solana/spl-token'
import type { AccountInfo as BaseAccountInfo, Signer, TokenAccountsFilter } from '@solana/web3.js'
import { clusterApiUrl, Connection, Keypair, PublicKey } from '@solana/web3.js'
import BN from 'bn.js'
// import { Table } from 'console-table-printer'
import * as fs from 'fs'
import invariant from 'tiny-invariant'
import * as toml from 'toml'
import { QuarrySDK } from 'test-quarry-sdk'

export async function currentTs(connection: Connection): Promise<BN> {
  const solt = await connection.getSlot()
  const ts = await connection.getBlockTime(solt)
  invariant(ts !== null, 'Get block time failed')
  return new BN(ts?.toString())
}
