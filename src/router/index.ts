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
          path: '/category', 
          name: 'category',
          component: () => import('@/views/category/CategoryView.vue'),
          children: [
            {
              path: '',
              name: 'mainCategory',
              component: () => import('@/views/category/components/MainCategoryView.vue'),
            },
            {
              path: '/subCategory/:subCategoryId',
              name: 'subCategory',
              component: () => import('@/views/category/components/SubCategoryView.vue'),
            }
          ]
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
