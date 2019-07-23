import VueRouter from 'vue-router'

import Home from '../components/Home'
import Chat from '../components/Chat'
import Chats from '../components/Chats'

const routes = [
  { path: '/', component: Home },
  { path: '/chats', component: Chats },
  { path: '/chats/:chatId', component: Chat },
]

const router = new VueRouter({
  routes
})

export default router