import { FieldError } from '../types';

export class AppError extends Error {
  public statusCode: number;
  public title: string;
  public errors?: FieldError[];
  public isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    title: string = 'Error',
    errors?: FieldError[]
  ) {
    super(message);
    this.statusCode = statusCode;
    this.title = title;
    this.errors = errors;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, errors?: FieldError[]) {
    super(message, 400, 'Validation Error', errors);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, 'Not Found');
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = 'Database operation failed') {
    super(message, 500, 'Database Error');
  }
}