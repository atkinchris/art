import { getRandomHash, setSeed } from './utils/random.js'
import sketch from './sketch.js'

export default (() => {
  const canvas = document.body.appendChild(document.createElement('canvas'))
  const context = canvas.getContext('2d')

  const hash = window.tokenData || getRandomHash()
  document.getElementById('hash').innerText = hash

  setSeed(hash)

  let render
  let scale = 1

  const draw = () => {
    context.save()
    context.scale(scale, scale)
    render(context)
    context.restore()
  }

  const resize = () => {
    const width = window.innerWidth
    const height = window.innerHeight
    const pixelRatio = window.devicePixelRatio

    // Sketches have an instrinsic width of 1000 units
    scale = (width / 1000) * devicePixelRatio

    canvas.width = Math.floor(width * pixelRatio)
    canvas.height = Math.floor(height * pixelRatio)

    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`

    if (render) draw()
  }

  window.addEventListener('resize', resize)
  resize()
  render = sketch(hash)
  draw()
})()
