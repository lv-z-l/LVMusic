<template>
  <view class="back" @click="store.back">
    ◀︎
  </view>
</template>
<script setup>
import { useStore } from '../../store/main';

const store = useStore()

</script>
<style lang="scss">
.back {
  width: 100%;
  padding: 5.33%;
  position: absolute;
  box-sizing: border-box;
  color: $white-color;
  top: 0;
  left: 0;
}
</style>