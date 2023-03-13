<template>
  <view class="login" v-loading="loading">
    <image class="img" :src="url" v-if="url"></image>
    <image class="avatar" :src="avatarUrl" v-if="avatarUrl"></image>
    <text>{{ msg }}</text>
  </view>
</template>
<script setup>
import { onBeforeMount, ref } from 'vue'
import { getLoginKey, getLoginBase64, checkLoginStatus } from '@/apis/login'
import { useStore } from '../../store/main'

const store = useStore()

const url = ref('')
const avatarUrl = ref('')
const msg = ref(store.langObj.wait)

const loading = ref(true)

let timer

onBeforeMount(async () => {
  const keyData = await getLoginKey()
  const key = keyData.data.unikey
  if (!key) {
    return
  }
  const base64Data = await getLoginBase64(key)
  url.value = base64Data.data.qrimg
  loading.value = false
  check(key)
})

function getUserinfo() {
  store.loginStatus().then(profile => {
    if (profile) {
      store.noLogin = false
    } else {
      setTimeout(() => getUserinfo(), 5 * 1000)
    }
  })
}

function check(key) {
  timer = setTimeout(async () => {
    const status = await checkLoginStatus(key)
    clearTimeout(timer)
    if (status.code === 801) {
      check(key)
    } else if (status.code === 800) {
      msg.value = status.message
    } else if (status.code === 802) {
      avatarUrl.value = status.avatarUrl
      msg.value = status.message
      check(key)
    } else {
      localStorage.setItem('MUSIC_COOKIE', status.cookie)
      store.cookie = status.cookie
      getUserinfo()
      msg.value = status.message
    }
  }, 3000)
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