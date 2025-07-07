import React from 'react';
import { authRoles } from 'auth';

const NewFeedPage = React.lazy(() => import('pages/newFeed'));
export const NewfeedConfig = {
    auth    : authRoles.admin,
    routes  : [
        { path     : '/sale/report-common', element: <NewFeedPage /> }
    ]
};
