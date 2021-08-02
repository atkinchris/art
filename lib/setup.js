import { getRandomHash, setSeed } from './utils/random.js'

// Sketches have an instrinsic width of 1000 units.
const SKETCH_SIZE = 1000
// Download them at double scale (2000px).
const DOWNLOAD_SCALE = 2

const createDownloadFunction = (render, hash) => () => {
  const exportCanvas = document.createElement('canvas')
  exportCanvas.width = SKETCH_SIZE * DOWNLOAD_SCALE
  exportCanvas.height = SKETCH_SIZE * DOWNLOAD_SCALE

  const exportContext = exportCanvas.getContext('2d')
  exportContext.scale(DOWNLOAD_SCALE, DOWNLOAD_SCALE)

  render(exportContext)

  const link = document.createElement('a')
  link.download = `${hash}.png`
  link.href = exportCanvas.toDataURL()
  link.click()
  link.delete()
}

const setupSketch = sketch => {
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

    scale = (width / SKETCH_SIZE) * devicePixelRatio

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

  const downloadButton = document.getElementById('download')
  downloadButton.addEventListener('click', createDownloadFunction(render, hash))
}

export default setupSketch
