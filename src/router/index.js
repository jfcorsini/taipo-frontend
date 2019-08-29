import VueRouter from 'vue-router'
import Vue from 'vue'

import Home from '../components/Pages/Home'
import ChatPage from '../components/Pages/ChatPage'
import ChatsPage from '../components/Pages/ChatsPage'
import UsersPage from '../components/Pages/UsersPage'
import UserPage from '../components/Pages/UserPage'
import AuthPage from '../components/Pages/AuthPage'

const routes = [
  { path: '/', component: Home },
  { path: '/auth', component: AuthPage },
  { path: '/users', component: UsersPage, meta: { requiresAuth: true}  },
  { path: '/users/:username', component: UserPage, meta: { requiresAuth: true}  },
  { path: '/chats', component: ChatsPage, meta: { requiresAuth: true}  },
  { path: '/chats/:chatId', component: ChatPage, meta: { requiresAuth: true}  },
]

const router = new VueRouter({
  routes
})

router.beforeResolve((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    let user;
    Vue.prototype.$Amplify.Auth.currentAuthenticatedUser().then(data => {
      if (data && data.signInUserSession) {
        user = data;
      }
      next()
    }).catch((e) => {
      next({
        path: '/auth'
      });
    });
  }
  next()
})

export default router