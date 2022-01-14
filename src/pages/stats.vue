<template>
  <div class="stats-container">
    <h3 class="title">Pools Overview</h3>
    <div class="banner-box">
      <div class="tvl-banner">
        <h3 class="title">TVL</h3>
        <p class="num">$ <span>100,111.666</span></p>
      </div>
      <div class="volume-banner">
        <h3 class="title">Volume 24H</h3>
        <p class="num">$ <span>100,111.666</span></p>
      </div>
    </div>
    <table class="data-table">
      <thead>
        <tr>
          <th>Pool Name</th>
          <th>
            <div class="middle">
              <span>TVL</span>
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-contract_chevronupbeifen"></use>
              </svg>
            </div>
          </th>
          <th>Volume (24H)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="i in 4" :key="i">
          <td>
            <img src="../assets/coins/usdt.png" />
            <img src="../assets/coins/usdc.png" />
            <span>USDT-USDC</span>
            <i>0.5%</i>
          </td>
          <td>$3,626.01m</td>
          <td>$31.01m</td>
        </tr>
      </tbody>
    </table>
    <ul class="h5-data-list">
      <li v-for="i in 4" :key="i">
        <div class="top">
          <img src="../assets/coins/usdt.png" />
          <img class="last" src="../assets/coins/usdc.png" />
          <span>USDT-USDC</span>
          <i>0.5%</i>
        </div>
        <div class="block">
          <div class="left">
            <h3>TVL</h3>
            <p>$3,626.01m</p>
          </div>
          <div class="right">
            <h3>Volume(24H)</h3>
            <p>$31.01m</p>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({})
</script>
<style lang="less" scoped>
.stats-container {
  width: 1000px;
  margin: 0 auto;
  > .title {
    font-size: 20px;
    color: #fff;
    padding: 28px 0px;
    margin-bottom: 0px;
    font-weight: 700;
  }
  .banner-box {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    > div {
      width: 490px;
      height: 178px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding-left: 37px;
      background-repeat: no-repeat;
      background-size: 100% auto;
      background-position: center center;
      &.tvl-banner {
        background-image: url('../assets/images/tvl-back.png');
      }
      &.volume-banner {
        background-image: url('../assets/images/volume-back.png');
      }
      h3 {
        font-family: 'HelveticaBlk';
        font-size: 20px;
        color: #fff;
      }
      p {
        font-family: 'HelveticaBlkObl';
        height: 24px;
        font-size: 16px;
        font-weight: 700;
        color: #fff;
        line-height: 24px;
        background: linear-gradient(267deg, #6676f5 0%, #4cffdf 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 0px;
        span {
          font-size: 28px;
          font-family: 'HelveticaBlkObl';
        }
      }
    }
  }
  .data-table {
    width: 100%;
    background: linear-gradient(214deg, #3e434e 0%, #23262b 100%);
    border-radius: 20px;
    margin-top: 20px;
    overflow: hidden;
    tr {
      &:nth-of-type(2n) {
        background: rgba(#696969, 0.1);
      }
    }
    th,
    td {
      padding-left: 40px;
      padding-right: 40px;
      height: 73px;
      font-size: 14px;
      color: #fff;
      &:last-child {
        text-align: right;
      }

      img {
        width: 36px;
        height: 36px;
        margin-right: 4px;
      }
      i {
        display: inline-block;
        width: 40px;
        height: 20px;
        line-height: 20px;
        vertical-align: middle;
        background: rgba(#07ebad, 0.1);
        border-radius: 4px;
        color: #07ebad;
        font-size: 12px;
        text-align: center;
        font-style: normal;
        margin-left: 4px;
      }
    }
    th {
      height: 55px;
      font-size: 12px;
      color: #b5b8c2;
      .middle {
        height: 55px;
        display: flex;
        align-items: center;
        svg {
          width: 16px;
          height: 16px;
          fill: #fff;
        }
      }
    }
  }
  .h5-data-list {
    display: none;
  }
}

@media screen and (max-width: 750px) {
  .stats-container {
    width: 100%;
    // padding: 0px 16px;
    > .title {
      padding: 20px 0px;
      margin-bottom: 0px;
    }
    .banner-box {
      flex-direction: column;
      > div {
        width: 100%;
        height: 125px;
        padding-left: 20px;
        &:last-child {
          margin-top: 20px;
        }
        h3 {
          font-size: 16px;
        }
        p {
          font-size: 20px;
        }
      }
    }
    .data-table {
      display: none;
    }
    .h5-data-list {
      display: block;
      width: 100%;
      background: linear-gradient(214deg, #3e434e 0%, #23262b 100%);
      border-radius: 20px;
      // border: 1px solid #565c6a;
      margin-top: 20px;
      li {
        padding: 20px;
        &:nth-of-type(2n) {
          background: rgba(#696969, 0.1);
        }
        .top {
          display: flex;
          align-items: center;
          img {
            width: 36px;
            height: 36px;
            &.last {
              margin-left: -10px;
            }
          }

          i {
            display: inline-block;
            width: 40px;
            height: 20px;
            line-height: 20px;
            vertical-align: middle;
            background: rgba(#07ebad, 0.1);
            border-radius: 4px;
            color: #07ebad;
            font-size: 12px;
            text-align: center;
            font-style: normal;
            margin-left: 8px;
          }
          span {
            font-size: 16px;
            color: #fff;
            margin-left: 8px;
          }
        }
        .block {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 20px;
          h3 {
            font-size: 12px;
            color: #b5b8c2;
          }
          p {
            font-size: 14px;
            color: #fff;
            margin-bottom: 0px;
          }
        }
      }
    }
  }
}
</style>
