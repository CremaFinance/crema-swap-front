<template>
  <div>
    <div class="farming-pool-table-container">
      <div
        v-for="(item, index) in dataList"
        :key="index"
        class="farming-pool-content"
        :class="changeNFT ? 'farming-pool-hide' : ''"
      >
        <div class="farming-pool-content-Top">
          <div class="symbol-info">
            <div v-if="item.swap_key" class="symbol-left">
              <img class="coin-before" :src="getIcon(item.swap_key, 'a')" alt="" />
              <img class="coin-after" :src="getIcon(item.swap_key, 'b')" alt="" />
            </div>
            <div v-else class="symbol-left">
              <img class="coin-before" :src="importIcon(`/coins/${item.name.toLowerCase()}.png`)" />
            </div>
            <div class="symbol-text">
              <div class="symbol-name">{{ item.name }}</div>
              <!-- <div class="fee-rate">Fee Rate {{ item.fee }}%</div> -->
            </div>
          </div>
          <div style="width: 180px">
            <div class="td-title">
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
            <div class="td-text">
              {{ (aprAndTvlObj[item.mpKey] && aprAndTvlObj[item.mpKey].apr) || '--' }}
            </div>
          </div>
          <div style="width: 200px">
            <div class="td-title">Liquidity</div>
            <div class="td-text">
              {{ (aprAndTvlObj[item.mpKey] && aprAndTvlObj[item.mpKey].tvl) || '--' }}
            </div>
          </div>
          <div style="width: 240px">
            <div class="td-title">Reward Range</div>
            <div class="td-text">
              <!-- {{ getRewardRange(item.swap_key) }} -->
              {{ (rewardRange[item.mpKey] && rewardRange[item.mpKey].rewardRange) || '--' }}
            </div>
          </div>

          <div class="pool-Reward">
            <div class="td-title">Reward</div>
            <div class="td-text">
              <!-- {{ item.minPrice }} -
              {{ item.maxPrice }} -->
              <img
                v-for="qitem in item.quarries"
                :key="qitem.quarry"
                :src="importIcon(`/coins/${rewardTokenObj[qitem.reward_token_mint].name.toLowerCase()}.png`)"
                alt=""
              />
              <!-- <img src="../assets/coins/cusdc.png" alt="" /> -->
            </div>
          </div>
          <!-- <div class="pool-Finish">
            <span>Finished</span>
            <svg class="stern-icon" aria-hidden="true">
              <use xlink:href="#icon-icon-Pack-on"></use>
            </svg>
          </div> -->

          <!-- <div style="width: 130px">
            <div class="td-title">Caffeine Earned</div>
            <div v-if="farming.earningLoading" class="td-text"><Spin size="small" /></div>
            <div v-if="wallet.connected && !farming.earningLoading" class="td-text">
              {{
                (farming.earningObj &&
                  farming.earningObj[item.positionWrapperWrapMint] &&
                  farming.earningObj[item.positionWrapperWrapMint].view) ||
                '0'
              }}
            </div>

            <div v-if="!wallet.connected" class="td-text">--</div>
          </div> -->
          <!-- <div class="symbol-stern">
            <Button
              v-if="!changeNFT && !wallet.connected"
              class="action-btn btn-wind"
              @click="$accessor.wallet.openModal"
            >
              Connect Wallet
            </Button>
            <Button
              v-if="!changeNFT && wallet.connected"
              class="action-btn btn-wind"
              :loading="isClaiming && currentPool.positionWrapper === item.positionWrapper"
              :disabled="
                !farming.earningObj ||
                !farming.earningObj[item.positionWrapperWrapMint] ||
                !Number(farming.earningObj[item.positionWrapperWrapMint].value) ||
                isDisabled
              "
              @click="toClaim(item)"
              >Harvest all</Button
            >
            <Tooltip overlay-class-name="the-more-tooltip" placement="top" trigger="click">
              <div class="the-more-icon-box">
                <svg class="stern-icon set-dot" aria-hidden="true">
                  <use xlink:href="#icon-icon-Pack-Deposit"></use>
                </svg>
              </div>

              <template slot="title">
                <div class="symbol-relation">
                  <div @click="gotoLp(item)">Add Liquidity</div>
                </div>
              </template>
            </Tooltip>
            <div class="the-more-icon-box" v-if="!changeNFT && wallet && wallet.connected">
              <svg class="stern-icon" aria-hidden="true" @click="toogleData(index, item)">
                <use :xlink:href="isOpenArr[index] ? '#icon-icon-Pack-up' : '#icon-icon-Pack-on'"></use>
              </svg>
            </div>
            <img
              v-if="changeNFT && wallet && wallet.connected"
              style="width: 103px; height: 18px"
              src="../assets/images/img-Coming_soon.png"
              alt=""
            />
          </div> -->
        </div>
        <div
          v-if="!changeNFT && wallet.connected"
          :class="isOpenArr[index] ? 'change-farming farming-pool' : 'farming-pool'"
        >
          <div class="goto-add-liquidity">
            <img src="@/assets/images/farming-icon-nft.png" alt="" />
            <span @click="gotoLp(item)">Add Liquidity</span>
            <svg class="stern-icon" aria-hidden="true">
              <use xlink:href="#icon-icon-solid-right-copy"></use>
            </svg>
          </div>
          <div>
            <div class="fee-pool">
              <div v-for="qitem in item.quarries" :key="qitem.quarry" class="fee-pool-demo">
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
                  <!-- <button :disabled="isDisabled" :loading="isClaiming" @click="toClaim(item, qitem)"> -->
                  Harvest
                </button>
              </div>

              <!-- <div class="fee-pool-demo">
                <div>
                  <span>Earned(CRM)</span>
                  <div>1.1234</div>
                </div>
                <span>Harvest</span>
              </div> -->
            </div>
            <span @click="toogleData(index, item)">Stake</span>
            <div class="icon-round">
              <svg class="stern-icon" aria-hidden="true" @click="toogleData(index, item)">
                <use :xlink:href="isOpenArr[index] ? '#icon-icon-Pack-up' : '#icon-icon-Pack-on'"></use>
              </svg>
            </div>
          </div>
        </div>
        <div v-if="wallet.connected" class="farming-pool-content-Bot" :class="isOpenArr[index] ? '' : 'is-close'">
          <!-- <div class="no-positions">
            <img src="../assets/images/img-No-data-farming.png" alt="" />
            <p>No Liquidity Position</p>
          </div> -->
          <div
            v-if="
              !farmingv2.positionsObj[item.positionWrapper] || farmingv2.positionsObj[item.positionWrapper].length < 1
            "
            class="no-positions"
          >
            <img src="../assets/images/img-No-data-farming.png" alt="" />
            <p>No Liquidity Position</p>
            <!-- <p>No positions</p> -->
          </div>
          <div
            v-for="(pitem, pindex) in farmingv2.positionsObj[item.positionWrapper]"
            v-else
            :key="pindex"
            class="content-Bot-All"
          >
            <div>
              <div class="td-title">NFT</div>
              <a
                class="td-text nft-address"
                :href="`https://solscan.io/account/${pitem.nftAccountAddress}`"
                target="_blank"
                >{{ processNftAddress(pitem.nftMintAddress) }}</a
              >
            </div>
            <div>
              <div class="td-title">Liquidity</div>
              <div class="td-text">$ {{ pitem.liquityUSD }}</div>
            </div>
            <div>
              <div class="td-title">Price Range</div>
              <div class="td-text">{{ pitem.lowerPrice }} - {{ pitem.upperPrice }}</div>
            </div>
            <div class="align-right">
              <!-- <Button :class="item.isStaked == 'Unstake' ? 'un-stake' : ''" class="action-btn" @click="changeLoading()"> -->
              <Tooltip v-if="!pitem.isStaked" overlay-class-name="td-title-tooltip" placement="top">
                <div>
                  <Button
                    v-if="!pitem.isStaked"
                    :loading="isStaking && currentPosition && currentPosition.nftMintAddress === pitem.nftMintAddress"
                    :class="pitem.isStaked ? 'un-stake' : ''"
                    :disabled="!pitem.withinRange || isDisabled"
                    class="action-btn"
                    @click="toStake(item, pitem)"
                  >
                    Stake
                  </Button>
                </div>
                <template v-if="!pitem.withinRange" slot="title">
                  <div>Out of reward range</div>
                </template>
              </Tooltip>
              <div v-else class="unstake-btn-box" :class="isDisabled ? 'disabled' : ''">
                <Button
                  :loading="isUnStaking && currentPosition && currentPosition.nftMintAddress === pitem.nftMintAddress"
                  :disabled="isDisabled"
                  :class="pitem.isStaked ? 'un-stake' : ''"
                  class="action-btn"
                  @click="toUnStake(item, pitem)"
                >
                  Unstake
                </Button>
              </div>
            </div>
          </div>
          <div v-if="farmingv2.positionsLoadingObj[item.positionWrapper]" class="position-loading">
            <Spin />
          </div>
        </div>
      </div>
      <CaffeineFarmingList
        v-if="currentType === 'Ended'"
        :stake-success="stakeSuccess"
        :stake-failed="stakeFailed"
        :is-new-staking="isStaking"
        @newStake="toStake"
      ></CaffeineFarmingList>
      <div v-if="dataList.length < 1 && currentType !== 'Ended'" class="no-data">
        <img src="../assets/images/icon_NoDate@2x.png" />
        <p>No Data</p>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import mixin from '@/mixin/farmingv2'
import CaffeineFarmingList from '@/components/CaffeineFarmingList.vue'

export default Vue.extend({
  components: {
    CaffeineFarmingList
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
.td-text {
  .ant-spin-dot-item {
    background-color: rgba(255, 255, 255, 0.5);
  }
}
</style>
<style lang="less" scoped>
@import '../styles/base.less';
@import '../styles/farmingv2.less';
</style>