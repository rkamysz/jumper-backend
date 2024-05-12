import { bufferToHex, ecrecover, fromRpcSig, hashPersonalMessage, pubToAddress, toBuffer } from 'ethereumjs-util';
import { NextFunction, Request, Response } from 'express';

import { HttpError } from '../api-errors';

export const recoverAddressMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const { signature, originalMessage, address } = req.body;
  try {
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
