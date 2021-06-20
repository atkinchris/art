import { getRandomHash } from './utils/random.js'
import sketch from './sketch.js'

const hash = window.tokenData || getRandomHash()

export default (() => {
  const canvas = document.body.appendChild(document.createElement('canvas'))
  const context = canvas.getContext('2d')

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
