import React from 'react';
import { authRoles } from 'auth';

const ListCustomerRetail = React.lazy(() => import('pages/customerRetail'));
export const ListCustomerRetailConfig = {
    auth    : authRoles.user,
    routes  : [
        { path     : '/sale/m-customer', element: <ListCustomerRetail /> }
    ]
};