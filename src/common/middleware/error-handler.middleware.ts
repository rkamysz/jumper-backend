/* eslint-disable @typescript-eslint/no-unused-vars */
import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';

import { HttpError } from '../api-errors';
import { Logger } from '../types';

/**
 * Middleware to handle errors across the Express application.
 * It logs the error using a provided logger and sends a JSON response with the error details.
 *
 * @param {Logger} logger - Logger instance for logging errors.
 * @returns {ErrorRequestHandler} Express error handling middleware that captures errors,
 * logs them, and sends a structured error response.
 */
export const errorHandler =
  (logger: Logger): ErrorRequestHandler =>
  (error: HttpError, req: Request, res: Response, next: NextFunction) => {
    // we should add some monitor client or new relic
    logger.error(JSON.stringify(error));
    res.status(error.status).json({
      error: {
        message: error.message || 'Internal Server Error.',
        status: error.status,
      },
    });
  };
