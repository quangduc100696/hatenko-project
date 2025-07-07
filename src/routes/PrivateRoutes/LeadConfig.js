import React from 'react';
import { authRoles } from 'auth';

const LeadPage = React.lazy(() => import('pages/lead'));
export const LeadConfig = {
    auth    : authRoles.user,
    routes  : [
        { path     : '/lead', element: <LeadPage /> }
    ]
};