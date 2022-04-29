<template>
  <div class="positon-container">
    <div class="back-btn">
      <svg class="icon" aria-hidden="true" @click="gotoPoolList">
        <use xlink:href="#icon-icon-return"></use>
      </svg>
      <div class="refresh-box h5-refresh-box" v-if="wallet.connected">
        <RefreshIcon @refresh="refresh" :loading="liquidity.myPositionLoading"></RefreshIcon>
      </div>
    </div>

    <div class="position-title">
      <span v-if="wallet.connected"
        >Your Positions
        <span>{{ list.length > 0 ? `( ${list.length} )` : '' }}</span>
      </span>
      <span v-else
        >Your Positions
        <span>(0)</span>
      </span>
      <div class="btn-list">
        <button>
          <div @click="gotoPool">
            <span>Add Liquidity</span>
          </div>
        </button>
        <div class="refresh-box pc-refresh-box" v-if="wallet.connected">
          <!-- <div class="refresh">
            <svg class="icon" aria-hidden="true" @click="refresh">
              <use xlink:href="#icon-icon-refresh"></use>
            </svg>
          </div> -->
          <RefreshIcon @refresh="refresh" :loading="liquidity.myPositionLoading"></RefreshIcon>
        </div>
      </div>
    </div>

    <div v-if="wallet.connected && list.length > 0" class="position-list">
      <PositionBlock v-for="(item, index) in list" :key="index" :p-item="item"></PositionBlock>
    </div>
    <div v-else class="no-data">
      <img src="../assets/images/icon_NoDate@2x.png" />
      <p>No data</p>
    </div>
    <div v-show="liquidity.myPositionLoading" class="loading-global"><Spin /></div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { checkNullObj } from '@/utils'
import { Spin } from 'ant-design-vue'
import mixin from '@/mixin/position'

export default Vue.extend({
  components: {
    Spin
  },
  mixins: [mixin],
  data() {
    return {
      isShowClosedPositions: false,
      list: [],
      isLoading: true
    }
  },
  computed: {
    ...mapState(['wallet', 'liquidity']),
    walletConnectedAndHavePoolsObj(): boolean {
      if (this.liquidity.poolsObj && this.wallet.connected && !checkNullObj(this.wallet.tokenAccounts)) {
        return true
      }
      return false
    }
  },
  watch: {
    'liquidity.myPositions': {
      handler: 'watchMyPositions',
      immediate: true
    },
    'wallet.connected'(newVal) {
      if (!newVal) {
        this.list = []
      }
    },
    walletConnectedAndHavePoolsObj: {
      handler: 'walletConnectedAndHavePoolsObjWatch',
      immediate: true
    }
  },
  mounted() {},
  methods: {
    gotoPool() {
      this.$router.push('/deposit')
    },
    watchMyPositions(list: any) {
      this.list = list
    },
    walletConnectedAndHavePoolsObjWatch(newVal) {
      if (newVal) {
        this.$accessor.liquidity.getMyPositionsNew(this.wallet.tokenAccounts)
      }
    },
    gotoPoolList() {
      this.$router.push('/pools')
    },
    refresh() {
      this.$accessor.liquidity.getMyPositionsNew(this.wallet.tokenAccounts)
    }
  }
})
</script>
<style lang="less" scoped>
.positon-container {
  width: 800px;
  margin: 0 auto;
  .back-btn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .icon {
      width: 20px;
      height: 20px;
      fill: #fff;
      &:hover {
        fill: #07ebad;
      }
    }
    .h5-refresh-box {
      display: none;
    }
  }
  .position-title {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 10px;
    > span {
      font-size: 20px;
      color: #fff;
      > span {
        font-size: 14px;
        font-weight: 800;
        color: rgba(#fff, 0.5);
      }
    }
    .btn-list {
      display: flex;
      align-items: center;

      button {
        width: 130px;
        height: 36px;
        border-radius: 18px;
        padding: 2px;
        border: none;
        background: linear-gradient(90deg, rgba(183, 98, 255, 1), rgba(93, 193, 221, 1));
        > div {
          width: 100%;
          height: 100%;
          background: #1b1b26;
          // background: linear-gradient(270deg, #5fe6d0 0%, #60b2f1 33%, #9380ff 68%, #e590ff 100%);
          font-size: 14px;
          color: #fff;
          border-radius: 16px;
          font-weight: 600;
          line-height: 34px;
          &:hover {
            background: linear-gradient(233deg, #5fe6d0 0%, #596cff 38%, #9380ff 72%, #e590ff 100%);
          }
        }
      }
      .go-back {
        display: none;
      }
      .refresh-box {
        // width: 32px;
        // height: 32px;
        // border-radius: 15px;
        // padding: 1px;
        // margin-left: 12px;
        // background: linear-gradient(137deg, rgba(35, 38, 43, 1), rgba(62, 67, 78, 1));
        // .refresh {
        //   width: 30px;
        //   height: 30px;
        //   background: linear-gradient(141deg, #383e49 0%, #1a1c1f 100%);
        //   border-radius: 14px;
        //   text-align: center;
        //   .icon {
        //     width: 16px;
        //     height: 16px;
        //     fill: #fff;
        //     margin-top: 6px;
        //   }
        // }
      }
    }
  }
  .h5-btn-list {
    display: none;
  }

  .no-data {
    width: 100%;
    min-height: 260px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 30px;
    margin-top: 20px;
    img {
      width: 80px;
      height: 80px;
    }
    p {
      color: rgba(255, 255, 255, 0.8);
      padding-top: 10px;
    }
  }
}
@media screen and (max-width: 750px) {
  .positon-container {
    width: 100%;
    padding: 20px 16px 0;
    .back-btn {
      .h5-refresh-box {
        display: block;
      }
    }
    .position-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .btn-list {
        // justify-content: flex-end;
        justify-content: space-between;
        align-items: center;
        margin-top: 0px;
        .pc-refresh-box {
          display: none;
        }
        .go-back {
          display: flex;
          align-items: center;
          .icon {
            width: 20px;
            height: 20px;
            fill: #fff;
            margin-right: 4px;
            &:hover {
              fill: #07ebad;
            }
          }
          font-size: 14px;
          color: rgba(255, 255, 255, 0.5);
        }
      }
    }
    .h5-btn-list {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin-top: 12px;
      button {
        width: 130px;
        height: 36px;
        border-radius: 18px;
        padding: 2px;
        border: none;
        background: linear-gradient(90deg, rgba(183, 98, 255, 1), rgba(93, 193, 221, 1));
        > div {
          width: 100%;
          height: 100%;
          background: #000;
          // background: linear-gradient(270deg, #5fe6d0 0%, #60b2f1 33%, #9380ff 68%, #e590ff 100%);
          font-size: 14px;
          color: #fff;
          border-radius: 16px;
          font-weight: 600;
          line-height: 34px;
          &:hover {
            background: linear-gradient(233deg, #5fe6d0 0%, #596cff 38%, #9380ff 72%, #e590ff 100%);
          }
        }
      }
    }
  }
}
</style>
<style lang='less'>
// .position-list {
// .position-block:nth-child(6n + 1) {
//   .deta-block-status-box {
//     background: linear-gradient(180deg, #101118 0%, #0f1034 82%, #004f80 100%);
//   }
// }
// .position-block:nth-child(6n + 2) {
//   .deta-block-status-box {
//     background: linear-gradient(180deg, #101118 0%, #07221f 82%, #00665f 100%);
//   }
// }
// .position-block:nth-child(6n + 3) {
//   .deta-block-status-box:nth-child(6n + 3) {
//     background: linear-gradient(180deg, #101118 0%, #0f1116 82%, #00665f 100%);
//   }
// }
// .position-block:nth-child(6n + 4) {
//   .deta-block-status-box:nth-child(6n + 4) {
//     background: linear-gradient(180deg, #101118 0%, #191529 79%, #3f339f 100%);
//   }
// }
// .position-block:nth-child(6n + 5) {
//   .deta-block-status-box {
//     background: linear-gradient(180deg, #101118 0%, #201f0a 82%, #665900 100%);
//   }
// }
// .position-block:nth-child(6n + 6) {
//   .deta-block-status-box {
//     background: linear-gradient(180deg, #101118 0%, #271529 79%, #540d3f 100%);
//   }
// }
// }
</style>