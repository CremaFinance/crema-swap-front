<template>
  <div>
    <div v-if="isFarming == 'Farming'" class="farming-Banner"></div>
    <div v-if="isFarming == 'Farming'" class="My-Caffeine">
      <div class="farming-Banner-value">
        <p>My Caffeine</p>
        <div>
          <img src="../assets/images/icon-caffeine.png" alt="" />
          <span>{{ caffeineAmount }}</span>
        </div>
      </div>
      <div class="farming-Banner-btn">
        <!-- <nuxt-link to="/active" class="farming-Btn"></nuxt-link> -->
        <a class="farming-Btn"></a>
      </div>
    </div>
    <div v-if="isFarming == 'Farm'" class="farm-Banner">
      <div class="farm-Banner-value">Stake start in</div>
      <div class="farming-Banner-time">
        <span>{{ day ? day : '--' }}</span> : <span>{{ hour ? hour : '--' }}</span> :
        <span>{{ min ? min : '--' }}</span> :
        <span>{{ sec ? sec : '--' }}</span>
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
      sec: ''
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
    }
  }
})
</script>
<style lang="less" scoped>
.farming-Banner {
  width: 340px;
  height: 110px;
  background: url('@/assets/images/farming-nav-h5.png');
  background-size: 100% 100%;
}
.My-Caffeine {
  height: 90px;
  width: 340px;
  background: url('@/assets/images/my-caffeine-h5.png');
  background-size: 100% 100%;
  border-radius: 20px;
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
  background: url('@/assets/images/img-mintnft_btn.png');
  background-size: 100% 100%;
}
.farm-Banner {
  width: 340px;
  height: 150px;
  background: url('@/assets/images/farm-banner-h5.png');
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