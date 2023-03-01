<template>
  <view class="recommend">
    <NoLogin v-if="store.noLogin" />
    <PageFrame v-else :frame-name="store.langObj.recommend">
    </PageFrame>
  </view>
</template>
  
<script setup>
import PageFrame from '@/components/pageframe/PageFrame'
import NoLogin from '../../common/nologin/NoLogin.vue';
import { useStore } from '../../store/main'

const store = useStore()
</script>
  
<style></style>