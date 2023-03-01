import { req } from '../expandunirequest'


export function getCategoryTags() {
  return req({
    url: 'playlist/highquality/tags'
  })
}

export function getHotCategoryList() {
  return req({
    url: '/playlist/hot'
  })
}

export function getCategoryPlayList(data) {
  return req({
    url: '/top/playlist/highquality',
    data
  })
}
/**
 * 获取网友精选碟歌单
 * @param {} data 
 * @returns 
 */
export function getHotOrNewCategoryPlayList(data) {
  return req({
    url: '/top/playlist',
    data
  })
}

export function getSongListByCateId(data) {
  return req({
    url: '/playlist/detail',
    data
  })
}

