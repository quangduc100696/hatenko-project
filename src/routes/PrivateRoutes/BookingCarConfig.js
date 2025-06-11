import React from 'react';
import { authRoles } from 'auth';

const BookingCarPage = React.lazy(() => import('pages/booking/Car'));
export const BookingCarConfig = {
    auth: authRoles.user,
    routes: [
        { path: '/booking/Car', element: <BookingCarPage /> }
    ]
};
