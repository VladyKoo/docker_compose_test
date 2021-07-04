import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false
Vue.config.errorHandler = function(err, vm, info) {
  vm.$errors(err, info)
  
  }

new Vue({
  render: function (h) { return h(App) },
}).$mount('#app')
