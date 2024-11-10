import React from 'react';
import { authRoles } from 'auth';

const ProductPage = React.lazy(() => import('pages/product'));
export const ProductConfig = {
    auth    : authRoles.admin,
    routes  : [
        { path     : '/product', element: <ProductPage /> }
    ]
};
