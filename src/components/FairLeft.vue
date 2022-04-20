<template>
  <div class="fair-detail-all">
    <div class="fair-detail-pc">
      <div class="fair-title">
        <img v-if="notBegun || underwayWith || underway" src="@/assets/images/fair-title.png" alt="" />
        <img v-if="claimLater || claimLaterNot || theEnd" src="@/assets/images/fair-token-title.png" alt="" />
        <div>
          Learn more
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-icon-right"></use>
          </svg>
        </div>
      </div>
      <p v-if="notBegun || underwayWith || underway">Deposit start in</p>
      <div v-if="notBegun || underwayWith || underway" class="fair-count-down">
        <span>{{ day }}</span> : <span>{{ hour }}</span> : <span>{{ min }}</span> :
        <span>{{ sec }}</span>
      </div>
      <div v-if="notBegun || underwayWith || underway" class="fair-date">
        <span>Day</span>
        <span>Hours</span>
        <span>Min</span>
        <span>Sec</span>
      </div>
      <div v-if="notBegun || underwayWith || underway" class="fair-crm">
        <p>CRM for Sale</p>
        <div>600,000.000</div>
      </div>
      <div class="fair-crm" v-if="claimLater || claimLaterNot || theEnd || underwayWith || underway">
        <p>Total USDC Depoit</p>
        <div>600,000.000</div>
      </div>
      <div class="fair-crm fair-cany" v-if="claimLater || claimLaterNot || theEnd">
        <p>CRM pre USDC</p>
        <div>10.1234</div>
      </div>
    </div>
    <div class="fair-hint-pc">
      <div class="hint-dim" v-if="!notBegun">
        <p v-if="theEnd" style="width: auto; margin: 0">Claim your CRM tokens</p>
        <p v-if="claimLater" style="width: auto; margin: 0">Claimable tokens</p>

        <div v-if="claimLater || theEnd">
          <img src="@/assets/images/icon_coins.png" alt="" />
          <span>123456789.01</span>
          <span v-if="claimLater">CRM</span>
        </div>

        <h3 style="margin: 0" v-if="claimLaterNot">You did not contribute to the token sale</h3>

        <Button v-if="theEnd" class="action-btn"> Claim </Button>
        <div class="journey-fair" v-if="underwayWith || underway">
          <img src="@/assets/images/fair-sjzan.png" alt="" />
          <span>The journey starts hear</span>
        </div>
        <p v-if="underwayWith || underway">When you're ready, deposit your USDC</p>
        <div class="Half-Max-fair" v-if="underwayWith || underway">
          <span><img src="@/assets/images/fair-icon-wallet.png" alt="" />1234567890.0001 USDC</span>
          <div>1/4</div>
          <div>Half</div>
          <div>Max</div>
        </div>
        <div class="value-fair" v-if="underwayWith || underway">
          <img src="@/assets/images/icon_USDC.png" alt="" />
          <input
            type="text"
            :value="fairvalue"
            autocomplete="off"
            autocorrect="off"
            placeholder="0.00"
            pattern="^[0-9]*[.,]?[0-9]*$"
            minlength="1"
            maxlength="79"
            spellcheck="false"
            :disabled="disabled"
            @input="changeInput($event.target.value)"
            @focus="changeS"
          />
        </div>
        <Button v-if="underwayWith || underway" class="action-btn" @click="change('Deposit')">
          Set Contribution
        </Button>
      </div>
      <div class="fair-Deposit" v-if="underwayWith">
        <div class="fair-Deposit-left">
          <p>Deposit</p>
          <p>123456.0123 USDC</p>
        </div>
        <Button class="action-btn with-fair" @click="change('Withdraw')"> Withdraw </Button>
      </div>
    </div>
    <Modal :width="440" :visible="closeIc" :footer="null" @ok="handleOk" centered @cancel="handleCancel">
      <template slot="closeIcon">
        <svg class="icon modal-icon-close" aria-hidden="true">
          <use xlink:href="#icon-icon-close"></use>
        </svg>
      </template>

      <div class="fair-hint-pc fair-hint-detail">
        <div class="hint-dim hint-tkanc">
          <div class="journey-fair">
            <img src="@/assets/images/fair-sjzan.png" alt="" />
            <span>{{ popout }}</span>
          </div>
          <p v-if="popout == 'Deposit'">When you're ready, deposit your USDC</p>
          <div class="Half-Max-fair">
            <span>
              <img v-if="popout == 'Deposit'" src="@/assets/images/fair-icon-wallet.png" alt="" />
              <img v-else src="@/assets/images/fair-icon-withdraw.png" alt="" />
              1234567890.0001 USDC
            </span>
            <div>1/4</div>
            <div>Half</div>
            <div>Max</div>
          </div>
          <div class="value-fair">
            <img src="@/assets/images/icon_USDC.png" alt="" />
            <!-- <span>998.55</span> -->
            <input
              type="text"
              :value="popout == 'Withdraw' ? WithdrawVal : depositVal"
              autocomplete="off"
              autocorrect="off"
              placeholder="0.00"
              pattern="^[0-9]*[.,]?[0-9]*$"
              minlength="1"
              maxlength="79"
              spellcheck="false"
              :disabled="disabled"
              @input="changeInput($event.target.value, popout)"
              @focus="changeS"
            />
          </div>
          <div class="btncf-fa">
            <Button @click="handleOk()" class="disconnect-btn"> Cancel </Button>
            <Button @click="handleOk()" class="action-btn"> {{ popout }} </Button>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { Button, Modal, Icon } from 'ant-design-vue'
Vue.use(Modal)
export default Vue.extend({
  data() {
    return {
      day: '',
      hour: '',
      min: '',
      sec: '',
      closeIc: false, // 弹框控制
      fairvalue: null,
      WithdrawVal: null,
      depositVal: null,
      disabled: false,
      popout: '',

      claimLater: false, // claim后
      claimLaterNot: false, // claim后-未参加活动
      theEnd: false, // 已结束
      notBegun: false, // 未开始
      underwayWith: false, //进行中  deposit
      underway: true //进行中  未deposit
    }
  },
  components: {
    Modal
  },
  mounted() {
    window.setInterval(() => {
      this.countDown('2022-3-30 0:0:0')
    }, 1000)
  },
  methods: {
    changeInput(val) {
      if (this.popout == 'Withdraw') {
        this.WithdrawVal = val
      } else if (this.popout == 'Deposit') {
        this.depositVal = val
        // console.log(this.depositVal)
      } else {
        this.fairvalue = val
      }
      // console.log(this.popout, val, this.WithdrawVal, this.depositVal, this.fairvalue)
    },
    changeS() {
      console.log('Focusing on the trigger')
    },
    change(key) {
      this.closeIc = true
      this.popout = key
    },
    handleOk(e) {
      this.closeIc = false
    },
    handleCancel(e) {
      this.closeIc = false
      this.popout = ''
      this.fairvalue = null
      this.WithdrawVal = null
      this.depositVal = null
    },
    countDown(time) {
      let nowTime = +new Date()
      let inputTime = +new Date(time)
      let times: string | number = (inputTime - nowTime) / 1000
      let d: string | number = parseInt(String(times / 60 / 60 / 24))
      d = Number(String(d).substr(1))
      d = d < 10 ? '0' + d : d
      let h: string | number = parseInt(String((times / 60 / 60) % 24))
      h = Number(String(h).substr(1))
      h = h < 10 ? '0' + h : h
      let m: string | number = parseInt(String((times / 60) % 60))
      m = Number(String(m).substr(1))
      m = m < 10 ? '0' + m : m
      let s: string | number = parseInt(String(times % 60))
      s = Number(String(s).substr(1))
      s = s < 10 ? '0' + s : s
      // return d + '天' + h + '时' + m + '分' + s + '秒';
      this.day = d
      this.hour = h
      this.min = m
      this.sec = s
      // console.log(d, h, m, s)
    }
  }
})
</script>
<style lang="less" scoped>
@import '../styles/base.less';
.fair-detail-all {
  width: 100%;
  height: 100%;
  // background: #000;
  display: flex;
  justify-content: space-between;
}
.fair-detail-pc {
  width: 430px;
  position: relative;
  z-index: 100;
  padding: 128px 0 0;
  .fair-title {
    display: flex;
    align-items: center;
    > div {
      display: flex;
      align-items: center;
      color: #b5b8c2;
      margin-left: 12px;
      cursor: pointer;
      &:hover {
        color: #fff;
        svg {
          fill: #fff;
        }
      }
    }
  }
  img {
    width: 310px;
    height: 36px;
  }
  p {
    margin: 10px 0 20px 4px;
    font-size: 18px;
    font-weight: bold;
  }
  .fair-count-down {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;
    font-size: 32px;
    span {
      width: 80px;
      height: 60px;
      background: rgba(#707070, 0.2);
      border-radius: 8px;
      font-size: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: 'DIN-Regular';
    }
  }
  .fair-date {
    margin-top: 10px;
    font-size: 16px;
    display: flex;
    justify-content: space-between;
    span {
      width: 80px;
      text-align: center;
    }
  }
  .fair-crm {
    p {
      font-size: 18px;
      margin-bottom: 2px;
    }
    > div {
      font-size: 50px;
      font-weight: bold;
      background: linear-gradient(48deg, #d032ff 0%, #8ab6ff 40%, #4ce1ff 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-family: 'DIN-Regular';
    }
  }
  .fair-cany {
    p {
      margin-top: 6px;
    }
  }
}
.fair-hint-pc {
  width: 400px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  align-content: center;
  padding-top: 0px;
  .hint-dim {
    width: 400px;
    // height: 190px;
    padding: 20px 20px;
    border-radius: 20px;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(50px);
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-content: center;
    > div {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
    }
    p {
      width: 100%;
      margin: 0 0 20px 4px;
      text-align: left;
    }
  }
  .hint-tkanc {
    background: none !important;
    padding: 15px 0 0 0 !important;
    .btncf-fa {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
    .action-btn {
      width: 186px !important;
      margin: 0;
    }
  }
  .fair-Deposit {
    width: 400px;
    height: 96px;
    border-radius: 20px;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(30px);
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    .with-fair {
      width: 120px;
      margin: 0;
    }
    .fair-Deposit-left {
      display: flex;
      flex-wrap: wrap;
      align-content: space-between;
      p {
        width: 100%;
        text-align: left;
      }
      > p:nth-child(2) {
        font-size: 18px;
      }
    }
  }
  img {
    width: 36px;
    height: 36px;
  }
  p {
    font-size: 14px;
    text-align: center;
    margin: 0;
  }
  span {
    font-size: 36px;
    margin-left: 8px;
  }
  h3 {
    font-weight: bold;
    font-size: 20px;
    background: linear-gradient(48deg, #d032ff 0%, #8ab6ff 53%, #4ce1ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .action-btn {
    .gradient-btn-large();
    margin: 0 auto;
    width: 360px;
    line-height: 1;
    border: 0 solid rgba(232, 228, 255, 0.5) !important;
    height: 48px;
    font-size: 16px;
    font-weight: 100;
  }
  .disconnect-btn {
    width: 186px;
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
}

svg {
  width: 20px;
  height: 20px;
  fill: #b5b8c2;
  margin-left: 4px;
}
.journey-fair {
  justify-content: flex-start !important;
  margin-bottom: 0 !important;
  span {
    font-size: 18px;
    font-weight: bold;
  }
  img {
    width: 46px;
    height: 36px;
  }
}
.Half-Max-fair {
  justify-content: space-between !important;
  margin-top: 20px;
  span {
    font-size: 14px;
    margin: 0 !important;
  }
  img {
    width: 20px !important;
    height: 20px !important;
    margin-right: 6px;
  }
  > div {
    width: 48px;
    height: 24px;
    border: #909090 1px solid;
    border-radius: 4px;
    text-align: center;
    cursor: pointer;
    &:hover {
      border: #fff 1px solid;
      color: #fff !important;
      background: rgba(#fff, 0.2);
    }
  }
  > div:nth-child(4) {
    border: #07ebad 1px solid;
    background: rgba(#07ebad, 0.2);
    color: #07ebad;
    &:hover {
      color: #07ffbd !important;
      background: rgba(#07ffbd, 0.4);
      border: #07ffbd 1px solid;
    }
  }
}
.value-fair {
  width: 360px;
  height: 60px;
  background: rgba(#000, 0.2);
  border-radius: 10px;
  justify-content: space-between !important;
  padding: 0 12px;
  img {
    width: 32px;
    height: 32px;
  }
  margin-bottom: 32px !important;
}
.ant-modal {
  background: #000 !important;
}
input {
  height: 32px;
  width: 80%;
  font-family: 'DIN-Regular' !important;
  font-size: 32px;
  color: #fff;
  border: none;
  background: none;
  padding-left: 10px;
  text-align: right;
}
@media screen and (max-width: 750px) {
  .fair-detail-all {
    flex-wrap: wrap;
  }
  .fair-detail-pc {
    width: 100%;
    padding: 20px 0 0 0;
    margin-bottom: 20px;
    .fair-title {
      justify-content: center;
      flex-wrap: wrap;
    }
    .fair-crm {
      text-align: center;
    }
    p {
      margin: 10px 0 20px 0;
      text-align: center;
    }
    .fair-count-down {
      span {
        width: 64px;
        height: 48px;
        background: rgba(#707070, 0.2);
        border-radius: 8px;
        font-size: 32px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
  .fair-hint-pc {
    width: 100%;
    height: 440px;
    .hint-dim {
      width: 100%;
    }
  }
  .fair-hint-detail {
    height: auto;
    .hint-tkanc {
      .action-btn {
        width: 45% !important;
        margin: 0;
      }
      .disconnect-btn {
        width: 45% !important;
      }
    }
  }
  .Half-Max-fair {
    flex-wrap: wrap;
    > div {
      width: 80px;
      height: 24px;
      border: #909090 1px solid;
      border-radius: 4px;
      text-align: center;
      margin-top: 10px !important;
    }
    > span {
      display: block !important;
      width: 90% !important;
    }
    // img {
    //   margin-right: 0px !important;
    // }
  }
}
</style>
