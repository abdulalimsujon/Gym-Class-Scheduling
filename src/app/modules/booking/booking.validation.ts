import { z } from 'zod';
import mongoose from 'mongoose';

export const createBookingZodSchema = z.object({
  trainee: z
    .string({ required_error: 'Trainee ID is required' })
    .refine((id) => mongoose.Types.ObjectId.isValid(id), {
      message: 'Invalid trainee ID format',
    }),

  classSchedule: z
    .string({ required_error: 'Class schedule ID is required' })
    .refine((id) => mongoose.Types.ObjectId.isValid(id), {
      message: 'Invalid class schedule ID format',
    }),
});
