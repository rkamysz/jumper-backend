import { NextFunction, Request, Response } from 'express';
import { isAddress } from 'web3-validator';

import { HttpError } from '../api-errors';

export const isValidAddressMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const address = req.query['address'];

  if (typeof address !== 'string') {
    next(new HttpError(400, 'Missing "address" query param'));
  } else if (isAddress(address) === false) {
    next(new HttpError(400, 'Invalid ETH address'));
  } else {
    next();
  }
};
