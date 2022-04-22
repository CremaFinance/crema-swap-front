<template>
  <div class="header-container">
    <NetworkWarnning v-if="$accessor.showNetWorkWarnning" @close="closeNetworkWarning"></NetworkWarnning>
    <div class="header-content-container">
      <div class="header-content" style="background: none">
        <a class="logo" href="https://www.crema.finance/" target="_blank">
          <img src="../../assets/images/logo@2x@2x.png" />
          <!-- <img class="test-or-main" src="../../assets/images/tag-Devnet.png" alt="" /> -->
        </a>
        <!-- <div v-if="fairShow == 'header-fair'" class="fair-gi"> -->
        <!-- <div class="fair-gi">
          <img src="@/assets/images/Fire-lans.gif" alt="" />
          <span><nuxt-link to="/fair">Fair Launch</nuxt-link></span>
        </div> -->
        <div class="left">
          <nav>
            <!-- <a href="https://trade.crema.finance/" class="to-trading" target="_blank">
          <img src="../../assets/images/icon-Trading@2x.png" />
          <span>Trading</span>
        </a> -->
            <nuxt-link
              to="/swap"
              :class="$route.path === '/swap' || $route.path === '/' ? 'nuxt-link-exact-active nuxt-link-active' : ''"
            >
              <img src="../../assets/images/icon-Swap@2x.png" />
              <span>Swap</span>
            </nuxt-link>
            <nuxt-link
              to="/pools"
              :class="
                $route.path === '/position' ||
                $route.name === 'increase-id' ||
                $route.name === 'remove-id' ||
                $route.name === 'detail-id'
                  ? 'nuxt-link-exact-active nuxt-link-active'
                  : ''
              "
            >
              <img src="../../assets/images/icon-Pools@2x.png" />
              <span>Pools</span>
            </nuxt-link>
            <nuxt-link to="/farming">
              <img src="../../assets/images/icon-Farming@2x.png" />
              <span>Farming</span>
            </nuxt-link>
            <!-- <nuxt-link to="/fair">
              <img src="../../assets/images/icon-Farming@2x.png" />
              <span>Fair</span>
            </nuxt-link> -->
            <!-- <nuxt-link to="/staking">
          <img src="../../assets/images/icon-Staking@2x.png" />
          <span>Staking</span>
        </nuxt-link> -->
            <nuxt-link to="/stats">
              <img src="../../assets/images/stats.png" />
              <span>Stats</span>
            </nuxt-link>
            <!-- <a href="https://gitbook.crema.finance/" target="_blank">
          <img class="docs-img" src="../../assets/images/icon-Docs.png" />
          <span>Docs</span>
        </a> -->
          </nav>
        </div>
        <div class="right">
          <!-- <a class="test-guide" href="https://hello-17.gitbook.io/crema-devnet-test-guide/" target="_blank">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-icon_guide"></use>
        </svg>
        <span>Test Guide</span>
      </a> -->
          <!-- <a class="test-guide" href="https://gitbook.crema.finance/" target="_blank">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-icon-Docs"></use>
        </svg>
        <span>Docs</span>
      </a> -->
          <Wallet />
          <!-- <SystemSetting></SystemSetting> -->
          <Contactus></Contactus>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import Contactus from './contactus.vue'
import { checkNullObj } from '@/utils'

export default Vue.extend({
  components: {
    Contactus
  },
  data() {
    return {
      fairShow: ''
    }
  },
  computed: {
    ...mapState(['wallet', 'position', 'liquidity']),
    liquidityInfosAndWalletTokenAccount() {
      return {
        infos: this.liquidity.infos,
        tokenAccounts: this.wallet.tokenAccounts
      }
    }
  },
  watch: {
    liquidityInfosAndWalletTokenAccount: {
      handler(_newObj: any, _oldObj: any) {
        const { infos, tokenAccounts } = _newObj

        console.log('liquidityInfosAndWalletTokenAccount###this.$route####', this.$route)
        // if (!checkNullObj(infos) && !checkNullObj(tokenAccounts)) {
        //   if (this.$route.name !== 'farming') this.$accessor.liquidity.getMyPositions(tokenAccounts)
        // }
      },
      deep: true
    },
    $route(to, from) {
      if (to.path == '/fair') {
        this.fairShow = 'header-fair'
      } else {
        this.fairShow = ''
      }
    }
  },
  mounted() {
    const slippage = localStorage.getItem('crema-slippage') || '1'
    this.$accessor.setSlippage(slippage)
  },
  methods: {
    closeNetworkWarning() {
      this.$accessor.setNetWorkWarnning(false)
    }
  }
})
</script>
<style lang="less" scoped>
.header-container {
  width: 100%;
}
.header-content-container {
  padding: 0px 40px;
}
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
  width: 100%;
  // margin: 0px 40px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: #22252b;
  position: relative;
  // padding: 0px 40px;
  > .left {
    flex: 1;
    display: flex;
    align-items: center;
  }
  .logo {
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translate(0%, -50%);
    // padding-right: 20px;
    img {
      height: 28px;
    }
    .test-or-main {
      // width: 60px;
      height: 16px;
      margin-left: 10px;
    }
  }
  .fair-gi {
    position: absolute;
    left: 160px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    img {
      width: 36px;
    }
    span {
      font-size: 16px;
      margin-top: 2px;
      font-weight: bold;
      background: linear-gradient(48deg, #d032ff 0%, #8ab6ff 40%, #4ce1ff 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      // font-family: 'DIN-Regular';
      cursor: pointer;
      &:hover {
        background: linear-gradient(48deg, #df86fa 0%, #b8d3ff 40%, #83e9fd 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
  }
  nav {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    .nuxt-link-active {
      span {
        color: #fff !important;
      }
    }
    a {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 94px;
      height: 36px;
      position: relative;
      z-index: 1;
      // background: #1b2023;
      border-radius: 8px;
      margin: 0px 8px;
      span {
        color: rgba(255, 255, 255, 0.5);
        margin-left: 10px;
        font-size: 14px;
        font-weight: normal;
      }
      img {
        width: 20px;
        height: 20px;
      }
      &:hover,
      &.active,
      &.nuxt-link-exact-active {
        &::after,
        &::before {
          display: block;
        }
      }
      &::after,
      &::before {
        content: '';
        display: none;
        // width: 122px;
        // height: 38px;
        // background: linear-gradient(214deg, #59bdad 0%, #6676f5 61%, #9a89f9 76%, #eba7ff 100%);
        background: linear-gradient(270deg, #3e434e 0%, #282a2f 100%);
        box-shadow: 0px 4px 12px 0px rgba(26, 28, 31, 0.5);
        border-radius: 10px;
        border: 1px solid #3f434e;
        position: absolute;
        z-index: -2;
        // border-radius: 8px;
      }
      &::before {
        width: 100%;
        height: 100%;
        background: #1b2023;
        z-index: -1;
      }
    }
    .to-trading {
      &:hover,
      &.active,
      &.nuxt-link-exact-active {
        &::after,
        &::before {
          display: none;
        }
      }
    }
    .docs-img {
      width: 18px !important;
      height: 18px !important;
    }
  }
  .docs-img {
    width: 18px !important;
    height: 18px !important;
  }

  > .right {
    position: absolute;
    right: 0px;
    top: 50%;
    transform: translate(0%, -50%);
    display: flex;
    align-items: center;
    .test-guide {
      display: flex;
      align-items: center;
      cursor: pointer;
      margin-right: 20px;
      .icon {
        width: 20px;
        height: 20px;
        fill: rgba(255, 255, 255, 0.5);
      }
      span {
        color: rgba(255, 255, 255, 0.5);
        margin-left: 4px;
      }
      &:hover {
        .icon {
          fill: #fff;
        }
        span {
          color: #fff;
        }
      }
    }
  }
}
.header-fair {
  background: none;
}
</style>
