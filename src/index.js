import { getRandomHash, setSeed } from './utils/random.js'
import sketch from './sketch.js'

export default (() => {
  const canvas = document.body.appendChild(document.createElement('canvas'))
  const context = canvas.getContext('2d')

  const hash = window.tokenData || getRandomHash()
  setSeed(hash)

  let render
  let width
  let height
  let pixelRatio

  const draw = () => {
    context.save()
    context.scale(pixelRatio, pixelRatio)
    render(context, width, height)
    context.restore()
  }

  const resize = () => {
    width = window.innerWidth
    height = window.innerHeight
    pixelRatio = window.devicePixelRatio
    canvas.width = ~~(width * pixelRatio)
    canvas.height = ~~(height * pixelRatio)
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    if (render) draw()
  }

  window.addEventListener('resize', resize)
  resize()
  render = sketch(hash)
  draw()
})()
