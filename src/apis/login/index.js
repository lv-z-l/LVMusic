import { req } from '../expandunirequest'

export function getLoginKey() {
  return req({
    url: '/login/qr/key?timestamp=' + Date.now()
  })
}

export function getLoginBase64(key) {
  return req({
    url: '/login/qr/create?qrimg=true&key=' + key + '&timestamp=' + Date.now()
  })
}

export function checkLoginStatus(key) {
  return req({
    url: '/login/qr/check?key=' + key + '&timestamp=' + Date.now()
  })
}

export function getLoginStatus() {
  return req({
    url: '/login/status?timestamp=' + Date.now()
  })
}