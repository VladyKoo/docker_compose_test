<template>
  <div class="container">
    <!-- <div class="btn-container">
      <button class="show-button" :class="{'hide-button': showCamera}" @click="showCamera = !showCamera">{{ showCamera ? 'Close camera' : 'Open camera' }}</button>
    </div> -->
    <Camera v-if="showCamera"/>
  </div>
</template>

<script>
import axios from 'axios'
import Camera from './components/Camera.vue'

export default {
  components: { Camera },
  name: 'App',
  data: () => ({
    url: 'http://localhost:80/api',    
    showCamera: true
  }),

  methods: {
    async get(){
      const values = await axios.get(this.url) 
    },
    async post(){
      const values = await axios.post(this.url, { value: this.input })     
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
  max-width: 800px;
  min-width: 290px;
  margin: 0 auto;
  padding: 30px 10px 50px 10px;
}

.btn-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.show-button {
  border: none;
  background-color: green;
  border-radius: 10px;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.show-button:active {
  transform: scale(0.95);
}
.hide-button {
  background-color: red;
}
</style>
