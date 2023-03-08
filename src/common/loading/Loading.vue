<template>
  <view class="loading" v-show="store.loading">
    <text class="icon-loading"></text>
    <text class="text">{{ store.langObj.loading }}</text>
  </view>
</template>
<script setup>
import { useStore } from '../../store/main'

const store = useStore()
</script>
<style lang="scss">
.loading {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 8rem;

  transform: translate3d(-50%, -50%, 0);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  [class^=icon] {
    font-size: 2rem;
    animation: roate-loading 1s ease infinite;
  }

  .text {
    font-size: 0.8rem;
    padding-top: .3rem;
  }
}

@keyframes roate-loading {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>