import { Schema, model } from 'mongoose';
import { IUser, UserRole } from './user.interface';

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: Object.values(UserRole), required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const UserModel = model<IUser>('User', userSchema);
