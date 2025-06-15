import React from 'react';

const NghiPhepRouter = [
    {
        path: 'nghiphep.edit',
        Component: React.lazy(() => import('containers/NghiPhep')),
        modalOptions: { title: '', width: 750 }
    },
    {
        path: 'nghiphep.confirm',
        Component: React.lazy(() => import('containers/NghiPhep/NPConfirm')),
        modalOptions: { title: '', width: 750 }
    },
];

export default NghiPhepRouter;