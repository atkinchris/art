import { rngRangeFloor } from './utils/random.js'
import calculateHull from './utils/hull.js'
import calculateBezierSmoothPath from './utils/interpolation.js'

const createShape = () => {
  const width = rngRangeFloor(500, 700)
  const height = rngRangeFloor(45, 55)
  const numberOfPoints = rngRangeFloor(30, 60)

  const path = new Path2D()
  const hull = calculateHull(
    Array.from({ length: numberOfPoints }, () => ({
      x: rngRangeFloor(-width / 2, width / 2),
      y: rngRangeFloor(-height / 2, height / 2),
    }))
  )

  const bezierPoints = calculateBezierSmoothPath(hull)

  bezierPoints.forEach(([cp1, cp2, point]) => {
    path.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, point.x, point.y)
  })

  path.closePath()

  return {
    x: rngRangeFloor(300, 600),
    y: 0,
    path,
  }
}

const sketch = () => {
  const spacingFactor = 1.3
  const numberOfShapes = rngRangeFloor(20, 30)
  const shapes = Array.from({ length: numberOfShapes }, createShape)

  const spacingMax = (1000 * spacingFactor) / numberOfShapes

  shapes.forEach((shape, index) => {
    const { y: previousY = spacingMax } = shapes[index - 1] || {}
    // eslint-disable-next-line no-param-reassign
    shape.y += previousY + rngRangeFloor(10, spacingMax)
  })

  return (/** @type {CanvasRenderingContext2D} */ context) => {
    context.globalCompositeOperation = 'screen'
    context.globalAlpha = 0.5

    shapes.forEach(shape => {
      context.save()

      context.fillStyle = 'black'
      context.translate(shape.x, shape.y)
      context.fill(shape.path)

      context.restore()
    })
  }
}

export default sketch
