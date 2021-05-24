import Vue from 'vue'
import Router from 'vue-router'
import store from './store.js'
/** Home(Login) Import */
import Home from './views/Home.vue'
import Users from './views/Users.vue'
import Emapta from './views/Emapta.vue'
import ResetPassword from './views/ResetPassword.vue'
import ForgotPassword from './views/ForgotPassword.vue'

/** Common Imports End Here */
Vue.use(Router)

let router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  linkActiveClass: "active",
  routes: [
    {
      path: '/',
      name: 'home',
      meta: { requiresAuth: false, title: 'Home' },
      component: Home
    },
    {
      path: '/emapta',
      name: 'emapta',
      meta: { requiresAuth: true, title: 'Emapta Test' },
      component: Emapta
    },
    {
      path: '/users',
      name: 'users',
      meta: { requiresAuth: true, title: 'User Management' },
      component: Users
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      meta: { requiresAuth: false, title: 'Forgot Password' },
      component: ForgotPassword
    },
    {
      path: '/reset-password/:token',
      name: 'reset-password',
      meta: { requiresAuth: false, title: 'Reset Password' },
      component: ResetPassword
    },
    {
      path: "/*",
      name: 'pagenotfound',
      meta: { requiresAuth: false, title: 'Page Not Found (404)' },
      component: () => import('./views/PageNotFound.vue')
    }

  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.isLoggedIn) {
      store.dispatch('checkSession').then(() => {
        document.title = process.env.VUE_APP_TITLE + ' - ' + to.meta.title
        next()
      }).catch(() => {
        next('/')
      })
      document.title = process.env.VUE_APP_TITLE + ' - ' + to.meta.title
      next()
      return
    }
    next('/')
  } else {
    document.title = (process.env.VUE_APP_TITLE + ' - ' + to.meta.title)
    next()
  }
})

export default router