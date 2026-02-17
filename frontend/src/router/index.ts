import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/note/:id',
    name: 'note',
    component: () => import('../views/NoteView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
