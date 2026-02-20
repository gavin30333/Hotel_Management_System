import { defineConfig } from '@umijs/max';

export default defineConfig({
  routes: [
    {
      path: '/login',
      name: '登录',
      component: './Login',
    },
    {
      path: '/register',
      name: '注册',
      component: './Register',
    },
    {
      path: '/',
      component: '@/layouts/BasicLayout',
      routes: [
        {
          path: '/',
          redirect: '/hotel/list',
        },
        {
          path: '/hotel/list',
          name: '酒店管理',
          component: './Hotel/List',
        },
      ],
    },
  ],
  npmClient: 'npm',
  theme: {
    '@primary-color': '#1890ff',
  },
});
