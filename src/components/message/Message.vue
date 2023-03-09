<template>
  <view :class="['message', show ? '' : 'hide']">
    <svg t="1677727517160" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
      p-id="2260" width="32" height="32">
      <path d="M511.5904 779.5712m-150.6816 0a150.6816 150.6816 0 1 0 301.3632 0 150.6816 150.6816 0 1 0-301.3632 0Z"
        fill="rgb(241, 18, 56)" p-id="2261"></path>
      <path
        d="M838.5536 804.1472H184.6272c-22.4256 0-43.1616-12.1344-54.1696-31.6416a62.3104 62.3104 0 0 1 0.9728-62.72l46.6432-77.0048 0.1024-201.472c0-183.1424 148.992-332.1856 332.1856-332.1856 183.1424 0 332.1856 148.992 332.1856 332.1856v206.4896l47.2576 69.0176c13.1072 19.0976 14.5408 43.6736 3.7888 64.1536-10.8032 20.48-31.8976 33.1776-55.04 33.1776zM510.4128 160.5632c-149.2992 0-270.7456 121.4464-270.7456 270.7456v201.0624c0 11.3664-3.1232 22.4768-9.0112 32.2048l-46.6432 77.056c-0.1536 0.512 0.1024 0.9728 0.256 1.0752l654.2848 0.0512c0.5632-0.1536 0.8192-0.6144 0.768-0.8192l-47.3088-68.9152c-7.168-10.3936-10.9056-22.5792-10.9056-35.2256V431.3088c0-149.2992-121.4464-270.7456-270.6944-270.7456z"
        fill="rgba(0, 0, 0, 0.5)" p-id="2262"></path>
    </svg>
    <view class="text">{{ message }}</view>
  </view>
</template>
<script setup>
import { ref } from 'vue';

const message = ref('')
const show = ref(false)


function open({ msg }) {
  message.value = msg
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
  border-radius: $border-radius;
  z-index: 999;
  transition: $transition;
  background-color: $message-bg;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 1;
  transform: translateX(0) translate3d(-50%, -50%, 0);

  &.hide {
    transform: translateX(-100vw) translate3d(-50%, -50%, 0);
    opacity: 0;
  }
}
</style>