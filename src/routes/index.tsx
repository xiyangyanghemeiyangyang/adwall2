import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Dashboard from '../pages/manager/Dashboard';
// import Login from '../pages/Login';
import NotFound from '../pages/NotFound';
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
  // {
  //   path: '/login',
  //   element: <Login />,
  // },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router; 