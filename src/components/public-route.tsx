// src/components/PublicRoute.tsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';

const PublicRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (isAuthenticated) {
    // 登录后访问登录页，可跳回首页或来源页面
    const from = (location.state as any)?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }
  return <Outlet />;
};

export default PublicRoute;



