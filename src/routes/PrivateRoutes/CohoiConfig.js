import React from 'react';
import { authRoles } from 'auth';

const CohoiPage = React.lazy(() => import('pages/cohoi'));
export const CohoiConfig = {
    auth    : authRoles.user,
    routes  : [
        { path     : '/sale/co-hoi', element: <CohoiPage /> }
    ]
};
