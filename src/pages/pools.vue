<template>
  <div class="positon-container">
    <div class="positon-center">
      <div class="positon-title">
        Concentrated Liquidity
        <Button class="my-pisiton-h5-btn" @click="toPosition">
          <div class="my-pisiton-logo"></div>
          <!-- <img src="../assets/images/icon-new-position@2x.png" alt="" /> -->
          <span>My Position</span>
        </Button>
      </div>
      <div class="my-pisiton">
        <div class="my-pisiton-box">
          <Button class="my-pisiton-btn" @click="toPosition">
            <div class="my-pisiton-logo"></div>
            <!-- <img src="../assets/images/icon-new-position@2x.png" alt="" /> -->
            <span>My Position</span>
          </Button>
        </div>
        <div class="total-val">
          <div class="total-value-locked">
            <div class="label">Total Value Locked</div>
            <div class="text">
              <span></span>
              ${{ statisticsInfo && thousands(fixD(statisticsInfo.tvl_in_usd, 2)) }}
            </div>
          </div>
          <div class="volume">
            <div class="label">Volume（24H)</div>
            <div class="text">
              <span></span>
              ${{ statisticsInfo && thousands(fixD(statisticsInfo.vol_in_usd_24h, 2)) }}
            </div>
          </div>
        </div>
      </div>
      <div class="filter">
        <div v-if="!value" class="coin-tab">
          <!-- <span  :class="direct ? 'active' : ''" @click="changeDirect(true, 'USD')">USD</span>
          <span :class="direct ? 'active' : ''" @click="changeDirect(true, 'USD')">USD</span>
          <span :class="!direct ? 'active' : ''" @click="changeDirect(false, 'SOL')">SOL</span> -->
          <span
            v-for="item in coinList"
            :key="item"
            :class="item == selectCoin ? 'active' : ''"
            @click="changeDirect(true, item)"
          >
            {{ item }}
          </span>
          <!-- <div class="check-content" v-for="(item, index) in coinList" :key="index" @click="selectCoin = item">
            <div class="check-box">
              <div v-show="selectCoin == item" class="check-box-active"></div>
            </div>
            <div class="check-name">{{ item }}</div>
          </div> -->
        </div>
        <div class="search-symbol">
          <input
            type="text"
            :value="value"
            autocomplete="off"
            autocorrect="off"
            placeholder="Search by symbol"
            minlength="1"
            maxlength="79"
            spellcheck="false"
            oninput="this.value=this.value.replace(/[^a-zA-Z]/g,'')"
            @input="handleInput"
          />
          <svg v-if="!value" class="icon" aria-hidden="true">
            <use xlink:href="#icon-a-bianzu30"></use>
          </svg>
          <svg v-else class="icon" aria-hidden="true" @click="value = ''">
            <use xlink:href="#icon-a-icon_Shutdownbeifen"></use>
          </svg>
        </div>
      </div>
    </div>
    <!-- 轮播图形式 -->
    <!-- <div class="positon-list-box"> -->
    <!-- <Carousel ref="positonLeft" :after-change="onChange" dotsClass="dot-position"> -->
    <!-- <div v-if="list && list.length >= 4" class="left-btn" @click="toLeft"></div>
      <div v-if="list && list.length >= 4" class="right-btn" @click="toRight"></div> -->
    <!-- <div class="positon-list-content"> -->
    <!-- :style="list && list.length >= 4 ? { position: 'absolute', left: 0 } : {}" -->
    <!-- <div class="positon-list" ref="positonLeft"> -->
    <!-- <MyPositonItem v-for="(item, index) in list" :key="index" :p-item="item"></MyPositonItem> -->
    <!-- </div> -->
    <!-- </div> -->
    <!-- </div> -->
    <MyPositonItem :selectCoin="selectCoin" :inputValue="value"></MyPositonItem>
    <!-- <div class="positon-container-share-left"></div>
    <div class="positon-container-share-right"></div> -->
    <!-- 列表形式 -->
    <!-- <div class="positon-list-box">
      <div class="positon-list">
        <div class="positon-list-content">
          <div class="left-btn" @click="toLeft"></div>
          <div class="right-btn" @click="toRight"></div>
          <MyPositonItem v-for="(item, index) in list" :key="index" :p-item="item"></MyPositonItem>
        </div>
      </div>
    </div> -->
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import MyPositonItem from 'components/MyPositonItem.vue'
import { Carousel } from 'ant-design-vue'
import { fixD } from '@/utils'
export default Vue.extend({
  model: {
    prop: 'value',
    event: 'onInput'
  },
  data() {
    return {
      value: '',
      direct: true,
      step: 0,
      coinList: ['All', 'USD', 'SOL'],
      selectCoin: 'All',
      statisticsInfo: {}
    }
  },
  computed: {
    ...mapState(['wallet', 'liquidity']),
    groupList() {
      return this.group(this.list, 4)
    }
  },
  watch: {
    'liquidity.statisticsInfo': {
      handler: 'watchStatisticsInfo',
      immediate: true
    }
  },
  created() {
    this.$accessor.liquidity.getPoolsDefaultPriceRange()
  },
  methods: {
    fixD,
    toPosition() {
      this.$router.push('/position')
    },
    handleInput(e: any) {
      this.value = e.target.value
    },
    watchStatisticsInfo(info) {
      this.statisticsInfo = info
    },
    group(array, subGroupLength) {
      let index = 0
      let newArray: any = []

      while (index < array.length) {
        newArray.push(array.slice(index, (index += subGroupLength)))
      }

      return newArray
    },
    changeDirect(value: boolean, name: String) {
      this.direct = value
      this.selectCoin = name
    },
    toLeft() {
      if (this.step != 0) {
        this.step++
        const listLength = this.list.length
        const positonLeft = this.$refs['positonLeft']
        positonLeft.style.transform = `translateX(${(100 / listLength) * this.step}%)`
      }
      // const leftValue = this.$refs['positonLeft'].scrollLeft
      // positonLeft.scrollTo({
      //   left: leftValue - 270,
      //   behavior: 'smooth'
      // })
      // console.log(this.$refs)
      // this.$refs.positonLeft.prev()
      // this.$ref['positonLeft'].prev()
    },
    toRight() {
      const result = this.list.length - -this.step > 4
      if (result) {
        this.step--
        const listLength = this.list.length
        const positonLeft = this.$refs['positonLeft']
        positonLeft.style.transform = `translateX(${(100 / listLength) * this.step}%)`
      }
      // this.$refs.positonLeft.next()
      // this.$ref['positonLeft'].next()
      // const leftValue = this.$refs['positonLeft'].scrollLeft
      // const positonLeft = this.$refs['positonLeft']
      // positonLeft.scrollTo({
      //   left: leftValue + 275,
      //   behavior: 'smooth'
      // })
    },
    onChange() {
      // console.log(1)
    },
    // 添加计位符
    thousands(num: any) {
      if (Math.floor(num) === num) {
        const numStr = (num || 0).toString()
        return numStr.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
      } else {
        const str = num.toString()
        const reg = str.includes('.') > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g
        return str.replace(reg, '$1,')
      }
    }
  }
})
</script>
<style lang="less" scoped>
.positon-container {
  width: 100%;
  position: relative;
  z-index: 5;
  // overflow-y: auto;
  margin-top: 20px;
  .positon-center {
    // width: 800px;
    width: 1100px;
    margin: 0 auto;
    .positon-title {
      font-size: 20px;
      font-family: Arial-BoldMT, Arial;
      font-weight: normal;
      color: #fff;
      .my-pisiton-h5-btn {
        display: none;
      }
    }
    .my-pisiton {
      // margin-top: 4px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      .my-pisiton-box {
        width: 132px;
        height: 36px;
        background: linear-gradient(90deg, rgba(183, 98, 255, 1), rgba(93, 193, 221, 1));
        border-radius: 18px;
        // border: 1px solid;
        padding: 2px;
        .my-pisiton-btn {
          width: 128px;
          height: 32px;
          background: #000;
          box-shadow: 0px 4px 12px 0px rgba(26, 28, 31, 0.5);
          border-radius: 17px;
          display: flex;
          align-items: center;
          justify-content: center;
          .my-pisiton-logo {
            width: 28px;
            height: 28px;
            background: url(../assets/images/icon-new-position@2x.png);
            background-size: 100% 100%;
            margin-right: 5px;
          }
          span {
            font-size: 14px;
            font-family: Arial-BoldMT, Arial;
            font-weight: normal;
            color: #fff;
          }
        }
        &:hover {
          background: linear-gradient(180deg, rgba(232, 228, 255, 1), rgba(0, 143, 232, 0.58));
          .my-pisiton-btn {
            background: linear-gradient(233deg, #5fe6d0 0%, #596cff 38%, #9380ff 72%, #e590ff 100%);
            .my-pisiton-logo {
              width: 28px;
              height: 28px;
              background: url(../assets/images/icon-position-hover.png);
              background-size: 100% 100%;
            }
          }
        }
      }
      .total-val {
        display: flex;
        text-align: right;
        .label {
          font-size: 14px;
          font-weight: 600;
          color: rgba(#fff, 0.5);
        }
        .text {
          width: 100%;
          font-size: 24px;
          font-weight: 400;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
          margin-top: 5px;

          span {
            display: inline-block;
            border-radius: 50%;
            width: 12px;
            height: 12px;
            background: linear-gradient(233deg, #4bb5ff 0%, #ce90ff 100%);
            margin-right: 5px;
          }
        }
        .volume {
          margin-left: 40px;
        }
      }
    }
    .filter {
      display: flex;
      justify-content: flex-end;
      margin-top: 30px;
      .search-symbol {
        position: relative;
        margin-left: 20px;
        input {
          width: 180px;
          height: 36px;
          padding: 11px 8px 11px 17px;
          background: linear-gradient(270deg, #3e434e 0%, #282a2f 100%);
          border-radius: 8px;
          border: 1px solid #3f434e;
          font-size: 14px;
          &::placeholder {
            color: rgba(#fff, 0.5);
          }
        }
        .icon {
          width: 20px;
          height: 20px;
          position: absolute;
          fill: rgba(#fff, 0.5);
          top: 8px;
          right: 8px;
          cursor: pointer;
        }
      }
      .coin-tab {
        // margin-left: 20px;
        min-width: 180px;
        height: 36px;
        background: linear-gradient(270deg, #3e434e 0%, #282a2f 100%);
        border-radius: 8px;
        display: flex;
        align-items: center;
        span {
          flex: 1;
          border-radius: 7px;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.5);
          height: 100%;
          display: flex;
          padding: 0 5px;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          &.active {
            background: linear-gradient(270deg, #3e434e 0%, #282a2f 100%);
            color: #fff;
            border: 1px solid #666b77;
          }
        }
        // display: flex;
        // align-items: center;
        .check-content {
          display: flex;
          align-items: center;
          flex-wrap: nowrap;
          .check-box {
            width: 18px;
            height: 18px;
            background: linear-gradient(270deg, #3e434e 0%, #282a2f 100%);
            box-shadow: 0px 4px 12px 0px rgba(26, 28, 31, 0.5);
            border-radius: 4px;
            border: 1px solid #666b77;
            margin-right: 8px;
            margin-left: 20px;
            padding: 3px;
            .check-box-active {
              width: 100%;
              height: 100%;
              background: linear-gradient(233deg, #5fe6d0 0%, #596cff 38%, #9380ff 72%, #e590ff 100%);
              box-shadow: 0px 4px 12px 0px rgba(26, 28, 31, 0.5);
              border-radius: 2px;
            }
          }
        }
      }
    }
  }

  .positon-list-box::-webkit-scrollbar {
    display: none;
  }
  .positon-list-box::-webkit-scrollbar-thumb {
    display: none;
  }
  .positon-container-share-left {
    width: 360px;
    height: 100%;
    background: #22252b;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 15;
    // top: 50%;
    // transform: translateX(-50%);
  }
  .positon-container-share-right {
    width: 360px;
    height: 100%;
    background: #22252b;
    position: absolute;
    top: 0;
    right: 0;
    z-index: 15;
    // top: 50%;
    // transform: translateX(-50%);
  }
}

@media screen and (max-width: 750px) {
  .positon-container {
    height: 100%;
    overflow: auto;
    .positon-container-share-left,
    .positon-container-share-right {
      display: none;
    }
    .positon-center {
      width: 100%;
      .positon-title {
        margin-top: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        white-space: normal;
        .my-pisiton-h5-btn {
          width: 130px;
          height: 34px;
          background: #000;
          box-shadow: 0px 4px 12px 0px rgba(26, 28, 31, 0.5);
          border-radius: 17px;
          display: flex;
          align-items: center;
          justify-content: center;
          .my-pisiton-logo {
            width: 28px;
            height: 28px;
            background: url(../assets/images/icon-new-position@2x.png);
            background-size: 100% 100%;
            margin-right: 5px;
          }
          span {
            font-size: 14px;
            font-family: Arial-BoldMT, Arial;
            font-weight: normal;
            color: #fff;
          }
        }
      }
      .my-pisiton,
      .filter {
        margin-top: 40px;
      }
    }
  }
  .positon-container .positon-center .my-pisiton .my-pisiton-box {
    display: none;
  }
  .positon-container .positon-center .my-pisiton .total-val {
    display: block;
    margin: auto;
    text-align: center;
    .volume {
      margin-left: 0;
    }
  }
  .positon-container .positon-center .filter {
    display: block;
    .search-symbol {
      margin-left: 0;
      input {
        width: 100%;
      }
    }
    .coin-tab {
      margin: 20px auto;
    }
  }
}
</style>