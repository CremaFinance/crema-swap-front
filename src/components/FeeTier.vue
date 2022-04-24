<template>
  <div class="fee-tier-container">
    <div class="title">
      <h3 v-if="currentIndex > -1">{{ (list[currentIndex] && list[currentIndex].value) || '--' }} fee tier</h3>
      <h3 v-else>fee tier</h3>
      <svg
        aria-hidden="true"
        class="icon"
        :class="showFeeSelect ? 'is-rotate' : ''"
        @click="showFeeSelect = !showFeeSelect"
      >
        <use xlink:href="#icon-icon-on"></use>
      </svg>
      <!-- <a @click="showFeeSelect = !showFeeSelect">{{ showFeeSelect ? 'Hide' : 'Edit' }}</a> -->
    </div>
    <ul v-if="showFeeSelect">
      <li v-for="(item, index) in list" :key="index" :class="currentIndex === index ? 'active' : 'disabled'">
        <h3>{{ item.fee }}</h3>
        <p>{{ item.text }}</p>
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import { Vue } from 'nuxt-property-decorator'

export default Vue.extend({
  props: {
    currentFee: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      list: [
        {
          fee: '0.01% fee',
          text: 'Best for stable pairs',
          value: '0.01%'
        },
        {
          fee: '0.3% fee',
          text: 'Best for most pairs',
          value: '0.3%'
        },
        {
          fee: '1% fee',
          text: 'Best for exotic pairs',
          value: '1%'
        }
      ],
      showFeeSelect: true,
      currentIndex: 1
    }
  },
  watch: {
    currentFee: {
      handler: 'currentFeeWatch',
      immediate: true
    }
    // current(newVal) {
    //   console.log('FeeTier####currentWatch###newVal###', newVal)
    // }
  },
  methods: {
    currentFeeWatch(newVal) {
      console.log('FeeTier####currentWatch###newVal###', newVal)
      let list = [
        {
          fee: '0.01% fee',
          text: 'Best for stable pairs',
          value: '0.01%'
        },
        {
          fee: '0.3% fee',
          text: 'Best for most pairs',
          value: '0.3%'
        },
        {
          fee: '1% fee',
          text: 'Best for exotic pairs',
          value: '1%'
        }
      ]
      if (newVal > 0.3) {
        list[2] = {
          fee: `${newVal}% fee`,
          text: 'Best for exotic pairs',
          value: `${newVal}%`
        }
        this.currentIndex = 2
      } else if (newVal < 0.3 && newVal > 0) {
        list[0] = {
          fee: `${newVal}% fee`,
          text: 'Best for stable pairs',
          value: `${newVal}%`
        }
        this.currentIndex = 0
      } else if (newVal === 0.3) {
        this.currentIndex = 1
      } else {
        this.currentIndex = -1
      }
      this.list = list
    }
  }
})
</script>
<style lang="less" scoped>
.fee-tier-container {
  width: 460px;
  user-select: none;
  // height: 132px;
  box-shadow: 0px 4px 12px 0px #25282c;
  border-radius: 10px;
  border: 1px solid #3f434e;
  margin-top: 25px;
  padding: 10px;
  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    > h3 {
      font-size: 14px;
      color: #fff;
      margin-bottom: 0px;
      font-weight: bold;
    }
    > a {
      width: 48px;
      height: 24px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 7px;
      font-size: 12px;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    > .icon {
      width: 20px;
      height: 20px;
      fill: rgba(255, 255, 255, 0.6);
      &:hover {
        fill: #fff;
      }
    }
    > .is-rotate {
      transform: rotate(180deg);
    }
  }
  ul {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 14px;
    margin-bottom: 0px;
    li {
      width: 140px;
      height: 72px;
      border-radius: 10px;
      border: 1px solid #3f434e;
      padding: 15px 12px;
      box-sizing: content-box;
      box-shadow: 0px 4px 12px 0px rgba(26, 28, 31, 0.5);
      h3 {
        font-size: 14px;
        color: #fff;
      }
      p {
        font-size: 12px;
        color: #b5b8c2;
      }
      &.active {
        background: linear-gradient(270deg, #3e434e 0%, #2f333b 100%);
        box-shadow: 0px 4px 12px 0px rgba(26, 28, 31, 0.5);
        h3 {
          color: #07ebad;
        }
      }
      &.disabled {
        cursor: not-allowed;
        background: #26292f;
        h3 {
          color: rgba(255, 255, 255, 0.3);
        }
        p {
          color: rgba(255, 255, 255, 0.3);
        }
      }
    }
  }
}
@media screen and (max-width: 750px) {
  .fee-tier-container {
    width: 100%;
    ul {
      li {
        width: 33%;
        height: 100%;
        padding: 10px;
        & + li {
          margin-left: 5px;
        }
        p {
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>
