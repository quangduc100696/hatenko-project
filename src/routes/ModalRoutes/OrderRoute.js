import React from 'react';

const OrderRoute = [
  {
    path: 'order.edit',
    Component: React.lazy(() => import('containers/Order')),
    modalOptions: { title: '', width: 750 }
  }
];

export default OrderRoute;