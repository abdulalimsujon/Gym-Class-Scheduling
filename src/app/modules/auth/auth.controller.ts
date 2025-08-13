import catchAsync from '../../utilities/catchAsync';
import sendResponse from '../../utilities/sendResponse/sendResponse';
import { loginUser, registerUser } from './auth.service';
import { Request, Response } from 'express';
import httpStatus from 'http-status';

// LOGIN
const login = catchAsync(async (req: Request, res: Response) => {
  const result = await loginUser(req.body);

  res.cookie('token', result.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged in successfully',
    data: { accessToken: result.accessToken },
  });
});

// REGISTER
const register = catchAsync(async (req: Request, res: Response) => {
  const result = await registerUser(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'User registered successfully',
    data: result,
  });
});

export const authController = {
  login,
  register,
};
