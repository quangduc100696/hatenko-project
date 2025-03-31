import React from 'react';
import { authRoles } from 'auth';

const ListKho = React.lazy(() => import('pages/kho'));
export const ListKhoConfig = {
    auth    : authRoles.user,
    routes  : [
        { path     : '/warehouse/danh-sach-kho', element: <ListKho /> }
    ]
};