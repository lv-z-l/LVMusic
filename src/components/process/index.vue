<template>
  <view class="process-bar" 
    @touchstart.stop="onTouchS" 
    @touchmove.stop="throttledM" 
    @touchend="onTouchE"
    @mousedown.stop="onTouchS" 
    @mousemove.stop="throttledM" 
    @mouseup="onTouchE"
  >
    <view class="process" :style="{ width: processW }"></view>
  </view>
  <view v-if="showText" class="process-text">
    <text>{{ props.min }}</text>
    <text>{{ props.max }}</text>
  </view>
</template>
  
<script setup name='Process'>
import { computed, ref } from 'vue'
import { throttle } from '@/utils/index'

const props = defineProps({
  min: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 100
  },
  showText: {
    type: Boolean,
    default: false
  },
  step: {
    type: Number,
    default: 2
  },
  init: {
    type: Number,
    default: 0
  },
})
const emit = defineEmits(['moves', 'movee'])
let clientX = 0

const selfVal = ref(props.init)

function onTouchS(event) {
  emit('moves')
}
function onTouchM(event) {
  const newX = event.changedTouches[0].clientX
  if(!clientX || newX > clientX) {
    if(selfVal.value < props.max) {
      selfVal.value += props.step
    }
  } else {
    if(selfVal.value > props.min) {
      selfVal.value -= props.step
    }
  }
  clientX = newX
}
const throttledM = throttle(onTouchM, 60)

function onTouchE(event) {
  clientX = 0
  emit('movee')
}

const processW = computed(() => !selfVal.value ? '0px' : `calc(100% * (${selfVal.value} / ${props.max}))`)

  
</script>
  
<style lang="scss">
.process-bar {
  width: 100%;
  height: $process-height;
  border-radius: $player-top-line-radius;
  background-color: $bottom-bar-split-color;
  display: flex;
  .process {
    height: $process-height;
    border-radius: $player-top-line-radius;
    background-color: $uni-bg-color;
    opacity: .8;
  }
}
  .process-text {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: $player-voice-icon-color;
    font-size: $process-height;
    margin-top: $process-text-margin-top;
  }
</style>