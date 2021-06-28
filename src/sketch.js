const rngBetween = (min, max) => Math.random() * (max - min) + min

const sketch =
  (/** @type {string} */ hash) =>
  (/** @type {CanvasRenderingContext2D} */ context, /** @type {number} */ width, /** @type {number} */ height) => {
    const leftX = Math.floor(width * -0.5)
    const rightX = Math.floor(width * 1.5)
    const topY = Math.floor(height * -0.5)
    const bottomY = Math.floor(height * 1.5)

    const resolution = Math.floor(width * 0.025)

    context.globalCompositeOperation = 'screen'
    context.globalAlpha = 0.5

    const drawShape = (x, y, w, h, colour) => {
      context.fillStyle = colour

      const shapeWidth = w * rngBetween(0.9, 1.1)
      const shapeHeight = h * rngBetween(0.9, 1.2)

      const path = [`M${x} ${y}`]

      path.push(`h ${shapeWidth}`)
      path.push(`v ${shapeHeight}`)
      path.push(`h ${-shapeWidth}`)

      path.push('Z')

      context.fill(new Path2D(path.join(' ')))
    }

    drawShape(100, 10, width * 0.8, height / 25, 'red')
    drawShape(100, 60, width * 0.8, height / 25, 'blue')
    drawShape(100, 110, width * 0.8, height / 25, 'yellow')
  }

export default sketch
