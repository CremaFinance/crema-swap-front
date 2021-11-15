<template>
  <div class="pop-up">
    <p>{{popupName}}</p>
    <span>{{popupNum}}</span>
    <p class="pop-up-crm">CRM per USDT</p>
    <p class="pop-up-bottom">Your position will be 100% composed of CRM at this price</p>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  model: {
    prop: 'value',
    event: 'onInput'
  },
  props: {
    popupNum: {
      type: String,
      default: ''
    },
    popupName: {
      type: String,
      default: ''
    },
    
  },
  methods: {}
})
</script>
<style lang="less" scoped>
.pop-up{
    width: 191px;
    height: 140px;
    background: rgba(#fff,0.04);
    border-radius: 10px;
    padding: 10px;
    p{
        height: 10px;
        font-size: 10px;
        text-align: center;
        margin-bottom: 0px;
        color: rgba(#fff,0.5);
    }
    span{
        display: block;
        width: 171px;
        height: 14px;
        font-size: 14px;
        font-weight: bold;
        font-family: 'Arial Bold';
        text-align: center;
        margin-top: 14px;
    }
    .pop-up-crm{
        margin-top: 12px;
    }
    .pop-up-bottom{
        height: 44px;
        margin-top: 16px;
        display: flex;
        align-items: flex-end;
        border-top: 1px solid rgba(#fff, 0.1);
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
