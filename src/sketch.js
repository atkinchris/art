import { rngArrayItem, rngRange } from './utils/random.js'

const colours = ['red', 'blue', 'yellow']

const createShape = () => {
  const colour = rngArrayItem(colours)
  let x = rngRange(-50, 250)
  let y = rngRange(100, 900)

  const startingX = x
  const startingY = y
  const shapeWidth = rngRange(500, 750)
  const shapeHeight = rngRange(40, 70)

  const path = new Path2D([`M${x} ${y}`])

  for (x; x < shapeWidth; x += rngRange(0, shapeWidth / 4)) {
    y += rngRange(-4, 4)
    path.lineTo(x, y)
  }

  for (y; y > startingY; y -= shapeHeight / 6) {
    x += rngRange(-2, 2)
    path.lineTo(x, y)
  }

  for (x; x > startingX; x -= rngRange(0, shapeWidth / 4)) {
    y += rngRange(-4, 4)
    path.lineTo(x, y)
  }

  path.closePath()

  return { path, colour }
}

const sketch = () => {
  const numberOfShapes = rngRange(10, 15)
  const shapes = Array.from({ length: numberOfShapes }, createShape)

  return (/** @type {CanvasRenderingContext2D} */ context) => {
    context.globalCompositeOperation = 'screen'
    context.globalAlpha = 0.5

    shapes.forEach(shape => {
      context.fillStyle = shape.colour
      context.fill(shape.path)
    })
  }
}

export default sketch
