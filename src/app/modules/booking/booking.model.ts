import { Schema, model } from 'mongoose';
import { IBooking } from './booking.inferface';

const bookingSchema = new Schema<IBooking>(
  {
    trainee: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    classSchedule: {
      type: Schema.Types.ObjectId,
      ref: 'ClassSchedule',
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const BookingModel = model<IBooking>('Booking', bookingSchema);
