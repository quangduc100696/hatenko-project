import React from 'react';
import { authRoles } from 'auth';

const SchedulerPage = React.lazy(() => import('pages/scheduler'));
export const SchedulerConfig = {
    auth: authRoles.user,
    routes: [
        { path: '/scheduler', element: <SchedulerPage /> }
    ]
};
