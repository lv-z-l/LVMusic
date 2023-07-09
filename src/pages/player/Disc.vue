<template>
  <div :class="['turntable', store.currentSong.playing ? 'playing' : '']"
    @click="store.showSongImage = !store.showSongImage">
    <div class="disc">
      <img src="../../static/disc.1.png" class="disc-1" />
      <img src="../../static/disc-2.png" class="disc-2" />
      <div class="disc-3"></div>
      <img
        src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNCIgaGVpZ2h0PSI0IiB2aWV3Qm94PSIwIDAgNCA0IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8Y2lyY2xlIGN4PSIyIiBjeT0iMiIgcj0iMiIgZmlsbD0idXJsKCNwYWludDBfcmFkaWFsXzIwMzFfMjQ1NzApIi8+CjxkZWZzPgo8cmFkaWFsR3JhZGllbnQgaWQ9InBhaW50MF9yYWRpYWxfMjAzMV8yNDU3MCIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgxIDEpIHJvdGF0ZSg2My40MzUpIHNjYWxlKDIuMjM2MDcpIj4KPHN0b3Agc3RvcC1jb2xvcj0id2hpdGUiLz4KPHN0b3Agb2Zmc2V0PSIxIi8+CjwvcmFkaWFsR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+Cg=="
        class="disc-dot" />
    </div>
    <div class="tonearm">
      <div class="arm-wrapper">
        <div class="arm">
          <div class="foot-bottom">
            <div class="foot-middle">
              <div class="foot-top"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useStore } from '../../store/main'
const store = useStore()
</script>
<style lang="scss">
.turntable {
  --tonearm-primary-rotate: -36deg;
  width: 100%;
  height: 100%;
  position: relative;

  &.playing {
    --tonearm-primary-rotate: -12deg;

    .disc-1 {
      animation-play-state: inherit !important;
    }
  }

  .tonearm {
    top: 0;
    width: 100%;
    height: 100%;
    right: -80%;
    z-index: 1;
    position: absolute;

    .foot-bottom {
      box-sizing: border-box;
      position: absolute;
      right: -14%;
      top: -17%;
      width: 40%;
      height: 17%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-image: linear-gradient(308.66deg, #2d2d2d 21.76%, #8c8c8c 78.7%);
      border-radius: 50%;

      .foot-middle {
        width: 50%;
        height: 50%;
        background-image: linear-gradient(308.66deg, #bfbfbf 21.76%, #ededed 78.7%);
        border-radius: 50%;

        .foot-top {
          position: relative;
          width: 50%;
          height: 50%;
          margin: 25%;
          background-color: #fff;
          border-radius: 50%;
        }
      }
    }

    .arm-wrapper {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 6px;
      right: 5px;
      filter: drop-shadow(2px 2px 2px rgba(0, 0, 0, .1));

      .arm {
        width: 16.6%;
        height: 40%;
        background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUiIGhlaWdodD0iMzYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTcuMjY0IDMwLjQzOGEyIDIgMCAwMS0uNzcxIDEuOTdMMy4yODUgMzQuOGEyIDIgMCAwMS0yLjM5LTMuMjA3bDMuMjA3LTIuMzlhMS45OTggMS45OTggMCAwMTEuODYtLjI4M0EyMSAyMSAwIDAwMTMgMTMuMjNMMTIuOTk3LjAwMWwyLS4wMDEuMDAyIDEzLjIzMWEyMyAyMyAwIDAxLTcuNzM1IDE3LjIwN3oiIGZpbGw9IiNDNEM0QzQiLz48L3N2Zz4=);
        background-size: cover;
        transform: rotate(var(--tonearm-primary-rotate));
        transform-origin: 14px top;
        transition: transform .3s ease;
      }
    }
  }

  .disc {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    box-shadow: 2px 0 4px rgba(0, 0, 0, .25);

    .disc-1 {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      animation: wave-8707fa66 5s linear infinite;
      animation-play-state: paused;
    }

    .disc-2 {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }

    .disc-3 {
      width: 10%;
      height: 10%;
      background-color: $bottom-bar-active-color;
      position: absolute;
      top: 50%;
      left: 50%;
      border-radius: 50%;
      transform: translate(-50%, -50%);
    }

    .disc-dot {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 2.5%;
      height: 2.5%;
      transform: translate(-50%, -50%);
    }
  }
}

@keyframes wave-8707fa66 {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>