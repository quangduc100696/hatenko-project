
import React from 'react';

const OrderRouter = [
  {
    path: 'userAccount.edit',
    Component: React.lazy(() => import('containers/UserAcount')),
    modalOptions: { title: '', width: 750 }
  }
];

export default OrderRouter;