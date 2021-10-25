<template>
  <div :class="['c-checkbox', disabled ? 'disabled' : '']" @click="toggle">
    <img v-if="!cvalue" src="../assets/images/select_check.png" />
    <img v-else src="../assets/images/select_check.png" />
    <label class="label"><slot></slot></label>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'CCheckbox',
  props: {
    value: {
      type: Boolean,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      cvalue: this.value
    }
  },
  watch: {
    value(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.cvalue = newVal
      }
    },
    cvalue(newVal) {
      this.$emit('input', newVal)
    }
  },
  methods: {
    toggle() {
      this.cvalue = !this.cvalue
    }
  }
})
</script>
<style lang="less" scoped>
.c-checkbox {
  display: flex;
  align-items: center;
  cursor: pointer;
  img {
    width: 16px;
    height: 16px;
    margin-right: 4px;
  }
  > label {
    font-size: 14px;
    color: #fff;
  }
}
</style>
