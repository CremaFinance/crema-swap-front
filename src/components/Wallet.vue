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
            class="wallet-icon"
            :src="importIcon(`/wallets/${wallet.platform.replace(' ', '-').toLowerCase()}.png`)"
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

    <Modal :visible="wallet.modalShow" :footer="null" centered @cancel="$accessor.wallet.closeModal">
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
      <ul v-if="!wallet.connected" class="select-wallet">
        <li v-for="(providerUrl, name) in wallets" :key="name" class="wallet-item" ghost @click="connect(name)">
          <!-- <div> -->
          <img :src="importIcon(`/wallets/${name.replace(' ', '-').toLowerCase()}.png`)" />
          <span>{{ name }}</span>
          <!-- </div> -->
        </li>
      </ul>
      <div v-else class="wallet-info">
        <div class="platform">Connected with {{ wallet.platform }}</div>
        <p class="address">
          {{ wallet.address && wallet.address.substr(0, 7) }}
          ...
          {{ wallet.address && wallet.address.substr(wallet.address.length - 4, 4) }}
        </p>
        <div class="copy-and-view">
          <a class="copy" @click="$accessor.copy(wallet.address)">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#iconicon_copy"></use>
            </svg>
            <span>Copy Address</span>
          </a>
          <a class="view" target="_blank" :href="`https://explorer.solana.com//address/${wallet.address}`">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#iconicon_The_top_right"></use>
            </svg>
            <span>View on explorer</span>
          </a>
        </div>
        <div class="btn-box">
          <div class="disconnect-btn-box">
            <Button class="disconnect-btn" ghost @click="disconnect"> DISCONNECT </Button>
          </div>
          <Button class="switch-wallet-btn" ghost @click="disconnect"> Switch Wallet </Button>
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
import {
  WalletAdapter,
  SolongWalletAdapter,
  MathWalletAdapter,
  PhantomWalletAdapter,
  BloctoWalletAdapter,
  LedgerWalletAdapter
} from '@/wallets'

// fix: Failed to resolve directive: ant-portal
Vue.use(Modal)

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
  wallets = {
    Phantom: '',
    Sollet: 'https://www.sollet.io',
    'Sollet Extension': '',
    Ledger: '',
    Solong: '',
    // TrustWallet: '',
    MathWallet: '',
    Blocto: '',
    // Solflare: 'https://solflare.com/access-wallet',
    Bonfida: 'https://bonfida.com/wallet'
    // https://docs.coin98.app/coin98-extension/developer-guide
    // Coin98: ''
    // ezDeFi: '',
  } as Wallets

  // auto refresh
  walletTimer: number | undefined = undefined
  priceTimer: number | undefined = undefined
  liquidityTimer: number | undefined = undefined
  farmTimer: number | undefined = undefined
  idoTimer: number | undefined = undefined
  // web3 listener
  walletListenerId = null as number | null

  /* ========== COMPUTED ========== */
  get wallet() {
    return this.$accessor.wallet
  }

  get price() {
    return this.$accessor.price
  }

  get liquidity() {
    return this.$accessor.liquidity
  }

  get farm() {
    return this.$accessor.farm
  }

  // get ido() {
  //   return this.$accessor.ido
  // }

  /* ========== LIFECYCLE ========== */
  async beforeMount() {
    await this.$accessor.price.requestPrices()
    // await this.$accessor.swap.getMarkets()
    await this.$accessor.liquidity.requestInfos()
    // await this.$accessor.farm.requestInfos()
    // this.setWalletTimer()
    // this.setPriceTimer()
    // this.setLiquidityTimer()
    // this.setFarmTimer()
    // this.setIdoTimer()
  }

  beforeDestroy() {
    window.clearInterval(this.walletTimer)
    window.clearInterval(this.priceTimer)
    window.clearInterval(this.liquidityTimer)
    window.clearInterval(this.farmTimer)
    window.clearInterval(this.idoTimer)
  }

  /* ========== WATCH ========== */

  /* ========== METHODS ========== */
  importIcon = importIcon

  connect(walletName: string) {
    let wallet: WalletAdapter
    const { rpcs } = web3Config
    const endpoint = rpcs[0]

    switch (walletName) {
      case 'Ledger': {
        wallet = new LedgerWalletAdapter()
        break
      }
      case 'Sollet Extension': {
        if ((window as any).sollet === undefined) {
          this.$notify.error({
            message: 'Connect wallet failed',
            description: 'Please install and initialize Sollet wallet extension first',
            class: 'error',
            icon: this.$createElement('img', { class: { 'notify-icon': true }, attrs: { src: '/icon_Error@2x.png' } })
          })
          return
        }

        wallet = new SolanaWalletAdapter((window as any).sollet, endpoint)
        break
      }
      case 'Solong': {
        if ((window as any).solong === undefined) {
          this.$notify.error({
            message: 'Connect wallet failed',
            description: 'Please install and initialize Solong wallet extension first',
            class: 'error',
            icon: this.$createElement('img', { class: { 'notify-icon': true }, attrs: { src: '/icon_Error@2x.png' } })
          })
          return
        }

        wallet = new SolongWalletAdapter()
        break
      }
      case 'MathWallet': {
        if ((window as any).solana === undefined || !(window as any).solana.isMathWallet) {
          this.$notify.error({
            message: 'Connect wallet failed',
            description: 'Please install and initialize Math wallet extension first',
            class: 'error',
            icon: this.$createElement('img', { class: { 'notify-icon': true }, attrs: { src: '/icon_Error@2x.png' } })
          })
          return
        }

        wallet = new MathWalletAdapter()
        break
      }
      case 'Phantom': {
        if ((window as any).solana === undefined || !(window as any).solana.isPhantom) {
          this.$notify.error({
            message: 'Connect wallet failed',
            description: 'Please install and initialize Phantom wallet extension first',
            class: 'error',
            icon: this.$createElement('img', { class: { 'notify-icon': true }, attrs: { src: '/icon_Error@2x.png' } })
          })
          return
        }

        wallet = new PhantomWalletAdapter()
        break
      }
      case 'Blocto': {
        if ((window as any).solana === undefined || !(window as any).solana.isBlocto) {
          this.$notify.error({
            message: 'Connect wallet failed',
            description: 'Please install and open Blocto app first',
            class: 'error',
            icon: this.$createElement('img', { class: { 'notify-icon': true }, attrs: { src: '/icon_Error@2x.png' } })
          })
          return
        }

        wallet = new BloctoWalletAdapter()
        break
      }
      default: {
        wallet = new SolanaWalletAdapter(this.wallets[walletName], endpoint)
        break
      }
    }

    wallet.on('connect', () => {
      this.$accessor.wallet.closeModal().then(() => {
        if (wallet.publicKey) {
          Vue.prototype.$wallet = wallet
          this.$accessor.wallet.setConnected({ address: wallet.publicKey.toBase58(), platform: walletName })

          this.subWallet()
          this.$notify.success({
            message: 'Wallet connected',
            description: '',
            class: 'success',
            icon: this.$createElement('img', { class: { 'notify-icon': true }, attrs: { src: '/icon_Copied@2x.png' } })
          })
        }
      })
    })

    wallet.on('disconnect', () => {
      this.disconnect()
    })

    try {
      wallet.connect()
    } catch (error) {
      this.$notify.error({
        message: 'Connect wallet failed',
        description: error && error.message,
        class: 'error',
        icon: this.$createElement('img', { class: { 'notify-icon': true }, attrs: { src: '/icon_Error@2x.png' } })
      })
    }
  }

  disconnect() {
    Vue.prototype.$wallet.disconnect()
    Vue.prototype.$wallet = null

    this.unsubWallet()

    this.$accessor.wallet.setDisconnected()
    this.$notify.warning({
      message: 'Wallet disconnected',
      description: '',
      icon: this.$createElement('img', { class: { 'notify-icon': true }, attrs: { src: '/tanhao@2x.png' } })
    })
  }

  onWalletChange(_accountInfo: AccountInfo<Buffer>, context: Context): void {
    logger('onAccountChange')

    const { slot } = context

    if (slot !== this.wallet.lastSubBlock) {
      this.$accessor.wallet.setLastSubBlock(slot)
      this.$accessor.wallet.getTokenAccounts()
      this.$accessor.farm.getStakeAccounts()
      // this.$accessor.ido.getIdoAccounts()
    }
  }

  subWallet() {
    const wallet = this.$wallet
    if (wallet && wallet.publicKey) {
      this.walletListenerId = this.$web3.onAccountChange(wallet.publicKey, this.onWalletChange, commitment)

      this.$accessor.wallet.getTokenAccounts()
      this.$accessor.farm.getStakeAccounts()
      // this.$accessor.ido.getIdoAccounts()
    }
  }

  unsubWallet() {
    if (this.walletListenerId) {
      this.$web3.removeAccountChangeListener(this.walletListenerId)
    }
  }

  setWalletTimer() {
    this.walletTimer = window.setInterval(async () => {
      if (this.wallet.connected && !this.wallet.loading) {
        // vuex is connected but $wallet not, meaning window closed11
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
    }, 5000)
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
    }, 5000)
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
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  .wallet-icon-and-name {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0px 12px;
    .wallet-icon {
      width: 25px;
      height: 25px;
      margin-right: 6px;
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
  color: rgba(255, 255, 255, 0.6);
}
.select-wallet {
  .wallet-item {
    width: 390px;
    height: 52px;
    // background: #292535;
    // border: 2px solid #292535;
    border-radius: 10px;
    cursor: pointer;
    margin-top: 12px;
    display: flex;
    align-items: center;
    padding: 0px 14px;
    &:first-child {
      margin-top: 0px;
    }
    &.active,
    &:hover {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 10px;
    }

    img {
      width: 32px;
      height: 32px;
      margin-right: 16px;
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
.wallet-info {
  text-align: center;
  .platform {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.6);
  }
  .address {
    font-size: 16px;
    margin-top: 16px;
  }
  .copy-and-view {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0px 40px;
    padding-bottom: 40px;
    a {
      display: flex;
      align-items: center;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.6);
      cursor: pointer;
      .icon {
        width: 12px;
        height: 12px;
        fill: #fff;
        margin-right: 14px;
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
  .disconnect-btn-box {
    width: 168px;
    height: 48px;
    font-size: 16px;
    border-radius: 10px;
    padding: 2px;
    background: linear-gradient(214deg, #59bdad 0%, #6676f5 61%, #9a89f9 76%, #eba7ff 100%);
    .disconnect-btn {
      width: 100%;
      height: 100%;
      border: none;
      background: #1b2023 !important;
      border-radius: 10px;
      color: #fff;
    }
  }
  .switch-wallet-btn {
    width: 168px;
    height: 48px;
    background: linear-gradient(214deg, #59bdad 0%, #6676f5 61%, #9a89f9 76%, #eba7ff 100%) !important;
    font-size: 16px;
    margin-left: 12px;
    border-radius: 10px;
    color: #fff;
    border: none;
  }
}

/deep/.ant-modal {
  width: 430px !important;
}
/deep/.ant-modal-body {
  padding-top: 0px !important;
}
/deep/.ant-modal-header {
  padding-bottom: 10px;
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
