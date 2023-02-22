<template>
  <view class="category">
    <pageframe frame-name="歌单">
      <view :class="['category-tags', store.fixed ? 'fixed' : '']">
        <text :class="['tag-text', current === tag.id ? 'current' : '']" @click="tagClick(tag)"
          v-for="tag in categoryTags" :key="tag.id">{{ tag.name }}</text>
      </view>
      <view class="song-sheets">
        <songsheet v-for="sheet in currentTagLists" :key="sheet.id" :sheet="sheet"></songsheet>
      </view>
    </pageframe>
  </view>
</template>
  
<script setup name="category">
import pageframe from '@/components/pageframe/index'
import { getCategoryTags, getCategoryPlayList } from '@/apis/category'
import { onMounted, reactive, ref, defineAsyncComponent } from 'vue';
import { useStore } from '../../store/main';

const store = useStore()

const songsheet = defineAsyncComponent(() => import(/* webpackChunkName: "songsheet" */'@/components/songsheet/index.vue'))
const categoryTags = reactive([])

const currentTagLists = reactive([])

onMounted(() => {
  getCategoryTags().then(res => {
    categoryTags.push(...res.tags)
  })
})

const current = ref('')

function tagClick(tag) {
  current.value = tag.id
  loadTagCategoryList(tag.name)
}

function loadTagCategoryList(id) {
  getCategoryPlayList({ cat: id, limit: 20 }).then(res => {
    currentTagLists.push(...res.playlists)
  })
}

</script>
  
<style lang="scss">
.category {
  .category-tags {
    overflow-x: auto;
    display: flex;
    position: sticky;
    top: $page-frame-scroll-margin-top;
    flex-direction: row;
    padding: $category-text-margin 0;
    align-items: center;
    z-index: 2;
    justify-content: flex-start;
    background-color: $white-color;

    &.fixed {
      background-color: $bg;
    }

    &::-webkit-scrollbar {
      width: 0;
      height: 0;
    }

    .tag-text {
      flex: 0 0 auto;
      font-size: $page-frame-fixed-text-size;
      padding-right: $category-text-margin;

      &.current {
        color: $bottom-bar-active-color;
      }
    }
  }

  .song-sheets {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
}
</style>