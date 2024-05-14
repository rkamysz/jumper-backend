import { verifyMessage } from 'ethers';
import { NextFunction, Request, Response } from 'express';

import { HttpError } from '../api-errors';

/**
 * Middleware to authenticate a user based on the Ethereum address and signature.
 * It compares the recovered address stored in `res.locals.recoveredAddress` against
 * the address provided in the request body (`res.locals.originalBody.address`).
 *
 * @param {Request} req - The request object from Express.js containing the request data.
 * @param {Response} res - The response object from Express.js for sending back the HTTP response.
 * @param {NextFunction} next - The next middleware function in the Express.js route chain.
 *
 * @throws {HttpError} 401 - If the authentication fails because the addresses do not match.
 * @throws {HttpError} 500 - If there is an internal server error during the address authentication process.
 */
export const authenticateAddressMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { address, signature, message } = req.body;
    const recoveredAddress = verifyMessage(message, signature);

    if (recoveredAddress.toLowerCase() === address.toLowerCase()) {
      next();
    } else {
      next(new HttpError(401, 'Authentication failed. The address does not match the signature.'));
    }
  } catch (error) {
    next(new HttpError(500, 'Internal Server Error during address authentication.', error as Error));
  }
};
