import catchAsync from '../../utilities/catchAsync';
import sendResponse from '../../utilities/sendResponse/sendResponse';
import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { classService } from './class.service';
import { IClassSchedule } from './class.interface';

const createClass = catchAsync(async (req: Request, res: Response) => {
  const result = await classService.createClass(req.body);
  sendResponse<IClassSchedule>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Class schedule created successfully',
    data: result,
  });
});

const getAllClasses = catchAsync(async (req: Request, res: Response) => {
  const result = await classService.getAllClasses();
  sendResponse<IClassSchedule[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Classes retrieved successfully',
    data: result,
  });
});

const getSingleClass = catchAsync(async (req: Request, res: Response) => {
  const result = await classService.getSingleClass(req.params.id);
  sendResponse<IClassSchedule>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Class retrieved successfully',
    data: result,
  });
});

const updateClass = catchAsync(async (req: Request, res: Response) => {
  const result = await classService.updateClass(req.params.id, req.body);
  sendResponse<IClassSchedule>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Class updated successfully',
    data: result,
  });
});

const deleteClass = catchAsync(async (req: Request, res: Response) => {
  await classService.deleteClass(req.params.id);
  sendResponse<null>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Class deleted successfully',
    data: null,
  });
});

export const classController = {
  createClass,
  getAllClasses,
  getSingleClass,
  updateClass,
  deleteClass,
};
