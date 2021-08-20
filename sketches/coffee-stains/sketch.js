const degreesToRadians = degrees => degrees * (Math.PI / 180)

const getPointOnCircle = (origin, radius, angle) => ({
  x: origin[0] + radius * Math.cos(degreesToRadians(angle)),
  y: origin[1] + radius * Math.sin(degreesToRadians(angle)),
})

const sketch = (/** @type {CanvasRenderingContext2D} */ context) => {
  const points = Array.from({ length: 15 }, (_, i) => getPointOnCircle([500, 500], 250, i * 5)).reduce(
    (path, point) => {
      path.lineTo(point.x, point.y)
      return path
    },
    new Path2D()
  )

  context.save()

  context.globalCompositeOperation = 'multiply'
  context.globalAlpha = 0.95
  context.fillStyle = 'brown'
  context.fill(points)

  context.restore()
}

export default sketch
