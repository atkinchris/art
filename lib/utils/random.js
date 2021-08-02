const state = new Uint32Array(4)
const stateView = new DataView(state.buffer)

// MurmurHash3 stateful hash generator
const xmur3 = seed => {
  let hashState = 1779033703 ^ seed.length

  for (let i = 0; i < seed.length; i += 1) {
    hashState = Math.imul(hashState ^ seed.charCodeAt(i), 3432918353)
    hashState = (hashState << 13) | (hashState >>> 19)
  }

  return () => {
    hashState = Math.imul(hashState ^ (hashState >>> 16), 2246822507)
    hashState = Math.imul(hashState ^ (hashState >>> 13), 3266489909)
    hashState ^= hashState >>> 16
    return hashState >>> 0
  }
}

const setSeed = seed => {
  const hash = xmur3(seed)

  stateView.setUint32(0, hash())
  stateView.setUint32(4, hash())
  stateView.setUint32(8, hash())
  stateView.setUint32(12, hash())
}

// PRNG generator, based on SFC32. Returns a value between 0..1.
const rng = () => {
  let [a, b, c, d] = state

  a >>>= 0
  b >>>= 0
  c >>>= 0
  d >>>= 0

  let t = (a + b) | 0

  a = b ^ (b >>> 9)
  b = (c + (c << 3)) | 0
  c = (c << 21) | (c >>> 11)
  d = (d + 1) | 0
  t = (t + d) | 0
  c = (c + t) | 0

  state[0] = a
  state[1] = b
  state[2] = c
  state[3] = d

  return (t >>> 0) / 4294967296
}

const rngBoolean = () => rng() > 0.5

const rngRange = (min, max) => rng() * (max - min) + min

const rngRangeFloor = (min, max) => Math.floor(rngRange(min, max))

const rngArrayItem = array => (array.length ? array[rngRangeFloor(0, array.length)] : undefined)

const getRandomHash = () => {
  let result = '0x'

  for (let i = 64; i > 0; i -= 1) {
    result += '0123456789abcdef'[~~(Math.random() * 16)]
  }

  return result
}

export { xmur3, setSeed, rng, rngBoolean, rngRange, rngRangeFloor, rngArrayItem, getRandomHash }
