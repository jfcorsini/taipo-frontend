import VueRouter from 'vue-router'

import Home from '../components/Home'
import Chat from '../components/Chat'

const routes = [
  { path: '/', component: Home },
  { path: '/chat', component: Chat },
]

const router = new VueRouter({
  routes
})

export default router