/* eslint-disable @typescript-eslint/no-unused-vars */
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

const nextFunction = vi.fn();

describe('authenticateAddressMiddleware', () => {
  it('should authenticate successfully if addresses match', async () => {
    const res: any = mockResponse('0x123', '0x123');

    await authenticateAddressMiddleware({} as any, res, nextFunction);
    expect(nextFunction).toHaveBeenCalledWith();
  });

  it('should return 401 error if addresses do not match', async () => {
    const res: any = mockResponse('0x123', '0x456');

    await authenticateAddressMiddleware({} as any, res, nextFunction);
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
