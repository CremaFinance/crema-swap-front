<template>
  <div class="set-icon-container">
    <div class="set-icon-box" @click="showSetting = true">
      <div class="set-icon-content">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-a-bianzu81"></use>
        </svg>
        <span>{{ slippageView }}</span>
      </div>
    </div>
    <Setting v-if="showSetting" @onClose="() => (showSetting = false)"></Setting>
  </div>
</template>

<script lang="ts">
import { Vue } from 'nuxt-property-decorator'
// import { mapState } from 'vuex'
export default Vue.extend({
  data() {
    return {
      showSetting: false
    }
  },
  computed: {
    slippageView() {
      return `${this.$accessor.slippage}%`
    }
  }
})
</script>
<style lang="less" scoped>
.set-icon-container {
  .set-icon-box {
    // width: 68px;
    // height: 28px;
    // // padding: 1px;
    // background: linear-gradient(270deg, #3e434e 0%, #282a2f 100%);
    // box-shadow: 0px 4px 12px 0px rgba(26, 28, 31, 0.5);
    // border-radius: 8px;
    // border: 1px solid #3f434e;
    .set-icon-content {
      // width: 68px;
      height: 28px;
      padding: 0px 8px;
      // padding: 1px;
      background: linear-gradient(270deg, #3e434e 0%, #282a2f 100%);
      box-shadow: 0px 4px 12px 0px rgba(26, 28, 31, 0.5);
      border-radius: 8px;
      border: 1px solid #3f434e;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      &:hover {
        // background: linear-gradient(141deg, #424953 0%, #2a2e33 100%);
        background: #464953;
      }
      .icon {
        width: 16px;
        height: 16px;
        fill: #fff;
        cursor: pointer;
      }
      span {
        font-size: 12px;
        margin-left: 4px;
      }
    }
  }
}
</style>
