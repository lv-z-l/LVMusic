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

export function getSongListByCateId(data) {
  return req({
    url: '/playlist/detail',
    data
  })
}

export function getSongUrlById(id) {
  return req({
    url: `/song/url/v1?id=${id}&level=higher`
  })
}