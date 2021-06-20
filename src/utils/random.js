/* eslint-disable prefer-destructuring */

const prng = hash => {
  const state = Uint32Array.from([0, 0, 0, 0].map((_, i) => parseInt(hash.substr(i * 8 + 2, 8), 16)))
  let s = state[3]
  let t = state[3]
  state[3] = state[2]
  state[2] = state[1]
  s = state[0]
  state[1] = s
  t ^= t << 11
  t ^= t >>> 8
  state[0] = t ^ s ^ (s >>> 19)
  return state[0] / 0x100000000
}

const getRandomHash = () => {
  let result = '0x'
  for (let i = 64; i > 0; i -= 1) {
    result += '0123456789abcdef'[~~(Math.random() * 16)]
  }
  return result
}

export { prng, getRandomHash }
