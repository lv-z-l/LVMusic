<template>
  <PageFrame :frame-name="store.langObj.search"></PageFrame>
</template>
  
<script setup>
import PageFrame from '@/components/pageframe/PageFrame'
import { useStore } from '../../store/main'

const store = useStore()
</script>
  
<style></style>