import { req } from '../expandunirequest'


export function getHomePageData() {
  return req({
    url: '/homepage/block/page'
  })
}