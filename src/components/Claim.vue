<template>
  <Modal
    class="add-liquidity-confirm"
    :title="'Claim fees'"
    width="400px"
    :visible="true"
    centered
    :footer="null"
    @cancel="$emit('onClose')"
  >
    <div class="claim-container">
      <div class="liquidity-coins">
        <div class="before-coin">
          <div class="coin-num">
            <img
              v-if="poolInfo"
              class="img-left"
              :src="poolInfo.token_a.icon || importIcon(`/coins/${poolInfo.token_a.symbol.toLowerCase()}.png`)"
              alt=""
            />
          </div>
          <div v-if="poolInfo" class="coin-label">
            {{
              // eslint-disable-next-line vue/no-parsing-error
              Number(tokenaFee) <= 0 // eslint-disable-next-line vue/no-parsing-error
                ? '<0.00001'
                : tokenaFee
            }}
            <span>{{ poolInfo.token_a.symbol }}</span>
          </div>
        </div>
        <div class="before-coin after-coin">
          <div v-if="poolInfo" class="coin-num">
            <img
              class="img-right"
              :src="poolInfo.token_b.icon || importIcon(`/coins/${poolInfo.token_b.symbol.toLowerCase()}.png`)"
              alt=""
            />
          </div>
          <div v-if="poolInfo" class="coin-label">
            {{
              // eslint-disable-next-line vue/no-parsing-error
              Number(tokenbFee) <= 0 // eslint-disable-next-line vue/no-parsing-error
                ? '<0.00001'
                : tokenbFee
            }}
            <span>{{ poolInfo.token_b.symbol }}</span>
          </div>
        </div>
      </div>
      <Button class="claim-pond" :disabled="isLoading" :loading="isLoading" @click="toClaim">Claim</Button>
    </div>
  </Modal>
</template>
<script lang="ts">
import Vue from 'vue'
import importIcon from '@/utils/import-icon'
import { Modal, Button } from 'ant-design-vue'
import { preclaim } from '@/tokenSwap/swapv3'
import { fixD, getUnixTs } from '@/utils/index'

export default Vue.extend({
  components: {
    Modal,
    Button
  },
  props: {
    currentData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    poolInfo: {
      type: Object,
      default: () => {
        return {}
      }
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    tokenaFee: {
      type: String,
      default: ''
    },
    tokenbFee: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      token_a_fee: '',
      token_b_fee: ''
    }
  },
  methods: {
    importIcon,
    fixD,
    preclaim,
    toClaim() {
      this.$emit('toClaim')
    }
  }
})
</script>
<style lang="less" scoped>
@import '../styles/base.less';

.claim-container {
  .liquidity-coins {
    padding: 14px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    .before-coin {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .coin-label {
        font-size: 14px;
        color: #fff;
        span {
          margin-left: 15px;
        }
      }
      .coin-num {
        font-size: 16px;
        font-weight: normal;
        color: #fff;
        display: flex;
        align-items: center;
        img {
          width: 36px;
          height: 36px;
          // margin-right: 10px;
        }
      }
    }
    .after-coin {
      margin-top: 10px;
    }
  }
  .claim-pond {
    margin-top: 20px;
    background: linear-gradient(214deg, #59bdad 0%, #6676f5 61%, #9a89f9 76%, #eba7ff 100%);
    text-align: center;
    cursor: pointer;
    .gradient-btn-large();
    // min-width: 62px;
    height: 48px;
    line-height: 48px;
    font-size: 16px;
    border-radius: 10px;
    font-family: 'PingFang';
  }
}
</style>
