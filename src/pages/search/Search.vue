<template>
  <PageFrame :frame-name="store.langObj.search">
    <input class="iconfont icon-search-fill search-input" placeholder="关键字" v-model="keywords"
      @input="debouncedSearchProvide" @confirm="onConfirm" />
    <view class="hot-search-words" v-show="!keywords">
      <text class="hot-text" @tap="proClick(text)" v-for="text in store.hotTexts" :key="text">{{ text }}</text>
    </view>
    <view class="provides" v-show="keywords && provideList.length > 0">
      <text class="iconfont icon-search-fill pro-text" @tap="proClick(pro.name + ' ' + pro.author)"
        v-for="pro in provideList" :key="pro.name">{{
          `${pro.name}（${pro.author}）` }}</text>
    </view>
    <view class="results" v-show="keywords && results.length > 0">
      <view style="width: 100%;">
        <SongListItem :song="song" v-for="song in results" :key="song.id" />
      </view>
    </view>
  </PageFrame>
</template>
  
<script setup>
import PageFrame from '@/components/pageframe/PageFrame'
import { useStore } from '../../store/main'
import { ref, reactive, onBeforeMount } from 'vue'
import { getHotSearch, getProvide, search } from '@/apis/search'
import SongListItem from '../../components/songlistitem/SongListItem.vue'
import { debounce } from '@/utils'

const store = useStore()

const results = reactive([])

const provideList = reactive([])

const keywords = ref('')

onBeforeMount(() => {
  store.hotTexts.length === 0 && getHotSearch().then(res => {
    const temp = res.data.map(i => i.searchWord)
    store.hotTexts.push(...temp)
  })
})

function proClick(key) {
  keywords.value = key
  onConfirm()
}

const debouncedSearchProvide = debounce(searchProvide, 600)

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
.search-input {
  display: flex;
  align-items: center;
  width: calc(100% - 2 * $global-padding);
  height: 2rem;
  color: var(--bottom-bar-color);
  margin: $player-top-line-margin-top $global-padding;
  border: 1px solid $bottom-bar-split-color;
  border-radius: 2 * $border-radius;

  &::before {
    font-size: 1rem;
    margin: 0 .8rem;
  }
}

.provides,
.results,
.hot-search-words {
  width: 100%;
  padding: 0 $global-padding;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.hot-search-words {
  .hot-text {
    font-size: .8rem;
    padding: .4rem;
    color: var(--bottom-bar-color);
    background-color: var(--bg);
    border-radius: .5rem;
    margin-right: .5rem;
    margin-bottom: .5rem;

    &::after {
      content: "🔥";
      color: $bottom-bar-active-color;
      font-size: .5rem;
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