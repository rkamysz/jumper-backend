export class Token {
  constructor(
    public readonly contractAddress: string,
    public readonly name: string | null,
    public readonly symbol: string | null,
    public readonly logo: string | null,
    public readonly decimals: number,
    public readonly balance: number
  ) {}
}
