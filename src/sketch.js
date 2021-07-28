import { rngRangeFloor } from './utils/random.js'
import calculateHull from './utils/hull.js'

const sketch = () => {
  const path = new Path2D()
  const hull = calculateHull(
    Array.from({ length: 50 }, () => ({
      x: rngRangeFloor(0, 400),
      y: rngRangeFloor(0, 400),
    }))
  )

  hull.forEach(point => {
    path.lineTo(point.x, point.y)
  })

  path.closePath()

  return (/** @type {CanvasRenderingContext2D} */ context) => {
    context.globalCompositeOperation = 'screen'
    context.globalAlpha = 0.5
    context.fillStyle = 'black'

    context.save()

    context.translate(300, 300)
    context.stroke(path)

    context.restore()
  }
}

export default sketch
