/**
 * Class representing a token with its metadata and balance.
 */
export class Token {
  /**
   * Creates an instance of Token.
   *
   * @param {string} contractAddress - The contract address of the token.
   * @param {string | null} name - The name of the token, can be null.
   * @param {string | null} symbol - The symbol of the token, can be null.
   * @param {string | null} logo - The URL of the token's logo, can be null.
   * @param {number} decimals - The number of decimals for the token.
   * @param {number} balance - The balance of the token.
   */
  constructor(
    public readonly contractAddress: string,
    public readonly name: string | null,
    public readonly symbol: string | null,
    public readonly logo: string | null,
    public readonly decimals: number,
    public readonly balance: number
  ) {}
}
