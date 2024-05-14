import { Request, Response } from 'express';
import { describe, expect, it, Mock, vi } from 'vitest';
import { isAddress } from 'web3-validator';

import { isValidAddressMiddleware } from '../is-valid-address.middleware';
import { HttpError } from './../../api-errors';

vi.mock('web3-validator', () => ({
  isAddress: vi.fn(),
}));

describe('isValidAddressMiddleware', () => {
  it('should call next with error if address is missing', async () => {
    const req = { query: {} } as Request;
    const res = {} as Response;
    const next = vi.fn();

    await isValidAddressMiddleware(req, res, next);

    expect(next).toHaveBeenCalledWith(new HttpError(400, 'Missing "address" query param'));
  });

  it('should call next with error if address is invalid', async () => {
    const req = { query: { address: 'invalidAddress' } } as any;
    const res = {} as Response;
    const next = vi.fn();

    (isAddress as Mock).mockReturnValue(false);

    await isValidAddressMiddleware(req, res, next);

    expect(next).toHaveBeenCalledWith(new HttpError(400, 'Invalid ETH address'));
  });

  it('should call next without error if address is valid', async () => {
    const req = { query: { address: '0xvalidAddress' } } as any;
    const res = {} as Response;
    const next = vi.fn();

    (isAddress as Mock).mockReturnValue(true);

    await isValidAddressMiddleware(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });
});
