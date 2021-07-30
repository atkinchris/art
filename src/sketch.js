import { rngArrayItem, rngRangeFloor } from './utils/random.js'
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
    x: rngRangeFloor(0, 300),
    y: 0,
    path,
  }
}

const createShapes = (numberOfShapes, spacingFactor, colourFn) => {
  const spacingMax = (800 * spacingFactor) / numberOfShapes

  return Array.from({ length: numberOfShapes }).reduce(out => {
    const shape = createShape()
    const { y: previousY = 0 } = out[out.length - 1] || {}

    shape.rotation = rngRangeFloor(-2, 2)
    shape.y += previousY + rngRangeFloor(10, spacingMax)
    shape.colour = colourFn(shape)

    out.push(shape)

    return out
  }, [])
}

const sketch = () => {
  const spacingFactor = 1.3
  const numberOfShapes = rngRangeFloor(20, 30)
  const dullColours = Array.from({ length: 4 }, () => `hsl(${rngRangeFloor(0, 360)},10%,90%)`)
  const brightColours = ['#EF4F4F', '#EE9595', '#FFCDA3', '#74C7B8']
  // const brightColours = Array.from({ length: 4 }, (_, index) => `hsla(${Math.floor(360 / 6) * index},100%,50%,0.5)`)

  const shapes = [
    ...createShapes(numberOfShapes / 3, spacingFactor, () => rngArrayItem(dullColours)),
    ...createShapes(numberOfShapes, spacingFactor, ({ y }) => {
      const positionalIndex = Math.round((y / 1000) * brightColours.length)
      const index = rngRangeFloor(0, 100) > 95 ? rngRangeFloor(0, brightColours.length) : positionalIndex

      return brightColours[index]
    }),
  ]

  const heightOfShapes = Math.max(...shapes.map(shape => shape.y)) - Math.min(...shapes.map(shape => shape.y))
  const widthOfShapes = Math.max(...shapes.map(shape => shape.x)) - Math.min(...shapes.map(shape => shape.x))
  const yOffset = (1000 - heightOfShapes) / 2
  const xOffset = (1000 - widthOfShapes) / 2

  return (/** @type {CanvasRenderingContext2D} */ context) => {
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
}

export default sketch
