<template>
  <div>
    <div class="camera">
      <div class="camera__container">
          <div class="camera__header">
            <div class="change-button" @click.prevent="changeCameras">
              <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 20 20" height="48px" viewBox="0 0 20 20" width="48px" fill="#000000">
                <g><rect fill="none" height="20" width="20" x="0"/></g><g><g><path d="M16,5h-2l-2-2H8L6,5H4C3.45,5,3,5.45,3,6v9c0,0.55,0.45,1,1,1h12c0.55,0,1-0.45,1-1V6C17,5.45,16.55,5,16,5z M16,15H4V6h2 h0.41l0.29-0.29L8.41,4h3.17l1.71,1.71L13.59,6H14h2V15z"/><path d="M10,6C9.28,6,8.62,6.2,8.04,6.54l0.73,0.73C9.15,7.1,9.56,7,10,7c1.65,0,3,1.35,3,3h-1.5l2,2l2-2H14C14,7.79,12.21,6,10,6 z"/><path d="M10,13c-1.65,0-3-1.35-3-3h1.5l-2-2l-2,2H6c0,2.21,1.79,4,4,4c0.72,0,1.38-0.2,1.96-0.54l-0.73-0.73 C10.85,12.9,10.44,13,10,13z"/></g></g>
              </svg>
            </div>
            <div class="clear-button" @click.prevent="clearPhoto">
              <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 0 24 24" width="48px" fill="#000000">
                <path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
              </svg>
            </div>
          </div>
        <div class="camera__main">
          <video ref="video" class="camera__video" autoplay playsinline>Video stream not available.</video>
          <img v-show="image.url" :src="image.url" class="camera__img" alt="Capture image.">           
        </div>
        <div class="camera__footer">
          <button class="btn start-button" 
            :class="{'stop-button': striming}" 
            @click.prevent="striming ? stopStriming() : startStriming()"
          >
            {{ striming ? 'Stop camera' : 'Start camera' }}
          </button>
          <button class="btn take-button" @click.prevent="takePhoto"><div></div><div></div></button>
          <button class="btn send-button" @click.prevent="sendPhoto">Send photo</button>
        </div>
      </div>
    </div>
    <canvas ref="canvas"></canvas>


    <transition>
      <div v-show="error" class="error">
        <span>Error: </span>
        <span class="error__message">{{ error }}</span>
      </div>
    </transition>

    <button
      class="btn show-button"
      :class="{'hide-button': showDevices}"
      @click="showDevices = !showDevices"
    >
      {{ showDevices ? 'Hidden devices' : 'Show devices' }}
    </button>
    <transition>
      <div v-if="showDevices"> 
        <div v-if="devices.length || allDevices.length">              
          <div v-if="currentDivice" class="device">
            <div class="device__title">Current device</div>
            <div>
              <span class="device__value" >{{currentDivice.label }}</span>
            </div>
          </div>
          <div v-if="devices.length" class="device">
            <div class="device__title">Available devices:</div>
            <div v-for="(device, index) of devices" :key="index" class="device__list">
              <span class="device__value device__value_btn" @click.prevent="currentDivice = device">{{device.label }}</span>
            </div>
          </div>
          <div v-if="allDevices.length" class="device">
            <div class="device__title">All devices:</div>
            <div v-for="(device, index) of allDevices" :key="index" class="device__list">
              <span class="device__value device__value_btn" @click.prevent="currentDivice = device">{{device.label }}</span>
            </div>
          </div>
        </div> 
        <div v-else >Don't detected devises</div>
      </div>
    </transition>

  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Camera',
  data: () => ({
    url: 'http://localhost:80/api',
    width: 0,
    height: 0,
    video: null,
    canvas: null,
    error: null,
    devices: [],
    allDevices: [],
    currentDivice: null,
    image: {
      blob: null,
      url: '',
      quality: 1,
      type: 'image/png'
    },
    stream: null,
    striming: false,
    showDevices: false,
  }),

  async mounted(){  
    this.canvas = this.$refs.canvas
    this.video = this.$refs.video

    navigator.mediaDevices.ondevicechange = async (event) => {
      await this.getConnectedDevices('videoinput')
      this.startStriming()     
    }

    await this.getConnectedDevices('videoinput')
    
  },  

  methods: {
    async get(){
      const values = await axios.get(this.url) 
    },
    async post(){
      const values = await axios.post(this.url, { value: this.input })     
    },

    setError(err) {
      this.error = err
      setTimeout(()=>{
        this.error = null
      }, 4000)
    },

    async getConnectedDevices(type) {     
      try {
        let devices = await window.navigator.mediaDevices.enumerateDevices()
        
        let filtredDevices = devices.filter((el) => el.kind === type && el.label && el.deviceId )
        if (!filtredDevices.length) return

        this.allDevices = filtredDevices
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

      } catch (error) {
        this.setError(error.message)
      }       
    },

    handleError(error){
      console.log(error)

      if (!this.error && error && error.constraint && error.constraint === 'facingMode'){
        this.setError('facingMode' )
      }

      if (!this.error && error.message === 'Requested device not found' ){
        this.setError(error.message)
      }

      if (!this.error && error.message === 'Permission denied' ){
        this.setError(error.message)
      }

    },

    startStriming() {      
      const constraints = {
        audio: false,
        video: this.currentDivice && this.currentDivice.deviceId ? { 'deviceId': this.currentDivice.deviceId } : true
      }

      window.navigator.mediaDevices.getUserMedia(constraints)
        .then((mediaStream) => {
          if ('srcObject' in this.video) {
            this.video.srcObject = mediaStream;
          } else {
            this.video.src = URL.createObjectURL(mediaStream);
          }      
          this.stream = mediaStream          
          this.striming = true
        })
        .catch((err)=> {
          this.handleError(err)
        });  
    },

    stopStriming(){
      const tracks = this.stream.getTracks()
      tracks.forEach((track) => track.stop())
      this.video.srcObject = null
      this.stream = null
      this.striming = false
      this.clearPhoto()
    },

    changeCameras(){      
      if (!this.currentDivice || this.devices.length < 2) return this.setError('You have only one camera')
      this.stopStriming()

      const newCurrentDivice = this.devices.filter((el) => el.deviceId !== this.currentDivice.deviceId)
      this.currentDivice = newCurrentDivice[0]

      this.startStriming()
    },

    takePhoto() {   
      if (!this.striming) return this.setError('Start camera')
      var context = this.canvas.getContext('2d')    
      this.width = this.video.clientWidth
      this.height = this.video.clientHeight

      this.canvas.width = this.width
      this.canvas.height = this.height
      context.drawImage(this.video, 0, 0, this.width, this.height)

      this.canvas.toBlob((blob)=>{       
        this.image.blob = blob
        this.image.url = URL.createObjectURL(blob)
      }, this.image.type, this.image.quality)  
    },

    clearPhoto() {
      if (!this.image.url) return
      this.image.url = ''
      this.image.blob = null
    },

    sendPhoto(){
      if (!this.striming && !this.image.blob) return this.setError('Take photo')
    },
  }
}
</script>

<style scoped>

.v-enter-active, .v-leave-active {
  transition: opacity .5s;
}
.v-enter, .v-leave-to {
  opacity: 0;
}

.camera__container {
  position: relative;
  margin-bottom: 20px;
}

.camera__header {
  background-color: black;
  z-index: 5;
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.change-button path {
  fill: #fff
}

.clear-button path:nth-child(2) {
  fill: #fff
}

.change-button:active, .clear-button:active {
 transform: scale(.9);
}

.camera__main {
  position: relative;
  border: 1px solid #000;
  width: 100%;
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
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.take-button {
  border-radius: 50%;
  width: 50px;
  height: 50px;
  padding: 0px;
}

.btn {
  border: none;
  cursor: pointer;
}

.btn:active {
  transform: scale(0.95);
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
}

.send-button {
  background-color: blue;
  border-radius: 10px;  
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

canvas {
  display:none;
}

.error {
  margin-bottom: 20px;

}

.error__message {
  color: #fff;
  padding: 5px;
  background-color: red;

}

.show-button {
  border: none;
  background-color: green;
  border-radius: 10px;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.hide-button {
  background-color: red;
}

.device{
  margin-bottom: 20px;
}

.device__title {
  padding-bottom: 10px;
}

.device__list {
  display: flex;
  flex-direction: column;
  align-items:flex-start
}

.device__value {
  background-color: green;
  border-radius: 4px;
  padding: 5px;
  margin-bottom: 10px;
}

.device__value_btn {
  cursor: pointer;
}



</style>
