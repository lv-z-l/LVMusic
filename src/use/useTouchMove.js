export function useTouchMove() {
  let x = 0, y = 0

  let thresholdy = 80, thresholdx = 50

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
    return { right: endx - thresholdx > tempx, bottom: endy - thresholdy > tempy }
  }

  return { onTouchS, onTouchE }
}