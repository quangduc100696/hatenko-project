import React from 'react';

const OrderRoute = [
  {
    path: 'order.payment',
    Component: React.lazy(() => import('containers/Order/OrderPayment')),
    modalOptions: { title: '', width: 750 }
  },
  {
    path: 'order.invoice',
    Component: React.lazy(() => import('containers/Order/Invoice')),
    modalOptions: { title: '', width: 750 }
  }
];

export default OrderRoute;