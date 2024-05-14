import { Alchemy } from 'alchemy-sdk';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { TokenMetadata } from '@/features/tokens/domain/entities/token-metadata';

import { AlchemyService } from '../alchemy.service';

vi.mock('alchemy-sdk', () => {
  const core = {
    getTokenBalances: vi.fn(),
    getTokenMetadata: vi.fn(),
  };
  return {
    Alchemy: vi.fn(() => ({ core })),
  };
});

describe('AlchemyService', () => {
  let alchemyService: AlchemyService;
  let mockClient: any;

  beforeEach(() => {
    mockClient = new Alchemy({ apiKey: 'test-api-key' });
    alchemyService = new AlchemyService({ apiKey: 'test-api-key' });
    alchemyService['client'] = mockClient;
  });

  describe('fetchTokenBalances', () => {
    it('should return token balances', async () => {
      const mockBalances = {
        tokenBalances: [
          { tokenBalance: '1000', contractAddress: '0x1', error: null },
          { tokenBalance: '2000', contractAddress: '0x2', error: null },
        ],
      };
      mockClient.core.getTokenBalances.mockResolvedValue(mockBalances);

      const result = await alchemyService.fetchTokenBalances('0x123');

      expect(result.isFailure).toBe(false);
      expect(result.content).toEqual([
        { tokenBalance: 1000, contractAddress: '0x1' },
        { tokenBalance: 2000, contractAddress: '0x2' },
      ]);
    });

    it('should filter out tokens with errors', async () => {
      const mockBalances = {
        tokenBalances: [
          { tokenBalance: '1000', contractAddress: '0x1', error: null },
          { tokenBalance: null, contractAddress: '0x2', error: 'Some error' },
        ],
      };
      mockClient.core.getTokenBalances.mockResolvedValue(mockBalances);

      const result = await alchemyService.fetchTokenBalances('0x123');

      expect(result.isFailure).toBe(false);
      expect(result.content).toEqual([{ tokenBalance: 1000, contractAddress: '0x1' }]);
    });

    it('should return failure on error', async () => {
      const error = new Error('API error');
      mockClient.core.getTokenBalances.mockRejectedValue(error);

      const result = await alchemyService.fetchTokenBalances('0x123');

      expect(result.isFailure).toBe(true);
      expect(result.failure.error).toEqual(error);
    });
  });

  describe('fetchTokensMetadata', () => {
    it('should return token metadata', async () => {
      const mockMetadata = {
        name: 'Token1',
        symbol: 'T1',
        decimals: 18,
        logo: 'http://example.com/logo1.png',
      };
      mockClient.core.getTokenMetadata.mockResolvedValue(mockMetadata);

      const result = await alchemyService.fetchTokensMetadata('0x123', ['0x1']);

      expect(result.isFailure).toBe(false);
      expect(result.content).toEqual([new TokenMetadata('0x1', 'Token1', 'T1', 'http://example.com/logo1.png', 18)]);
    });

    it('should return failure on error', async () => {
      const error = new Error('API error');
      mockClient.core.getTokenMetadata.mockRejectedValue(error);

      const result = await alchemyService.fetchTokensMetadata('0x123', ['0x1']);

      expect(result.isFailure).toBe(true);
      expect(result.failure.error).toEqual(error);
    });

    it('should handle chunking of contracts', async () => {
      const mockMetadata1 = {
        name: 'Token1',
        symbol: 'T1',
        decimals: 18,
        logo: 'http://example.com/logo1.png',
      };
      const mockMetadata2 = {
        name: 'Token2',
        symbol: 'T2',
        decimals: 18,
        logo: 'http://example.com/logo2.png',
      };
      mockClient.core.getTokenMetadata.mockResolvedValueOnce(mockMetadata1).mockResolvedValueOnce(mockMetadata2);

      alchemyService = new AlchemyService({ apiKey: 'test-api-key', batchSize: 1 });
      alchemyService['client'] = mockClient;

      const result = await alchemyService.fetchTokensMetadata('0x123', ['0x1', '0x2']);

      expect(result.isFailure).toBe(false);
      expect(result.content).toEqual([
        new TokenMetadata('0x1', 'Token1', 'T1', 'http://example.com/logo1.png', 18),
        new TokenMetadata('0x2', 'Token2', 'T2', 'http://example.com/logo2.png', 18),
      ]);
    });
  });
});
