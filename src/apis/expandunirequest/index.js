import { uni } from '@dcloudio/uni-h5';
import config from '@/config/index'


const requestCache = {}

export function req (args) {
  args.url = config.proxyPrefix + args.url
  return new Promise((resolve, reject) => {
    uni.request(args).then(res => {
      if (res.data && res.data.code === 200) {
        if (args.needCache) {
          delete args.needCache
          requestCache[JSON.stringify(args)] = {...res}
        }
        resolve(res.data)
      } else {
        reject(res)
      }
    })
  })
}