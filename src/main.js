import Vue from 'vue'
import App from './App'

import VueDragula from 'vue-dragula'

Vue.config.debug = true

Vue.use(VueDragula)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
