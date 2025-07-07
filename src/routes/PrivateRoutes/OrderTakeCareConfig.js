import React from 'react';
import { authRoles } from 'auth';

const OrderTakeConfigPage = React.lazy(() => import('pages/orderTakeCare'));
export const OrderTakeConfig = {
    auth    : authRoles.user,
    routes  : [
        { path     : '/customer-service/order', element: <OrderTakeConfigPage /> }
    ]
};