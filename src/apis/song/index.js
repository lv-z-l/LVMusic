import { req } from '../expandunirequest'

export function getSongUrlById(id) {
  return req({
    url: `/song/url/v1?id=${id}&level=higher`
  })
}

export function getSongUrlById1(id) {
  return req({
    url: `/song/download/url?id=${id}`
  })
}

export function getSongLyric(id) {
  return req({
    url: `/lyric?id=${id}`
  })
}