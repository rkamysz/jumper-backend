export class Account {
  constructor(
    public readonly address: string,
    public readonly name: string | null,
    public readonly id?: string
  ) {}
}
