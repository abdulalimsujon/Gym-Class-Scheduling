import express from 'express';

import { bookingController } from './booking.controller';
import Auth from '../../middleware/Auth';
import { UserRole } from '../user/user.interface';


const router = express.Router();

router.post(
  '/bookings',
  Auth(UserRole.TRAINEE),
  bookingController.createBooking,
);
router.get(
  '/bookings',
  Auth(UserRole.TRAINEE),
  bookingController.getMyBookings,
);
router.delete(
  '/bookings/:id',
  Auth(UserRole.TRAINEE),
  bookingController.deleteBooking,
);

export const bookingRoutes = router;
