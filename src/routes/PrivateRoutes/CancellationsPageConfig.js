import React from 'react';
import { authRoles } from 'auth';

const CancellationsConfigPage = React.lazy(() => import('pages/listCancellations'));
export const CancellationsConfig = {
    auth    : authRoles.user,
    routes  : [
        { path     : '/sale/cancellations', element: <CancellationsConfigPage /> }
    ]
};
