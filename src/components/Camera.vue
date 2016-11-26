<template>
  <div v-if="error === null">

    <p v-if="stream === null">
      Please allow access to your camera when prompted
    </p>

    <video v-bind:src="stream" class="video" v-if="stream" autoplay v-el:video></video>
    <canvas class="canvas" v-el:canvas></canvas>

    <pre class="ascii" v-el:ascii></pre>

  </div>
  <div v-else>
    {{ error }}
  </div>
</template>

<script>
  import ascii from '../ascii'

  export default {
    data () {
      return {
        error: null,
        stream: null,
        context: null,
        ascii: {
          contrast: 30,
          fps: 30
        }
      }
    },
    methods: {
      _initVideo () {
        navigator.getUserMedia({
          video: true,
          audio: false
        }, (stream) => {
          this.stream = window.URL.createObjectURL(stream)

          this._bootCanvas().then(() => {
            this._startAsciiRendering()
          })
        }, this._setError)
      },
      _startAsciiRendering () {
        setInterval(() => {
          this.context.drawImage(
            this.$els.video,
            0,
            0,
            this.$els.canvas.width,
            this.$els.canvas.height
          )

          this._drawAscii()

        }, Math.round(1000 / this.ascii.fps))
      },
      _drawAscii () {
        this.$els.ascii.innerHTML = ascii.fromCanvas(this.$els.canvas, {
          contrast: this.ascii.contrast
        })
      },
      _bootCanvas () {
        return new Promise((resolve, reject) => {
          this.context = this.$els.canvas.getContext('2d')
          this.$els.canvas.width = 200
          this.$els.canvas.height = 150

          resolve()
        })
      },
      _setUnsupported () {
        this.error = 'Your browser does not support video.';
      },
      _setError () {
        this.error = 'Something went wrong. Try refreshing the page.';
      },
    },
    ready () {
      if (navigator.getUserMedia) {
        this._initVideo()
      } else {
        this._setUnsupported()
      }
    }
  }
</script>

<style scoped lang="sass">
  html, body
    width: 100%
    height: 100%
    margin: 0
    padding: 0

  .video
    width: 200px
    position: fixed
    bottom: 0
    margin: 10px
    right: 0
    z-index: 1

  .canvas
    display: none

  .ascii
    font-family: 'Courier New', 'Courier', monospace
    font-size: 10px
    line-height: 9px
    letter-spacing: -1.5px
    text-align: left
    margin: 0
</style>
