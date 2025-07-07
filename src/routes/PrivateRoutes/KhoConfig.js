import React from 'react';
import { authRoles } from 'auth';

const ListKho = React.lazy(() => import('pages/kho'));
export const ListKhoConfig = {
    auth    : authRoles.user,
    routes  : [
        { path     : '/warehouse/nhap-kho', element: <ListKho /> }
    ]
};