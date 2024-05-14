import { bufferToHex, ecrecover, fromRpcSig, hashPersonalMessage, pubToAddress, toBuffer } from 'ethereumjs-util';
import { Request, Response } from 'express';
import { describe, expect, it, Mock, vi } from 'vitest';

import { HttpError } from '@/common/api-errors';

import { recoverAddressMiddleware } from '../recover-address.middleware';

vi.mock('ethereumjs-util', () => ({
  bufferToHex: vi.fn(),
  ecrecover: vi.fn(),
  fromRpcSig: vi.fn(),
  hashPersonalMessage: vi.fn(),
  pubToAddress: vi.fn(),
  toBuffer: vi.fn(),
}));

describe('recoverAddressMiddleware', () => {
  it('should recover address and set it in res.locals', async () => {
    const req = {
      body: {
        signature: '0xsignature',
        originalMessage: 'originalMessage',
        address: '0xaddress',
      },
    } as Request;
    const res = {
      locals: {},
    } as Response;
    const next = vi.fn();

    const msgBuffer = Buffer.from('messageBuffer');
    const msgHash = Buffer.from('messageHash');
    const signatureParams = { v: 27, r: Buffer.from('r'), s: Buffer.from('s') };
    const publicKey = Buffer.from('publicKey');
    const recoveredAddress = '0xrecoveredAddress';

    (toBuffer as Mock).mockReturnValue(msgBuffer);
    (hashPersonalMessage as Mock).mockReturnValue(msgHash);
    (fromRpcSig as Mock).mockReturnValue(signatureParams);
    (ecrecover as Mock).mockReturnValue(publicKey);
    (pubToAddress as Mock).mockReturnValue(Buffer.from(recoveredAddress));
    (bufferToHex as Mock).mockReturnValue(recoveredAddress);

    await recoverAddressMiddleware(req, res, next);

    expect(toBuffer).toHaveBeenCalledWith(req.body.originalMessage);
    expect(hashPersonalMessage).toHaveBeenCalledWith(msgBuffer);
    expect(fromRpcSig).toHaveBeenCalledWith(req.body.signature);
    expect(ecrecover).toHaveBeenCalledWith(msgHash, signatureParams.v, signatureParams.r, signatureParams.s);
    expect(pubToAddress).toHaveBeenCalledWith(publicKey);
    expect(bufferToHex).toHaveBeenCalledWith(Buffer.from(recoveredAddress));

    expect(res.locals.recoveredAddress).toBe(recoveredAddress);
    expect(res.locals.originalBody).toEqual(req.body);
    expect(next).toHaveBeenCalled();
  });

  it('should call next with error if an exception occurs', async () => {
    const req = {
      body: {
        signature: '0xsignature',
        originalMessage: 'originalMessage',
        address: '0xaddress',
      },
    } as Request;
    const res = {
      locals: {},
    } as Response;
    const next = vi.fn();

    const error = new Error('test error');

    (toBuffer as Mock).mockImplementation(() => {
      throw error;
    });

    await recoverAddressMiddleware(req, res, next);

    expect(next).toHaveBeenCalledWith(new HttpError(500, 'Internal Server Error during signature recovery.', error));
  });
});
