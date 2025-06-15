import React from 'react';

const BookingRouter = [
    {
        path: 'booking.car.edit',
        Component: React.lazy(() => import('containers/Booking/BookingCar')),
        modalOptions: { title: '', width: 750 }
    },
    {
        path: 'booking.car.confirm',
        Component: React.lazy(() => import('containers/Booking/BookingConfirm')),
        modalOptions: { title: '', width: 750 }
    },
    {
        path: 'booking.hotel.edit',
        Component: React.lazy(() => import('containers/Booking/BookingHotel')),
        modalOptions: { title: '', width: 750 }
    },
    {
        path: 'booking.hotel.confirm',
        Component: React.lazy(() => import('containers/Booking/BookingConfirm')),
        modalOptions: { title: '', width: 750 }
    },
    {
        path: 'booking.flight.edit',
        Component: React.lazy(() => import('containers/Booking/BookingFlight')),
        modalOptions: { title: '', width: 750 }
    },
    {
        path: 'booking.flight.confirm',
        Component: React.lazy(() => import('containers/Booking/BookingConfirm')),
        modalOptions: { title: '', width: 750 }
    }
];

export default BookingRouter;