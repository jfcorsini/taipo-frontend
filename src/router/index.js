import VueRouter from 'vue-router'
import Vue from 'vue'

import Home from '../components/Home'
import Chat from '../components/Chat'
import Chats from '../components/Chats'
import Users from '../components/Users'
import User from '../components/User'
import Auth from '../components/Auth'

const routes = [
  { path: '/', component: Home },
  { path: '/auth', component: Auth },
  { path: '/users', component: Users, meta: { requiresAuth: true}  },
  { path: '/users/:username', component: User, meta: { requiresAuth: true}  },
  { path: '/chats', component: Chats, meta: { requiresAuth: true}  },
  { path: '/chats/:chatId', component: Chat, meta: { requiresAuth: true}  },
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