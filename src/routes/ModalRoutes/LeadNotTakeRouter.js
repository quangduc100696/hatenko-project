import React from 'react';

const LeadNotTakeRouter = [
  {
    path: 'leadNotTake.edit',
    Component: React.lazy(() => import('containers/LeadNotTake')),
    modalOptions: { title: '', width: 750 }
  }
];

export default LeadNotTakeRouter;