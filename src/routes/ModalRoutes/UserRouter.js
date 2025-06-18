
import React from 'react';

const UserRouter = [
    {
        path: 'user.edit',
        Component: React.lazy(() => import('containers/User')),
        modalOptions: { title: '', width: 750 }
    },
];

export default UserRouter;