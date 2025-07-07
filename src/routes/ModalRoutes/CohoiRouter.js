import React from 'react';

const CohoiRouter = [
  {
    path: 'cohoi.edit',
    Component: React.lazy(() => import('containers/Cohoi')),
    modalOptions: { title: '', widh: 750 }
  }
];

export default CohoiRouter;