<template>
  <div class="farming-pool-table-container">
    <div
      v-for="(item, index) in dataList"
      :key="index"
      class="farming-pool-content"
      :class="changeNFT ? 'farming-pool-hide' : ''"
    >
      <!-- <div class="caffeine-mark">
        <img src="../assets/images/icon-caffeine.png" />
        <span>Caffeine Farming</span>
      </div> -->
      <div class="farming-pool-content-Top">
        <div class="symbol-info">
          <div class="symbol-left">
            <img
              class="coin-before"
              :src="item.tokenA.icon || importIcon(`/coins/${item.tokenA.symbol.toLowerCase()}.png`)"
              alt=""
            />
            <img
              class="coin-after"
              :src="item.tokenB.icon || importIcon(`/coins/${item.tokenB.symbol.toLowerCase()}.png`)"
              alt=""
            />
          </div>
          <div class="symbol-text">
            <div class="symbol-name">{{ item.name }}</div>
          </div>
        </div>
        <div style="width: 110px">
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
            <!-- {{ (tvlDataObjNew[item.positionWrapper] && tvlDataObjNew[item.positionWrapper].aprView) || '--' }} -->
            0%
          </div>
        </div>
        <div style="width: 140px">
          <div class="td-title">Liquidity</div>
          <div class="td-text">
            {{ (tvlDataObjNew[item.positionWrapper] && tvlDataObjNew[item.positionWrapper].tvlView) || '--' }}
          </div>
        </div>
        <div style="width: 190px">
          <div class="td-title">Reward Range</div>
          <div class="td-text">
            {{ item.minPrice }} -
            {{ item.maxPrice }}
          </div>
        </div>
        <div style="width: 130px">
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
        </div>
        <div class="pool-finish">
          <Button
            v-if="!changeNFT && wallet.connected"
            :loading="isClaiming && currentPool.positionWrapper === item.positionWrapper"
            :disabled="
              !farming.earningObj ||
              !farming.earningObj[item.positionWrapperWrapMint] ||
              !Number(farming.earningObj[item.positionWrapperWrapMint].value) ||
              isDisabled
            "
            @click="toClaim(item)"
          >
            Harvest
          </Button>
          <span>Finished</span>
          <svg v-if="wallet.connected" class="stern-icon" aria-hidden="true" @click="toogleData(index, item)">
            <use :xlink:href="isOpenArr[index] ? '#icon-icon-Pack-up' : '#icon-icon-Pack-on'"></use>
          </svg>
        </div>
      </div>
      <div v-if="wallet.connected" class="farming-pool-content-Bot" :class="isOpenArr[index] ? '' : 'is-close'">
        <!-- <div class="no-positions">
            <img src="../assets/images/img-No-data-farming.png" alt="" />
            <p>No Liquidity Position</p>
          </div> -->
        <div
          v-if="!farming.positionsObj[item.positionWrapper] || farming.positionsObj[item.positionWrapper].length < 1"
          class="no-positions"
        >
          <img src="../assets/images/img-No-data-farming.png" alt="" />
          <p>No Liquidity Position</p>
          <!-- <p>No positions</p> -->
        </div>
        <div
          v-for="(pitem, pindex) in farming.positionsObj[item.positionWrapper]"
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
            <Button
              v-if="!pitem.isStaked"
              :loading="isStaking && currentPosition && currentPosition.nftMintAddress === pitem.nftMintAddress"
              :class="pitem.isStaked ? 'un-stake' : ''"
              :disabled="!pitem.withinRange || isDisabled || item.isEnded"
              class="action-btn"
              @click="toStake(item, pitem)"
            >
              <!-- <Button
              v-if="!pitem.isStaked"
              :loading="isStaking && currentPosition && currentPosition.nftMintAddress === pitem.nftMintAddress"
              :class="pitem.isStaked ? 'un-stake' : ''"
              :disabled="!pitem.withinRange || isDisabled"
              class="action-btn"
              @click="toStake(item, pitem)"
            > -->
              Stake
            </Button>
            <Button
              v-else
              :loading="isUnStaking && currentPosition && currentPosition.nftMintAddress === pitem.nftMintAddress"
              :disabled="isDisabled"
              :class="pitem.isStaked ? 'un-stake' : ''"
              class="action-btn"
              @click="openUnstake(item, pitem)"
            >
              {{ newPoolObj && newPoolObj[item.name] ? 'Migrate' : 'Unstake' }}
            </Button>
          </div>
        </div>
        <div v-if="farming.positionsLoadingObj[item.positionWrapper]" class="position-loading"><Spin /></div>
      </div>
    </div>
    <CaffeineFarmingUnstakeTips
      v-if="showUnstakeTips"
      :current-pool="currentPool"
      :current-position="currentPosition"
      :is-un-staking="isUnStaking"
      :is-new-staking="isNewStaking"
      :new-pool-info="newPoolInfo"
      :un-stake-success="unStakeSuccess"
      :un-stake-failed="unStakeFailed"
      :new-stake-success="stakeSuccess"
      :new-stake-failed="stakeFailed"
      @onClose="closeUnstakeTips"
      @onUnstake="gotoUnstake"
      @onNewStake="toNewStake"
    ></CaffeineFarmingUnstakeTips>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import mixin from '@/mixin/farming'
import farmingPage from '@/mixin/farmingPage'

export default Vue.extend({
  mixins: [farmingPage, mixin]
})
</script>
<style lang="less" scoped>
@import '../styles/base.less';
@import '../styles/farmingv2.less';

.farming-pool-content {
  // position: relative;
  // overflow: visible;
  .caffeine-mark {
    width: 152px;
    height: 32px;
    background: #2a2a3b;
    border-radius: 8px 8px 8px 0px;
    border: 1px solid #362d72;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    left: 16px;
    top: -16px;
    img {
      width: 28px;
      height: 28px;
    }
    span {
      font-size: 12px;
      font-family: ArialMT;
      color: #997de2;
    }
  }
}
.farming-pool-content-Top {
  .symbol-info {
    width: 200px;
  }
  .pool-finish {
    width: 200px;
    justify-content: flex-end;
    button {
      // margin-left: 16px;
      font-weight: bold;
      border: none;
      background: linear-gradient(48deg, #d032ff 0%, #8ab6ff 40%, #4ce1ff 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      cursor: pointer;
      &:disabled {
        cursor: not-allowed;
        background: none;
        color: #7a7a7a;
        // -webkit-background-clip:
        -webkit-text-fill-color: #7a7a7a;
      }
    }
    svg {
      margin-left: 12px;
    }
  }
}
</style>