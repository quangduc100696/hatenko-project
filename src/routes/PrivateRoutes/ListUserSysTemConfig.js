import React from 'react';
import { authRoles } from 'auth';

const ListUserSystemPage = React.lazy(() => import('pages/userSystem'));
export const ListUserSystemConfig = {
    auth    : authRoles.user,
    routes  : [
        { path     : '/user/list-system', element: <ListUserSystemPage /> }
    ]
};