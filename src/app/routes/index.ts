import express from 'express';

import { authRoutes } from '../modules/auth/auth.route';
import { userRoute } from '../modules/user/user.route';

import { bookingRoutes } from '../modules/booking/booking.route';
import { classRoutes } from '../modules/class/class.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/user',
    route: userRoute,
  },
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/classes',
    route: classRoutes,
  },
  {
    path: '/bookings',
    route: bookingRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
