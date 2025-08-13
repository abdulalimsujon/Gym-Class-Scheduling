/* eslint-disable @typescript-eslint/no-explicit-any */
import { BookingModel } from './booking.model';

import AppError from '../../Errors/AppError';
import httpStatus from 'http-status';
import { Types } from 'mongoose';
import { ClassScheduleModel } from '../class/class.model';

const createBooking = async (
  traineeId: Types.ObjectId,
  classScheduleId: string,
) => {
  const classData = await ClassScheduleModel.findById(classScheduleId);
  if (!classData)
    throw new AppError(httpStatus.NOT_FOUND, 'Class schedule not found.');

  const currentBookings = await BookingModel.countDocuments({
    classSchedule: classScheduleId,
    isDeleted: false,
  });

  const capacity = classData.capacity || 10;
  if (currentBookings >= capacity) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `This class schedule is full. Maximum ${capacity} trainees allowed per schedule.`,
    );
  }

  const existingBookings = await BookingModel.find({
    trainee: traineeId,
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
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'You already have a booking at this time slot.',
      );
    }
  }

  return BookingModel.create({
    trainee: traineeId,
    classSchedule: classScheduleId,
  });
};

const getMyBookings = async (traineeId: Types.ObjectId) => {
  return BookingModel.find({ trainee: traineeId, isDeleted: false })
    .populate('classSchedule')
    .sort({ createdAt: -1 });
};

const deleteBooking = async (bookingId: string, traineeId: Types.ObjectId) => {
  const booking = await BookingModel.findOne({
    _id: bookingId,
    trainee: traineeId,
    isDeleted: false,
  });

  if (!booking)
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Booking not found or already cancelled.',
    );

  booking.isDeleted = true;
  await booking.save();

  return { message: 'Booking cancelled successfully.' };
};

export const bookingService = {
  createBooking,
  getMyBookings,
  deleteBooking,
};
