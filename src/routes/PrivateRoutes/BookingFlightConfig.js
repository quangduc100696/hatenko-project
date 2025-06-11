import React from 'react';
import { authRoles } from 'auth';

const BookingFlightPage = React.lazy(() => import('pages/booking/Flight'));
export const BookingFlightConfig = {
    auth: authRoles.user,
    routes: [
        { path: '/booking/Flight', element: <BookingFlightPage /> }
    ]
};
