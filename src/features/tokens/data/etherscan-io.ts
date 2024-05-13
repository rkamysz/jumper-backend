import { Result } from '@soapjs/soap';
import axios from 'axios';

import { EthereumExplorerService } from '../domain/ethereum-explorer.service';
import { Token } from '../domain/token';
import { EtherscanIOMapper } from './etherscan-io-mapper';
import {
  EtherscanFetchAccountBalanceResponse,
  EtherscanListTokensOptions,
  EtherscanListTokensResponse,
  EtherscanTokenDto,
} from './token.dto';

export type EtherscanIOConfig = {
  apikey: string;
  listTokensOffset: number;
};

export class EtherscanIO implements EthereumExplorerService {
  private host = 'https://api.etherscan.io';

  constructor(private config: EtherscanIOConfig) {}

  async fetchAccountBalance(address: string, contractaddress: string): Promise<Result<number>> {
    const action = 'tokenbalance';
    const module = 'account';
    const apikey = this.config.apikey;
    const url = `${this.host}/api?module=${module}&action=${action}&address=${address}&contractaddress=${contractaddress}&apikey=${apikey}`;

    try {
      const response = await axios.get<EtherscanFetchAccountBalanceResponse>(url);
      if (
        response.data.message === 'NOTOK' ||
        response.data.status === '0' ||
        (response.data.result && isNaN(+response.data.result))
      ) {
        return Result.withFailure(new Error(response.data.result));
      }
      const balance = response.data.result;
      return Result.withContent(+balance);
      //
    } catch (error) {
      return Result.withFailure(error as Error);
    }
  }

  async listTokens(address: string, options?: EtherscanListTokensOptions): Promise<Result<Token[]>> {
    const action = 'tokentx';
    const module = 'account';
    const apikey = this.config.apikey;
    const sort = options?.sort || 'asc';
    const page = options?.page || 1;
    const offset = options?.offset || this.config.listTokensOffset;
    const url = `${this.host}/api?module=${module}&action=${action}&address=${address}&sort=${sort}&page=${page}&offset=${offset}&apikey=${apikey}`;

    try {
      const response = await axios.get<EtherscanListTokensResponse>(url);
      if (
        response.data.message === 'NOTOK' ||
        response.data.status === '0' ||
        typeof response.data.result === 'string'
      ) {
        const message = typeof response.data.result === 'string' ? response.data.result : 'Error';
        return Result.withFailure(new Error(message));
      }
      const tokens = response.data.result.map((dto: EtherscanTokenDto) => EtherscanIOMapper.fromTokensListItem(dto));
      return Result.withContent(tokens);
      //
    } catch (error) {
      return Result.withFailure(error as Error);
    }
  }
}
