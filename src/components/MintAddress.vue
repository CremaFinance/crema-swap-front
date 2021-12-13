<template>
  <div>
    <Modal
      class="mint-address"
      width="400px"
      :visible="true"
      centered
      :title="'Address'"
      :footer="null"
      @cancel="$emit('onClose')"
    >
      <div class="address-container">
        <div v-if="fromCoin && fromCoin.symbol && fromCoin.mintAddress" class="pc-address">
          <img :src="importIcon(`/coins/${fromCoin.symbol.toLowerCase()}.png`)" />
          <span>
            {{ fromCoin.mintAddress && fromCoin.mintAddress.substr(0, 14) }}
            ...
            {{ fromCoin.mintAddress && fromCoin.mintAddress.substr(fromCoin.mintAddress.length - 15, 15) }}
          </span>
          <svg class="icon" aria-hidden="true" @click="$accessor.copy(fromCoin.mintAddress)">
            <use xlink:href="#icon-icon_copy"></use>
          </svg>
        </div>
        <div v-if="toCoin && toCoin.symbol && toCoin.mintAddress" class="pc-address">
          <img :src="importIcon(`/coins/${toCoin.symbol.toLowerCase()}.png`)" />
          <span>
            {{ toCoin.mintAddress && toCoin.mintAddress.substr(0, 14) }}
            ...
            {{ toCoin.mintAddress && toCoin.mintAddress.substr(toCoin.mintAddress.length - 15, 15) }}
          </span>
          <svg class="icon" aria-hidden="true" @click="$accessor.copy(toCoin.mintAddress)">
            <use xlink:href="#icon-icon_copy"></use>
          </svg>
        </div>

        <div v-if="fromCoin && fromCoin.symbol && fromCoin.mintAddress" class="h5-address">
          <img :src="importIcon(`/coins/${fromCoin.symbol.toLowerCase()}.png`)" />
          <span>
            {{ fromCoin.mintAddress && fromCoin.mintAddress.substr(0, 11) }}
            ...
            {{ fromCoin.mintAddress && fromCoin.mintAddress.substr(fromCoin.mintAddress.length - 11, 11) }}
          </span>
          <svg class="icon" aria-hidden="true" @click="$accessor.copy(fromCoin.mintAddress)">
            <use xlink:href="#icon-icon_copy"></use>
          </svg>
        </div>
        <div v-if="toCoin && toCoin.symbol && toCoin.mintAddress" class="h5-address">
          <img :src="importIcon(`/coins/${toCoin.symbol.toLowerCase()}.png`)" />
          <span>
            {{ toCoin.mintAddress && toCoin.mintAddress.substr(0, 11) }}
            ...
            {{ toCoin.mintAddress && toCoin.mintAddress.substr(toCoin.mintAddress.length - 11, 11) }}
          </span>
          <svg class="icon" aria-hidden="true" @click="$accessor.copy(toCoin.mintAddress)">
            <use xlink:href="#icon-icon_copy"></use>
          </svg>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { Modal } from 'ant-design-vue'
import importIcon from '@/utils/import-icon'
Vue.use(Modal)
export default Vue.extend({
  components: {
    Modal
  },
  props: {
    toCoin: {
      type: Object,
      default: () => {
        return {}
      }
    },
    fromCoin: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  methods: { importIcon }
})
</script>
<style lang="less" scope>
.pc-address {
  display: block;
}
.h5-address {
  display: none;
}
.mint-address {
  .address-container {
    padding: 12px;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 8px;
    > .pc-address {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #b5b8c2;
      & + div {
        margin-top: 14px;
      }
    }
    .icon {
      width: 16px;
      height: 16px;
      fill: #b5b8c2;
      &:hover {
        fill: #fff;
      }
    }
    img {
      width: 30px;
      height: 30px;
    }
  }
}
@media screen and (max-width: 750px) {
  .mint-address .address-container > .pc-address {
    display: none;
  }
  .mint-address .address-container > .h5-address {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #b5b8c2;
    & + div {
      margin-top: 14px;
    }
  }
}
</style>