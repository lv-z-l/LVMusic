export function useTouchMove() {
  let x = 0, y = 0

  let thresholdy = 50, thresholdx = 50

  function onTouchS(event) {
    y = event.changedTouches[0].clientY
    x = event.changedTouches[0].clientX
  }

  function onTouchE(event) {
    const endx = event.changedTouches[0].clientX
    const endy = event.changedTouches[0].clientY
    const tempx = x
    const tempy = y
    x = y = 0
    const res = {}
    if (endx - tempx > thresholdx) {
      res.right = true
    } else if (endy - tempy > thresholdy) {
      res.bottom = true
    } else if (endx < tempx && Math.abs(endx - tempx) > thresholdx) {
      res.left = true
    } else if (endy < tempy && Math.abs(endy - tempy) > thresholdy) {
      res.up = true
    }
    return res
  }

  return { onTouchS, onTouchE }
}