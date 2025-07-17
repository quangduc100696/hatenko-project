import React from 'react';

const CohoiRouter = [
  {
    path: 'cohoi.edit',
    Component: React.lazy(() => import('containers/Order/EditCohoi')),
    modalOptions: { title: '', widh: 750 }
  }
];

export default CohoiRouter;