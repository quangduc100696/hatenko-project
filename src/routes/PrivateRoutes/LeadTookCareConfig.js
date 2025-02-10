import React from 'react';
import { authRoles } from 'auth';

const LeadTookCarePage = React.lazy(() => import('pages/leadTookCare'));
export const LeadTookCareConfig = {
    auth    : authRoles.user,
    routes  : [
        { path     : '/customer-lead/lead', element: <LeadTookCarePage /> }
    ]
};