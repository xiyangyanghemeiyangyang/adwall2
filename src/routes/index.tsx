import { createBrowserRouter, Navigate } from 'react-router-dom';
import ManagerLayout from '../layouts/manger/MainLayout';
import OperatorLayout from '../layouts/operater/mainlayout';
import Dashboard from '../pages/manager/Dashboard';
import Login from '../pages/Login';
// import NotFound from '../pages/NotFound';
import CustomerManagement from '../pages/manager/CustomerManagement';
import CustomerDetail from '../pages/manager/CustomerDetail';
import DataManagement from '../pages/manager/DataManagement';
import DataDetail from '../pages/manager/DataDetail';
// import AccountManagement from '../pages/AccountManagement';
// import ContentReview from '../pages/ContentReview';
// import RegionManagement from '../pages/RegionManagement';
// import DataAnalysis from '../pages/DataAnalysis';
// import CommissionSettlement from '../pages/CommissionSettlement';
// import OperationManagement from '../pages/OperationManagement';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  // 管理者工作台
  {
    path: '/page/manger',
    element: <ManagerLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'workbench/homepage',
        element: <Dashboard />,
      },
      {
        path: 'customer-management',
        element: <CustomerManagement />,
      },
      {
        path: 'customer-management/:id',
        element: <CustomerDetail />,
      },
      {
        path: 'data-management',
        element: <DataManagement />,
      },
      {
        path: 'data-management/:customerId',
        element: <DataDetail />,
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
  // 运营者工作台（示例可后续填充专属页面）
  {
    path: '/page/operator',
    element: <OperatorLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      }
    ],
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);

export default router; 