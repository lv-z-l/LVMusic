<template>
  <view class="no-login">
    <image class="img" src="../../static/tologin.svg"></image>
    <text class="to-login" @tap="toLogin">{{ store.langObj.needLogin }}</text>
  </view>
</template>
<script setup>
import { useStore } from '../../store/main'

const store = useStore()
function toLogin() {
  store.setCurrentBar('mine')
}
</script>
<style lang="scss">
.no-login {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 8rem;

  transform: translate3d(-50%, -50%, 0);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .img {
    width: 7rem;
    height: 7rem;
  }

  .to-login {
    text-decoration: underline;
    color: $bottom-bar-active-color;
  }
}
</style>