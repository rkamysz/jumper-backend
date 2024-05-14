import { NextFunction, Request, Response } from 'express';
import { isAddress } from 'web3-validator';

import { HttpError } from '../api-errors';

/**
 * Middleware to validate Ethereum address query parameter.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next middleware function.
 *
 * @throws {HttpError} Throws a 400 error if the 'address' query parameter is missing or invalid.
 */
export const isValidAddressMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const address = req.query['address'];

    if (typeof address !== 'string') {
      next(new HttpError(400, 'Missing "address" query param'));
    } else if (isAddress(address) === false) {
      next(new HttpError(400, 'Invalid ETH address'));
    } else {
      next();
    }
  } catch (error) {
    const e = error as Error;
    next(new HttpError(500, e.message, e));
  }
};
