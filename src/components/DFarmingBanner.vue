<template>
  <div>
    <div v-if="isFarming == 'Farming'" class="farming-Banner">
      <div class="farming-Banner-title">
        <!-- <span>Ends on May 30th, 2022 (UTC)</span> -->
        <a
          href="https://medium.com/@Crema.finance/caffeine-farming-event-your-prelaunch-opportunity-to-grab-cremas-token-incentives-706425032a88"
          target="_blank"
          >Learn more ></a
        >
      </div>
      <div class="farming-Banner-Btn">
        <div style="height: 14px; text-align: center; line-height: 14px">My Caffeine</div>
        <div class="farming-Banner-value">
          <img src="../assets/images/icon-caffeine.png" alt="" />
          <!-- <span>100,100,100</span> -->
          <span>{{ wallet.connected ? caffeineAmount : 0 }}</span>
        </div>

        <nuxt-link to="/active" class="farming-Btn"></nuxt-link>
        <!-- <a class="farming-Btn" @click="comingsoon"></a> -->
      </div>
    </div>
    <div v-if="isFarming == 'Farm'" class="active-banner">
      <div></div>
      <!-- <div class="farm-Countdown">
        <h3>{{ timeText }}</h3>
        <div>
          <span>{{ day ? day : '--' }}</span> : <span>{{ hour ? hour : '--' }}</span> :
          <span>{{ min ? min : '--' }}</span> :
          <span>{{ sec ? sec : '--' }}</span>
        </div>
        <div style="padding: 0 4px">
          <p>Day</p>
          <p>Hour</p>
          <p>Min</p>
          <p>Sec</p>
        </div>
      </div> -->
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import importIcon from '@/utils/import-icon'
import { mapState } from 'vuex'
import { TokenAmount, gt } from '@/utils/safe-math'
import { fixD, addCommom } from '@/utils'
// import { Button } from 'ant-design-vue'
// Vue.use(Button)
export default Vue.extend({
  components: {
    // Button-
  },
  props: {
    isStaked: {
      type: String,
      default: 'All'
    },
    searchKey: {
      type: String,
      default: ''
    },
    isFarming: {
      type: String,
      default: 'All'
    }
  },
  data() {
    return {
      stakeTitle: 'Stake',
      timeNow: '2022-6-20 0:0:0',
      timeText: 'Deposit end in',
      day: '',
      hour: '',
      min: '',
      sec: '',
      timer: null,
      caffeineMintAddress: '32JXVurQacMxQF6qFxKkeAbysQcXsCakuYx3eyYRBoSR'
      // caffeineAmount: 0
    }
  },
  computed: {
    ...mapState(['wallet']),
    caffeineAmount() {
      if (this.wallet && this.wallet.tokenAccounts) {
        const account: any = this.wallet.tokenAccounts
        // console.log('account###', account)
        let caffeineAmount = new TokenAmount(0)
        if (account['CAFTP2Yof8bJuwSScigqnZaLQKiBzECgJPxvEDzfivzw']) {
          caffeineAmount = account['CAFTP2Yof8bJuwSScigqnZaLQKiBzECgJPxvEDzfivzw'].balance
          return addCommom(caffeineAmount.fixed(), 6)
        }
      }
      return 0
    }
  },
  watch: {},
  mounted() {
    // this.timer = setInterval(() => {
    //   const nowTime = Math.round(new Date().valueOf() / 1000)
    //   if (nowTime > 1655654400 && nowTime < 1655740800) {
    //     this.timeNow = '2022-06-21 00:00:00'
    //     this.timeText = 'Claim start in'
    //   } else if (nowTime > 1655740800 && nowTime < 1656259200) {
    //     this.timeNow = '2022-06-27 00:00:00'
    //     this.timeText = 'Claim end in'
    //   } else if (nowTime > 1656259200) {
    //     clearInterval(this.timer)
    //   }
    //   this.countDown(this.timeNow)
    // }, 1000)
  },
  methods: {
    importIcon,
    countDown(time) {
      let nowTime = new Date().getTime()
      let inputTime = new Date(time).getTime()
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
    comingsoon() {
      this.$notify.success({
        message: 'Coming Soon',
        description: ''
      })
    }
  }
})
</script>
<style lang="less" scoped>
.farming-Banner,
.active-banner {
  width: 1000px;
  height: 180px;
  background: url('@/assets/images/farming-nav-pc.png');
  background-size: 100% 100%;
  display: flex;
}
.active-banner {
  background: url('@/assets/images/farm-active-banners.png');
  background-size: 100% 100%;
  height: 120px;
  display: flex;
  justify-content: space-between;
  > div {
    width: 400px;
    p {
      font-size: 12px;
    }
  }
}
.farm-Countdown {
  padding: 20px 0;
  font-size: 16px;
}
.farm-Countdown > div {
  display: flex;
  width: 165px;
  height: 30px;
  line-height: 30px;
  justify-content: space-between;
  font-family: 'Avenir-Next' !important;
}
.farm-Countdown span {
  display: block;
  width: 30px;
  height: 30px;
  background: #303030;
  border-radius: 4px;
  font-size: 18px;
  text-align: center;
}
.farming-Banner-title {
  width: 630px;
  height: 100%;
  padding: 130px 0 0 47px;
  > a:last-child {
    color: #fff;
    // margin-left: 20px;
    cursor: pointer;
  }
}
.farming-Banner-Btn {
  display: flex;
  flex-wrap: wrap;
  width: 275px;
  height: 100%;
  padding: 20px;
  > div,
  .farming-Btn {
    width: 100%;
    margin: auto;
  }
}
.farming-Banner-value {
  font-size: 20px;
  display: flex;
  justify-content: center;
  > span {
    font-family: 'Avenir-Next' !important;
  }
}
img {
  width: 30px;
  height: 30px;
}
.farming-Btn {
  width: 120px !important;
  height: 40px;
  background: url('@/assets/images/img-mintnft_btn.png');
  background-size: 100% 100%;
  cursor: pointer;
  // &:hover {
  //   background: url('@/assets/images/img-mintnft-btn.png');
  //   background-size: 100% 100%;
  // }
}
</style>