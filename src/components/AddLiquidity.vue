<template>
  <Modal title="Select a token" :visible="true" centered :footer="null" @cancel="$emit('onClose')"> 111 </Modal>
</template>
<script lang="ts">
import Vue from 'vue'
import { Modal } from 'ant-design-vue'

Vue.use(Modal)

export default Vue.extend({
  components: {
    Modal
  }
})
</script>

