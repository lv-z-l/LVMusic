import { req } from '../expandunirequest'

export function getHotSearch() {
  return req({
    url: '/search/hot/detail'
  })
}

export function getProvide(keywords) {
  return req({
    url: '/search/suggest?keywords=' + keywords
  })
}

export function search(keywords) {
  return req({
    url: '/cloudsearch?keywords=' + keywords
  })
}

