import { req } from '../expandunirequest'

export function getRecommendSongs() {
  return req({
    url: 'recommend/songs'
  })
}

export function getRecommendResource() {
  return req({
    url: '/recommend/resource'
  })
}

export function getHomePageData() {
  return req({
    url: '/homepage/block/page'
  })
}