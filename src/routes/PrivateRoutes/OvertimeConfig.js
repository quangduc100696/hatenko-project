import React from 'react';
import { authRoles } from 'auth';

const OvertimePage = React.lazy(() => import('pages/overtime'));
export const OvertimeConfig = {
    auth: authRoles.user,
    routes: [
        { path: '/overtime', element: <OvertimePage /> }
    ]
};
