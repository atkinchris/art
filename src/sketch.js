import { rngArrayItem, rngRange } from './utils/random.js'

const colours = ['red', 'blue', 'yellow']

const createShape = () => {
  const colour = rngArrayItem(colours)

  const shapeWidth = rngRange(500, 750)
  const shapeHeight = rngRange(40, 70)

  const path = new Path2D([`M0 0`])

  let dX = 0
  let dY = 0
  const chaos = rngRange(1, 7)

  for (dX = rngRange(0, 15); dX < shapeWidth; dX += rngRange(0, shapeWidth / 4)) {
    dY += rngRange(-1 * chaos, 1 * chaos)
    path.lineTo(dX, dY)
  }

  for (dY; dY < shapeHeight; dY += shapeHeight / 6) {
    dX += rngRange(-1 * chaos, 1 * chaos)
    path.lineTo(dX, dY)
  }

  for (dX = -rngRange(0, 15); dX > 0; dX -= rngRange(0, shapeWidth / 4)) {
    dY += rngRange(-1 * chaos, 1 * chaos)
    path.lineTo(dX, dY)
  }

  for (dY; dY > 0; dY -= shapeHeight / 6) {
    dX += rngRange(-1 * chaos, 1 * chaos)
    path.lineTo(dX, dY)
  }

  path.closePath()

  return { path, colour, x: rngRange(-50, 250), y: rngRange(100, 900) }
}

const sketch = () => {
  const numberOfShapes = rngRange(10, 15)
  const shapes = Array.from({ length: numberOfShapes }, createShape)

  return (/** @type {CanvasRenderingContext2D} */ context) => {
    context.globalCompositeOperation = 'screen'
    context.globalAlpha = 0.5

    shapes.forEach(shape => {
      context.save()

      context.translate(shape.x, shape.y)
      context.fillStyle = shape.colour
      context.fill(shape.path)

      context.restore()
    })
  }
}

export default sketch
