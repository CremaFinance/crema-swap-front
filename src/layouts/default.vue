<template>
  <div class="layout-container" :class="fairShow">
    <div class="pc-header-container">
      <Head v-if="isPc"></Head>
    </div>
    <div class="h5-header-container">
      <H5Head></H5Head>
    </div>
    <div class="body-container" :class="$accessor.showNetWorkWarnning ? 'have-network-warnning' : ''">
      <Nuxt />
      <Wallet v-if="!isPc" class="h5-wallet"></Wallet>
    </div>

    <!-- <NoticeModal v-if="showNotice" @onClose="showNotice = false"></NoticeModal> -->
    <Waiting
      v-show="$accessor.transaction.showWaiting"
      @onClose="$accessor.transaction.setShowWaiting(false)"
    ></Waiting>
    <Success
      v-if="$accessor.transaction.showSubmitted"
      @onClose="$accessor.transaction.setShowSubmitted(false)"
    ></Success>
    <div v-show="fairShow != 'layout-fair'" class="positon-container-bottom"></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import Head from './components/head.vue'
import H5Head from './components/h5-head.vue'
import { getprice } from '@/utils/stake'
// import NoticeModal from '@/components/Notice.vue'

export default Vue.extend({
  components: {
    Head,
    H5Head
    // NoticeModal
  },
  data() {
    return {
      showNotice: false,
      isPc: true,
      fairShow: ''
    }
  },
  computed: {
    ...mapState(['transaction', 'url', 'wallet', 'liquidity'])
    // walletConnectedAndHaveCoinPairConfig(): boolean {
    //   if (this.liquidity.coinPairConfigObj && this.wallet.connected) {
    //     return true
    //   }
    //   return false
    // }
  },
  watch: {
    'liquidity.coinPairConfigObj': {
      handler: 'coinPairConfigObjWatch',
      immediate: true
    },
    $route(to, from) {
      if (to.path == '/fair') {
        console.log('进去了####')
        this.fairShow = 'layout-fair'
      } else {
        this.fairShow = ''
        return false
      }
    }
  },
  created() {
    console.log(this.$route)
    this.$accessor.liquidity.getRates()
    this.$accessor.liquidity.getPairConfigApi()
  },
  mounted() {
    // const showNotice = sessionStorage.getItem('crema_show_notice')
    // if (!showNotice) {
    //   this.showNotice = true
    //   sessionStorage.setItem('crema_show_notice', '1')
    // }

    window.onresize = () => {
      const screenWidth = document.body.clientWidth
      if (screenWidth < 750) {
        this.isPc = false
      } else {
        this.isPc = true
      }
    }

    // const test = await getprice('solana')
    // console.log('test####', test)
    // // socean-staked-sol
    // // marinade-staked-sol-wormhole
  },
  destroyed() {
    window.onresize = null
  },
  methods: {
    coinPairConfigObjWatch(newVal) {
      if (newVal) {
        this.$accessor.liquidity.getPoolList()
      }
    }
  }
})
</script>

<style lang="less">
.ant-layout-content {
  min-height: calc(100vh - 64px - 82px);
}
.layout-container {
  width: 100%;
  min-height: 100vh;
  background: #22252b;
  min-width: 1128px;
  position: relative;
}
.pc-header-container {
  display: block;
  background: #22252b;
  // padding: 0px 40px;
  z-index: 999;
  position: fixed;
  left: 0px;
  top: 0px;
  width: 100%;
  box-sizing: border-box !important;
}
.layout-fair {
  position: relative;
  z-index: 5;
  background: url('@/assets/images/img-fair-bg.png');
  background-size: 100% 100%;
  .pc-header-container {
    background: none;
  }
}
.body-container {
  width: 100%;
  min-height: 100vh;
  // padding-top: 200px;
  padding-top: 100px;
  padding-bottom: 40px;
  position: relative;
  z-index: 20;
  .h5-wallet {
    display: none;
  }
  &.have-network-warnning {
    padding-top: 140px;
  }
}
@media screen and (max-width: 1366px) {
  .body-container {
    padding-top: 120px;
  }
}
.h5-header-container {
  display: none;
}

@media screen and (max-width: 980px) {
  .pc-header-container {
    position: static;
  }
  .body-container {
    padding-top: 20px;
  }
}

@media screen and (max-width: 750px) {
  .layout-container {
    min-width: 100%;
  }
  .h5-header-container {
    display: block;
  }
  .pc-header-container {
    display: none;
  }
  .body-container {
    padding: 0 20px 0;
    &.have-network-warnning {
      padding-top: 0px;
    }
    .h5-wallet {
      display: block;
      padding: 60px 0 20px 0px;
      width: 198px;
      margin: auto;
      position: relative;
      z-index: 5;
    }
  }
}
.positon-container-bottom {
  width: 100%;
  height: 160px;
  position: fixed;
  bottom: 0;
  background: linear-gradient(180deg, #063c5a 0%, #231b55 100%);
  filter: blur(32px);
  // z-index: 16;
}
</style>
