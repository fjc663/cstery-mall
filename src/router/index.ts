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
              path: '/subCategory/:categoryId',
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
          component: () => import('@/views/product/CartView.vue')
        },
        {
          path: '/order',
          name: 'order',
          component: () => import('@/views/product/OrderView.vue')
        },
        {
          path: '/pay',
          name: 'pay',
          component: () => import('@/views/product/PayView.vue')
        },
        {
          path: '/personalCenter',
          name: 'personalCenter',
          component: () => import('@/views/user/PersonalCenter.vue'),
          children: [
            {
              path: '/userInfo',
              name: 'userInfo',
              component: () => import('@/views/user/components/UserInfoView.vue')
            },
            {
              path: '/addressManager',
              name: 'addressManager',
              component: () => import('@/views/user/components/AddressManager.vue')
            },
            {
              path: '/orderManager',
              name: 'orderManager',
              component: () => import('@/views/order/OrderManager.vue'),
              children: [
                {
                  path: '',
                  name: 'orderHistory',
                  component: () => import('@/views/order/components/OrderHistoryView.vue')
                },
                {
                  path: '/orderDetail/:orderId',
                  name: 'orderDetail',
                  component: () => import('@/views/order/components/OrderDetail.vue')
                }
              ]
            },
            {
              path: '/editPassword',
              name: 'editPassword',
              component: () => import('@/views/user/components/EditPassword.vue')
            },
          ]
        }

      ]
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

// 全局路由守卫,控制支付界面的跳转
router.beforeEach((to, from, next) => {
  if (to.path === '/pay') {
    // 检查是否是从 /order 页面跳转过来的
    if (from.path === '/order') {
      next(); // 允许跳转
    } else {
      next('/'); // 阻止跳转,直接返回首页
    }
  } else {
    next(); // 对其他页面不做限制
  }
});


export default router
