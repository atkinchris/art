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

      const colour = ((marker.value + 1) / 2) * 360

      context.fillStyle = `hsl(${colour}, 100%, 50%)`

      context.beginPath()
      context.fillRect(0, 0, size, size)

      context.restore()
    })
  }
}

export default sketch
