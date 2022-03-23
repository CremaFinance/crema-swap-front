<template>
  <div class="layout-container">
    <div class="pc-header-container">
      <Head v-if="isPc"></Head>
    </div>
    <div class="h5-header-container">
      <H5Head></H5Head>
    </div>
    <div class="body-container">
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
      isPc: true
    }
  },
  computed: {
    ...mapState(['transaction', 'url'])
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
}
.pc-header-container {
  display: block;
  background: #22252b;
  padding: 0px 40px;
  z-index: 999;
  position: fixed;
  left: 0px;
  top: 0px;
  width: 100%;
  box-sizing: border-box !important;
}
.body-container {
  width: 100%;
  min-height: 100vh;
  // padding-top: 200px;
  padding-top: 100px;
  padding-bottom: 40px;
  .h5-wallet {
    display: none;
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
    .h5-wallet {
      display: block;
      padding: 60px 0 20px 0px;
      width: 198px;
      margin: auto;
    }
  }
}
</style>
