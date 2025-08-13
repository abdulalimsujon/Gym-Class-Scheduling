import catchAsync from '../../utilities/catchAsync';
import sendResponse from '../../utilities/sendResponse/sendResponse';
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getMyProfile,
  updateMyProfile,
} from './user.service';
import { Request, Response } from 'express';
import httpStatus from 'http-status';

// CRUD
const create = catchAsync(async (req: Request, res: Response) => {
  const result = await createUser(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'User created',
    data: result,
  });
});

const getAll = catchAsync(async (req: Request, res: Response) => {
  const result = await getAllUsers();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users fetched',
    data: result,
  });
});

const getById = catchAsync(async (req: Request, res: Response) => {
  const result = await getUserById(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User fetched',
    data: result,
  });
});

const update = catchAsync(async (req: Request, res: Response) => {
  const result = await updateUser(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User updated',
    data: result,
  });
});

const remove = catchAsync(async (req: Request, res: Response) => {
  const result = await deleteUser(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User deleted',
    data: result,
  });
});

// PROFILE
const getProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await getMyProfile(req.user._id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Profile fetched',
    data: result,
  });
});

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await updateMyProfile(req.user._id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Profile updated',
    data: result,
  });
});

export const userController = {
  create,
  getAll,
  getById,
  update,
  remove,
  getProfile,
  updateProfile,
};
