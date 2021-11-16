<template>
  <div>
    <div class="farming-pool-table-container" v-for="(item, index) in tableDataArr" :key="index">
      <div
        class="farming-pool-table"
        :class="isShowTableTr == index ? 'is-open' : ''"
        v-if="isStaked === 'All' || isStaked === item.isStaked"
      >
        <table>
          <tbody>
            <tr>
              <td>
                <div class="symbol-info">
                  <div class="symbol-left">
                    <img class="coin-before" :src="importIcon(`/coins/${item.coinA.toLowerCase()}.png`)" alt="" /><img
                      class="coin-after"
                      :src="importIcon(`/coins/${item.coinB.toLowerCase()}.png`)"
                      alt=""
                    />
                  </div>
                  <div class="symbol-text">
                    <div class="symbol-name">{{ item.symbolName }}</div>
                    <div class="fee-rate">Fee Rate {{ item.feeRate }}</div>
                  </div>
                </div>
              </td>
              <td>
                <div class="td-title">APR</div>
                <div class="td-text">{{ item.apr }}%</div>
              </td>
              <td>
                <div class="td-title">Liquidity</div>
                <div class="td-text">$ {{ item.liquidity }}</div>
              </td>
              <td>
                <div class="td-title">Reward Range</div>
                <div class="td-text">{{ item.rewardRange }}</div>
              </td>
              <td>
                <div class="td-title">Earned</div>
                <div class="td-text">
                  {{ item.earned }} CRM <img src="@/assets/images/farming-earned-icon.png" alt="" />
                </div>
              </td>
              <td>
                <Button class="action-btn" @click="showStakeConfirm('Harvest')">Harvest all</Button>
              </td>
              <td>
                <div class="open-or-close">
                  <svg
                    class="icon"
                    :class="isShowTableTr == index ? 'icon-open' : ''"
                    aria-hidden="true"
                    @click="isShowTableTr !== index ? (isShowTableTr = index) : (isShowTableTr = -1)"
                  >
                    <use xlink:href="#icon-icon-on"></use>
                  </svg>
                </div>
              </td>
            </tr>
            <tr>
              <td class="get-lp-box">
                <div class="get-lp">
                  <Button class="get-lp-btn">Get LP NFT{{ isShowTableTr }}{{ index }}</Button>
                </div>
              </td>
              <td>
                <div class="td-title">NFT id</div>
                <div class="td-text">1</div>
              </td>
              <td>
                <div class="td-title">Liquidity</div>
                <div class="td-text">$ 856.89</div>
              </td>
              <td>
                <div class="td-title">Price Range</div>
                <div class="td-text">1 - 1.002</div>
              </td>
              <td>
                <div class="td-title">Earned</div>
                <div class="td-text">52.13 CRM<img src="@/assets/images/farming-earned-icon.png" alt="" /></div>
              </td>
              <td>
                <Button class="action-btn" @click="showStakeConfirm('Stake')">Stake</Button>
              </td>
              <td></td>
            </tr>
            <tr>
              <td class="view-contract-box">
                <div class="view-contract">
                  <Button class="view-contract-btn">View Contract</Button>
                </div>
              </td>
              <td>
                <div class="td-title">NFT id</div>
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
                <div class="td-text">3.09 <img src="@/assets/images/farming-earned-icon.png" alt="" /></div>
              </td>
              <td>
                <Button class="action-btn" @click="showStakeConfirm('UnStake')">Unstake</Button>
              </td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <Stake :title="stakeTitle" v-if="showStake" @onClose="() => (showStake = false)"></Stake>
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
      default: 'Staked'
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
          symbolName: 'USDT/USDC',
          feeRate: '0.05',
          coinA: 'USDT',
          coinB: 'USDC',
          apr: '106.8',
          liquidity: '999.8',
          rewardRange: '1 - 1.002',
          earned: '17.54',
          isStaked: 'Staked'
        },
        {
          symbolName: 'USDT/WSOL',
          feeRate: '0.05',
          coinA: 'USDT',
          coinB: 'WSOL',
          apr: '106.8',
          liquidity: '999.8',
          rewardRange: '1 - 1.002',
          earned: '17.54'
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
    color: #5f667c;
  }
  .td-text {
    font-size: 14px;
    font-weight: 800;
    color: #fff;
    margin-top: 10px;
    display: flex;
    align-items: center;
    img {
      width: 20px;
      height: 20px;
      margin-left: 7px;
    }
  }
  .get-lp-btn,
  .view-contract-btn {
    width: 100%;
    height: auto;
    display: inline-block;
    padding: 13px 48px;
    background: linear-gradient(270deg, #3e434e 0%, #282a2f 100%);
    border-radius: 8px;
    border: 1px solid #3f434e;
    line-height: 1;
  }
  .view-contract {
    // padding: 8px 60px 31px 20px;
  }
  .action-btn {
    width: 108px;
    line-height: 1;
    height: auto;
    padding: 13px 18px;
    background: linear-gradient(233deg, #5fe6d0 0%, #596cff 38%, #9380ff 72%, #e590ff 100%);
    border-radius: 6px;
    // border: 1px solid;
  }
  .open-or-close {
    .icon {
      width: 20px;
      height: 20px;
      // transform: rotate(180deg);
    }
    .icon-open {
      transform: rotate(180deg);
    }
  }
}
tr {
  background: linear-gradient(214deg, #3e434e 0%, #23262b 100%);
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
  padding-bottom: 0px;
  border-bottom: 1px solid #24272d !important;
}
table tr .view-contract-box {
  padding-top: 0px;
  // border-bottom: 1px solid #24272d !important;
}
</style>