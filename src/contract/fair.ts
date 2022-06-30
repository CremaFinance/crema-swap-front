import * as anchor from '@project-serum/anchor'
import { Program, AnchorProvider } from '@project-serum/anchor'
import { PublicKey, Keypair, Transaction, Connection, Commitment, TransactionSignature } from '@solana/web3.js'
import { POOL_ACCOUNT, poolAccount, MELON_MINT } from '@/utils/fair'
import { getATAAddress, getOrCreateATA } from '@saberhq/token-utils'
const serum = require('@project-serum/common')

const TokenInstructions = require('@project-serum/serum').TokenInstructions

const TOKEN_PROGRAM_ID = new anchor.web3.PublicKey(TokenInstructions.TOKEN_PROGRAM_ID.toString())
export const programGen = (wallet: any, connection: Connection, idl: any) => {
  console.log('这里的anchor里面有什么####', anchor)
  const provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions())
  const programID = new PublicKey('CiDoyZEpx3V5fDt2hhZrD43idfgDJUhDHxToqC6upm1V')
  const program = new Program(idl as anchor.Idl, programID, provider)
  return program
}

export async function getPoolAccount(program, account: PublicKey) {
  const poolAccount = await program.account.poolAccount.fetch(account)
  return {
    distributionAuthority: poolAccount.distributionAuthority.toBase58(),
    endDepositsTs: poolAccount.endDepositsTs.toNumber(),
    endIdoTs: poolAccount.endIdoTs.toNumber(),
    nonce: poolAccount.nonce,
    numIdoTokens: poolAccount.numIdoTokens.toNumber(),
    poolUsdc: poolAccount.poolUsdc,
    poolWatermelon: poolAccount.poolWatermelon,
    redeemableMint: poolAccount.redeemableMint,
    watermelonMint: poolAccount.watermelonMint,
    startIdoTs: poolAccount.startIdoTs.toNumber()
  }
}

export async function sendTransaction(
  connection: Connection,
  wallet: any,
  transaction: Transaction,
  signers: Array<Keypair> = []
) {
  const commitment: Commitment = 'confirmed'
  const txid: TransactionSignature = await wallet.sendTransaction(transaction, connection, {
    signers,
    skipPreflight: true,
    preflightCommitment: commitment
  })

  return txid
}

export async function exchangeUsdcForRedeemable(
  // program: Program,
  program: any,
  poolAccountInfo,
  amount,
  userUsdc,
  redeemableMint,
  provider
) {
  const [_poolSigner, nonce] = await anchor.web3.PublicKey.findProgramAddress(
    [poolAccountInfo.watermelonMint.toBuffer()],
    program.programId
  )
  const poolSigner = _poolSigner
  const userAuthority = new PublicKey(program.provider.wallet.publicKey)
  const depositTransaction = new Transaction()
  console.log(POOL_ACCOUNT.toBase58(), 'POOL_ACCOUNT##')

  const { address: redeemableATA, instruction: redeemableATAInstruction } = await getOrCreateATA({
    provider,
    mint: redeemableMint,
    owner: userAuthority,
    payer: userAuthority
  })
  console.log(redeemableATA.toBase58(), 'redeemableATA##')
  if (redeemableATAInstruction) {
    depositTransaction.add(redeemableATAInstruction)
  }

  depositTransaction.add(
    program.instruction.exchangeUsdcForRedeemable(amount, {
      accounts: {
        poolAccount,
        poolSigner,
        redeemableMint: poolAccountInfo.redeemableMint,
        poolUsdc: poolAccountInfo.poolUsdc,
        userAuthority,
        userUsdc,
        userRedeemable: redeemableATA,
        tokenProgram: TOKEN_PROGRAM_ID,
        clock: anchor.web3.SYSVAR_CLOCK_PUBKEY
      }
    })
  )
  const tx = await sendTransaction(program.provider.connection, program.provider.wallet, depositTransaction)
  return tx
}
// export async function WithdrawRedeemableTokens(program: Program, poolAccountInfo, amount, userUsdc, userRedeemable) {
export async function WithdrawRedeemableTokens(program: any, poolAccountInfo, amount, userUsdc, userRedeemable) {
  const [_poolSigner, nonce] = await anchor.web3.PublicKey.findProgramAddress(
    [poolAccountInfo.watermelonMint.toBuffer()],
    program.programId
  )
  const poolSigner = _poolSigner
  const userAuthority = new PublicKey(program.provider.wallet.publicKey)
  const depositTransaction = new Transaction()
  depositTransaction.add(
    program.instruction.exchangeRedeemableForUsdc(amount, {
      accounts: {
        poolAccount,
        poolSigner,
        redeemableMint: poolAccountInfo.redeemableMint,
        poolUsdc: poolAccountInfo.poolUsdc,
        userAuthority,
        userUsdc,
        userRedeemable,
        tokenProgram: TOKEN_PROGRAM_ID,
        clock: anchor.web3.SYSVAR_CLOCK_PUBKEY
      }
    })
  )
  const tx = await sendTransaction(program.provider.connection, program.provider.wallet, depositTransaction)
  return tx
}

// export async function exchangeRedeemableForWatermelon(program: Program, poolAccountInfo: any, firstWithdrawal, provider) {
export async function exchangeRedeemableForWatermelon(program: any, poolAccountInfo: any, firstWithdrawal, provider) {
  const [_poolSigner, nonce] = await anchor.web3.PublicKey.findProgramAddress(
    [poolAccountInfo.watermelonMint.toBuffer()],
    program.programId
  )
  const poolSigner = _poolSigner
  const userAuthority = new PublicKey(program.provider.wallet.publicKey)
  const redeemableMint = poolAccountInfo.redeemableMint
  console.log(redeemableMint.toBase58(), 'redeemableMint##')
  const poolWatermelon = poolAccountInfo.poolWatermelon
  console.log(poolWatermelon.toBase58(), 'poolWatermelon##')
  const claimTransaction = new Transaction()
  const { address: redeemableATA, instruction: redeemableATAInstruction } = await getOrCreateATA({
    provider,
    mint: redeemableMint,
    owner: userAuthority,
    payer: userAuthority
  })
  if (redeemableATAInstruction) {
    claimTransaction.add(redeemableATAInstruction)
  }

  const { address: watermelonATA, instruction: watermelonATAInstruction } = await getOrCreateATA({
    provider,
    mint: MELON_MINT,
    owner: userAuthority,
    payer: userAuthority
  })
  if (watermelonATAInstruction) {
    claimTransaction.add(watermelonATAInstruction)
  }

  claimTransaction.add(
    program.instruction.exchangeRedeemableForWatermelon(firstWithdrawal, {
      accounts: {
        poolAccount,
        poolSigner,
        redeemableMint: poolAccountInfo.redeemableMint,
        poolWatermelon: poolAccountInfo.poolWatermelon,
        userAuthority,
        userWatermelon: watermelonATA,
        userRedeemable: redeemableATA,
        tokenProgram: TOKEN_PROGRAM_ID,
        clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
      },
    })
  )
  const tx = await sendTransaction(program.provider.connection, program.provider.wallet, claimTransaction)
  console.log(tx, 'tx##')
  return tx
}


