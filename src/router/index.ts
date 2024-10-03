import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'layout',
      component: () => import('@/views/userViews/layout/LayoutView.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/userViews/HomeView.vue')
        },
        {
          path: '/category',
          name: 'category',
          component: () => import('@/views/userViews/category/CategoryView.vue'),
          children: [
            {
              path: '',
              name: 'mainCategory',
              component: () => import('@/views/userViews/category/components/MainCategoryView.vue'),
            },
            {
              path: '/subCategory/:categoryId',
              name: 'subCategory',
              component: () => import('@/views/userViews/category/components/SubCategoryView.vue'),
            },
            {
              path: '/productDetail/:productId',
              name: 'productDetail',
              component: () => import('@/views/userViews/product/productDetailView.vue')
            },
          ]
        },
        {
          path: '/search',
          name: 'search',
          component: () => import('@/views/userViews/layout/components/searchView.vue')
        },
        {
          path: '/cart',
          name: 'cart',
          component: () => import('@/views/userViews/product/CartView.vue')
        },
        {
          path: '/order',
          name: 'order',
          component: () => import('@/views/userViews/product/OrderView.vue')
        },
        {
          path: '/pay/:orderId',
          name: 'pay',
          component: () => import('@/views/userViews/product/PayView.vue')
        },
        {
          path: '/personalCenter',
          name: 'personalCenter',
          component: () => import('@/views/userViews/user/PersonalCenter.vue'),
          children: [
            {
              path: '/userInfo',
              name: 'userInfo',
              component: () => import('@/views/userViews/user/components/UserInfoView.vue')
            },
            {
              path: '/addressManager',
              name: 'addressManager',
              component: () => import('@/views/userViews/user/components/AddressManager.vue')
            },
            {
              path: '/orderManager',
              name: 'orderManager',
              component: () => import('@/views/userViews/order/OrderManager.vue'),
              children: [
                {
                  path: '',
                  name: 'orderHistory',
                  component: () => import('@/views/userViews/order/components/OrderHistoryView.vue')
                },
                {
                  path: '/orderDetail/:orderId',
                  name: 'orderDetail',
                  component: () => import('@/views/userViews/order/components/OrderDetail.vue')
                }
              ]
            },
            {
              path: '/favorites',
              name: 'favorites',
              component: () => import('@/views/userViews/user/components/FavoritesView.vue')
            },
            {
              path: '/editPassword',
              name: 'editPassword',
              component: () => import('@/views/userViews/user/components/EditPassword.vue')
            },
          ]
        },
        {
          path: '/price',
          name: 'price',
          component: () => import('@/views/userViews/TODO/priceView.vue')
        },
        {
          path: '/newItem',
          name: 'newItem',
          component: () => import('@/views/userViews/TODO/newItemView.vue')
        },
        {
          path: '/about',
          name: 'about',
          component: () => import('@/views/userViews/TODO/aboutView.vue')
        },

      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/userViews/LoginView.vue')
    },
    {
      path: '/admin/',
      name: 'admin',
      component: () => import('@/views/adminViews/layout/LayoutView.vue'),
      children: [
        {
          path: '',
          name: 'overview',
          component: () => import('@/views/adminViews/layout/components/OverView.vue')
        }, {
          path: 'adminCategory',
          name: 'adminCategory',
          component: () => import('@/views/adminViews/category/CategoryView.vue')
        },
        {
          path: 'adminSpecification',
          name: 'adminSpecification',
          component: () => import('@/views/adminViews/product/SpecificationView.vue')
        }, {
          path: 'adminProduct',
          name: 'adminProduct',
          component: () => import('@/views/adminViews/product/ProductView.vue')
        }, {
          path: 'adminOrder',
          name: 'adminOrder',
          component: () => import('@/views/adminViews/order/OrderView.vue')
        },
        {
          path: 'adminInfo',
          name: 'adminInfo',
          component: () => import('@/views/adminViews/adminInfo/InfoView.vue')
        },
        {
          path: 'adminEditPassword',
          name: 'adminEditPassword',
          component: () => import('@/views/adminViews/adminInfo/EditAdminPassword.vue')
        },
      ]
    },
    {
      path: '/adminLogin',
      name: 'adminLogin',
      component: () => import('@/views/adminViews/AdminLogin.vue')
    },
    {
      path: '/:pathMatch(.*)*', // 匹配所有路径
      name: 'NotFound',
      component: () => import('@/views/NotFound.vue')
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

// // 全局路由守卫,控制支付界面的跳转
// router.beforeEach((to, from, next) => {
//   if (to.path === '/pay') {
//     // 检查是否是从 /order 页面跳转过来的
//     if (from.path === '/order') {
//       next(); // 允许跳转
//     } else {
//       next('/'); // 阻止跳转,直接返回首页
//     }
//   } else {
//     next(); // 对其他页面不做限制
//   }
// });


export default router
