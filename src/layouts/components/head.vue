<template>
  <div class="header-container">
    <div class="left">
      <a class="logo" href="https://www.crema.finance/" target="_blank">
        <img src="../../assets/images/logo@2x@2x.png" />
        <img class="test-or-main" src="../../assets/images/tag-Devnet.png" alt="" />
      </a>
      <nav>
        <a href="https://trade.crema.finance/" target="_blank">
          <img src="../../assets/images/icon-Trading@2x.png" />
          <span>Trading</span>
        </a>
        <nuxt-link to="/swap">
          <img src="../../assets/images/icon-Swap@2x.png" />
          <span>Swap</span>
        </nuxt-link>
        <nuxt-link
          to="/pool"
          :class="$route.path === '/' || $route.path === '/pool' ? 'nuxt-link-exact-active nuxt-link-active' : ''"
        >
          <img src="../../assets/images/icon-Pools@2x.png" />
          <span>Pools</span>
        </nuxt-link>
        <nuxt-link to="/farming">
          <img src="../../assets/images/icon-Farming@2x.png" />
          <span>Farming</span>
        </nuxt-link>
        <!-- <nuxt-link to="/staking">
          <img src="../../assets/images/icon-Staking@2x.png" />
          <span>Staking</span>
        </nuxt-link> -->
      </nav>
    </div>
    <div class="right">
      <a class="test-guide" href="https://hello-17.gitbook.io/crema-devnet-test-guide/" target="_blank">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-icon_guide"></use>
        </svg>
        <span>Test Guide</span>
      </a>
      <Wallet />
      <Contactus></Contactus>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import Contactus from './contactus.vue'
export default Vue.extend({
  components: {
    Contactus
  },
  mounted() {
    console.log(this.$route.path, 'this.$route.path##')
    const slippage = localStorage.getItem('crema-slippage') || '1'
    this.$accessor.setSlippage(slippage)
  }
})
console.log()
</script>
<style lang="less" scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100px;
  // margin: 0px 40px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: #1b2023;
  > .left {
    display: flex;
    align-items: center;
  }
  .logo {
    padding-right: 20px;
    img {
      height: 28px;
    }
    .test-or-main {
      // width: 60px;
      height: 16px;
      margin-left: 10px;
    }
  }
  nav {
    display: flex;
    align-items: center;
    .nuxt-link-active {
      span {
        color: #fff !important;
      }
    }
    a {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 120px;
      height: 36px;
      position: relative;
      z-index: 1;
      background: #1b2023;
      border-radius: 8px;
      margin-left: 10px;
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
        width: 122px;
        height: 38px;
        background: linear-gradient(214deg, #59bdad 0%, #6676f5 61%, #9a89f9 76%, #eba7ff 100%);
        position: absolute;
        z-index: -2;
        border-radius: 8px;
      }
      &::before {
        width: 100%;
        height: 100%;
        background: #1b2023;
        z-index: -1;
      }
    }
  }

  > .right {
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
</style>
