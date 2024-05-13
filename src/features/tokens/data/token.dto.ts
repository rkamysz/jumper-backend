export type EtherscanTokenDto = {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  from: string;
  contractAddress: string;
  to: string;
  value: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimal: string;
  transactionIndex: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  cumulativeGasUsed: string;
  input: string;
  confirmations: string;
};

export type EtherscanListTokensResponse = {
  status: string;
  message: 'OK' | 'NOTOK';
  result: EtherscanTokenDto[] | string;
};

export type EtherscanListTokensOptions = {
  sort?: 'asc' | 'desc';
  page?: number;
  offset?: number;
  module?: string;
  startblock?: number;
  endblock?: number;
};

export type EtherscanFetchAccountBalanceResponse = {
  status: string;
  message: 'OK' | 'NOTOK';
  result: string;
};
