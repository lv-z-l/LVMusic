const rightCode = [200, 800, 801, 802, 803]

const requestCache = {}

const prefix = import.meta.env.VITE_SERVER_URL

export function req(args) {
  args.url = prefix + args.url
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