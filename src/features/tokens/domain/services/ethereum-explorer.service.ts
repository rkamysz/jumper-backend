import { Result } from '@soapjs/soap';
import { injectable } from 'inversify';

import { TokenBalance } from '../../data/dto/token-metadata.dto';
import { TokenMetadata } from '../entities/token-metadata';

@injectable()
export abstract class EthereumExplorerService {
  public static Token = 'EthereumExplorerService';
  abstract fetchTokenBalances(address: string): Promise<Result<TokenBalance[]>>;
  abstract fetchTokensMetadata(address: string, contracts: string[]): Promise<Result<TokenMetadata[]>>;
}
