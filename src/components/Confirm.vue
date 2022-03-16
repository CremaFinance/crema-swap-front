<template>
  <Modal title="Add Liquidity" centered width="430px" :visible="true" :footer="null" @cancel="$emit('onClose')">
    <!-- Add Liquidity弹框 -->
    <div class="pool-settings">
      <div class="header-file">
        <div class="file-left">
          <div class="deta-block-img">
            <!-- 52 30 -->
            <img class="img-left" src="../assets/images/icon_coins.png" alt="" />
            <img class="img-right" src="../assets/images/USDT.png" alt="" />
          </div>
          <div class="deta-block-either">
            <!-- 94 16 16 -->
            CRM / USDT
          </div>
        </div>
        <StatusBlock />
      </div>
      <div class="confirm-data-pool">
        <div class="data-pool-detailOne dataPoolAll">
          <div class="file-left">
            <div class="deta-block-img">
              <!-- 52 30 -->
              <img class="img-left" src="../assets/images/icon_coins.png" alt="" />
            </div>
            <div class="deta-block-either">CRM</div>
          </div>
          <p>26.42</p>
        </div>
        <div class="data-pool-detailTwo dataPoolAll">
          <div class="file-left">
            <div class="deta-block-img">
              <!-- 52 30 -->
              <img class="img-left" src="../assets/images/usdt@2x.png" alt="" />
            </div>
            <div class="deta-block-either">USDT</div>
          </div>
          <p>0.02423</p>
        </div>
        <div class="data-pool-detailThree dataPoolAll">
          <p>Fee Tier</p>
          <span>0.3%</span>
        </div>
      </div>
      <div class="confirm-toggle-button">
        <span>1% fee tier</span>
        <div class="range-icon">
          <div :class="nowtitle === title ? 'range-rect' : 'range-noct'" @click="nowtitle = title">{{ title }}</div>
          <div :class="nowtitle === untitle ? 'range-rect' : 'range-noct'" @click="nowtitle = untitle">
            {{ untitle }}
          </div>
        </div>
      </div>
      <!-- .message-box -->
      <div class="confirm-message-box">
        <ConfirmPopup popup-num="0.000258965" popup-name="Min Price" />
        <ConfirmPopup popup-num="0.00066479" popup-name="Max Price" />
      </div>
      <div class="confirm-matrixing">
        <p>Current price</p>
        <span>1 CRM ≈ 71.1234 USDT</span>
      </div>
      <div class="confirm-balance">
        <ConfirmLiquidity liquidity-title="Add more liquidity" liquidity-name="CRM" />
        <ConfirmLiquidity liquidity-name="USDT" />
      </div>
      <div class="confirm-add">Add</div>
    </div>
  </Modal>
</template>
<script lang="ts">
import Vue from 'vue'
import { Modal } from 'ant-design-vue'

Vue.use(Modal)

export default Vue.extend({
  components: {
    Modal
  },
  data() {
    return {
      title: 'CRM',
      untitle: 'USDT',
      nowtitle: 'CRM',
      slippageNum: '',
      slippageArr: ['0.1', '0.5', '1']
    }
  }
})
</script>
<style lang="less" scope>
.pool-settings {
  padding-bottom: 20px;
  .header-file,
  .data-pool-detailOne,
  .data-pool-detailTwo {
    height: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .file-left {
      width: 156px;
      height: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .deta-block-img {
        width: 52px;
        height: 30px;
        position: relative;
        img {
          width: 30px;
          height: 30px;
        }
        .img-left {
          position: absolute;
          left: 0;
          z-index: 5;
        }
        .img-right {
          position: absolute;
          left: 22px;
          z-index: 3;
        }
      }
      .deta-block-either {
        width: 94px;
        height: 16px;
        line-height: 16px;
        font-size: 15px;
        font-family: 'Arial Bold';
        font-weight: bold;
      }
    }
  }
  .confirm-data-pool {
    height: 147px;
    margin-top: 20px;
    background: rgba(#fff, 0.04);
    border-radius: 10px;
    padding: 10px 20px 20px;
    .data-pool-detailOne,
    .data-pool-detailTwo {
      .file-left {
        width: 81px !important;
        .deta-block-img {
          width: 30px !important;
        }
        .deta-block-either {
          width: 42px !important;
        }
      }
      p {
        margin-bottom: 0;
        font-size: 20px;
      }
    }
    .data-pool-detailTwo {
      margin: 10px 0 14px;
    }
    .data-pool-detailThree {
      height: 34px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid rgba(#fff, 0.1);
      padding-top: 5px;
      p {
        margin-bottom: 0;
        font-size: 16px;
        font-weight: bold;
      }
      span {
        font-size: 20px;
      }
    }
  }
  .confirm-toggle-button {
    height: 28px;
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .range-icon {
      display: flex;
      align-items: center;
      padding: 3px;
      border-radius: 7px;
      background: rgba(255, 255, 255, 0.1);
      width: 100px;
      height: 26px;
      font-weight: bold;
      .range-rect {
        padding: 0px 10px;
        height: 20px;
        background: linear-gradient(214deg, #59bdad 0%, #6676f5 61%, #9a89f9 76%, #eba7ff 100%);
        border-radius: 7px;
        cursor: pointer;
      }
      .range-noct {
        height: 20px;
        padding: 0px 10px;
        // background: rgba(255, 255, 255, 0.1);
        // border-radius: 4px;
        cursor: pointer;
      }
    }
    span {
      font-weight: 700;
    }
  }
  .confirm-message-box {
    height: 140px;
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
  }
  .confirm-matrixing {
    height: 16px;
    display: flex;
    margin-top: 10px;
    align-items: center;
    p {
      width: 80px;
      font-family: 'arial';
      color: rgba(#fff, 0.5);
      font-size: 12px;
      margin-bottom: 0;
    }
    span {
      font-family: 'Arial Bold';
      font-weight: bold;
      font-size: 16px;
      background: linear-gradient(to right, #59bdad, #6676f5, #9a89f9, #eba7ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
  .confirm-balance {
    height: 212px;
    margin-top: 37px;
    display: flex;
    flex-wrap: wrap;
    align-content: space-between;
  }
  .confirm-add {
    height: 56px;
    background: linear-gradient(214deg, #59bdad 0%, #6676f5 61%, #9a89f9 76%, #eba7ff 100%);
    border-radius: 15px;
    text-align: center;
    line-height: 56px;
    font-size: 20px;
    font-weight: bold;
    margin-top: 20px;
    cursor: pointer;
    font-family: 'Montserrat-Bold';
  }
}
</style>

