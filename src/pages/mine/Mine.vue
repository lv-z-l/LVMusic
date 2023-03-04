<template>
  <Login v-if="store.noLogin" />
  <PageFrame v-else :frame-name="store.langObj.mine">

  </PageFrame>
</template>
<script setup>
import Login from '../login/Login.vue'
import PageFrame from '@/components/pageframe/PageFrame'
import { useStore } from '@/store/main'

const store = useStore()
</script>
<style lang="scss"></style>