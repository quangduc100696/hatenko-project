import React from 'react';
import { authRoles } from 'auth';

const LeadNotTakePage = React.lazy(() => import('pages/leadNotTake'));
export const LeadNotTakeConfig = {
    auth    : authRoles.admin,
    routes  : [
        { path     : '/customer-service/lead', element: <LeadNotTakePage /> }
    ]
};