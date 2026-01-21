import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '../config/logger';

export const errorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const err = error as Error;
  logger.error(`Error: ${err.message}`);

  // Error de validación Zod
  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors: error.issues.map(issue => ({
        field: (issue.path || []).join('.'),
        message: issue.message
      }))
    });
  }

  // Error genérico
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  
  return res.status(statusCode).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};