import React from 'react';
import { authRoles } from 'auth';

const CohoiTakePage = React.lazy(() => import('pages/cohoiTake'));
export const CohoiTakeConfig = {
    auth    : authRoles.admin,
    routes  : [
        { path     : '/customer-service/co-hoi-cham-soc', element: <CohoiTakePage /> }
    ]
};