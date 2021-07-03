<template>
  <div>
    <div class="camera">
      <div class="camera__container">
        <div class="camera__main">
          <video ref="video" class="camera__video" autoplay playsinline>Video stream not available.</video>
          <img v-show="image.url" :src="image.url" class="camera__img" alt="Capture image."> 

        </div>
        <div class="camera__footer">
          <button class="btn start-button" @click.prevent="start">Start stream</button>
          <button class="btn take-button" @click.prevent="take"><div></div><div></div></button>
          <button class="btn stop-button" @click.prevent="clearphoto">Clear photo</button>
          <button class="btn stop-button" @click.prevent="clearphoto">Send photo</button>
        </div>
      </div>
    </div>

    <div>
      <ul>
        <li>error: {{ error }}</li>
      </ul>
    </div>
    <div v-for="(device, index) of devices" :key="index" class="device">
      <div class="device__key">deviceId</div>
      <div class="device__value">{{device.deviceId }}</div>
      <div class="device__key">kind</div>
      <div class="device__value">{{device.kind }}</div>
      <div class="device__key">label</div>
      <div class="device__value device__value_btn" @click.prevent="currentDivice = device">{{device.label }}</div>
      <div class="device__key">groupId</div>
      <div class="device__value">{{device.groupId }}</div>
    </div>

    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Camera',
  data: () => ({
    url: 'http://localhost:80/api',
    width: 640,
    height: 480,
    video: null,
    canvas: null,
    error: null,
    devices: [],
    currentDivice: null,
    image: {
      blob: null,
      url: '',
      quality: 1,
      type: 'image/png'
    },

    supportedConstraints: []
  }),

  mounted(){  
    this.video = this.$refs.video
    this.canvas = this.$refs.canvas
    this.getConnectedDevices('videoinput')
  },

  methods: {
    async get(){
      const values = await axios.get(this.url) 
    },
    async post(){
      const values = await axios.post(this.url, { value: this.input })     
    },

    getConnectedDevices(type) {      
      window.navigator.mediaDevices.enumerateDevices()
        .then((devices) => {
          let filtredDevices = devices.filter((el) => el.kind === type && el.label && el.deviceId )
          if (!filtredDevices.length) return

          if (filtredDevices.length > 2) {
            let front = []
            let back = []
            let undef = []

            filtredDevices.forEach((el) => {
              const str = el.label.toLowerCase()
              if (str.includes('back') || str.includes('задней')) {
                back.push(el)
              } else if (str.includes('front') || str.includes('передней')) {
                front.push(el)
              } else undef.push (el) 
            })

            const sortFunc = (a, b) => {
              if (a.label < b.label) return -1            
              if (a.label > b.label) return 1
              return 0;
            }

            front = front.sort(sortFunc)
            back = back.sort(sortFunc)

            this.devices = [front[0], back[0]]
          } else this.devices = filtredDevices

          this.currentDivice = this.devices[0]
        })
        .catch((err) => {
          console.error(err.name + ": " + err.message)
        });
    },

    handleError(error){
      console.log(error)

      if (!this.error && error && error.constraint && error.constraint === 'facingMode'){
        this.error = 'facingMode'        
        window.navigator.mediaDevices.getUserMedia({ audio: false, video: true })
          .then((stream) => {
            this.video.srcObject = stream
            this.getConnectedDevices('videoinput')
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
            this.getConnectedDevices('videoinput')
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
            this.getConnectedDevices('videoinput')
          })
          .catch((err)=> {
            this.handleError(err)
          });  
      }

    },

    start() {
      const video = this.currentDivice && this.currentDivice.deviceId ? { 'deviceId': this.currentDivice.deviceId } : { facingMode: { exact: "environment" } }
      const constraints = {
        audio: false,
        video
      }
      window.navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {
          this.video.srcObject = stream
          this.getConnectedDevices('videoinput')
        })
        .catch((err)=> {
          this.handleError(err)
        });  
    },

    clearphoto() {
      this.image.url = ''
      this.image.blob = null
    },

    take() {      
      var context = this.canvas.getContext('2d')    
      this.width = this.video.clientWidth
      this.height = this.video.clientHeight

      this.canvas.width = this.width
      this.canvas.height = this.height
      context.drawImage(this.video, 0, 0, this.width, this.height)

      this.canvas.toBlob((blob)=>{
        console.log(blob)        
        this.image.blob = blob
        this.image.url = URL.createObjectURL(blob)
      }, this.image.type, this.image.quality)  
    },
  }
}
</script>

<style scoped>

.camera__container {
  position: relative;
  max-width: 800px;
  min-width: 290px;
  margin: 0 auto;
  padding: 30px 10px 50px 10px;
}

.camera__main {
  position: relative;
  border: 1px solid #000;
  width: 100%;
  /* border-top-right-radius: 10px;
  border-top-left-radius: 10px; */
  /* overflow: hidden; */
  background-color: grey;
}

.camera__video {
  width: 100%;
}

.camera__img {
  position: absolute;
  top: 0px;
  right: 0px;
  object-fit: cover;
}

.camera__footer {
  background-color: #000;
  /* border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px; */
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.take-button {
  position: relative;
  border-radius: 50%;
  width: 50px;
  height: 50px;
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
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

canvas {
  display:none;
}

.device{
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 5px;
  margin-bottom: 20px;
}

.device__key {
  background-color: rgb(111, 111, 233);
  border-radius: 4px;
  padding: 5px;
}

.device__value {
  background-color: green;
  border-radius: 4px;
  padding: 5px;
}

.device__value_btn {
  cursor: pointer;
}

</style>
