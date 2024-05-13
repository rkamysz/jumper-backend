/* eslint-disable @typescript-eslint/no-unused-vars */
import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';

import { HttpError } from '../api-errors';
import { Logger } from '../types';

export const errorHandler =
  (logger: Logger): ErrorRequestHandler =>
  (error: HttpError, req: Request, res: Response, next: NextFunction) => {
    logger.error(JSON.stringify(error));
    res.status(error.status).json({
      error: {
        message: error.message || 'Internal Server Error.',
        status: error.status,
      },
    });
  };
