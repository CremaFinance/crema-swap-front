import { sendAndConfirmTransaction as realSendAndConfirmTransaction, Signer } from '@solana/web3.js'
import type { Connection, Transaction, TransactionSignature } from '@solana/web3.js'

export function sendAndConfirmTransaction(
  title: string,
  connection: Connection,
  transaction: Transaction,
  ...signers: Array<Signer>
): Promise<TransactionSignature> {
  console.log('sendAndConfirmTransaction###signers#####', signers)
  console.log('sendAndConfirmTransaction###transaction#####', transaction)
  return realSendAndConfirmTransaction(connection, transaction, signers, {
    skipPreflight: false,
    commitment: 'recent',
    preflightCommitment: 'recent'
  })
}
