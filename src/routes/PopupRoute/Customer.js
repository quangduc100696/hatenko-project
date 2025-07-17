import React from 'react';
const Cusomter = [
  {
    path: 'customer.add',
    Component: React.lazy(() => import('containers/Customer/CustomerForm')),
    modalOptions: { title: '', width: 750 }
  }
];

export default Cusomter;