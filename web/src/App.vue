<template>
  <div class="container">

    <div class="camera">
      <div class="camera__container">
        <div class="camera__main">
          <video ref="video" class="camera__video" autoplay>Video stream not available.</video>
          <img v-show="takedPhoto" :src="images" class="camera__img" alt="The screen capture will appear in this box."> 

        </div>
        <div class="camera__footer">
          <button class="btn start-button" @click.prevent="start">Start stream</button>
          <button class="btn take-button" @click.prevent="take"><div></div><div></div></button>
          <button class="btn stop-button" @click.prevent="clearphoto">Clear photo</button>
        </div>
      </div>
    </div>

    <div>{{error}}</div>


    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'App',
  data: () => ({
    url: 'http://localhost:80/api',
    width: 640,
    height: 480,

    streaming: false,
    takedPhoto: false,

    video: null,
    canvas: null,
    images: '',
    error: null,

  }),

  mounted(){  
    this.video = this.$refs.video
    this.canvas = this.$refs.canvas
  },

  methods: {
    async get(){
      const values = await axios.get(this.url) 
    },
    async post(){
      const values = await axios.post(this.url, { value: this.input })     
    },

    handleError(error){
      console.log(typeof error)
      console.log(error)
      console.log(error.message)
      console.log(error instanceof Error )

      if (!this.error && error && error.constraint && error.constraint === 'facingMode'){
        this.error = 'facingMode'        
        window.navigator.mediaDevices.getUserMedia({ audio: false, video: true })
          .then((stream) => {
            this.video.srcObject = stream
          })
          .catch((err)=> {
            this.handleError(err)
          });         
      }

      if (!this.error && error.message === 'Requested device not found' ){
        this.error = error.message  
        window.navigator.mediaDevices.getUserMedia({ audio: false, video: true })
          .then((stream) => {
            this.video.srcObject = stream
          })
          .catch((err)=> {
            this.handleError(err)
          });  
      }

      if (!this.error && error.message === 'Permission denied' ){
        this.error = error.message  
        window.navigator.mediaDevices.getUserMedia({ audio: false, video: true })
          .then((stream) => {
            this.video.srcObject = stream
          })
          .catch((err)=> {
            this.handleError(err)
          });  
      }

    },


    start() {
      window.navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: { exact: "environment" } } })
        .then((stream) => {
          this.video.srcObject = stream
        })
        .catch((err)=> {
          this.handleError(err)
        });  
    },

    clearphoto() {
      this.takedPhoto = false
      this.streaming = false
      this.images = ''
      this.video.srcObject = null
      this.error = null
    },
    take() {      
      var context = this.canvas.getContext('2d')    
      this.width = this.video.clientWidth
      this.height = this.video.clientHeight

      this.canvas.width = this.width
      this.canvas.height = this.height
      context.drawImage(this.video, 0, 0, this.width, this.height)
    
      var data = this.canvas.toDataURL('image/png')       
      this.images = data

      this.takedPhoto = true
    },
  }
}
</script>

<style>

* {
  box-sizing: border-box;
}

body {
  padding: 0px;
  margin: 0px;
}

.container {
  max-width: 1200px;
  min-width: 290px;
  margin: 0 auto;
  padding: 30px 10px 0 10px;
}

.camera {
}

.camera__container {
  position: relative;
}

.camera__main {
  position: relative;
  border: 1px solid #000;
  width: 100%;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  overflow: hidden;
  background-color: grey;
}

.camera__video {
  width: 100%;
}
.camera__img {
  position: absolute;
  top: 0px;
  right: 0px;
  /* width: 100%;
  height: 100%; */
  object-fit: cover;
}

.camera__footer {
  background-color: #000;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.take-button {
  position: relative;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  padding: 0px;
  cursor: pointer;
}

.take-button div:nth-child(1) {
  position: absolute;
  top: 0px;
  left: 0px;
  border: 2px solid #fff;
  border-radius: 50%;
  width: 100%;
  height: 100%;
  background-color: #000;
}

.take-button div:nth-child(2) {
  position: absolute;
  top: 0px;
  left: 0px;
  border-radius: 50%;
  width: 100%;
  height: 100%;
  background-color: #fff;
  transition: all 0.2s ease-in;
}

.take-button:active div:nth-child(2){
  transform: scale(0.75);
}

.btn {
  border: none;
}

.start-button {
  background-color: green;
  border-radius: 10px;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.stop-button {
  background-color: rgb(255, 53, 53);
  border-radius: 10px;  
  border-radius: 10px;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;

}

canvas {
  display:none;
}

</style>
