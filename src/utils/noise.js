// This Simplex noise implementation is derived from:
// the original patent, https://patents.google.com/patent/US6867776B2/en,
// Wikipedia, https://en.wikipedia.org/wiki/Simplex_noise,
// And existing, popular implementations:
// https://weber.itn.liu.se/~stegu/simplexnoise/simplexnoise.pdf
// https://weber.itn.liu.se/~stegu/simplexnoise/SimplexNoise.java
// https://github.com/josephg/noisejs/blob/master/perlin.js
// https://github.com/jwagner/simplex-noise.js/blob/master/simplex-noise.js
//
// Inspiration on hashing and permutation tables was taken from:
// https://gamedev.stackexchange.com/questions/65653/using-a-permutation-table-for-simplex-noise-without-storing-it
// https://stackoverflow.com/questions/18801877/why-do-all-simplex-noise-algorithms-have-a-permutation-gradient-table

import { xmur3 } from './random.js'

// Basic 3D gradient object, to do dot operations
class Gradient {
  constructor(x, y, z) {
    this.x = x
    this.y = y
    this.z = z
  }

  dot2(x, y) {
    return this.x * x + this.y * y
  }

  dot3(x, y, z) {
    return this.x * x + this.y * y + this.z * z
  }
}

// A stardised array of gradients, for 3D noise.
// These are the midpoints of each of the 12 edges of a cube centered on the origin
const gradients = [
  new Gradient(1, 1, 0),
  new Gradient(-1, 1, 0),
  new Gradient(1, -1, 0),
  new Gradient(-1, -1, 0),
  new Gradient(1, 0, 1),
  new Gradient(-1, 0, 1),
  new Gradient(1, 0, -1),
  new Gradient(-1, 0, -1),
  new Gradient(0, 1, 1),
  new Gradient(0, -1, 1),
  new Gradient(0, 1, -1),
  new Gradient(0, -1, -1),
]

const getNoise = (x, y, z = 0) => {
  // We need a skew factor that fits the equation: (Math.sqrt(n + 1) - 1) / n
  // https://en.wikipedia.org/wiki/Simplex_noise#Coordinate_skewing
  // In three dimensions (n = 3), this equation pleasantly reduces to 1/3.
  const f = 1 / 3
  // Sum the coordinates together.
  const sum = x + y + z
  // Skew each coordinate into the simplicial grid, using the equation x' = x + (x + y + z) * F
  // Flooring each of these skewed coordinates gives us the corner vertex (origin) of the surrounding cell.
  // This could be done as two steps (skew, then floor) but we're combining them for terseness.
  const i = Math.floor(x + sum * f)
  const j = Math.floor(y + sum * f)
  const k = Math.floor(z + sum * f)

  // We define a function to unskew coordinates into (x, y, z) space.
  const unskew = (i1, j1, k1) => {
    // Unskew each coordinate by subtracting a value based on the cube from them.
    const unskewFactor = (i1 + j1 + k1) / 6
    return [i1 - unskewFactor, j1 - unskewFactor, k1 - unskewFactor]
  }

  // Unskew each coordinate of the corner point.
  const [x1, y1, z1] = unskew(i, j, k)
  // We further calculate the distances of the input coordinates from the cell origin.
  // Note: u, v, w are used here to match the original algorithm notation. Their naming is arbitrary.
  const u = x - x1
  const v = y - y1
  const w = z - z1

  // We need to now find which Schläfli orthoscheme simplex the point lies in.
  // It could be one of six simplices (below). Each represents a traversal order from the origin,
  // visiting each point in the simplex, and ending at a common end.
  // Note: their common origins (0,0,0) and end points (1,1,1) have been excluded for terseness.
  const simplices = {
    XYZ: [1, 0, 0, 1, 1, 0],
    XZY: [1, 0, 0, 1, 0, 1],
    YXZ: [0, 1, 0, 1, 1, 0],
    YZX: [0, 1, 0, 0, 1, 1],
    ZXY: [0, 0, 1, 1, 0, 1],
    ZYX: [0, 0, 1, 0, 1, 1],
  }
  // The traversal order is determined by the relative magnitude order of the cell coordinates.
  const traversalOrder = [
    { dimension: 'X', magnitude: u },
    { dimension: 'Y', magnitude: v },
    { dimension: 'Z', magnitude: w },
  ]
    .sort((t1, t2) => t2.magnitude - t1.magnitude)
    .map(t => t.dimension)
    .join('')

  // Select the coresponding simplex by it's traversal order.
  const simplex = simplices[traversalOrder]

  // Unskew the surrounding vertices for the simplex, then translate them against the (x, y, z) origin.
  const vertices = [
    // Our vertices all start from (0,0,0)...
    unskew(0, 0, 0),
    unskew(simplex[0], simplex[1], simplex[2]),
    unskew(simplex[3], simplex[4], simplex[5]),
    // ...and they all end at (1,1,1)
    unskew(1, 1, 1),
  ].map(([vX, vY, vZ]) => [u - vX, v - vY, w - vZ])

  // From each of the vertices, we need to calcuate it's contributions to the final noise value.
  const vertexNoises = vertices.map(([vX, vY, vZ]) => {
    // Calculate t for this vertex. This equation is given in the original paper, without explanation.
    const t = 0.6 - ((vX ^ 2) - (vY ^ 2) - (vZ ^ 2))

    // If t is less than zero, we return 0 and move on.
    if (t < 0) return 0

    const gradientIndex = xmur3(vX + vY + vZ)() % gradients.length
    const gradient = gradients[gradientIndex]

    return (t ^ 4) * gradient.dot3(vX, vY, vZ)
  })
  // We then sum the noise value for each of the vertices together.
  const noiseSum = vertexNoises.reduce((a, b) => a + b)

  // Return the sum of the noise, scaled into the positive range.
  return 32 + noiseSum
}

// eslint-disable-next-line import/prefer-default-export
export { getNoise as getNoise2D }
