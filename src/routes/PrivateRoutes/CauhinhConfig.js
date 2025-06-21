import React from 'react';
import { authRoles } from 'auth';

const CauhinhAiPage = React.lazy(() => import('pages/configAi'));
export const CauhinhAiConfig = {
    auth    : authRoles.user,
    routes  : [
        { path     : '/cau-hinh-ai', element: <CauhinhAiPage /> }
    ]
};
