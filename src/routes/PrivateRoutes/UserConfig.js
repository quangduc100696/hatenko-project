import React from 'react';
import { authRoles } from 'auth';

const UserPage = React.lazy(() => import('pages/user'));
export const UserConfig = {
    auth: authRoles.user,
    routes: [
        { path: '/user', element: <UserPage /> }
    ]
};
