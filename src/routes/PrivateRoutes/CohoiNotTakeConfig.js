import React from 'react';
import { authRoles } from 'auth';

const CohoiNotTakePage = React.lazy(() => import('pages/cohoiNotTake'));
export const CohoiNotTakeConfig = {
    auth    : authRoles.admin,
    routes  : [
        { path     : '/customer-service/co-hoi', element: <CohoiNotTakePage /> }
    ]
};