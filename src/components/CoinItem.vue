<template>
  <div class="coin-item" @click="onSelect(source)">
    <div class="left">
      <!-- <img :src="source.logoURI" /> -->
      <div class="coin-icon-back">
        <img v-lazy="source.logoURI" />
      </div>

      <span>{{ source.symbol }}</span>
    </div>
    <div v-if="wallet.connected" class="balance">
      <div v-if="wallet.loading">
        <Icon type="loading" />
      </div>
      <div v-else-if="tokenAccounts && tokenAccounts[source.address]">
        {{ tokenAccounts[source.address].balance.toEther() || '0' }}
      </div>
      <div
        v-else-if="
          tokenAccounts &&
          tokenAccounts['11111111111111111111111111111111'] &&
          source.address === 'So11111111111111111111111111111111111111112'
        "
      >
        {{ tokenAccounts['11111111111111111111111111111111'].balance.toEther() }}
      </div>
      <div v-else>0</div>
    </div>
    <div v-else></div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { Icon } from 'ant-design-vue'
export default Vue.extend({
  name: 'CoinItem',
  components: {
    Icon
  },
  props: {
    // eslint-disable-next-line vue/require-default-prop
    index: {
      // index of current item
      type: Number
    },
    source: {
      // here is: {uid: 'unique_1', text: 'abc'}
      type: Object,
      default() {
        return {}
      }
    },
    // eslint-disable-next-line vue/require-default-prop
    onSelect: {
      type: Function
    }
  },
  data() {
    return {
      tokenAccounts: {} as any
    }
  },
  computed: {
    ...mapState(['wallet', 'swap'])
  },
  watch: {
    'wallet.tokenAccounts': {
      handler: 'tokenAccountsWatch',
      immediate: true
    }
  },
  methods: {
    tokenAccountsWatch(tokenAccounts: any) {
      this.tokenAccounts = tokenAccounts
    }
    // toSelect() {
    //   console.log('111111')
    //   this.$emit('toSelect', this.source)
    // }
  }
})
</script>

<style lang="less" scoped>
.coin-item {
  display: flex;
  height: 48px;
  margin-top: 10px;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  color: #fff;
  cursor: pointer;
  .left {
    display: flex;
    align-items: center;
    .coin-icon-back {
      width: 30px;
      height: 30px;
      border-radius: 100%;
      background: url('../assets/images/icon_waiting.svg') center center no-repeat;
      background-size: 100% 100%;
    }
    img {
      width: 30px;
      height: 30px;
      border-radius: 100%;
    }
    span {
      margin-left: 10px;
    }
  }
  .balance {
    padding-right: 16px;
  }
  &.unusable {
    color: rgba(255, 255, 255, 0.5);
    cursor: not-allowed;
    .left {
      img {
        filter: grayscale(1);
      }
    }
  }
}
</style>
