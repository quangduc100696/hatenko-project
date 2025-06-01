import React from 'react';
import { authRoles } from 'auth';

const OrderTakeConfigPage = React.lazy(() => import('pages/listCancellations'));
export const OrderTakeConfig = {
    auth    : authRoles.user,
    routes  : [
        { path     : '/sale/cancellations', element: <OrderTakeConfigPage /> }
    ]
};
