<template>
  <Modal
    class="stake-confirm"
    width="400px"
    :visible="true"
    :title="title"
    centered
    :footer="null"
    @cancel="$emit('onClose')"
  >
    <div v-if="title == 'Harvest' || title == 'Harvest All'" class="stake-confirm-container">
      <div class="harvest-title">
        <img src="@/assets/coins/crm.png" alt="" />
        CRM
      </div>
      <div class="rewards">
        <div class="rewards-text">Rewards</div>
        <div class="rewards-balance">106.01CRM</div>
      </div>
    </div>
    <div class="stake-confirm-container" v-else>
      <div class="get-lp" v-if="title === 'Stake'">
        Get {{ 'USDT / USDC' }} LPT
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-icon-Jump"></use>
        </svg>
      </div>
      <div class="symbol-name">
        <div class="symbol-logo">
          <img class="coin-before" :src="importIcon(`/coins/${'USDT'.toLowerCase()}.png`)" alt="" /><img
            class="coin-after"
            :src="importIcon(`/coins/${'USDC'.toLowerCase()}.png`)"
            alt=""
          />
        </div>
        <div class="symbol-text">{{ 'USDT / USDC' }} LP NFT</div>
      </div>
      <div class="enter-container">
        <Input />
        <div class="enter-amount">
          <div class="balance-text">Balance 100.122312</div>
          <Button class="max-btn">MAX</Button>
        </div>
      </div>
    </div>
    <div class="btn-box">
      <Button class="cancel-btn" @click="$emit('onClose')">Cancle</Button>
      <Button class="submit-btn" @click="submit">{{ title }}</Button>
    </div>
  </Modal>
</template>
<script lang="ts">
import Vue from 'vue'
import { Modal, Input } from 'ant-design-vue'
import importIcon from '@/utils/import-icon'
Vue.use(Modal).use(Input)
export default Vue.extend({
  components: {
    Modal,
    Input
  },
  props: {
    title: {
      type: String,
      default: 'Stake'
    }
  },
  data() {
    return {}
  },
  methods: {
    importIcon,
    submit() {
      this.$notify.success({
        message: `Harvest Success`,
        icon: this.$createElement('img', { class: { 'notify-icon': true }, attrs: { src: '/icon_Copied@2x.png' } }),
        description: (h: any) => h('div', [`Harvest Success`])
      })
      this.$emit('onClose')
    }
  }
})
</script>
<style lang="less" scoped>
.stake-confirm {
  background: linear-gradient(214deg, #3e434e 0%, #23262b 100%);
  box-shadow: 0px 4px 12px 0px rgba(26, 28, 31, 0.5);
  border-radius: 10px;
  border: 1px solid #3f434e;
  .get-lp {
    font-size: 14px;
    color: #5f667c;
    display: flex;
    align-items: center;
    .icon {
      width: 20px;
      height: 20px;
      margin-left: 12px;
    }
  }
  .symbol-name {
    margin-top: 27px;
    display: flex;
    align-items: center;
    .symbol-logo {
      img {
        width: 36px;
        height: 36px;
      }
      .coin-after {
        margin-left: -5px;
      }
    }
    .symbol-text {
      font-size: 16px;
      color: #fff;
      margin-left: 10px;
    }
  }
  .enter-container {
    margin-top: 30px;
    background: #23262b;
    box-shadow: 0px 2px 3px 1px #1a1c1f;
    border-radius: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px 15px 10px;
    .enter-amount {
      text-align: right;
      .balance-text {
        font-size: 14px;
        color: #fff;
      }
      .max-btn {
        width: 46px;
        height: 22px;
        background: linear-gradient(233deg, #4bb5ff 0%, #ce90ff 100%);
        border-radius: 7px;
        line-height: 1;
        margin-top: 10px;
      }
    }
    input {
      max-width: 200px;
      height: 100%;
      border: none;
      outline: none;
      background: #23262b;
      &:hover {
        border: none;
      }
    }
  }
  .btn-box {
    width: 100%;
    font-size: 16px;
    color: #fff;
    display: flex;
    justify-content: space-between;
    margin-top: 30px;
    line-height: 1;
    .cancel-btn {
      width: 180px;
      padding: 16px 0;
      box-shadow: 0px 4px 12px 0px #25282c;
      border-radius: 12px;
      border: 1px solid #3f434e;
      background: transparent;
    }
    .submit-btn {
      width: 180px;
      padding: 16px 0;
      background: linear-gradient(270deg, #5fe6d0 0%, #60b2f1 33%, #9380ff 68%, #e590ff 100%);
      border-radius: 12px;
      margin-left: 21px;
    }
  }
  .harvest-title {
    display: flex;
    align-items: center;
    img {
      width: 30px;
      height: 30px;
      margin-right: 10px;
    }
    font-size: 16px;
    font-weight: 600;
    color: #fff;
  }
  .rewards {
    padding: 20px;
    display: flex;
    justify-content: space-between;
    background: rgba(0, 0, 0, 0.05);
    margin-top: 12px;
    border-radius: 10px;
    .rewards-text {
      font-size: 14px;
      color: #5f667c;
    }
    .rewards-balance {
      font-size: 16px;
      font-weight: 800;
      color: #fff;
    }
  }
}
</style>