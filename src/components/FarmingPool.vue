<template>
  <table class="farming-pool-table">
    <tbody>
      <tr>
        <td>
          <div class="symbol-info">
            <div class="symbol-left">
              <img class="coin-before" src="@/assets/coins/usdt.png" alt="" /><img
                class="coin-after"
                src="@/assets/coins/usdc.png"
                alt=""
              />
            </div>
            <div class="symbol-text">
              <div class="symbol-name">USDT/USDC</div>
              <div class="fee-rate">Fee Rate 0.05%</div>
            </div>
          </div>
        </td>
        <td>
          <div class="td-title">APR</div>
          <div class="td-text">106.8%</div>
        </td>
        <td>
          <div class="td-title">Liquidity</div>
          <div class="td-text">$ 929.33</div>
        </td>
        <td>
          <div class="td-title">Reward Range</div>
          <div class="td-text">1 - 1.002</div>
        </td>
        <td>
          <div class="td-title">Earned</div>
          <div class="td-text">17.54 CRM</div>
        </td>
        <td>
          <button class="action-btn">Harvest all</button>
        </td>
        <td>
          <div class="open-or-close">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-icon-on"></use>
            </svg>
          </div>
        </td>
      </tr>
      <tr>
        <td class="get-lp-box">
          <div class="get-lp">
            <button class="get-lp-btn">Get LP NFT</button>
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
          <div class="td-text">52.13 CRM</div>
        </td>
        <td>
          <button class="action-btn">Stake</button>
        </td>
        <td></td>
      </tr>
      <tr>
        <td class="view-contract-box">
          <div class="view-contract">
            <button class="view-contract-btn">View Contract</button>
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
          <div class="td-text">3.09 CRM</div>
        </td>
        <td>
          <button class="action-btn">Unstake</button>
        </td>
        <td></td>
      </tr>
    </tbody>
  </table>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {}
  }
})
</script>
<style lang="less" scoped>
.farming-pool-table {
  margin-top: 20px;
  border-collapse: collapse;
  font-size: 14px;
  border-radius: 4px;
  margin-left: auto;
  margin-right: auto;
  width: 100%;

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
  }
  .get-lp-btn,
  .view-contract-btn {
    width: 100%;
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
    padding: 13px 18px;
    background: linear-gradient(233deg, #5fe6d0 0%, #596cff 38%, #9380ff 72%, #e590ff 100%);
    border-radius: 6px;
    // border: 1px solid;
  }
  .open-or-close {
    .icon {
      width: 20px;
      height: 20px;
      transform: rotate(180deg);
    }
  }
}
table tr {
  background: linear-gradient(214deg, #3e434e 0%, #23262b 100%);
  border-radius: 20px;
  border: 1px solid #565c6a;
  margin-top: 20px;
}
table tr td {
  padding: 20px;
}
table tr .get-lp-box {
  padding-bottom: 0px;
}
table tr .view-contract-box {
  padding-top: 0px;
}
</style>