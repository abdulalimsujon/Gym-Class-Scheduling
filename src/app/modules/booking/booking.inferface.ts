import { Types } from 'mongoose';

export interface IBooking extends Document {
  trainee: Types.ObjectId;
  classSchedule: Types.ObjectId;
  isDeleted: boolean;
  createdAt: Date;
}
