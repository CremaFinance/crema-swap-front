<template>
  <div class="layout-container">
    <div class="pc-header-container">
      <Head></Head>
    </div>
    <div class="h5-header-container">
      <H5Head></H5Head>
    </div>
    <div class="body-container">
      <Nuxt />
    </div>

    <NoticeModal v-if="showNotice" @onClose="showNotice = false"></NoticeModal>
  </div>
</template>

<script lang="ts">
// import { Vue, Component } from 'nuxt-property-decorator'
import Vue from 'vue'
import { mapState } from 'vuex'

// import { Layout } from 'ant-design-vue'
import Head from './components/head.vue'
import H5Head from './components/h5-head.vue'
import NoticeModal from '@/components/Notice.vue'

// const { Content } = Layout

// @Component({
//   components: {
//     Layout,
//     Content,
//     Head,
//     H5Head
//   }
// })
// export default class Default extends Vue {}

export default Vue.extend({
  components: {
    // Layout,
    // Content,
    Head,
    H5Head,
    NoticeModal
  },
  data() {
    return {
      showNotice: false
    }
  },
  computed: {
    ...mapState(['wallet'])
  },
  watch: {
    'wallet.tokenAccounts': {
      handler: 'watchWalletTokenAccounts',
      immediate: true
    }
  },
  mounted() {
    const showNotice = localStorage.getItem('crema_show_notice')
    if (!showNotice) {
      this.showNotice = true
      localStorage.setItem('crema_show_notice', '1')
    }
  },
  methods: {
    watchWalletTokenAccounts(newTokenAccounts: any) {
      if (this.wallet.connected && newTokenAccounts && Object.keys(newTokenAccounts).length > 0) {
        this.$accessor.position.requestMyPositions(newTokenAccounts)
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
  background: #1b2023 url('../assets/images/img-bg.svg') no-repeat;
  background-position: 60% 30%;
}
.pc-header-container {
  display: block;
  padding: 0px 40px;
  z-index: 5;
  position: fixed;
  left: 0px;
  top: 0px;
  width: 100%;
  box-sizing: border-box !important;
}
.body-container {
  width: 100%;
  min-height: 100vh;
  padding-top: 200px;
  padding-bottom: 40px;
}
@media screen and (max-width: 1366px) {
  .body-container {
    padding-top: 150px;
  }
}
.h5-header-container {
  display: none;
}
@media screen and (max-width: 750px) {
  .h5-header-container {
    display: block;
  }
  .pc-header-container {
    display: none;
  }
  .body-container {
    padding-top: 0;
  }
}
</style>
