import { Numberu64 } from '../tokenSwap'
import * as Layout from '../tokenSwap/layout'
import * as BufferLayout from 'buffer-layout'
import { Account, Connection, PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js'
import { NATIVE_SOL, getTokenByMintAddress, WSOL } from './tokens'
import { TokenAmount } from '@/utils/safe-math'
import {
  createTokenAccountIfNotExist,
  createAssociatedTokenAccountIfNotExist,
  sendTransaction,
  getMultipleAccounts,
  commitment
} from '@/utils/web3'
import { closeAccount } from '@project-serum/serum/lib/token-instructions'
import { price2tick, tick2price } from './common'
import { loadAccount } from '@/tokenSwap/util/account'
import { TokenSwap, TokenSwapLayout, Numberu128, TickInfoLayout, Number128, TickInfo } from '@/tokenSwap'
import { SWAPV3_PROGRAMID, SWAP_PAYER, PAYER } from './ids'
import { preswap, TickWord } from '@/tokenSwap/swapv3'
import { cloneDeep } from 'lodash-es'

// export async function loadTickInfo(
//   connection: Connection,
//   address: PublicKey,
//   tick_append_index: number
// ): Promise<Array<TickInfo>> {
//   // const connection = await getConnection()
//   let tickInfos = await TickInfo.loadTickInfo(connection, address, SWAPV3_PROGRAMID, tick_append_index)
//   // for (let i = 0; i < tick_append_index; i++) {
//   //   let tickInfo = tickInfos[i]
//   //   console.log('the %dth tickinfo is %s', i, tickInfo)
//   // }
//   return tickInfos
// }

export function getOutAmount(
  connection: Connection,
  pool: any,
  fromCoinMint: string,
  toCoinMint: string,
  amount: number,
  slippage: number
) {
  const poolInfo = cloneDeep(pool)
  const { coin, pc } = poolInfo
  //direct is swap dirction, 0 -> x swap y  1 -> y swap x
  const direct = fromCoinMint === coin.mintAddress && toCoinMint === pc.mintAddress ? 0 : 1

  let tick_infos = poolInfo.tick_info_array
  let tick_word = new TickWord(tick_infos, tick_infos.length)

  let dst = preswap(amount, direct, poolInfo, tick_word)
  console.log('the preswap caclutate the result is ', dst)
  const _decimals = direct === 0 ? pc.decimals : coin.decimals
  const amountOutWithSlippage = dst / (1 + slippage / 100)

  return {
    amountOut: new TokenAmount(dst, _decimals),
    amountOutWithSlippage: new TokenAmount(amountOutWithSlippage, _decimals)
  }
}

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
  console.log('swap####aIn####', aIn)
  console.log('swap####aOut####', aOut)
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

  console.log('Math.floor(amountIn.toWei().toNumber())###', Math.floor(amountIn.toWei().toNumber()))
  console.log('Math.floor(amountOut.toWei().toNumber())####', Math.floor(amountOut.toWei().toNumber()))

  let fromMint = fromCoinMint
  let toMint = toCoinMint

  if (fromMint === NATIVE_SOL.mintAddress) {
    fromMint = WSOL.mintAddress
  }
  if (toMint === NATIVE_SOL.mintAddress) {
    toMint = WSOL.mintAddress
  }

  let wrappedSolAccount: PublicKey | null = null
  let wrappedSolAccount2: PublicKey | null = null

  if (fromCoinMint === NATIVE_SOL.mintAddress) {
    wrappedSolAccount = await createTokenAccountIfNotExist(
      connection,
      wrappedSolAccount,
      owner,
      WSOL.mintAddress,
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
      WSOL.mintAddress,
      1e7,
      transaction,
      signers
    )
  }

  console.log('fromCoinMint$$$$###', fromCoinMint)
  console.log('toCoinMint$$$$###', toCoinMint)
  console.log('fromTokenAccount####', fromTokenAccount)
  let newFromTokenAccount
  if (!wrappedSolAccount) {
    newFromTokenAccount = await createAssociatedTokenAccountIfNotExist(fromTokenAccount, owner, fromMint, transaction)
    console.log('newFromTokenAccount####', newFromTokenAccount.toString())
  }

  let newToTokenAccount
  if (!wrappedSolAccount2) {
    newToTokenAccount = await createAssociatedTokenAccountIfNotExist(toTokenAccount, owner, toMint, transaction)
    console.log('newToTokenAccount####', newToTokenAccount.toString())
  }
  console.log('wrappedSolAccount####', wrappedSolAccount)

  transaction.add(
    swapInstruction(
      poolInfo.tokenSwap,
      poolInfo.authority,
      owner,
      wrappedSolAccount || newFromTokenAccount,
      wrappedSolAccount2 || newToTokenAccount,
      fromCoinMint === poolInfo.coin.mintAddress
        ? new PublicKey(poolInfo.poolCoinTokenAccount)
        : new PublicKey(poolInfo.poolPcTokenAccount),
      toCoinMint === poolInfo.pc.mintAddress
        ? new PublicKey(poolInfo.poolPcTokenAccount)
        : new PublicKey(poolInfo.poolCoinTokenAccount),
      poolInfo.tick_detail_key,
      poolInfo.swapProgramId,
      poolInfo.tokenProgramId,
      Math.floor(amountIn.toWei().toNumber()),
      Math.floor(amountOut.toWei().toNumber())
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

function swapInstruction(
  tokenSwap: PublicKey,
  authority: PublicKey,
  userTransferAuthority: PublicKey,
  userSource: PublicKey,
  userDestination: PublicKey,
  swapSource: PublicKey,
  swapDestination: PublicKey,
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
  const keys = [
    { pubkey: tokenSwap, isSigner: false, isWritable: true },
    { pubkey: authority, isSigner: false, isWritable: false },
    { pubkey: userTransferAuthority, isSigner: true, isWritable: false },
    { pubkey: userSource, isSigner: false, isWritable: true },
    { pubkey: userDestination, isSigner: false, isWritable: true },
    { pubkey: swapSource, isSigner: false, isWritable: true },
    { pubkey: swapDestination, isSigner: false, isWritable: true },
    { pubkey: tick_info_key, isSigner: false, isWritable: true },
    { pubkey: tokenProgramId, isSigner: false, isWritable: false }
  ]
  return new TransactionInstruction({
    keys,
    programId: swapProgramId,
    data
  })
}
