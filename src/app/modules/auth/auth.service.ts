import { TLoginUser, TRegisterUser } from './auth.interface';

import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import { createToken } from '../../utilities/createToken';

import AppError from '../../Errors/AppError';
import { UserModel } from '../user/user.model';

// LOGIN SERVICE
export const loginUser = async (payload: TLoginUser) => {
  const { email, password } = payload;

  const user = await UserModel.findOne({ email }).select('+password');

  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User not found');
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
  }

  // Include role in token
  const token = createToken({
    email: user.email,
    id: user._id,
    role: user.role,
  });

  return { accessToken: token };
};

// REGISTER SERVICE
export const registerUser = async (payload: TRegisterUser) => {
  const { name, email, password, role } = payload;

  // Check if email exists
  const existing = await UserModel.findOne({ email });
  if (existing) {
    throw new AppError(httpStatus.CONFLICT, 'Duplicate Error');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await UserModel.create({
    name,
    email,
    password: hashedPassword,
    role: role || 'TRAINEE', // default to trainee
  });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};
