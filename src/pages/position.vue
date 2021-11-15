<template>
  <div class="positon-container">
    <div class="position-title">
      <span>Your Positions {{ list.length > 0 ? `( ${list.length} )` : '' }}</span>
      <div class="btn-list">
        <button>
          <div @click="gotoPool">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-a-icon-AddCustomMarket"></use>
            </svg>
            <span>New Position</span>
          </div>
        </button>
        <!-- <button> -->
        <!-- <div>
          <CheckBox v-model="isShowClosedPositions">Show closed positions</CheckBox>
        </div> -->
        <!-- </button> -->
      </div>
    </div>
    <div v-if="list.length > 0" class="position-list">
      <PositionBlock v-for="(item, index) in list" :key="index" :p-item="item"></PositionBlock>
      <!-- <PositionBlock btn-type="closed"></PositionBlock> -->
    </div>
    <div v-else class="no-data">
      <img src="../assets/images/icon_NoDate@2x.png" />
      <p>No data</p>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

export default Vue.extend({
  data() {
    return {
      isShowClosedPositions: false
    }
  },
  computed: {
    ...mapState(['position']),
    list() {
      return this.$data && this.$data.isShowClosedPositions
        ? this.position.myPositions
        : this.position.myPositions.filter((posions: any) => {
            return posions.liquity > 0
          })
    }
  },
  mounted() {},
  methods: {
    gotoPool() {
      this.$router.push('/pool')
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
      display: flex;
      align-items: center;
      button {
        padding: 1px;
        border-radius: 4px;
        background: none;
        // margin-right: 11px;
        > div {
          height: 28px;
          padding: 0px 16px;
          font-size: 14px;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #33383b;
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

  .no-data {
    width: 100%;
    min-height: 260px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 30px;
    margin-top: 20px;
    img {
      width: 80px;
      height: 80px;
    }
    p {
      color: rgba(255, 255, 255, 0.8);
      padding-top: 10px;
    }
  }
}
@media screen and (max-width: 750px) {
  .positon-container {
    width: 100%;
    padding: 20px 16px 0;
    .position-title {
      display: block;
      span {
        font-size: 16px;
      }
      .btn-list {
        margin-top: 20px;
      }
    }
  }
}
</style>
