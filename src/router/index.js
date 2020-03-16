import VueRouter from 'vue-router'
import Vue from 'vue'

import Home from '../components/Pages/Home'
import ChatPage from '../components/Pages/ChatPage'
import ChatsPage from '../components/Pages/ChatsPage'
import UsersPage from '../components/Pages/UsersPage'
import UserPage from '../components/Pages/UserPage'
import AuthPage from '../components/Pages/AuthPage'

const routes = [
  { path: '/', component: Home, meta: { requiresAuth: true}},
  { path: '/auth', component: AuthPage },
  { path: '/users', component: UsersPage, meta: { requiresAuth: true}, children: [
    {
      path: '/users/:username',
      component: UserPage,
      props: true,
    },
  ]},
  
  { path: '/chats', component: ChatsPage, meta: { requiresAuth: true}, children: [
    {
      path: '/chats/:chatId',
      component: ChatPage,
      props: true,
    },
  ] },
]

const router = new VueRouter({
  routes
})

router.beforeResolve((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // let user;
    Vue.prototype.$Amplify.Auth.currentAuthenticatedUser().then(data => {
      if (data && data.signInUserSession) {
        // user = data;
      }
      next()
    }).catch(() => {
      next({
        path: '/auth'
      });
    });
  }
  next()
})

export default router