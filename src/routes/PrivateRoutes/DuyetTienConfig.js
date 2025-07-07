import React from 'react';
import { authRoles } from 'auth';

const DuyetTienPage = React.lazy(() => import('pages/duyetTien'));
export const DuyetTienConfig = {
    auth    : authRoles.admin,
    routes  : [
        { path     : '/ke-toan/confirm', element: <DuyetTienPage /> }
    ]
};