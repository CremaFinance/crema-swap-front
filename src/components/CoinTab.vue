<template>
  <div class="coin-tab">
    <div
      v-for="(item, index) in list"
      :key="index"
      :class="item === current ? 'active' : ''"
      @click="changeDirection(item)"
    >
      {{ item }}
    </div>
  </div>
</template>
<script lang="ts">
import { Vue } from 'nuxt-property-decorator'
export default Vue.extend({
  props: {
    list: {
      type: Array,
      default: () => {
        return ['-', '']
      }
    },
    current: {
      type: String,
      default: '-'
    }
  },
  data() {
    return {
      showSetting: false
    }
  },
  methods: {
    changeDirection(value: string) {
      if (value !== this.current) {
        this.$emit('onChange', value)
      }
    }
  }
})
</script>

<style lang="less" scoped>
.coin-tab {
  // width: 126px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  background: rgba(255, 255, 255, 0.1);
  > div {
    width: 62px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: #fff;
    cursor: pointer;
    &.active {
      background: linear-gradient(268deg, #60d7f5 0%, #577af5 38%, #a670e6 100%);
    }
  }
}
</style>
