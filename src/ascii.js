export default {
  options: {
    contrast: 30,
    characters: [
      ' ', '.', ',', ',', ',', ':', ';',
      'i', '1', 't', 'f', 'C',
      'E', 'G', '0', '8', '@'
    ]
  },
  fromCanvas (canvas, options) {
    this.options.contrast = options.contrast || this.options.contrast
    this.options.characters = options.characters || this.options.characters

    return this._makeAscii(canvas)
  },
  _truncate (value) {
    if (value < 0) {
      return 0
    }

    if (value > 255) {
      return 255
    }

    return value
  },
  _getContrastedColor (pixelColor) {
    const contrastFactor = this._contrastFactor()

    return {
      red: this._truncate(contrastFactor * (pixelColor.red - 128) + 128),
      green: this._truncate(contrastFactor * (pixelColor.green - 128) + 128),
      blue: this._truncate(contrastFactor * (pixelColor.blue - 128) + 128)
    }
  },
  _contrastFactor () {
    return (259 * (this.options.contrast + 255)) / (255 * (259 - this.options.contrast));
  },
  _getColorAtOffset (imageData, offset) {
    return {
      red: imageData[offset],
      green: imageData[offset + 1],
      blue: imageData[offset + 2]
    }
  },
  _makeAscii (canvas) {
    var x, y, index, contrastedColor, pixelBrightness, asciiComposition = '';

    const context = canvas.getContext('2d')
    const image = context.getImageData(0, 0, canvas.width, canvas.height)

    for (y = 0; y < canvas.height; y += 2) {
      for (x = 0; x < canvas.width; x++) {
        index = (y * canvas.width + x) * 4

        contrastedColor = this._getContrastedColor(this._getColorAtOffset(image.data, index))

        pixelBrightness = (0.299 * contrastedColor.red + 0.587 * contrastedColor.green + 0.114 * contrastedColor.blue) / 255

        asciiComposition += this.options.characters[
          (this.options.characters.length - 1) - Math.round(pixelBrightness * (this.options.characters.length - 1))
        ]
      }

      asciiComposition += '\n'
    }

    return asciiComposition
  }
}
