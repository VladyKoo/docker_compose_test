<template>
  <div id="app">
    <input 
      type="text" 
      name="value" 
      :value="input" 
      @keypress.enter="post" 
      @input="input = $event.target.value"
    >
    <div v-for="(v, index) of values" :key="index">{{v.value}}</div>
 
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'App',
  data: () => ({
    values: ['value1'],
    input: '',
    url: 'http://localhost:80/api'
  }),
  async created(){
    this.get()
    
  },
  methods: {
    async get(){
      const values = await axios.get(this.url)     
      if (values) this.values = values.data
    },
    async post(){
      const values = await axios.post(this.url, { value: this.input })     
      if (values && values.data.status) this.values = values.data.data
      this.input = ''
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
