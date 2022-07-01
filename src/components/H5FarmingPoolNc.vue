<template>
  <div class="farming-pool-card-list">
    <div v-for="(item, index) in dataList" :key="index" class="farming-pool-card-box">
      <div class="farming-pool-card" :class="isOpenArr[index] ? 'is-open' : ''">
        <div class="symbol-info">
          <div class="symbol-left">
            <img class="coin-before" :src="getIcon(item.swap_key, 'a')" alt="" /><img
              class="coin-after"
              :src="getIcon(item.swap_key, 'b')"
              alt=""
            />
            <div class="symbol-text">
              <div class="symbol-name">{{ item.name }}</div>
              <!-- <div class="fee-rate">Fee Rate {{ item.fee }}%</div> -->
            </div>
          </div>
          <div class="symbol-right">
            <div class="open-or-close" :class="index !== 0 ? 'open-or-close-disabled' : ''">
              <!-- <div @mouseenter="changeRel = !changeRel" @mouseleave="changeRel = !changeRel">
                <svg class="stern-icon set-dot" aria-hidden="true">
                  <use xlink:href="#icon-more"></use>
                </svg>

                <div v-show="changeRel" class="symbol-relation">
                  <div @click="gotoLp(item)">
                    <svg aria-hidden="true">
                      <use xlink:href="#icon-icon-Get-NFT"></use>
                    </svg>
                    Get LP NFT
                  </div>
                  <div>
                    <svg aria-hidden="true">
                      <use xlink:href="#icon-icon-Show-Contract"></use>
                    </svg>
                    Show Contract
                  </div>
                </div>
              </div> -->

              <!-- <Tooltip overlay-class-name="the-more-tooltip" placement="top">
                <div class="the-more-icon-box">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-icon-Pack-Deposit"></use>
                  </svg>
                </div>

                <template slot="title">
                  <div class="symbol-relation" @click="gotoLp(item)">
                    <div>Add Liquidity</div>
                  </div>
                </template>
              </Tooltip> -->

              <!-- <div
                v-if="!changeNFT && wallet && wallet.connected"
                class="toggle-icon-box"
                @click="toogleData(index, item)"
              >
                <svg class="icon" aria-hidden="true">
                  <use :xlink:href="isOpenArr[index] ? '#icon-icon-Pack-up' : '#icon-icon-Pack-on'"></use>
                </svg>
              </div> -->

              <!-- <svg class="stern-icon" aria-hidden="true" @click="toogleData()">
                <use :xlink:href="isOpen ? '#icon-icon-Pack-on' : '#icon-icon-Pack-up'"></use>
              </svg> -->
            </div>
          </div>
        </div>
        <div class="trade-info">
          <div class="trade-info-item">
            <div class="trade-info-title">
              <span>APR</span>
              <Tooltip overlay-class-name="td-title-tooltip" placement="top">
                <div>
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-a-bianzu181"></use>
                  </svg>
                </div>
                <template slot="title">
                  <div>Only the effective liquidity within the reward range is taken into account.</div>
                </template>
              </Tooltip>
            </div>
            <div class="trade-info-text">
              {{ (aprAndTvlObj[item.mpKey] && aprAndTvlObj[item.mpKey].aprView) || '--' }}
            </div>
          </div>
          <div class="trade-info-item">
            <div class="trade-info-title">Liquidity</div>
            <div class="trade-info-text">
              {{ (aprAndTvlObj[item.mpKey] && aprAndTvlObj[item.mpKey].tvlView) || '--' }}
            </div>
          </div>
          <div class="trade-info-item">
            <div class="trade-info-title">Reward Range</div>
            <div class="trade-info-text">
              <!-- {{ getRewardRange(item.swap_key) }} -->
              {{ (rewardRange[item.mpKey] && rewardRange[item.mpKey].rewardRange) || '--' }}
            </div>
          </div>
          <div class="trade-info-item">
            <div class="trade-info-title">Reward</div>
            <div class="trade-info-text" style="margin-top: 8px">
              <!-- <img
                v-for="qitem in item.quarries"
                :key="qitem.quarry"
                :src="importIcon(`/coins/${rewardTokenObj[qitem.reward_token_mint].name.toLowerCase()}.png`)"
                alt=""
              /> -->
              <Tooltip
                v-for="qitem in item.quarries"
                :key="qitem.quarry"
                overlay-class-name="reward-coin-tooltip"
                placement="top"
              >
                <img
                  :src="importIcon(`/coins/${rewardTokenObj[qitem.reward_token_mint].name.toLowerCase()}.png`)"
                  alt=""
                />
                <template slot="title">{{ rewardTokenObj[qitem.reward_token_mint].name.toUpperCase() }}</template>
              </Tooltip>
              <!-- {{
                (farming.earningObj &&
                  farming.earningObj[item.positionWrapperWrapMint] &&
                  farming.earningObj[item.positionWrapperWrapMint].view) ||
                '0'
              }} -->
            </div>
          </div>
        </div>
        <div v-if="!changeNFT && wallet.connected" class="h5-farming-pool">
          <div class="h5-farming-top">
            <div>
              <img src="@/assets/images/farming-icon-nft.png" alt="" />
              <span @click="gotoLp(item)">Add Liquidity</span>
              <svg class="stern-icon" aria-hidden="true">
                <use xlink:href="#icon-icon-solid-right-copy"></use>
              </svg>
            </div>
            <div>
              <span>Stake</span>
              <div class="icon-round">
                <svg class="stern-icon" aria-hidden="true" @click="toogleData(index, item)">
                  <use :xlink:href="isOpenArr[index] ? '#icon-icon-Pack-up' : '#icon-icon-Pack-on'"></use>
                </svg>
              </div>
            </div>
          </div>
          <div v-for="qitem in item.quarries" :key="qitem.quarry" class="harvest-btn-box">
            <div class="harvest-btn">
              <div>
                <span>{{ rewardTokenObj[qitem.reward_token_mint].name }} Earned</span>
                <div v-if="farmingv2.rewardsLoading"><Spin size="small" /></div>
                <div v-else>{{ getRewardNumber(item, qitem, farmingv2.rewardsObj) }}</div>
              </div>
              <button
                :disabled="getRewardNumber(item, qitem, farmingv2.rewardsObj) === '0' || isDisabled"
                :loading="isClaiming"
                @click="toClaim(item, qitem)"
              >
                Harvest
              </button>
            </div>
          </div>
        </div>
        <!-- <div class="get-lp">
          <Button v-if="!wallet.connected" @click="$accessor.wallet.openModal">Connect Wallet</Button>
          <Button
            v-else
            class="action-btn"
            :loading="isClaiming"
            :disabled="
              !farming.earningObj ||
              !farming.earningObj[item.positionWrapperWrapMint] ||
              !Number(farming.earningObj[item.positionWrapperWrapMint].value) ||
              isDisabled
            "
            @click="toClaim(item)"
          >
            Harvest all
          </Button>
        </div> -->
        <div v-if="wallet.connected" class="stake-and-unstake" :class="isOpenArr[index] ? '' : 'is-close'">
          <div
            v-if="
              !farmingv2.positionsObj[item.positionWrapper] || farmingv2.positionsObj[item.positionWrapper].length < 1
            "
            class="no-positions"
          >
            <p>No positions</p>
            <!-- <Button class="action-btn" @click="gotoLp(item)">Add Liquidity</Button> -->
          </div>
          <div
            v-for="(pitem, pindex) in farmingv2.positionsObj[item.positionWrapper]"
            v-else
            :key="pindex"
            class="stake-box trade-info"
          >
            <div class="trade-info-item">
              <div class="trade-info-title">NFT</div>
              <div class="trade-info-text">
                <a
                  class="td-text"
                  :href="`https://solscan.io/account/${pitem.nftAccountAddress}`"
                  target="_blank"
                  style="color: #fff"
                  >{{ processNftAddress(pitem.nftMintAddress) }}</a
                >
              </div>
            </div>
            <div class="trade-info-item">
              <div class="trade-info-title">Liquidity</div>
              <div class="trade-info-text">$ {{ pitem.liquityUSD }}</div>
            </div>
            <div class="trade-info-item">
              <div class="trade-info-title">Price Range</div>
              <div class="trade-info-text">{{ pitem.lowerPrice }} - {{ pitem.upperPrice }}</div>
            </div>
            <div v-if="!pitem.isStaked" class="trade-info-item">
              <div class="action-btn-box stake-btn-box" :class="!pitem.withinRange || isDisabled ? 'disabled' : ''">
                <Button
                  class="action-btn"
                  :disabled="!pitem.withinRange || isDisabled"
                  :loading="isStaking && currentPosition && currentPosition.nftMintAddress === pitem.nftMintAddress"
                  @click="toStake(item, pitem)"
                >
                  <!-- <div>Stake</div> -->
                  Stake
                </Button>
              </div>
            </div>
            <div v-else class="trade-info-item">
              <div class="action-btn-box unstake-btn-box">
                <Button
                  class="action-btn none-btn"
                  :loading="isUnStaking && currentPosition && currentPosition.nftMintAddress === pitem.nftMintAddress"
                  :class="pitem.isStaked ? 'un-stake' : ''"
                  :disabled="isDisabled"
                  @click="toUnStake(item, pitem)"
                >
                  <!-- <div>Unstake</div> -->
                  Unstake
                </Button>
              </div>
            </div>
          </div>
          <div v-if="farmingv2.positionsLoadingObj[item.positionWrapper]" class="position-loading"><Spin /></div>
          <!-- <div class="stake-box trade-info unstake-box">
            <div class="trade-info-item">
              <div class="trade-info-title">NFT ID</div>
              <div class="trade-info-text">2</div>
            </div>
            <div class="trade-info-item">
              <div class="trade-info-title">Liquidity</div>
              <div class="trade-info-text">$ 1856.89</div>
            </div>
            <div class="trade-info-item">
              <div class="trade-info-title">Price Range</div>
              <div class="trade-info-text">0.999 - 1.001</div>
            </div>
            <Button class="action-btn none-btn" @click="showNotify('UnStake')">
              <div>Unstake</div>
            </Button>
          </div> -->
        </div>
      </div>
    </div>
    <CaffeineFarmingListH5
      v-if="currentType === 'Ended'"
      :stake-success="stakeSuccess"
      :stake-failed="stakeFailed"
      :is-new-staking="isStaking"
      @newStake="toStake"
    ></CaffeineFarmingListH5>
    <div v-if="dataList.length < 1 && currentType !== 'Ended'" class="no-data">
      <img src="../assets/images/icon_NoDate@2x.png" />
      <p>No Data</p>
    </div>
    <!-- <div v-if="isShowHidebox" class="farming-pool-card-hide-box">
      <div class="symbol-info">
        <div class="symbol-left">
          <img class="coin-before" src="../assets/coins/cusdt.png" alt="" /><img
            class="coin-after"
            src="../assets/coins/cusdc.png"
            alt=""
          />
          <div class="symbol-text">
            <div class="symbol-name">CUSDC / CUSDT</div>
            <div class="fee-rate">Fee Rate 0.05 %</div>
          </div>
        </div>
        <div class="symbol-right">
            Coming soon
          </div>
        <div class="symbol-right">Coming soon</div>
      </div>
    </div> -->
    <!-- <img class="farming-pool-tag" src="@/assets/images/img-Prelaunch.png" alt="" /> -->
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import mixin from '@/mixin/farmingv2'
import CaffeineFarmingListH5 from '@/components/CaffeineFarmingListH5.vue'
export default Vue.extend({
  components: {
    CaffeineFarmingListH5
  },
  mixins: [mixin]
})
</script>

<style lang="less">
.the-more-tooltip {
  .ant-tooltip-inner {
    padding: 0px !important;
    background: rgba(#000, 0) !important;
  }
  .ant-tooltip-arrow {
    &::before {
      background: rgba(#000, 0) !important;
    }
  }
}

.td-title-tooltip {
  .ant-tooltip-inner {
    background: rgba(#000, 0.2) !important;
    backdrop-filter: blur(10px);
  }
  .ant-tooltip-arrow {
    &::before {
      background: rgba(#000, 0) !important;
    }
  }
}
.reward-coin-tooltip {
  .ant-tooltip-inner {
    padding: 5px 12px !important;
    font-size: 12px;
  }
}
</style>
<style lang="less" scoped>
@import '../styles/base.less';
* {
  line-height: 1;
}
.is-open {
  height: auto !important;
}
.farming-pool-card-list {
  // margin-top: 27px;
  position: relative;
  padding-bottom: 50px;
  .no-data {
    width: 100%;
    min-height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    img {
      width: 80px;
      height: 80px;
    }
    p {
      color: rgba(255, 255, 255, 0.8);
      padding-top: 10px;
    }
  }
}
.farming-pool-card-list > img {
  width: 80px;
  position: absolute;
  top: -20px;
  left: -12px;
}
.farming-pool-card-box {
  margin-bottom: 20px;
  background: linear-gradient(270deg, #3e434e 0%, #292d33 100%);
  border-radius: 20px;
  border: 1px solid #3f434e;
  & + .farming-pool-card-box {
    margin-top: 20px;
  }
  &:last-child {
    margin-bottom: 0px;
  }
}
.stern-icon {
  width: 16px;
  height: 16px;
  fill: #b5b8c2;
  cursor: pointer;
  &:hover {
    fill: #fff;
  }
}
.farming-pool-card {
  padding: 22px 12px;
  // height: 235px;
  overflow: hidden;
  .trade-info {
    padding: 0 16px;
    display: flex;
    flex-wrap: wrap;
    .trade-info-item {
      width: 50%;
      margin: 15px 0;
      .trade-info-title {
        font-size: 12px;
        color: #d8d8d8;
        display: flex;
        align-items: center;
        // justify-content: center;
        line-height: 20px;
        .icon {
          width: 14px;
          height: 14px;
          fill: #b5b8c2;
          margin: 2px 0 0 6px;
        }
      }
      .trade-info-text {
        font-size: 14px;
        font-weight: 800;
        color: #fff;
        margin-top: 12px;
        display: flex;
        // justify-content: center;
        // img {
        //   width: 16px;
        //   height: 16px;
        // }
        // justify-content: flex-end;
        img {
          width: 20px;
          height: 20px;
          margin-left: 0;
          &:not(:first-child) {
            margin-left: -5px;
          }
        }
      }
    }
  }
  .h5-farming-pool {
    width: 100%;
    // height: 400px;
    background: linear-gradient(270deg, #1a1a2b 0%, #2f3446 100%);
    border-radius: 10px;
    padding: 20px 10px;
    .h5-farming-top {
      display: flex;
      justify-content: space-between;
      > div {
        font-size: 12px;
        display: flex;
        align-items: center;
        img {
          width: 20px;
          height: 20px;
        }
        > span {
          margin: 0 6px;
          cursor: pointer;
        }
      }
    }
    .harvest-btn-box {
      margin: 20px auto 0;
      width: 220px;
      height: 44px;
      border-radius: 10px;
      // border: 1px solid #ac85ff;

      background: linear-gradient(90deg, rgba(172, 133, 255, 1), rgba(93, 181, 226, 1));
      padding: 2px;
      .harvest-btn {
        width: 100%;
        height: 100%;
        padding: 2px 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #2f3446;
        border-radius: 10px;
        > button {
          margin-left: 16px;
          font-weight: bold;
          background: linear-gradient(48deg, #d032ff 0%, #8ab6ff 40%, #4ce1ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          &:disabled {
            cursor: not-allowed;
            background: none;
            color: #7a7a7a;
            // -webkit-background-clip:
            -webkit-text-fill-color: #7a7a7a;
          }
        }
        span {
          font-size: 12px;
          color: #b5b8c2;
          line-height: 20px;
        }

        > div {
          font-size: 12px;
          line-height: 20px;
        }
      }
      // color: #30343c;
    }
  }
  .get-lp {
    margin-top: 20px;
    padding: 0 16px;
    display: flex;
    justify-content: space-between;
    a {
      color: #fff;
    }
    .get-lp-btn,
    .view-contract-btn {
      width: 136px;
      height: auto;
      display: inline-block;
      padding: 13px 0;
      text-align: center;
      background: linear-gradient(270deg, #3e434e 0%, #282a2f 100%);
      border-radius: 8px;
      border: 1px solid #3f434e;
      line-height: 1;
      font-size: 14px;
      font-family: Arial-BoldMT, Arial;
      font-weight: normal;
    }
  }
  .action-btn-box {
    width: 93px;
    height: 32px;
    padding: 2px;
    background: linear-gradient(90deg, rgba(183, 98, 255, 1), rgba(93, 193, 221, 1));
    border-radius: 8px;
    margin-top: 10px;
    &.disabled {
      background: none;
    }
    &.stake-btn-box {
      padding: 0px;
    }
    &.unstake-btn-box {
      .action-btn {
        border: none;
      }
    }
  }
  .action-btn {
    .gradient-btn-large();
    width: 100%;
    line-height: 1;
    height: 100%;
    padding: 1px;
    font-size: 12px;
    font-weight: normal;
    // border: none;
  }
  .un-stake {
    box-sizing: border-box;
    padding: 1px;
    background: #282c33 !important;
    &:hover {
      background: #34383e !important;
    }
  }
  .none-btn {
    box-sizing: border-box;
    padding: 2px;
    border-radius: 6px;
    background-image: -webkit-linear-gradient(top, #5fe6d0 0%, #597bff 38%, #9380ff 72%, #e590ff 100%);
    div {
      width: 100%;
      height: 100%;
      border-radius: 6px;
      background: #282c33;
      &:hover {
        background: #30343b;
      }
    }
  }
  .stake-and-unstake {
    margin-top: 28px;
    // background: #282c33;
    border-radius: 10px;
    .stake-box {
      padding: 20px;
      border-bottom: 1px solid rgba(#fff, 0.1);
      &:last-child {
        border-bottom: none;
      }
    }
    .unstake-box {
      margin-top: 20px;
      padding-bottom: 20px;
      border: none;
    }
  }
  .is-close {
    display: none !important;
  }
}
.symbol-info {
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  .symbol-left {
    display: flex;
    align-items: center;
    img {
      width: 36px;
      height: 36px;
    }
    .coin-after {
      margin-left: -5px;
    }
    margin-right: 8px;
    .symbol-text {
      font-size: 14px;
      color: #fff;
      margin-left: 12px;
    }
    .fee-rate {
      padding: 4px 7px;
      border-radius: 4px;
      background: rgba(#07ebad, 0.1);
      font-size: 12px;
      color: #07ebad;
      margin-top: 4px;
      line-height: 1;
    }
  }
  .symbol-right {
    .open-or-close {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      .toggle-icon-box,
      .the-more-icon-box {
        background: none !important;
        width: 16px;
        height: 16px;
        border: 1px solid #b5b8c2;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 8px;
      }
    }
    .open-or-close-disabled {
      color: #5f667c;
      .icon {
        width: 20px;
        height: 20px;
        fill: #5f667c;
      }
    }
  }
}
.symbol-relation {
  // position: absolute;
  // width: 140px;
  // left: -20px;
  // height: 90px;
  background: rgba(#000, 0.2);
  backdrop-filter: blur(10px);
  z-index: 20;
  padding: 6px 10px;
  display: flex;
  flex-wrap: wrap;
  align-content: space-around;
  border-radius: 10px;
  > div {
    background: none;
    color: #b5b8c2;
    width: 100%;
    height: 28px;
    display: flex;
    align-items: center;
    // padding-left: 8px;
    font-size: 12px;
    border-radius: 10px;
    cursor: pointer;
    svg {
      margin-right: 4px;
      width: 20px;
      height: 20px;
      fill: #fff;
      cursor: pointer;
    }
    // &:hover {
    //   background: #30343c;
    // }
  }
}
.farming-pool-card-hide-box {
  width: 340px;
  background: linear-gradient(270deg, #3e434e 0%, #292d33 100%);
  border-radius: 20px;
  border: 1px solid #3f434e;
  & + .farming-pool-card-hide-box {
    margin-top: 20px;
  }
  .symbol-info {
    margin: 10px;
    padding: 0 10px;
  }
  .symbol-info .symbol-right {
    height: 16px;
    background: linear-gradient(233deg, #4bb5ff 0%, #ce90ff 100%);
    -webkit-background-clip: text;
    color: transparent;
    font-family: 'Arial-BoldMT', Arial;
  }
}

.no-positions {
  height: 100px !important;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  button {
    height: 40px;
    width: 150px !important;
  }
}

.position-loading {
  height: auto !important;
  min-height: 100px;
  position: absolute;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  border-radius: 20px;
}
</style>
