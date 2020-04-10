import VueRouter from 'vue-router'
import Vue from 'vue'
import NProgress from 'nprogress';

import Home from '../components/Pages/Home'
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
  
  { path: '/chats/:chatId?', component: ChatsPage, meta: { requiresAuth: true}, props: true },
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