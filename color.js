// http://www.had2know.org/technology/hsl-rgb-color-converter.html
function HSLfromRGB(r, g, b) {
  const M = Math.max(Math.max(r, g), b)
  const m = Math.min(Math.min(r, g), b)
  const d = (M - m) / 255

  const L = (M + m) / 510
  if (isNaN(L)) {
    console.log(M, m)
  }

  const S = L > 0
    ? d / (1 - Math.abs(2 * L - 1))
    : 0

  const val = r - g/2 - b/2
  const norm = Math.sqrt(r**2 + g**2 + b**2 - r*g - r*b - g*b)
  const deviation = norm === 0 ? 0 : Math.acos(val / norm)
  
  const H = g >= b
    ? deviation
    : 2 * Math.PI - deviation

  return {
    h: H,
    s: S,
    l: L,
  }
}

function RGBfromHSL(H, S, L) {
  const d = S * (1 - Math.abs(2 * L - 1))
  const m = 255 * (L - d / 2)

  const deg60 = Math.PI / 3
  const x = d * (1 - Math.abs((H / deg60) % 2 - 1))

  if (H >= 0 && H < deg60) {
    return {
      r: 255*d + m,
      g: 255*x + m,
      b: m,
    }
  } else if (H >= deg60 && H < 2*deg60) {
    return {
      r: 255*x + m,
      g: 255*d + m,
      b: m,
    }
  } else if (H >= 2*deg60 && H < 3*deg60) {
    return {
      r: m,
      g: 255*d + m,
      b: 255*x + m,
    }
  } else if (H >= 3*deg60 && H < 4*deg60) {
    return {
      r: m,
      g: 255*x + m,
      b: 255*d + m,
    }
  } else if (H >= 4*deg60 && H < 5*deg60) {
    return {
      r: 255*x + m,
      g: m,
      b: 255*d + m,
    }
  } else if (H >= 5*deg60 && H < 6*deg60) {
    return {
      r: 255*d + m,
      g: m,
      b: 255*x + m,
    }
  }
}

export class Color {
  constructor({r, g, b, h, s, l}) {
    if (typeof r != "undefined") {
      this.r = r;
      this.g = g;
      this.b = b;

      const HSL = HSLfromRGB(r, g, b)

      this.h = HSL.h
      this.s = HSL.s
      this.l = HSL.l

      return
    } else if (typeof h != "undefined") {
      this.h = h
      this.s = s
      this.l = l

      const RGB = RGBfromHSL(h, s, l)

      this.r = RGB.r;
      this.g = RGB.g;
      this.b = RGB.b;
      return
    }
  }

  getStyle() {
    return `rgb(${this.r} ${this.g} ${this.b})`
  }

  dist(otherColor) {
    const dr = this.r - otherColor.r
    const dg = this.g - otherColor.g
    const db = this.b - otherColor.b
    return dr**2 + dg**2 + db**2
  }
}

