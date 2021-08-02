/* eslint-disable no-restricted-syntax */
// Hull caculator, using Andrew's monotone chain algoritm
// https://en.wikibooks.org/wiki/Algorithm_Implementation/Geometry/Convex_hull/Monotone_chain#JavaScript
// https://www.nayuki.io/page/convex-hull-algorithm

const sortPoints = (a, b) => {
  if (a.x < b.x) return -1
  if (a.x > b.x) return +1
  if (a.y < b.y) return -1
  if (a.y > b.y) return +1
  return 0
}

const cross = (a, b, o) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x)

const calculateHull = points => {
  // If there are three or fewer points, we've already got the smallest hull possible.
  // Return the points as the hull.
  if (points.length <= 3) return points

  // Sort the points first by X, then by Y
  const sortedPoints = [...points].sort(sortPoints)

  // Define two arrays, which will hold the upper and lower halves of the hull.
  const lower = []
  const upper = []

  for (const point of sortedPoints) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], point) <= 0) {
      lower.pop()
    }
    lower.push(point)
  }

  // Reverse the order of the points, so we can iterate through them backwards to do the other half of the hull.
  sortedPoints.reverse()

  for (const point of sortedPoints) {
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], point) <= 0) {
      upper.pop()
    }
    upper.push(point)
  }

  // Pop the last point of each half of the hull. This is the conjoining point with the other half of the hull.
  upper.pop()
  lower.pop()

  // Return the combined points of the two hulls.
  return lower.concat(upper)
}

export default calculateHull
