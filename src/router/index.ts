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
            },
            {
              path: '/productDetail/:productId',
              name: 'productDetail',
              component: () => import('@/views/product/productDetailView.vue')
            },
          ]
        },
        {
          path: '/cart',
          name: 'cart',
          component: () => import('@/views/cart/CartView.vue')
        }
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
  ],
  scrollBehavior(to, from, savedPosition) {
    // 如果保存了之前的位置，则返回该位置（例如：用户点击浏览器返回按钮时）
    if (savedPosition) {
      return savedPosition;
    } else {
      // 否则滚动到页面顶部
      return { top: 0 };
    }
  }
});


export default router
