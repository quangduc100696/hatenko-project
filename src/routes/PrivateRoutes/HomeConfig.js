import React from 'react';
import { authRoles } from 'auth';

const HomePage = React.lazy(() => import('pages/home'));
export const HomeConfig = {
    auth    : authRoles.user,
    routes  : [
        { path     : '/', element: <HomePage /> }
    ]
};
