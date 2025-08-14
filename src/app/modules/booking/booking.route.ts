import express from 'express';

import { bookingController } from './booking.controller';
import Auth from '../../middleware/Auth';
import { UserRole } from '../user/user.interface';

const router = express.Router();

router.post(
  '/create-bookings',
  Auth(UserRole.TRAINEE),
  bookingController.createBooking,
);
router.get(
  '/my-bookings',
  Auth(UserRole.TRAINEE),
  bookingController.getMyBookings,
);
router.get('/all-bookings', Auth(UserRole.ADMIN), bookingController.allBooking);
router.delete(
  '/delete-bookings/:id',
  Auth(UserRole.TRAINEE),
  bookingController.deleteBooking,
);

export const bookingRoutes = router;
