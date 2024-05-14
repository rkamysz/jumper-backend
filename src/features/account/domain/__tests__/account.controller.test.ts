import 'reflect-metadata';

import { Result } from '@soapjs/soap';
import { describe, expect, it, vi } from 'vitest';

import { AccountController } from '../account.controller';
import { Account } from '../entities/account';
import { CreateAccountUseCase } from '../use-cases/create-account.use-case';
import { GetAccountUseCase } from '../use-cases/get-account.use-case';

describe('AccountController', () => {
  const mockCreateAccountUseCase = {
    execute: vi.fn(),
  };
  const mockGetAccountUseCase = {
    execute: vi.fn(),
  };

  const controller = new AccountController(
    mockCreateAccountUseCase as unknown as CreateAccountUseCase,
    mockGetAccountUseCase as unknown as GetAccountUseCase
  );

  it('should return failure if CreateAccountUseCase.execute fails', async () => {
    const failureResult = Result.withFailure(new Error('DB error'));
    mockCreateAccountUseCase.execute.mockResolvedValue(failureResult);

    const result = await controller.createAccount('0x123');

    expect(result.isFailure).toBe(true);
    expect(result.failure).toEqual(failureResult.failure);
  });

  it('should return success if CreateAccountUseCase.execute succeeds', async () => {
    const account = new Account('0x123', 'user_0');
    const successResult = Result.withContent(account);
    mockCreateAccountUseCase.execute.mockResolvedValue(successResult);

    const result = await controller.createAccount('0x123');

    expect(result.isFailure).toBe(false);
    expect(result.content).toEqual(account);
  });
});
