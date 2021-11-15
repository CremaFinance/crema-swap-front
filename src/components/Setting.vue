<template>
  <Modal
    title="Settings"
    :zIndex="1070"
    centered
    width="430px"
    :visible="true"
    :footer="null"
    @cancel="$emit('onClose')"
  >
    <div class="pool-setting">
      <div class="slippage-tolerance">Slippage tolerance</div>
      <div class="input-content">
        <div
          v-for="(item, index) in slippageArr"
          :key="index"
          class="slippage-item"
          :class="item === slippage ? 'slippage-item-active' : ''"
          @click="slippage = item"
        >
          {{ item }}
        </div>
        <Input v-model="slippage" typ="number" size="large" suffix="%" @input="oninput" />
      </div>
      <div class="btn-box">
        <div class="disconnect-btn-box">
          <Button class="disconnect-btn" ghost @click="$emit('onClose')"> Cancel </Button>
        </div>
        <Button class="switch-wallet-btn" ghost @click="confirmSlippage"> Confirm </Button>
      </div>
    </div>
  </Modal>
</template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { Modal, Input } from 'ant-design-vue'

Vue.use(Modal)

export default Vue.extend({
  components: {
    Modal,
    Input
  },
  data() {
    return {
      slippage: '',
      slippageArr: ['0.1', '0.5', '1']
    }
  },
  mounted() {
    this.slippage = this.$accessor.slippage
  },
  methods: {
    oninput(e: any) {
      e.target.value = e.target.value.match(/^\d+(?:\.\d{0,2})?/)
        ? e.target.value.match(/^\d+(?:\.\d{0,2})?/)[0] || null
        : ''
      if (e.target.value) {
        this.slippage = e.target.value
      }
    },
    confirmSlippage() {
      this.$accessor.setSlippage(this.slippage)
      this.$emit('onClose')
    }
  }
})
</script>
<style lang="less" scope>
.pool-setting {
  // padding-bottom: 43px;
  .slippage-tolerance {
    margin-top: 14px;
  }
  .input-content {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    .slippage-item {
      width: 80px;
      height: 40px;
      // background: rgb(#333);
      background: none;
      // border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      color: #07ebad;
      text-align: center;
      line-height: 40px;
      // border: 1px solid rgba(0, 0, 0, 0.05);
      border-radius: 10px;
      border: 1px solid #07ebad;
    }
    .slippage-item-active {
      background: rgba(7, 235, 173, 0.3);
      border-radius: 10px;
      border: 1px solid #07ebad;
    }
    input {
      width: 80px;
      height: 40px;
      background: rgba(#1a1e21, 1);
      border: 1px solid #07ebad;
      color: #07ebad;
      border-radius: 10px;
    }

    .ant-input-affix-wrapper {
      width: auto;
      background: rgba(#1a1e21, 1);
      .ant-input-suffix {
        color: #07ebad;
      }
      input {
        // background-color: #fff;
        background: rgba(#1a1e21, 1);
        text-align: center !important;
        font-size: 14px;
        line-height: 20px;
        // font-weight: 600;
        border-radius: 10px;
      }
    }
  }
  .btn-box {
    display: flex;
    margin-top: 40px;
    justify-content: space-between;
  }
  .disconnect-btn-box {
    width: 168px;
    height: 48px;
    font-size: 16px;
    border-radius: 10px;
    padding: 2px;
    background: linear-gradient(214deg, #59bdad 0%, #6676f5 61%, #9a89f9 76%, #eba7ff 100%);
    .disconnect-btn {
      width: 100%;
      height: 100%;
      border: none;
      background: #1b2023 !important;
      border-radius: 10px;
      color: #fff;
    }
  }
  .switch-wallet-btn {
    width: 168px;
    height: 48px;
    background: linear-gradient(214deg, #59bdad 0%, #6676f5 61%, #9a89f9 76%, #eba7ff 100%) !important;
    font-size: 16px;
    margin-left: 12px;
    border-radius: 10px;
    color: #fff;
    border: none;
  }
}
</style>

