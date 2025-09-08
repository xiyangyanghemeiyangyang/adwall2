import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Dashboard from '../pages/Dashboard';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';
// import AccountManagement from '../pages/AccountManagement';
// import ContentReview from '../pages/ContentReview';
// import RegionManagement from '../pages/RegionManagement';
// import DataAnalysis from '../pages/DataAnalysis';
// import CommissionSettlement from '../pages/CommissionSettlement';
// import OperationManagement from '../pages/OperationManagement';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'workbench/homepage',
        element: <Dashboard />,
      },
      // {
      //   path: 'account-management',
      //   element: <AccountManagement />,
      // },
      // {
      //   path: 'content-review',
      //   element: <ContentReview />,
      // },
      // {
      //   path: 'region-management',
      //   element: <RegionManagement />,
      // },
      // {
      //   path: 'data-analysis',
      //   element: <DataAnalysis />,
      // },
      // {
      //   path: 'commission-settlement',
      //   element: <CommissionSettlement />,
      // },
      // {
      //   path: 'operation-management',
      //   element: <OperationManagement />,
      // },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router; 