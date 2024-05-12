import { Request, Response } from 'express';

import { HttpError } from '../api-errors';
import { Logger } from '../types';

export const errorHandler = (logger: Logger) => (error: HttpError, req: Request, res: Response) => {
  logger.error(error.stack);

  res.status(error.status).json({
    error: {
      message: error.message || 'Internal Server Error.',
      status: error.status,
    },
  });
};
