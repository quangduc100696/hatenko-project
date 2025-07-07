import React from 'react';
import { authRoles } from 'auth';

const ListInstock = React.lazy(() => import('pages/inStock'));
export const ListInstockConfig = {
    auth    : authRoles.user,
    routes  : [
        { path     : '/warehouse/trong-kho', element: <ListInstock /> }
    ]
};