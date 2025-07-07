import React from 'react';
import { authRoles } from 'auth';

const XuatKho = React.lazy(() => import('pages/WareHouse'));
export const WareHouseConfig = {
    auth    : authRoles.user,
    routes  : [
        { path     : '/warehouse/xuat-kho', element: <XuatKho /> }
    ]
};