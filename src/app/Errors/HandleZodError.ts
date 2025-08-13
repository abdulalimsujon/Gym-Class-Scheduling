import { ZodError, ZodIssue } from 'zod';
import {
  TErrorSources,
  TgenericRerrorResponse,
} from '../interface/error.interface';

const handleZodError = (err: ZodError): TgenericRerrorResponse => {
  const errorDetails: TErrorSources = err.issues.map((issue: ZodIssue) => {
    return {
      field: issue?.path[issue.path.length - 1],
      message: issue?.message,
    };
  });

  const statusCode = 400;

  return {
    statusCode,
    message: 'validation error',
    errorDetails,
  };
};

export default handleZodError;
