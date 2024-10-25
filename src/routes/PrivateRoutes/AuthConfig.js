import React, { lazy } from 'react';
import { authRoles } from 'auth';

const Login = lazy(() => import('pages/authen/Login'));
const NotFound = lazy(() => import('pages/authen/NotFound'));

export const LoginConfig = {
    auth    : authRoles.onlyGuest,
    routes  : [ 
        { path     : '/login', element: <Login /> },
        { path     : '/permission-deny', element: <NotFound /> }
    ]
};
