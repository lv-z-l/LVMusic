import { req } from '../expandunirequest'

export function getRecommendSongs() {
  return req({
    url: '/recommend/songs'
  })
}

export function getRecommendResource() {
  return req({
    url: '/recommend/resource'
  })
}


export function getUserPlaylist(uid) {
  return req({
    url: '/user/playlist?uid=' + uid
  })
}

export function getRecentSonglist(data) {
  return req({
    url: '/record/recent/song',
    data
  })
}


export function likeSong(id) {
  return req({
    url: '/like?id=' + id
  })
}
