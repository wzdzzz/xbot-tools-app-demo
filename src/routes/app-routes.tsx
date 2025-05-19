// src/routes/appRoutes.tsx
import React from 'react';
import { Navigate, RouteObject, useRoutes } from 'react-router-dom';
import ProtectedRoute from '@/components/protected-route.tsx';
import PublicRoute from '@/components/public-route.tsx';
import LoginPage from '@/pages/login';
import Dashboard from '@/pages/dashboard';
import RegisterPage from "@/pages/register";
import Home from "@/pages/home";
import Play from "@/pages/play";
import Setting from '@/pages/setting';

const routesConfig = [
  {
    element: <PublicRoute />,   // 所有子路由均为公有
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,  // 所有子路由均需登录
    children: [
      { path: '/', element: <Dashboard /> },
      // { path: '/', element: <Home /> },
      { path: '/play', element: <Play /> },
      { path: '/setting', element: <Setting /> },
      // … 其他私有路由
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
] as RouteObject[];

export const AppRoutes: React.FC = () => {
  // useRoutes 会自动递归处理 element 属性中的嵌套 Outlet
  return useRoutes(routesConfig);
};
