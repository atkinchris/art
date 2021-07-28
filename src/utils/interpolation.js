// Function to convert a series of points into Bezier curve tuples (C1, C2, P).
// Ported from https://francoisromain.medium.com/smooth-a-svg-path-with-cubic-bezier-curves-e37b49d46c74

const lineProperties = (a, b) => {
  const lengthX = b.x - a.x
  const lengthY = b.y - a.y

  return {
    length: Math.sqrt(lengthX ** 2 + lengthY ** 2),
    angle: Math.atan2(lengthY, lengthX),
  }
}

const getWrappedAtIndex = (array, index) => array[((index % array.length) + array.length) % array.length]

const controlPoint = (current, previous = current, next = current, reverse = false) => {
  // The smoothing ratio
  const smoothing = 0.2
  // Properties of the opposed-line
  const line = lineProperties(previous, next)

  // If is end-control-point, add PI to the angle to go backward
  const angle = line.angle + (reverse ? Math.PI : 0)
  const length = line.length * smoothing

  // The control point position is relative to the current point
  return {
    x: current.x + Math.cos(angle) * length,
    y: current.y + Math.sin(angle) * length,
  }
}

const calculateBezierSmoothPath = points =>
  points.map((point, index) => {
    const before = getWrappedAtIndex(points, index - 2)
    const previous = getWrappedAtIndex(points, index - 1)
    const next = getWrappedAtIndex(points, index + 1)

    const controlPointStart = controlPoint(previous, before, point)
    const controlPointEnd = controlPoint(point, previous, next, true)

    return [controlPointStart, controlPointEnd, point]
  })

export default calculateBezierSmoothPath
