import { Token } from '../domain/token';
import { EtherscanTokenDto } from './token.dto';

export class EtherscanIOMapper {
  static fromTokensListItem(dto: EtherscanTokenDto): Token {
    return new Token(
      BigInt(dto.blockNumber),
      +dto.timeStamp,
      dto.hash,
      +dto.nonce,
      dto.blockHash,
      dto.from,
      dto.contractAddress,
      dto.to,
      BigInt(dto.value),
      dto.tokenName,
      dto.tokenSymbol,
      +dto.tokenDecimal,
      +dto.transactionIndex,
      +dto.gas,
      +dto.gasPrice,
      +dto.gasUsed,
      +dto.cumulativeGasUsed,
      dto.input,
      +dto.confirmations
    );
  }
}
