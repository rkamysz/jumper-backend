import { NextFunction, Request, Response } from 'express';

import { HttpError } from '../api-errors';

export const authenticateAddressMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { recoveredAddress } = res.locals;
    const { address } = res.locals.originalBody;

    if (recoveredAddress.toLowerCase() === address.toLowerCase()) {
      next();
    } else {
      next(new HttpError(401, 'Authentication failed. The address does not match the signature.'));
    }
  } catch (error) {
    next(new HttpError(500, 'Internal Server Error during address authentication.', error as Error));
  }
};
