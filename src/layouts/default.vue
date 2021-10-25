<template>
  <div class="layout-container">
    <div class="pc-header-container">
      <Head></Head>
    </div>
    <div class="h5-header-container">
      <H5Head></H5Head>
    </div>
    <div class="body-container">
      <Nuxt />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

import { Layout } from 'ant-design-vue'
import Head from './components/head.vue'
import H5Head from './components/h5-head.vue'

const { Content } = Layout

@Component({
  components: {
    Layout,
    Content,
    Head,
    H5Head
  }
})
export default class Default extends Vue {}
</script>

<style lang="less">
.ant-layout-content {
  min-height: calc(100vh - 64px - 82px);
}
.layout-container {
  width: 100%;
  min-height: 100vh;
  background: #1b2023;
}
.pc-header-container {
  display: block;
  padding: 0px 40px;
  position: fixed;
  left: 0px;
  top: 0px;
  width: 100%;
  box-sizing: border-box;
}
.body-container {
  width: 100%;
  min-height: 100vh;
  padding-top: 200px;
  padding-bottom: 40px;
}
.h5-header-container {
  display: none;
}
@media screen and (max-width: 750px) {
  .h5-header-container {
    display: block;
  }
  .pc-header-container {
    display: none;
  }
  .body-container {
    padding-top: 0;
  }
}
</style>
