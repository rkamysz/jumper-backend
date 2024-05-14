/**
 * Represents an Account entity in the domain layer.
 */
export class Account {
  /**
   * Creates an instance of Account.
   *
   * @param {string} address - The address associated with the account.
   * @param {string | null} name - The name associated with the account, can be null.
   * @param {string} [id] - Optional. The unique identifier for the account.
   */
  constructor(
    public readonly address: string,
    public readonly name: string | null,
    public readonly id?: string
  ) {}
}
