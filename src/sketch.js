import createNoiseGenerator from './utils/noise.js'

const sketch = () => {
  const markers = []
  const noise = createNoiseGenerator()

  const size = 10

  for (let y = 0; y < 1000; y += size) {
    for (let x = 0; x < 1000; x += size) {
      markers.push({ x, y, value: noise(x * 0.007, y * 0.007, 0) })
    }
  }

  return (/** @type {CanvasRenderingContext2D} */ context) => {
    context.globalCompositeOperation = 'screen'
    context.globalAlpha = 0.5

    markers.forEach(marker => {
      context.save()

      context.translate(marker.x, marker.y)
      context.fillStyle = 'black'

      const size = ((marker.value + 1) / 2) * 5

      context.beginPath()
      context.arc(size, size, size, 0, Math.PI * 2, true)
      context.fill()

      context.restore()
    })
  }
}

export default sketch
