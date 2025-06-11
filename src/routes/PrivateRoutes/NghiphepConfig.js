import React from 'react';
import { authRoles } from 'auth';

const NghiphepPage = React.lazy(() => import('pages/nghiphep'));
export const NghiphepConfig = {
    auth: authRoles.user,
    routes: [
        { path: '/nghiphep', element: <NghiphepPage /> }
    ]
};
