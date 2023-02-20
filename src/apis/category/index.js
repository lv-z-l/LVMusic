import { uni } from '@dcloudio/uni-h5';
import { proxyPrefix } from '@config/index'

const req = (args) => {
  args.url = proxyPrefix + args.url
  return uni.request(args)
}


export function getHotCategoryList() {
  return req({
    url: '/playlist/hot'
  })
}

export function getCategoryPlayList(data) {
  return req({
    url: '/top/playlist',
    data
  })
}