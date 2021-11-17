<template>
  <div class="farming-pool-card-list">
    <div class="farming-pool-card-box" v-for="(item, index) in tableDataArr" :key="index">
      <div class="farming-pool-card" :class="isShowTableTr == index && index == 0 ? 'is-open' : ''">
        <div class="symbol-info">
          <div class="symbol-left">
            <img class="coin-before" :src="importIcon(`/coins/${item.coinA.toLowerCase()}.png`)" alt="" /><img
              class="coin-after"
              :src="importIcon(`/coins/${item.coinB.toLowerCase()}.png`)"
              alt=""
            />
            <div class="symbol-text">
              <div class="symbol-name">{{ item.coinA }}/{{ item.coinB }}</div>
              <div class="fee-rate">Fee Rate {{ item.feeRate }}%</div>
            </div>
          </div>
          <div class="symbol-right">
            <div class="open-or-close" :class="index !== 0 ? 'open-or-close-disabled' : ''">
              Details
              <svg
                class="icon"
                :class="isShowTableTr == index ? 'icon-open' : ''"
                aria-hidden="true"
                @click="updateIsShowTableTr(index)"
              >
                <use xlink:href="#icon-icon-on"></use>
              </svg>
            </div>
          </div>
        </div>
        <div class="trade-info">
          <div class="trade-info-item">
            <div class="trade-info-title">APR</div>
            <div class="trade-info-text">{{ item.apr }}</div>
          </div>
          <div class="trade-info-item">
            <div class="trade-info-title">Liquidity</div>
            <div class="trade-info-text">${{ item.liquidity }}</div>
          </div>
          <div class="trade-info-item">
            <div class="trade-info-title">
              Reward Range<svg class="icon" aria-hidden="true" @click="toogleData(index)">
                <use xlink:href="#icon-reward-range"></use>
              </svg>
            </div>
            <div class="trade-info-text">{{ item.rewardRange }}</div>
          </div>
          <div class="trade-info-item">
            <div class="trade-info-title">Earned</div>
            <div class="trade-info-text">
              106.01CRM<img
                v-if="index == 0"
                @click="showStakeConfirm('Harvest')"
                src="@/assets/images/farming-earned-icon.png"
                alt=""
              />
            </div>
          </div>
        </div>
        <div class="get-lp">
          <Button class="get-lp-btn"> <nuxt-link to="/pool">Get LP NFT</nuxt-link></Button>
          <Button class="view-contract-btn">View Contract</Button>
        </div>
        <div class="stake-and-unstake">
          <div class="stake-box trade-info">
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
            <div class="trade-info-item">
              <div class="trade-info-title">Earned</div>
              <div class="trade-info-text">- - CRM</div>
            </div>
            <Button class="action-btn" @click="showNotify('Stake')">
              <div>Stake - preview</div>
            </Button>
          </div>
          <div class="stake-box trade-info unstake-box">
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
            <div class="trade-info-item">
              <div class="trade-info-title">Earned</div>
              <div class="trade-info-text">- - CRM</div>
            </div>
            <Button class="action-btn" @click="showNotify('UnStake')">
              <div>Unstake - preview</div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import importIcon from '@/utils/import-icon'
import { Button } from 'ant-design-vue'
Vue.use(Button)
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
      tableDataArr: [
        {
          symbolName: 'CUSDC/CUSDT',
          feeRate: '0.05',
          coinA: 'CUSDC',
          coinB: 'CUSDT',
          apr: '106.8',
          liquidity: '999.8',
          rewardRange: '1 - 1.002',
          earned: '17.54',
          isStaked: 'Staked'
        },
        {
          symbolName: 'SOL/USDC',
          feeRate: '0.3',
          coinA: 'SOL',
          coinB: 'USDC',
          apr: '620.15',
          liquidity: '6,808,102.16',
          rewardRange: '215.4906 - 220.1256 ',
          earned: '- -'
        },
        {
          symbolName: 'SOL/mSOL',
          feeRate: '0.3',
          coinA: 'SOL',
          coinB: 'mSOL',
          apr: '306.12',
          liquidity: '2,588,575.18',
          rewardRange: '0.9771 - 0.9901',
          earned: '- -'
        },
        {
          symbolName: 'mSOL/USDC',
          feeRate: '0.3',
          coinA: 'mSOL',
          coinB: 'USDC',
          apr: '201.09',
          liquidity: '1,592,057.39',
          rewardRange: '219.5432 - 236.1908',
          earned: '- -'
        }
      ]
    }
  },
  watch: {
    // searchKey: {
    //   immediate: true,
    //   handler: 'updateSearchKey'
    // }
  },
  methods: {
    importIcon,
    showStakeConfirm(title: string) {
      this.stakeTitle = title
      this.showStake = true
    },
    showNotify(title: string) {
      this.$notify.success({
        message: `${title} Success`,
        icon: this.$createElement('img', { class: { 'notify-icon': true }, attrs: { src: '/icon_Copied@2x.png' } }),
        description: (h: any) => h('div', [`${title} Success`])
      })
    },
    updateIsShowTableTr(index: any) {
      if (index == 0 && this.isShowTableTr != 0) {
        this.isShowTableTr = 0
      } else if (index == 0 && this.isShowTableTr == 0) {
        this.isShowTableTr = -1
      }
    },
    toogleData(index: number) {
      const info = this.tableDataArr[index]
      const tempcoinA = info.coinB
      const tempcoinB = info.coinA
      const rewardRange = info.rewardRange
      const temprewardRange = info.rewardRange.split('').reverse().join('')
      const data = {
        ...info,
        coinA: tempcoinA,
        coinB: tempcoinB,
        rewardRange: temprewardRange
      }
      this.tableDataArr[index] = data
      this.$forceUpdate()
    }
  }
})
</script>
<style lang="less" scoped>
* {
  line-height: 1;
}
.is-open {
  height: auto !important;
}
.farming-pool-card-list {
  margin-top: 27px;
}
.farming-pool-card-box {
  background: linear-gradient(270deg, #3e434e 0%, #292d33 100%);
  border-radius: 20px;
  border: 1px solid #3f434e;
  & + .farming-pool-card-box {
    margin-top: 20px;
  }
}
.farming-pool-card {
  padding: 22px 12px;
  height: 215px;
  overflow: hidden;

  .symbol-info {
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
        .icon {
          width: 20px;
          height: 20px;
          // transform: rotate(180deg);
        }
        .icon-open {
          transform: rotate(180deg);
        }
      }
      .open-or-close-disabled {
        color: #5f667c;
        .icon {
          width: 20px;
          height: 20px;
          fill: #5f667c;
          // transform: rotate(180deg);
        }
      }
    }
  }
  .trade-info {
    display: flex;
    flex-wrap: wrap;
    .trade-info-item {
      width: 50%;
      margin-bottom: 30px;
      .trade-info-title {
        font-size: 12px;
        color: #d8d8d8;
        display: flex;
        align-items: center;
        line-height: 20px;
        .icon {
          width: 20px;
          height: 20px;
          fill: #b5b8c2;
        }
      }
      .trade-info-text {
        font-size: 14px;
        font-weight: 800;
        color: #fff;
        margin-top: 12px;
        img {
          width: 16px;
          height: 16px;
        }
      }
    }
  }
  .get-lp {
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
  .stake-and-unstake {
    margin-top: 28px;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 10px;
    .stake-box {
      padding: 0 16px 40px;
      border-bottom: 1px solid rgba(#fff, 0.1);
      .action-btn {
        width: 100%;
        line-height: 1;
        height: 40px;
        padding: 1px;
        // background: linear-gradient(233deg, #5fe6d0 0%, #596cff 38%, #9380ff 72%, #e590ff 100%);
        background: linear-gradient(180deg, #e4e2fe 0%, #2881f2 100%);
        border-radius: 13px;
        border: none;
        div {
          // line-height: 1;
          text-align: center;
          border-radius: 12px;
          line-height: 38px;
          // padding: 13px 19px;
          font-size: 14px;
          font-weight: normal;
          color: #fff;
          background: linear-gradient(268deg, #5fe6d0 0%, #597bff 38%, #9380ff 72%, #e590ff 100%);
          &:hover {
            background: linear-gradient(270deg, #93ffed 0%, #84caff 34%, #a291ff 68%, #efb9ff 100%);
          }
        }
      }
    }
    .unstake-box {
      margin-top: 20px;
      padding-bottom: 20px;
      border: none;
    }
  }
}
</style>