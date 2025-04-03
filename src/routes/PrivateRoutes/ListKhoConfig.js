import React from 'react';
import { authRoles } from 'auth';

const ListWareHouse = React.lazy(() => import('pages/listKho'));
export const ListWareHouseConfig = {
    auth    : authRoles.user,
    routes  : [
        { path     : '/warehouse/danh-sach-kho', element: <ListWareHouse /> }
    ]
};