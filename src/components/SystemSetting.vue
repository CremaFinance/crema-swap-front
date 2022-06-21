<template>
  <div class="system-setting-container">
    <div class="system-setting-icon" @click="systemSettingToogle">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-icon-set"></use>
      </svg>
    </div>
    <Modal
      class="system-setting-modal"
      title="Settings"
      :z-index="1070"
      centered
      width="400px"
      :visible="showSymstemSetting"
      :footer="null"
      @cancel="closeSystemSetting"
    >
      <div class="system-setting">
        <h3 class="title">Network</h3>
        <div class="rpc-select-box">
          <label>RPC Node</label>
          <Select ref="select" v-model="currentRpc" class="rpc-select" @change="selectRpc">
            <Option v-for="item in rpcList" :key="item.label" :value="item.value" class="rpc-option">{{
              item.label
            }}</Option>
          </Select>
        </div>
        <div class="button-box">
          <Button class="cancel" @click="closeSystemSetting">Cancel</Button>
          <Button :loading="isloading" class="confirm" @click="coinfirmChangeNetwork">Confirm</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { Modal, Select, Button } from 'ant-design-vue'
const Option = Select.Option

Vue.use(Modal)

export default Vue.extend({
  components: {
    Modal,
    Select,
    Option,
    Button
  },
  data() {
    return {
      currentRpc: 'https://crema-crema-b941.mainnet.rpcpool.com',
      rpcList: [
        {
          label: 'Triton A',
          value: 'https://crema-crema-b941.mainnet.rpcpool.com'
        },
        {
          label: 'Triton B',
          value: 'https://crema.rpcpool.com'
        },
        {
          label: 'Serum',
          value: 'https://solana-api.projectserum.com'
        },
        {
          label: 'GenesysGo',
          value: 'https://ssc-dao.genesysgo.net'
        }
      ],
      showSymstemSetting: false,
      isloading: false,
      oldRpc: ''
    }
  },
  mounted() {
    const localRpc = localStorage.getItem('c-pro-current-rpc')
    if (localRpc) {
      this.currentRpc = localRpc
    }
  },
  methods: {
    systemSettingToogle() {
      this.showSymstemSetting = !this.showSymstemSetting
    },
    closeSystemSetting() {
      // console.log('this.oldRpc####', this.oldRpc)
      this.currentRpc = localStorage.getItem('c-pro-current-rpc') || 'https://crema-crema-b941.mainnet.rpcpool.com'
      this.showSymstemSetting = false
    },
    selectRpc(value) {
      // this.isloading = true

      this.currentRpc = value
    },
    coinfirmChangeNetwork() {
      localStorage.setItem('c-pro-current-rpc', this.currentRpc)
      this.isloading = true
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    }
  }
})
</script>
<style lang="less">
.system-setting-modal {
  .ant-modal-header {
    padding: 16px 20px;
  }
}
</style>
<style lang="less" scope>
@import '../styles/base.less';
.system-setting-icon {
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 12px;
  cursor: pointer;
  svg {
    width: 20px;
    height: 20px;
    fill: #fff;
  }
  &:hover {
    background: #464953;
  }
}
.system-setting {
  .title {
    font-size: 14px;
    color: #b5b8c2;
    padding-bottom: 8px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 10px;
  }
  .rpc-select-box {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 12px;
    label {
      font-size: 14px;
      color: #b5b8c2;
    }
    .ant-select {
      width: 120px;
    }
  }
  .button-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 40px;
    button {
      height: 48px;
      flex: 1;
      color: #fff;
      font-size: 16px;
      border-radius: 12px;
      min-width: 174px;
      &:first-child {
        margin-right: 10px;
      }
      &.cancel {
        box-shadow: 0px 4px 12px 0px #25282c;

        border: 1px solid #3f434e;
        background: none;
      }
      &.confirm {
        background: linear-gradient(270deg, #5fe6d0 0%, #60b2f1 33%, #9380ff 68%, #e590ff 100%);
      }
    }
  }
}
@media screen and (max-width: 750px) {
  .pool-setting .input-content .slippage-item {
    width: 60px;
  }
  .pool-setting .input-content input {
    width: 60px;
  }

  .system-setting-icon {
    margin-left: 0px;
    margin-right: 10px;
    width: 30px;
    height: 30px;
  }

  .system-setting {
    .button-box {
      button {
        min-width: auto;
      }
    }
  }
}
</style>

