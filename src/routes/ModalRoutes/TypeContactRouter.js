import React from 'react';

const TypeContactRouter = [
  {
    path: 'typeContact.edit',
    Component: React.lazy(() => import('containers/typeContact')),
    modalOptions: { title: '', width: 750 }
  }
];

export default TypeContactRouter;