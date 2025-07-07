import React from 'react';
import { authRoles } from 'auth';

const ListAcountGroupPage = React.lazy(() => import('pages/ListGroup'));
export const ListAcountGroupConfig = {
    auth    : authRoles.user,
    routes  : [
        { path     : '/user/group', element: <ListAcountGroupPage /> }
    ]
};