import { bufferToHex, ecrecover, fromRpcSig, hashPersonalMessage, pubToAddress, toBuffer } from 'ethereumjs-util';
import { NextFunction, Request, Response } from 'express';

import { HttpError } from '../api-errors';

/**
 * Middleware to recover the Ethereum address from a given signature and original message.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next middleware function.
 *
 * @property {string} req.body.signature - The signature to recover the address from.
 * @property {string} req.body.originalMessage - The original message that was signed.
 * @property {string} req.body.address - The expected Ethereum address (not used in the recovery process).
 *
 * @throws {HttpError} Throws a 500 error if any error occurs during the signature recovery process.
 */
export const recoverAddressMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { signature, originalMessage, address } = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const msgBuffer = toBuffer(originalMessage);
    const msgHash = hashPersonalMessage(msgBuffer);
    const signatureParams = fromRpcSig(signature);
    const publicKey = ecrecover(msgHash, signatureParams.v, signatureParams.r, signatureParams.s);
    const recoveredAddress = bufferToHex(pubToAddress(publicKey));

    res.locals.recoveredAddress = recoveredAddress;
    res.locals.originalBody = { signature, originalMessage, address };
    next();
  } catch (error) {
    next(new HttpError(500, 'Internal Server Error during signature recovery.', error as Error));
  }
};
