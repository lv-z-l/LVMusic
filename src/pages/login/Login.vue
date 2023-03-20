<template>
  <view class="login" v-loading="loading">
    <image class="img" :src="url" v-if="url"></image>
    <image class="avatar" :src="avatarUrl" v-if="avatarUrl"></image>
    <text>{{ msg }}</text>
  </view>
</template>
<script setup>
import { onBeforeMount, ref, onDeactivated, onActivated } from 'vue'
import { getLoginKey, getLoginBase64, checkLoginStatus } from '@/apis/login'
import { useStore } from '../../store/main'

const store = useStore()

const url = ref('')
const avatarUrl = ref('')
const msg = ref(store.langObj.wait)

const loading = ref(false)

let timer, timer_, key

onDeactivated(() => {
  clearTimeout(timer)
  clearTimeout(timer_)
})

onActivated(() => {
  if (url.value && !avatarUrl.value) {
    check()
  }
})

onBeforeMount(async () => {
  await getKeyAndImage()
  check()
})

async function getKeyAndImage() {
  loading.value = true
  const keyData = await getLoginKey()
  key = keyData.data.unikey
  if (!key) {
    return
  }
  const base64Data = await getLoginBase64(key)
  url.value = base64Data.data.qrimg
  loading.value = false
}

function getUserinfo() {
  store.loginStatus().then(profile => {
    if (profile) {
      store.noLogin = false
    } else {
      timer_ = setTimeout(() => getUserinfo(), 3 * 1000)
    }
  })
}

async function check() {
  timer = setTimeout(async () => {
    const status = await checkLoginStatus(key)
    clearTimeout(timer)
    if (status.code === 801) {
      check()
    } else if (status.code === 800) {
      await getKeyAndImage()
      check()
    } else if (status.code === 802) {
      avatarUrl.value = status.avatarUrl
      msg.value = status.message
      check()
    } else {
      localStorage.setItem('MUSIC_COOKIE', status.cookie)
      store.cookie = status.cookie
      getUserinfo()
      msg.value = status.message
    }
  }, 2000)
}
</script>
<style lang="scss">
.login {
  width: 100%;
  height: calc(100% - 2 * $bottom-bar-height);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .img {
    width: 40%;
    max-width: 180px;
    max-height: 180px;
  }

  .avatar {
    width: $avatar-width;
    height: $avatar-width;
  }
}
</style>