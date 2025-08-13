import { Schema, model } from 'mongoose';
import { IClassSchedule } from './class.interface';

const classScheduleSchema = new Schema<IClassSchedule>(
  {
    date: { type: Date, required: true },
    duration: { type: Number, default: 120 },
    capacity: { type: Number, default: 10 },
    trainer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isDeleted: { type: Boolean, default: false }, // Soft delete flag
  },
  { timestamps: true },
);

export const ClassScheduleModel = model<IClassSchedule>(
  'ClassSchedule',
  classScheduleSchema,
);
