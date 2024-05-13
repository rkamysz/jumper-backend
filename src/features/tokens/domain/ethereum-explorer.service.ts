import { Result } from '@soapjs/soap';

import { AnyObject } from '@/common/types';

export abstract class EthereumExplorerService {
  public static Token = 'EthereumExplorerService';
  abstract listTokens(address: string, options?: AnyObject): Promise<Result<any>>;
}
