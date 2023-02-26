<template>
  <view class="process-bar" @touchstart.stop.passive="onTouchS" @touchmove.stop.passive="throttledM"
    @touchend.stop.passive="onTouchE">
    <view class="process" :style="{ width: processW }"></view>
  </view>
  <view v-if="showText" class="process-text">
    <text>{{ formatShowText('min', props.min) }}</text>
    <text>{{ formatShowText('cur', selfVal) }}</text>
    <text>{{ formatShowText('', props.max) }}</text>
  </view>
</template>
  
<script setup>
import { computed, ref, watch } from 'vue'
import { throttle } from '@/utils/index'
import { useStore } from '../../store/main';

const store = useStore()

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
  formatShowText: Function,
  autoMove: Boolean,
  autoMoveStep: Number,
  step: {
    type: Number,
    default: 2
  },
  init: {
    type: Number,
    default: 0
  },
})

let timer
if (props.autoMove) {
  watch(() => store.currentSong.playing, (val) => {
    selfVal.value = store.currentSong.start
    if (val) {
      timer = setTimeout(moveByStep, 1000)
    } else {
      clearTimeout(timer)
    }
  })
}

function moveByStep() {
  if (store.currentSong.start < store.currentSong.time) {
    selfVal.value += props.autoMoveStep
    store.currentSong.start = selfVal.value
  } else {
    selfVal.value = 0
    store.currentSong.start = 0
    store.currentSong.playing = false
  }
  clearTimeout(timer)
  if (store.currentSong.playing) {
    timer = setTimeout(moveByStep, 1000)
  }
}

const emit = defineEmits(['moves', 'movee'])
let clientX = 0

const selfVal = ref(props.init)

function onTouchS(event) {
  clientX = event.changedTouches[0].clientX
  emit('moves')
}
function onTouchM(event) {
  const newX = event.changedTouches[0].clientX
  if (newX > clientX) {
    if (selfVal.value < props.max) {
      selfVal.value += props.step
    }
  } else {
    if (selfVal.value > props.min) {
      selfVal.value -= props.step
    }
  }
  clientX = newX
}
const throttledM = throttle(onTouchM, 120)

function onTouchE(event) {
  clientX = 0
  emit('movee', selfVal.value)
}

const processW = computed(() => !selfVal.value ? '0px' : `calc(100% * (${selfVal.value} / ${props.max}))`)


</script>
  
<style lang="scss">
.process-bar {
  width: 100%;
  height: $process-height;
  border-radius: $border-radius;
  background-color: $bottom-bar-split-color;
  display: flex;

  .process {
    height: $process-height;
    border-radius: $border-radius;
    transition: $transition;
    background-color: $white-color;
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