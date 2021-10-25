import { Numberu64 } from '../tokenSwap'
import * as Layout from '../tokenSwap/layout'
import * as BufferLayout from 'buffer-layout'
import { Account, Connection, PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js'
import { NATIVE_SOL, TOKENS, getTokenByMintAddress } from './tokens'
import { TokenAmount } from '@/utils/safe-math'
import { createTokenAccountIfNotExist, createAssociatedTokenAccountIfNotExist, sendTransaction } from '@/utils/web3'
import { closeAccount } from '@project-serum/serum/lib/token-instructions'

export async function swap(
  connection: Connection,
  wallet: any,
  poolInfo: any,
  fromCoinMint: string,
  toCoinMint: string,
  fromTokenAccount: string,
  toTokenAccount: string,
  aIn: string,
  aOut: string
) {
  const transaction = new Transaction()
  const signers: Account[] = []

  const owner = wallet.publicKey

  const from = getTokenByMintAddress(fromCoinMint)
  const to = getTokenByMintAddress(toCoinMint)

  if (!from || !to) {
    throw new Error('Miss token info')
  }
  if (!poolInfo.tokenSwapAccount) {
    throw new Error('Miss token swap account')
  }

  const amountIn = new TokenAmount(aIn, from.decimals, false)
  const amountOut = new TokenAmount(aOut, to.decimals, false)

  console.log('amountIn####', amountIn)
  console.log('amountOut####', amountOut)

  let fromMint = fromCoinMint
  let toMint = toCoinMint

  if (fromMint === NATIVE_SOL.mintAddress) {
    fromMint = TOKENS.WSOL.mintAddress
  }
  if (toMint === NATIVE_SOL.mintAddress) {
    toMint = TOKENS.WSOL.mintAddress
  }

  let wrappedSolAccount: PublicKey | null = null
  let wrappedSolAccount2: PublicKey | null = null

  if (fromCoinMint === NATIVE_SOL.mintAddress) {
    wrappedSolAccount = await createTokenAccountIfNotExist(
      connection,
      wrappedSolAccount,
      owner,
      TOKENS.WSOL.mintAddress,
      amountIn.wei.toNumber() + 1e7,
      transaction,
      signers
    )
  }
  if (toCoinMint === NATIVE_SOL.mintAddress) {
    wrappedSolAccount2 = await createTokenAccountIfNotExist(
      connection,
      wrappedSolAccount2,
      owner,
      TOKENS.WSOL.mintAddress,
      1e7,
      transaction,
      signers
    )
  }

  console.log('fromCoinMint$$$$###', fromCoinMint)
  console.log('toCoinMint$$$$###', toCoinMint)
  console.log('fromTokenAccount####', fromTokenAccount)
  const newFromTokenAccount = await createAssociatedTokenAccountIfNotExist(
    fromTokenAccount,
    owner,
    fromMint,
    transaction
  )
  console.log('newFromTokenAccount####', newFromTokenAccount.toString())
  console.log('toTokenAccount#####', toTokenAccount)
  const newToTokenAccount = await createAssociatedTokenAccountIfNotExist(toTokenAccount, owner, toMint, transaction)

  console.log('wrappedSolAccount####', wrappedSolAccount)
  console.log('newToTokenAccount####', newToTokenAccount.toString())

  const SWAPV3_PROGRAMID = new PublicKey('C8L7YYHrn38sKfAxVo5BFsGYFWcLeRAdaavVNfzg9s5N')

  transaction.add(
    swapInstruction(
      new PublicKey(poolInfo.tokenSwapAccount),
      new PublicKey(poolInfo.authority),
      owner,
      // wrappedSolAccount ?? newFromTokenAccount,
      // wrappedSolAccount2 ?? newToTokenAccount,
      wrappedSolAccount ?? new PublicKey(fromTokenAccount),
      wrappedSolAccount2 ?? new PublicKey(toTokenAccount),
      fromCoinMint === poolInfo.coin.mintAddress
        ? new PublicKey(poolInfo.poolCoinTokenAccount)
        : new PublicKey(poolInfo.poolPcTokenAccount),
      toCoinMint === poolInfo.pc.mintAddress
        ? new PublicKey(poolInfo.poolPcTokenAccount)
        : new PublicKey(poolInfo.poolCoinTokenAccount),
      new PublicKey(poolInfo.tickMapPubkey),
      new PublicKey(poolInfo.tickPositionKey),
      new PublicKey(poolInfo.tickDetailKey),
      SWAPV3_PROGRAMID,
      new PublicKey(poolInfo.programId),
      // Math.floor(amountIn.toWei().toNumber()),
      // Math.floor(amountOut.toWei().toNumber())
      40000,
      1
    )
  )

  if (wrappedSolAccount) {
    transaction.add(
      closeAccount({
        source: wrappedSolAccount,
        destination: owner,
        owner
      })
    )
  }
  if (wrappedSolAccount2) {
    transaction.add(
      closeAccount({
        source: wrappedSolAccount2,
        destination: owner,
        owner
      })
    )
  }

  return await sendTransaction(connection, wallet, transaction, signers)
}

export function swapInstruction(
  tokenSwap: PublicKey,
  authority: PublicKey,
  userTransferAuthority: PublicKey,
  userSource: PublicKey,
  userDestination: PublicKey,
  swapSource: PublicKey,
  swapDestination: PublicKey,
  tick_map_key: PublicKey,
  tick_position_key: PublicKey,
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

  console.log('参数1###tokenSwap####', tokenSwap.toString())
  console.log('参数2###authority####', authority.toString())
  console.log('参数3###userTransferAuthority####', userTransferAuthority.toString())
  console.log('参数4###userSource####', userSource.toString())
  console.log('参数5###userDestination####', userDestination.toString())
  console.log('参数6###swapSource####', swapSource.toString())
  console.log('参数7###swapDestination####', swapDestination.toString())
  console.log('参数8###tick_map_key####', tick_map_key.toString())
  console.log('参数9###tick_position_key####', tick_position_key.toString())
  console.log('参数10###tick_info_key####', tick_info_key.toString())
  console.log('参数11###tokenProgramId####', tokenProgramId.toString())
  const keys = [
    { pubkey: tokenSwap, isSigner: false, isWritable: true },
    { pubkey: authority, isSigner: false, isWritable: false },
    { pubkey: userTransferAuthority, isSigner: true, isWritable: false },
    { pubkey: userSource, isSigner: false, isWritable: true },
    { pubkey: userDestination, isSigner: false, isWritable: true },
    { pubkey: swapSource, isSigner: false, isWritable: true },
    { pubkey: swapDestination, isSigner: false, isWritable: true },
    { pubkey: tick_map_key, isSigner: false, isWritable: true },
    { pubkey: tick_position_key, isSigner: false, isWritable: true },
    { pubkey: tick_info_key, isSigner: false, isWritable: true },
    { pubkey: tokenProgramId, isSigner: false, isWritable: false }
  ]
  // const keys = [
  //   { pubkey: new PublicKey('CHdxYT1DWMraPrMUa5suYdNeh9h5SL7ZoZsXVJPxEYNV'), isSigner: false, isWritable: true },
  //   { pubkey: new PublicKey('Dwesu9Fg63QifmUP7epm9RHhDD8e9rpCdMYA3keqCCyN'), isSigner: false, isWritable: false },
  //   { pubkey: new PublicKey('Dk16caR9W5joxGB74wJ2PsYJVvvvVD8bKPkzYHq7qVot'), isSigner: true, isWritable: false },
  //   { pubkey: new PublicKey('4pi8DAxwQ13SJiDCw5WT5AqKZsGbtz2HQSTsJy3Pxcy4'), isSigner: false, isWritable: true },
  //   { pubkey: new PublicKey('Cyrfy1xsvuRv3BGnTdpELtT5BvGUQygqXo7iDRkjsX4v'), isSigner: false, isWritable: true },
  //   { pubkey: new PublicKey('3jgBQWwgsLnUU8mMyags9f4sqKaMdAweV6dAv5B8ULET'), isSigner: false, isWritable: true },
  //   { pubkey: new PublicKey('DGRXbamNuabgabHCpT4S9eExKEGQgShXAtX8TeH1ere6'), isSigner: false, isWritable: true },
  //   { pubkey: new PublicKey('GznACvQZxes7k2CA7z5SQYpjdmYUysBTvZ4C4AXkifbL'), isSigner: false, isWritable: true },
  //   { pubkey: new PublicKey('D9bMcvY4oXeJ9bBp618EAAgiH3JrQqqU3PQjmVp7yqW8'), isSigner: false, isWritable: true },
  //   { pubkey: new PublicKey('2BNMYw76D6bgBSTaGMJ9pyDZ2xKw8HgnQbbukPoG2TNr'), isSigner: false, isWritable: true },
  //   { pubkey: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'), isSigner: false, isWritable: false }
  // ]
  return new TransactionInstruction({
    keys,
    programId: swapProgramId,
    data
  })
}
