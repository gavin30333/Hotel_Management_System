import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { Spin } from 'antd';

const AuthWrapper: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem('currentUser');
      console.log('[AuthWrapper] 检查认证状态, user:', user ? '存在' : '不存在');
      
      if (user) {
        try {
          const userData = JSON.parse(user);
          console.log('[AuthWrapper] 用户数据:', userData);
          if (userData.token) {
            console.log('[AuthWrapper] Token 存在，认证成功');
            setIsAuth(true);
          } else {
            console.log('[AuthWrapper] Token 不存在，认证失败');
            setIsAuth(false);
          }
        } catch (e) {
          console.error('[AuthWrapper] 解析用户数据失败:', e);
          setIsAuth(false);
        }
      } else {
        console.log('[AuthWrapper] 无用户数据，认证失败');
        setIsAuth(false);
      }
      setLoading(false);
    };

    checkAuth();
  }, [location.pathname]);

  console.log('[AuthWrapper] 渲染状态:', { loading, isAuth, path: location.pathname });

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#f0f2f5'
      }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!isAuth) {
    console.log('[AuthWrapper] 重定向到登录页');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log('[AuthWrapper] 渲染子组件');
  return <Outlet />;
};

export default AuthWrapper;
