import mongoose from 'mongoose';
import {
  TErrorSources,
  TgenericRerrorResponse,
} from '../interface/error.interface';

const handleValidationError = (
  error: mongoose.Error.ValidationError,
): TgenericRerrorResponse => {
  const errorDetails: TErrorSources = Object.values(error.errors).map(
    (val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        field: val?.path,
        message: val?.message,
      };
    },
  );

  const statusCode = 400;

  return {
    statusCode,
    message: 'validation error',
    errorDetails,
  };
};

export default handleValidationError;
