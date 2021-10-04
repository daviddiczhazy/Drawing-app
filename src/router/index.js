import { createRouter, createWebHistory } from 'vue-router'
import FrontView from '../views/FrontView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: FrontView,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
