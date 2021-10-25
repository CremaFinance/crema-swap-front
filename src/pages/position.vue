<template>
  <div class="positon-container">
    <div class="position-title">
      <span>Your Positions (2)</span>
      <div class="btn-list">
        <button>
          <div>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-a-icon-AddCustomMarket"></use>
            </svg>
            <span>New Position</span>
          </div>
        </button>
        <!-- <button> -->
        <div>
          <CheckBox v-model="isShowClosedPositions">Show closed positions</CheckBox>
        </div>
        <!-- </button> -->
      </div>
    </div>
    <div class="position-list">
      <PositionBlock></PositionBlock>
      <PositionBlock btn-type="closed"></PositionBlock>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      isShowClosedPositions: false
    }
  }
})
</script>
<style lang="less" scoped>
.positon-container {
  width: 800px;
  margin: 0 auto;
  .position-title {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    > span {
      font-size: 24px;
      color: #fff;
    }
    .btn-list {
      button {
        padding: 1px;
        border-radius: 4px;
        background: none;
        > div {
          height: 28px;
          padding: 0px 16px;
          font-size: 14px;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #1b2023;
          border: none;
          position: relative;
          z-index: 1;
          border-radius: 4px;
          > svg {
            width: 16px;
            height: 16px;
            fill: rgba(255, 255, 255, 0.5);
            margin-right: 4px;
          }
        }
        &:hover {
          background: linear-gradient(214deg, #59bdad 0%, #6676f5 61%, #9a89f9 76%, #eba7ff 100%);
        }
      }
    }
  }
}
</style>
