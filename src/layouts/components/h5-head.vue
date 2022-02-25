<template>
  <div class="h5-head-container">
    <div class="top">
      <div class="left">
        <img src="@/assets/images/logo@2x@2x.png" />
        <!-- <img class="test-or-main" src="../../assets/images/tag-Devnet.png" alt="" /> -->
      </div>
      <div class="right">
        <svg v-if="!showMenu" class="icon" aria-hidden="true" @click="toggleMenu">
          <use xlink:href="#icon-a-icon_Menu1"></use>
        </svg>

        <svg v-else class="icon" aria-hidden="true" @click="toggleMenu">
          <use xlink:href="#icon-icon_Menu"></use>
        </svg>
      </div>
    </div>
    <div v-show="showMenu" class="menu-list-box">
      <ul class="menu-list">
        <!-- <li @click="goToTrade()">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#iconicon-Trading"></use>
          </svg>
          <img src="@/assets/images/icon-Trading@2x.png" alt="" />
          <span>Trading</span>
        </li> -->
        <li :class="{ active: $route.name === 'swap' }" @click="goUrl('swap')">
          <img src="@/assets/images/icon-Swap@2x.png" alt="" />
          <span>Swap</span>
        </li>
        <li class="have-sub-menu" @click="goUrl('pool')">
          <div
            :class="{
              active:
                $route.name === 'liquidity' ||
                $route.name === 'pool' ||
                $route.name === 'index' ||
                $route.path === '/position' ||
                $route.name === 'increase-id' ||
                $route.name === 'remove-id' ||
                $route.name === 'detail-id',
              title: true
            }"
            @click="liquiditySubMenuIsShow = !liquiditySubMenuIsShow"
          >
            <!-- <svg class="icon" aria-hidden="true">
              <use xlink:href="#iconicon-Liquidity"></use>
            </svg> -->
            <img src="@/assets/images/icon-Pools@2x.png" alt="" />
            <span>Pools</span>
            <svg :class="['icon icon-down', liquiditySubMenuIsShow ? 'open' : 'close']" aria-hidden="true">
              <use xlink:href="#icondown"></use>
            </svg>
          </div>
        </li>
        <li :class="{ active: $route.name === 'stats' }" @click="goUrl('stats')">
          <img src="@/assets/images/stats.png" alt="" />
          <span>Stats</span>
        </li>
        <!-- <li :class="{ active: $route.name === 'farming' }" @click="goUrl('farming')">
          <img src="@/assets/images/icon-Farming@2x.png" alt="" />
          <span>Farming</span>
        </li> -->
        <!-- <li>
          <a class="test-guide" href="https://hello-17.gitbook.io/crema-devnet-test-guide/" target="_blank">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-icon_guide"></use>
            </svg>
            <span>Test Guide</span>
          </a>
        </li> -->

        <!-- <li :class="{ active: $route.name === 'staking' }" @click="goUrl('staking')">
          <img src="@/assets/images/icon-Staking@2x.png" alt="" />
          <span>Staking</span>
        </li> -->
      </ul>

      <!-- <a class="paper-guide" href="https://hydraswap.gitbook.io/hydra-beta-testing-guide" target="_blank">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#iconmenu"></use>
        </svg>
        <span>Test Guide</span>
      </a> -->
      <a class="paper-guide" href="https://gitbook.crema.finance/" target="_blank">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-icon-Docs"></use>
        </svg>
        <span>Docs</span>
      </a>

      <div class="contact-list">
        <a href="https://twitter.com/Crema_Finance" target="_blank">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-twitter"></use>
          </svg>
        </a>
        <a href="https://t.me/cremafinance" target="_blank">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-telegram"></use>
          </svg>
        </a>
        <!-- <a href="https://t.me/hydraswap_ANN" target="_blank">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#iconicon_TelegramChannel"></use>
          </svg>
        </a> -->
        <a href="https://medium.com/@Crema.finance" target="_blank">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-medium"></use>
          </svg>
        </a>
        <a href="https://discord.gg/cremafinance" target="_blank">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-discord"></use>
          </svg>
        </a>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'H5Header',
  data() {
    return {
      showMenu: false,
      liquiditySubMenuIsShow: false,
      farmsSubMenuIsShow: false
    }
  },
  methods: {
    toggleMenu() {
      this.showMenu = !this.showMenu
    },
    goUrl(url) {
      this.$router.push(url)
      this.showMenu = false
    },
    goToTrade() {
      // const href = `https://trade.hydradex.finance/`
      const href = `https://trade.crema.finance/`
      const a = document.createElement('a')
      a.setAttribute('href', href)
      a.setAttribute('target', '_blank')
      a.click()
      // window.location.href = 'https://dex.hydratest.xyz/'
    }
  }
}
</script>
<style lang="less" scoped>
.h5-head-container {
  width: 100%;
  position: relative;
  // background: #071020;
  .top {
    width: 100%;
    height: 60px;
    // background: #071020;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0px 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    .left {
      img {
        height: 28px;
      }
      .test-or-main {
        // width: 60px;
        height: 16px;
        margin-left: 10px;
      }
    }
    .right {
      .icon {
        width: 20px;
        height: 20px;
        fill: #fff;
        cursor: pointer;
      }
    }
  }
  .menu-list-box {
    min-height: calc(100vh - 60px);
    // min-height: 100vh;
    box-sizing: border-box;
    width: 100%;
    padding-bottom: 100px;
    position: absolute;
    left: 0px;
    top: 60px;
    background: #071020;
    z-index: 999;
    .menu-list {
      margin-bottom: 0px;
      > li {
        height: 60px;
        display: flex;
        align-items: center;
        padding: 0px 20px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        font-size: 14px;
        color: rgba(255, 255, 255, 0.5);
        &.active {
          color: #00ffd0;
        }
        .icon {
          width: 28px;
          height: 28px;
          margin-right: 8px;
          fill: rgba(255, 255, 255, 0.5);
        }
        img {
          width: 28px;
          height: 28px;
          margin-right: 8px;
        }

        &.have-sub-menu {
          height: auto;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          padding: 0px;
          .title {
            width: 100%;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            padding: 0px 20px;
            .icon-down {
              width: 14px;
              height: 14px;
              margin-left: 8px;
              fill: rgba(255, 255, 255, 0.5);
              transition: all 0.3s;
              &.open {
                transform: rotate(180deg);
              }
            }
            &.active {
              color: #00ffd0;
              svg {
                fill: #00ffd0;
              }
            }
          }
          .sub-menu-list {
            width: 100%;
            overflow: hidden;
            transition: all 0.3s;
            &.open {
              height: auto;
            }
            &.close {
              height: 0px;
            }
            li {
              width: 100%;
              box-sizing: border-box;
              padding-left: 56px;
              height: 60px;
              line-height: 60px;
              background: #0c1b34;
              border-top: 1px solid rgba(255, 255, 255, 0.1);
              &.active {
                color: #00ffd0;
              }
            }
          }
        }

        .test-guide {
          display: flex;
          align-items: center;
          cursor: pointer;
          margin-right: 20px;
          .icon {
            width: 28px;
            height: 28px;
            fill: rgba(255, 255, 255, 0.5);
          }
          span {
            color: rgba(255, 255, 255, 0.5);
            margin-left: 0px;
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

    .paper-guide {
      width: 100%;
      height: 60px;
      display: flex;
      align-items: center;
      padding: 0px 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.5);
      .icon {
        width: 20px;
        height: 20px;
        fill: #fff;
        margin-right: 8px;
      }
    }

    .contact-list {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      left: 0px;
      bottom: 0px;
      padding: 30px 0px;
      a {
        margin: 0px 10px;
        cursor: pointer;
      }
      .icon {
        width: 16px;
        height: 16px;
        fill: rgba(255, 255, 255, 0.5);
      }
    }
  }
}
</style>
