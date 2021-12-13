<template>
  <div class="set-icon-container">
    <div class="set-icon-box">
      <div class="set-icon-content">
        <svg class="icon" aria-hidden="true" @click="showSetting = true">
          <use xlink:href="#icon-a-bianzu81"></use>
        </svg>
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
  }
})
</script>
<style lang="less" scoped>
.set-icon-container {
  .set-icon-box {
    width: 30px;
    height: 30px;
    padding: 1px;
    border-radius: 15px;
    background: linear-gradient(137deg, rgba(35, 38, 43, 1), rgba(62, 67, 78, 1));
    .set-icon-content {
      width: 28px;
      height: 28px;
      border-radius: 14px;
      background: linear-gradient(141deg, #383e49 0%, #1a1c1f 100%);
      box-shadow: 2px 4px 12px 0px #23262b, -3px -2px 10px 0px rgba(138, 147, 160, 0.16);
      // border-radius: 15px;
      // border: 1px solid;
      // border-image: linear-gradient(137deg, rgba(35, 38, 43, 1), rgba(62, 67, 78, 1)) 1 1;
      display: flex;
      align-items: center;
      justify-content: center;
      &:hover {
        background: linear-gradient(141deg, #424953 0%, #2a2e33 100%);
      }
      .icon {
        width: 16px;
        height: 16px;
        fill: #fff;
        cursor: pointer;
      }
    }
  }
}
</style>
