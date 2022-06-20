<template>
  <div class="caffeine-pool-container">
    <div class="caffeine-banner">
      <div>
        <span>My Caffeine</span>
        <!-- <span>{{ addCommom(caffeineAmount, 4) }}</span> -->
        <span>{{ caffeineAmount }}</span>
        <Tooltip overlay-class-name="burn-btn-tooltip" placement="top">
          <button class="burn-btn" @click="openBurnModal">Burn</button>
          <template slot="title">
            <!-- <div class="burn-tips">
              <img src="@/assets/images/icon-Burn@2x.png" />
              <span>Burn remaining Caffeine to get CRM</span>
            </div> -->
          </template>
        </Tooltip>
      </div>
      <!-- <div>
        <span>Total Earned</span>
        <span>100,884,295.65</span>
      </div> -->
      <div>
        <span>Earnings</span>
        <span
          >{{ addCommom(earningsAmount, 4) }} <span class="caffeine-clue" @click="gotoFarming">Harvest ></span></span
        >
      </div>
    </div>
    <div class="caffeine-banner-farming">
      <img src="@/assets/images/caffeine-cluh5.png" alt="" />
      <a
        target="_blank"
        href="https://medium.com/@Crema.finance/caffeine-farming-event-your-prelaunch-opportunity-to-grab-cremas-token-incentives-706425032a88"
        >Learn more ></a
      >
    </div>
    <div class="farm-caffeine-option" :class="changeBtn">
      <div v-for="(item, index) in keyData" :key="index" :class="item.name" @click="changeIcon(item)">
        <div class="option-icon"></div>
        <p v-if="item.key.split(' ')[0] === 'Golden'">Gold</p>
        <p v-else>{{ item.key.split(' ')[0] }}</p>
        <div v-if="countObj && countObj[item.id]" class="option-count">
          <div v-if="countObj && countObj[item.id]"></div>
          {{ countObj[item.id] }}
        </div>
      </div>
    </div>
    <div class="farm-caffeine-key">
      <i class="card-left-icon">
        <img src="@/assets/images/icon-left-NFT.png" alt="" @click="changeImg('left')" />
      </i>
      <!-- <img
        v-if="currentKeyItem && currentKeyItem.icon"
        :src="`/images/${currentKeyItem.icon}.png`"
        alt=""
        :class="!currentKeyItem.mint ? 'grey card-img' : 'card-img'"
      /> -->
      <img
        v-if="currentKeyItem && currentKeyItem.icon"
        :src="currentKeyItem.mint ? `/images/${currentKeyItem.icon}.png` : `/images/icon-${currentKeyItem.icon}.png`"
        alt=""
        class="card-img"
      />
      <i class="card-right-icon">
        <img src="@/assets/images/icon-right-NFT.png" alt="" @click="changeImg('right')" />
      </i>
      <!-- <div v-if="!currentKeyItem.mint && wallet.connected" class="img-text">Rewards up to 300 CRM tokens</div> -->
      <a
        v-if="wallet.connected && currentKeyItem && currentKeyItem.mint"
        class="img-text"
        target="_blank"
        :href="`https://solscan.io/token/${currentKeyItem.mint}?cluster=devnet`"
      >
        {{ currentKeyItem.mint && currentKeyItem.mint.substr(0, 4) }}
        ...
        {{ currentKeyItem.mint && currentKeyItem.mint.substr(currentKeyItem.mint.length - 4, 4) }}
      </a>
    </div>
    <!-- <p>{{ tipText || isClaimedText }}</p> -->
    <div class="tips-stats" v-if="wallet.connected && !farmingIsEnd && !currentKeyItem.is_crm_claimed">
      <div class="caync">
        <div>
          <!-- <img :src="`/_nuxt/src/assets/images/icon-${isdir}-Key-bright.png`" alt="" /> -->
          <img :src="`/images/icon-${isdir}-Key-bright.png`" alt="" />
        </div>
        <!-- <img :src="`/images/${currentKeyItem.icon}.png`" alt="" /> -->
      </div>
      <Progress
        :percent="
          Math.ceil(
            (delcommafy(addCommom(caffeineAmount, 0)) / delcommafy(addCommom(currentKeyItem.minRequireAmount, 0))) * 100
          )
        "
        :success="{ percent: 30 }"
        type="dashboard"
        trailColor="#527983"
        :stroke-color="{
          '0%': '#00EC86',
          '50%': '#3489C1',
          '100%': '#7318E3'
        }"
        class="interval"
      />
      <div class="centerMask">
        <span>{{ addCommom(caffeineAmount, 0) }} </span> / {{ addCommom(currentKeyItem.minRequireAmount, 0) }}
      </div>
    </div>
    <h3 v-if="currentKeyItem.isCrmClaimed && canClaim" class="congratulations">Congratulations</h3>
    <p v-if="wallet.connected" class="tips-text">{{ tipText || isClaimedText }}</p>
    <ul v-if="currentKeyItem.isCrmClaimed && canClaim" class="reward-coin-list">
      <li v-for="(item, key) in currentKeyItem.newClaimAmounts" :key="key">
        <img :src="importIcon(`/coins/${item.name}.png`)" />
        <span>x {{ item.amount }}</span>
        <Button v-if="!item.isSecondPartyClaimed" :loading="claimIsLoadingObj[key]" @click="toClaimMint(item, key)">
          Claim >
        </Button>
        <button v-else disabled>Claimed</button>
      </li>
    </ul>
    <div class="pmgressbar-btn">
      <!-- && !farmingIsEnd  -->
      <Button
        v-if="wallet.connected && !currentKeyItem.is_crm_claimed"
        class="action-btn"
        :disabled="!canMint"
        @click="changeMint"
      >
        Mint
      </Button>
      <!-- !farmingIsEnd && -->
      <Button
        v-if="
          wallet.connected &&
          currentKeyItem.id !== 5 &&
          currentKeyItem.mint &&
          !currentKeyItem.is_crm_claimed &&
          canUpgrade &&
          !currentKeyItem.isCrmClaimed
        "
        class="action-btn"
        @click="changeUpgrade"
      >
        Upgrade
      </Button>
      <Button
        v-if="!wallet.connected"
        class="action-btn"
        @click="$accessor.wallet.openModal"
        style="width: 150px; margin: -14px 0 0 68px"
      >
        Connect a wallet
      </Button>
      <Button
        v-if="
          wallet.connected && farmingIsEnd && currentKeyAmount > 0 && !isClaimedText && !currentKeyItem.isCrmClaimed
        "
        class="action-btn"
        @click="changeClaim"
        style="width: 100%"
      >
        Open Treasure Box
      </Button>
    </div>
    <DMintNFTPopout
      v-if="showMint"
      :currentKeyItem="currentKeyItem"
      :isMinting="isMinting"
      @onClose="() => (showMint = false)"
      @toMint="toMint"
    />
    <ClaimRewards
      v-if="showClaim"
      :isClaiming="isClaiming"
      :currentKeyItem="currentKeyItem"
      :openRewardTimestamp="openRewardTimestamp"
      :type="claimRewardsType"
      @onClose="() => (showClaim = false)"
      @toOpen="toOpen"
    />
    <DUpgradeNFTPopout
      v-if="showUpgrade"
      :currentKeyItem="currentKeyItem"
      :isUpgrading="isUpgrading"
      :canUpgradeHeighKeyItem="keyData[canUpgradeHeighKeyId - 1]"
      :upgradeObject="upgradeObject"
      @onClose="() => (showUpgrade = false)"
      @toUpgrade="toUpgrade"
    />
    <BurnCaffeineModal
      v-if="showBurnModal"
      :isBurnLoading="isBurnLoading"
      :caffeineAmount="caffeineAmount"
      :caffeineToCrmRate="caffeineToCrmRate"
      @onClose="closeBurnModal"
      @toBurn="toBurn"
    ></BurnCaffeineModal>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import mixin from '@/mixin/active'

export default Vue.extend({
  mixins: [mixin]
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
    margin: 40px 0 20px;
  }
  .congratulations {
    width: 100%;
    font-size: 18px;
    font-family: Krungthep;
    // line-height: 20px;
    background: linear-gradient(233deg, #89cfff 0%, #e0b9ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    height: 26px;
    // margin-bottom: 12px;
    margin-top: 20px;
  }
  .tips-text {
    width: 100%;
    margin: 10px 0 0;
  }
  .nft-rewards {
    width: 100%;
    height: 100px;
    background: #000;
  }
  .reward-coin-list {
    width: 280px;
    background: rgba(0, 0, 0, 0.1);
    padding: 10px 20px;
    margin: 10px auto 0;
    border-radius: 8px;
    // display: flex;
    // flex-wrap: wrap;
    li {
      display: flex;
      align-items: center;
      width: 100%;
      margin-top: 8px;
      &:first-child {
        margin-top: 0px;
      }
      img {
        width: 24px;
        height: 24px;
      }
      span {
        display: block;
        flex: 1;
        margin-left: 8px;
        height: 18px;
        font-size: 14px;
        font-family: Arial-BoldMT, Arial;
        font-weight: normal;
        color: #fff;
        line-height: 18px;
        background: linear-gradient(233deg, #4bb5ff 0%, #ce90ff 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      button {
        background: none;
        border: none;
        width: auto;
        padding: 0px;
      }
    }
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
.burn-btn {
  width: 72px;
  height: 24px;
  background: linear-gradient(233deg, #5fe6d0 0%, #596cff 38%, #9380ff 72%, #e590ff 100%);
  box-shadow: 0px 4px 12px 0px rgba(26, 28, 31, 0.5);
  border-radius: 6px;
  border: 1px solid rgba(232, 228, 255, 0.5) !important;
  // margin-left: 20px;
  font-size: 12px;
  &:hover {
    background: linear-gradient(268deg, #5fe6d0 0%, #596eff 39%, #533cd7 74%, #ad4ff6 100%);
    border: 1px solid rgba(232, 228, 255, 0.5) !important;
  }
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
  top: 176px;
  // img {
  //   width: 340px;
  // }
  > a {
    display: block;
    width: 100%;
    position: absolute;
    text-align: center;
    top: 216px;
    color: #fff;
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
  margin-top: 312px;
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
    height: 22px !important;
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
      height: 22px !important;
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
  position: relative;
  // img:nth-child(2) {
  //   width: 240px;
  // }
  // img:nth-child(1),
  // img:nth-child(3) {
  //   width: 18px;
  //   height: 44px;
  //   margin-top: 110px;
  // }
  img {
    &.grey {
      filter: grayscale(100%);
    }
  }
  .card-img {
    width: 240px;
    position: absolute;
    left: 50%;
    top: 0px;
    transform: translate(-50%, 0%);
  }
  > i {
    display: block;
    width: 14px;
    height: 44px;
    // margin-bottom: 68px;
    cursor: pointer;
    position: absolute;
    top: 30%;
    transform: translate(-50%, auto);
    &.card-left-icon {
      left: 0px;
    }
    &.card-right-icon {
      right: 0px;
    }
    img {
      width: 100%;
      height: 100%;
    }
  }
  .img-text {
    display: block;
    width: 190px;
    left: 50%;
    color: #fff;
    transform: translate(-50%, 0%);
    text-align: center;
    position: absolute;
    top: 266px;
  }
}
.pmgressbar-hint {
  min-width: 100px;
  max-width: 130px;
  height: 40px;
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: flex-start;
  // flex-wrap: wrap;
  flex-direction: column;
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
.tips-stats {
  position: relative;
  .interval {
    margin: 10px auto 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 50;
  }
  .caync {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 32px;
    z-index: 60;
    > div {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 55px;
      height: 55px;
      border-radius: 50%;
      background: rgba(#fff, 0.1);
      img {
        width: 20px;
        height: 20px;
      }
    }
  }
  /deep/ .ant-progress-text {
    margin-top: 46px;
  }
  .centerMask {
    margin: 0 auto;
    text-align: center;
    span {
      font-size: 18px;
      font-weight: bold;
      background: linear-gradient(48deg, #d032ff 0%, #8ab6ff 40%, #4ce1ff 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-family: Avenir;
    }
  }
}
.pmgressbar-btn {
  width: 100%;
  // height: 40px;
  margin-top: 24px;
  display: flex;
  // justify-content: space-around;
  justify-content: space-between;
  flex-wrap: wrap;
}
.action-btn {
  // width: 130px;
  .gradient-btn-large();
  width: 150px;
  height: 40px;
  font-size: 14px;
  font-weight: 100;
  margin-bottom: 12px;
  // div {
  //   line-height: 38px;
  // }
}
@media screen and (max-width: 750px) {
  .pmgressbar-detail {
    margin-top: 12px;
  }
}
</style>