import { Request, Response } from 'express';

import httpStatus from 'http-status';
import { bookingService } from './booking.service';
import catchAsync from '../../utilities/catchAsync';
import sendResponse from '../../utilities/sendResponse/sendResponse';

const createBooking = catchAsync(async (req: Request, res: Response) => {
  const { classScheduleId } = req.body;
  const traineeId = req.user._id;

  const result = await bookingService.createBooking(traineeId, classScheduleId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Booking created successfully',
    data: result,
  });
});

const getMyBookings = catchAsync(async (req: Request, res: Response) => {
  const traineeId = req.user._id;
  const result = await bookingService.getMyBookings(traineeId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Bookings retrieved successfully',
    data: result,
  });
});

const deleteBooking = catchAsync(async (req: Request, res: Response) => {
  const traineeId = req.user._id;
  const { id } = req.params;

  const result = await bookingService.deleteBooking(id, traineeId);

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
};
