import React from 'react';

const LeadTakeRouter = [
  {
    path: 'leadTake.edit',
    Component: React.lazy(() => import('containers/LeadTake.js')),
    modalOptions: { title: '', width: 750 }
  }
];

export default LeadTakeRouter;