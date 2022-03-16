<template>
  <div class="farming-pool-card-list">
    <div v-for="(item, index) in tableDataArr" :key="index" class="farming-pool-card-box">
      <div
        v-if="isStaked === 'All' || isStaked === item.isStaked"
        class="farming-pool-card"
        :class="isShowTableTr == index && index == 0 ? 'is-open' : ''"
      >
        <div class="symbol-info">
          <div class="symbol-left">
            <img class="coin-before" :src="importIcon(`/coins/${item.coinA.toLowerCase()}.png`)" alt="" /><img
              class="coin-after"
              :src="importIcon(`/coins/${item.coinB.toLowerCase()}.png`)"
              alt=""
            />
            <div class="symbol-text">
              <div class="symbol-name">{{ item.coinA }}-{{ item.coinB }}</div>
              <div class="fee-rate">Fee Rate {{ item.feeRate }}%</div>
            </div>
          </div>
          <div class="symbol-right">
            <div
              class="open-or-close"
              :class="index !== 0 ? 'open-or-close-disabled' : ''"
            >
              <!-- Details -->
              <div @click="changeRel = !changeRel">
                <svg class="stern-icon set-dot" aria-hidden="true">
                  <use xlink:href="#icon-more"></use>
                </svg>
                
                <div v-show="changeRel" class="symbol-relation">
                  <div>
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

              </div>
              <svg class="icon" :class="isShowTableTr == index ? 'icon-open' : ''" aria-hidden="true" @click="updateIsShowTableTr(index)">
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
            <div class="trade-info-title">Reward Range</div>
            <div class="trade-info-text">{{ item.rewardRange }}</div>
          </div>
          <div class="trade-info-item">
            <div class="trade-info-title">
              Earned
              <!-- <svg class="icon" aria-hidden="true" @click="toogleData()"> -->
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-a-bianzu181"></use>
              </svg>
            </div>
            <div class="trade-info-text">20</div>
          </div>
        </div>
        <div class="get-lp">
          <Button class="action-btn">
            <div>Harvest all</div>
          </Button>
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
              <div class="trade-info-text">1 - 1.001</div>
            </div>
            <Button class="action-btn" @click="showNotify('Stake')">
              <div>Stake</div>
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
            <Button class="action-btn none-btn" @click="showNotify('UnStake')">
              <div>Unstake</div>
            </Button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="isShowHidebox" class="farming-pool-card-hide-box">
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
        <!-- <div class="symbol-right">
            Coming soon
          </div> -->
        <div class="symbol-right">Coming soon</div>
      </div>
    </div>
    <img class="farming-pool-tag" src="@/assets/images/img-Prelaunch.png" alt="" />
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
      isShowHidebox: false,
      changeRel:false,
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
      ]
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
  position: relative;
}
.farming-pool-card-list > img {
  width: 80px;
  position: absolute;
  top: -20px;
  left: -12px;
}
.farming-pool-card-box {
  margin-bottom: 40px;
  background: linear-gradient(270deg, #3e434e 0%, #292d33 100%);
  border-radius: 20px;
  border: 1px solid #3f434e;
  & + .farming-pool-card-box {
    margin-top: 20px;
  }
}
.farming-pool-card {
  padding: 22px 12px;
  height: 235px;
  width: 340px;
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
        // align-items: center;
        // justify-content: center;
        line-height: 20px;
        .icon {
          width: 14px;
          height: 14px;
          fill: #b5b8c2;
          margin:2px 0 0 6px;
        }
      }
      .trade-info-text {
        font-size: 14px;
        font-weight: 800;
        color: #fff;
        margin-top: 12px;
        display: flex;
        // justify-content: center;
        img {
          width: 16px;
          height: 16px;
        }
      }
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
  .action-btn {
    width: 100%;
    line-height: 1;
    height: 40px;
    padding: 1px;
    background: linear-gradient(180deg, #e4e2fe 0%, #2881f2 100%);
    border-radius: 6px;
    border: none;
    div {
      text-align: center;
      border-radius: 6px;
      line-height: 38px;
      font-size: 14px;
      font-weight: normal;
      color: #fff;
      background: linear-gradient(268deg, #5fe6d0 0%, #597bff 38%, #9380ff 72%, #e590ff 100%);
      &:hover {
        background: linear-gradient(270deg, #93ffed 0%, #84caff 34%, #a291ff 68%, #efb9ff 100%);
      }
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
      &:hover{
        background: #30343b;
      }
    }
  }
  .stake-and-unstake {
    margin-top: 28px;
    background: #282c33;
    border-radius: 10px;
    .stake-box {
      padding: 0 16px 40px;
      border-bottom: 1px solid rgba(#fff, 0.1);
    }
    .unstake-box {
      margin-top: 20px;
      padding-bottom: 20px;
      border: none;
    }
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
      .icon {
        width: 20px;
        height: 20px;
        // transform: rotate(180deg);
        margin-left: 8px;
        fill: #B5B8C2 !important;
        &:hover{
          fill: #fff !important;
        }
      }
      .icon-open {
        transform: rotate(180deg);
      }
      > div{
        width: 14px;
        height: 14px;
        background: #B5B8C2;
        border-radius: 50%;
        display: flex;
        position: relative;
        > svg{
          width: 14px;
          height: 14px;
        }
        .symbol-relation{
          position: absolute;
          width: 140px;
          left: -140px;
          top: 20px;
          height: 90px;
          background: rgba(#000,0.2);
          backdrop-filter: blur(10px);
          z-index: 20;
          padding: 10px;
          display: flex;
          flex-wrap: wrap;
          align-content: space-around;
          border-radius: 6px;
          > div{
            background: none;
            color: #B5B8C2;
            width: 100%;
            height: 28px;
            display: flex;
            align-items: center;
            padding-left: 8px;
            font-size: 12px;
            svg{
              margin-right: 4px;
              width: 20px;
              height: 20px;
              fill: #fff;
              cursor: pointer;
            }
            &:hover{
              background: #30343c;
            }
          }
        }
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
</style>