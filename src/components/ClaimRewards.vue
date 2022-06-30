<template>
  <Modal
    :title="type === 'claim' ? 'Claim Rewards' : 'Open'"
    :width="400"
    centered
    :visible="true"
    :footer="null"
    @cancel="$emit('onClose')"
  >
    <div class="mint-NFT-popup">
      <div class="mint-NFT-key">
        <img v-if="showLock && type === 'open'" src="../assets/images/img-Treasure-case-close.png" />
        <img v-if="type === 'claim'" src="../assets/images/img-Open-the-treasure-chest.png" />
        <img v-if="showUnset && type === 'open'" src="../assets/images/img-Treasure-case-closed.png" />
      </div>
      <div v-if="showOpen" class="mint-NFT-num">
        <img src="../assets/images/CRM.png" alt="" />
        <span>x {{ currentKeyItem.maxpreReward }}</span>
      </div>
      <div v-if="showLock" class="count-down">
        <span>{{ day ? day : '--' }}</span> : <span>{{ hour ? hour : '--' }}</span> :
        <span>{{ min ? min : '--' }}</span> :
        <span>{{ sec ? sec : '--' }}</span>
      </div>
      <div v-if="showLock" class="count-date">
        <span>Day</span>
        <span>Hours</span>
        <span>Min</span>
        <span>Sec</span>
      </div>
      <div v-if="!showOpen && type === 'open'" class="mint-NFT-Total">
        <div class="Total-left">
          <img :src="importIcon(`/images/${currentKeyItem.img}@2x.png`)" alt="" />
        </div>
        <!-- <span>Open mystery box to get up to {{ currentKeyItem.rewardX }} bonus</span> -->
        <span>Open treasure box to see your lucky rewards</span>
      </div>
      <div v-if="type === 'claim' && currentKeyItem.newClaimAmounts" class="reward-coin-list-box">
        <ul class="reward-coin-list">
          <!-- <ul v-if="type !== 'claim' && currentKeyItem.newClaimAmounts" class="reward-coin-list"> -->
          <li v-for="(item, key) in currentKeyItem.newClaimAmounts" :key="key">
            <img :src="importIcon(`/coins/${item.name}.png`)" />
            <span>x {{ item.amount }}</span>
            <span>{{ item.name.toUpperCase() }}</span>
          </li>
        </ul>
      </div>

      <div v-if="type === 'open'" class="mint-NFT-btn-box">
        <Button v-if="showLock" disabled>Open Treasure Box</Button>
        <Button v-if="showUnset" class="mint-NFT-btn" :class="showLock ? 'btn-close' : ''" @click="$emit('toOpen')">
          Open Treasure Box
        </Button>
        <!-- <Button v-if="showOpen" class="mint-NFT-btn" :loading="isClaiming" @click="$emit('toClaim')">Claim</Button> -->
      </div>
    </div>
  </Modal>
</template>
<script lang="ts">
import Vue from 'vue'
import { Modal } from 'ant-design-vue'
import importIcon from '@/utils/import-icon'
Vue.use(Modal)
export default Vue.extend({
  components: {
    Modal
  },
  props: {
    existingCoins: {
      type: String,
      default: ''
    },
    lastSelectCoin: {
      type: String,
      default: ''
    },
    isClaiming: {
      type: Boolean,
      default: false
    },
    currentKeyItem: {
      type: Object,
      default: () => {
        return {}
      }
    },
    openRewardTimestamp: {
      type: Number,
      default: 0
    },
    type: {
      type: String,
      default: 'open'
    }
  },
  data() {
    return {
      showLock: false,
      showOpen: false,
      showUnset: false,
      day: '',
      hour: '',
      min: '',
      sec: '',
      timer: null
    }
  },
  computed: {},
  watch: {
    openRewardTimestamp: {
      handler: 'openRewardTimestampWatch',
      immediate: true
    },
    currentKeyItem: {
      handler: 'currentKeyItemWatch',
      immediate: true
    }
  },
  mounted() {},
  destroyed() {
    clearInterval(this.timer)
    this.timer = null
  },
  methods: {
    importIcon,
    currentKeyItemWatch(newValue) {
      console.log('ClaimRewards###currentKeyItemWatch###newValue###', newValue)
    },
    openRewardTimestampWatch(newVal) {
      const now = parseInt(String(new Date().getTime() / 1000))
      if (newVal && newVal > now) {
        this.showLock = true
        this.timer = window.setInterval(() => {
          this.countDown(parseInt(String(newVal * 1000)))
        }, 1000)
      } else if (newVal <= now) {
        this.showUnset = true
      }
    },
    countDown(time) {
      let nowTime = +new Date()
      let inputTime = +new Date(time)
      let times: string | number = (inputTime - nowTime) / 1000
      let d: string | number = parseInt(String(times / 60 / 60 / 24))
      d = d < 10 ? '0' + d : d
      let h: string | number = parseInt(String((times / 60 / 60) % 24))
      h = h < 10 ? '0' + h : h
      let m: string | number = parseInt(String((times / 60) % 60))
      m = m < 10 ? '0' + m : m
      let s: string | number = parseInt(String(times % 60))
      s = s < 10 ? '0' + s : s
      // return d + '天' + h + '时' + m + '分' + s + '秒';
      this.day = d
      this.hour = h
      this.min = m
      this.sec = s
    },
    toOpen() {
      this.showUnset = false
      this.showOpen = true
    }
  }
})
</script>
<style lang="less" scoped>
@import '../styles/base.less';
.mint-NFT-popup {
  padding-bottom: 40px;
  .mint-NFT-key {
    width: 100%;
    height: 270px;
    display: flex;
    justify-content: center;
    position: relative;
    > img {
      width: 270px;
      // height: 270px;
    }
  }
  .mint-NFT-num {
    display: flex;
    align-content: center;
    justify-content: center;
    font-size: 24px;
    font-family: 'Arial-BoldMT', Arial;
    font-weight: bold;
    background: linear-gradient(233deg, #4bb5ff 0%, #ce90ff 50%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    > img {
      width: 36px;
      margin-right: 10px;
    }
  }
  .mint-NFT-Total {
    background: rgba(#000, 0.2);
    border-radius: 10px;
    padding: 20px;
    display: flex;
    // justify-content: space-between;
    align-items: center;
    span {
      padding-left: 14px;
      flex: 1;
    }
  }
  .count-down {
    width: 220px;
    // margin-top: 16px;
    margin: 0 auto;
    font-size: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .count-down span {
    display: block;
    width: 40px;
    height: 50px;
    line-height: 50px;
    background: rgba(#707070, 0.2);
    border-radius: 4px;
    font-size: 24px;
    text-align: center;
  }
  .count-date {
    display: flex;
    justify-content: space-between;
    width: 200px;
    margin: 10px auto 30px;
    font-size: 12px;
    color: rgba(#fff, 0.2);
  }
  .mint-NFT-Total .Total-left {
    width: 50px;
    height: 50px;
    background: url('@/assets/images/img-bgD.png');
    background-size: 100% 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 36px;
      height: 36px;
    }
  }
  .mint-NFT-btn-box {
    height: 48px;
    .mint-NFT-btn {
      .gradient-btn-large();
      margin-top: 40px;
      height: 100%;
      font-size: 16px;
    }
    .btn-close {
      background: #282c33 !important;
      &:hover {
        background: #34383e !important;
      }
    }
  }

  .reward-coin-list-box {
    display: flex;
    justify-content: center;
  }
  .reward-coin-list {
    // width: 280px;
    // background: rgba(0, 0, 0, 0.1);
    // padding: 10px 20px;
    // margin-top: 10px;
    // border-radius: 8px;
    // display: flex;
    // flex-wrap: wrap;
    display: inline-block;
    margin-top: 0 auto;
    // padding: 0px 40px;
    // justify-content: space-between;
    li {
      display: flex;
      align-items: center;
      // width: 50%;
      margin-top: 16px;
      // &:first-child {
      //   margin-top: 0px;
      // }
      // &:nth-of-type(2n) {
      //   justify-content: flex-end;
      // }
      img {
        width: 36px;
        height: 36px;
      }
      span {
        display: block;
        // flex: 1;
        // width: 80px;
        margin-left: 8px;
        height: 18px;
        font-size: 18px;
        font-family: Arial-BoldMT, Arial;
        font-weight: normal;
        color: #fff;
        line-height: 18px;
        background: linear-gradient(233deg, #4bb5ff 0%, #ce90ff 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
  }
}
</style>
