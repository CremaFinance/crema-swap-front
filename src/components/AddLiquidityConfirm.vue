<template>
  <div>
    <Modal
      class="add-liquidity-confirm"
      width="492px"
      :visible="true"
      centered
      :closable="false"
      :header="null"
      :footer="null"
      @cancel="$emit('onClose')"
    >
      <!-- <template slot="closeIcon">
        <svg class="icon" aria-hidden="true" @click="showSetting = true">
          <use xlink:href="#icon-a-bianzu81"></use>
        </svg>
      </template> -->
      <div class="add-liquidity-modal">
        <div class="modal-header">
          <div class="modal-header-left">
            <svg class="icon" aria-hidden="true" @click="$emit('onClose')" v-if="title == 'Increase Liquidity'">
              <use xlink:href="#icon-icon-return"></use>
            </svg>
            {{ title }}
          </div>
          <div class="modal-header-right">
            <svg class="icon" aria-hidden="true" @click="showSetting = true" v-if="title == 'Increase Liquidity'">
              <use xlink:href="#icon-a-bianzu81"></use>
            </svg>
            <svg class="icon" v-else aria-hidden="true" @click="$emit('onClose')">
              <use xlink:href="#icon-icon-close"></use>
            </svg>
          </div>
        </div>
        <div class="top">
          <div class="coin-pair">
            <img :src="importIcon(`/coins/${secondConfirmData.fromCoin.symbol.toLowerCase()}.png`)" />
            <img :src="importIcon(`/coins/${secondConfirmData.toCoin.symbol.toLowerCase()}.png`)" />
            <span>{{ secondConfirmData.fromCoin.symbol }} / {{ secondConfirmData.toCoin.symbol }}</span>
          </div>
          <div v-if="secondConfirmData.currentStatus === 'Closed'" class="status">Closed</div>
          <div v-else-if="secondConfirmData.currentStatus === 'Active'" class="status">
            <i></i>
            <span>Active</span>
          </div>
          <div v-else class="status">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-icon-tips"></use>
            </svg>
            <span>InActive</span>
          </div>
        </div>
        <div class="info">
          <div v-if="!secondConfirmData.showFromCoinLock" class="coin-info-block">
            <div class="left">
              <img :src="importIcon(`/coins/${secondConfirmData.fromCoin.symbol.toLowerCase()}.png`)" />
              <span>{{ secondConfirmData.fromCoin.symbol }}</span>
            </div>
            <div class="right">{{ secondConfirmData.fromCoinAmount }}</div>
          </div>
          <div v-if="!secondConfirmData.showToCoinLock" class="coin-info-block">
            <div class="left">
              <img :src="importIcon(`/coins/${secondConfirmData.toCoin.symbol.toLowerCase()}.png`)" />
              <span>{{ secondConfirmData.toCoin.symbol }}</span>
            </div>
            <div class="right">{{ secondConfirmData.toCoinAmount }}</div>
          </div>
          <div class="fee-tier-block">
            <span>Fee Tier</span>
            <span>{{ secondConfirmData.feeTier }}</span>
          </div>
        </div>
        <div class="range-box">
          <div class="range-title">
            <h3>Selected Range</h3>
            <div class="coin-tab">
              <span :class="direct ? 'active' : ''" @click="changeDirect(true)">{{
                secondConfirmData.fromCoin.symbol
              }}</span>
              <span :class="!direct ? 'active' : ''" @click="changeDirect(false)">{{
                secondConfirmData.toCoin.symbol
              }}</span>
            </div>
          </div>
          <div class="price-range-block">
            <div class="price-item">
              <div class="title">Min Price</div>
              <p class="price">{{ secondConfirmData.minPrice }}</p>
              <div class="text" v-if="direct">
                {{ secondConfirmData.fromCoin.symbol }} per {{ secondConfirmData.toCoin.symbol }}
              </div>
              <div class="text" v-else>
                {{ secondConfirmData.toCoin.symbol }} per {{ secondConfirmData.fromCoin.symbol }}
              </div>
              <div class="note">
                Your position will be 100% composed of {{ secondConfirmData.fromCoin.symbol }} at this price
              </div>
            </div>
            <div class="price-item">
              <div class="title">Max Price</div>
              <p class="price">{{ secondConfirmData.maxPrice }}</p>
              <div class="text" v-if="!direct">
                {{ secondConfirmData.fromCoin.symbol }} per {{ secondConfirmData.toCoin.symbol }}
              </div>
              <div class="text" v-else>
                {{ secondConfirmData.toCoin.symbol }} per {{ secondConfirmData.fromCoin.symbol }}
              </div>
              <div class="note">
                Your position will be 100% composed of {{ secondConfirmData.toCoin.symbol }} at this price
              </div>
            </div>
          </div>
        </div>
        <div class="current-price">
          <span>Current price</span>
          <div v-if="direct">
            1 {{ secondConfirmData.fromCoin.symbol }} ≈
            {{ fixD(secondConfirmData.currentPrice, secondConfirmData.toCoin.decimals) }}
            {{ secondConfirmData.toCoin.symbol }}
          </div>
          <div v-else>
            1 {{ secondConfirmData.toCoin.symbol }} ≈
            {{ fixD(1 / secondConfirmData.currentPrice, secondConfirmData.toCoin.decimals) }}
            {{ secondConfirmData.fromCoin.symbol }}
          </div>
        </div>

        <!-- <div class="add-form">

      </div> -->
        <div v-if="title !== 'Add Liquidity'" class="add-liquidity-form-box">
          <AddLiquidityForm
            :default-from-coin="secondConfirmData.fromCoin"
            :default-to-coin="secondConfirmData.toCoin"
            :show-from-coin-lock="secondConfirmData.showFromCoinLock"
            :show-to-coin-lock="secondConfirmData.showToCoinLock"
            :current-data="secondConfirmData"
            @onChange="addFormChanged"
            @onChangeInsufficientBalance="onChangeInsufficientBalance"
          ></AddLiquidityForm>
        </div>
        <button
          v-if="title !== 'Add Liquidity'"
          class="add-btn"
          :disabled="isDisabled || insufficientBalance"
          @click="toAdd"
        >
          {{ insufficientBalance ? 'Insufficient balance' : 'Add' }}
        </button>
        <button v-else class="add-btn" @click="toAdd">Add</button>
      </div>
    </Modal>
    <Setting v-if="showSetting" @onClose="() => (showSetting = false)"></Setting>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { Modal } from 'ant-design-vue'
import importIcon from '@/utils/import-icon'
import { eventBus } from '@/utils/eventBus'
import { fixD } from '@/utils'
import { gt } from '@/utils/safe-math'

Vue.use(Modal)

export default Vue.extend({
  components: {
    Modal
  },
  props: {
    title: {
      type: String,
      default: 'Add Liquidity'
    },
    coinPair: {
      type: String,
      default: 'CRM/USDT'
    },
    fromCoin: {
      type: String,
      default: 'CRM'
    },
    toCoin: {
      type: String,
      default: 'USDT'
    },
    secondConfirmData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    minPrice: {
      type: String,
      default: ''
    },
    maxPrice: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      direct: true, // direct true正向， false反向
      fromCoinAmount: '',
      toCoinAmount: '',
      showSetting: false,
      deltaLiquity: 0,
      insufficientBalance: false
    }
  },
  computed: {
    isDisabled(): boolean {
      const showFromCoinLock = this.secondConfirmData && this.secondConfirmData.showFromCoinLock
      const showToCoinLock = this.secondConfirmData && this.secondConfirmData.showToCoinLock

      const fromCoinAmount = this.$data.fromCoinAmount
      const toCoinAmount = this.$data.toCoinAmount

      if (showFromCoinLock && !showToCoinLock && toCoinAmount) {
        return false
      } else if (showToCoinLock && !showFromCoinLock && fromCoinAmount) {
        return false
      } else if (!showToCoinLock && !showFromCoinLock && toCoinAmount && fromCoinAmount) {
        return false
      }
      return true
    }
  },
  watch: {
    fromCoinAmount(val) {
      console.log(val, 'val##')
    }
  },
  mounted() {
    console.log(this.secondConfirmData, 'secondConfirmData##')
  },
  methods: {
    gt,
    fixD,
    importIcon,
    onChangeInsufficientBalance(value: boolean) {
      this.insufficientBalance = value
    },
    changeDirect(value: boolean) {
      this.direct = value
    },
    toAdd() {
      let fromCoinAmount: any
      if (this.fromCoinAmount) {
        fromCoinAmount = Number(this.fromCoinAmount) * (1 + Number(this.$accessor.slippage) / 100)
      }
      let toCoinAmount: any
      if (this.toCoinAmount) {
        toCoinAmount = Number(this.toCoinAmount) * (1 + Number(this.$accessor.slippage) / 100)
      }

      this.$emit('supply', fromCoinAmount, toCoinAmount, this.deltaLiquity)
      this.$emit('onClose')
    },
    addFormChanged(fromCoinAmount: string, toCoinAmount: string, deltaLiquity: number) {
      console.log('addFormChanged###deltaLiquity####', deltaLiquity)
      this.fromCoinAmount = fromCoinAmount
      this.toCoinAmount = toCoinAmount
      this.deltaLiquity = deltaLiquity
    }
  }
})
</script>

<style lang="less" scope>
@import '../styles/base.less';
.add-liquidity-modal {
  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 0px;
    color: #f1f1f2;
    border-radius: 4px 4px 0 0;
    .modal-header-left {
      display: flex;
      align-items: center;
      font-size: 18px;
      font-weight: 500;
      color: #fff;
      .icon {
        margin-right: 4px;
      }
    }
    .icon {
      width: 20px;
      height: 20px;
    }
  }
  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .coin-pair {
      display: flex;
      align-items: center;
      img {
        width: 30px;
        height: 30px;
        border-radius: 100%;
        &:nth-of-type(2) {
          margin-left: -10px;
        }
      }
      span {
        font-size: 16px;
        margin-left: 10px;
      }
    }
    .status {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0px 16px;
      min-width: 80px;
      height: 28px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      i {
        width: 6px;
        height: 6px;
        background: #00ff4d;
        border-radius: 100%;
        margin-right: 6px;
      }
      svg {
        width: 20px;
        height: 20px;
        fill: rgba(255, 255, 255, 0.8);
        margin-right: 4px;
      }
      span {
        font-size: 14px;
        color: #fff;
      }
    }
  }

  .info {
    width: 100%;
    background: rgba(255, 255, 255, 0.04);
    border-radius: 10px;
    padding: 0px 20px;
    margin-top: 20px;
    .coin-info-block {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 10px;
      .left {
        display: flex;
        align-items: center;
        img {
          width: 30px;
          height: 30px;
          border-radius: 100%;
        }
        span {
          font-size: 16px;
          color: #fff;
          margin-left: 10px;
        }
      }
      .right {
        font-size: 20px;
        color: #fff;
      }
    }
    .fee-tier-block {
      margin-top: 14px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 16px;
      padding-bottom: 20px;
      span {
        color: #fff;
        &:first-child {
          font-size: 16px;
        }
        &:last-child {
          font-size: 20px;
        }
      }
    }
  }

  .range-box {
    width: 100%;
    margin-top: 22px;
    .range-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      h3 {
        font-size: 14px;
        color: #fff;
      }
      .coin-tab {
        width: 100px;
        height: 28px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        display: flex;
        align-items: center;
        padding: 1px;
        span {
          flex: 1;
          border-radius: 7px;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.5);
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          &.active {
            background: linear-gradient(214deg, #59bdad 0%, #6676f5 61%, #9a89f9 76%, #eba7ff 100%);
            color: #fff;
          }
        }
      }
    }
    .price-range-block {
      display: flex;
      margin-top: 16px;
      align-items: center;
      justify-content: space-between;
      .price-item {
        // width: 221px;
        // flex: 1;
        // height: 140px;
        & + .price-item {
          margin-left: 10px;
        }
        background: rgba(255, 255, 255, 0.04);
        border-radius: 10px;
        text-align: center;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.5);
        .title {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
          padding-top: 8px;
        }
        .price {
          font-size: 14px;
          color: #fff;
          padding-top: 8px;
          margin-bottom: 0px;
        }
        .text {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
          padding-top: 8px;
        }
        .note {
          padding: 10px 20px 10px 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          // width: 181px;
          margin: 0 auto;
          margin-top: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding-top: 8px;
        }
      }
    }
  }
  .current-price {
    display: flex;
    align-items: center;
    margin-top: 10px;
    span {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.5);
    }
    div {
      font-family: 'Arial Bold';
      font-weight: bold;
      font-size: 16px;
      background: linear-gradient(to right, #59bdad, #6676f5, #9a89f9, #eba7ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-left: 10px;
      margin-top: 0px;
    }
  }
  .add-liquidity-form-box {
    margin-top: 30px;
  }
  .add-btn {
    .gradient-btn-large();
    margin-top: 20px;
  }
}
</style>
