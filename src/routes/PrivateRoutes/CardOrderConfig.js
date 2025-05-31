import React from 'react';
import { authRoles } from 'auth';

const CardOrderPage = React.lazy(() => import('pages/careOrders'));
export const CardOrderConfig = {
    auth    : authRoles.user,
    routes  : [
        { path     : '/customer-service/hoan-thanh', element: <CardOrderPage /> }
    ]
};
