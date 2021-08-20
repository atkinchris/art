import { rngArrayItem, rngGaussian, rngRangeFloor } from '../../lib/utils/random.js'
import calculateHull from '../../lib/utils/hull.js'
import calculateBezierSmoothPath from '../../lib/utils/interpolation.js'
import { mean } from '../../lib/utils/average.js'

const createShape = () => {
  const width = rngGaussian(700, 250)
  const height = rngGaussian(60, 15)
  const numberOfPoints = rngRangeFloor(30, 60)

  const path = new Path2D()
  const hull = calculateHull(
    Array.from({ length: numberOfPoints }, () => ({
      x: rngRangeFloor(-width / 2, width / 2),
      y: rngRangeFloor(-height / 2, height / 2) + rngGaussian(0, 75),
    }))
  )

  const bezierPoints = calculateBezierSmoothPath(hull)

  bezierPoints.forEach(([cp1, cp2, point]) => {
    path.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, point.x, point.y)
  })

  path.closePath()

  return {
    x: rngGaussian(0, 200),
    y: rngGaussian(0, 10),
    rotation: rngGaussian(0, 5),
    path,
  }
}

const createShapes = (numberOfShapes, spacingFactor, colourFn) => {
  const spacingMax = (650 * spacingFactor) / numberOfShapes

  return Array.from({ length: numberOfShapes }).map((_, index) => {
    const shape = createShape()

    shape.y += spacingMax * index
    shape.colour = colourFn(shape)

    return shape
  }, [])
}

const sketch = (/** @type {CanvasRenderingContext2D} */ context) => {
  const spacingFactor = 1.3
  const numberOfShapes = rngGaussian(15, 5)
  const dullColours = Array.from({ length: 4 }, () => `hsla(${rngRangeFloor(0, 180)},10%,90%,0.8)`)

  const numberOfColours = 8
  const startingColour = rngRangeFloor(0, 360)
  const brightColours = Array.from(
    { length: numberOfColours },
    (_, index) => `hsla(${(startingColour + Math.floor(225 / numberOfColours) * index) % 360},100%,50%,0.5)`
  ).reverse()

  const shapes = [
    ...createShapes(numberOfShapes / 3, spacingFactor, () => rngArrayItem(dullColours)),
    ...createShapes(numberOfShapes, spacingFactor, ({ y }) => {
      const positionalIndex = Math.round((y / 1000) * brightColours.length)
      const index = rngRangeFloor(0, 100) > 85 ? rngRangeFloor(0, brightColours.length) : positionalIndex

      return brightColours[index]
    }),
  ]

  const heightOfShapes = mean(shapes.map(shape => shape.y))
  const widthOfShapes = mean(shapes.map(shape => shape.x))
  const yOffset = (1000 - heightOfShapes) / 2 - 200
  const xOffset = (1000 - widthOfShapes) / 2

  context.fillStyle = 'hsl(0, 0%, 98%)'
  context.fillRect(0, 0, 1000, 1000)

  shapes.forEach(shape => {
    context.save()

    context.globalCompositeOperation = 'multiply'
    context.globalAlpha = 0.95
    context.fillStyle = shape.colour
    context.translate(shape.x + xOffset, shape.y + yOffset)
    context.rotate((shape.rotation * Math.PI) / 180)
    context.fill(shape.path)

    context.restore()
  })
}

export default sketch
