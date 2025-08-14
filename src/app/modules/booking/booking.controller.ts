import { Request, Response } from 'express';

import httpStatus from 'http-status';
import { bookingService } from './booking.service';
import catchAsync from '../../utilities/catchAsync';
import sendResponse from '../../utilities/sendResponse/sendResponse';

const createBooking = catchAsync(async (req: Request, res: Response) => {
  const reqBody = req.body;
  const userRole = req.user.role;
  const trainee = req.user.id;

  const result = await bookingService.createBooking({
    ...reqBody,
    trainee,
    userRole,
  });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Booking created successfully',
    data: result,
  });
});

const getMyBookings = catchAsync(async (req: Request, res: Response) => {
  const traineeId = req.user.id;
  const result = await bookingService.getMyBookings(traineeId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Bookings retrieved successfully',
    data: result,
  });
});

const deleteBooking = catchAsync(async (req: Request, res: Response) => {
  const traineeId = req.user.id;
  const { id } = req.params;
  console.log(traineeId, id);
  const result = await bookingService.deleteBooking(id, traineeId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Booking cancelled successfully',
    data: result,
  });
});

const allBooking = catchAsync(async (req: Request, res: Response) => {
  const result = await bookingService.allBooking();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Booking cancelled successfully',
    data: result,
  });
});

export const bookingController = {
  createBooking,
  getMyBookings,
  deleteBooking,
  allBooking,
};
