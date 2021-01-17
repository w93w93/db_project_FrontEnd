import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'
import login from '@/views/login.vue'
import register from '@/views/register'
import imageWall from '@/views/imageWall.vue'
import profile from '@/views/profile.vue'

Vue.use(VueRouter)

const routes = [
  // {
  //   path: '/',
  //   name: 'Home',
  //   component: Home
  // },
  {
    path: '/',
    name: 'login',
    component: login
  },
  {
    path: '/register',
    name: 'register',
    component: register
  },
  {
    path: '/profile',
    name: 'profile',
    component: profile
  },
  {
    path: '/profile/:name/:id',
    name: 'profileById',
    component: profile
  },
  {
    path: '/imageWall',
    name: 'imageWall',
    component: imageWall
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
