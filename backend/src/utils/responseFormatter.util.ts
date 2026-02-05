import { Response } from 'express';
import { ApiResponse, ApiErrorResponse, PaginationResponse, FieldError } from '../types';

export class ResponseFormatter {
  static success<T>(
    res: Response,
    statusCode: number,
    title: string,
    message: string,
    data?: T,
    pagination?: PaginationResponse
  ): Response {
    const response: ApiResponse<T> = {
      title,
      message,
      data,
      ...(pagination && { pagination }),
    };

    return res.status(statusCode).json(response);
  }

  static error(
    res: Response,
    statusCode: number,
    title: string,
    message: string,
    errors?: FieldError[]
  ): Response {
    const response: ApiErrorResponse = {
      title,
      message,
      ...(errors && { errors }),
    };

    return res.status(statusCode).json(response);
  }

  static created<T>(
    res: Response,
    title: string,
    message: string,
    data?: T
  ): Response {
    return this.success(res, 201, title, message, data);
  }

  static ok<T>(
    res: Response,
    title: string,
    message: string,
    data?: T,
    pagination?: PaginationResponse
  ): Response {
    return this.success(res, 200, title, message, data, pagination);
  }

  static badRequest(
    res: Response,
    message: string,
    errors?: FieldError[]
  ): Response {
    return this.error(res, 400, 'Bad Request', message, errors);
  }

  static notFound(res: Response, message: string): Response {
    return this.error(res, 404, 'Not Found', message);
  }

  static internalError(res: Response, message: string): Response {
    return this.error(res, 500, 'Internal Server Error', message);
  }
}