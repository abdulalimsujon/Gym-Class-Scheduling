import { Types } from 'mongoose';

export interface IBooking {
  trainee: Types.ObjectId;
  classSchedule: Types.ObjectId;
  isDeleted: boolean;
  createdAt: Date;
  userRole?: string;
}
