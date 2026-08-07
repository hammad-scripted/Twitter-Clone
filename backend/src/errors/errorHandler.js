import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { env } from '../config/env.js';

const errorHandler = (err, _req, res, _next) => {
  let statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  let message = err.message || ReasonPhrases.INTERNAL_SERVER_ERROR;
  let errors = err.errors || [];

  if (err.name === 'ValidationError') {
    statusCode = StatusCodes.BAD_REQUEST;
    message = 'Validation failed';
    errors = Object.values(err.errors).map((error) => error.message);
  } else if (err.name === 'CastError') {
    statusCode = StatusCodes.BAD_REQUEST;
    message = 'Invalid resource identifier';
  } else if (err.code === 11000) {
    statusCode = StatusCodes.CONFLICT;
    message = 'A user with those details already exists';
  }

  if (statusCode >= 500) {
    console.error(err);
    if (env.isProduction) message = ReasonPhrases.INTERNAL_SERVER_ERROR;
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errors,
    data: err.data || null,
    ...(!env.isProduction && { stack: err.stack }),
  });
};

export default errorHandler;
