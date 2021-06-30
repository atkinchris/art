import { rngRange } from './utils/random.js'

const sketch = () => {
  const shapes = []

  const createShape = (x, y, w, h, colour) => {
    const shapeWidth = w * rngRange(0.9, 1.1)
    const shapeHeight = h * rngRange(0.9, 1.2)

    const pathParts = [`M${x} ${y}`]

    pathParts.push(`h ${shapeWidth}`)
    pathParts.push(`v ${shapeHeight}`)
    pathParts.push(`h ${-shapeWidth}`)

    pathParts.push('Z')

    const path = new Path2D(pathParts.join(' '))

    shapes.push({ path, colour })
  }

  createShape(100, 10, 1000 * 0.8, 1000 / 25, 'red')
  createShape(100, 60, 1000 * 0.8, 1000 / 25, 'blue')
  createShape(100, 110, 1000 * 0.8, 1000 / 25, 'yellow')

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
