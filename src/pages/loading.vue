<template>
  <Spin size="large" />
</template>
<script lang="ts">
import Vue from 'vue'
import { Spin } from 'ant-design-vue'

export default Vue.extend({
  components: {
    Spin
  }
})
</script>
<style lang="less" scoped>
.ant-spin-spinning {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>