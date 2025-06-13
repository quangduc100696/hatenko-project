import React from 'react';

const productRoute = [
  {
    path: 'product.edit',
    Component: React.lazy(() => import('containers/Product')),
    modalOptions: { title: '', width: 750 }
  }
];

export default productRoute;