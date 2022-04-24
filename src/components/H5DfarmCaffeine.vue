<template>
  <div class="caffeine-pool-container">
    <div class="caffeine-banner">
      <div>
        <span>My Caffeine</span>
        <span>{{ addCommom(caffeineAmount, 4) }}</span>
      </div>
      <!-- <div>
        <span>Total Earned</span>
        <span>100,884,295.65</span>
      </div> -->
      <div>
        <span>Earnings</span>
        <span>{{ addCommom(earningsAmount, 4) }} <span class="caffeine-clue">Harvest ></span></span>
      </div>
    </div>
    <div class="caffeine-banner-farming">
      <img src="@/assets/images/caffeine-clueh5.png" alt="" />
      <div>Learn more ></div>
    </div>
    <div class="farm-caffeine-option" :class="changeBtn">
      <div v-for="(item, index) in caffeineData" :key="index" :class="item.name" @click="changeIcon(item.icon)">
        <div class="option-icon"></div>
        <p>{{ item.key }}</p>
        <div class="option-count">
          <div></div>
          {{ item.num }}
        </div>
      </div>
    </div>
    <div class="farm-caffeine-key">
      <img src="@/assets/images/icon-left-NFT.png" alt="" @click="changeImg('left')" />
      <img :src="`/_nuxt/src/assets/images/${farmCard}.png`" alt="" />
      <img src="@/assets/images/icon-right-NFT.png" alt="" @click="changeImg('right')" />
      <!-- <div>Rewards up to 300 CRM tokens</div> -->
    </div>
    <p>Congratulations, you can upgrade NFT from Bronze Key to Silver Key</p>
    <div class="pmgressbar-hint" :class="isdir">
      <!-- <span v-if="isShowcaffeine">{{ isShowcaffeine ? hint : 'Bronze' }}</span> -->
      <p>{{ isdir }}</p>
      <span>1,000 / 2,000</span>
    </div>
    <div class="pmgressbar-detail">
      <div>
        <div
          v-for="(item, index) in changeHintData"
          :key="index"
          @mouseenter="changeHint(item.val)"
          @mouseleave="changeHint"
        ></div>
      </div>
    </div>
    <div class="pmgressbar-btn">
      <Button class="action-btn">
        <div @click="changeMint">Mint</div>
      </Button>
      <Button class="action-btn">
        <div @click="changeUpgrade">Upgrade</div>
      </Button>
    </div>
    <DMintNFTPopout v-if="showMint" @onClose="() => (showMint = false)" />
    <DUpgradeNFTPopout v-if="showUpgrade" @onClose="() => (showUpgrade = false)" />
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import importIcon from '@/utils/import-icon'
import { addCommom } from '@/utils'
// import { Button } from 'ant-design-vue'
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
    earningsAmount: {
      type: Number,
      default: 0
    },
    caffeineAmount: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      stakeTitle: 'Stake',
      showStake: false,
      isShowTableTr: -1,
      isShowHidebox: false,
      showMint: false,
      showUpgrade: false,
      changeBtn: 'Card-Bronze',
      farmCard: 'Card-Bronze',
      tableDataArr: [
        {
          symbolName: 'CUSDT-CUSDC',
          feeRate: '0.05',
          coinA: 'CUSDT',
          coinB: 'CUSDC',
          apr: '106.8',
          liquidity: '999.8',
          rewardRangeTab: '1 - 1.002',
          rewardRange: '0.989 - 1',
          earned: '17.54',
          isStaked: 'Staked'
        }
      ],
      hint: '',
      isNotLink: false,
      isShowcaffeine: false,
      caffeineData: [
        { icon: 'Card-Bronze', name: 'option-Bronze', key: 'Brass', num: '1' },
        { icon: 'Card-Silver', name: 'option-Silver', key: 'Silver', num: '2' },
        { icon: 'Card-Golden', name: 'option-Golden', key: 'Golden', num: '1' },
        { icon: 'Card-Platinum', name: 'option-Platinum', key: 'Platinum', num: '2' },
        { icon: 'Card-Diamond', name: 'option-Diamond', key: 'Diamond', num: '4' }
      ],
      changeHintData: [
        { val: 'Bronze' },
        { val: 'Silver' },
        { val: 'Golden' },
        { val: 'Platinum' },
        { val: 'Diamond' }
      ],
      isdir: 'Brass'
    }
  },
  watch: {
    changeBtn(newValue, oldValue) {
      if (newValue == 'Card-Bronze') {
        this.isdir = 'Brass'
      } else if (newValue == 'Card-Silver') {
        this.isdir = 'Silver'
      } else if (newValue == 'Card-Golden') {
        this.isdir = 'Golden'
      } else if (newValue == 'Card-Platinum') {
        this.isdir = 'Platinum'
      } else if (newValue == 'Card-Diamond') {
        this.isdir = 'Diamond'
      }
    },
    tableDataArr: {
      handler(newValue, oldValue) {
        if (!newValue[0]) {
          this.isShowHidebox = true
        } else {
          this.isShowHidebox = false
        }
      },
      deep: true
    }
  },
  methods: {
    addCommom,
    importIcon,
    changeHint(value: string) {
      this.hint = value
      this.isShowHint = !this.isShowHint
      if (typeof value == 'string') {
        // console.log('1');
        this.isShowcaffeine = true
      } else {
        this.isShowcaffeine = false
      }
    },
    changeMint() {
      this.showMint = true
    },
    changeUpgrade() {
      this.showUpgrade = true
    },
    changeIcon(val) {
      // console.log(val)
      this.changeBtn = val
      this.farmCard = val
    },
    changeImg(key) {
      if (key == 'left') {
        this.changeBtn =
          this.changeBtn == 'Card-Bronze'
            ? 'Card-Diamond'
            : this.changeBtn == 'Card-Silver'
            ? 'Card-Bronze'
            : this.changeBtn == 'Card-Golden'
            ? 'Card-Silver'
            : this.changeBtn == 'Card-Platinum'
            ? 'Card-Golden'
            : this.changeBtn == 'Card-Diamond'
            ? 'Card-Platinum'
            : 'Card-Diamond'
        this.farmCard = this.changeBtn
      } else {
        this.changeBtn =
          this.changeBtn == 'Card-Bronze'
            ? 'Card-Silver'
            : this.changeBtn == 'Card-Silver'
            ? 'Card-Golden'
            : this.changeBtn == 'Card-Golden'
            ? 'Card-Platinum'
            : this.changeBtn == 'Card-Platinum'
            ? 'Card-Diamond'
            : this.changeBtn == 'Card-Diamond'
            ? 'Card-Bronze'
            : 'Card-Diamond'
        this.farmCard = this.changeBtn
      }
    }
  }
})
</script>
<style lang="less" scoped>
@import '../styles/base.less';
.caffeine-pool-container {
  width: 100%;
  padding-top: 20px;
  position: relative;
  margin-bottom: 40px;
  > p {
    margin: 30px 0 20px;
  }
}
.caffeine-banner {
  // width: 340px;
  height: 150px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  background: rgba(#000, 0.2);
  border-radius: 20px;
  padding: 10px 0;
}
.caffeine-banner > div {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}
.caffeine-banner-farming {
  position: absolute;
  // position: relative;
  width: 100%;
  height: 340px;
  display: flex;
  justify-content: center;
  top: 106px;
  img {
    width: 340px;
  }
  > div {
    width: 100%;
    position: absolute;
    text-align: center;
    top: 216px;
  }
}
.caffeine-clue {
  margin-left: 8px;
}
.farm-caffeine-option {
  width: 100%;
  height: 140px;
  display: flex;
  justify-content: space-between;
  margin-top: 236px;
  .option-Golden {
    margin-top: 46px;
  }
  .option-Silver,
  .option-Platinum {
    margin-top: 33px;
  }
}
.farm-caffeine-option > div {
  width: 60px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  position: relative;
  z-index: 100;
  color: #b5b8c2;
  p {
    width: 100%;
    margin-bottom: 0 !important;
    text-align: center;
  }
}
.option-icon {
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.option-count {
  width: 34px;
  height: 24px;
  background: rgba(#000, 0.1);
  border-radius: 8px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0 4px;
  > div {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #00ff4d;
  }
}
.option-Bronze {
  > .option-icon {
    background: url('@/assets/images/icon-Brass-Key-dark.png');
    background-size: 100% 100%;
  }
}
.option-Silver {
  > .option-icon {
    background: url('@/assets/images/icon-Silver-Key-dark.png');
    background-size: 100% 100%;
  }
}
.option-Golden {
  > .option-icon {
    background: url('@/assets/images/icon-Golden-Key-dark.png');
    background-size: 100% 100%;
  }
}
.option-Platinum {
  > .option-icon {
    background: url('@/assets/images/icon-Platinum-Key-dark.png');
    background-size: 100% 100%;
  }
}
.option-Diamond {
  > .option-icon {
    background: url('@/assets/images/icon-Diamond-Key-dark.png');
    background-size: 100% 100%;
  }
}
.Card-Bronze {
  > .option-Bronze {
    color: #fff !important;
    font-weight: 700;
    > .option-icon {
      background: url('@/assets/images/icon-Brass-Key-bright.png');
      background-size: 100% 100%;
    }
  }
}
.Card-Silver {
  > .option-Silver {
    color: #fff !important;
    font-weight: 700;
    > .option-icon {
      background: url('@/assets/images/icon-Silver-Key-bright.png');
      background-size: 100% 100%;
    }
  }
}
.Card-Golden {
  > .option-Golden {
    color: #fff !important;
    font-weight: 700;
    > .option-icon {
      background: url('@/assets/images/icon-Golden-Key-bright.png');
      background-size: 100% 100%;
    }
  }
}
.Card-Platinum {
  > .option-Platinum {
    color: #fff !important;
    font-weight: 700;
    > .option-icon {
      background: url('@/assets/images/icon-Platinum-Key-bright.png');
      background-size: 100% 100%;
    }
  }
}
.Card-Diamond {
  > .option-Diamond {
    color: #fff !important;
    font-weight: 700;
    > .option-icon {
      background: url('@/assets/images/icon-Diamond-Key-bright.png');
      background-size: 100% 100%;
    }
  }
}
.farm-caffeine-key {
  width: 100%;
  height: 330px;
  // background: #000;
  display: flex;
  // align-items: center;
  justify-content: space-around;
  img:nth-child(2) {
    width: 240px;
  }
  img:nth-child(1),
  img:nth-child(3) {
    width: 18px;
    height: 44px;
    margin-top: 110px;
  }
}
.pmgressbar-hint {
  width: 100px;
  height: 40px;
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: flex-start;
  flex-wrap: wrap;
  padding: 0 10px;
  border: 2px solid #d18945;
  border-radius: 6px;
  p {
    margin: 0 !important;
    font-weight: 800;
    background: linear-gradient(283deg, #4cffdf 0%, #6676f5 62%, #c400ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}
.Bronze {
  border: 2px solid #d18945;
}
.Silver {
  margin-left: 8px;
  border: 2px solid #e3f3ff;
}
.Golden {
  margin-left: 53px;
  border: 2px solid #fbff7c;
}
.Platinum {
  margin-left: 133px;
  border: 2px solid #6efbff;
}
.Diamond {
  margin-left: 180px;
  border: 2px solid #c495ff;
}
.pmgressbar-detail {
  width: 100%;
  height: 28px;
  margin-top: 36px;
  > div:nth-child(1) {
    width: 100%;
    height: 12px;
    background: rgba(255, 255, 255, 0.2) linear-gradient(270deg, #00ff90 0%, #7eadcc 50%, #a057ff 100%);
    border: 2px #000 solid;
    border-radius: 7px;
    position: relative;
    > div {
      position: absolute;
      width: 12px;
      height: 12px;
      top: -1px;
      border-radius: 5px;
      border: 1px #000 solid;
      &:hover {
        border: 2px #fff solid;
      }
    }
    > div:nth-child(1) {
      background: #d18945;
      left: 17px;
    }
    > div:nth-child(2) {
      background: #e3f3ff;
      left: 48px;
    }
    > div:nth-child(3) {
      background: #fbff7c;
      left: 94px;
    }
    > div:nth-child(4) {
      background: #6efbff;
      left: 174px;
    }
    > div:nth-child(5) {
      background: #c495ff;
      // left: 271px;
      right: 0px;
    }
  }
}
.pmgressbar-btn {
  width: 100%;
  height: 40px;
  margin-top: 24px;
  display: flex;
  justify-content: space-around;
}
.action-btn {
  width: 130px;
  .farm-btn-small();
  div {
    line-height: 38px;
  }
}
@media screen and (max-width: 750px) {
  .pmgressbar-detail {
    margin-top: 12px;
  }
}
</style>