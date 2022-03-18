<template>
  <Modal
    title="Settings"
    :z-index="1070"
    centered
    width="400px"
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
      <div
        v-if="slippage"
        class="slippage-hint"
        :class="
          Number(slippage) > 1 && 50 >= Number(slippage)
            ? 'slippage-hint-waring'
            : Number(slippage) > 50
            ? 'slippage-hint-error'
            : ''
        "
      >
        {{
          Number(slippage) > 1 && 50 >= Number(slippage)
            ? 'Your transaction may be fronturn'
            : Number(slippage) > 50
            ? 'Enter a valid slippage percentage'
            : ''
        }}
      </div>
      <div class="btn-box">
        <!-- <div class="disconnect-btn-box"> -->
        <Button class="disconnect-btn" @click="$emit('onClose')"> Cancel </Button>
        <!-- </div> -->
        <div class="switch-wallet-btn-box">
          <Button class="switch-wallet-btn" :disabled="Number(slippage) > 50" @click="confirmSlippage">
            Confirm
          </Button>
        </div>
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
@import '../styles/base.less';
.pool-setting {
  // padding-bottom: 43px;
  .slippage-tolerance {
    margin-top: 14px;
    color: #b5b8c2;
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
      // color: #07ebad;
      color: #fff;
      text-align: center;
      line-height: 40px;
      box-shadow: 0px 4px 12px 0px #25282c;
      border-radius: 10px;
      border: 1px solid #3f434e;
    }
    .slippage-item-active {
      background: #42454b;
      box-shadow: 0px 2px 6px 0px rgba(26, 28, 31, 0.5);
      border-radius: 10px;
      color: #07ebad;
      border: 1px solid #07ebad;
    }
    input {
      width: 80px;
      height: 40px;
      // background: rgba(#1a1e21, 1);
      // border: 1px solid #07ebad;
      color: #fff;
      border: none;
      background: #23262b;
      box-shadow: 0px 2px 3px 1px #1a1c1f;
      border-radius: 10px;
    }

    .ant-input-affix-wrapper {
      width: auto;
      .ant-input-suffix {
        color: #fff;
      }
      input {
        // background-color: #fff;
        text-align: center !important;
        font-size: 14px;
        line-height: 20px;
        background: #23262b;
        box-shadow: 0px 2px 3px 1px #1a1c1f;
        // font-weight: 600;
        border-radius: 10px;
      }
    }
  }
  .slippage-hint {
    margin-top: 14px;
  }
  .slippage-hint-waring {
    color: #fb0;
  }
  .slippage-hint-error {
    color: #ff5050;
  }
  .btn-box {
    display: flex;
    margin-top: 40px;
    justify-content: space-between;
  }
  .disconnect-btn {
    width: 168px;
    height: 48px;
    box-shadow: 0px 4px 12px 0px #25282c;
    border-radius: 12px;
    font-size: 16px;
    border: 1px solid #3f434e;
    font-weight: 600;
    background: transparent;
    &:hover {
      background: rgba(255, 255, 255, 0.05);
    }
  }
  .switch-wallet-btn-box {
    width: 168px;
    height: 46px;
    margin-top: 0;
    margin-left: 0 !important;
    border-radius: 12px;
    .switch-wallet-btn {
      .gradient-btn-large();
      // width: 100%;
      height: 100%;
      // color: #fff;
      // border: none;
      font-size: 16px;
      // background: linear-gradient(268deg, #5fe6d0 0%, #597bff 38%, #9380ff 72%, #e590ff 100%);
      // border-radius: 12px;
      // line-height: 46px;
      // font-weight: 600;
      // &:hover {
      //   background: linear-gradient(270deg, #93ffed 0%, #84caff 34%, #a291ff 68%, #efb9ff 100%);
      // }
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
}
</style>

