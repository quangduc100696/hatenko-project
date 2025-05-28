import React from 'react';

const ProductRoute = [
  {
    path: 'product.edit',
    Component: React.lazy(() => import('containers/Product')),
    modalOptions: { title: '', width: 750 }
  }
];

export default ProductRoute;