import mongoose from 'mongoose';
import {
  TErrorSources,
  TgenericRerrorResponse,
} from '../interface/error.interface';

const handleCastError = (
  error: mongoose.Error.CastError,
): TgenericRerrorResponse => {
  const errorSources: TErrorSources = [
    {
      field: error?.path,
      message: error.message,
    },
  ];

  const statusCode = 400;

  return {
    statusCode,
    message: 'validation error',
    errorDetails: errorSources,
  };
};

export default handleCastError;
