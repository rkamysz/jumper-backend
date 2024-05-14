import 'reflect-metadata';

import { Result } from '@soapjs/soap/build/architecture';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Token } from '../../entities/token';
import { FetchBalancesAndMetadataUseCase } from '../fetch-balances-and-metadate.use-case';

describe('FetchBalancesAndMetadataUseCase', () => {
  let useCase: FetchBalancesAndMetadataUseCase;
  let mockExplorerService: any;
  let mockFetchTokensMetadata: any;

  beforeEach(() => {
    mockExplorerService = {
      fetchTokenBalances: vi.fn(),
    };

    mockFetchTokensMetadata = {
      execute: vi.fn(),
    };

    useCase = new FetchBalancesAndMetadataUseCase(mockExplorerService, mockFetchTokensMetadata);
  });

  it('should return failure if fetchTokenBalances fails', async () => {
    const error = new Error('API error');
    mockExplorerService.fetchTokenBalances.mockResolvedValue(Result.withFailure(error));

    const result = await useCase.execute('0x123');

    expect(result.isFailure).toBe(true);
    expect(result.failure.error).toEqual(error);
  });

  it('should return failure if fetchTokensMetadata fails', async () => {
    const balances = [{ tokenBalance: 1000, contractAddress: '0x1' }];
    const error = new Error('API error');

    mockExplorerService.fetchTokenBalances.mockResolvedValue(Result.withContent(balances));
    mockFetchTokensMetadata.execute.mockResolvedValue(Result.withFailure(error));

    const result = await useCase.execute('0x123');

    expect(result.isFailure).toBe(true);
    expect(result.failure.error).toEqual(error);
  });

  it('should return tokens with metadata', async () => {
    const balances = [
      { tokenBalance: 1000, contractAddress: '0x1' },
      { tokenBalance: 2000, contractAddress: '0x2' },
    ];

    const metadatas = [
      { contractAddress: '0x1', name: 'Token1', symbol: 'T1', logo: 'http://example.com/logo1.png', decimals: 18 },
      { contractAddress: '0x2', name: 'Token2', symbol: 'T2', logo: 'http://example.com/logo2.png', decimals: 18 },
    ];

    mockExplorerService.fetchTokenBalances.mockResolvedValue(Result.withContent(balances));
    mockFetchTokensMetadata.execute.mockResolvedValue(Result.withContent(metadatas));

    const result = await useCase.execute('0x123');

    expect(result.isFailure).toBe(false);
    expect(result.content).toEqual([
      new Token('0x1', 'Token1', 'T1', 'http://example.com/logo1.png', 18, 1000),
      new Token('0x2', 'Token2', 'T2', 'http://example.com/logo2.png', 18, 2000),
    ]);
  });

  it('should handle missing metadata', async () => {
    const balances = [
      { tokenBalance: 1000, contractAddress: '0x1' },
      { tokenBalance: 2000, contractAddress: '0x2' },
    ];

    const metadatas = [
      { contractAddress: '0x1', name: 'Token1', symbol: 'T1', logo: 'http://example.com/logo1.png', decimals: 18 },
    ];

    mockExplorerService.fetchTokenBalances.mockResolvedValue(Result.withContent(balances));
    mockFetchTokensMetadata.execute.mockResolvedValue(Result.withContent(metadatas));

    const result = await useCase.execute('0x123');

    expect(result.isFailure).toBe(false);
    expect(result.content).toEqual([
      new Token('0x1', 'Token1', 'T1', 'http://example.com/logo1.png', 18, 1000),
      new Token('0x2', null, null, null, NaN, 2000),
    ]);
  });
});
