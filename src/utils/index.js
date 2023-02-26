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

export function initLazyIntersectionObserver(fn) {
  const observer = new IntersectionObserver(
    entrys => entrys.forEach(entry => fn(entry)),
    {
      rootMargin: '0px',
      threshold: 0,
    }
  );
  return observer;
}