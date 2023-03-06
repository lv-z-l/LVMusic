<template>
  <Login v-if="store.noLogin" />
  <MySpace v-else />
</template>
<script setup>
import Login from '../login/Login.vue'
import MySpace from '../myspace/MySpace.vue';
import { useStore } from '@/store/main'

const store = useStore()
</script>
<style lang="scss"></style>