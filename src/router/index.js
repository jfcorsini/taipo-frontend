import VueRouter from 'vue-router'
import Vue from 'vue'
import NProgress from 'nprogress';

import Home from '../components/Pages/Home'
import ChatsPage from '../components/Pages/ChatsPage'
import UsersPage from '../components/Pages/UsersPage'
import AuthPage from '../components/Pages/AuthPage'

const routes = [
  { path: '/auth', name: 'auth', component: AuthPage },
  { path: '/', component: Home, name: 'home', meta: { requiresAuth: true}},
  { path: '/users/:username?', component: UsersPage, name:'users', meta: { requiresAuth: true}, props: true },
  { path: '/chats/:chatId?', component: ChatsPage, name:'chats', meta: { requiresAuth: true}, props: true },
  { path: '/notifications', component: Home, name: 'notifications', meta: { requiresAuth: true}},
]

const router = new VueRouter({
  routes
})

router.beforeResolve((to, from, next) => {
  NProgress.start();
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
});

router.afterEach(() => {
  NProgress.done();
});

export default router