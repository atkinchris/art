import { rngRangeFloor } from './utils/random.js'
import calculateHull from './utils/hull.js'

const sketch = () => {
  const hull = calculateHull(
    Array.from({ length: 50 }, () => ({
      x: rngRangeFloor(0, 400),
      y: rngRangeFloor(0, 400),
    }))
  )

  return (/** @type {CanvasRenderingContext2D} */ context) => {
    context.globalCompositeOperation = 'screen'
    context.globalAlpha = 0.5

    hull.forEach(point => {
      context.save()

      context.translate(point.x + 300, point.y + 300)

      context.fillStyle = 'black'

      context.beginPath()
      context.fillRect(0, 0, 4, 4)

      context.restore()
    })
  }
}

export default sketch
