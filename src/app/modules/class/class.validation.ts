import { z } from 'zod';
import mongoose from 'mongoose';

export const createClassScheduleZodSchema = z.object({
  date: z
    .string({ required_error: 'Date is required' })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid date format',
    }),
  duration: z
    .number({ invalid_type_error: 'Duration must be a number' })
    .min(1, 'Duration must be greater than 0')
    .default(120),
  capacity: z
    .number({ invalid_type_error: 'Capacity must be a number' })
    .min(1, 'Capacity must be at least 1')
    .default(10),
  trainer: z
    .string({ required_error: 'Trainer ID is required' })
    .refine((id) => mongoose.Types.ObjectId.isValid(id), {
      message: 'Invalid trainer ID format',
    }),
});
