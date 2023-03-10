<template>
  <view :style="{ width: w, height: h }" :class="'lazy-placeholder' + id" v-if="!load"></view>
  <slot v-else></slot>
</template>
<script>
export default {
  props: {
    w: String,
    h: String,
    id: Number | String
  },
  data() {
    return {
      load: false
    }
  },
  mounted() {
    if (!this.id) {
      return
    }
    this.$nextTick(() => {
      this.observer = uni.createIntersectionObserver(this);
      this.observer.relativeToViewport({
        bottom: 0,
        right: 0
      }).observe('.lazy-placeholder' + this.id, (res) => {
        if (res.intersectionRatio > 0) {
          this.load = true
          this.observer.disconnect()
          this.observer = null
        }
      })
    })
  },
  beforeUnmount() {
    this.observer.disconnect()
  }
}
</script>
<style lang="scss"></style>