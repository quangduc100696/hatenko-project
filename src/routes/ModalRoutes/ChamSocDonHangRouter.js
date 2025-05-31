import React from 'react';

const ActionChamSocDonHangRouter = [
  {
    path: 'chamsocdonhang.edit',
    Component: React.lazy(() => import('containers/ChamSocDonHang')),
    modalOptions: { title: '', widh: 750 }
  }
];

export default ActionChamSocDonHangRouter;