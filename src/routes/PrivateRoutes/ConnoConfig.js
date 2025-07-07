import React from 'react';
import { authRoles } from 'auth';

const CongnoConfigPage = React.lazy(() => import('pages/congno'));
export const CongnoConfig = {
    auth    : authRoles.user,
    routes  : [
        { path     : '/ke-toan/cong-no', element: <CongnoConfigPage /> }
    ]
};
