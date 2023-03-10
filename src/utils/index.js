import analyze from 'rgbaster'

export function debounce(fn, time) {
  let timer
  return (...argu) => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    } else {
      timer = setTimeout(() => fn.apply(null, argu) && clearTimeout(timer), time)
    }
  }
}

export function throttle(fn, time) {
  let flag = false
  let timer
  return (...argu) => {
    if (!flag) {
      flag = true
      timer = setTimeout(() => {
        clearTimeout(timer)
        fn.apply(null, argu)
        flag = false
      }, time)
    }
  }
}

export function loadLang() {
  const langModules = import.meta.glob('../lang/*.js', { eager: true })
  return langModules
}

export async function analyzeBg(img) {
  const result = await analyze(img, { scale: 0.1 })
  const length = result.length
  const mid = Number.parseInt(length / 2)
  const midMid = Number.parseInt(mid / 2)
  const firstColor = result[mid - midMid].color
  const midColor = result[mid].color
  let lastColor = 'rgb(0,0,0)'
  for (let i = mid + midMid; i < length; i++) {
    const cur = result[i].color
    if (isDeepColor(cur)) {
      lastColor = cur
      break
    }
  }
  return `linear-gradient(${firstColor}, ${midColor}, ${lastColor})`
}

export function isDeepColor(color) {
  const c = color.replace(/[rgb\(\)]/).split(',')
  const grayLevel = c[0] * 0.299 + c[1] * 0.587 + c[2] * 0.114;
  return grayLevel < 192
}