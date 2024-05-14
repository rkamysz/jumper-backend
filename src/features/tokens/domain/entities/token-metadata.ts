/**
 * Class representing the metadata of a token.
 */
export class TokenMetadata {
  /**
   * Creates an instance of TokenMetadata.
   *
   * @param {string} contractAddress - The contract address of the token.
   * @param {string | null} name - The name of the token, can be null.
   * @param {string | null} symbol - The symbol of the token, can be null.
   * @param {string | null} logo - The URL of the token's logo, can be null.
   * @param {number | null} decimals - The number of decimals for the token, can be null.
   * @param {string} [id] - Optional. The unique identifier for the token metadata.
   */
  constructor(
    public readonly contractAddress: string,
    public readonly name: string | null,
    public readonly symbol: string | null,
    public readonly logo: string | null,
    public readonly decimals: number | null,
    public readonly id?: string
  ) {}
}
