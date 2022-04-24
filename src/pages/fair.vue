<template>
  <div class="fair-container">
    <div class="fair-container-center">
      <div class="fair-coin">
        <div class="fair-coin-one"></div>
        <div class="fair-coin-two"></div>
        <div class="fair-coin-three"></div>
        <div class="fair-coin-four"></div>
      </div>
      <FairLeft />
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { Input } from 'ant-design-vue'
export default Vue.extend({
  data() {
    return {
      poolStatus: ''
    }
  },
  methods: {}
})
</script>
<style lang="less" scoped>
@keyframes icon {
  0% {
    // opacity: 0.8;
    transform: translate(0, 0);
  }
  50% {
    transform: translate(0px, 15px);
  }
  100% {
    transform: translate(0, 0);
  }
}
@keyframes iconK {
  0% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(0px, 23px);
  }
  100% {
    transform: translate(0, 0);
  }
}
@keyframes iconM {
  0% {
    transform: translate(0, 0);
    // transform: translateX(800px) scale(1.5) rotate(360deg);
  }
  50% {
    transform: translate(0px, 30px);
  }
  100% {
    transform: translate(0, 0);
  }
}
.fair-container {
  overflow: hidden;
  margin-top: -20px;
  padding-top: 80px;
  .fair-container-center {
    width: 1100px;
    height: 700px;
    padding: 0 80px;
    margin: auto;
    position: relative;
  }
}
.fair-coin {
  position: relative;
  position: absolute;
  right: 0;
  top: 0;
  width: 660px;
  height: 600px;
  background: url('@/assets/images/img-bgs-fairs.png');
  background-size: 100% 100%;
  animation: iconK 6s linear infinite;
}
.fair-coin-one {
  width: 74px;
  height: 82px;
  background: url('@/assets/images/img-token-fair.png');
  background-size: 100% 100%;
  position: absolute;
  top: 300px;
  left: 137px;
  animation: icon 2s linear infinite;
}
.fair-coin-two {
  width: 24px;
  height: 89px;
  background: url('@/assets/images/img-arrow-one.png');
  background-size: 100% 100%;
  position: absolute;
  top: 208px;
  left: 280px;
  animation: iconM 2s linear infinite;
}
.fair-coin-three {
  width: 12px;
  height: 128px;
  background: url('@/assets/images/img-arrow-two.png');
  background-size: 100% 100%;
  position: absolute;
  top: 156px;
  left: 436px;
  animation: iconM 3s linear infinite;
}
.fair-coin-four {
  width: 100px;
  height: 106px;
  background: url('@/assets/images/img-token-two-fair.png');
  background-size: 100% 100%;
  position: absolute;
  top: 410px;
  left: 484px;
  animation: icon 3s linear infinite;
}
@media screen and (max-width: 1370px) {
  .fair-container {
    margin-top: -40px;
  }
}
@media screen and (max-width: 750px) {
  .fair-container {
    width: 100%;
    margin-top: 20px;
    padding: 0px 0px 0;
    background: none;
    .fair-container-center {
      width: 100%;
      height: auto;
      padding: 0;
    }
  }
  .fair-coin {
    // display: none;
    width: 100%;
    height: 316px;
    top: 400px;
  }
}
</style>
