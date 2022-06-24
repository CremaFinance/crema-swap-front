<template>
  <div>
    <div ref="caffeine" class="farm-pool-table-NFT">
      <div class="farm-caffeine">
        <div></div>
        <div class="farm-caffeine-title">
          <a
            target="_blank"
            href="https://medium.com/@Crema.finance/caffeine-farming-event-your-prelaunch-opportunity-to-grab-cremas-token-incentives-706425032a88"
            >Learn more ></a
          >
        </div>
        <div class="farm-caffeine-option" :class="changeBtn">
          <div v-for="(item, index) in keyData" :key="index" :class="item.name" @click="changeIcon(item)">
            <div class="option-icon"></div>
            {{ item.key }}
            <div v-if="countObj && countObj[item.id]" class="option-count">
              <div></div>
              {{ countObj[item.id] }}
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
              <div class="td-text">
                <!-- <span>{{ addCommom(caffeineAmount, 4) }}</span> -->
                <span>{{ caffeineAmount }}</span>
                <!-- Open when online 0620 -->
                <!-- <Tooltip
                  overlay-class-name="burn-btn-tooltip"
                  placement="top"
                  :get-popup-container="() => $refs.caffeine"
                >
                  <button class="burn-btn ant-tooltip-open" @click="openBurnModal">Burn</button>
                  <template slot="title">
                    <div class="burn-tips">
                      <img src="@/assets/images/icon-Burn@2x.png" />
                      <span>Burn remaining Caffeine to get CRM</span>
                    </div>
                  </template>
                </Tooltip> -->
              </div>
            </div>
            <!-- <div>
              <div class="td-title">Total Earned</div>
              <div class="td-text">106.8%</div>
            </div> -->
            <div>
              <div class="td-title">
                Earnings <span class="title-Harvest" @click="gotoFarming">&nbsp;&nbsp;Harvest&nbsp;></span>
              </div>
              <div class="td-text" style="text-align: right !important">{{ addCommom(earningsAmount, 4) }}</div>
            </div>
          </div>
        </div>
        <div class="farm-NFT-detail-Mint">
          <div class="farm-NFT-detail-Mint-Left" :class="farmingIsEnd ? 'farm-NFT-isClaim' : ''">
            <div class="tips-text-box">
              <div v-if="wallet.connected && !farmingIsEnd && !currentKeyItem.is_crm_claimed" class="tips-stats">
                <div
                  v-if="
                    delcommafy(addCommom(caffeineAmount, 0)) > delcommafy(addCommom(currentKeyItem.minRequireAmount, 0))
                  "
                  class="changeStats"
                >
                  100%
                </div>
                <div class="caync">
                  <img :src="`/images/icon-${isdir}-Key-bright.png`" alt="" />
                </div>
                <Progress
                  :percent="
                    Math.ceil(
                      (delcommafy(addCommom(caffeineAmount, 0)) /
                        delcommafy(addCommom(currentKeyItem.minRequireAmount, 0))) *
                        100
                    )
                  "
                  :success="{ percent: 30 }"
                  type="dashboard"
                  trail-color="#527983"
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
              <img
                v-if="!wallet.connected"
                :class="!wallet.connected ? 'NotLink-img' : ''"
                src="@/assets/images/img-link-Wallet.png"
                alt=""
              />
              <h3 v-if="currentKeyItem.isCrmClaimed && canClaim" class="congratulations">Congratulations</h3>
              <p
                v-if="
                  wallet.connected &&
                  currentKeyItem.id !== 5 &&
                  currentKeyAmount > 0 &&
                  caffeineAmount < currentKeyItem.upgradeMinAmount &&
                  upgradeMouseover
                "
                class="tips-text"
              >
                You need {{ Math.ceil(currentKeyItem.upgradeMinAmount - caffeineAmount) }} more Caffeine to upgrade this
                key.
              </p>
              <p
                v-else-if="
                  wallet.connected &&
                  currentKeyItem.id !== 5 &&
                  currentKeyAmount > 0 &&
                  caffeineAmount >= currentKeyItem.upgradeMinAmount &&
                  upgradeMouseover
                "
                class="tips-text"
              >
                You are eligible to upgrade this key to a {{ keyData[canUpgradeHeighKeyId - 1].key }}
              </p>
              <p v-else-if="wallet.connected" class="tips-text">{{ tipText || isClaimedText }}</p>
              <ul v-if="currentKeyItem.isCrmClaimed && canClaim" class="reward-coin-list">
                <li v-for="(item, key) in currentKeyItem.newClaimAmounts" :key="key">
                  <img :src="importIcon(`/coins/${item.name}.png`)" />
                  <span>x {{ item.amount }}</span>
                  <Button
                    v-if="!item.isSecondPartyClaimed"
                    :loading="claimIsLoadingObj[key]"
                    @click="toClaimMint(item, key)"
                  >
                    Claim >
                  </Button>
                  <button v-else class="caffeine-claimed" disabled>Claimed</button>
                </li>
              </ul>
            </div>

            <div class="farm-NFT-detail-Mint-pmgressbar">
              <div class="pmgressbar-btn">
                <!-- v-if="wallet.connected && !farmingIsEnd && !currentKeyItem.is_crm_claimed" -->
                <Tooltip
                  v-if="wallet.connected && !currentKeyItem.is_crm_claimed"
                  overlay-class-name="burn-btn-tooltip"
                  placement="top"
                  :get-popup-container="() => $refs.caffeine"
                >
                  <div>
                    <Button class="action-btn" :disabled="!canMint" @click="changeMint"> Mint </Button>
                  </div>
                  <template v-if="!canMint" slot="title">
                    <div>
                      <span>You don't have enough Caffeine.</span>
                    </div>
                  </template>
                </Tooltip>
                <!-- wallet.connected &&
                    !farmingIsEnd &&
                    currentKeyItem.id !== 5 &&
                    currentKeyItem.mint &&
                    !currentKeyItem.is_crm_claimed &&
                    canUpgrade -->
                <Tooltip
                  v-if="wallet.connected && !currentKeyItem.is_crm_claimed"
                  overlay-class-name="burn-btn-tooltip"
                  placement="top"
                  :get-popup-container="() => $refs.caffeine"
                >
                  <div>
                    <!-- <Button
                      v-if="
                        wallet.connected &&
                        currentKeyItem.id !== 5 &&
                        currentKeyItem.mint &&
                        !currentKeyItem.is_crm_claimed &&
                        !currentKeyItem.isCrmClaimed
                      "
                      :disabled="!canUpgrade"
                      class="action-btn"
                      @click="changeUpgrade"
                    > -->
                    <Button :disabled="!canUpgrade" class="action-btn" @click="changeUpgrade"> Upgrade </Button>
                  </div>
                  <template v-if="!canUpgrade" slot="title">
                    <div>
                      <span v-if="currentKeyItem.id === 5">Already at the highest level.</span>
                      <span v-else-if="currentKeyAmount < 1">You need to mint a key first.</span>
                      <span
                        v-else-if="
                          currentKeyItem.id !== 5 &&
                          currentKeyAmount > 0 &&
                          caffeineAmount < currentKeyItem.upgradeMinAmount
                        "
                        >You need {{ Math.ceil(currentKeyItem.upgradeMinAmount - caffeineAmount) }} more Caffeine to
                        upgrade this key.</span
                      >
                      <span
                        v-else-if="
                          currentKeyItem.id !== 5 &&
                          currentKeyAmount > 0 &&
                          caffeineAmount >= currentKeyItem.upgradeMinAmount
                        "
                        >You are eligible to upgrade this key to a {{ keyData[canUpgradeHeighKeyId - 1].key }}</span
                      >
                      <span v-else>You don't have enough Caffeine.</span>
                    </div>
                  </template>
                  <template v-else slot="title">
                    <div>
                      <span>You are eligible to upgrade this key.</span>
                    </div>
                  </template>
                </Tooltip>
                <Button
                  v-if="!wallet.connected"
                  class="action-btn"
                  style="width: 150px; margin: 0 auto"
                  @click="$accessor.wallet.openModal"
                >
                  Connect a wallet
                </Button>
                <!-- Open when online 0620 -->
                <!-- <Button
                  v-if="
                    wallet.connected &&
                    farmingIsEnd &&
                    currentKeyAmount > 0 &&
                    !isClaimedText &&
                    !currentKeyItem.isCrmClaimed
                  "
                  class="action-btn"
                  style="width: 270px"
                  @click="changeClaim"
                >
                  Open Treasure Box
                </Button> -->
              </div>
            </div>
          </div>
          <div class="farm-NFT-detail-Mint-Reight">
            <i class="card-left-icon">
              <img src="@/assets/images/icon-left-NFT.png" alt="" @click="changeImg('left')" />
            </i>
            <img
              v-if="currentKeyItem && currentKeyItem.icon"
              :src="
                currentKeyItem.mint ? `/images/${currentKeyItem.icon}.png` : `/images/icon-${currentKeyItem.icon}.png`
              "
              alt=""
              class="card-img"
            />
            <i class="card-right-icon">
              <img src="@/assets/images/icon-right-NFT.png" alt="" @click="changeImg('right')" />
            </i>
            <a
              v-if="wallet.connected && currentKeyItem && currentKeyItem.mint"
              class="img-text"
              style="margin-top: 6px"
              target="_blank"
              :href="`https://solscan.io/token/${currentKeyItem.mint}?cluster=devnet`"
            >
              {{ currentKeyItem.mint && currentKeyItem.mint.substr(0, 4) }}
              ...
              {{ currentKeyItem.mint && currentKeyItem.mint.substr(currentKeyItem.mint.length - 4, 4) }}
            </a>
          </div>
        </div>
      </div>
      <DMintNFTPopout
        v-if="showMint"
        :current-key-item="currentKeyItem"
        :is-minting="isMinting"
        @onClose="() => (showMint = false)"
        @toMint="toMint"
      />
      <ClaimRewards
        v-if="showClaim"
        :is-claiming="isClaiming"
        :current-key-item="currentKeyItem"
        :open-reward-timestamp="openRewardTimestamp"
        :type="claimRewardsType"
        @onClose="() => (showClaim = false)"
        @toOpen="toOpen"
      />
      <DUpgradeNFTPopout
        v-if="showUpgrade"
        :current-key-item="currentKeyItem"
        :is-upgrading="isUpgrading"
        :can-upgrade-heigh-key-item="keyData[canUpgradeHeighKeyId - 1]"
        :upgrade-object="upgradeObject"
        @onClose="() => (showUpgrade = false)"
        @toUpgrade="toUpgrade"
      />
      <BurnCaffeineModal
        v-if="showBurnModal"
        :is-burn-loading="isBurnLoading"
        :caffeine-amount="caffeineAmount"
        :caffeine-to-crm-rate="caffeineToCrmRate"
        @onClose="closeBurnModal"
        @toBurn="toBurn"
      ></BurnCaffeineModal>
    </div>
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
.farm-pool-table-NFT {
  width: 1400px;
  // height: 500px;
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  padding-right: 180px;
}
.farm-caffeine {
  width: 600px;
  // height: 500px;
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
  height: 488px;
  display: flex;
  z-index: 100;
  align-items: center;
  justify-content: flex-end;
  > a {
    color: #fff;
    // cursor: pointer;
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
      height: 22px !important;
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
.farm-NFT-detail {
  width: 600px;
  // height: 500px;
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
  .burn-btn {
    width: 72px;
    height: 24px;
    // background: linear-gradient(233deg, #5fe6d0 0%, #596cff 38%, #9380ff 72%, #e590ff 100%);
    // box-shadow: 0px 4px 12px 0px rgba(26, 28, 31, 0.5);
    // border: 1px solid rgba(232, 228, 255, 0.5) !important;
    background: linear-gradient(268deg, #5fe6d0 0%, #596eff 32%, #6950f5 68%, #ad4ff6 100%);
    box-shadow: 0px 4px 6px 0px rgba(26, 28, 31, 0.5);
    border: 1px solid rgba(#e8e4ff) !important;
    border-radius: 6px;
    margin-left: 20px;
    font-size: 12px;
    &:hover {
      // background: linear-gradient(268deg, #5fe6d0 0%, #596eff 39%, #533cd7 74%, #ad4ff6 100%);
      // border: 1px solid rgba(232, 228, 255, 0.5) !important;
      background: linear-gradient(268deg, #68f5de 0%, #6c7fff 32%, #7058f8 68%, #ba60ff 100%);
    }
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
  align-items: center;
  height: 24px;
  img {
    width: 20px;
    height: 20px;
    margin-left: 7px;
  }
}
.burn-tips {
  display: flex;
  align-items: center;
  img {
    width: 20px;
    height: 20px;
  }
  span {
    font-size: 12px;
    font-family: Arial-BoldMT, Arial;
    font-weight: normal;
    color: #fff;
    line-height: 12px;
    background: linear-gradient(233deg, #5fe6d0 0%, #596cff 38%, #9380ff 72%, #e590ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-left: 4px;
  }
}
.farm-NFT-detail-Mint {
  // height: 325px;
  margin-top: 12px;
  display: flex;
  justify-content: space-between;
}
.farm-NFT-detail-Mint-Left {
  width: 280px;
  // height: 100%;
  display: flex;
  // flex-wrap: wrap;
  flex-direction: column;
  // justify-content: center;
  // align-content: space-between;
  .tips-text-box {
    min-height: 210px;
    position: relative;
    z-index: 80;
    > img {
      width: 160px;
      height: 160px;
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
      margin-top: 10px;
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
        .caffeine-claimed {
          color: rgba(#f1f1f2, 0.7) !important;
        }
      }
    }
    .tips-stats {
      .changeStats {
        position: absolute;
        width: 100%;
        text-align: center;
        top: 106px;
      }
      .interval {
        margin: 10px auto 0;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 50;
      }
      .caync {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 55px;
        height: 55px;
        border-radius: 50%;
        background: rgba(#fff, 0.1);
        position: absolute;
        z-index: 60;
        left: 113px;
        top: 40px;
        img {
          width: 20px;
          height: 20px;
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
  }
}
.farm-NFT-isClaim {
  justify-content: flex-start;
  align-content: space-around;
}
.farm-NFT-isClaim > .farm-NFT-detail-Mint-pmgressbar .pmgressbar-btn {
  // justify-content: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
}
.NotLink-img {
  // margin-top: 80px;
  margin: 40px 0 0 60px;
}
.farm-NFT-detail-Mint-pmgressbar {
  height: 130px;
  width: 100%;
  position: relative;
  z-index: 60;
}
.pmgressbar-hint {
  min-width: 100px;
  height: 40px;
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: flex-start;
  // flex-wrap: wrap;
  flex-direction: column;
  padding: 0 10px;
  // background: url('@/assets/images/caffeine-value.png');
  // background-size: 100% 100%;
  border-radius: 6px;
  position: absolute;
  p {
    margin: 0 !important;
    font-weight: 800;
    background: linear-gradient(283deg, #4cffdf 0%, #6676f5 62%, #c400ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}
.Brass {
  left: 0;
  border: 2px solid #d18945;
}
.Silver {
  left: 6px;
  border: 2px solid #e3f3ff;
}
.Golden {
  left: 53px;
  border: 2px solid #fbff7c;
}
.Platinum {
  left: 133px;
  border: 2px solid #6efbff;
}
.Diamond {
  right: 0;
  border: 2px solid #c495ff;
}
.pmgressbar-detail {
  width: 100%;
  height: 28px;
  margin-top: 48px;
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
      // cursor: pointer;
      // &:hover,
      // &.active {
      //   border: 2px #fff solid;
      // }
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
  margin-top: 24px;
  display: flex;
  justify-content: space-between;
}
.action-btn {
  // .farm-btn-small();
  .gradient-btn-large();
  width: 130px;
  height: 40px;
  font-size: 14px;
  font-weight: 100;
  margin-bottom: 12px;
  div {
    line-height: 38px;
  }
}
.farm-NFT-detail-Mint-Reight {
  width: 276px;
  height: 390px;
  display: flex;
  align-items: center;
  position: relative;
  .img-text {
    display: block;
    width: 190px;
    left: 43px;
    text-align: center;
    position: absolute;
    top: 258px;
    color: #fff;
  }
  > a {
    &.img-text {
      &:hover {
        text-decoration: underline;
      }
    }
  }
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
}
</style>