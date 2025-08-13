import { UserModel } from './user.model';
import { Types } from 'mongoose';
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import { IUser } from './user.interface';
import AppError from '../../Errors/AppError';

// CREATE USER
export const createUser = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const existing = await UserModel.findOne({ email, isDeleted: false });
  if (existing)
    throw new AppError(httpStatus.BAD_REQUEST, 'Email already registered');

  const hashedPassword = await bcrypt.hash(password!, 10);

  return UserModel.create({ ...payload, password: hashedPassword });
};

// GET ALL USERS (exclude soft-deleted)
export const getAllUsers = async () => {
  return UserModel.find({ isDeleted: false });
};

// GET USER BY ID
export const getUserById = async (id: string) => {
  if (!Types.ObjectId.isValid(id))
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid user ID');

  const user = await UserModel.findOne({ _id: id, isDeleted: false });
  if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found');

  return user;
};

// UPDATE USER
export const updateUser = async (id: string, payload: Partial<IUser>) => {
  if (!Types.ObjectId.isValid(id))
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid user ID');

  if (payload.password)
    payload.password = await bcrypt.hash(payload.password, 10);

  const user = await UserModel.findOneAndUpdate(
    { _id: id, isDeleted: false },
    payload,
    { new: true },
  );
  if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found');

  return user;
};

// SOFT DELETE USER
export const deleteUser = async (id: string) => {
  if (!Types.ObjectId.isValid(id))
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid user ID');

  const user = await UserModel.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true },
    { new: true },
  );

  if (!user)
    throw new AppError(
      httpStatus.NOT_FOUND,
      'User not found or already deleted',
    );

  return true;
};

// PROFILE MANAGEMENT (get/update current user)
export const getMyProfile = async (userId: string) => {
  return getUserById(userId);
};

export const updateMyProfile = async (
  userId: string,
  payload: Partial<IUser>,
) => {
  return updateUser(userId, payload);
};
