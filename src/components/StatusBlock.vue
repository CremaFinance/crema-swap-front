<template>
  <Tooltip overlayClassName="customize-tooltip">
    <template slot="title">
      <div v-if="currentStatus === 'Active'" class="active-tooltip">
        The price of this pool is currently within your position price range.
      </div>
      <div v-if="currentStatus === 'Inactive'" class="active-tooltip">
        The price of this pool is currently out of your position price range.
      </div>
    </template>
    <div class="deta-block-status">
      <div v-if="currentStatus === 'Closed'">
        <span>Closed</span>
      </div>
      <div v-else-if="currentStatus === 'Active'">
        <i class="circle"></i>
        <span>{{ currentStatus }}</span>
      </div>
      <div v-else>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-icon-tips"></use>
        </svg>
        <span>{{ currentStatus }}</span>
      </div>
    </div>
  </Tooltip>
</template>
<script lang="ts">
import Vue from 'vue'
import { Tooltip } from 'ant-design-vue'
export default Vue.extend({
  // eslint-disable-next-line vue/require-prop-types
  components: {
    Tooltip
  },
  props: ['currentStatus']
})
</script>
<style lang="less" scoped>
.deta-block-status {
  // position: relative;
  cursor: pointer;
  width: 100px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: rgba(#fff, 0.1);
  border-radius: 8px;
  text-align: center;
  div {
    display: flex;
    align-items: center;
  }
  .circle {
    display: block;
    width: 6px;
    height: 6px;
    background: #00ff4d;
    border-radius: 50%;
  }
  svg {
    width: 20px;
    height: 20px;
  }
  span {
    width: 63px;
    height: 28px;
    line-height: 28px;
    font-size: 15px;
    font-family: 'Arial Bold';
    font-weight: bold;
  }
}

@media screen and (max-width: 750px) {
  .coin-block {
    .input-block {
      input {
        width: 100px;
      }
    }
  }
}
</style>
