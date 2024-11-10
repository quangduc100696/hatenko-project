import React from 'react';

const productRoute = [
  {
    path: 'product.edit',
    Component: React.lazy(() => import('containers/product')),
    modalOptions: { title: '', width: 750 }
  }
];

export default productRoute;