import config from '@/config/index'
import { useStore } from '../../store/main'

const rightCode = [200, 800, 801, 802, 803]

const requestCache = {}

let store

const prefix = config.mode === 'pro' ? config.url : config.proxyPrefix

export function req(args) {
  args.url = prefix + args.url
  if (config.mode === 'pro') {
    !store && (store = useStore())
    if (args.data) {
      args.data.cookie = store.cookie
    } else {
      args.data = { cookie: store.cookie }
    }
    args.method = 'POST'
  }

  return new Promise((resolve, reject) => {
    uni.request(args).then(res => {
      if (res.data && rightCode.includes(res.statusCode || res.data.code)) {
        if (args.needCache) {
          delete args.needCache
          requestCache[JSON.stringify(args)] = { ...res }
        }
        resolve(res.data)
      } else {
        reject(res)
      }
    })
  })
}