import React from 'react';

const TranferRouter = [
  {
    path: 'tranfer.edit',
    Component: React.lazy(() => import('containers/tranferAi')),
    modalOptions: { title: '', width: 750 }
  }
];

export default TranferRouter;