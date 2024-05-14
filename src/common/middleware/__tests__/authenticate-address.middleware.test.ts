/* eslint-disable @typescript-eslint/no-unused-vars */
import { verifyMessage } from 'ethers';
import { NextFunction, Request, Response } from 'express';
import { describe, expect, it, vi } from 'vitest';

import { HttpError } from '@/common/api-errors';

import { authenticateAddressMiddleware } from '../authenticate-address.middleware';

const mockResponse = (recoveredAddress?: string, address?: string) => ({
  locals: {
    recoveredAddress,
    originalBody: {
      address,
    },
  },
  status: vi.fn(),
  json: vi.fn(),
});

const mockVerifyMessage = vi.fn();

vi.mock('ethers', () => {
  return {
    verifyMessage: vi.fn(),
  };
});

const nextFunction = vi.fn();

describe('authenticateAddressMiddleware', () => {
  it('should authenticate successfully if addresses match', async () => {
    (verifyMessage as any).mockReturnValue('0xb7A559d4f24E9724eDC39A5700876F68514381d9');
    const req = {
      body: {
        address: '0xb7A559d4f24E9724eDC39A5700876F68514381d9',
        signature: '0xabcdef',
        message: 'I am signing this message to verify my address: 0xb7A559d4f24E9724eDC39A5700876F68514381d9',
      },
    };
    const res: any = {};

    await authenticateAddressMiddleware(req as any, res, nextFunction);
    expect(nextFunction).toHaveBeenCalledWith();
  });

  it('should return 401 error if addresses do not match', async () => {
    (verifyMessage as any).mockReturnValue('0xb7A559d4f24E9724eDC39A5700876F68514381d9');
    const req = {
      body: {
        address: '0xb7A559d4f249',
        signature: '0xabcdef',
        message: 'I am signing this message to verify my address: 0xb7A559d4f249',
      },
    };
    const res: any = {};

    await authenticateAddressMiddleware(req as any, res, nextFunction);
    expect(nextFunction).toHaveBeenCalledWith(
      new HttpError(401, 'Authentication failed. The address does not match the signature.')
    );
  });

  it('should handle exceptions and return 500 error', async () => {
    const res: any = mockResponse();

    await authenticateAddressMiddleware({} as any, res, nextFunction);
    expect(nextFunction).toHaveBeenCalledWith(expect.any(HttpError));
    expect(nextFunction.mock.calls[0][0].status).toBe(500);
  });
});
