import config from '@/config/index'

const rightCode = [200, 800, 801, 802, 803]

const requestCache = {}

export function req(args) {
  args.url = config.proxyPrefix + args.url
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