import { createRouter, createWebHistory } from 'vue-router'
import FrontView from '../views/FrontView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: FrontView,
  },
  {
    path: '/profile',
    name: 'Profile',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/ProfileView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router