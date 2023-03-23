<template>
  <view :class="['process-bar', clientX > 0 ? 'moving' : '']" @touchstart.passive="onTouchS"
    @touchmove.passive="throttledM" @touchend.passive="onTouchE">
    <view class="process" :style="{ width: processW }"></view>
  </view>
  <view v-if="showText" :class="['process-text', clientX > 0 ? 'moving' : '']">
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

watch(() => props.init, (val) => {
  selfVal.value = val
})

if (props.autoMove) {
  watch(() => store.currentSong.playing, (val) => startMove(val))
  watch(() => store.currentSong.name, (val) => startMove(val))
  watch(() => store.currentSong.start, (val) => {
    selfVal.value = val
  })
}

function startMove(val) {
  if (val) {
    clearTimeout(timer)
    timer = setTimeout(moveByStep, 1000)
  } else {
    clearTimeout(timer)
  }
}

function moveByStep() {
  clientX.value === 0 && store.getCurrentTime()
  clearTimeout(timer)
  if (store.currentSong.playing) {
    timer = setTimeout(moveByStep, 1000)
  }
}

const emit = defineEmits(['moves', 'movee'])
const clientX = ref(0)

const selfVal = ref(props.init)

function onTouchS(event) {
  clientX.value = event.changedTouches[0].clientX
  emit('moves')
}

function onTouchM(event) {
  const newX = event.changedTouches[0].clientX
  if (newX > clientX.value) {
    if (selfVal.value < props.max) {
      selfVal.value += props.step
    }
  } else {
    if (selfVal.value > props.min) {
      selfVal.value -= props.step
    }
  }
  clientX.value = newX
}
const throttledM = throttle(onTouchM, 100)

function onTouchE(event) {
  clientX.value = 0
  emit('movee', selfVal.value)
}

const processW = computed(() => !selfVal.value ? '0px' : `calc(100% * (${props.autoMove ? selfVal.value * 1000 : selfVal.value} / ${props.max}))`)


</script>
  
<style lang="scss">
.process-bar {
  width: 100%;
  height: $process-height;
  border-radius: $border-radius;
  background-color: $bottom-bar-split-color;
  display: flex;

  &.moving {
    transform: scaleX(1.04) scaleY(1.6);

    .process {
      background-color: $white-color;
      opacity: 1;
    }
  }

  .process {
    height: $process-height;
    border-radius: $border-radius;
    transition: all .4s ease;
    background-color: $white-color;
    opacity: .8;
  }
}

.process-text {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: $white-color;
  font-size: $process-height;
  margin-top: $process-text-margin-top;

  &.moving {
    color: $white-color;
  }
}
</style>