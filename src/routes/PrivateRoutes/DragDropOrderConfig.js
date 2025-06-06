import React from 'react';
import { authRoles } from 'auth';

const DragDropConfigPage = React.lazy(() => import('pages/dragDropOrder'));
export const DragDropConfig = {
    auth    : authRoles.user,
    routes  : [
        { path     : '/sale/drag-drop-order', element: <DragDropConfigPage /> }
    ]
};
