import React from 'react';
import { authRoles } from 'auth';

const ListAcountPage = React.lazy(() => import('pages/ListAccount'));
export const ListAcountConfig = {
    auth    : authRoles.user,
    routes  : [
        { path     : '/user/list', element: <ListAcountPage /> }
    ]
};