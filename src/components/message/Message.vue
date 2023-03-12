<template>
  <view :class="['message', show ? '' : 'hide']">
    <text :class="['iconfont', msgtype === 'normal' ? 'icon-tishi' : 'icon-zhengque']"></text>
    <view class="text">{{ message }}</view>
  </view>
</template>
<script setup>
import { ref } from 'vue';

const message = ref('')
const show = ref(false)

const msgtype = ref('normal')


function open({ msg, type }) {
  message.value = msg
  msgtype.value = type
  show.value = true
  setTimeout(() => close(), 2000)
}

function close() {
  show.value = false
}

defineExpose({
  open,
  close
})

</script>
<style lang="scss">
.message {
  display: flex;
  width: 40%;
  box-sizing: border-box;
  height: calc(4 * $bottom-bar-icon-size);
  padding: $bottom-bar-icon-size 0;
  position: fixed;
  top: 50%;
  left: 50%;
  max-width: 200px;
  border-radius: $border-radius;
  z-index: 999;
  transition: $transition;
  background-color: var(--message-bg);
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 1;
  transform: translateX(0) translate3d(-50%, -50%, 0);

  .iconfont {
    font-size: 2rem;
    color: var(--global-color);
  }

  &.hide {
    transform: translateX(-100vw) translate3d(-50%, -50%, 0);
    opacity: 0;
  }
}
</style>