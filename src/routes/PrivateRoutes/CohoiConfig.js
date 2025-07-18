import React from 'react';
import { authRoles } from 'auth';

const CohoiPage = React.lazy(() => import('pages/cohoi'));
const BanHangPage = React.lazy(() => import('pages/banhang'));

export const CohoiConfig = {
    auth    : authRoles.user,
    routes  : [
        { path     : '/sale/co-hoi', element: <CohoiPage /> },
        { path     : '/sale/ban-hang', element: <BanHangPage /> },
        { path     : '/sale/ban-hang/:orderId', element: <BanHangPage /> }
    ]
};
