import React from 'react';

const WareHoseActionRouter = [
  {
    path: 'warehouseAction.edit',
    Component: React.lazy(() => import('containers/WareHouseAction')),
    modalOptions: { title: '', width: 750 }
  }
];

export default WareHoseActionRouter;