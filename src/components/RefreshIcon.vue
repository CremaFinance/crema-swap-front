<template>
  <div class="icon-box refresh-icon-box">
    <svg :class="['icon', loading ? 'is-loading' : '']" aria-hidden="true" @click="refresh">
      <use xlink:href="#icon-icon-refresh"></use>
    </svg>
  </div>
</template>
<script lang="ts">
import { Vue } from 'nuxt-property-decorator'

export default Vue.extend({
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    refresh() {
      this.$emit('refresh')
    }
  }
})
</script>
<style lang="less" scoped>
.refresh-icon-box {
  width: 30px;
  height: 30px;
  background: linear-gradient(141deg, #383e49 0%, #1a1c1f 100%);
  box-shadow: 2px 4px 12px 0px #23262b, -3px -2px 10px 0px rgba(138, 147, 160, 0.16);
  border-radius: 15px;
  padding: 6px;
  margin-left: 10px;
  cursor: pointer;
  &:hover {
    background: linear-gradient(141deg, #424953 0%, #2a2e33 100%);
  }
  svg {
    width: 18px;
    height: 18px;
    fill: #fff;
    // margin-left: 20px;
  }
  .is-loading {
    animation: spin 1s linear infinite;
  }
}

@keyframes spin {
  to {
    transform: rotate(1turn);
  }
}
</style>