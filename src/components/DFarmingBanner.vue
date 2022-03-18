<template>
  <div>
    <div v-if="isFarming == 'Farming'" class="farming-Banner">
      <div class="farming-Banner-title">
        <span>2022-03-07 18:009 (UTC) to 2022-03-23 18:00 (UTC)</span>
        <span>Learn more ></span>
      </div>
      <div class="farming-Banner-Btn">
        <div class="farming-Banner-value">
          <img src="../assets/images/icon-caffeine.png" alt="" />
          <!-- <span>100,100,100</span> -->
          <span>{{ caffeineAmount }}</span>
        </div>
        <div style="height: 14px; text-align: center; line-height: 14px">My Caffeine</div>
        <!-- <nuxt-link to="/active" class="farming-Btn"></nuxt-link> -->
        <a @click="commingsoon" class="farming-Btn"></a>
      </div>
    </div>
    <div v-if="isFarming == 'Farm'" class="farm-Banner">
      <div></div>
      <div class="farm-Countdown">
        <h3>Stake end in</h3>
        <div>
          <span>{{ day ? day : '--' }}</span> : <span>{{ hour ? hour : '--' }}</span> :
          <span>{{ min ? min : '--' }}</span> :
          <span>{{ sec ? sec : '--' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import importIcon from '@/utils/import-icon'
import { mapState } from 'vuex'
import { TokenAmount, gt } from '@/utils/safe-math'
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
      day: '',
      hour: '',
      min: '',
      sec: '',
      caffeineMintAddress: '32JXVurQacMxQF6qFxKkeAbysQcXsCakuYx3eyYRBoSR'
      // caffeineAmount: 0
    }
  },
  computed: {
    ...mapState(['wallet']),
    caffeineAmount() {
      if (this.wallet && this.wallet.tokenAccounts) {
        const account: any = this.wallet.tokenAccounts
        console.log('account###', account)
        let caffeineAmount = new TokenAmount(0)
        if (account['32JXVurQacMxQF6qFxKkeAbysQcXsCakuYx3eyYRBoSR']) {
          caffeineAmount = account['32JXVurQacMxQF6qFxKkeAbysQcXsCakuYx3eyYRBoSR'].balance
          return caffeineAmount.fixed()
        }
      }
      return 0
    }
  },
  watch: {},
  mounted() {
    window.setInterval(() => {
      this.countDown('2022-3-30 0:0:0')
    }, 1000)
  },
  methods: {
    importIcon,
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
    commingsoon() {
      this.$notify.success({
        message: 'Comming Soon',
        description: ''
      })
    }
  }
})
</script>
<style lang="less" scoped>
.farming-Banner,
.farm-Banner {
  width: 1000px;
  height: 160px;
  background: url('@/assets/images/farming-nav-pc.png');
  background-size: 100% 100%;
  display: flex;
}
.farm-Banner {
  background: url('@/assets/images/farm-banner.png');
  background-size: 100% 100%;
  height: 120px;
  display: flex;
  justify-content: space-between;
  > div {
    width: 400px;
  }
}
.farm-Countdown {
  padding: 30px 0;
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
  padding: 110px 0 0 47px;
  > span:last-child {
    margin-left: 20px;
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
  &:hover {
    background: url('@/assets/images/img-mintnft_btn-hover.png');
    background-size: 100% 100%;
  }
}
</style>