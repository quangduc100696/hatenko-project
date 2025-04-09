import React from 'react';

const CutomerRetailRouter = [
  {
    path: 'cutomerRetail.edit',
    Component: React.lazy(() => import('containers/CustomerRetail')),
    modalOptions: { title: '', widh: 750 }
  }
];

export default CutomerRetailRouter;