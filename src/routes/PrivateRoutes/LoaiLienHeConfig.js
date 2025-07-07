import React from 'react';
import { authRoles } from 'auth';

const LoaiLienHePage = React.lazy(() => import('pages/LoaiLienHe'));
export const LoaiLienHeConfig = {
    auth    : authRoles.user,
    routes  : [
        { path     : '/loai-lien-he', element: <LoaiLienHePage /> }
    ]
};