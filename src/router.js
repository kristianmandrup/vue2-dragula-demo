import VueRouter from 'vue-router'
import routes from './routes'

// configure router
const router = new VueRouter({
  mode: 'history',
  routes // short for routes: routes
})

router.beforeEach((to, from, next) => {
  console.log('routing -> ', to, from)
  next()
})

export default router
