import { getNoise2D } from './utils/noise.js'

const sketch = () => {
  const markers = []

  for (let y = 0; y < 1000; y += 25) {
    for (let x = 0; x < 1000; x += 25) {
      markers.push({ x, y, value: getNoise2D(x, y) })
    }
  }

  return (/** @type {CanvasRenderingContext2D} */ context) => {
    context.globalCompositeOperation = 'screen'
    context.globalAlpha = 0.5

    markers.forEach(marker => {
      context.save()

      context.translate(marker.x, marker.y)
      context.fillStyle = 'black'

      const size = marker.value * 10

      context.beginPath()
      context.arc(size, size, size, 0, Math.PI * 2, true)
      context.fill()

      context.restore()
    })
  }
}

export default sketch
