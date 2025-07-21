import React from 'react';
const NhapKho = [
  {
    path: 'stock.add',
    Component: React.lazy(() => import('containers/WareHouse/ModalNhapKho')),
    modalOptions: { title: '', width: 750 }
  }
];

export default NhapKho;