/* eslint-disable @typescript-eslint/no-explicit-any */
import { BookingModel } from './booking.model';

import AppError from '../../Errors/AppError';
import httpStatus from 'http-status';
import { Types } from 'mongoose';
import { ClassScheduleModel } from '../class/class.model';
import { UserRole } from '../user/user.interface';
import { IBooking } from './booking.inferface';

const createBooking = async (payload: IBooking) => {
  const { trainee, classSchedule, userRole } = payload;

  // 1️⃣ Check role
  if (userRole !== UserRole.TRAINEE) {
    throw new AppError(httpStatus.FORBIDDEN, 'Only trainees can book classes.');
  }

  // 2️⃣ Reduce class capacity atomically
  const classData = await ClassScheduleModel.findOneAndUpdate(
    {
      _id: classSchedule,
      isDeleted: false,
      capacity: { $gt: 0 },
    },
    {
      $inc: { capacity: -1 },
    },
    { new: true },
  );

  if (!classData) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'This class is full or does not exist.',
    );
  }

  // 3️⃣ Check overlapping bookings
  const existingBookings = await BookingModel.find({
    trainee,
    isDeleted: false,
  }).populate('classSchedule');

  const newStart = new Date(classData.date);
  const newEnd = new Date(newStart.getTime() + classData.duration * 60000);

  for (const booking of existingBookings) {
    const bookedClass: any = booking.classSchedule;
    const bookedStart = new Date(bookedClass.date);
    const bookedEnd = new Date(
      bookedStart.getTime() + bookedClass.duration * 60000,
    );

    const isOverlap =
      (newStart >= bookedStart && newStart < bookedEnd) ||
      (bookedStart >= newStart && bookedStart < newEnd);

    if (isOverlap) {
      // rollback capacity increment
      await ClassScheduleModel.findByIdAndUpdate(classSchedule, {
        $inc: { capacity: 1 },
      });

      throw new AppError(
        httpStatus.BAD_REQUEST,
        'You already have a booking at this time slot.',
      );
    }
  }

  // 4️⃣ Create booking
  return await BookingModel.create({
    trainee,
    classSchedule,
  });
};

const getMyBookings = async (traineeId: Types.ObjectId) => {
  return BookingModel.find({ trainee: traineeId, isDeleted: false })
    .populate('classSchedule')
    .sort({ createdAt: -1 });
};

const deleteBooking = async (bookingId: string, traineeId: string) => {
  if (!Types.ObjectId.isValid(bookingId)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid booking ID.');
  }

  // Convert traineeId string to ObjectId
  const traineeObjectId = new Types.ObjectId(traineeId);

  const booking = await BookingModel.findOne({
    _id: bookingId,
    trainee: traineeObjectId,
    isDeleted: false,
  });

  if (!booking) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Booking not found or already cancelled.',
    );
  }

  booking.isDeleted = true;
  await booking.save();

  return { message: 'Booking cancelled successfully.' };
};

const allBooking = async () => {
  const result = await BookingModel.find({ isDeleted: false });
  return result;
};

export const bookingService = {
  createBooking,
  getMyBookings,
  deleteBooking,
  allBooking,
};
