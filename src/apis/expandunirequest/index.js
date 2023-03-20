import { useStore } from '../../store/main'

const rightCode = [200, 800, 801, 802, 803]

const requestCache = {}

let store

const prefix = import.meta.env.MODE === 'production' ? import.meta.env.VITE_SERVER_URL : import.meta.env.VITE_PROXY_PREFIX

console.log(import.meta.env)

export function req(args) {
  args.url = prefix + args.url
  if (import.meta.env.MODE === 'production') {
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