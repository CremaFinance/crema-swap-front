<template>
  <div>
    <div v-for="(item, index) in tableDataArr" :key="index" class="farming-pool-table-container">
      <div
        v-if="isStaked === 'All' || isStaked === item.isStaked"
        class="farming-pool-table"
        :class="isShowTableTr == index && index == 0 ? 'is-open' : ''"
      >
        <table>
          <tbody>
            <tr>
              <td width="25%">
                <div class="symbol-info">
                  <div class="symbol-left">
                    <img class="coin-before" :src="importIcon(`/coins/${item.coinA.toLowerCase()}.png`)" alt="" /><img
                      class="coin-after"
                      :src="importIcon(`/coins/${item.coinB.toLowerCase()}.png`)"
                      alt=""
                    />
                  </div>
                  <div class="symbol-text">
                    <div class="symbol-name">{{ item.coinA }}-{{ item.coinB }}</div>
                    <div class="fee-rate">Fee Rate {{ item.feeRate }}%</div>
                  </div>
                </div>
              </td>
              <td>
                <div class="td-title">APR</div>
                <div class="td-text">{{ item.apr }}%</div>
              </td>
              <td width="15%">
                <div class="td-title">Liquidity</div>
                <div class="td-text">$ {{ item.liquidity }}</div>
              </td>
              <td width="20%">
                <div class="td-title">
                  Reward Range
                  <svg class="icon" aria-hidden="true" @click="toogleData(index, item)">
                    <use xlink:href="#icon-reward-range"></use>
                  </svg>
                </div>
                <div class="td-text">{{ item.rewardRange }}</div>
              </td>
              <td>
                <div class="td-title">Earned</div>
                <div class="td-text">
                  -- CRM
                  <img
                    v-if="index == 0"
                    src="@/assets/images/farming-earned-icon.png"
                    alt=""
                    @click="showStakeConfirm('Harvest All')"
                  />
                </div>
              </td>
              <!-- <td>
                <Button class="action-btn" @click="showStakeConfirm('Harvest')">
                  <div>Harvest all</div>
                </Button>
              </td> -->
              <td>
                <div
                  class="open-or-close"
                  :class="index !== 0 ? 'open-or-close-disabled' : ''"
                  @click="updateIsShowTableTr(index)"
                >
                  Details
                  <svg class="icon" :class="isShowTableTr == index ? 'icon-open' : ''" aria-hidden="true">
                    <use xlink:href="#icon-icon-on"></use>
                  </svg>
                </div>
              </td>
            </tr>
            <tr>
              <td class="get-lp-box" rowspan="2">
                <div class="get-lp">
                  <Button class="get-lp-btn"> <nuxt-link to="/deposit">Get LP NFT</nuxt-link></Button>
                </div>
                <div class="view-contract">
                  <Button class="view-contract-btn">View Contract</Button>
                </div>
              </td>

              <td>
                <div class="td-title">NFT ID</div>
                <div class="td-text">2</div>
              </td>
              <td>
                <div class="td-title">Liquidity</div>
                <div class="td-text">$ 1856.89</div>
              </td>
              <td>
                <div class="td-title">Price Range</div>
                <div class="td-text">1 - 1.001</div>
              </td>
              <td>
                <div class="td-title">Earned</div>
                <div class="td-text">
                  - - CRM
                  <!-- <img src="@/assets/images/farming-earned-icon.png" alt="" /> -->
                </div>
              </td>
              <td>
                <Button class="action-btn" @click="showNotify('Stake')">
                  <div>Stake - preview</div>
                </Button>
              </td>
              <!-- <td></td> -->
            </tr>
            <tr>
              <!-- <td class="view-contract-box" colspan="2"></td> -->
              <td>
                <div class="td-title">NFT ID</div>
                <div class="td-text">1</div>
              </td>
              <td>
                <div class="td-title">Liquidity</div>
                <div class="td-text">$ 1,395.27</div>
              </td>
              <td>
                <div class="td-title">Price Range</div>
                <div class="td-text">1 - 1.002</div>
              </td>
              <td>
                <div class="td-title">Earned</div>
                <div class="td-text">
                  106.01CRM<img
                    src="@/assets/images/farming-earned-icon.png"
                    alt=""
                    @click="showStakeConfirm('Harvest')"
                  />
                </div>
              </td>
              <td>
                <Button class="action-btn" @click="showNotify('Unstake')">
                  <div>Unstake - preview</div>
                </Button>
              </td>
              <!-- <td></td> -->
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <Stake v-if="showStake" :title="stakeTitle" @onClose="() => (showStake = false)"></Stake>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import importIcon from '@/utils/import-icon'
import { Button } from 'ant-design-vue'
Vue.use(Button)
export default Vue.extend({
  components: {
    Button
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
        },
        {
          symbolName: 'SOL-USDC',
          feeRate: '0.3',
          coinA: 'SOL',
          coinB: 'USDC',
          apr: '620.15',
          liquidity: '6,808,102.16',
          rewardRange: '215.4906 - 220.1256',
          rewardRangeTab: '0.004638 - 0.004936',
          earned: '- -'
        },
        {
          symbolName: 'mSOL-SOL',
          feeRate: '0.3',
          coinA: 'mSOL',
          coinB: 'SOL',
          apr: '306.12',
          liquidity: '2,588,575.18',
          rewardRangeTab: '0.9771 - 0.9901',
          rewardRange: '1.007998 - 1.008013',
          earned: '- -'
        },
        {
          symbolName: 'mSOL-USDC',
          feeRate: '0.3',
          coinA: 'mSOL',
          coinB: 'USDC',
          apr: '201.09',
          liquidity: '1,592,057.39',
          rewardRange: '219.5432 - 236.1908',
          rewardRangeTab: '0.004561 - 0.004682',
          earned: '- -'
        }
      ],
      isEewardRangeTab: -1
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
    toogleData(index: number, item: any) {
      const info = this.tableDataArr[index]
      const tempcoinA = info.coinB
      const tempcoinB = info.coinA
      const temprewardRange = info.rewardRange
      const temprewardRangeTab = info.rewardRangeTab
      // this.isEewardRangeTab = this.isEewardRangeTab == index ? -1 : index
      // const temprewardRange = info.rewardRange.split('').reverse().join('')
      const data = {
        ...info,
        coinA: tempcoinA,
        coinB: tempcoinB,
        rewardRange: temprewardRangeTab,
        rewardRangeTab: temprewardRange
        // rewardRange: temprewardRange
      }
      this.tableDataArr[index] = data
      this.$forceUpdate()
    }
  }
})
</script>
<style lang="less" scoped>
.farming-pool-table-container {
  margin-top: 20px;
  height: 100%;
  // overflow: hidden;
  // height: 91px;
}
.is-open {
  height: auto !important;
}
.farming-pool-table {
  border: 1px solid #565c6a;
  border-radius: 20px;
  height: 91px;
  overflow: hidden;
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
    margin-left: auto;
    margin-right: auto;
  }
  .symbol-info {
    display: flex;
    align-items: center;
    .symbol-left {
      img {
        width: 36px;
        height: 36px;
      }
      .coin-after {
        margin-left: -5px;
      }
      margin-right: 8px;
    }
    .symbol-text {
      font-size: 14px;
      color: #fff;
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
  .td-title {
    font-size: 12px;
    color: #b5b8c2;
    display: flex;
    align-items: center;
    .icon {
      width: 20px;
      height: 20px;
      fill: #b5b8c2;
      margin-left: 4px;
      &:hover {
        fill: #fff;
      }
    }
  }
  .td-text {
    font-size: 14px;
    font-weight: 800;
    color: #fff;
    margin-top: 10px;
    display: flex;
    // align-items: center;
    img {
      width: 20px;
      height: 20px;
      margin-left: 7px;
    }
  }
  .get-lp-btn,
  .view-contract-btn {
    width: 172px;
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
  .view-contract {
    // padding: 8px 60px 31px 20px;
    margin-top: 10px;
  }
  .view-contract-btn {
    color: rgba(#fff, 0.3);
  }
  .get-lp-btn {
    color: #fff;
    margin-bottom: 10px;
  }
  .action-btn {
    width: 140px;
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
tr {
  background: linear-gradient(214deg, #3e434e 0%, #23262b 100%);
  background-attachment: fixed; /* worked for me */
  border-radius: 20px;
  // border: 1px solid #565c6a;
  margin-top: 20px;
}
table tr:last-child {
  td {
    border: none;
  }
}
table tr td {
  padding: 20px;
  border-bottom: 1px solid #565c6a;
}
table tr .get-lp-box {
  // padding-bottom: 0px;
  border-bottom: 1px solid transparent;
  line-height: 1;
  // border-bottom: 1px solid #1c2023;
  // border-image: linear-gradient(214deg, #3e434e 0%, #23262b 60%) !important;
  // border-image-slice: 1;
  // border: none;
}
table tr .view-contract-box {
  padding-top: 0px;
  // border-bottom: 1px solid #24272d !important;
}
</style>