<template>
  <div class="positon-container">
    <div class="position-title">
      <span v-if="wallet.connected">Your Positions {{ list.length > 0 ? `( ${list.length} )` : '' }}</span>
      <span v-else>Your Positions（0）</span>
      <div class="btn-list">
        <div class="go-back" @click="gotoPoolList">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-icon-return"></use>
          </svg>
        </div>
        <button>
          <div @click="gotoPool">
            <span>Add Liquidity</span>
          </div>
        </button>
      </div>
    </div>
    <div v-if="wallet.connected && list.length > 0" class="position-list">
      <PositionBlock v-for="(item, index) in list" :key="index" :p-item="item"></PositionBlock>
    </div>
    <div v-else class="no-data">
      <img src="../assets/images/icon_NoDate@2x.png" />
      <p>No data</p>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { checkNullObj } from '@/utils'
import mixin from '@/mixin/position'

export default Vue.extend({
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
      this.$router.push('/deposit')
    }
  }
})
</script>
<style lang="less" scoped>
.positon-container {
  width: 800px;
  margin: 0 auto;
  .position-title {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    > span {
      font-size: 20px;
      color: #fff;
    }
    .btn-list {
      display: flex;
      align-items: center;

      button {
        background: none;
        > div {
          width: 118px;
          height: 22px;
          background: linear-gradient(270deg, #5fe6d0 0%, #60b2f1 33%, #9380ff 68%, #e590ff 100%);
          border-radius: 7px;
          font-size: 14px;
          color: #fff;
          font-weight: 600;
          &:hover {
            background: linear-gradient(214deg, #59bdad 0%, #6676f5 61%, #9a89f9 76%, #eba7ff 100%);
          }
        }
      }
      .go-back {
        display: none;
      }
    }
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
    .position-title {
      display: block;
      .btn-list {
        // justify-content: flex-end;
        justify-content: space-between;
        margin-top: 20px;
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
  }
}
</style>
