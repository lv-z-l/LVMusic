<template>
  <PageFrame :frame-name="store.langObj.search">
    <input class="search-input" v-model="searchText" />
  </PageFrame>
</template>
  
<script setup>
import PageFrame from '@/components/pageframe/PageFrame'
import { useStore } from '../../store/main'
import { ref } from 'vue'


const searchText = ref('')

const store = useStore()
</script>
  
<style>
/* .search-input {} */
</style>