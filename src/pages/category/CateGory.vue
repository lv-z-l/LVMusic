<template>
  <view class="category">
    <PageFrame frame-name="歌单">
      <view :class="['category-tags', store.fixed ? 'fixed' : '']">
        <text :class="['tag-text', current === tag.id ? 'current' : '']" @click="tagClick(tag)"
          v-for="tag in categoryTags" :key="tag.id">{{ tag.name }}</text>
      </view>
      <view class="song-sheets">
        <SongSheet v-for="sheet in currentTagLists" @sheet-click="onSheetClick" :key="sheet.id" :sheet="sheet">
        </SongSheet>
      </view>
    </PageFrame>
  </view>
</template>
  
<script setup>
import PageFrame from '@/components/pageframe/PageFrame'
import { getCategoryTags, getCategoryPlayList, getSongListByCateId } from '@/apis/category'
import { onMounted, reactive, ref, defineAsyncComponent } from 'vue';
import { useStore } from '../../store/main';

const emit = defineEmits(['show-songlist'])

const store = useStore()

const SongSheet = defineAsyncComponent(() => import(/* webpackChunkName: "songsheet" */'@/components/songsheet/SongSheet.vue'))
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

function onSheetClick(sheet) {
  getSongListByCateId({ id: sheet.id, limit: 20 }).then(res => {
    const { description, coverImgUrl, name, tracks } = res.playlist
    const lists = tracks.map(track => {
      const { name, id, al, ar } = track
      return {
        name,
        id,
        url: al.picUrl,
        author: ar.map(t => t.name).join('、')
      }
    })
    store.setSongs({
      coverImgUrl,
      description,
      name,
      lists
    })
    emit('show-songlist')
  })
}

</script>
  
<style lang="scss">
.category {
  .category-tags {
    overflow-x: auto;
    display: flex;
    position: sticky;
    top: calc($page-frame-scroll-margin-top + $scroll-bar-fixed-top);
    flex-direction: row;
    padding: $category-padding;
    align-items: center;
    z-index: 2;
    justify-content: flex-start;
    background-color: $white-color;

    &.fixed {
      background-color: $white-color;
      // backdrop-filter: $backdrop-filter;
      // box-shadow: $box-shadow;
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
    padding: $global-padding;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;
  }
}
</style>