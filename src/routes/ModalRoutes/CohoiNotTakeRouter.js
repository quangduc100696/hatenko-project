import React from 'react';

const CohoiNotTakeRouter = [
  {
    path: 'cohoiNotTake.edit',
    Component: React.lazy(() => import('containers/CohoiNotTake')),
    modalOptions: { title: '', width: 750 }
  }
];

export default CohoiNotTakeRouter;