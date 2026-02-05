import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors';
import { ResponseFormatter } from '../utils';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);


  if (err instanceof AppError) {
    return ResponseFormatter.error(
      res,
      err.statusCode,
      err.title,
      err.message,
      err.errors
    );
  }


  if (err.name === 'ValidationError') {
    return ResponseFormatter.error(
      res,
      400,
      'Validation Error',
      'Invalid input data',
      []
    );
  }


  if (err.name === 'CastError') {
    return ResponseFormatter.error(
      res,
      400,
      'Invalid ID',
      'Invalid class ID format'
    );
  }

  return ResponseFormatter.internalError(
    res,
    'An unexpected error occurred'
  );
};