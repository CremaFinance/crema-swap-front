<template>
  <div class="caffeine-pool-container">
    <div class="caffeine-banner">
      <div>
        <span>My Caffeine</span>
        <span>1,884,295.65</span>
      </div>
      <div>
        <span>Total Earned</span>
        <span>100,884,295.65</span>
      </div>
      <div>
        <span>Earnings</span>
        <span>1,884,295.65 <span class="caffeine-clue">Harvest ></span></span>
      </div>
    </div>
    <div class="caffeine-banner-farming"></div>
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
      <img @click="changeImg('left')" src="@/assets/images/icon-left-NFT.png" alt="" />
      <img :src="`/_nuxt/src/assets/images/${this.farmCard}.png`" alt="" />
      <img @click="changeImg('right')" src="@/assets/images/icon-right-NFT.png" alt="" />
      <!-- <div>Rewards up to 300 CRM tokens</div> -->
    </div>
    <p>Congratulations, you can upgrade NFT from Bronze Key to Silver Key</p>
    <div class="pmgressbar-hint" :class="isShowcaffeine ? 'show-hint':''">
      <span v-if="isShowcaffeine">{{ isShowcaffeine ? hint : 'Bronze' }}</span>
      <span v-if="isShowcaffeine">1,000 / 2,000</span>
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
      changeHintData: [{ val: 'Bronze' }, { val: 'Silver' }, { val: 'Golden' }, { val: 'Platinum' }, { val: 'Diamond' }]
    }
  },
  watch: {
    // searchKey: {
    //   immediate: true,
    //   handler: 'updateSearchKey'
    // }
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
      console.log(val)
      this.changeBtn = val
      this.farmCard = val
    },
    changeImg(key) {
      if (key == 'left') {
        this.changeBtn =
          this.changeBtn == 'Card-Bronze'
            ? 'Card-Bronze'
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
            ? 'Card-Diamond'
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
  width: 340px;
  padding-top: 20px;
  position: relative;
  margin-bottom: 40px;
  > p {
    margin-top: 30px;
  }
}
.caffeine-banner {
  width: 340px;
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
  width: 340px;
  height: 340px;
  background: url('@/assets/images/caffeine-clueh5.png');
  background-size: 100% 100%;
  top: 106px;
}
.caffeine-clue {
  margin-left: 8px;
}
.farm-caffeine-option {
  width: 340px;
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
  width: 160px;
  height: 32px;
  font-size: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px 0 20px;
  background: none;
  border-radius: 5px;
}
.show-hint{
  background: rgba(#000, 0.2);
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
      background: #D18945;
      left: 17px;
    }
    > div:nth-child(2) {
      background: #E3F3FF;
      left: 48px;
    }
    > div:nth-child(3) {
      background: #FBFF7C;
      left: 94px;
    }
    > div:nth-child(4) {
      background: #6EFBFF;
      left: 174px;
    }
    > div:nth-child(5) {
      background: #C495FF;
      left: 271px;
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
  .pmgressbar-detail{
    margin-top: 12px;
  }
}
</style>