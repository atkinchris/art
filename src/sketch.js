import { rngArrayItem, rngRange } from './utils/random.js'

const colours = ['red', 'blue', 'yellow']

const createShape = () => {
  const colour = rngArrayItem(colours)
  const x = rngRange(-50, 250)
  const y = rngRange(100, 900)
  const shapeWidth = rngRange(500, 750)
  const shapeHeight = rngRange(40, 70)

  const pathParts = [`M${x} ${y}`]

  pathParts.push(`h ${shapeWidth}`)
  pathParts.push(`v ${shapeHeight}`)
  pathParts.push(`h ${-shapeWidth}`)

  pathParts.push('Z')

  const path = new Path2D(pathParts.join(' '))

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
