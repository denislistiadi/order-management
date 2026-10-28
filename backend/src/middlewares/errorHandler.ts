/**
 * Global error handling middleware.
 * Intercepts uncaught errors, Zod validation issues, and operational application errors,
 * formatting them into the unified ApiResponse structure.
 */

import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { errorResponse } from '../utils/response';

export interface AppError extends Error {
  statusCode?: number;
  errors?: Record<string, string[]>;
}

export function errorHandler(
  err: AppError | ZodError | Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Format Zod validation errors into indexed dot-notation map
  if (err instanceof ZodError) {
    const formattedErrors: Record<string, string[]> = {};
    for (const issue of err.issues) {
      const key = issue.path.join('.') || 'root';
      if (!formattedErrors[key]) {
        formattedErrors[key] = [];
      }
      formattedErrors[key].push(issue.message);
    }

    res.status(422).json(errorResponse('Validation failed', formattedErrors));
    return;
  }

  // Handle Prisma unique constraint violations (P2002)
  if ('code' in err && err.code === 'P2002') {
    res.status(409).json(errorResponse('Data dengan nilai unik tersebut sudah terdaftar'));
    return;
  }

  // Handle application and runtime errors
  const statusCode = 'statusCode' in err && typeof err.statusCode === 'number' ? err.statusCode : 500;
  const message = err.message || 'Internal Server Error';
  const errors =
    'errors' in err && typeof err.errors === 'object' && err.errors !== null
      ? (err.errors as Record<string, string[]>)
      : undefined;

  if (statusCode === 500) {
    console.error('[Unhandled Error]:', err);
  }

  res.status(statusCode).json(errorResponse(message, errors));
}

export default errorHandler;
