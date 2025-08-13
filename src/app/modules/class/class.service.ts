import { ClassScheduleModel } from './class.model';
import { Types } from 'mongoose';
import httpStatus from 'http-status';
import AppError from '../../Errors/AppError';
import { IClassSchedule } from './class.interface';

const createClass = async (payload: {
  date: Date;
  trainer: Types.ObjectId;
}) => {
  const { date, trainer } = payload;

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const count = await ClassScheduleModel.countDocuments({
    date: { $gte: startOfDay, $lte: endOfDay },
    isDeleted: false, // Only consider non-deleted classes
  });

  if (count >= 5) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Daily class schedule limit (5) reached.',
    );
  }

  const newClass = await ClassScheduleModel.create({ date, trainer });
  return newClass;
};

const getAllClasses = async () => {
  return ClassScheduleModel.find({ isDeleted: false }).populate(
    'trainer',
    'name email role',
  );
};

const getSingleClass = async (id: string) => {
  const singleClass = await ClassScheduleModel.findOne({
    _id: id,
    isDeleted: false,
  }).populate('trainer', 'name email role');
  if (!singleClass) {
    throw new AppError(httpStatus.NOT_FOUND, 'Class not found');
  }
  return singleClass;
};

const updateClass = async (id: string, payload: Partial<IClassSchedule>) => {
  const updatedClass = await ClassScheduleModel.findOneAndUpdate(
    { _id: id, isDeleted: false },
    payload,
    { new: true },
  );
  if (!updatedClass) {
    throw new AppError(httpStatus.NOT_FOUND, 'Class not found');
  }
  return updatedClass;
};

// Soft Delete
const deleteClass = async (id: string): Promise<IClassSchedule> => {
  const deletedClass = await ClassScheduleModel.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true },
    { new: true },
  );
  if (!deletedClass) {
    throw new AppError(httpStatus.NOT_FOUND, 'Class not found');
  }
  return deletedClass;
};

export const classService = {
  createClass,
  getAllClasses,
  getSingleClass,
  updateClass,
  deleteClass,
};
