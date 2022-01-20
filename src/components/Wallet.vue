<template>
  <div>
    <div v-if="!wallet.connected" class="connect-btn" @click="$accessor.wallet.openModal">
      <!-- <div class="connect-btn"> -->
      <!-- <svg class="icon" aria-hidden="true">
          <use xlink:href="#iconicon_wallet"></use>
        </svg> -->
      <span class="connect-text">Connect</span>
      <!-- </div> -->
    </div>
    <div v-else class="connect-btn-back" @click="$accessor.wallet.openModal">
      <div class="connect-btn">
        <!-- <svg class="icon" aria-hidden="true">
          <use xlink:href="#iconicon_wallet"></use>
        </svg> -->
        <div class="wallet-icon-and-name">
          <img
            v-lazy="importIcon(`/wallets/${wallet.platform.replace(' ', '-').toLowerCase()}.png`)"
            class="wallet-icon"
          />
          <span v-if="wallet.platform" class="platform">{{ wallet.platform }}</span>
        </div>
        <span class="address">
          {{ wallet.address && wallet.address.substr(0, 4) }}
          ...
          {{ wallet.address && wallet.address.substr(wallet.address.length - 4, 4) }}
        </span>
        <!-- <svg class="icon icon-down" aria-hidden="true">
          <use xlink:href="#icondown"></use>
        </svg> -->
      </div>
    </div>

    <Modal :width="400" :visible="wallet.modalShow" :footer="null" centered @cancel="$accessor.wallet.closeModal">
      <template slot="closeIcon">
        <svg class="icon modal-icon-close" aria-hidden="true">
          <use xlink:href="#icon-icon-close"></use>
        </svg>
      </template>
      <template slot="title">
        <h3 v-if="!wallet.connected" class="wallet-title">Connect a Wallet</h3>
        <p v-if="!wallet.connected" class="wallet-sub-title">Please select a wallet to connect to this dapp:</p>
        <h3 v-if="wallet.connected" class="wallet-title">Account</h3>
      </template>
      <div v-if="!wallet.connected" class="select-wallet">
        <button
          v-for="(info, name) in wallets"
          :key="name"
          :disabled="isLoading"
          class="wallet-item"
          ghost
          @click="connect(name, info)"
        >
          <!-- <div> -->
          <div class="icon-box">
            <img v-lazy="importIcon(`/wallets/${name.replace(' ', '-').toLowerCase()}.png`)" />
          </div>
          <span>{{ name }}</span>
          <!-- </div> -->
        </button>
      </div>
      <div v-else class="wallet-info">
        <div class="platform">Connected with {{ wallet.platform }}</div>
        <p class="address">
          {{ wallet.address && wallet.address.substr(0, 7) }}
          ...
          {{ wallet.address && wallet.address.substr(wallet.address.length - 4, 4) }}
          <svg class="icon" aria-hidden="true" @click="$accessor.copy(wallet.address)">
            <use xlink:href="#icon-icon_copy"></use>
          </svg>
        </p>
        <div class="copy-and-view">
          <!-- <a class="copy" @click="$accessor.copy(wallet.address)">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#iconicon_copy"></use>
            </svg>
            <span>Copy Address</span>
          </a> -->
          <a class="view" target="_blank" :href="`https://explorer.solana.com//address/${wallet.address}`">
            <!-- <svg class="icon" aria-hidden="true">
              <use xlink:href="#iconicon_The_top_right"></use>
            </svg> -->
            <span>View on explorer</span>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-icon-Jump"></use>
            </svg>
          </a>
        </div>
        <div class="btn-box">
          <Button class="disconnect-btn" ghost @click="disconnect"> Disconnect </Button>
          <div class="switch-wallet-btn-box">
            <Button class="switch-wallet-btn" @click="disconnect"> Switch Wallet </Button>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { Button, Modal, Icon } from 'ant-design-vue'
import { AccountInfo, Context } from '@solana/web3.js'
// @ts-ignore
import SolanaWalletAdapter from '@project-serum/sol-wallet-adapter'

import importIcon from '@/utils/import-icon'
import logger from '@/utils/logger'
import { web3Config, commitment } from '@/utils/web3'
// import {
//   WalletAdapter,
//   SolongWalletAdapter,
//   MathWalletAdapter,
//   PhantomWalletAdapter,
//   BloctoWalletAdapter,
//   LedgerWalletAdapter
// } from '@/wallets'
import { WalletAdapter } from '@solana/wallet-adapter-base'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom'
import { SolongWalletAdapter } from '@solana/wallet-adapter-solong'
// import { MathWalletWalletAdapter } from '@solana/wallet-adapter-mathwallet'
// import { MathWalletAdapter } from '@solana/wallet-adapter-mathwallet'
import { SolletWalletAdapter } from '@solana/wallet-adapter-sollet'
import { LedgerWalletAdapter, getDerivationPath } from '@solana/wallet-adapter-ledger'
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare'
import { Coin98WalletAdapter } from '@solana/wallet-adapter-coin98'
import { SlopeWalletAdapter } from '@solana/wallet-adapter-slope'
import { SafePalWalletAdapter } from '@solana/wallet-adapter-safepal'
import { BloctoWalletAdapter } from '@solana/wallet-adapter-blocto'
import { BitpieWalletAdapter } from '@solana/wallet-adapter-bitpie'
import LocalStorage from '@/utils/local-storage'
import { getUnixTs } from '@/utils'

import { debounce, throttle } from 'lodash-es'

// fix: Failed to resolve directive: ant-portal
Vue.use(Modal)

interface WalletInfo {
  // official website
  website: string
  // provider url for web wallet
  providerUrl?: string
  // chrome extension install url
  chromeUrl?: string
  // firefox extension install url
  firefoxUrl?: string
  // isExtension: boolean
  getAdapter: (providerUrl?: string) => WalletAdapter
}

interface Wallets {
  [key: string]: string
}

@Component({
  components: {
    Button,
    Modal,
    Icon
  }
})
export default class Wallet extends Vue {
  /* ========== DATA ========== */
  // TrustWallet ezDeFi
  wallets: { [key: string]: WalletInfo } = {
    Phantom: {
      website: 'https://phantom.app',
      chromeUrl: 'https://chrome.google.com/webstore/detail/phantom/bfnaelmomeimhlpmgjnjophhpkkoljpa',
      getAdapter() {
        return new PhantomWalletAdapter()
      }
    },
    'Solflare Extension': {
      website: 'https://solflare.com',
      firefoxUrl: 'https://addons.mozilla.org/en-US/firefox/addon/solflare-wallet',
      getAdapter() {
        return new SolflareWalletAdapter()
      }
    },
    'Sollet Web': {
      website: 'https://www.sollet.io',
      providerUrl: 'https://www.sollet.io',
      getAdapter(providerUrl) {
        return new SolletWalletAdapter({ provider: providerUrl })
      }
    },
    'Sollet Extension': {
      website: 'https://www.sollet.io',
      chromeUrl: 'https://chrome.google.com/webstore/detail/sollet/fhmfendgdocmcbmfikdcogofphimnkno',
      getAdapter() {
        return new SolletWalletAdapter({ provider: (window as any).sollet })
      }
    },
    Ledger: {
      website: 'https://www.ledger.com',
      getAdapter() {
        return new LedgerWalletAdapter({ derivationPath: getDerivationPath() })
      }
    },
    // MathWallet: {
    //   website: 'https://mathwallet.org',
    //   chromeUrl: 'https://chrome.google.com/webstore/detail/math-wallet/afbcbjpbpfadlkmhmclhkeeodmamcflc',
    //   getAdapter() {
    //     return new MathWalletWalletAdapter()
    //   }
    // },
    // MathWallet: {
    //   website: 'https://mathwallet.org',
    //   chromeUrl: 'https://chrome.google.com/webstore/detail/math-wallet/afbcbjpbpfadlkmhmclhkeeodmamcflc',
    //   getAdapter() {
    //     return new MathWalletAdapter()
    //   }
    // },
    Solong: {
      website: 'https://solongwallet.com',
      chromeUrl: 'https://chrome.google.com/webstore/detail/solong/memijejgibaodndkimcclfapfladdchj',
      getAdapter() {
        return new SolongWalletAdapter()
      }
    },
    Coin98: {
      website: 'https://www.coin98.com',
      chromeUrl: 'https://chrome.google.com/webstore/detail/coin98-wallet/aeachknmefphepccionboohckonoeemg',
      getAdapter() {
        return new Coin98WalletAdapter()
      }
    },
    Blocto: {
      website: 'https://blocto.portto.io',
      getAdapter() {
        return new BloctoWalletAdapter()
      }
    },
    Safepal: {
      website: 'https://safepal.io',
      getAdapter() {
        return new SafePalWalletAdapter()
      }
    },
    Slope: {
      website: 'https://slope.finance',
      chromeUrl: 'https://chrome.google.com/webstore/detail/slope-finance-wallet/pocmplpaccanhmnllbbkpgfliimjljgo',
      getAdapter() {
        return new SlopeWalletAdapter()
      }
    },
    Bitpie: {
      website: 'https://bitpie.com',
      getAdapter() {
        return new BitpieWalletAdapter()
      }
    },
    // Torus: {
    //   website: 'https://tor.us',
    //   getAdapter() {
    //     return new TorusWalletAdapter({
    //       options: {
    //         clientId: ''
    //       }
    //     })
    //   }
    // },
    'Solflare Web': {
      website: 'https://solflare.com',
      providerUrl: 'https://solflare.com/access-wallet',
      getAdapter(providerUrl) {
        return new SolletWalletAdapter({ provider: providerUrl })
      }
    }
  }

  isDisConnect: boolean = false
  isLoading: boolean = false

  walletErrorObj: any = {
    WalletNotFoundError: 'Wallet not found error',
    WalletNotInstalledError: 'Wallet not installed error',
    WalletNotReadyError: 'Wallet not ready error',
    WalletConnectionError: 'Wallet connection error',
    WalletDisconnectedError: 'Wallet disconnected error',
    WalletDisconnectionError: 'Wallet disconnection error',
    WalletAccountError: 'Wallet account error',
    WalletPublicKeyError: 'Wallet publicKey error',
    WalletKeypairError: 'Wallet keypair error',
    WalletNotConnectedError: 'Wallet not connected error',
    WalletSendTransactionError: 'Wallet send transaction error',
    WalletSignMessageError: 'Wallet sign message error',
    WalletSignTransactionError: 'Wallet signTransaction error',
    WalletTimeoutError: 'Wallet timeout error',
    WalletWindowBlockedError: 'Wallet window blocked error',
    WalletWindowClosedError: 'Wallet window closed error'
  }

  connectingWallet = {
    name: null as string | null,
    adapter: null as WalletAdapter | null
  }

  currentWalletName: string = ''
  // autoConnect
  lastWalletName = LocalStorage.get('WALLET_NAME')

  // auto refresh
  walletTimer: number | undefined = undefined
  priceTimer: number | undefined = undefined
  liquidityTimer: number | undefined = undefined
  farmTimer: number | undefined = undefined
  idoTimer: number | undefined = undefined
  fetchTransactionsTimer: number | undefined = undefined
  // web3 listener
  walletListenerId = null as number | null

  debugCount = 0

  /* ========== COMPUTED ========== */
  get wallet() {
    return this.$accessor.wallet
  }

  // get price() {
  //   return this.$accessor.price
  // }

  get liquidity() {
    return this.$accessor.liquidity
  }

  // get farm() {
  //   return this.$accessor.farm
  // }

  // get ido() {
  //   return this.$accessor.ido
  // }

  // // history
  get historyList(): any[] {
    const rawList = Object.entries(this.$accessor.transaction.history[this.$accessor.wallet.address] ?? {}).map(
      ([txid, txInfo]) => ({
        ...(txInfo as any),
        txid
      })
    )
    return rawList.sort((a, b) => {
      return (b.time || b.t) - (a.time || a.t)
    })
  }

  /* ========== LIFECYCLE ========== */
  async beforeMount() {
    // await this.$accessor.price.requestPrices()
    await this.$accessor.liquidity.requestInfos()
    // await this.$accessor.swap.getMarkets()
    // await this.$accessor.farm.requestInfos()

    this.setWalletTimer()
    // this.setPriceTimer()
    this.setLiquidityTimer()
    // this.setFarmTimer()
    // this.setIdoTimer()
  }

  mounted() {
    this.autoConnect()
  }

  beforeDestroy() {
    window.clearInterval(this.walletTimer)
    // window.clearInterval(this.priceTimer)
    window.clearInterval(this.liquidityTimer)
    // window.clearInterval(this.farmTimer)
    // window.clearInterval(this.idoTimer)
  }

  /* ========== WATCH ========== */

  /* ========== METHODS ========== */
  importIcon = importIcon

  autoConnect() {
    const name = this.lastWalletName
    if (name && !this.$accessor.wallet.connected) {
      const info = this.wallets[name]
      if (info) {
        this.connect(name, info)
      }
    }
  }

  onConnect() {
    console.log('1212121212')
    const { name, adapter } = this.connectingWallet
    this.isLoading = false
    this.$accessor.wallet.closeModal().then(() => {
      if (adapter && adapter.publicKey) {
        // mock wallet
        // const address = new PublicKey('')
        // Vue.prototype.$wallet = {
        //   connected: true,
        //   publicKey: address,
        //   signTransaction: (transaction: any) => {
        //     console.log(transaction)
        //   }
        // }
        // this.$accessor.wallet.setConnected(address.toBase58())

        Vue.prototype.$wallet = adapter
        // this.$accessor.wallet.setConnected(adapter.publicKey.toBase58())
        console.log('setConnected####', adapter)
        this.$accessor.wallet.setConnected({
          address: adapter.publicKey.toBase58(),
          platform: name,
          originPub: adapter.publicKey
        })

        this.subWallet()
        this.$notify.success({
          message: 'Wallet connected',
          description: `Connect to ${name}`,
          class: 'success',
          icon: (h: any) => h('img', { class: { 'notify-icon': true }, attrs: { src: '/icon_Copied@2x.png' } })
        })

        LocalStorage.set('WALLET_NAME', name)
      }
    })
  }

  onDisconnect() {
    this.isLoading = false
    if (!this.isDisConnect) {
      this.disconnect()
    }
  }

  disconnect() {
    this.currentWalletName = ''
    this.isDisConnect = true
    this.connectingWallet = {
      name: null,
      adapter: null
    }

    try {
      Vue.prototype.$wallet.disconnect()
    } catch (error) {}

    Vue.prototype.$wallet = null

    this.unsubWallet()

    this.$accessor.wallet.setDisconnected()
    this.$notify.warning({
      message: 'Wallet disconnected',
      description: '',
      icon: this.$createElement('img', { class: { 'notify-icon': true }, attrs: { src: '/tanhao@2x.png' } })
    })
  }

  onWalletError(error: Error) {
    const { name } = this.connectingWallet
    this.isLoading = false
    this.currentWalletName = ''

    if (name) {
      const info = this.wallets[name]

      if (info) {
        const { website, chromeUrl, firefoxUrl } = info

        if (['WalletNotFoundError', 'WalletNotInstalledError', 'WalletNotReadyError'].includes(error.name)) {
          const errorName = error.name
            .replace('Error', '')
            .split(/(?=[A-Z])/g)
            .join(' ')

          this.$notify.error({
            message: errorName,
            description: (h: any) => {
              const msg = [
                `Please install and initialize ${name} wallet extension first, `,
                h('a', { attrs: { href: website, target: '_blank' } }, 'click here to visit official website')
              ]

              if (chromeUrl || firefoxUrl) {
                const installUrl = /Firefox/.test(navigator.userAgent) ? firefoxUrl : chromeUrl
                if (installUrl) {
                  msg.push(' or ')
                  msg.push(h('a', { attrs: { href: installUrl, target: '_blank' } }, 'click here to install extension'))
                }
              }

              return h('div', msg)
            },
            class: 'error',
            icon: (h: any) => h('img', { class: { 'notify-icon': true }, attrs: { src: '/icon_Error@2x.png' } })
          })

          return
        }
      }
    }

    if (['SecurityError'].includes(error.name)) {
      this.onConnect()
      return
    }

    // throttle(() => {
    //   console.log('增加debounce后调到了几次#####')
    this.$notify.error({
      message: 'Connect wallet failed',
      description: this.walletErrorObj[error.name] || error.name,
      class: 'error',
      icon: (h: any) => h('img', { class: { 'notify-icon': true }, attrs: { src: '/icon_Error@2x.png' } })
    })
    // }, 500)
  }

  connect(name: string, wallet: WalletInfo) {
    console.log('没进来了吗connect22222#####')
    if (this.currentWalletName === name) {
      // this.isLoading = true
      return
    }
    this.currentWalletName = name
    const { providerUrl } = wallet
    const adapter = wallet.getAdapter(providerUrl)
    if (adapter) {
      // adapter.on('ready', onReady)
      // this.isDisConnect = false
      adapter.on('connect', this.onConnect)
      adapter.on('disconnect', this.onDisconnect)
      adapter.on(
        'error',
        debounce((e) => {
          this.onWalletError(e)
        }, 500)
      )
      // adapter.on('error', this.onWalletError)

      this.connectingWallet = {
        name,
        adapter
      }

      adapter.connect()

      return () => {
        // adapter.off('ready', onReady)
        adapter.off('connect', this.onConnect)
        adapter.off('disconnect', this.onDisconnect)
        adapter.off('error', this.onWalletError)
      }
    }
  }

  onWalletChange(_accountInfo: AccountInfo<Buffer>, context: Context): void {
    logger('onAccountChange')

    const { slot } = context

    if (slot !== this.wallet.lastSubBlock) {
      this.$accessor.wallet.setLastSubBlock(slot)
      this.$accessor.wallet.getTokenAccounts()
      // this.$accessor.farm.getStakeAccounts()
      // this.$accessor.ido.requestInfos()
    }
  }

  subWallet() {
    const wallet = this.$wallet
    if (wallet && wallet.publicKey) {
      this.walletListenerId = this.$web3.onAccountChange(wallet.publicKey, this.onWalletChange, commitment)

      this.fetchTransactions()
      this.$accessor.wallet.getTokenAccounts()
      // this.$accessor.farm.getStakeAccounts()
      // this.$accessor.ido.requestInfos()
    }
  }

  unsubWallet() {
    if (this.walletListenerId) {
      this.$web3.removeAccountChangeListener(this.walletListenerId)
    }
  }

  debug() {
    if (this.debugCount < 10) {
      this.debugCount += 1
    } else {
      this.$router.push({ path: '/debug/' })
      this.debugCount = 0
    }
  }

  async fetchTransactions() {
    const pendingTxs: any = []

    for (const txInfo of this.historyList) {
      const status = txInfo.status

      if (status === 'pending') {
        pendingTxs.push(txInfo)
      }
    }

    if (pendingTxs.length > 0) {
      const { value } = await this.$web3.getSignatureStatuses(
        pendingTxs.map((tx) => tx.txid),
        { searchTransactionHistory: true }
      )
      for (const index in value) {
        const result = value[index]
        const tx = pendingTxs[index]
        if (!result && getUnixTs() - 60 * 5 * 1000 > tx.time) {
          this.$accessor.transaction.setTxStatus({
            txid: tx.txid,
            status: 'droped',
            block: 0,
            walletAddress: this.$accessor.wallet.address
          })
        } else if (result && !result.err) {
          this.$accessor.transaction.setTxStatus({
            txid: tx.txid,
            status: 'success',
            block: result.slot,
            walletAddress: this.$accessor.wallet.address
          })
        } else if (result && result.err) {
          this.$accessor.transaction.setTxStatus({
            txid: tx.txid,
            status: 'fail',
            block: result.slot,
            walletAddress: this.$accessor.wallet.address
          })
        }
      }
    }
  }

  setWalletTimer() {
    this.walletTimer = window.setInterval(async () => {
      if (this.wallet.connected && !this.wallet.loading) {
        // vuex is connected but $wallet not, meaning window closed
        if (this.$wallet && this.$wallet.connected) {
          if (this.wallet.countdown < this.wallet.autoRefreshTime) {
            this.$accessor.wallet.setCountdown(this.$accessor.wallet.countdown + 1)
            if (this.wallet.countdown === this.wallet.autoRefreshTime) {
              await this.$accessor.wallet.getTokenAccounts()
            }
          }
        } else {
          this.disconnect()
        }
      }
    }, 1000)
  }

  // setPriceTimer() {
  //   this.priceTimer = window.setInterval(async () => {
  //     if (!this.price.loading) {
  //       if (this.price.countdown < this.price.autoRefreshTime) {
  //         this.$accessor.price.setCountdown(this.$accessor.price.countdown + 1)
  //         if (this.price.countdown === this.price.autoRefreshTime) {
  //           await this.$accessor.price.requestPrices()
  //         }
  //       }
  //     }
  //   }, 1000)
  // }

  setLiquidityTimer() {
    this.liquidityTimer = window.setInterval(async () => {
      if (!this.liquidity.loading) {
        if (this.liquidity.countdown < this.liquidity.autoRefreshTime) {
          this.$accessor.liquidity.setCountdown(this.$accessor.liquidity.countdown + 1)
          if (this.liquidity.countdown === this.liquidity.autoRefreshTime) {
            await this.$accessor.liquidity.requestInfos()
          }
        }
      }
    }, 1000)
  }

  // setFarmTimer() {
  //   this.farmTimer = window.setInterval(async () => {
  //     if (!this.farm.loading) {
  //       if (this.farm.countdown < this.farm.autoRefreshTime) {
  //         this.$accessor.farm.setCountdown(this.$accessor.farm.countdown + 1)
  //         if (this.farm.countdown === this.farm.autoRefreshTime) {
  //           await this.$accessor.farm.requestInfos()
  //         }
  //       }
  //     }
  //   }, 1000)
  // }

  // setIdoTimer() {
  //   this.idoTimer = window.setInterval(async () => {
  //     if (!this.ido.loading) {
  //       if (this.ido.countdown < this.ido.autoRefreshTime) {
  //         this.$accessor.ido.setCountdown(this.$accessor.ido.countdown + 1)
  //         if (this.ido.countdown === this.ido.autoRefreshTime) {
  //           await this.$accessor.ido.requestInfos()
  //         }
  //       }
  //     }
  //   }, 1000)
  // }
}
</script>

<style lang="less" scoped>
@import '../styles/variables';
@import '../styles/base';

.ant-modal-content {
  background-color: @modal-header-bg;

  .ant-modal-close {
    color: @text-color;
  }
}

.connect-btn-back {
  // background: linear-gradient(180deg, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0));
  background: rgba(255, 255, 255, 0.1);
  // padding: 1px;
  border-radius: 10px;
  height: 36px;
  cursor: pointer;
}

.connect-btn {
  height: 36px;
  cursor: pointer;
  color: @text-color-p;
  display: flex;
  align-items: center;
  justify-content: center;
  // padding: 0px 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  .wallet-icon-and-name {
    // background: rgba(255, 255, 255, 0.1);
    // border-radius: 10px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0px 12px;
    background: linear-gradient(270deg, #3e434e 0%, #282a2f 100%);
    box-shadow: 0px 4px 12px 0px rgba(26, 28, 31, 0.5);
    border-radius: 10px;
    border: 1px solid #3f434e;
    .wallet-icon {
      width: 25px;
      height: 25px;
      margin-right: 6px;
    }
    .platform {
      font-size: 12px;
    }
  }

  .address {
    white-space: nowrap;
    padding: 0px 12px;
    font-size: 12px;
  }
  .connect-text {
    margin-left: 0px;
    padding: 0px 20px;
  }
}

.wallet-title {
  font-size: 16px;
  color: #fff;
}
.wallet-sub-title {
  font-size: 14px;
  // color: rgba(255, 255, 255, 0.6);
  color: #5f667c;
}
.select-wallet {
  height: 300px;
  overflow: auto;
  .wallet-item {
    width: 100%;
    // width: 390px;
    height: 52px;
    background: none;
    // background: #292535;
    // border: 2px solid #292535;
    border-radius: 10px;
    cursor: pointer;
    border: 1px solid transparent;
    margin-top: 12px;
    display: flex;
    align-items: center;
    padding: 0px 14px;
    &:first-child {
      margin-top: 0px;
    }
    &.active,
    &:hover {
      // background: rgba(255, 255, 255, 0.1);
      // border-radius: 10px;
      background: linear-gradient(214deg, #3e434e 0%, #23262b 100%) rgba(216, 216, 216, 0.1);
      border-radius: 10px;
      border: 1px solid #565c6a;
    }

    .icon-box {
      width: 32px;
      height: 32px;
      font-size: 0px;
      border-radius: 8px;
      // background: #5f667c;
      margin-right: 16px;
    }

    img {
      width: 32px;
      height: 32px;
    }
    span {
      font-size: 14px;
      color: #fff;
    }
    // > div {
    //   width: 100%;
    //   height: 100%;
    //   border-radius: 10px;
    //   background: #000;
    //   display: flex;
    //   align-items: center;
    //   padding: 0px 20px;

    // }
  }
}
</style>

<style lang="less" scoped>
@import '../styles/base.less';

.wallet-info {
  // text-align: center;
  .platform {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.6);
    margin-top: 30px;
  }
  .address {
    font-weight: 800;
    color: #fff;
    margin-top: 20px;
    font-size: 30px;
    .icon {
      width: 14px;
      height: 14px;
      fill: white;
      &:hover {
        fill: #07ebad;
      }
    }
  }
  .copy-and-view {
    display: flex;
    align-items: center;
    justify-content: space-between;
    // padding: 0px 40px;
    padding-bottom: 60px;
    a {
      display: flex;
      align-items: center;
      font-size: 14px;
      cursor: pointer;
      color: #07ebad;
      .icon {
        width: 20px;
        height: 20px;
        fill: #07ebad;
        margin-left: 10px;
      }
      &:hover {
        color: #07ebad;
        .icon {
          fill: #07ebad;
        }
      }
    }
  }

  // .disconnect-btn {
  //   width: 168px;
  //   height: 40px;
  //   font-size: 14px;
  //   color: #07ebad;
  // }
  .btn-box {
    display: flex;
    justify-content: center;
  }
  // .disconnect-btn-box {
  //   width: 168px;
  //   height: 48px;
  //   font-size: 16px;
  //   border-radius: 10px;
  //   padding: 2px;
  //   background: linear-gradient(214deg, #59bdad 0%, #6676f5 61%, #9a89f9 76%, #eba7ff 100%);
  .disconnect-btn {
    // width: 100%;
    // height: 100%;
    // border: none;
    // background: #1b2023 !important;
    // border-radius: 10px;
    // color: #fff;
    width: 180px;
    height: 48px;
    box-shadow: 0px 4px 12px 0px #25282c;
    border-radius: 12px;
    border: 1px solid #3f434e;
    color: #fff;
    font-size: 16px;
    font-weight: 600;
    &:hover {
      background: rgba(255, 255, 255, 0.05) !important;
    }
  }
  // }
  .switch-wallet-btn-box {
    // .gradient-btn-large();
    width: 180px;
    height: 46px;
    margin-top: 0;
    margin-left: 12px;
    border-radius: 12px;
    .switch-wallet-btn {
      .gradient-btn-large();
      // width: 100%;
      height: 100%;
      // color: #fff;
      // border: none;
      font-size: 16px;
      // background: linear-gradient(268deg, #5fe6d0 0%, #597bff 38%, #9380ff 72%, #e590ff 100%);
      // border-radius: 12px;
      // line-height: 42px;
      // font-weight: 600;
      // &:hover {
      //   background: linear-gradient(268deg, #74ffe8 0%, #7592ff 39%, #a08fff 74%, #e89aff 100%);
      // }
    }
  }
}

/deep/.ant-modal {
  width: 430px !important;
}
/deep/.ant-modal-body {
  padding-top: 0px !important;
}
/deep/.ant-modal-header {
  padding-bottom: 0px;
  padding-top: 20px;
}

@media screen and (max-width: 750px) {
  .select-wallet {
    .wallet-item {
      width: 100%;
      height: 40px;
      > div {
        img {
          width: 24px;
          height: 24px;
        }
        span {
          font-size: 14px;
        }
      }
    }
  }
  /deep/.ant-modal {
    width: auto !important;
  }
}
</style>
