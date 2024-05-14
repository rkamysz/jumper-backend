import 'reflect-metadata';

import { Result } from '@soapjs/soap';
import { describe, expect, it, vi } from 'vitest';

import { Account } from '../../entities/account';
import { AccountRepository } from '../../repositories/account.repository';
import { CreateAccountUseCase } from '../create-account.use-case';

describe('CreateAccountUseCase', () => {
  const mockAccountRepository = {
    count: vi.fn(),
    find: vi.fn(),
    add: vi.fn(),
  };

  const useCase = new CreateAccountUseCase(mockAccountRepository as unknown as AccountRepository);

  it('should return failure if accountRepository.count fails', async () => {
    const failureResult = Result.withFailure(new Error('DB error'));
    mockAccountRepository.count.mockResolvedValue(failureResult);

    const result = await useCase.execute('0x123');

    expect(result.isFailure).toBe(true);
    expect(result.failure).toEqual(failureResult.failure);
  });

  it('should return failure if accountRepository.add fails', async () => {
    const countResult = Result.withContent(0);
    const findResult = Result.withContent([]);
    const failureResult = Result.withFailure(new Error('Add error'));
    mockAccountRepository.count.mockResolvedValue(countResult);
    mockAccountRepository.find.mockResolvedValue(findResult);
    mockAccountRepository.add.mockResolvedValue(failureResult);

    const result = await useCase.execute('0x123');

    expect(result.isFailure).toBe(true);
    expect(result.failure).toEqual(failureResult.failure);
  });

  it('should return success if account is created successfully', async () => {
    const countResult = Result.withContent(0);
    const account = new Account('0x123', 'user_0');
    const addResult = Result.withContent([account]);
    const findResult = Result.withContent([]);
    mockAccountRepository.count.mockResolvedValue(countResult);
    mockAccountRepository.find.mockResolvedValue(findResult);
    mockAccountRepository.add.mockResolvedValue(addResult);

    const result = await useCase.execute('0x123');

    expect(result.isFailure).toBe(false);
    expect(result.content).toEqual(account);
  });
});
