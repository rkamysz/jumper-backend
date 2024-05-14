import 'reflect-metadata';

import { Result } from '@soapjs/soap';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { TokenMetadata } from '../../entities/token-metadata';
import { FetchTokensMetadataUseCase } from '../fetch-tokens-metadata.use-case';

describe('FetchTokensMetadataUseCase', () => {
  let useCase: FetchTokensMetadataUseCase;
  let mockExplorerService: any;
  let mockMetadataRepository: any;
  let mockLogger: any;
  let mockConfig: any;

  beforeEach(() => {
    mockExplorerService = {
      fetchTokensMetadata: vi.fn(),
    };

    mockMetadataRepository = {
      find: vi.fn(),
      add: vi.fn(),
    };

    mockLogger = {
      error: vi.fn(),
    };

    mockConfig = {
      USE_CACHE: true,
    };

    useCase = new FetchTokensMetadataUseCase(mockExplorerService, mockMetadataRepository, mockLogger, mockConfig);
  });

  it('should fetch token metadata directly from explorer service when cache is disabled', async () => {
    mockConfig.USE_CACHE = false;
    const mockMetadata = [new TokenMetadata('0x1', 'Token1', 'T1', 'http://example.com/logo1.png', 18)];
    mockExplorerService.fetchTokensMetadata.mockResolvedValue(Result.withContent(mockMetadata));

    const result = await useCase.execute('0x123', ['0x1']);

    expect(result.isFailure).toBe(false);
    expect(result.content).toEqual(mockMetadata);
    expect(mockExplorerService.fetchTokensMetadata).toHaveBeenCalledWith('0x123', ['0x1']);
  });

  it('should fetch token metadata from repository and explorer service if some metadata is missing', async () => {
    const storedMetadata = [new TokenMetadata('0x1', 'Token1', 'T1', 'http://example.com/logo1.png', 18)];
    const missingMetadata = [new TokenMetadata('0x2', 'Token2', 'T2', 'http://example.com/logo2.png', 18)];

    mockMetadataRepository.add.mockResolvedValue(Result.withContent(missingMetadata));
    mockMetadataRepository.find.mockResolvedValue(Result.withContent(storedMetadata));
    mockExplorerService.fetchTokensMetadata.mockResolvedValue(Result.withContent(missingMetadata));

    const result = await useCase.execute('0x123', ['0x1', '0x2']);

    expect(result.isFailure).toBe(false);
    expect(result.content).toEqual([...storedMetadata, ...missingMetadata]);
  });

  it('should return failure if metadata repository find fails', async () => {
    const error = new Error('DB error');
    mockMetadataRepository.find.mockResolvedValue(Result.withFailure(error));
    mockExplorerService.fetchTokensMetadata.mockResolvedValue(Result.withFailure(error));

    const result = await useCase.execute('0x123', ['0x1', '0x2']);

    expect(result.isFailure).toBe(true);
    expect(result.failure.error).toEqual(error);
  });

  it('should log error if storing fetched metadata fails', async () => {
    const missingMetadata = [new TokenMetadata('0x2', 'Token2', 'T2', 'http://example.com/logo2.png', 18)];
    const storeError = new Error('Store error');

    mockMetadataRepository.find.mockResolvedValue(Result.withContent([]));
    mockExplorerService.fetchTokensMetadata.mockResolvedValue(Result.withContent(missingMetadata));
    mockMetadataRepository.add.mockResolvedValue(Result.withFailure(storeError));

    const result = await useCase.execute('0x123', ['0x2']);

    expect(result.isFailure).toBe(false);
    expect(result.content).toEqual(missingMetadata);
    expect(mockLogger.error).toHaveBeenCalledWith(storeError);
  });
});
