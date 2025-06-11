import React from 'react';
import { authRoles } from 'auth';

const BookingHotelPage = React.lazy(() => import('pages/booking/Hotel'));
export const BookingHotelConfig = {
    auth: authRoles.user,
    routes: [
        { path: '/booking/Hotel', element: <BookingHotelPage /> }
    ]
};
