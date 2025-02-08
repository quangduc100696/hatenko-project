import React from 'react';

const LeadRoute = [
  {
    path: 'lead.edit',
    Component: React.lazy(() => import('containers/Lead')),
    modalOptions: { title: '', width: 750 }
  }
];

export default LeadRoute;