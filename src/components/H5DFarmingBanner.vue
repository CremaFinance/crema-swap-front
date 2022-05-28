<template>
  <div>
    <a
      v-if="isFarming == 'Farming'"
      class="farming-Banner"
      href="https://medium.com/@Crema.finance/caffeine-farming-event-your-prelaunch-opportunity-to-grab-cremas-token-incentives-706425032a88"
      target="_blank"
    ></a>
    <div v-if="isFarming == 'Farming'" class="My-Caffeine">
      <div class="farming-Banner-value">
        <p>My Caffeine</p>
        <div>
          <img src="../assets/images/icon-caffeine.png" alt="" />
          <span>{{ wallet.connected ? caffeineAmount : 0 }}</span>
        </div>
      </div>
      <div class="farming-Banner-btn">
        <nuxt-link to="/active" class="farming-Btn"></nuxt-link>
        <!-- <a class="farming-Btn" @click="comingsoon"></a> -->
      </div>
    </div>
    <div v-if="isFarming == 'Farm'" class="active-banner">
      <!-- <div class="active-banner-value">Stake start in {{ day }}</div> -->
      <!-- <div class="active-banner-value">{{ timeText }}</div>
      <div class="farming-Banner-time">
        <span>{{ day ? day : '--' }}</span> : <span>{{ hour ? hour : '--' }}</span> :
        <span>{{ min ? min : '--' }}</span> :
        <span>{{ sec ? sec : '--' }}</span>
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
    // Button
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
      timer: null
    }
  },
  computed: {
    ...mapState(['wallet']),
    caffeineAmount() {
      // 6.20-1655654400
      // 当前 Math.round(new Date().valueOf() / 1000)

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
.farming-Banner {
  display: block;
  width: 100%;
  height: 110px;
  background: url('@/assets/images/farming-nav-h5.png');
  background-size: 100% 100%;
}
.My-Caffeine {
  height: 90px;
  background: url('@/assets/images/my-caffeine-h5.png');
  background-size: 100% 100%;
  // border-radius: 20px;
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
  align-items: center;
}
.farming-Banner-value {
  width: 100%;
  font-size: 10px;
  span {
    font-size: 20px;
    font-family: 'Avenir-Next' !important;
  }
  > div {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }
}
img {
  width: 30px;
  height: 30px;
}
.farming-Banner-btn {
  margin: 0 auto;
  width: 200px;
  height: 35px;
}
.farming-Btn {
  margin: 0 auto;
  display: block;
  width: 110px;
  height: 35px;
  background: url('@/assets/images/img-mintnft_btn-h5.png');
  background-size: 100% 100%;
}
.active-banner {
  width: 100%;
  // height: 150px;
  height: 120px;
  background: url('@/assets/images/farm-active-banners-h5.png');
  background-size: 100% 100%;
  padding: 70px 14px 0;
}
.farming-Banner-time {
  width: 144px;
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.farming-Banner-time span {
  display: block;
  width: 30px;
  height: 30px;
  background: #303030;
  border-radius: 4px;
  font-size: 18px;
  text-align: center;
}
</style>