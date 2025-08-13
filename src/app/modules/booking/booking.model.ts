import { Schema, model, Document, Types } from 'mongoose';

export interface IBooking extends Document {
  trainee: Types.ObjectId;
  classSchedule: Types.ObjectId;
  isDeleted: boolean;
  createdAt: Date;
}

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
