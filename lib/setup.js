import { getRandomHash, setSeed } from './utils/random.js'

// Sketches have an instrinsic width of 1000 units.
const SKETCH_SIZE = 1000
// Download them at double scale (2000px).
const DOWNLOAD_SCALE = 2

const setupSketch = sketch => {
  const hash = window.tokenData || getRandomHash()
  document.getElementById('hash').innerText = hash

  const draw = scale => {
    setSeed(hash)

    const canvas = document.createElement('canvas')

    canvas.width = Math.floor(SKETCH_SIZE * scale)
    canvas.height = Math.floor(SKETCH_SIZE * scale)

    const context = canvas.getContext('2d')
    context.save()
    context.scale(scale, scale)
    sketch(context)
    context.restore()

    return canvas.toDataURL()
  }

  const renderForBrowser = () => {
    const scale = (window.innerWidth / SKETCH_SIZE) * window.devicePixelRatio
    const data = draw(scale)

    const image = document.getElementById('sketch-image')
    image.src = data
  }

  window.addEventListener('resize', () => window.requestAnimationFrame(renderForBrowser))
  renderForBrowser()

  const renderForDownload = () => {
    const data = draw(DOWNLOAD_SCALE)

    const link = document.createElement('a')
    link.download = `${hash}.png`
    link.href = data
    link.click()
    link.delete()
  }

  const downloadButton = document.getElementById('download')
  downloadButton.addEventListener('click', renderForDownload)
}

export default setupSketch
