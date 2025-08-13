import { Types } from 'mongoose';

export interface IClassSchedule {
  date: Date;
  duration: number;
  capacity: number;
  trainer: Types.ObjectId;
  createdAt: Date;
  isDeleted?: boolean;
  updatedAt: Date;
}
