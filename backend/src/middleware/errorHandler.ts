import { Request, Response, NextFunction } from 'express';
import config from '../config';

// =============================================================
// Custom Application Error
// =============================================================

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly code?: string;

  constructor(message: string, statusCode: number, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.code = code;
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  // Convenience static factories
  static badRequest(message = 'Bad request.'): AppError {
    return new AppError(message, 400, 'BAD_REQUEST');
  }

  static unauthorized(message = 'Unauthorized.'): AppError {
    return new AppError(message, 401, 'UNAUTHORIZED');
  }

  static forbidden(message = 'Forbidden.'): AppError {
    return new AppError(message, 403, 'FORBIDDEN');
  }

  static notFound(message = 'Resource not found.'): AppError {
    return new AppError(message, 404, 'NOT_FOUND');
  }

  static conflict(message = 'Resource already exists.'): AppError {
    return new AppError(message, 409, 'CONFLICT');
  }

  static tooManyRequests(message = 'Too many requests.'): AppError {
    return new AppError(message, 429, 'TOO_MANY_REQUESTS');
  }

  static internal(message = 'Internal server error.'): AppError {
    return new AppError(message, 500, 'INTERNAL_ERROR');
  }
}

// =============================================================
// 404 Handler
// =============================================================

export const notFoundHandler = (
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.originalUrl} not found.`,
  });
};

// =============================================================
// Global Error Handler
// =============================================================

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal server error.';
  let code: string | undefined;

  // AppError (our own errors)
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    code = err.code;
  }

  // Prisma known request errors
  if (err.name === 'PrismaClientKnownRequestError') {
    const prismaError = err as Error & { code: string; meta?: Record<string, unknown> };
    switch (prismaError.code) {
      case 'P2002': {
        statusCode = 409;
        const fields = (prismaError.meta?.target as string[])?.join(', ') || 'unknown';
        message = `A record with this ${fields} already exists.`;
        code = 'DUPLICATE_ENTRY';
        break;
      }
      case 'P2025':
        statusCode = 404;
        message = 'The requested record was not found.';
        code = 'NOT_FOUND';
        break;
      case 'P2003':
        statusCode = 400;
        message = 'Operation failed due to a foreign key constraint.';
        code = 'FK_CONSTRAINT';
        break;
      case 'P2014':
        statusCode = 400;
        message = 'The change you are trying to make would violate a required relation.';
        code = 'RELATION_VIOLATION';
        break;
      default:
        statusCode = 400;
        message = 'A database operation failed.';
        code = 'DB_ERROR';
    }
  }

  // Prisma validation error
  if (err.name === 'PrismaClientValidationError') {
    statusCode = 400;
    message = 'Invalid data provided to the database.';
    code = 'VALIDATION_ERROR';
  }

  // JSON syntax error (malformed body)
  if (err instanceof SyntaxError && 'body' in err) {
    statusCode = 400;
    message = 'Malformed JSON in request body.';
    code = 'INVALID_JSON';
  }

  // Multer file upload errors
  if (err.name === 'MulterError') {
    const multerErr = err as Error & { code: string };
    statusCode = 400;
    switch (multerErr.code) {
      case 'LIMIT_FILE_SIZE':
        message = 'File size exceeds the allowed limit.';
        break;
      case 'LIMIT_FILE_COUNT':
        message = 'Too many files uploaded.';
        break;
      case 'LIMIT_UNEXPECTED_FILE':
        message = 'Unexpected file field.';
        break;
      default:
        message = 'File upload error.';
    }
    code = 'UPLOAD_ERROR';
  }

  // Log the error in development or if it is unexpected (non-operational)
  if (config.app.isDevelopment || !(err instanceof AppError && err.isOperational)) {
    console.error(`[Error] ${statusCode} - ${message}`);
    console.error(err.stack);
  }

  // Build response
  const response: Record<string, unknown> = {
    success: false,
    error: message,
  };

  if (code) {
    response.code = code;
  }

  if (config.app.isDevelopment) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};
