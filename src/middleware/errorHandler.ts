import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Default error response
  let statusCode = 500;
  let message = 'Internal server error';

  // Handle specific error types
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation error';
  } else if (error.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Unauthorized';
  } else if (error.name === 'NotFoundError') {
    statusCode = 404;
    message = 'Resource not found';
  } else if (error.name === 'QueryFailedError') {
    statusCode = 400;
    message = 'Database query failed';
  }

  res.status(statusCode).json({
    error: {
      message,
      type: error.name,
      ...(process.env.NODE_ENV === 'development' && { 
        stack: error.stack,
        details: error.message 
      })
    },
    timestamp: new Date().toISOString(),
    path: req.url
  });
};
