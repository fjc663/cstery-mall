import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'layout',
      component: () => import('@/views/layout/LayoutView.vue'),
      children: [
        {
          path: '', 
          name: 'home',
          component: () => import('@/views/HomeView.vue')
        },
        {
          path: '/shop', 
          name: 'shop',
          component: () => import('@/views/ShopView.vue')
        },
      ]
    },
    {
      path: '/userInfo', 
      name: 'userInfo',
      component: () => import('@/views/UserInfoView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue')
    },
  ]
})

export default router
