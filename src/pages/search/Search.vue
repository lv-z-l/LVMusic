<template>
  <PageFrame :frame-name="store.langObj.search">
    <template #scrollbar>
      <view :class="['search-input-wrapper', keywords ? 'show' : '']">
        <view class="icon-search-fill search-icon"></view>
        <input class="search-input" placeholder="关键字" v-model="keywords" v-debounceInput:600="searchProvide" @confirm="onConfirm"/>
      </view>
    </template>
    <view class="hot-search-words" v-show="!keywords">
      <text class="hot-text" @click="proClick(text)" v-for="text in hotTexts">{{ text }}</text>
    </view>
    <view class="provides" v-show="keywords && provideList.length > 0">
      <text class="icon-search-fill pro-text" @click="proClick(pro.name + ' ' + pro.author)" v-for="pro in provideList">{{
        `${pro.name}——${pro.author}` }}</text>
    </view>
    <view class="results" v-show="keywords && results.length > 0">
      <SongListItem :song="song" v-for="song in results" :key="song.id" />
    </view>
  </PageFrame>
</template>
  
<script setup>
import PageFrame from '@/components/pageframe/PageFrame'
import { useStore } from '../../store/main'
import { ref, reactive, onBeforeMount } from 'vue'
import { getHotSearch, getProvide, search } from '@/apis/search'
import SongListItem from '../../components/songlistitem/SongListItem.vue'

const store = useStore()

const results = reactive([])

const hotTexts = reactive([])

const provideList = reactive([])

const keywords = ref('')

onBeforeMount(() => {
  getHotSearch().then(res => {
    const temp = res.data.map(i => i.searchWord)
    hotTexts.push(...temp)
  })
})

function proClick(key) {
  keywords.value = key
  onConfirm()
}

function searchProvide() {
  keywords.value && getProvide(keywords.value).then(res => {
    const { result } = res
    const temp = result.songs.map(re => ({
      name: re.name,
      author: re.artists.map(ar => ar.name).join(',')
    }))
    provideList.splice(0, provideList.length, ...temp)
  })
}

function onConfirm() {
  keywords.value && search(keywords.value).then(res => {
    const { result } = res
    if (result.songs) {
      const temp = result.songs.map(song => {
        const { name, id, al, ar } = song
        return {
          name,
          id,
          url: al.picUrl,
          author: ar.map(t => t.name).join('、')
        }
      })
      results.splice(0, results.length, ...temp)
    }
  })

}

</script>
  
<style lang="scss">
.search-input-wrapper {
  flex: 2 0 auto;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  position: relative;

  .search-icon {
    font-size: 2rem;
    position: absolute;
    left: 1.6rem;
    transition: $transition;
  }

  .search-input {
    height: 2rem;
    color: var(--bottom-bar-color);
    margin-left: 1rem;
    width: 0;
    border: none;
    border-radius: 2 * $border-radius;
    text-indent: 2rem;
    transition: $transition;
  }

  &:hover,
  &.show {
    .search-icon {
      font-size: 1rem;
    }

    .search-input {
      width: 30%;
      border: 1px solid $bottom-bar-split-color;
    }

  }

}

.provides,
.results,
.hot-search-words {
  width: 100%;
  padding: 2rem $global-padding;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.hot-search-words {
  .hot-text {
    font-size: .6rem;
    padding: .4rem;
    color: var(--bottom-bar-color);
    background-color: var(--bg);
    border-radius: .5rem;
    margin-right: .5rem;
    margin-bottom: .5rem;

    &::after {
      content: "🔥";
      color: $bottom-bar-active-color;
      font-size: .4rem;
      position: relative;
      bottom: .3rem;
    }
  }
}

.provides {
  .pro-text {
    width: 100%;

    &::before {
      font-size: 1rem;
      padding-right: .8rem;
    }

    padding: .4rem .4rem .4rem 0;
    border-bottom: 1px solid $bottom-bar-split-color;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
}
</style>