<template>
  <div class="contactus-box">
    <Dropdown>
      <div class="contactus-icon">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-more"></use>
        </svg>
      </div>
      <div slot="overlay" class="contactus-list">
        <!-- <a>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-docs"></use>
          </svg>
          <span>Docs</span>
        </a> -->
        <a href="https://twitter.com/Crema_Finance" target="_blank" rel="noopener noreferrer">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-twitter"></use>
          </svg>
          <span>Twitter</span>
        </a>
        <a href="https://t.me/cremafinance" target="_blank" rel="noopener noreferrer">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-telegram"></use>
          </svg>
          <span>Telegram</span>
        </a>
        <a href="https://medium.com/@Crema.finance" target="_blank" rel="noopener noreferrer">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-medium"></use>
          </svg>
          <span>Medium</span>
        </a>
        <a href="https://discord.gg/hCaFmvvPYH" target="_blank" rel="noopener noreferrer">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-discord"></use>
          </svg>
          <span>Discord</span>
        </a>
      </div>
    </Dropdown>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { Dropdown } from 'ant-design-vue'
export default Vue.extend({
  components: {
    Dropdown
  }
})
</script>
<style lang="less" scoped>
.contactus-box {
  margin-left: 20px;
}
.contactus-icon {
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    fill: #fff;
    width: 24px;
    height: 24px;
  }
}
.contactus-list {
  min-width: 119px;
  // height: 258px;
  background: #252a2d;
  border-radius: 20px;
  padding: 20px 0px;
  a {
    display: flex;
    align-items: center;
    align-self: center;
    // width: 119px;
    height: 30px;
    border-radius: 7px;
    color: #fff;
    font-size: 14px;
    padding: 0 16px;
    // margin-top: 10px;
    & + a {
      margin-top: 20px;
    }
    // &:first-child {
    //   margin-top: 0px;
    // }
    svg {
      width: 20px;
      height: 20px;
      fill: #fff;
    }
    span {
      margin-left: 20px;
    }
    &:hover {
      background: rgba(#fff, 0.1);
      border-radius: 7px;
    }
  }
}
</style>
