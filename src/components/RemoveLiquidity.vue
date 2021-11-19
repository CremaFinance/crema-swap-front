<template>
  <div>
    <Modal
      centered
      :class="isRemove ? '' : 'remove-liquidity'"
      width="430px"
      :visible="true"
      :footer="null"
      :header="null"
      :closable="false"
      @cancel="$emit('onClose')"
    >
      <!-- Add Liquidity弹框 -->
      <div class="pool-settings">
        <div class="modal-header">
          <div class="modal-header-left">
            <svg class="icon" aria-hidden="true" @click="$emit('onClose')">
              <use xlink:href="#icon-icon-return"></use>
            </svg>
            Remove Liquidity
          </div>
          <div class="modal-header-right">
            <svg class="icon" aria-hidden="true" @click="showSetting = true">
              <use xlink:href="#icon-a-bianzu81"></use>
            </svg>
          </div>
        </div>
        <div class="header-file">
          <div class="file-left">
            <div class="deta-block-img">
              <!-- 52 30 -->
              <img class="img-left" :src="importIcon(`/coins/${currentData.coin.symbol.toLowerCase()}.png`)" />
              <img class="img-right" :src="importIcon(`/coins/${currentData.pc.symbol.toLowerCase()}.png`)" />
            </div>
            <div class="deta-block-either" v-if="currentData.coin && currentData.pc">
              <!-- 94 16 16 -->
              {{ currentData.coin.symbol }} / {{ currentData.pc.symbol }}
            </div>
          </div>
          <StatusBlock :current-status="currentStatus" />
        </div>
        <div class="amount">
          <div class="amount-title">Amount</div>
          <div class="amount-tab">
            <div class="amount-left">{{ sliderValue }}%</div>
            <div class="amount-right">
              <div
                v-for="(item, index) in amountPercentage"
                :key="item.name"
                class="amount-tab-btn"
                :class="
                  amountPercentageIndex == index || sliderValue / 100 == item.value ? 'amount-tab-btn-active' : ''
                "
                @click="setPercent(item, index)"
              >
                {{ item.name }}
              </div>
            </div>
          </div>
          <Slider v-model="sliderValue" @change="sliderChange" :tooltipVisible="sliderChangeFlag"></Slider>
        </div>
        <div class="liquidity-coins">
          <div class="before-coin">
            <div class="coin-label">Pooled {{ currentData.coin.symbol }}:</div>
            <div class="coin-num">
              {{ fromCoinAmount }}
              <img class="img-left" :src="importIcon(`/coins/${currentData.coin.symbol.toLowerCase()}.png`)" />
            </div>
          </div>
          <div class="before-coin after-coin">
            <div class="coin-label">Pooled {{ currentData.pc.symbol }}:</div>
            <div class="coin-num">
              {{ toCoinAmount }}
              <img class="img-right" :src="importIcon(`/coins/${currentData.pc.symbol.toLowerCase()}.png`)" />
            </div>
          </div>
        </div>
        <Button class="confirm-add" :disabled="isLoading" :loading="isLoading" @click="toRemove">Remove</Button>
      </div>
    </Modal>
    <Setting v-if="showSetting" @onClose="() => (showSetting = false)"></Setting>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { Modal, Slider, Button } from 'ant-design-vue'
import importIcon from '@/utils/import-icon'

Vue.use(Modal).use(Slider).use(Button)

export default Vue.extend({
  components: {
    Modal,
    Slider,
    Button
  },
  props: {
    currentData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      title: 'CRM',
      isRemove: false,
      untitle: 'USDT',
      nowtitle: 'CRM',
      sliderValue: 50,
      amountPercentageIndex: 1,
      amountPercentage: [
        {
          name: '25%',
          value: 0.25
        },
        {
          name: '50%',
          value: 0.5
        },
        {
          name: '75%',
          value: 0.75
        },
        {
          name: 'Max',
          value: 1
        }
      ],
      showSetting: false,
      sliderChangeFlag: false,
      fromCoinAmount: '0',
      toCoinAmount: '0',
      currentStatus: ''
    }
  },
  watch: {
    currentData: {
      handler: 'watchCurrentData',
      immediate: true
    },
    sliderValue(val: any) {
      this.sliderValue = Math.ceil(val)
    }
  },
  methods: {
    importIcon,
    watchCurrentData(newData: any) {
      if (newData.fromCoinAmount) {
        this.fromCoinAmount = String(newData.fromCoinAmount * Number(this.sliderValue / 100))
      }
      if (newData.toCoinAmount) {
        this.toCoinAmount = String(newData.toCoinAmount * Number(this.sliderValue / 100))
      }
      const currentPrice = Number(newData.currentPrice)
      const minPrice = Number(newData.minPrice)
      const maxPrice = Number(newData.maxPrice)
      // // 区间中包含当前价格, 一种资产返回另外一种资产，并且返回liquity
      if (currentPrice >= minPrice && currentPrice <= maxPrice) {
        this.currentStatus = 'Active'
      } else if (currentPrice > maxPrice) {
        // 区间在当前价格的左侧时，也就是只有token b这一种资产, 返回liquity
        this.currentStatus = 'Inactive'
      } else if (currentPrice < minPrice) {
        // 区间在当前价格的右侧时，也就是只有token a这一种资产, 返回liquity
        this.currentStatus = 'Inactive'
      }
    },
    setPercent(item: any, index: any) {
      this.amountPercentageIndex = index
      this.sliderValue = item.value * 100
      const { fromCoinAmount, toCoinAmount } = this.currentData
      if (fromCoinAmount && toCoinAmount) {
        this.fromCoinAmount = String(fromCoinAmount * Number(item.value))
        this.toCoinAmount = String(toCoinAmount * Number(item.value))
      }
    },
    sliderChange(value: string) {
      this.sliderChangeFlag = true
      this.amountPercentageIndex = -1
      this.setPercent({ value: this.sliderValue / 100 }, -1)
    },
    toRemove() {
      // console.log('这里滑点是多少呢####', this.$accessor.slippage)
      // console.log('考虑滑点前####this.fromCoinAmount####', this.fromCoinAmount)
      // console.log('考虑滑点前####this.toCoinAmount####', this.toCoinAmount)
      // console.log('(1 + 100 / Number(this.$accessor.slippage))#####', 1 + Number(this.$accessor.slippage) / 100)
      let fromCoinAmount: any
      if (this.fromCoinAmount) {
        fromCoinAmount = Number(this.fromCoinAmount) / (1 + Number(this.$accessor.slippage) / 100)
      }
      let toCoinAmount: any
      if (this.toCoinAmount) {
        toCoinAmount = Number(this.toCoinAmount) / (1 + Number(this.$accessor.slippage) / 100)
      }
      this.$emit('remove', fromCoinAmount, toCoinAmount, this.sliderValue)
    }
  }
})
</script>
<style lang="less" scope>
@import '../styles/base.less';
.pool-settings {
  padding-bottom: 20px;
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
  .header-file {
    height: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .file-left {
      // width: 156px;
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
        // width: 94px;
        white-space: nowrap;
        margin-left: 10px;
        height: 16px;
        line-height: 16px;
        font-size: 15px;
        font-family: 'Arial Bold';
        font-weight: bold;
      }
    }
  }
  .amount {
    margin-top: 20px;
    padding: 10px;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 10px;
    padding-bottom: 19px;
    .amount-title {
      font-size: 14px;
      color: #fff;
    }
    .amount-tab {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 18px;
      .amount-left {
        font-size: 24px;
        font-weight: normal;
        color: #fff;
      }
      .amount-right {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .amount-tab-btn {
          width: 40px;
          height: 28px;
          background: rgba(7, 235, 173, 0.05);
          border-radius: 4px;
          border: 1px solid #07ebad;
          font-size: 12px;
          color: #07ebad;
          line-height: 28px;
          text-align: center;
          cursor: pointer;
          & + .amount-tab-btn {
            margin-left: 20px;
          }
          &:hover,
          &:active {
            background: rgba(7, 235, 173, 0.3);
            color: #fff;
          }
        }
        .amount-tab-btn-active {
          background: rgba(7, 235, 173, 0.3);
          color: #fff;
        }
      }
    }
    .ant-slider {
      margin: 7px 0px 0px;
    }
  }
  .liquidity-coins {
    margin-top: 20px;
    padding: 17px 20px;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 10px;
    .before-coin {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .coin-label {
        font-size: 14px;
        color: #fff;
      }
      .coin-num {
        font-size: 16px;
        font-weight: normal;
        color: #fff;
        img {
          width: 20px;
          height: 20px;
          margin-left: 7px;
        }
      }
    }
    .after-coin {
      margin-top: 10px;
    }
  }
  .confirm-add {
    font-weight: bold;
    font-size: 20px;
    color: #fff;
    .gradient-btn-large();
    margin-top: 20px;
  }
}
</style>

