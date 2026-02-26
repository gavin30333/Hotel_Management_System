import { defineConfig } from '@umijs/max';

export default defineConfig({
  define: {
    'process.env.API_BASE_URL': process.env.API_BASE_URL || 'http://localhost:3001/api',
  },
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
            {
              path: 'admin/management',
              component: './Admin/Management',
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
