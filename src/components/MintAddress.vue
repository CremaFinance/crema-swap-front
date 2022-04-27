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
        <div v-if="fromCoin && fromCoin.symbol && fromCoin.token_mint" class="pc-address">
          <img :src="fromCoin.icon || importIcon(`/coins/${fromCoin.symbol.toLowerCase()}.png`)" />
          <span>
            {{ fromCoin.token_mint && fromCoin.token_mint.substr(0, 14) }}
            ...
            {{ fromCoin.token_mint && fromCoin.token_mint.substr(fromCoin.token_mint.length - 15, 15) }}
          </span>
          <svg class="icon" aria-hidden="true" @click="$accessor.copy(fromCoin.token_mint)">
            <use xlink:href="#icon-icon_copy"></use>
          </svg>
        </div>
        <div v-if="toCoin && toCoin.symbol && toCoin.token_mint" class="pc-address">
          <img :src="toCoin.icon || importIcon(`/coins/${toCoin.symbol.toLowerCase()}.png`)" />
          <span>
            {{ toCoin.token_mint && toCoin.token_mint.substr(0, 14) }}
            ...
            {{ toCoin.token_mint && toCoin.token_mint.substr(toCoin.token_mint.length - 15, 15) }}
          </span>
          <svg class="icon" aria-hidden="true" @click="$accessor.copy(toCoin.token_mint)">
            <use xlink:href="#icon-icon_copy"></use>
          </svg>
        </div>

        <div v-if="fromCoin && fromCoin.symbol && fromCoin.token_mint" class="h5-address">
          <img :src="fromCoin.icon || importIcon(`/coins/${fromCoin.symbol.toLowerCase()}.png`)" />
          <span>
            {{ fromCoin.token_mint && fromCoin.token_mint.substr(0, 11) }}
            ...
            {{ fromCoin.token_mint && fromCoin.token_mint.substr(fromCoin.token_mint.length - 11, 11) }}
          </span>
          <svg class="icon" aria-hidden="true" @click="$accessor.copy(fromCoin.token_mint)">
            <use xlink:href="#icon-icon_copy"></use>
          </svg>
        </div>
        <div v-if="toCoin && toCoin.symbol && toCoin.token_mint" class="h5-address">
          <img :src="toCoin.icon || importIcon(`/coins/${toCoin.symbol.toLowerCase()}.png`)" />
          <span>
            {{ toCoin.token_mint && toCoin.token_mint.substr(0, 11) }}
            ...
            {{ toCoin.token_mint && toCoin.token_mint.substr(toCoin.token_mint.length - 11, 11) }}
          </span>
          <svg class="icon" aria-hidden="true" @click="$accessor.copy(toCoin.token_mint)">
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