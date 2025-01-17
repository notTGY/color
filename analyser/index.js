import { Color } from '../color.js'
const ctx = c.getContext('2d')

fileInput.onchange = e => {
  const file = e.target.files[0]
  const objectURL = URL.createObjectURL(file)
  const img = document.createElement('img')
  img.src = objectURL
  img.onload = e => {
    fileInput.remove()
    c.width = img.width
    c.height = img.height
    ctx.drawImage(
      img, 0, 0, img.width, img.height
    )

    preview.width = img.width
    preview.height = img.height
    preview.getContext('2d').drawImage(
      img, 0, 0, img.width, img.height
    )

    original.width = img.width
    original.height = img.height
    original.getContext('2d').drawImage(
      img, 0, 0, img.width, img.height
    )

    requestAnimationFrame(
      () => new Promise((res) => {
        analyse()
        res()
      })
    )
  }
}

async function analyse() {
  const imageData =
    ctx.getImageData(0, 0, c.width, c.height)
  const data = imageData.data

  const colors = []
  let lMax = 0

  for (let i = 0; i < data.length / 4; i++) {
    const r = data[i*4]
    const g = data[i*4+1]
    const b = data[i*4+2]
    const o = data[i*4+3]
    const t = new Color({r, g, b})

    colors.push(t)
    lMax = Math.max(lMax, t.l)
  }

  for (let i = 0; i < data.length / 4; i++) {
    const t = colors[i]
    const mult = 0.33 / lMax
    data[i*4] = Math.floor(t.r * mult)
    data[i*4+1] = Math.floor(t.g * mult)
    data[i*4+2] = Math.floor(t.b * mult)
  }
  ctx.putImageData(imageData, 0, 0)


  const clusters = splitToClusters(colors)
  const clustersSorted = clusters.sort(
      (a, b) => b.weight - a.weight
    )
  const colorsDiv = document.getElementById('colors')
  clustersSorted.forEach(cluster => {
    const container = document.createElement('div')
    container.className = 'color-container'
    const label = document.createElement('div')
    label.innerText = cluster.color.getStyle()
    const color = document.createElement('div')
    color.className = 'color'
    color.style.background = cluster.color.getStyle()
    container.append(color)
    container.append(label)

    colorsDiv.append(container)
  })
}

const MAX_DIST = 10000
function splitToClusters(colors) {
  const clusters = []
  colors.forEach(color => {
    for (let i = 0; i < clusters.length; i++) {
      const clusterColor = clusters[i].color
      const clusterWeight = clusters[i].weight

      if (color.dist(clusterColor) < MAX_DIST) {
        const r =
          (clusterColor.r * clusterWeight + color.r) 
          / (clusterWeight + 1)

        const g =
          (clusterColor.g * clusterWeight + color.g) 
          / (clusterWeight + 1)

        const b =
          (clusterColor.b * clusterWeight + color.b) 
          / (clusterWeight + 1)

        clusters[i] = {
          weight: clusterWeight + 1,
          color: new Color({ r, g, b })
        }
        return
      }
    }

    clusters.push({
      weight: 1,
      color,
    })
  })

  return clusters
}
