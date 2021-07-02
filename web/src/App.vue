<template>
  <div class="container">
    <Camera/>
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
</style>
