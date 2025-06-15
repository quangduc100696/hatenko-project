import React from 'react';

const OvertimeRouter = [
    {
        path: 'overtime.edit',
        Component: React.lazy(() => import('containers/Overtime')),
        modalOptions: { title: '', width: 750 }
    },
    {
        path: 'overtime.confirm',
        Component: React.lazy(() => import('containers/Overtime/OVConfirm')),
        modalOptions: { title: '', width: 750 }
    },
];

export default OvertimeRouter;