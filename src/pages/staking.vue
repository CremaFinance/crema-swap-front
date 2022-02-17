<template>
  <div class="staking-container-box">
    <div class="staking-container">
      <div class="banner-top">
          <div class="banner-logo-titile">
             <div class="banner-img-vessel">
                <img src="../assets/images/icon_coins.png" alt="">
             </div>
          </div>
          <div class="banner-detail-info">

          </div>
      </div>
      <!-- 底部组件位置 -->
      <div class="banner-ikego-info"></div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue } from 'nuxt-property-decorator'
import { mapState } from 'vuex'

export default Vue.extend({
  components: {},
  data() {
    return {}
  },
  computed: {
    // ...mapState(['wallet', 'farm', 'url', 'price', 'liquidity'])
    ...mapState({
      price: (state: any) => state.price,
      wallet: (state: any) => state.wallet
    })
  },
  watch: {},
  mounted() {},
  methods: {}
})
</script>
<style lang="less" scoped>
@import '../styles/base.less';
.staking-container {
  width: 580px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 30px;
  margin: 0 auto;
  padding-bottom: 20px;
  height: 658px;
  display: flex;
  flex-wrap: wrap;
  align-content: space-between;
  .banner-top {
    width: 100%;
    height: 140px;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-image: url('../assets/images/bannerTop.png');
  }
  .banner-ikego-info {
    width: 540px;
    height: 478px;
    margin: 0 auto;
    background: rgba(174, 2, 2, 0.06);
  }
}
@media screen and (max-width: 750px) {
  .staking-container {
    width: 343px;
  }
  .pool-container-hint {
    width: 343px;
    margin-top: 10px;
  }
}
</style>
