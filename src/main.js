import Vue from 'vue'
import VueRouter from 'vue-router'

import router from './router'
import { Vue2Dragula } from 'vue2-dragula'
import App from './App'

import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'
import 'dragula/dist/dragula.css'
import './assets/styles.css'

Vue.use(VueMaterial)

Vue.material.theme.register('default', {
  primary: 'cyan',
  accent: 'pink'
})

console.log('VueDragula', Vue2Dragula)
console.log('router', router)

Vue.config.debug = true

Vue.use(Vue2Dragula, {
  logging: {
    directive: true,
    plugin: true,
    service: true,
    dragHandler: true
  }
})

Vue.use(VueRouter)

/* eslint-disable no-new */
new Vue({
  // el: '#app',
  router,
  ...App
}).$mount('#app')

router.push('home')
