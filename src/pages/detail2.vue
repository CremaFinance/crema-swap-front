<template>
  <div class="pool-container-box">
    <div class="pool-container-rollback">
      <svg class="icon" aria-hidden="true" @click="showConfirm = true">
        <use xlink:href="#icon-icon-return"></use>
      </svg>
      Back to Pools Overview
    </div>
    <div class="pool-container-filePacket">
      <HeaderDetails headersValue="yes" />
      <div class="filePacket-right">
        <a
          :class="isShowTitleOne ? 'title-active exact-active' : ''"
          @click=";(isShowTitleOne = true), (isShowTitleTwo = false)"
          >Increase Liquidity</a
        >
        <a
          :class="isShowTitleTwo ? 'title-active exact-active' : ''"
          @click=";(isShowTitleOne = false), (isShowTitleTwo = true)"
          >Remove Liquidity</a
        >
      </div>
    </div>
    <div class="pool-container-argument">
      <DetailPool
        titlePrice="Liquidity"
        :crmnumber="crmnumber"
        :crmnumberlayer="crmnumberlayer"
        :usdtnumber="usdtnumber"
      />
      <DetailPool titlePrice="Unclaimed fees" :unable="unable" />
    </div>
    <div class="pool-container-rateExchange">
      <div class="price-range">
        <div class="price-range-left">
          <span>Price range</span>
          <StatusBlock />
        </div>
        <div class="price-range-right">
          <span>1 CRM ≈ 71.1234 USDT</span>
          <div class="range-icon">
            <div :class="nowtitle === title ? 'range-rect' : 'range-noct'" @click="nowtitle = title">{{ title }}</div>
            <div :class="nowtitle === untitle ? 'range-rect' : 'range-noct'" @click="nowtitle = untitle">
              {{ untitle }}
            </div>
            <!-- <div class="range-rect">{{title}}</div>
            <div class="range-noct">{{untitle}}</div> -->
          </div>
        </div>
      </div>
      <div class="information-pool">
        <PriceRange Reference="60.00" sized="Min Price" />
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-icon-link"></use>
        </svg>
        <PriceRange Reference="∞" sized="Max Price" />
      </div>
    </div>
    <Confirm v-if="showConfirm" @onClose="() => (showConfirm = false)" />
  </div>
</template>
<script lang="ts">
import { Vue } from 'nuxt-property-decorator'
import { mapState } from 'vuex'

export default Vue.extend({
  components: {
    // WaitingHint,
    // SuccessHint
    // // Tooltip
    // // AddLiquidity
  },
  data() {
    return {
      crmnumber: 45.33,
      crmnumberlayer: '50%',
      usdtnumber: 0.09999,
      unable: 0,
      title: 'CRM',
      untitle: 'USDT',
      nowtitle: 'CRM',
      isShowTitleOne: true,
      isShowTitleTwo: false,
      showConfirm: false
    }
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

.pool-container-rollback {
  width: 770px;
  margin: auto;
  font-size: 14px;
  color: rgba(#fff);
  display: flex;
  align-items: center;
  margin-bottom: 2px;
  .icon {
    width: 20px;
    height: 20px;
    margin-right: 10px;
    cursor: pointer;
  }
}
.pool-container-filePacket {
  height: 74px;
  padding: 20px 0;
  width: 770px;
  margin: auto;
  // background: #ddd;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .filePacket-right {
    width: 334px;
    height: 34px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    .title-active {
      color: #fff;
    }
    a {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 137px;
      height: 28px;
      position: relative;
      z-index: 1;
      background: #1b2023;
      border-radius: 8px;
      margin-left: 10px;
      color: rgba(255, 255, 255, 0.5);
      font-family: 'Arial Bold';
      font-weight: bold;
      &:hover,
      &.active,
      &.exact-active {
        &::after,
        &::before {
          display: block;
        }
      }
      &::after,
      &::before {
        content: '';
        display: none;
        width: 139px;
        height: 30px;
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
}
.pool-container-argument {
  width: 770px;
  height: 225px;
  margin: auto;
  padding-bottom: 20px;
  // background: rgba(255,255,255,0.06);
  display: flex;
  justify-content: space-between;
}
.pool-container-rateExchange {
  width: 770px;
  height: 187px;
  margin: auto;
  border-radius: 30px;
  background: rgba(#fff, 0.03);
  padding: 14px 20px 20px;
  display: flex;
  flex-wrap: wrap;
  align-content: space-between;
  .price-range {
    width: 730px;
    height: 34px;
    // background: #000;
    display: flex;
    justify-content: space-between;
    .price-range-left {
      display: flex;
      justify-content: space-between;
      width: 205px;
      height: 28px;
      > span {
        width: 92px;
        height: 30px;
        line-height: 30px;
        font-family: 'Arial Bold';
        font-size: 16px;
        font-weight: bold;
      }
    }
    .price-range-right {
      // background: #fff;
      margin-top: 6px;
      width: 274px;
      height: 28px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      > span {
        font-weight: 700;
        font-size: 16px;
        background: linear-gradient(to right, #59bdad, #6676f5, #9a89f9, #eba7ff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .range-icon {
        display: flex;
        align-items: center;
        padding: 3px;
        border-radius: 7px;
        background: rgba(255, 255, 255, 0.1);
        width: 100px;
        height: 26px;
        .range-rect {
          padding: 0px 10px;
          height: 20px;
          background: linear-gradient(214deg, #59bdad 0%, #6676f5 61%, #9a89f9 76%, #eba7ff 100%);
          border-radius: 7px;
          cursor: pointer;
        }
        .range-noct {
          height: 20px;
          padding: 0px 10px;
          // background: rgba(255, 255, 255, 0.1);
          // border-radius: 4px;
          cursor: pointer;
        }
      }
    }
  }
  .information-pool {
    width: 730px;
    height: 105px;
    // background: #aaa;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .icon {
      width: 20px;
      height: 20px;
      cursor: pointer;
    }
  }
}
@media screen and (max-width: 750px) {
  .pool-container {
    width: 343px;
  }
  .pool-container-rollback {
    width: 343px;
    margin-top: 10px;
  }
}
</style>
