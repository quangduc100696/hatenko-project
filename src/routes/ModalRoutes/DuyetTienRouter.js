import React from 'react';

const DuyetTienRouter = [
  {
    path: 'duyetTien.edit',
    Component: React.lazy(() => import('containers/DuyetTien')),
    modalOptions: { title: '', width: 750 }
  }
];

export default DuyetTienRouter;