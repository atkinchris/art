const sketch = hash => (context, width, height) => {
  const leftX = Math.floor(width * -0.5)
  const rightX = Math.floor(width * 1.5)
  const topY = Math.floor(height * -0.5)
  const bottomY = Math.floor(height * 1.5)

  const resolution = Math.floor(width * 0.05)

  const numColumns = Math.floor((rightX - leftX) / resolution)
  const numRows = Math.floor((bottomY - topY) / resolution)

  const grid = [...Array(numColumns)].map(() => Array(numRows).fill(Math.PI * 0.25))

  grid.forEach((column, columnIndex) => {
    column.forEach((row, rowIndex) => {
      const x = columnIndex * resolution + resolution * 0.5
      const y = rowIndex * resolution + resolution * 0.5
      context.moveTo(x, y)
      context.lineTo(x + 10 * Math.cos(row), y + 10 * Math.sin(row))
      context.stroke()
    })
  })
}

export default sketch
