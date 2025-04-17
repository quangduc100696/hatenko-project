import React from 'react';

const ActionXuatkhoRouter = [
  {
    path: 'actionXuatKho.edit',
    Component: React.lazy(() => import('containers/ActionXuatKho')),
    modalOptions: { title: '', widh: 750 }
  }
];

export default ActionXuatkhoRouter;