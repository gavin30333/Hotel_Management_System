import { defineConfig } from '@umijs/max';

export default defineConfig({
  routes: [
    {
      path: '/login',
      component: './Login',
    },
    {
      path: '/register',
      component: './Register',
    },
    {
      path: '/',
      component: '@/layouts/AuthWrapper',
      routes: [
        {
          path: '/',
          component: '@/layouts/BasicLayout',
          routes: [
            {
              path: '/',
              redirect: '/hotel/list',
            },
            {
              path: 'hotel/list',
              component: './Hotel/List',
            },
          ],
        },
      ],
    },
    {
      path: '*',
      redirect: '/login',
    },
  ],
  npmClient: 'npm',
  theme: {
    '@primary-color': '#1890ff',
  },
});
