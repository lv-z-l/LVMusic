<template>
  <view class="category">
    <PageFrame :frame-name="store.langObj.category">
      <view :class="['category-tags', store.fixed ? 'fixed' : '']">
        <text :class="['tag-text', current.id === tag.id ? 'current' : '']" @click="tagClick(tag)"
          v-for="tag in categoryTags" :key="tag.id">{{ tag.name }}</text>
      </view>
      <view class="song-sheets">
        <SongSheet v-for="sheet in currentTagLists" :key="sheet.id" :sheet="sheet">
        </SongSheet>
      </view>
    </PageFrame>
    <NoData v-show="!store.loading && currentTagLists.length === 0" />
  </view>
</template>
  
<script setup>
import PageFrame from '@/components/pageframe/PageFrame'
import { getCategoryTags, getCategoryPlayList, getHotOrNewCategoryPlayList } from '@/apis/category'
import { reactive, onBeforeMount } from 'vue';
import { useStore } from '../../store/main';
import NoData from '@/common/nodata/NoData.vue'
import SongSheet from '@/components/songsheet/SongSheet.vue';

const store = useStore()

function changeLoading() {
  store.loading = !store.loading
}

const categoryTags = reactive([{ id: 'HOT', name: 'HOT' }, { id: 'NEW', name: 'NEW' }])

const currentTagLists = reactive([])

let current = reactive(categoryTags[0])

onBeforeMount(() => {
  changeLoading()
  loadTagCategoryList(current.name)
  getCategoryTags().then(res => {
    categoryTags.push(...res.tags)
  })
})

function tagClick(tag) {
  if (current.id === tag.id) {
    return
  }
  changeLoading()
  current = tag
  loadTagCategoryList(tag.name)
}

function loadHotOrNewCategoryList(id, offset = 0) {
  getHotOrNewCategoryPlayList({ order: id, limit: 20, offset }).then(res => {
    current.more = res.more
    offset ? currentTagLists.push(...res.playlists) : currentTagLists.splice(0, currentTagLists.length, ...res.playlists)
    changeLoading()
  }).catch(() => {
    changeLoading()
  })
}

function loadTagCategoryList(id, offset = 0) {
  if ('HOT,NEW'.includes(id)) {
    loadHotOrNewCategoryList(id, offset)
  } else {
    getCategoryPlayList({ cat: id, limit: 20, offset }).then(res => {
      current.more = res.more
      offset ? currentTagLists.push(...res.playlists) : currentTagLists.splice(0, currentTagLists.length, ...res.playlists)
      changeLoading()
    }).catch(() => {
      changeLoading()
    })
  }
}

store.regLoadMore('category', () => {
  if (current.more) {
    changeLoading()
    loadTagCategoryList(current.name, currentTagLists.length ? currentTagLists.length - 1 : 0)
  }
})
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
    padding: 0 $global-padding;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;
  }
}
</style>