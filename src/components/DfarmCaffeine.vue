<template>
  <div>
    <div class="farm-pool-table-NFT">
      <div class="farm-caffeine">
        <div></div>
        <div class="farm-caffeine-title"><div>Learn more ></div></div>
        <div class="farm-caffeine-option" :class="changeBtn">
          <div v-for="(item, index) in caffeineData" :key="index" :class="item.name" @click="changeIcon(item.icon)">
            <div class="option-icon"></div>
              {{ item.key }}
            <div class="option-count">
              <div></div>
              {{ item.num }}
            </div>
          </div>
        </div>
      </div>
      <div class="farm-NFT-detail">
        <div class="farm-NFT-detail-caffeine">
          <img src="@/assets/images/img-NFT-caffeine.png" alt="" />
          <div>
            <div>
              <div class="td-title">My Caffeine</div>
              <div class="td-text">106.8%</div>
            </div>
            <div>
              <div class="td-title">Total Earned</div>
              <div class="td-text">106.8%</div>
            </div>
            <div>
              <div class="td-title">Earnings <span class="title-Harvest">&nbsp;&nbsp;Harvest&nbsp;></span></div>
              <div class="td-text" style="text-align: right !important">106.8%</div>
            </div>
          </div>
        </div>
        <div class="farm-NFT-detail-Mint">
          <div class="farm-NFT-detail-Mint-Left" :class="isClaim ? 'farm-NFT-isClaim' : ''">
            <div v-if="!isNotLink && !isClaim" style="height: 160px; padding: 60px 0">
              Still need to produce xxx caffeine to mint NFT
            </div>
            <img
              :class="isNotLink ? 'NotLink-img' : ''"
              v-if="isNotLink"
              src="@/assets/images/img-link-Wallet.png"
              alt=""
            />
            <p v-if="isClaim">Congratulations</p>
            <h3 v-if="isClaim">Congratulations, this event the NFT got the rewards 1000 CRM</h3>
            <div class="farm-NFT-detail-Mint-pmgressbar">
              <div v-show="isShowHint" class="pmgressbar-hint">
                <span>{{ hint }}</span>
                <span>1,000 / 2,000</span>
              </div>
              <div v-if="!isNotLink && !isClaim" class="pmgressbar-detail">
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
                <Button v-if="!isNotLink && !isClaim" class="action-btn">
                  <div @click="changeMint">Mint</div>
                </Button>
                <Button v-if="!isNotLink && !isClaim" class="action-btn">
                  <div @click="changeUpgrade">Upgrade</div>
                </Button>
                <Button v-if="isNotLink" class="action-btn">
                  <div>Connect a wallet</div>
                </Button>
                <Button v-if="isClaim" class="action-btn">
                  <div @click="changeClaim">Claim</div>
                </Button>
              </div>
            </div>
          </div>
          <div class="farm-NFT-detail-Mint-Reight">
            <img @click="changeImg('left')" src="@/assets/images/icon-left-NFT.png" alt="" />
            <img :src="`/_nuxt/src/assets/images/${this.farmCard}.png`" alt="" />
            <img @click="changeImg('right')" src="@/assets/images/icon-right-NFT.png" alt="" />
            <div>Rewards up to {{ nftPrice }} CRM tokens</div>
          </div>
        </div>
      </div>
      <DMintNFTPopout v-if="showMint" @onClose="() => (showMint = false)" />
      <ClaimRewards v-if="showClaim" @onClose="() => (showClaim = false)" />
      <DUpgradeNFTPopout v-if="showUpgrade" @onClose="() => (showUpgrade = false)" />
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import importIcon from '@/utils/import-icon'
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
    }
  },
  data() {
    return {
      isShowHint: false,
      showMint: false,
      showClaim: false,
      showUpgrade: false,
      stakeTitle: 'Stake',
      showStake: false,
      isShowTableTr: -1,
      changeNFT: false,
      hint: '',
      isNotLink: false,
      isClaim: true,
      changeBtn: 'Card-Bronze',
      farmCard: 'Card-Bronze',
      nftPrice: '300',
      caffeineData: [
        { icon: 'Card-Bronze', name: 'option-Bronze', key: 'Brass Key', num: '1' },
        { icon: 'Card-Silver', name: 'option-Silver', key: 'Silver Key', num: '2' },
        { icon: 'Card-Golden', name: 'option-Golden', key: 'Golden Key', num: '1' },
        { icon: 'Card-Platinum', name: 'option-Platinum', key: 'Platinum Key', num: '2' },
        { icon: 'Card-Diamond', name: 'option-Diamond', key: 'Diamond Key', num: '4' }
      ],
      changeHintData: [
        { val: 'Bronze' },
        { val: 'Silver' },
        { val: 'Golden' },
        { val: 'Platinum' },
        { val: 'Diamond' }
      ],
      isEewardRangeTab: -1
    }
  },
  watch: {
    changeBtn(newValue, oldValue) {
      if (newValue == 'Card-Bronze') {
        this.isClaim = true
        this.isNotLink = false
        this.nftPrice = '300'
      } else if (newValue == 'Card-Silver') {
        this.isClaim = false
        this.isNotLink = true
        this.nftPrice = '700'
      } else if (newValue == 'Card-Golden') {
        this.isClaim = false
        this.isNotLink = false
        this.nftPrice = '1,300'
      } else if (newValue == 'Card-Platinum') {
        this.isClaim = false
        this.isNotLink = false
        this.nftPrice = '2,100'
      } else if (newValue == 'Card-Diamond') {
        this.isClaim = true
        this.isNotLink = false
        this.nftPrice = '3,100'
      }
    }
  },
  methods: {
    importIcon,
    changeHint(value: string) {
      this.hint = value
      this.isShowHint = !this.isShowHint
    },
    changeMint() {
      this.showMint = true
    },
    changeClaim() {
      this.showClaim = true
    },
    changeUpgrade() {
      this.showUpgrade = true
    },
    changeIcon(val) {
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
.farm-pool-table-NFT {
  width: 1400px;
  height: 500px;
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  padding-right: 180px;
}
.farm-caffeine {
  width: 600px;
  height: 500px;
  display: flex;
  justify-content: space-between;
  position: relative;
  > div:nth-child(1) {
    position: absolute;
    width: 460px;
    height: 460px;
    background: url('@/assets/images/img-NFT-left.png');
    background-size: 100% 100%;
  }
}
.farm-caffeine-title {
  width: 305px;
  height: 100%;
  display: flex;
  z-index: 100;
  align-items: center;
  justify-content: flex-end;
  > div {
    cursor: pointer;
    margin-top: 10px;
  }
}
.farm-caffeine-option {
  width: 260px;
  height: 100%;
  position: relative;
  > div {
    position: absolute;
    display: flex;
    align-items: center;
    cursor: pointer;
    color: #b5b8c2;
  }
  .option-icon {
    width: 20px;
    height: 20px;
    margin-right: 8px;
    cursor: pointer;
  }
  .option-count {
    width: 34px;
    height: 24px;
    background: rgba(#000, 0.1);
    border-radius: 8px;
    margin-left: 8px;
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
    top: 33px;
    left: 30px;
    > .option-icon {
      background: url('@/assets/images/icon-Brass-Key-dark.png');
      background-size: 100% 100%;
    }
  }
  .option-Silver {
    top: 113px;
    left: 92px;
    > .option-icon {
      background: url('@/assets/images/icon-Silver-Key-dark.png');
      background-size: 100% 100%;
    }
  }
  .option-Golden {
    top: 190px;
    left: 110px;
    > .option-icon {
      background: url('@/assets/images/icon-Golden-Key-dark.png');
      background-size: 100% 100%;
    }
  }
  .option-Platinum {
    top: 270px;
    left: 94px;
    > .option-icon {
      background: url('@/assets/images/icon-Platinum-Key-dark.png');
      background-size: 100% 100%;
    }
  }
  .option-Diamond {
    top: 350px;
    left: 32px;
    > .option-icon {
      background: url('@/assets/images/icon-Diamond-Key-dark.png');
      background-size: 100% 100%;
    }
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
.farm-NFT-detail {
  width: 600px;
  height: 500px;
}
.farm-NFT-detail-caffeine {
  height: 85px;
  width: 100%;
  border-bottom: 1px solid rgba(#fff, 0.1);
  display: flex;
  img {
    width: 60px;
    height: 60px;
  }
  > div {
    width: 530px;
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    font-weight: bold;
  }
}
.td-title {
  font-size: 12px;
  color: #b5b8c2;
  display: flex;
  align-items: center;
  margin-top: 8px;
  .icon {
    width: 14px;
    height: 14px;
    fill: #b5b8c2;
    margin-left: 12px;
    &:hover {
      fill: #fff;
    }
  }
}
.title-Harvest {
  color: #fff !important;
  cursor: pointer;
}
.td-text {
  font-size: 14px;
  font-weight: 800;
  color: #fff;
  margin-top: 10px;
  display: flex;
  img {
    width: 20px;
    height: 20px;
    margin-left: 7px;
  }
}
.farm-NFT-detail-Mint {
  height: 325px;
  margin-top: 12px;
  display: flex;
  justify-content: space-between;
}
.farm-NFT-detail-Mint-Left {
  width: 280px;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: space-between;
  > img {
    width: 100px;
    height: 100px;
  }
}
.farm-NFT-isClaim {
  justify-content: flex-start;
  align-content: space-around;
  > p {
    font-size: 18px;
    font-family: Krungthep;
    // line-height: 20px;
    background: linear-gradient(233deg, #89cfff 0%, #e0b9ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}
.farm-NFT-isClaim > .farm-NFT-detail-Mint-pmgressbar .pmgressbar-btn {
  justify-content: flex-start;
}
.NotLink-img {
  margin-top: 80px;
}
.farm-NFT-detail-Mint-pmgressbar {
  height: 130px;
  width: 100%;
  position: relative;
}
.pmgressbar-hint {
  width: 160px;
  height: 32px;
  font-size: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px 0 20px;
  background: rgba(#000, 0.2);
  border-radius: 5px;
  position: absolute;
  top: 0;
  left: 0;
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
      cursor: pointer;
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
.farm-NFT-detail-Mint-Reight {
  width: 276px;
  display: flex;
  align-items: center;
  // justify-content: space-between;
  position: relative;
  img:nth-child(2) {
    width: 240px;
  }
  img:nth-child(1),
  img:nth-child(3) {
    width: 14px;
    height: 44px;
    margin-bottom: 68px;
    cursor: pointer;
  }
  img:nth-child(1),
  img:nth-child(2) {
    margin-right: 4px;
  }
  div {
    width: 190px;
    left: 43px;
    text-align: center;
    position: absolute;
    top: 258px;
  }
}
</style>